import type { FunctionComponent } from "preact";

export const BlurredBackground: FunctionComponent<{
  src: string;
  accentColor: string;
}> = ({ src, accentColor }) => {
  return (
    <>
      <div className={`absolute h-full w-full rounded-xl blur-md`}>
        <img
          src={src}
          className={`absolute -top-4 -left-4 h-[calc(100%+32px)] w-[calc(100%+32px)] max-w-[calc(100%+32px)] object-cover`}
        />
        <div
          className={`absolute -top-4 -left-4 h-[calc(100%+32px)] w-[calc(100%+32px)] max-w-[calc(100%+32px)] bg-base opacity-75`}
        />
        <div
          className={`absolute h-full w-full ring-8 ring-inset ring-${accentColor} blur-lg`}
        />
      </div>
    </>
  );
};
