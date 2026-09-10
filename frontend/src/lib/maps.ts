export function hasMapLocation(
  branch: { lat: number | null; lng: number | null },
): branch is { lat: number; lng: number } {
  return branch.lat != null && branch.lng != null;
}

export function googleMapsViewUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function googleMapsEmbedUrl(lat: number, lng: number, zoom = 16) {
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=ar&z=${zoom}&output=embed`;
}
