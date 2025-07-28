/**
 * 장바구니 관련 서비스 함수들
 * 장바구니 계산, 포인트 렌더링, 재고 관리 등의 기능을 제공
 */
import {
  BASE_POINTS_RATE,
  BULK_DISCOUNT_RATE,
  BULK_DISCOUNT_THRESHOLD,
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

/**
 * 장바구니 총액 계산
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 * @returns {Object} 계산 결과 { totalAmount, itemCount, discountRate }
 */
export function calculateCartTotal(cartItems, productList, appState) {
  let totalAmount = 0;
  let itemCount = 0;
  let subtotal = 0;
  const itemDiscounts = [];

  // 각 장바구니 아이템 계산
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = findProductById(productList, cartItem.id);

    if (!product) continue;

    const quantity = parseInt(cartItem.querySelector(".quantity-number").textContent);
    const itemTotal = product.val * quantity;

    itemCount += quantity;
    subtotal += itemTotal;

    // 개별 상품 할인 적용 (10개 이상)
    if (quantity >= 10) {
      const discountRate = DISCOUNT_RATES[product.id] || 0;
      if (discountRate > 0) {
        itemDiscounts.push({
          name: product.name,
          discount: discountRate * 100,
        });
        totalAmount += itemTotal * (1 - discountRate);
      } else {
        totalAmount += itemTotal;
      }
    } else {
      totalAmount += itemTotal;
    }
  }

  // 대량구매 할인 적용 (30개 이상)
  let discountRate = 0;
  if (itemCount >= BULK_DISCOUNT_THRESHOLD) {
    totalAmount = subtotal * (1 - BULK_DISCOUNT_RATE);
    discountRate = BULK_DISCOUNT_RATE;
  } else {
    discountRate = (subtotal - totalAmount) / subtotal;
  }

  // 화요일 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  if (isTuesday && totalAmount > 0) {
    totalAmount = totalAmount * (1 - TUESDAY_DISCOUNT_RATE);
    discountRate = 1 - totalAmount / subtotal;
  }

  return {
    totalAmount: Math.round(totalAmount),
    itemCount,
    discountRate,
    subtotal,
    itemDiscounts,
    isTuesday,
  };
}

/**
 * 포인트 렌더링
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 * @param {number} totalAmount - 총 결제 금액
 */
export function renderBonusPoints(cartItems, productList, appState, totalAmount) {
  const loyaltyPointsDiv = document.getElementById("loyalty-points");

  if (!loyaltyPointsDiv) return;

  if (cartItems.length === 0) {
    loyaltyPointsDiv.style.display = "none";
    return;
  }

  let basePoints = Math.floor(totalAmount * BASE_POINTS_RATE);
  let finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push("기본: " + basePoints + "p");
  }

  // 화요일 포인트 2배
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  if (isTuesday && basePoints > 0) {
    finalPoints = basePoints * TUESDAY_POINTS_MULTIPLIER;
    pointsDetail.push("화요일 2배");
  }

  // 세트 보너스 포인트
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  for (const cartItem of cartItems) {
    const product = findProductById(productList, cartItem.id);
    if (!product) continue;

    if (product.id === PRODUCT_ONE) hasKeyboard = true;
    else if (product.id === PRODUCT_TWO) hasMouse = true;
    else if (product.id === PRODUCT_THREE) hasMonitorArm = true;
  }

  if (hasKeyboard && hasMouse) {
    finalPoints += SET_BONUS_POINTS;
    pointsDetail.push("키보드+마우스 세트 +50p");
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += FULL_SET_BONUS_POINTS;
    pointsDetail.push("풀세트 구매 +100p");
  }

  // 수량별 보너스 포인트
  const itemCount = cartItems.reduce((total, item) => {
    return total + parseInt(item.querySelector(".quantity-number").textContent);
  }, 0);

  if (itemCount >= 30) {
    finalPoints += QUANTITY_BONUS_POINTS[30];
    pointsDetail.push("대량구매(30개+) +100p");
  } else if (itemCount >= 20) {
    finalPoints += QUANTITY_BONUS_POINTS[20];
    pointsDetail.push("대량구매(20개+) +50p");
  } else if (itemCount >= 10) {
    finalPoints += QUANTITY_BONUS_POINTS[10];
    pointsDetail.push("대량구매(10개+) +20p");
  }

  // 포인트 표시 업데이트
  if (finalPoints > 0) {
    loyaltyPointsDiv.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(", ")}</div>
    `;
    loyaltyPointsDiv.style.display = "block";
  } else {
    loyaltyPointsDiv.textContent = "적립 포인트: 0p";
    loyaltyPointsDiv.style.display = "block";
  }
}

/**
 * 재고 총합 계산
 * @param {Array} productList - 상품 목록
 * @returns {number} 재고 총합
 */
export function getStockTotal(productList) {
  return productList.reduce((total, product) => total + product.q, 0);
}

/**
 * 상품 ID로 상품 찾기 (내부 함수)
 * @param {Array} productList - 상품 목록
 * @param {string} productId - 상품 ID
 * @returns {Object|null} 찾은 상품 또는 null
 */
function findProductById(productList, productId) {
  return productList.find((product) => product.id === productId) || null;
}
