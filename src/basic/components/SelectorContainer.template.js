import { createElementsFromTemplate } from '../utils/templateHelper.js';

export function createSelectorContainer() {
  return createElementsFromTemplate(`
    <div class="mb-6 pb-6 border-b border-gray-200"></div>`);
}
