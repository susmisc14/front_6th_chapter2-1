import { createElementsFromTemplate } from '../utils/templateHelper.js';

export function createHelpModalOverlay() {
  return createElementsFromTemplate(`
    <div class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300"></div>`);
}
