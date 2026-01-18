let canvas: HTMLCanvasElement | null = null;

export function measureTextWidth(text: string, font = '10px system-ui'): number {
  if (!canvas) {
    canvas = document.createElement('canvas');
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;
  ctx.font = font;
  return ctx.measureText(text).width;
}

export function getMaxTextWidth(texts: string[], font?: string): number {
  return Math.max(...texts.map(t => measureTextWidth(t, font)));
}
