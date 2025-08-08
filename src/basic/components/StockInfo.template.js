import { createElementsFromTemplate } from '../utils/templateHelper.js';

export function createStockInfo() {
  return createElementsFromTemplate(`
    <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>`);
}
