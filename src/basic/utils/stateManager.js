/**
 * 상태 관리 유틸리티
 * React 마이그레이션을 위해 DOM 조작과 분리된 상태 관리 로직
 */

/**
 * 앱 상태 타입 정의
 * @typedef {Object} AppState
 * @property {Array} productList - 상품 목록
 * @property {Array} cartItems - 장바구니 아이템들
 * @property {number} totalAmount - 총 결제 금액
 * @property {number} itemCount - 총 아이템 수
 * @property {string|null} lastSelectedProduct - 마지막 선택된 상품
 * @property {Object} uiState - UI 상태
 */

/**
 * 초기 앱 상태 생성
 * @returns {AppState} 초기 상태
 */
export function createInitialState() {
  return {
    productList: [],
    cartItems: [],
    totalAmount: 0,
    itemCount: 0,
    lastSelectedProduct: null,
    uiState: {
      selectedProductId: null,
      isTuesday: false,
      showTuesdayBanner: false,
      showDiscountInfo: false,
      discountRate: 0,
      savedAmount: 0,
      loyaltyPoints: 0,
      pointsDetail: [],
    },
  };
}

/**
 * 상품 선택 상태 업데이트
 * @param {AppState} state - 현재 상태
 * @param {string} productId - 선택된 상품 ID
 * @returns {AppState} 업데이트된 상태
 */
export function updateSelectedProduct(state, productId) {
  return {
    ...state,
    lastSelectedProduct: productId,
    uiState: {
      ...state.uiState,
      selectedProductId: productId,
    },
  };
}

/**
 * 장바구니 아이템 추가
 * @param {AppState} state - 현재 상태
 * @param {Object} product - 추가할 상품
 * @param {number} quantity - 수량
 * @returns {AppState} 업데이트된 상태
 */
export function addToCart(state, product, quantity = 1) {
  const existingItemIndex = state.cartItems.findIndex((item) => item.id === product.id);

  if (existingItemIndex >= 0) {
    // 기존 아이템 수량 증가
    const updatedItems = [...state.cartItems];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + quantity,
    };

    return {
      ...state,
      cartItems: updatedItems,
    };
  } else {
    // 새 아이템 추가
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.val,
      originalPrice: product.originalVal,
      quantity,
      onSale: product.onSale,
      suggestSale: product.suggestSale,
    };

    return {
      ...state,
      cartItems: [...state.cartItems, newItem],
    };
  }
}

/**
 * 장바구니 아이템 수량 변경
 * @param {AppState} state - 현재 상태
 * @param {string} productId - 상품 ID
 * @param {number} change - 변경 수량
 * @returns {AppState} 업데이트된 상태
 */
export function updateCartItemQuantity(state, productId, change) {
  const itemIndex = state.cartItems.findIndex((item) => item.id === productId);

  if (itemIndex === -1) return state;

  const updatedItems = [...state.cartItems];
  const newQuantity = updatedItems[itemIndex].quantity + change;

  if (newQuantity <= 0) {
    // 수량이 0 이하면 아이템 제거
    updatedItems.splice(itemIndex, 1);
  } else {
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      quantity: newQuantity,
    };
  }

  return {
    ...state,
    cartItems: updatedItems,
  };
}

/**
 * 장바구니 아이템 제거
 * @param {AppState} state - 현재 상태
 * @param {string} productId - 제거할 상품 ID
 * @returns {AppState} 업데이트된 상태
 */
export function removeFromCart(state, productId) {
  return {
    ...state,
    cartItems: state.cartItems.filter((item) => item.id !== productId),
  };
}

/**
 * 상품 재고 업데이트
 * @param {AppState} state - 현재 상태
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 변경 수량 (음수면 감소)
 * @returns {AppState} 업데이트된 상태
 */
export function updateProductStock(state, productId, quantity) {
  const productIndex = state.productList.findIndex((p) => p.id === productId);

  if (productIndex === -1) return state;

  const updatedProducts = [...state.productList];
  const newStock = updatedProducts[productIndex].q - quantity;

  if (newStock < 0) return state; // 재고 부족

  updatedProducts[productIndex] = {
    ...updatedProducts[productIndex],
    q: newStock,
  };

  return {
    ...state,
    productList: updatedProducts,
  };
}

/**
 * UI 상태 업데이트
 * @param {AppState} state - 현재 상태
 * @param {Object} uiUpdates - UI 업데이트 내용
 * @returns {AppState} 업데이트된 상태
 */
export function updateUIState(state, uiUpdates) {
  return {
    ...state,
    uiState: {
      ...state.uiState,
      ...uiUpdates,
    },
  };
}

/**
 * 계산 결과로 상태 업데이트
 * @param {AppState} state - 현재 상태
 * @param {Object} calculationResult - 계산 결과
 * @returns {AppState} 업데이트된 상태
 */
export function updateFromCalculation(state, calculationResult) {
  return {
    ...state,
    totalAmount: calculationResult.totalAmount,
    itemCount: calculationResult.itemCount,
    uiState: {
      ...state.uiState,
      isTuesday: calculationResult.isTuesday,
      showTuesdayBanner: calculationResult.isTuesday,
      showDiscountInfo: calculationResult.discountRate > 0,
      discountRate: calculationResult.discountRate,
      savedAmount: calculationResult.subtotal - calculationResult.totalAmount,
      loyaltyPoints: calculationResult.points?.total || 0,
      pointsDetail: calculationResult.points
        ? [
            `기본: ${calculationResult.points.base}p`,
            ...(calculationResult.points.setBonus > 0
              ? [`세트보너스: +${calculationResult.points.setBonus}p`]
              : []),
            ...(calculationResult.points.quantityBonus > 0
              ? [`수량보너스: +${calculationResult.points.quantityBonus}p`]
              : []),
          ]
        : [],
    },
  };
}
