import { createElementsFromTemplate } from '../utils/templateHelper.js';

export function createLeftColumn() {
  return createElementsFromTemplate(`
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto"></div>`);
}
