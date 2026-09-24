// Shared between FullscreenImage and ArtworkNav. The nav listens for arrow
// keys on window; while the lightbox is open those keys belong to the
// lightbox, and navigating the router would unmount it.
let open = false

export function setLightboxOpen(value: boolean) {
  open = value
}

export function isLightboxOpen() {
  return open
}
