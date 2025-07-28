/**
 * 장바구니 관련 헬퍼 함수들
 * DOM 조작과 비즈니스 로직을 분리하여 테스트 가능성 향상
 */
import { $ } from "./$.js";

/**
 * 기존 장바구니 아이템 찾기
 * @param {string} productId - 상품 ID
 * @returns {Element|null} 기존 아이템 요소 또는 null
 */
export function findExistingCartItem(productId) {
  return $(`#${productId}`);
}

/**
 * 기존 아이템 수량 업데이트
 * @param {Element} existingItem - 기존 아이템 요소
 * @param {Object} product - 상품 객체
 * @returns {boolean} 업데이트 성공 여부
 */
export function updateExistingItemQuantity(existingItem, product) {
  const quantityElement = existingItem.querySelector(".quantity-number");
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= product.q + currentQuantity) {
    quantityElement.textContent = newQuantity;
    product.q--;
    return true;
  }

  return false;
}

/**
 * 상품 할인 정보 계산
 * @param {Object} product - 상품 객체
 * @returns {Object} 할인 정보 { discountClass, discountIcon, priceDisplay }
 */
export function calculateProductDiscountInfo(product) {
  const discountClass =
    product.onSale && product.suggestSale
      ? "text-purple-600"
      : product.onSale
        ? "text-red-500"
        : product.suggestSale
          ? "text-blue-500"
          : "";

  const discountIcon =
    product.onSale && product.suggestSale
      ? "⚡💝"
      : product.onSale
        ? "⚡"
        : product.suggestSale
          ? "💝"
          : "";

  const priceDisplay =
    product.onSale || product.suggestSale
      ? `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${discountClass}">₩${product.val.toLocaleString()}</span>`
      : `₩${product.val.toLocaleString()}`;

  return { discountClass, discountIcon, priceDisplay };
}

/**
 * 새 장바구니 아이템 HTML 생성
 * @param {Object} product - 상품 객체
 * @returns {string} HTML 문자열
 */
export function createCartItemHTML(product) {
  const { discountIcon, priceDisplay } = calculateProductDiscountInfo(product);

  return `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${discountIcon}${product.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceDisplay}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
    </div>
  `;
}

/**
 * 새 장바구니 아이템 생성 및 추가
 * @param {Object} product - 상품 객체
 * @param {Element} cartDisplay - 장바구니 표시 요소
 */
export function createAndAddNewCartItem(product, cartDisplay) {
  const newItem = document.createElement("div");
  newItem.id = product.id;
  newItem.className =
    "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";

  newItem.innerHTML = createCartItemHTML(product);
  cartDisplay.appendChild(newItem);
  product.q--;
}

/**
 * 앱 상태 업데이트
 * @param {Object} appState - 앱 상태 객체
 * @param {string} selectedProductId - 선택된 상품 ID
 */
export function updateAppState(appState, selectedProductId) {
  appState.lastSelectedProduct = selectedProductId;
}
