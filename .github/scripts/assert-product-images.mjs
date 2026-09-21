import fs from 'node:fs/promises';
import path from 'node:path';
import { isUsableProductItem } from './product-image.mjs';

const repo = process.cwd();
const productsPath = path.join(repo, 'data', 'products.json');
const products = JSON.parse(await fs.readFile(productsPath, 'utf8'));

if (!Array.isArray(products) || products.length === 0) {
  console.error('products.json에 상품이 없습니다.');
  process.exit(1);
}

const bad = [];
for (const item of products) {
  if (!(await isUsableProductItem(repo, item))) bad.push(item.id);
}

if (bad.length) {
  console.error(`이미지 없는 상품 ${bad.length}개 / 전체 ${products.length}개: ${bad.join(', ')}`);
  process.exit(1);
}

console.log(`OK: 상품 ${products.length}개 모두 실제 사진이 있습니다.`);
