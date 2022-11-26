import type { FunctionComponent } from "preact";

export const SongInfo: FunctionComponent<{
  artists: string;
  song: string;
  artistColor: string;
  songColor: string;
  opacity: number;
  transitionTime: number;
}> = ({ artists, song, artistColor, songColor, opacity, transitionTime }) => {
  return (
    <>
      <h1
        className={`text-${artistColor} font-inter text-4xl font-bold`}
        style={{
          opacity,
          transition: `opacity ${transitionTime}ms cubic-bezier(0.77,0,0.18,1)`,
        }}
      >
        {artists}
      </h1>

      <h2
        className={`text-${songColor} whitespace-nowrap break-keep font-inter text-4xl font-semibold`}
        style={{
          opacity,
          transition: `opacity ${transitionTime}ms cubic-bezier(0.77,0,0.18,1)`,
        }}
      >
        {song}
      </h2>
    </>
  );
};
