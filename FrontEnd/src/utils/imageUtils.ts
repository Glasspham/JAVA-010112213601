/**
 * Utility functions for handling images and media
 */

const DEFAULT_IMAGE_URL = `${process.env.REACT_APP_API_URL}/default_no_image.png`;

/**
 * Get image URL with fallback to default image
 * @param imagePath - The image path from API
 * @returns Full image URL with fallback
 */
export const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) {
    return DEFAULT_IMAGE_URL;
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${process.env.REACT_APP_API_URL}/${imagePath}`;
};

/**
 * Get avatar URL with fallback to default image (consistent with other pages)
 * @param avatar - The avatar path from API
 * @returns Full avatar URL with fallback
 */
export const getAvatarUrl = (avatar?: string): string => {
  if (!avatar || avatar === "default_no_image.png") {
    return DEFAULT_IMAGE_URL;
  }
  if (avatar.startsWith("http")) {
    return avatar;
  }
  return `${process.env.REACT_APP_API_URL}/${avatar}`;
};

/**
 * Handle image load error by setting fallback image
 * @param event - The error event
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== DEFAULT_IMAGE_URL) {
    target.src = DEFAULT_IMAGE_URL;
  }
};

/**
 * Handle video load error by replacing with fallback image
 * @param event - The error event
 */
export const handleVideoError = (event: React.SyntheticEvent<HTMLVideoElement>) => {
  const target = event.target as HTMLVideoElement;
  const img = document.createElement("img");
  img.src = DEFAULT_IMAGE_URL;
  img.style.width = target.style.width || "120px";
  img.style.height = target.style.height || "80px";
  img.style.objectFit = "cover";
  img.style.borderRadius = target.style.borderRadius || "8px";
  img.style.border = target.style.border || "1px solid #ddd";
  img.alt = "Video không khả dụng";

  if (target.parentNode) {
    target.parentNode.replaceChild(img, target);
  }
};

const imageUtils = {
  getImageUrl,
  getAvatarUrl,
  handleImageError,
  handleVideoError,
  DEFAULT_IMAGE_URL,
};

export default imageUtils;
