/**
 * 이벤트 핸들러 함수들
 * 사용자 인터랙션 처리, 장바구니 조작 등의 이벤트를 관리
 * 성능 최적화를 위한 캐시 관리 포함
 */
import { calculateCartTotal, renderBonusPoints } from "../cart/cartService.js";
import { updatePricesInCart, updateStockInfo } from "../cart/cartUI.js";
import { findProductById } from "../product/productService.js";
import { updateSelectOptions } from "../product/productUI.js";
import { $, clearSelectorCache } from "../utils/$.js";
import { clearCalculationCache } from "../utils/businessLogic.js";
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
 * 상품 검증 및 찾기
 * @param {string} selectedProductId - 선택된 상품 ID
 * @param {Array} productList - 상품 목록
 * @returns {Object} { product, isValid, error }
 */
const validateAndFindProduct = (selectedProductId, productList) => {
  // 상품 선택 유효성 검사
  const selectionValidation = validateProductSelection(selectedProductId);
  if (!selectionValidation.isValid) {
    return { product: null, isValid: false, error: selectionValidation.error };
  }

  const product = findProductById(productList, selectedProductId);

  // 상품 가용성 검사
  const availabilityValidation = validateProductAvailability(product);
  if (!availabilityValidation.isValid) {
    return { product: null, isValid: false, error: availabilityValidation.error };
  }

  return { product, isValid: true, error: null };
};

/**
 * 캐시 무효화 및 UI 업데이트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
const invalidateCachesAndUpdateUI = (productList, appState) => {
  // 계산 캐시 무효화
  clearCalculationCache();

  // 셀렉터 캐시 무효화 (DOM 변경 가능성)
  clearSelectorCache();

  // UI 업데이트
  recalculateCartAndUpdateUI(productList, appState);
};

/**
 * 장바구니 추가 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleAddToCart(event, productList, appState) {
  const selectedProductId = appState.productSelector.value;

  // 상품 검증 및 찾기
  const { product, isValid, error } = validateAndFindProduct(selectedProductId, productList);
  if (!isValid) {
    handleError(error);
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

  // 앱 상태 업데이트 및 캐시 무효화
  updateAppState(appState, selectedProductId);
  invalidateCachesAndUpdateUI(productList, appState);
}

/**
 * 장바구니 아이템 액션 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleCartItemAction(event, productList, appState) {
  const target = event.target;
  const actionHandlers = {
    "quantity-change": () => handleQuantityChange(target, productList, appState),
    "remove-item": () => handleItemRemove(target, productList, appState),
  };

  const handler =
    actionHandlers[
      target.classList.contains("quantity-change")
        ? "quantity-change"
        : target.classList.contains("remove-item")
          ? "remove-item"
          : null
    ];

  if (handler) {
    handler();
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

  // 수량이 0이 되면 아이템 제거
  if (newQuantity <= 0) {
    product.q += currentQuantity;
    itemElement.remove();
  } else {
    // 재고 한도 확인
    if (newQuantity > product.q + currentQuantity) {
      showAlert("재고가 부족합니다.");
      return;
    }

    // 수량 업데이트
    quantityElement.textContent = newQuantity;
    product.q -= change;
  }

  // 캐시 무효화 및 UI 업데이트
  invalidateCachesAndUpdateUI(productList, appState);
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

  // 재고 복구 및 아이템 제거
  product.q += removedQuantity;
  itemElement.remove();

  // 캐시 무효화 및 UI 업데이트
  invalidateCachesAndUpdateUI(productList, appState);
  updateSelectOptions(appState.productSelector, productList);
}

/**
 * 장바구니 재계산 및 UI 업데이트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
function recalculateCartAndUpdateUI(productList, appState) {
  const cartItems = appState.cartDisplay.children;
  const calculationResult = calculateCartTotal(Array.from(cartItems), productList, appState);

  // 앱 상태 업데이트
  updateAppStateFromCalculation(appState, calculationResult);

  // UI 업데이트
  updateCartUI(calculationResult, appState);
  renderBonusPoints(Array.from(cartItems), productList, appState, calculationResult.totalAmount);
  updateStockInfo(productList);
}

/**
 * 계산 결과로 앱 상태 업데이트
 * @param {Object} appState - 앱 상태
 * @param {Object} calculationResult - 계산 결과
 */
function updateAppStateFromCalculation(appState, calculationResult) {
  appState.totalAmount = calculationResult.totalAmount;
  appState.itemCount = calculationResult.itemCount;
}

/**
 * 장바구니 UI 업데이트
 * @param {Object} calculationResult - 계산 결과
 * @param {Object} appState - 앱 상태
 */
function updateCartUI(calculationResult, appState) {
  updateItemCountDisplay(calculationResult.itemCount);
  updateTotalAmountDisplay(calculationResult.totalAmount, appState);
  updateOrderSummary(calculationResult, appState);
  updateTuesdaySpecialDisplay(calculationResult.isTuesday);
}

/**
 * 아이템 수 표시 업데이트
 * @param {number} itemCount - 아이템 수
 */
function updateItemCountDisplay(itemCount) {
  const itemCountElement = $("#item-count");
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
  }
}

/**
 * 총액 표시 업데이트
 * @param {number} totalAmount - 총액
 * @param {Object} appState - 앱 상태
 */
function updateTotalAmountDisplay(totalAmount, appState) {
  const totalDiv = appState.sumElement?.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = "₩" + totalAmount.toLocaleString();
  }
}

/**
 * 화요일 특별 할인 표시 업데이트
 * @param {boolean} isTuesday - 화요일 여부
 */
function updateTuesdaySpecialDisplay(isTuesday) {
  const tuesdaySpecial = $("#tuesday-special");
  if (!tuesdaySpecial) return;

  const tuesdayContent = isTuesday
    ? `
    <div class="bg-purple-500/20 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs uppercase tracking-wide text-purple-400">화요일 특별 할인</span>
        <span class="text-sm font-medium text-purple-400">-10%</span>
      </div>
      <div class="text-2xs text-gray-300">화요일에만 적용되는 추가 할인!</div>
    </div>
  `
    : "";

  tuesdaySpecial.classList.toggle("hidden", !isTuesday);
  if (isTuesday) {
    tuesdaySpecial.innerHTML = tuesdayContent;
  }
}

/**
 * 주문 요약 업데이트
 * @param {Object} calculationResult - 계산 결과
 * @param {Object} appState - 앱 상태
 */
function updateOrderSummary(calculationResult, appState) {
  const summaryDetails = $("#summary-details");
  const discountInfo = $("#discount-info");

  if (!summaryDetails || !discountInfo) return;

  // 주문 요약 내용 업데이트
  updateSummaryDetails(summaryDetails, calculationResult);
  updateDiscountInfo(discountInfo, calculationResult);
}

/**
 * 요약 세부사항 업데이트
 * @param {HTMLElement} summaryDetails - 요약 세부사항 요소
 * @param {Object} calculationResult - 계산 결과
 */
function updateSummaryDetails(summaryDetails, calculationResult) {
  const { itemCount, subtotal } = calculationResult;

  summaryDetails.innerHTML = `
    <div class="flex justify-between text-sm tracking-wide">
      <span>Items</span>
      <span>${itemCount}</span>
    </div>
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subtotal.toLocaleString()}</span>
    </div>
  `;

  // 할인 정보 표시
  updateDiscountDetails(summaryDetails, calculationResult);
}

/**
 * 할인 세부사항 업데이트
 * @param {HTMLElement} summaryDetails - 요약 세부사항 요소
 * @param {Object} calculationResult - 계산 결과
 */
function updateDiscountDetails(summaryDetails, calculationResult) {
  const { itemCount, itemDiscounts, isTuesday } = calculationResult;

  // 할인 정보 생성 함수
  const createDiscountHTML = (text, discount, colorClass = "text-green-400") => `
    <div class="flex justify-between text-sm tracking-wide ${colorClass}">
      <span class="text-xs">${text}</span>
      <span class="text-xs">-${discount}%</span>
    </div>
  `;

  // 대량구매 할인 (30개 이상)
  if (itemCount >= 30) {
    summaryDetails.innerHTML += createDiscountHTML("🎉 대량구매 할인 (30개 이상)", "25");
  } else if (itemDiscounts.length > 0) {
    // 개별 상품 할인
    itemDiscounts.forEach((item) => {
      summaryDetails.innerHTML += createDiscountHTML(`${item.name} (10개↑)`, item.discount);
    });
  }

  // 화요일 할인 표시
  if (isTuesday) {
    summaryDetails.innerHTML += createDiscountHTML("🌟 화요일 추가 할인", "10", "text-purple-400");
  }

  // 배송 정보
  summaryDetails.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

/**
 * 할인 정보 업데이트
 * @param {HTMLElement} discountInfo - 할인 정보 요소
 * @param {Object} calculationResult - 계산 결과
 */
function updateDiscountInfo(discountInfo, calculationResult) {
  const { discountRate, subtotal, totalAmount } = calculationResult;

  const shouldShowDiscount = discountRate > 0 && totalAmount > 0;

  if (shouldShowDiscount) {
    const savedAmount = subtotal - totalAmount;
    discountInfo.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  } else {
    discountInfo.innerHTML = "";
  }
}

/**
 * 도움말 모달 이벤트 설정
 * @param {HTMLElement} manualToggle - 토글 버튼
 * @param {HTMLElement} manualOverlay - 오버레이
 * @param {HTMLElement} manualColumn - 모달 컬럼
 */
function setupHelpModalEvents(manualToggle, manualOverlay, manualColumn) {
  if (!manualToggle || !manualOverlay || !manualColumn) return;

  const toggleModal = () => {
    manualOverlay.classList.toggle("hidden");
    manualColumn.classList.toggle("translate-x-full");
  };

  const closeModal = (e) => {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add("hidden");
      manualColumn.classList.add("translate-x-full");
    }
  };

  manualToggle.onclick = toggleModal;
  manualOverlay.onclick = closeModal;
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

  setupHelpModalEvents(manualToggle, manualOverlay, manualColumn);
}
