import type { FunctionComponent } from "preact";

export const AlbumArtLoader: FunctionComponent<{
  accentColor: string;
}> = ({ accentColor }) => {
  return (
    <div
      className={`h-32 w-32 animate-pulse rounded-xl bg-crust object-cover ring-2 ring-${accentColor}`}
    />
  );
};
