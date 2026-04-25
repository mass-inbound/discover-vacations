export function toInternalPolicyUrl(url?: string | null): string {
  if (!url) return '';
  const match = url.match(/\/(?:pages|policies)\/([^/?#]+)/);
  return match ? `/policies/${match[1]}` : url;
}
