import { createElementsFromTemplate } from '../utils/templateHelper.js';

export function renderProductSelectOptions(products) {
  let html = '';
  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    let discountText = '';
    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';
    if (item.q === 0) {
      html += `<option value="${item.id}" disabled class="text-gray-400">${item.name} - ${item.val}원 (품절)${discountText}</option>`;
    } else if (item.onSale && item.suggestSale) {
      html += `<option value="${item.id}" class="text-purple-600 font-bold">⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)</option>`;
    } else if (item.onSale) {
      html += `<option value="${item.id}" class="text-red-500 font-bold">⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)</option>`;
    } else if (item.suggestSale) {
      html += `<option value="${item.id}" class="text-blue-500 font-bold">💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)</option>`;
    } else {
      html += `<option value="${item.id}">${item.name} - ${item.val}원${discountText}</option>`;
    }
  }
  return html;
}

export function createProductSelectElement(products) {
  return createElementsFromTemplate(`
    <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
      ${renderProductSelectOptions(products)}
    </select>`);
}

export function createProductSelectorElement() {
  return createElementsFromTemplate(`
    <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
    </select>`);
}


