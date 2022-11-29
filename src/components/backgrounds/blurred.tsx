import type { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

export const BlurredBackground: FunctionComponent<{
  src: string;
  accentColor: string;
  transitionDuration: number;
}> = ({ src, accentColor, transitionDuration }) => {
  const [newSrc, setNewSrc] = useState("");
  const [oldSrc, setOldSrc] = useState(src);

  const [topOpacity, setTopOpacity] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  useEffect(() => {
    setOldSrc(src);
    setTopOpacity(0);
    setTransitionEnabled(true);

    setTimeout(() => {
      setNewSrc(src);
      setTopOpacity(1);
      setTransitionEnabled(false);
    }, transitionDuration);
  }, [src]);

  return (
    <>
      <div className={`absolute h-full w-full rounded-xl blur-md`}>
        <img
          src={oldSrc}
          className={`absolute -top-4 -left-4 h-[calc(100%+32px)] w-[calc(100%+32px)] max-w-[calc(100%+32px)] bg-white object-cover`}
        />
        <img
          src={newSrc}
          className={`absolute -top-4 -left-4 h-[calc(100%+32px)] w-[calc(100%+32px)] max-w-[calc(100%+32px)] bg-white object-cover`}
          style={{
            transition: transitionEnabled
              ? `opacity ${transitionDuration}ms`
              : "none",
            opacity: topOpacity,
          }}
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
