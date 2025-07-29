/**
 * 비즈니스 로직 순수 함수들
 * DOM 조작과 분리하여 테스트 가능성 향상
 * 성능 최적화를 위한 메모이제이션 포함
 */
import {
  BASE_POINTS_RATE,
  BULK_DISCOUNT_RATE,
  BULK_DISCOUNT_THRESHOLD,
  CALCULATION_CONSTANTS,
  DAYS_OF_WEEK,
  DISCOUNT_RATES,
  FULL_SET_BONUS_POINTS,
  PRODUCT_ONE,
  PRODUCT_THREE,
  PRODUCT_TWO,
  QUANTITY_BONUS_POINTS,
  SET_BONUS_POINTS,
  TUESDAY_DISCOUNT_RATE,
  TUESDAY_POINTS_MULTIPLIER,
} from "../constants/productConstants.js";

// 메모이제이션 캐시
const calculationCache = new Map();

/**
 * 캐시 키 생성
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @returns {string} 캐시 키
 */
const generateCacheKey = (cartItems, productList) => {
  const itemsKey = cartItems.map((item) => `${item.id}:${item.quantity}`).join("|");
  const productsKey = productList.map((p) => `${p.id}:${p.q}`).join("|");
  return `${itemsKey}|${productsKey}`;
};

/**
 * 상품 가격 계산
 * @param {Object} product - 상품 객체
 * @param {number} quantity - 수량
 * @returns {number} 총 가격
 */
export const calculateProductPrice = (product, quantity) => product.val * quantity;

/**
 * 할인율 계산
 * @param {Object} product - 상품 객체
 * @param {number} quantity - 수량
 * @param {Object} discountRates - 할인율 객체
 * @returns {number} 할인율 (0-1)
 */
export const calculateDiscountRate = (product, quantity, discountRates) =>
  quantity >= 10 && discountRates[product.id] ? discountRates[product.id] : 0;

/**
 * 할인된 가격 계산
 * @param {number} originalPrice - 원래 가격
 * @param {number} discountRate - 할인율 (0-1)
 * @returns {number} 할인된 가격
 */
export const calculateDiscountedPrice = (originalPrice, discountRate) =>
  originalPrice * (1 - discountRate);

/**
 * 대량구매 할인 적용
 * @param {number} totalAmount - 총 금액
 * @param {number} totalQuantity - 총 수량
 * @param {number} threshold - 할인 임계값
 * @param {number} discountRate - 할인율
 * @returns {Object} { discountedAmount, appliedDiscount }
 */
export const applyBulkDiscount = (totalAmount, totalQuantity, threshold, discountRate) => {
  const shouldApplyBulkDiscount = totalQuantity >= threshold;

  return {
    discountedAmount: shouldApplyBulkDiscount ? totalAmount * (1 - discountRate) : totalAmount,
    appliedDiscount: shouldApplyBulkDiscount ? discountRate : 0,
  };
};

/**
 * 화요일 할인 적용
 * @param {number} amount - 금액
 * @param {number} discountRate - 할인율
 * @returns {Object} { discountedAmount, isTuesday }
 */
export const applyTuesdayDiscount = (amount, discountRate) => {
  const today = new Date();
  const isTuesday = today.getDay() === DAYS_OF_WEEK.TUESDAY;
  const shouldApplyTuesdayDiscount = isTuesday && amount > 0;

  return {
    discountedAmount: shouldApplyTuesdayDiscount ? amount * (1 - discountRate) : amount,
    isTuesday,
  };
};

/**
 * 포인트 계산
 * @param {number} totalAmount - 총 결제 금액
 * @param {number} baseRate - 기본 적립률
 * @param {boolean} isTuesday - 화요일 여부
 * @param {number} tuesdayMultiplier - 화요일 배수
 * @returns {number} 적립 포인트
 */
export const calculateBasePoints = (
  totalAmount,
  baseRate = BASE_POINTS_RATE,
  isTuesday = false,
  tuesdayMultiplier = TUESDAY_POINTS_MULTIPLIER,
) => {
  const basePoints = totalAmount * baseRate;
  return isTuesday ? basePoints * tuesdayMultiplier : basePoints;
};

/**
 * 세트 보너스 포인트 계산
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} setBonuses - 세트 보너스 설정
 * @returns {number} 세트 보너스 포인트
 */
export const calculateSetBonusPoints = (cartItems, productList, setBonuses) => {
  const itemIds = cartItems.map((item) => item.id);
  let bonusPoints = 0;

  // 세트 보너스 조건 체크 함수
  const checkSetCondition = (requiredProducts) =>
    requiredProducts.every((productId) => itemIds.includes(productId));

  // 키보드+마우스 세트
  if (checkSetCondition([PRODUCT_ONE, PRODUCT_TWO])) {
    bonusPoints += setBonuses.keyboardMouse || SET_BONUS_POINTS;
  }

  // 풀세트 (키보드+마우스+모니터암)
  if (checkSetCondition([PRODUCT_ONE, PRODUCT_TWO, PRODUCT_THREE])) {
    bonusPoints += setBonuses.fullSet || FULL_SET_BONUS_POINTS;
  }

  return bonusPoints;
};

/**
 * 수량별 보너스 포인트 계산
 * @param {number} totalQuantity - 총 수량
 * @param {Object} quantityBonuses - 수량별 보너스 설정
 * @returns {number} 수량 보너스 포인트
 */
export const calculateQuantityBonusPoints = (
  totalQuantity,
  quantityBonuses = QUANTITY_BONUS_POINTS,
) => {
  return Object.entries(quantityBonuses)
    .filter(([threshold]) => totalQuantity >= parseInt(threshold))
    .reduce((maxBonus, [, bonus]) => Math.max(maxBonus, bonus), 0);
};

/**
 * 총 포인트 계산
 * @param {number} basePoints - 기본 포인트
 * @param {number} setBonus - 세트 보너스
 * @param {number} quantityBonus - 수량 보너스
 * @returns {number} 총 포인트
 */
export const calculateTotalPoints = (basePoints, setBonus, quantityBonus) =>
  basePoints + setBonus + quantityBonus;

/**
 * 장바구니 아이템 정보 추출
 * @param {Array} cartItems - 장바구니 아이템 DOM 요소들
 * @returns {Array} 아이템 정보 배열
 */
export const extractCartItemInfo = (cartItems) =>
  Array.from(cartItems)
    .map((item) => {
      const quantityElement = item.querySelector(".quantity-number");
      const productId = item.id;

      return {
        id: productId,
        quantity: quantityElement ? parseInt(quantityElement.textContent) : 0,
      };
    })
    .filter((item) => item.quantity > 0);

/**
 * 상품 재고 업데이트
 * @param {Array} productList - 상품 목록
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 변경 수량 (음수면 감소)
 * @returns {boolean} 업데이트 성공 여부
 */
export const updateProductStock = (productList, productId, quantity) => {
  const product = productList.find((p) => p.id === productId);
  if (!product) return false;

  const newStock = product.q - quantity;
  if (newStock < 0) return false;

  product.q = newStock;
  return true;
};

/**
 * 장바구니 아이템별 계산
 * @param {Object} cartItem - 장바구니 아이템
 * @param {Array} productList - 상품 목록
 * @param {Object} discountRates - 할인율 객체
 * @returns {Object} 아이템별 계산 결과
 */
const calculateCartItem = (cartItem, productList, discountRates) => {
  const product = productList.find((p) => p.id === cartItem.id);
  if (!product) return null;

  const quantity = cartItem.quantity;
  const itemTotal = calculateProductPrice(product, quantity);
  const discountRate = calculateDiscountRate(product, quantity, discountRates);
  const discountedItemTotal = calculateDiscountedPrice(itemTotal, discountRate);

  return {
    product,
    quantity,
    itemTotal,
    discountRate,
    discountedItemTotal,
  };
};

/**
 * 장바구니 총계 계산 (메모이제이션 적용)
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} options - 계산 옵션
 * @returns {Object} 계산 결과
 */
export const calculateCartTotals = (cartItems, productList, options = {}) => {
  // 캐시 키 생성
  const cacheKey = generateCacheKey(cartItems, productList);

  // 캐시에서 확인
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  const {
    discountRates = DISCOUNT_RATES,
    bulkThreshold = BULK_DISCOUNT_THRESHOLD,
    bulkRate = BULK_DISCOUNT_RATE,
    tuesdayRate = TUESDAY_DISCOUNT_RATE,
  } = options;

  // 각 아이템별 계산
  const itemCalculations = cartItems
    .map((cartItem) => calculateCartItem(cartItem, productList, discountRates))
    .filter(Boolean);

  // 합계 계산
  const subtotal = itemCalculations.reduce((sum, item) => sum + item.itemTotal, 0);
  const totalAmount = itemCalculations.reduce((sum, item) => sum + item.discountedItemTotal, 0);
  const itemCount = itemCalculations.reduce((sum, item) => sum + item.quantity, 0);

  // 개별 할인 정보 수집
  const itemDiscounts = itemCalculations
    .filter((item) => item.discountRate > 0)
    .map((item) => ({
      name: item.product.name,
      discount: item.discountRate * CALCULATION_CONSTANTS.PERCENTAGE_MULTIPLIER,
    }));

  // 대량구매 할인 적용 (개별 할인 무시)
  const bulkDiscountResult = applyBulkDiscount(subtotal, itemCount, bulkThreshold, bulkRate);

  let finalTotalAmount = totalAmount;
  let finalItemDiscounts = itemDiscounts;

  if (bulkDiscountResult.appliedDiscount > 0) {
    // 대량구매 할인이 적용되면 개별 할인을 무시하고 subtotal에 대량구매 할인 적용
    finalTotalAmount = bulkDiscountResult.discountedAmount;
    finalItemDiscounts = []; // 개별 할인 정보 초기화 (대량구매 할인이 우선)
  }

  // 화요일 할인 적용
  const tuesdayResult = applyTuesdayDiscount(finalTotalAmount, tuesdayRate);

  const result = {
    subtotal,
    totalAmount: tuesdayResult.discountedAmount,
    itemCount,
    itemDiscounts: finalItemDiscounts,
    discountRate: (subtotal - tuesdayResult.discountedAmount) / subtotal,
    isTuesday: tuesdayResult.isTuesday,
  };

  // 결과를 캐시에 저장
  calculationCache.set(cacheKey, result);

  return result;
};

/**
 * 포인트 상세 정보 계산
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {number} totalAmount - 총 결제 금액
 * @returns {Object} 포인트 정보
 */
export const calculatePointsDetails = (cartItems, productList, totalAmount) => {
  const today = new Date();
  const isTuesday = today.getDay() === DAYS_OF_WEEK.TUESDAY;

  // 기본 포인트
  const basePoints = calculateBasePoints(
    totalAmount,
    BASE_POINTS_RATE,
    isTuesday,
    TUESDAY_POINTS_MULTIPLIER,
  );

  // 세트 보너스
  const setBonus = calculateSetBonusPoints(cartItems, productList, {
    keyboardMouse: SET_BONUS_POINTS,
    fullSet: FULL_SET_BONUS_POINTS,
  });

  // 수량 보너스
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const quantityBonus = calculateQuantityBonusPoints(totalQuantity, QUANTITY_BONUS_POINTS);

  // 총 포인트
  const totalPoints = calculateTotalPoints(basePoints, setBonus, quantityBonus);

  return {
    basePoints,
    setBonus,
    quantityBonus,
    totalPoints,
    isTuesday,
  };
};

/**
 * 계산 캐시 무효화
 * @param {string} [cacheKey] - 특정 캐시 키만 무효화 (선택사항)
 */
export const clearCalculationCache = (cacheKey = null) => {
  if (cacheKey) {
    calculationCache.delete(cacheKey);
  } else {
    calculationCache.clear();
  }
};
