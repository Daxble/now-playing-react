import type { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { useInterval } from "usehooks-ts";
import { z } from "zod";

const themeColors = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
  "text",
] as const;

const configSchema = z
  .object({
    // Overall theme of the overlay
    theme: z.enum(["latte", "frappe", "macchiato", "mocha"]),

    // Either blurred background or solid color
    backgroundStyle: z.enum(["blur", "solid"]),

    // Color of the artist text
    artistColor: z.enum(themeColors),

    // Color of the song text
    songColor: z.enum(themeColors),

    // Color to accent the background with
    accentColor: z.enum(themeColors),

    // Color of the ring around the album art
    albumColor: z.enum(themeColors),

    // How long it takes for the overlay to slide in
    transitionTime: z.number().positive(),

    // Animate from the top or bottom of the screen
    animateFrom: z.enum(["top", "bottom"]),

    // How long the overlay stays on screen after transitioning in
    displayTime: z.number().positive(),

    // Disable animations and always show the overlay
    alwaysShow: z.boolean(),

    // How often to check for new song data
    refreshInterval: z.number().positive(),

    // Change your tuna host
    host: z.string().url(),

    // Change your tuna port
    port: z.number().positive(),
  })
  .strict();

// Song Info Components
const SongInfo: FunctionComponent<{
  artist: string[];
  song: string;
  artistColor: string;
  songColor: string;
}> = ({ artist, song, artistColor, songColor }) => {
  return (
    <>
      <h1
        className={`text-${artistColor} font-inter text-4xl font-bold line-clamp-1`}
      >
        {artist.join(", ")}
      </h1>

      <h2
        className={`text-${songColor} overflow-auto pb-[1px] font-inter text-4xl font-semibold line-clamp-1`}
      >
        {song}
      </h2>
    </>
  );
};

const SongInfoLoader = () => {
  return (
    <>
      <div className="mb-2 h-10 w-48 animate-pulse rounded-lg bg-crust" />
      <div className="h-10 w-64 animate-pulse rounded-lg bg-crust" />
    </>
  );
};

// Background Components
const BlurredBackground: FunctionComponent<{
  src: string;
  accentColor: string;
}> = ({ src, accentColor }) => {
  return (
    <>
      <div className={`absolute h-full w-full rounded-xl blur-md`}>
        <img
          src={src}
          className={`absolute top-[-16px] left-[-16px] h-[calc(100%+32px)] w-[calc(100%+32px)] max-w-[calc(100%+32px)] object-cover`}
        />
        <div
          className={`absolute top-[-16px] left-[-16px] z-20 h-[calc(100%+32px)] w-[calc(100%+32px)] max-w-[calc(100%+32px)] bg-base opacity-70`}
        />
        <div
          className={`absolute z-30 h-full w-full ring-8 ring-inset ring-${accentColor} blur-lg`}
        ></div>
      </div>
    </>
  );
};

const SolidBackground = () => {
  return <div className={`absolute z-20 h-full w-full rounded-xl bg-base`} />;
};

export function App() {
  const [songTitle, setSongTitle] = useState("");
  const [songArtists, setSongArtists] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState("");
  const [isShowing, setIsShowing] = useState(false);

  const {
    theme = "mocha",
    backgroundStyle = "blur",
    artistColor = "mauve",
    songColor = "text",
    accentColor = "mauve",
    albumColor = "mauve",
    transitionTime = "1",
    animateFrom = "top",
    displayTime = "5",
    alwaysShow = "false",
    refreshInterval = "1000",
    host = "http://localhost",
    port = "1608",
  } = Object.fromEntries(new URLSearchParams(window.location.search));

  const config = configSchema.safeParse({
    theme,
    artistColor,
    songColor,
    albumColor,
    host,
    port: parseInt(port),
    refreshInterval: parseInt(refreshInterval),
    transitionTime: parseInt(transitionTime),
    displayTime: parseInt(displayTime),
    backgroundStyle,
    alwaysShow: alwaysShow === "true",
    animateFrom,
    accentColor,
  });

  if (!config.success) {
    return (
      <div className="mocha flex h-screen flex-col items-center justify-center">
        <div className="rounded-md bg-crust p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-mauve">
                There are {config.error.issues.length} error(s) with your
                configuration
              </h3>
              <div className="mt-2 text-sm text-text">
                <ul role="list" className="list-disc pl-5">
                  {config.error.issues.map((error) => (
                    <li>
                      <p className={"font-bold"}>{error.path}</p>
                      <p>{error.message}</p>
                      <br />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const height = config.data.alwaysShow
    ? 0
    : config.data.animateFrom === "top"
    ? 192
    : -192; // Card Height: 160px + 32px Padding
  const [containerY, setContainerY] = useState(-height);

  const fetchSongData = async () => {
    // Don't fetch while the card is showing
    if (isShowing) return;

    // Use Fetch to grab song info from Tuna
    const { title, artists, cover_url } = await (
      await fetch(`${config.data.host}:${config.data.port}`)
    ).json();

    // Update the state with the new song info
    if (title !== songTitle) {
      setSongTitle(title);
      setSongArtists(artists);
      // Append current date to bust local image cache
      setCoverUrl(`${cover_url}?${Date.now()}`);
      popoutSong();
    }
  };

  const popoutSong = () => {
    if (!config.data.alwaysShow) {
      setContainerY(0);
      setIsShowing(true);

      setTimeout(() => {
        setTimeout(() => {
          hideSong();
        }, config.data.displayTime * 1000);
      }, config.data.transitionTime * 1000);
    }
  };

  const hideSong = () => {
    if (!config.data.alwaysShow) {
      setContainerY(-height);
      setTimeout(() => {
        setIsShowing(false);
      }, config.data.transitionTime * 1000);
    }
  };

  useInterval(() => {
    fetchSongData();
  }, config.data.refreshInterval);

  const background =
    config.data.backgroundStyle === "blur" ? (
      <BlurredBackground src={coverUrl} accentColor={config.data.accentColor} />
    ) : (
      <SolidBackground />
    );

  const albumArt = coverUrl ? (
    <img
      src={coverUrl}
      className={`h-32 w-32 rounded-xl object-cover ring-2 ring-${config.data.albumColor} z-30`}
    />
  ) : (
    <div
      className={`h-32 w-32 animate-pulse rounded-xl bg-crust object-cover ring-2 ring-${config.data.albumColor} z-30`}
    />
  );

  const songInfo = songTitle ? (
    <SongInfo
      artist={songArtists}
      song={songTitle}
      artistColor={config.data.artistColor}
      songColor={config.data.songColor}
    />
  ) : (
    <SongInfoLoader />
  );

  return (
    <>
      <div
        className={`${config.data.theme} grid h-screen w-screen ${
          config.data.animateFrom === "bottom" && "content-end"
        } justify-center overflow-hidden`}
      >
        <div
          className={`m-4 h-[160px] overflow-hidden rounded-xl bg-cover bg-center shadow-md shadow-black`}
          style={{
            transform: `translateY(${containerY}px)`,
            transition: `transform ${config.data.transitionTime}s cubic-bezier(0.77,0,0.18,1)`,
          }}
        >
          {background}
          <div className="flex p-4">
            {albumArt}
            <div className="z-30 ml-4 flex h-32 flex-col justify-center align-middle">
              {songInfo}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
