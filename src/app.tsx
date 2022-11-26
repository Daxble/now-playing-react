import { useEffect, useRef, useState } from "preact/hooks";
import { useInterval } from "usehooks-ts";
import { z } from "zod";

import { AlbumArt } from "./components/album-art/album-art";
import { AlbumArtLoader } from "./components/album-art/album-art-loader";

import { BlurredBackground } from "./components/backgrounds/blurred";
import { SolidBackground } from "./components/backgrounds/solid";
import { ConfigErrors } from "./components/configErrors";

import { SongInfo } from "./components/song-info/song-info";
import { SongInfoLoader } from "./components/song-info/song-info-loader";
import { measureText, truncateText } from "./utils/measure";

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

    // alwaysShow: false, How long the overlay takes to slide in
    // alwaysShow: true, How long the overlay takes to change size
    transitionTime: z.number().positive(),

    // How long text takes to fade out
    textFadeTime: z.number().positive(),

    // Animate from the top or bottom of the screen
    animateFrom: z.enum(["top", "bottom"]),

    // Where to place the overlay horizontally
    justify: z.enum(["left", "center", "right"]),

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

    // Try to use the local image Tuna provides
    // Has some issues with https, but useful if running locally
    useLocalFile: z.boolean(),
  })
  .strict();

export function App() {
  const {
    theme = "mocha",
    backgroundStyle = "blur",
    artistColor = "mauve",
    songColor = "text",
    accentColor = "mauve",
    albumColor = "mauve",
    transitionTime = "500",
    animateFrom = "top",
    displayTime = "5000",
    alwaysShow = "false",
    refreshInterval = "1000",
    host = "http://localhost",
    port = "1608",
    useLocalFile = "false",
    justify = "center",
    textFadeTime = "200",
  } = Object.fromEntries(new URLSearchParams(window.location.search));

  const justifyMappings = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  const config = configSchema.safeParse({
    theme,
    artistColor,
    songColor,
    albumColor,
    animateFrom,
    accentColor,
    backgroundStyle,
    alwaysShow: alwaysShow === "true",
    textFadeTime: parseInt(textFadeTime),
    justify,
    host,
    port: parseInt(port),
    refreshInterval: parseInt(refreshInterval),
    transitionTime: parseInt(transitionTime),
    displayTime: parseInt(displayTime),
    useLocalFile: useLocalFile === "true",
  });

  if (!config.success) {
    return <ConfigErrors issues={config.error.issues} />;
  }

  const designValues = {
    baseWidth: 128 + 24 + 32,
    initialWidth: 445,
    maxWidth: window.innerWidth - 32,
    containerHeight: 160,
    maxTextWidth: function () {
      return window.innerWidth - this.baseWidth - 32;
    },
    transitionTo: config.data.alwaysShow
      ? 0
      : config.data.animateFrom === "top"
      ? 192
      : -192,
    transitionTime: `${config.data.transitionTime}ms`,
    displayTime: `${config.data.displayTime}ms`,
    textFadeTime: `${config.data.textFadeTime}ms`,
    initalTextOpacity: !config.data.alwaysShow ? 1 : 0,
    transition: "cubic-bezier(0.77,0,0.18,1)",
  };

  const [coverUrl, setCoverUrl] = useState("");
  const [isShowing, setIsShowing] = useState(false);

  const [songTitle, setSongTitle] = useState("");
  const [songArtists, setSongArtists] = useState<string[]>([]);

  const measurementCanvas = useRef<HTMLCanvasElement>(
    document.createElement("canvas")
  );

  const [containerY, setContainerY] = useState(-designValues.transitionTo);
  const [containerW, setContainerW] = useState(designValues.initialWidth);

  const [textOpacity, setTextOpacity] = useState(
    designValues.initalTextOpacity
  );

  const fetchSongData = async () => {
    if (isShowing) return;

    const { title, artists, cover_url, cover_path } = await (
      await fetch(`${config.data.host}:${config.data.port}`)
    ).json();

    if (title !== songTitle) {
      if (config.data.alwaysShow) {
        setTextOpacity(0);
      }
      setTimeout(() => {
        setSongTitle(title);
        setSongArtists(artists);
        if (config.data.useLocalFile) {
          setCoverUrl(`${cover_url}?${Date.now()}`);
        } else {
          setCoverUrl(cover_path);
        }
        popoutSong();
      }, config.data.textFadeTime);
    }
  };

  const updateContainerWidth = () => {
    if (songTitle && songArtists) {
      const titleWidth = measureText(
        songTitle,
        "2.25rem Inter",
        measurementCanvas.current
      ).width;
      const artistsWidth = measureText(
        songArtists.join(", "),
        "2.25rem Inter",
        measurementCanvas.current
      ).width;

      const width = Math.max(titleWidth, artistsWidth) + designValues.baseWidth;
      const containerWidth = Math.min(width, designValues.maxWidth);

      setContainerW(containerWidth);

      if (config.data.alwaysShow) {
        setTimeout(() => {
          setTextOpacity(1);
        }, config.data.transitionTime);
      }
    }
  };

  useEffect(() => {
    updateContainerWidth();
  }, [songTitle, songArtists]);

  const popoutSong = () => {
    if (!config.data.alwaysShow) {
      setContainerY(0);
      setIsShowing(true);

      setTimeout(() => {
        setTimeout(() => {
          hideSong();
        }, config.data.displayTime);
      }, config.data.transitionTime);
    }
  };

  const hideSong = () => {
    if (!config.data.alwaysShow) {
      setContainerY(-designValues.transitionTo);
      setTimeout(() => {
        setIsShowing(false);
      }, config.data.transitionTime);
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
    <AlbumArt src={coverUrl} accentColor={config.data.albumColor} />
  ) : (
    <AlbumArtLoader accentColor={config.data.albumColor} />
  );

  const songInfo = songTitle ? (
    <SongInfo
      artists={truncateText(
        songArtists.join(", "),
        "2.25rem Inter",
        designValues.maxTextWidth(),
        measurementCanvas.current
      )}
      song={truncateText(
        songTitle,
        "2.25rem Inter",
        designValues.maxTextWidth(),
        measurementCanvas.current
      )}
      artistColor={config.data.artistColor}
      songColor={config.data.songColor}
      opacity={textOpacity}
      transitionTime={config.data.textFadeTime}
    />
  ) : (
    <SongInfoLoader />
  );

  return (
    <>
      <div
        className={`${
          config.data.theme
        } grid h-screen w-screen overflow-hidden ${
          justifyMappings[config.data.justify]
        } ${config.data.animateFrom === "bottom" && "content-end"}`}
      >
        <div
          className={`m-4 origin-center overflow-hidden rounded-xl bg-cover bg-center shadow-md shadow-black`}
          style={{
            transition: `transform ${config.data.transitionTime}ms ${
              designValues.transition
            }${
              config.data.alwaysShow
                ? `, width ${config.data.transitionTime}ms ${designValues.transition}`
                : ""
            }`,
            transform: `translateY(${containerY}px)`,
            width: `${containerW}px`,
            height: `${designValues.containerHeight}px`,
          }}
        >
          {background}
          <div className="flex py-4 pl-4">
            {albumArt}
            <div className="z-20 ml-4 flex h-32 flex-col justify-center align-middle">
              {songInfo}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
