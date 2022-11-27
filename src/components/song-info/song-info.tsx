import type { FunctionComponent, Ref, RefObject } from "preact";
import { retrieveFontValues, truncateText } from "../../utils/text";

export const SongInfo: FunctionComponent<{
  artists: string;
  song: string;
  artistColor: string;
  songColor: string;
  opacity: number;
  transitionTime: number;
  transition: string;
  songRef: RefObject<HTMLDivElement>;
  artistRef: RefObject<HTMLDivElement>;
}> = ({
  artists,
  song,
  artistColor,
  songColor,
  opacity,
  transitionTime,
  transition,
  songRef,
  artistRef,
}) => {
  return (
    <>
      <h1
        className={`text-${artistColor} whitespace-nowrap break-keep text-4xl font-bold`}
        style={{
          opacity,
          transition: `opacity ${transitionTime}ms ${transition}`,
        }}
        ref={artistRef}
      >
        {artists}
      </h1>

      <h2
        className={`text-${songColor} whitespace-nowrap break-keep text-4xl font-semibold`}
        style={{
          opacity,
          transition: `opacity ${transitionTime}ms ${transition}`,
        }}
        ref={songRef}
      >
        {song}
      </h2>
    </>
  );
};
