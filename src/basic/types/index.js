/**
 * 타입 정의
 * React 마이그레이션을 위한 타입 시스템
 */

/**
 * 상품 타입
 * @typedef {Object} Product
 * @property {string} id - 상품 ID
 * @property {string} name - 상품명
 * @property {number} val - 현재 가격
 * @property {number} originalVal - 원래 가격
 * @property {number} q - 재고 수량
 * @property {boolean} onSale - 번개세일 여부
 * @property {boolean} suggestSale - 추천할인 여부
 */

/**
 * 장바구니 아이템 타입
 * @typedef {Object} CartItem
 * @property {string} id - 상품 ID
 * @property {string} name - 상품명
 * @property {number} price - 현재 가격
 * @property {number} originalPrice - 원래 가격
 * @property {number} quantity - 수량
 * @property {boolean} onSale - 번개세일 여부
 * @property {boolean} suggestSale - 추천할인 여부
 */

/**
 * 계산 결과 타입
 * @typedef {Object} CalculationResult
 * @property {number} subtotal - 소계
 * @property {number} totalAmount - 총 결제 금액
 * @property {number} itemCount - 총 아이템 수
 * @property {number} discountRate - 할인율
 * @property {Array} itemDiscounts - 개별 상품 할인 정보
 * @property {boolean} isTuesday - 화요일 여부
 * @property {Object} points - 포인트 정보
 */

/**
 * 포인트 정보 타입
 * @typedef {Object} PointsInfo
 * @property {number} base - 기본 포인트
 * @property {number} setBonus - 세트 보너스 포인트
 * @property {number} quantityBonus - 수량 보너스 포인트
 * @property {number} total - 총 포인트
 */

/**
 * UI 상태 타입
 * @typedef {Object} UIState
 * @property {string|null} selectedProductId - 선택된 상품 ID
 * @property {boolean} isTuesday - 화요일 여부
 * @property {boolean} showTuesdayBanner - 화요일 배너 표시 여부
 * @property {boolean} showDiscountInfo - 할인 정보 표시 여부
 * @property {number} discountRate - 할인율
 * @property {number} savedAmount - 절약된 금액
 * @property {number} loyaltyPoints - 적립 포인트
 * @property {Array<string>} pointsDetail - 포인트 상세 정보
 */

/**
 * 앱 상태 타입
 * @typedef {Object} AppState
 * @property {Array<Product>} productList - 상품 목록
 * @property {Array<CartItem>} cartItems - 장바구니 아이템들
 * @property {number} totalAmount - 총 결제 금액
 * @property {number} itemCount - 총 아이템 수
 * @property {string|null} lastSelectedProduct - 마지막 선택된 상품
 * @property {UIState} uiState - UI 상태
 */

/**
 * 액션 결과 타입
 * @typedef {Object} ActionResult
 * @property {boolean} success - 성공 여부
 * @property {AppState} newState - 새로운 상태
 * @property {Error|null} error - 에러 객체
 */

/**
 * 프로모션 타입
 * @typedef {'lightning'|'suggest'|'super'} PromotionType
 */

/**
 * 할인율 설정 타입
 * @typedef {Object} DiscountRates
 * @property {number} p1 - 상품1 할인율
 * @property {number} p2 - 상품2 할인율
 * @property {number} p3 - 상품3 할인율
 * @property {number} p4 - 상품4 할인율
 * @property {number} p5 - 상품5 할인율
 */

/**
 * 계산 옵션 타입
 * @typedef {Object} CalculationOptions
 * @property {DiscountRates} discountRates - 할인율 설정
 * @property {number} bulkThreshold - 대량구매 임계값
 * @property {number} bulkDiscountRate - 대량구매 할인율
 * @property {number} tuesdayDiscountRate - 화요일 할인율
 * @property {number} basePointsRate - 기본 포인트 적립률
 * @property {number} tuesdayMultiplier - 화요일 포인트 배수
 * @property {Object} setBonuses - 세트 보너스 설정
 * @property {Object} quantityBonuses - 수량 보너스 설정
 */

// 타입 검증 함수들
/**
 * 상품 타입 검증
 * @param {any} product - 검증할 객체
 * @returns {boolean} 유효한 상품인지 여부
 */
export function isValidProduct(product) {
  return (
    product &&
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.val === "number" &&
    typeof product.originalVal === "number" &&
    typeof product.q === "number" &&
    typeof product.onSale === "boolean" &&
    typeof product.suggestSale === "boolean"
  );
}

/**
 * 장바구니 아이템 타입 검증
 * @param {any} item - 검증할 객체
 * @returns {boolean} 유효한 장바구니 아이템인지 여부
 */
export function isValidCartItem(item) {
  return (
    item &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.originalPrice === "number" &&
    typeof item.quantity === "number" &&
    typeof item.onSale === "boolean" &&
    typeof item.suggestSale === "boolean"
  );
}

/**
 * 앱 상태 타입 검증
 * @param {any} state - 검증할 객체
 * @returns {boolean} 유효한 앱 상태인지 여부
 */
export function isValidAppState(state) {
  return (
    state &&
    Array.isArray(state.productList) &&
    Array.isArray(state.cartItems) &&
    typeof state.totalAmount === "number" &&
    typeof state.itemCount === "number" &&
    (state.lastSelectedProduct === null || typeof state.lastSelectedProduct === "string") &&
    state.uiState &&
    typeof state.uiState.selectedProductId === "string" &&
    typeof state.uiState.isTuesday === "boolean" &&
    typeof state.uiState.showTuesdayBanner === "boolean" &&
    typeof state.uiState.showDiscountInfo === "boolean" &&
    typeof state.uiState.discountRate === "number" &&
    typeof state.uiState.savedAmount === "number" &&
    typeof state.uiState.loyaltyPoints === "number" &&
    Array.isArray(state.uiState.pointsDetail)
  );
}

/**
 * 계산 결과 타입 검증
 * @param {any} result - 검증할 객체
 * @returns {boolean} 유효한 계산 결과인지 여부
 */
export function isValidCalculationResult(result) {
  return (
    result &&
    typeof result.subtotal === "number" &&
    typeof result.totalAmount === "number" &&
    typeof result.itemCount === "number" &&
    typeof result.discountRate === "number" &&
    Array.isArray(result.itemDiscounts) &&
    typeof result.isTuesday === "boolean" &&
    result.points &&
    typeof result.points.base === "number" &&
    typeof result.points.setBonus === "number" &&
    typeof result.points.quantityBonus === "number" &&
    typeof result.points.total === "number"
  );
}
