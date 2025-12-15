export async function fileToCompressedWebP(
  file: File,
  opts?: { maxLongSide?: number; quality?: number }
): Promise<{ blob: Blob; width: number; height: number; mime: string }> {
  const maxLongSide = opts?.maxLongSide ?? 1600;
  const quality = opts?.quality ?? 0.82;

  const bitmap = await createImageBitmap(file);
  const srcW = bitmap.width;
  const srcH = bitmap.height;

  const longSide = Math.max(srcW, srcH);
  const scale = Math.min(1, maxLongSide / longSide);

  const w = Math.max(1, Math.round(srcW * scale));
  const h = Math.max(1, Math.round(srcH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, w, h);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to encode image"))),
      "image/webp",
      quality
    );
  });

  return { blob, width: w, height: h, mime: "image/webp" };
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  // dataURL -> Blob (fetch가 가장 간단하고 안전)
  const res = await fetch(dataUrl);
  return await res.blob();
}
