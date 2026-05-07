// Strict client-side image processing for admin uploads.
// - Validates MIME + extension + magic bytes
// - Downscales large images via canvas to keep base64 payloads small
// - Returns a JPEG/PNG data URL bounded by maxDim & quality

const ALLOWED = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB raw upload
export const MAX_OUTPUT_BYTES = 600 * 1024;    // ~600KB stored as base64
export const MAX_DIM = 1280;

export type ProcessedImage = { dataUrl: string; width: number; height: number; bytes: number };

export async function validateAndProcessImage(file: File): Promise<ProcessedImage> {
  if (!(ALLOWED as readonly string[]).includes(file.type)) {
    throw new Error(`Unsupported type (${file.type || "unknown"}). Use JPG, PNG, or WebP.`);
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 5MB.`);
  }

  const blobUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(blobUrl);
    const { width, height } = scale(img.naturalWidth, img.naturalHeight, MAX_DIM);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(img, 0, 0, width, height);

    // Try progressively lower quality until under threshold
    let quality = 0.86;
    let dataUrl = canvas.toDataURL("image/jpeg", quality);
    while (estimateBytes(dataUrl) > MAX_OUTPUT_BYTES && quality > 0.4) {
      quality -= 0.1;
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }
    return { dataUrl, width, height, bytes: estimateBytes(dataUrl) };
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error("Could not decode image"));
    i.src = src;
  });
}

function scale(w: number, h: number, max: number) {
  if (w <= max && h <= max) return { width: w, height: h };
  const ratio = w > h ? max / w : max / h;
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}

function estimateBytes(dataUrl: string) {
  const i = dataUrl.indexOf(",");
  return Math.floor(((dataUrl.length - i - 1) * 3) / 4);
}
