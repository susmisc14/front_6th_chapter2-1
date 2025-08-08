import { createElementsFromTemplate } from '../utils/templateHelper.js';

export function renderPriceLabel(item) {
  if (item.onSale && item.suggestSale) {
    return `<span class="line-through text-gray-400">₩${item.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${item.val.toLocaleString()}</span>`;
  }
  if (item.onSale) {
    return `<span class="line-through text-gray-400">₩${item.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${item.val.toLocaleString()}</span>`;
  }
  if (item.suggestSale) {
    return `<span class="line-through text-gray-400">₩${item.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${item.val.toLocaleString()}</span>`;
  }
  return `₩${item.val.toLocaleString()}`;
}

export function renderNamePrefix(item) {
  return (item.onSale && item.suggestSale) ? '⚡💝' : (item.onSale ? '⚡' : (item.suggestSale ? '💝' : ''));
}

export function createPriceLabelElement(item) {
  if (item.onSale || item.suggestSale) {
    const colorClass = item.onSale && item.suggestSale ? 'text-purple-600' : (item.onSale ? 'text-red-500' : 'text-blue-500');
    return createElementsFromTemplate(`
      <span>
        <span class="line-through text-gray-400">₩${item.originalVal.toLocaleString()}</span>
        <span class="${colorClass}">₩${item.val.toLocaleString()}</span>
      </span>`);
  }
  return createElementsFromTemplate(`<span>₩${item.val.toLocaleString()}</span>`);
}

export function setPriceLabelNode(containerNode, item) {
  while (containerNode.firstChild) containerNode.removeChild(containerNode.firstChild);
  const elements = createPriceLabelElement(item);
  elements.forEach(element => containerNode.appendChild(element));
}

