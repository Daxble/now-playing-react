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
  let width;
  let len = text.length;
  while ((width = measureText(text, font, canvas)).width > maxWidth) {
    len--;
    text = text.substring(0, len) + "...";
  }
  return text;
};
