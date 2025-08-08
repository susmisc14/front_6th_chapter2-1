import { createElementsFromTemplate } from '../utils/templateHelper.js';

export function createAddToCartButton() {
  return createElementsFromTemplate(`
    <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
      Add to Cart
    </button>`);
}
