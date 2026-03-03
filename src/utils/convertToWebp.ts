// src/utils/convertToWebp.ts
export async function convertToWebp(file: File, quality = 0.82): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) return reject(new Error('Conversion failed'));
          const webpFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, '.webp'),
            { type: 'image/webp' }
          );
          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}