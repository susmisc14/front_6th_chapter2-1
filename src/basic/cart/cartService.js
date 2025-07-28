/**
 * 장바구니 서비스 함수들
 * 장바구니 계산, 포인트 계산 등의 비즈니스 로직 처리
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
import { $ } from "../utils/$.js";
import { calculateCartTotals, extractCartItemInfo } from "../utils/businessLogic.js";

/**
 * 장바구니 총액 계산
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 * @returns {Object} 계산 결과 { totalAmount, itemCount, discountRate }
 */
export function calculateCartTotal(cartItems, productList, appState) {
  // 장바구니 아이템 정보 추출
  const cartItemInfo = extractCartItemInfo(cartItems);

  // 계산 옵션 설정
  const options = {
    discountRates: DISCOUNT_RATES,
    bulkThreshold: BULK_DISCOUNT_THRESHOLD,
    bulkDiscountRate: BULK_DISCOUNT_RATE,
    tuesdayDiscountRate: TUESDAY_DISCOUNT_RATE,
    basePointsRate: BASE_POINTS_RATE,
    tuesdayMultiplier: TUESDAY_POINTS_MULTIPLIER,
    setBonuses: {
      keyboardMouse: SET_BONUS_POINTS,
      fullSet: FULL_SET_BONUS_POINTS,
    },
    quantityBonuses: QUANTITY_BONUS_POINTS,
  };

  // 순수 함수를 사용하여 계산
  return calculateCartTotals(cartItemInfo, productList, options);
}

/**
 * 포인트 렌더링
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 * @param {number} totalAmount - 총 결제 금액
 */
export function renderBonusPoints(cartItems, productList, appState, totalAmount) {
  const loyaltyPointsDiv = $("#loyalty-points");

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
