// Compatibility copy of the current Sanity upload: smaller H.264 MP4 plus
// a still from the same film. Match the exact asset so future CMS edits win.
const WELCOME_VIDEO = "https://cdn.sanity.io/files/uhgxik10/production/902c4a36f55a07b47b66486c03e7babc666efbd5.mov"

export function getHeroMedia(videoUrl?: string, imageUrl?: string) {
  return {
    videoUrl: videoUrl === WELCOME_VIDEO ? "/assets/welcome-banner.mp4" : videoUrl,
    imageUrl: imageUrl || (videoUrl === WELCOME_VIDEO ? "/assets/welcome-banner-poster.webp" : undefined),
  }
}
