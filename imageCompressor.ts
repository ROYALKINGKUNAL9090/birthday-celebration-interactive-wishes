export function compressImage(
  file: File,
  callback: (dataUrl: string) => void,
  maxWidth = 400,
  maxHeight = 400
) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const src = event.target?.result as string;
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG at 0.65 quality for compact size (~10KB)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.65);
        callback(dataUrl);
      } else {
        callback(src);
      }
    };

    img.onerror = () => {
      callback(src);
    };

    img.src = src;
  };
  reader.readAsDataURL(file);
}