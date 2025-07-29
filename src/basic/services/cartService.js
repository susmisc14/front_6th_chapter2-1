/**
 * 장바구니 서비스 모듈
 * 장바구니 계산, 포인트 계산 등의 비즈니스 로직을 담당
 */
import { calculateCartTotals, extractCartItemInfo } from "../utils/businessLogic.js";

/**
 * 장바구니 총액 계산
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 * @returns {Object} 계산 결과
 */
export function calculateCartTotal(cartItems, productList, appState) {
  const cartItemInfo = extractCartItemInfo(cartItems);

  const options = {
    isTuesday: appState.isTuesday,
    includePoints: true,
    includeDiscounts: true,
  };

  return calculateCartTotals(cartItemInfo, productList, options);
}

/**
 * 보너스 포인트 계산 및 반환
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 * @param {number} totalAmount - 총액
 * @returns {Object} 포인트 계산 결과 { finalPoints, pointsDetail }
 */
export function calculateBonusPoints(cartItems, productList, appState, totalAmount) {
  let finalPoints = 0;
  const pointsDetail = [];

  // 기본 포인트 (구매액의 0.1%)
  finalPoints += Math.floor(totalAmount * 0.001);
  pointsDetail.push("기본 포인트 (0.1%)");

  // 세트 보너스 포인트
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  // cartItems가 DOM 요소인 경우 extractCartItemInfo를 사용하여 상품 정보 추출
  const cartItemInfo = extractCartItemInfo(cartItems);

  for (const item of cartItemInfo) {
    const quantity = item.quantity;
    if (quantity > 0) {
      const product = productList.find((p) => p.id === item.id);
      if (product) {
        if (product.name.includes("키보드")) {
          hasKeyboard = true;
        }
        if (product.name.includes("마우스")) {
          hasMouse = true;
        }
        if (product.name.includes("모니터암")) {
          hasMonitorArm = true;
        }
      }
    }
  }

  // 세트 보너스 계산
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += 150; // 키보드+마우스 세트(50) + 풀세트(100)
    pointsDetail.push("풀세트 구매");
  } else if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push("키보드+마우스 세트");
  }

  // 수량별 보너스
  let totalQuantity = 0;
  for (const item of cartItemInfo) {
    totalQuantity += item.quantity;
  }

  if (totalQuantity >= 30) {
    finalPoints += 100;
    pointsDetail.push("대량구매(30개+)");
  } else if (totalQuantity >= 20) {
    finalPoints += 50;
    pointsDetail.push("대량구매(20개+)");
  } else if (totalQuantity >= 10) {
    finalPoints += 20;
    pointsDetail.push("대량구매(10개+)");
  }

  // 화요일 2배 보너스 (기본 포인트에만 적용)
  const basePoints = Math.floor(totalAmount * 0.001);
  if (appState.isTuesday) {
    finalPoints = finalPoints - basePoints + basePoints * 2;
    pointsDetail.push("화요일 2배");
  }

  return { finalPoints, pointsDetail };
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
