/**
 * 이벤트 관련 UI 업데이트 함수들
 * 이벤트 핸들러에서 사용하는 UI 업데이트 로직들을 제공
 */
import {
  DISCOUNT_INFO_BOX_TEMPLATE,
  DISCOUNT_ITEM_TEMPLATE,
  ORDER_SUMMARY_BASE_TEMPLATE,
  SHIPPING_INFO_TEMPLATE,
  TUESDAY_SPECIAL_DISPLAY_TEMPLATE,
} from "../constants/uiTemplates.js";
import { $ } from "../utils/$.js";
import {
  bindTemplate,
  createUIElement,
  setElementHTML,
  setElementText,
  setElementVisibility,
} from "./uiHelpers.js";

/**
 * 화요일 특별 할인 표시 업데이트
 * @param {boolean} isTuesday - 화요일 여부
 */
export function updateTuesdaySpecialDisplay(isTuesday) {
  const tuesdaySpecial = $("#tuesday-special");
  if (!tuesdaySpecial) return;

  if (isTuesday) {
    const tuesdayContent = bindTemplate(TUESDAY_SPECIAL_DISPLAY_TEMPLATE, {});
    const tuesdayElement = createUIElement(tuesdayContent);
    setElementHTML(tuesdaySpecial, tuesdayContent);
  }

  tuesdaySpecial.classList.toggle("hidden", !isTuesday);
}

/**
 * 주문 요약 업데이트
 * @param {Object} calculationResult - 계산 결과
 * @param {Object} appState - 앱 상태
 */
export function updateOrderSummary(calculationResult, appState) {
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

  // 기본 요약 정보 생성
  let summaryHTML = bindTemplate(ORDER_SUMMARY_BASE_TEMPLATE, {
    itemCount,
    subtotal: subtotal.toLocaleString(),
  });

  // 할인 정보 추가
  summaryHTML += createDiscountDetailsHTML(calculationResult);

  // 배송 정보 추가
  summaryHTML += bindTemplate(SHIPPING_INFO_TEMPLATE, {});

  setElementHTML(summaryDetails, summaryHTML);
}

/**
 * 할인 세부사항 HTML 생성
 * @param {Object} calculationResult - 계산 결과
 * @returns {string} 할인 세부사항 HTML
 */
function createDiscountDetailsHTML(calculationResult) {
  const { itemCount, itemDiscounts, isTuesday } = calculationResult;
  let discountHTML = "";

  // 대량구매 할인 (30개 이상)
  if (itemCount >= 30) {
    discountHTML += bindTemplate(DISCOUNT_ITEM_TEMPLATE, {
      discountText: "🎉 대량구매 할인 (30개 이상)",
      discountRate: "25",
      colorClass: "text-green-400",
    });
  } else if (itemDiscounts.length > 0) {
    // 개별 상품 할인
    itemDiscounts.forEach((item) => {
      discountHTML += bindTemplate(DISCOUNT_ITEM_TEMPLATE, {
        discountText: `${item.name} (10개↑)`,
        discountRate: item.discount,
        colorClass: "text-green-400",
      });
    });
  }

  // 화요일 할인 표시
  if (isTuesday) {
    discountHTML += bindTemplate(DISCOUNT_ITEM_TEMPLATE, {
      discountText: "🌟 화요일 추가 할인",
      discountRate: "10",
      colorClass: "text-purple-400",
    });
  }

  return discountHTML;
}

/**
 * 할인 정보 업데이트
 * @param {HTMLElement} discountInfo - 할인 정보 요소
 * @param {Object} calculationResult - 계산 결과
 */
function updateDiscountInfo(discountInfo, calculationResult) {
  const { discountInfo: discountInfoString, subtotal, totalAmount } = calculationResult;

  const shouldShowDiscount = discountInfoString !== "0.0%" && totalAmount > 0;

  if (shouldShowDiscount) {
    const savedAmount = Math.round(subtotal - totalAmount);
    const discountHTML = bindTemplate(DISCOUNT_INFO_BOX_TEMPLATE, {
      discountRate: discountInfoString.replace("%", ""),
      savedAmount: savedAmount.toLocaleString(),
    });
    setElementHTML(discountInfo, discountHTML);
  } else {
    setElementHTML(discountInfo, "");
  }
}

/**
 * 장바구니 UI 업데이트
 * @param {Object} calculationResult - 계산 결과
 * @param {Object} appState - 앱 상태
 */
export function updateCartUI(calculationResult, appState) {
  const { itemCount, totalAmount } = calculationResult;

  updateItemCountDisplay(itemCount);
  updateTotalAmountDisplay(totalAmount, appState);
  updateTuesdaySpecialDisplay(appState.isTuesday);
}

/**
 * 아이템 수량 표시 업데이트
 * @param {number} itemCount - 아이템 수량
 */
function updateItemCountDisplay(itemCount) {
  const itemCountElement = $("#item-count");
  if (itemCountElement) {
    const itemCountText = `🛍️ ${itemCount} items in cart`;
    setElementText(itemCountElement, itemCountText);
  }
}

/**
 * 총액 표시 업데이트
 * @param {number} totalAmount - 총액
 * @param {Object} appState - 앱 상태
 */
function updateTotalAmountDisplay(totalAmount, appState) {
  const totalDiv = $("#cart-total");
  if (totalDiv) {
    const totalText = "₩" + totalAmount.toLocaleString();
    setElementText(totalDiv, totalText);
  }
}

/**
 * 보너스 포인트 UI 업데이트
 * @param {Object} pointsResult - 포인트 계산 결과
 */
export function updateBonusPoints(pointsResult) {
  const loyaltyPointsDiv = $("#loyalty-points");
  if (!loyaltyPointsDiv) return;

  const { finalPoints, pointsDetail } = pointsResult;

  if (finalPoints > 0) {
    setElementVisibility(loyaltyPointsDiv, true);
    const pointsHTML = `
      <h3 class="font-semibold text-blue-800 mb-2">🎁 Loyalty Points</h3>
      <p class="text-sm text-blue-600">You'll earn: <span id="points-amount">${finalPoints}p</span></p>
      <div class="text-xs text-blue-500 mt-1">
        기본: ${pointsDetail.join("<br>")}
      </div>
    `;
    setElementHTML(loyaltyPointsDiv, pointsHTML);
  } else {
    setElementVisibility(loyaltyPointsDiv, false);
  }
}
