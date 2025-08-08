import { createElementsFromTemplate } from '../utils/templateHelper.js';

export function createCartDisplay() {
  return createElementsFromTemplate(`
    <div id="cart-items"></div>`);
}
