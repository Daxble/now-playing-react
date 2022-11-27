export const measureText = (
  text: string,
  font: string,
  canvas: HTMLCanvasElement
) => {
  const context = canvas.getContext("2d");
  if (context) {
    context.font = font;
    return context.measureText(text);
  }
  return { width: 0, height: 0 };
};

export const truncateText = (
  text: string,
  font: string,
  maxWidth: number,
  canvas: HTMLCanvasElement
) => {
  let len = text.length;
  while (measureText(text, font, canvas).width > maxWidth) {
    len--;
    text = text.substring(0, len) + "...";
  }
  return text;
};

export const retrieveFontValues = (element: HTMLDivElement) => {
  const style = window.getComputedStyle(element);
  const font = [
    style.getPropertyValue("font-style"),
    style.getPropertyValue("font-weight"),
    style.getPropertyValue("font-size"),
    style.getPropertyValue("font-family"),
  ].join(" ");
  return font;
};
