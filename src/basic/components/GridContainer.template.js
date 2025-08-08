import { createElementsFromTemplate } from '../utils/templateHelper.js';

export function createGridContainer() {
  return createElementsFromTemplate(`
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden"></div>`);
}
