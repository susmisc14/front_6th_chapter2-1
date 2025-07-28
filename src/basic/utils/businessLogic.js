/**
 * 비즈니스 로직 순수 함수들
 * DOM 조작과 분리하여 테스트 가능성 향상
 */

/**
 * 상품 가격 계산
 * @param {Object} product - 상품 객체
 * @param {number} quantity - 수량
 * @returns {number} 총 가격
 */
export function calculateProductPrice(product, quantity) {
  return product.val * quantity;
}

/**
 * 할인율 계산
 * @param {Object} product - 상품 객체
 * @param {number} quantity - 수량
 * @param {Object} discountRates - 할인율 객체
 * @returns {number} 할인율 (0-1)
 */
export function calculateDiscountRate(product, quantity, discountRates) {
  if (quantity >= 10 && discountRates[product.id]) {
    return discountRates[product.id];
  }
  return 0;
}

/**
 * 할인된 가격 계산
 * @param {number} originalPrice - 원래 가격
 * @param {number} discountRate - 할인율 (0-1)
 * @returns {number} 할인된 가격
 */
export function calculateDiscountedPrice(originalPrice, discountRate) {
  return originalPrice * (1 - discountRate);
}

/**
 * 대량구매 할인 적용
 * @param {number} totalAmount - 총 금액
 * @param {number} totalQuantity - 총 수량
 * @param {number} threshold - 할인 임계값
 * @param {number} discountRate - 할인율
 * @returns {Object} { discountedAmount, appliedDiscount }
 */
export function applyBulkDiscount(totalAmount, totalQuantity, threshold, discountRate) {
  if (totalQuantity >= threshold) {
    const discountedAmount = totalAmount * (1 - discountRate);
    return {
      discountedAmount,
      appliedDiscount: discountRate,
    };
  }
  return {
    discountedAmount: totalAmount,
    appliedDiscount: 0,
  };
}

/**
 * 화요일 할인 적용
 * @param {number} amount - 금액
 * @param {number} discountRate - 할인율
 * @returns {Object} { discountedAmount, isTuesday }
 */
export function applyTuesdayDiscount(amount, discountRate) {
  const today = new Date();
  const isTuesday = today.getDay() === 2;

  if (isTuesday && amount > 0) {
    return {
      discountedAmount: amount * (1 - discountRate),
      isTuesday: true,
    };
  }

  return {
    discountedAmount: amount,
    isTuesday: false,
  };
}

/**
 * 포인트 계산
 * @param {number} totalAmount - 총 결제 금액
 * @param {number} baseRate - 기본 적립률
 * @param {boolean} isTuesday - 화요일 여부
 * @param {number} tuesdayMultiplier - 화요일 배수
 * @returns {number} 적립 포인트
 */
export function calculateBasePoints(
  totalAmount,
  baseRate,
  isTuesday = false,
  tuesdayMultiplier = 1,
) {
  const basePoints = totalAmount * baseRate;
  return isTuesday ? basePoints * tuesdayMultiplier : basePoints;
}

/**
 * 세트 보너스 포인트 계산
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} setBonuses - 세트 보너스 설정
 * @returns {number} 세트 보너스 포인트
 */
export function calculateSetBonusPoints(cartItems, productList, setBonuses) {
  const itemIds = cartItems.map((item) => item.id);
  let bonusPoints = 0;

  // 키보드+마우스 세트
  if (itemIds.includes("p1") && itemIds.includes("p2")) {
    bonusPoints += setBonuses.keyboardMouse || 0;
  }

  // 풀세트 (키보드+마우스+모니터암)
  if (itemIds.includes("p1") && itemIds.includes("p2") && itemIds.includes("p3")) {
    bonusPoints += setBonuses.fullSet || 0;
  }

  return bonusPoints;
}

/**
 * 수량별 보너스 포인트 계산
 * @param {number} totalQuantity - 총 수량
 * @param {Object} quantityBonuses - 수량별 보너스 설정
 * @returns {number} 수량 보너스 포인트
 */
export function calculateQuantityBonusPoints(totalQuantity, quantityBonuses) {
  let bonusPoints = 0;

  for (const [threshold, bonus] of Object.entries(quantityBonuses)) {
    if (totalQuantity >= parseInt(threshold)) {
      bonusPoints = Math.max(bonusPoints, bonus);
    }
  }

  return bonusPoints;
}

/**
 * 총 포인트 계산
 * @param {number} basePoints - 기본 포인트
 * @param {number} setBonus - 세트 보너스
 * @param {number} quantityBonus - 수량 보너스
 * @returns {number} 총 포인트
 */
export function calculateTotalPoints(basePoints, setBonus, quantityBonus) {
  return basePoints + setBonus + quantityBonus;
}

/**
 * 장바구니 아이템 정보 추출
 * @param {Array} cartItems - 장바구니 아이템 DOM 요소들
 * @returns {Array} 아이템 정보 배열
 */
export function extractCartItemInfo(cartItems) {
  return Array.from(cartItems)
    .map((item) => {
      const quantityElement = item.querySelector(".quantity-number");
      const productId = item.id;

      return {
        id: productId,
        quantity: quantityElement ? parseInt(quantityElement.textContent) : 0,
      };
    })
    .filter((item) => item.quantity > 0);
}

/**
 * 상품 재고 업데이트
 * @param {Array} productList - 상품 목록
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 변경 수량 (음수면 감소)
 * @returns {boolean} 업데이트 성공 여부
 */
export function updateProductStock(productList, productId, quantity) {
  const product = productList.find((p) => p.id === productId);
  if (!product) return false;

  const newStock = product.q - quantity;
  if (newStock < 0) return false;

  product.q = newStock;
  return true;
}

/**
 * 장바구니 총계 계산
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} options - 계산 옵션
 * @returns {Object} 계산 결과
 */
export function calculateCartTotals(cartItems, productList, options = {}) {
  const {
    discountRates = {},
    bulkThreshold = 30,
    bulkDiscountRate = 0.25,
    tuesdayDiscountRate = 0.1,
    basePointsRate = 0.001,
    tuesdayMultiplier = 2,
    setBonuses = {},
    quantityBonuses = {},
  } = options;

  let subtotal = 0;
  let totalAmount = 0;
  let totalQuantity = 0;
  const itemDiscounts = [];

  // 각 아이템 계산
  for (const item of cartItems) {
    const product = productList.find((p) => p.id === item.id);
    if (!product) continue;

    const itemTotal = calculateProductPrice(product, item.quantity);
    subtotal += itemTotal;
    totalQuantity += item.quantity;

    // 개별 상품 할인
    const discountRate = calculateDiscountRate(product, item.quantity, discountRates);
    if (discountRate > 0) {
      const discountedItemTotal = calculateDiscountedPrice(itemTotal, discountRate);
      totalAmount += discountedItemTotal;
      itemDiscounts.push({
        name: product.name,
        discount: discountRate * 100,
      });
    } else {
      totalAmount += itemTotal;
    }
  }

  // 대량구매 할인 체크
  const bulkResult = applyBulkDiscount(subtotal, totalQuantity, bulkThreshold, bulkDiscountRate);

  // 대량구매 할인이 적용되면 개별 할인을 무시하고 subtotal에 대량구매 할인 적용
  if (bulkResult.appliedDiscount > 0) {
    totalAmount = bulkResult.discountedAmount;
    // 개별 할인 정보 초기화 (대량구매 할인이 우선)
    itemDiscounts.length = 0;
  }

  // 화요일 할인
  const tuesdayResult = applyTuesdayDiscount(totalAmount, tuesdayDiscountRate);

  // 포인트 계산
  const basePoints = calculateBasePoints(
    tuesdayResult.discountedAmount,
    basePointsRate,
    tuesdayResult.isTuesday,
    tuesdayMultiplier,
  );

  const setBonus = calculateSetBonusPoints(cartItems, productList, setBonuses);
  const quantityBonus = calculateQuantityBonusPoints(totalQuantity, quantityBonuses);
  const totalPoints = calculateTotalPoints(basePoints, setBonus, quantityBonus);

  return {
    subtotal: Math.round(subtotal),
    totalAmount: Math.round(tuesdayResult.discountedAmount),
    itemCount: totalQuantity,
    discountRate: (subtotal - tuesdayResult.discountedAmount) / subtotal,
    itemDiscounts,
    isTuesday: tuesdayResult.isTuesday,
    points: {
      base: Math.round(basePoints),
      setBonus,
      quantityBonus,
      total: Math.round(totalPoints),
    },
  };
}
