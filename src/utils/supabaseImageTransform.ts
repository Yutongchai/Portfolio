/**
 * Converts a Supabase storage public URL into a transformed (resized/compressed)
 * version using Supabase's Image Transform API.
 *
 * Requires a Supabase project on the Pro plan or above.
 * On free-tier projects the /render/image/ endpoint still works for basic resizing.
 *
 * @param url     Full Supabase storage URL  (/storage/v1/object/public/…)
 * @param width   Target pixel width (default 360 = 2× retina for 180 px slots)
 * @param quality JPEG/WebP quality 1–100 (default 75)
 */
export function toSupabaseThumbnail(
  url: string,
  width = 360,
  quality = 75
): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    // Only transform Supabase storage URLs
    if (!u.hostname.endsWith('.supabase.co')) return url;
    // Swap /object/public/ → /render/image/public/ for the transform API
    const transformed = url.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    const sep = transformed.includes('?') ? '&' : '?';
    return `${transformed}${sep}width=${width}&quality=${quality}&resize=contain`;
  } catch {
    return url;
  }
}
