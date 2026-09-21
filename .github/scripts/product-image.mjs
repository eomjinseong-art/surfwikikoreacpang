import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const MIN_IMAGE_BYTES = 2000;
const PLACEHOLDER_SHA256 = new Set([
  // Naver default profile silhouette (saved as product-056.jpg)
  'bda5c1021eb0f39e5bb15c964b1a54677040a27379acb44a95ee42fd3bea0a17'
]);

export function imageKind(buf) {
  if (!buf || buf.length < 12) return '';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return 'gif';
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46
    && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'webp';
  return '';
}

export function jpegDimensions(buf) {
  if (imageKind(buf) !== 'jpeg') return null;
  let i = 2;
  while (i < buf.length - 8) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    if (marker === 0x00) {
      i += 1;
      continue;
    }
    const seglen = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    }
    if (seglen < 2) break;
    i += 2 + seglen;
  }
  return null;
}

export function isPlaceholderImage(buf) {
  if (!buf || buf.length < MIN_IMAGE_BYTES) return true;
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  if (PLACEHOLDER_SHA256.has(sha)) return true;
  if (imageKind(buf) === 'jpeg' && buf.length < 8000) {
    const dims = jpegDimensions(buf);
    if (dims && dims.width === 320 && dims.height === 320) return true;
  }
  return false;
}

export function isUsableImageBuffer(buf) {
  return Boolean(imageKind(buf)) && !isPlaceholderImage(buf);
}

export async function isUsableImageFile(filePath) {
  try {
    return isUsableImageBuffer(await fs.readFile(filePath));
  } catch {
    return false;
  }
}

export function productJpgPath(repo, id) {
  return path.join(repo, 'images', 'products', `product-${String(id).padStart(3, '0')}.jpg`);
}

export function localPathFromImageUrl(repo, imageUrl) {
  const url = String(imageUrl || '').trim();
  if (!url || /^https?:\/\//i.test(url) || url.startsWith('//')) return '';
  return path.join(repo, url.replace(/^\.\//, ''));
}

export async function isUsableProductItem(repo, item) {
  const url = item?.product?.imageUrl || '';
  if (!url || /\.svg$/i.test(url)) return false;
  const fromUrl = localPathFromImageUrl(repo, url);
  if (fromUrl && await isUsableImageFile(fromUrl)) return true;
  if (item?.id) return isUsableImageFile(productJpgPath(repo, item.id));
  return false;
}
