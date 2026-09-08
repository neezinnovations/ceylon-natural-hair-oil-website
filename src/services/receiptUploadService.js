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

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  const data = await response.json();
  if (!response.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Receipt upload failed.");
  }

  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
  };
}
