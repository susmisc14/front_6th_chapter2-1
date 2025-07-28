/**
 * 이벤트 핸들러 함수들
 * 사용자 인터랙션 처리, 장바구니 조작 등의 이벤트를 관리
 */
import { calculateCartTotal, renderBonusPoints } from "../cart/cartService.js";
import { updatePricesInCart, updateStockInfo } from "../cart/cartUI.js";
import { findProductById } from "../product/productService.js";
import { updateSelectOptions } from "../product/productUI.js";
import { $ } from "../utils/$.js";
import {
  createAndAddNewCartItem,
  findExistingCartItem,
  updateAppState,
  updateExistingItemQuantity,
} from "../utils/cartHelpers.js";
import { CartError, handleError } from "../utils/errorHandler.js";
import { showAlert } from "../utils/notificationManager.js";
import {
  validateDOMElement,
  validateProductAvailability,
  validateProductSelection,
  validateQuantity,
} from "../utils/validation.js";

/**
 * 장바구니 추가 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleAddToCart(event, productList, appState) {
  const selectedProductId = appState.productSelector.value;

  // 상품 선택 유효성 검사
  const selectionValidation = validateProductSelection(selectedProductId);
  if (!selectionValidation.isValid) {
    handleError(selectionValidation.error);
    return;
  }

  const product = findProductById(productList, selectedProductId);

  // 상품 가용성 검사
  const availabilityValidation = validateProductAvailability(product);
  if (!availabilityValidation.isValid) {
    handleError(availabilityValidation.error);
    return;
  }

  // 기존 아이템 처리 또는 새 아이템 추가
  const existingItem = findExistingCartItem(product.id);

  if (existingItem) {
    const updateSuccess = updateExistingItemQuantity(existingItem, product);
    if (!updateSuccess) {
      handleError(new CartError("재고가 부족합니다.", "INSUFFICIENT_STOCK"));
      return;
    }
  } else {
    createAndAddNewCartItem(product, appState.cartDisplay);
  }

  // 앱 상태 업데이트 및 장바구니 재계산
  updateAppState(appState, selectedProductId);
  handleCalculateCartStuff(productList, appState);
}

/**
 * 장바구니 아이템 액션 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleCartItemAction(event, productList, appState) {
  const target = event.target;

  if (target.classList.contains("quantity-change")) {
    handleQuantityChange(target, productList, appState);
  } else if (target.classList.contains("remove-item")) {
    handleItemRemove(target, productList, appState);
  }
}

/**
 * 수량 변경 이벤트 핸들러
 * @param {HTMLElement} target - 클릭된 요소
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleQuantityChange(target, productList, appState) {
  const productId = target.dataset.productId;
  const change = parseInt(target.dataset.change);
  const itemElement = $(`#${productId}`);
  const product = findProductById(productList, productId);

  if (!itemElement || !product) return;

  const quantityElement = itemElement.querySelector(".quantity-number");
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + change;

  if (newQuantity > 0 && newQuantity <= product.q + currentQuantity) {
    quantityElement.textContent = newQuantity;
    product.q -= change;
  } else if (newQuantity <= 0) {
    // 수량이 0이 되면 아이템 제거
    product.q += currentQuantity;
    itemElement.remove();
  } else {
    showAlert("재고가 부족합니다.");
    return;
  }

  handleCalculateCartStuff(productList, appState);
  updateSelectOptions(appState.productSelector, productList);
}

/**
 * 아이템 제거 이벤트 핸들러
 * @param {HTMLElement} target - 클릭된 요소
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleItemRemove(target, productList, appState) {
  const productId = target.dataset.productId;
  const itemElement = $(`#${productId}`);
  const product = findProductById(productList, productId);

  if (!itemElement || !product) return;

  const quantityElement = itemElement.querySelector(".quantity-number");
  const removedQuantity = parseInt(quantityElement.textContent);

  product.q += removedQuantity;
  itemElement.remove();

  handleCalculateCartStuff(productList, appState);
  updateSelectOptions(appState.productSelector, productList);
}

/**
 * 장바구니 계산 및 UI 업데이트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
function handleCalculateCartStuff(productList, appState) {
  const cartItems = appState.cartDisplay.children;
  const result = calculateCartTotal(Array.from(cartItems), productList, appState);

  // 앱 상태 업데이트
  appState.totalAmount = result.totalAmount;
  appState.itemCount = result.itemCount;

  // UI 업데이트
  updateCartUI(result, appState);
  renderBonusPoints(Array.from(cartItems), productList, appState, result.totalAmount);
  updateStockInfo(productList);
}

/**
 * 장바구니 UI 업데이트
 * @param {Object} result - 계산 결과
 * @param {Object} appState - 앱 상태
 */
function updateCartUI(result, appState) {
  // 아이템 수 표시 업데이트
  const itemCountElement = $("#item-count");
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${result.itemCount} items in cart`;
  }

  // 총액 표시 업데이트
  const totalDiv = appState.sumElement?.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = "₩" + result.totalAmount.toLocaleString();
  }

  // 주문 요약 업데이트
  updateOrderSummary(result, appState);

  // 화요일 특별 할인 표시
  const tuesdaySpecial = $("#tuesday-special");
  if (tuesdaySpecial) {
    if (result.isTuesday) {
      tuesdaySpecial.classList.remove("hidden");
      tuesdaySpecial.innerHTML = `
        <div class="bg-purple-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-purple-400">화요일 특별 할인</span>
            <span class="text-sm font-medium text-purple-400">-10%</span>
          </div>
          <div class="text-2xs text-gray-300">화요일에만 적용되는 추가 할인!</div>
        </div>
      `;
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  }
}

/**
 * 주문 요약 업데이트
 * @param {Object} result - 계산 결과
 * @param {Object} appState - 앱 상태
 */
function updateOrderSummary(result, appState) {
  const summaryDetails = $("#summary-details");
  const discountInfo = $("#discount-info");

  if (!summaryDetails || !discountInfo) return;

  // 주문 요약 내용 업데이트
  summaryDetails.innerHTML = `
    <div class="flex justify-between text-sm tracking-wide">
      <span>Items</span>
      <span>${result.itemCount}</span>
    </div>
  `;

  // 구분선
  summaryDetails.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${result.subtotal.toLocaleString()}</span>
    </div>
  `;

  // 할인 정보 표시
  if (result.itemCount >= 30) {
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span class="text-xs">-25%</span>
      </div>
    `;
  } else if (result.itemDiscounts.length > 0) {
    result.itemDiscounts.forEach((item) => {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (10개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  if (result.isTuesday) {
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-10%</span>
      </div>
    `;
  }

  summaryDetails.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;

  // 할인 정보 표시
  if (result.discountRate > 0 && result.totalAmount > 0) {
    const savedAmount = result.subtotal - result.totalAmount;
    discountInfo.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(result.discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  } else {
    discountInfo.innerHTML = "";
  }
}

/**
 * 이벤트 리스너 설정
 * @param {HTMLElement} addToCartButton - 장바구니 추가 버튼
 * @param {HTMLElement} cartDisplay - 장바구니 표시 영역
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function setupEventListeners(addToCartButton, cartDisplay, productList, appState) {
  // 장바구니 추가 버튼 이벤트
  addToCartButton.addEventListener("click", (event) => {
    handleAddToCart(event, productList, appState);
  });

  // 장바구니 아이템 액션 이벤트
  cartDisplay.addEventListener("click", (event) => {
    handleCartItemAction(event, productList, appState);
  });

  // 도움말 모달 이벤트
  const manualToggle = $(".fixed.top-4.right-4");
  const manualOverlay = $(".fixed.inset-0");
  const manualColumn = $(".fixed.right-0.top-0");

  if (manualToggle && manualOverlay && manualColumn) {
    manualToggle.onclick = function () {
      manualOverlay.classList.toggle("hidden");
      manualColumn.classList.toggle("translate-x-full");
    };

    manualOverlay.onclick = function (e) {
      if (e.target === manualOverlay) {
        manualOverlay.classList.add("hidden");
        manualColumn.classList.add("translate-x-full");
      }
    };
  }
}
