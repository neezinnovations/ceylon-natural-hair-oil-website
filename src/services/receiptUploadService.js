import { safeReceiptUrl } from "../utils/errors";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function uploadReceipt(file) {
  if (!file) throw new Error("Please choose a receipt image.");
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Receipt must be JPG, PNG or WEBP.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Receipt must be smaller than 5 MB.");
  }

  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: form, signal: controller.signal }
    );

    const data = await response.json().catch(() => null);
    if (!response.ok || !safeReceiptUrl(data?.secure_url)) {
      throw new Error("Receipt upload failed. Please try again.");
    }

    return {
      secureUrl: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Receipt upload timed out. Please try again.");
    throw new Error("Unable to upload the receipt. Check your connection and try again.");
  } finally {
    clearTimeout(timeout);
  }
}
