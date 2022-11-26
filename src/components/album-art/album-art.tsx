import type { FunctionComponent } from "preact";

export const AlbumArt: FunctionComponent<{
  src: string;
  accentColor: string;
}> = ({ src, accentColor }) => {
  return (
    <img
      src={src}
      className={`z-20 h-32 w-32 rounded-xl object-cover ring-2 ring-${accentColor}`}
    />
  );
};
