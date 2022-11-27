import type { FunctionComponent } from "preact";

export const SongInfo: FunctionComponent<{
  artists: string;
  song: string;
  artistColor: string;
  songColor: string;
  opacity: number;
  transitionTime: number;
  transition: string;
}> = ({
  artists,
  song,
  artistColor,
  songColor,
  opacity,
  transitionTime,
  transition,
}) => {
  return (
    <>
      <h1
        className={`text-${artistColor} font-inter text-4xl font-bold`}
        style={{
          opacity,
          transition: `opacity ${transitionTime}ms ${transition}`,
        }}
      >
        {artists}
      </h1>

      <h2
        className={`text-${songColor} whitespace-nowrap break-keep font-inter text-4xl font-semibold`}
        style={{
          opacity,
          transition: `opacity ${transitionTime}ms ${transition}`,
        }}
      >
        {song}
      </h2>
    </>
  );
};
