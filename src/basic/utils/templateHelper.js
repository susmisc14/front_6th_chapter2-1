export function createElementsFromTemplate(htmlTemplate) {
  const fragment = process.env.NODE_ENV === 'test' ? document.createElement('div') : document.createDocumentFragment();
  fragment.innerHTML = htmlTemplate;
  return Array.from(fragment.children);
}
