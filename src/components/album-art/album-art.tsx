import type { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

export const AlbumArt: FunctionComponent<{
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
    <div
      className={`relative z-20 h-32 w-32 min-w-[8rem] rounded-xl object-cover ring-2 ring-${accentColor} overflow-hidden`}
    >
      <img src={oldSrc} className="absolute h-32 w-32" />
      <img
        src={newSrc}
        className="absolute h-32 w-32"
        style={{
          transition: transitionEnabled
            ? `opacity ${transitionDuration}ms`
            : "none",
          opacity: topOpacity,
        }}
      />
    </div>
  );
};
