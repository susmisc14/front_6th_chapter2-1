import React, { memo, useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { calculateCartTotals, calculatePointsDetails } from "../../utils/businessLogic";

const OrderSummary: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const calculation = useMemo(() => {
    const result = calculateCartTotals(state.cartItems, state.productList);

    return {
      ...result,
      showDiscountInfo: result.discountRate > 0,
      showLoyaltyPoints: result.points.total > 0,
      pointsDetail: calculatePointsDetails(state.cartItems, state.productList, result.totalAmount),
    };
  }, [state.cartItems, state.productList]);

  // UI 상태 업데이트
  React.useEffect(() => {
    dispatch({
      type: "UPDATE_UI_STATE",
      payload: {
        discountRate: calculation.discountRate,
        savedAmount: calculation.subtotal - calculation.totalAmount,
        loyaltyPoints: calculation.points.total,
        pointsDetail: calculation.pointsDetail,
        isTuesday: calculation.isTuesday,
        showDiscountInfo: calculation.showDiscountInfo,
        showTuesdayBanner: calculation.isTuesday,
      },
    });
  }, [calculation, dispatch]);

  // summary-details HTML 생성 (main.original.js와 동일한 로직)
  const summaryDetailsHTML = useMemo(() => {
    if (calculation.subtotal > 0) {
      let html = "";

      // 각 아이템 정보 추가
      state.cartItems.forEach((cartItem) => {
        const product = state.productList.find((p) => p.id === cartItem.id);
        if (product) {
          const itemTotal = product.val * cartItem.quantity;
          html += `
            <div class="flex justify-between text-xs tracking-wide text-gray-400">
              <span>${product.name} x ${cartItem.quantity}</span>
              <span>₩${itemTotal.toLocaleString()}</span>
            </div>
          `;
        }
      });

      // 구분선 추가
      html += `
        <div class="border-t border-white/10 my-3"></div>
        <div class="flex justify-between text-sm tracking-wide">
          <span>Subtotal</span>
          <span>₩${calculation.subtotal.toLocaleString()}</span>
        </div>
      `;

      // 대량구매 할인 (30개 이상)
      if (calculation.itemCount >= 30) {
        html += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
            <span class="text-xs">-25%</span>
          </div>
        `;
      } else {
        // 개별 상품 할인 (10개 이상)
        state.cartItems.forEach((cartItem) => {
          const product = state.productList.find((p) => p.id === cartItem.id);
          if (product && cartItem.quantity >= 10) {
            let discountRate = 0;
            if (product.id === "p1") discountRate = 10;
            else if (product.id === "p2") discountRate = 15;
            else if (product.id === "p3") discountRate = 20;
            else if (product.id === "p4") discountRate = 5;
            else if (product.id === "p5") discountRate = 25;

            if (discountRate > 0) {
              html += `
                <div class="flex justify-between text-sm tracking-wide text-green-400">
                  <span class="text-xs">${product.name} (10개↑)</span>
                  <span class="text-xs">-${discountRate}%</span>
                </div>
              `;
            }
          }
        });
      }

      // 화요일 할인
      if (calculation.isTuesday && calculation.totalAmount > 0) {
        html += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }

      // 배송 정보
      html += `
        <div class="flex justify-between text-sm tracking-wide text-gray-400">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      `;

      return html;
    }
    return "";
  }, [
    state.cartItems,
    state.productList,
    calculation.subtotal,
    calculation.itemCount,
    calculation.totalAmount,
    calculation.isTuesday,
  ]);

  // summary-details DOM 업데이트
  React.useEffect(() => {
    const summaryDetailsDiv = document.getElementById("summary-details");
    if (summaryDetailsDiv) {
      summaryDetailsDiv.innerHTML = summaryDetailsHTML;
    }
  }, [summaryDetailsHTML]);

  // 할인 정보 HTML 생성
  const discountInfoHTML = useMemo(() => {
    if (calculation.discountRate > 0 && calculation.totalAmount > 0) {
      const savedAmount = calculation.subtotal - calculation.totalAmount;
      return `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${calculation.discountRate.toFixed(1)}%</span>
          </div>
          <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
        </div>
      `;
    }
    return "";
  }, [calculation.discountRate, calculation.totalAmount, calculation.subtotal]);

  // 할인 정보 DOM 업데이트
  React.useEffect(() => {
    const discountInfoDiv = document.getElementById("discount-info");
    if (discountInfoDiv) {
      discountInfoDiv.innerHTML = discountInfoHTML;
    }
  }, [discountInfoHTML]);

  return (
    <>
      <h2 className="tracking-extra-wide mb-5 text-xs font-medium uppercase">Order Summary</h2>

      <div className="flex flex-1 flex-col">
        {/* 요약 세부사항 - main.original.js와 동일한 구조 */}
        <div id="summary-details" className="space-y-3">
          {/* 동적으로 생성될 예정 */}
        </div>

        {/* 하단 영역 */}
        <div className="mt-auto">
          {/* 할인 정보 - main.original.js와 동일한 구조 */}
          <div id="discount-info" data-testid="discount-info" className="mb-4">
            {/* 동적으로 생성될 예정 */}
          </div>

          {/* 총액 - main.original.js와 동일한 구조 */}
          <div id="cart-total" data-testid="cart-total" className="border-t border-white/10 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                ₩{calculation.totalAmount.toLocaleString()}
              </div>
            </div>
            <div
              id="loyalty-points"
              data-testid="loyalty-points"
              className="mt-2 text-right text-xs text-blue-400"
            >
              적립 포인트: {calculation.points.total}p
            </div>
          </div>

          {/* 화요일 특별 할인 - main.original.js와 동일한 구조 */}
          {calculation.isTuesday && (
            <div
              id="tuesday-special"
              data-testid="tuesday-special"
              className="mt-4 rounded-lg bg-white/10 p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xs">🎉</span>
                <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 체크아웃 버튼 - main.original.js와 동일한 구조 */}
      <button className="tracking-super-wide mt-6 w-full cursor-pointer bg-white py-4 text-sm font-normal uppercase text-black transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>

      {/* 하단 메시지 - main.original.js와 동일한 구조 */}
      <p className="text-2xs mt-4 text-center leading-relaxed text-white/60">
        Free shipping on all orders.
        <br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </>
  );
};

export default memo(OrderSummary);
