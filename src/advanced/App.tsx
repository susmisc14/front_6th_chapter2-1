import React, { useEffect } from "react";
import Cart from "./components/Cart/Cart";
import OrderSummary from "./components/OrderSummary/OrderSummary";
import ProductSelector from "./components/ProductSelector/ProductSelector";
import { AppProvider, useAppContext } from "./context/AppContext";

const AppContent: React.FC = () => {
  const { state } = useAppContext();

  // 아이템 수 업데이트
  useEffect(() => {
    const itemCountElement = document.getElementById("item-count");
    if (itemCountElement) {
      const totalItems = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
      itemCountElement.textContent = `🛍️ ${totalItems} items in cart`;
    }
  }, [state.cartItems]);

  const handleHelpToggle = () => {
    const modal = document.getElementById("help-modal");
    const slidePanel = document.getElementById("slide-panel");

    if (modal && slidePanel) {
      modal.classList.toggle("hidden");
      slidePanel.classList.toggle("translate-x-full");
    }
  };

  const handleModalClose = (e: React.MouseEvent) => {
    const modal = document.getElementById("help-modal");
    const slidePanel = document.getElementById("slide-panel");

    if (e.target === e.currentTarget && modal && slidePanel) {
      modal.classList.add("hidden");
      slidePanel.classList.add("translate-x-full");
    }
  };

  return (
    <>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="tracking-extra-wide mb-2 text-xs font-medium uppercase">
          🛒 Hanghae Online Store
        </h1>
        <div className="text-5xl leading-none tracking-tight">Shopping Cart</div>
        <p id="item-count" className="mt-3 text-sm font-normal text-gray-500">
          🛍️ 0 items in cart
        </p>
      </div>

      {/* 메인 컨텐츠 - main.original.js와 동일한 레이아웃 */}
      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[1fr_360px]">
        {/* 왼쪽 컬럼 - 상품 선택 및 장바구니 */}
        <div className="overflow-y-auto border border-gray-200 bg-white p-8">
          <ProductSelector />
          <Cart />
        </div>

        {/* 오른쪽 컬럼 - 주문 요약 (main.original.js와 동일한 검은색 배경) */}
        <div className="flex flex-col bg-black p-8 text-white">
          <OrderSummary />
        </div>
      </div>

      {/* 도움말 버튼 - main.original.js와 동일한 SVG 아이콘 */}
      <button
        id="help-toggle"
        data-testid="help-toggle"
        onClick={handleHelpToggle}
        className="fixed right-4 top-4 z-50 rounded-full bg-black p-3 text-white transition-colors hover:bg-gray-900"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </button>

      {/* 도움말 모달 - main.original.js와 동일한 구조 */}
      <div
        id="help-modal"
        data-testid="manual-overlay"
        onClick={handleModalClose}
        className="fixed inset-0 z-40 hidden bg-black/50 transition-opacity duration-300"
      >
        <div
          id="slide-panel"
          data-testid="manual-column"
          className="fixed right-0 top-0 h-full w-80 translate-x-full transform bg-white p-6 shadow-2xl transition-transform duration-300"
        >
          <button className="absolute right-4 top-4 text-gray-500 hover:text-black">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <h2 className="mb-4 text-xl font-bold">📖 이용 안내</h2>

          <div className="mb-6">
            <h3 className="mb-3 text-base font-bold">💰 할인 정책</h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-100 p-3">
                <p className="mb-1 text-sm font-semibold">개별 상품</p>
                <p className="pl-2 text-xs text-gray-700">
                  • 키보드 10개↑: 10%
                  <br />
                  • 마우스 10개↑: 15%
                  <br />
                  • 모니터암 10개↑: 20%
                  <br />• 스피커 10개↑: 25%
                </p>
              </div>

              <div className="rounded-lg bg-gray-100 p-3">
                <p className="mb-1 text-sm font-semibold">전체 수량</p>
                <p className="pl-2 text-xs text-gray-700">• 30개 이상: 25%</p>
              </div>

              <div className="rounded-lg bg-gray-100 p-3">
                <p className="mb-1 text-sm font-semibold">특별 할인</p>
                <p className="pl-2 text-xs text-gray-700">
                  • 화요일: +10%
                  <br />
                  • ⚡번개세일: 20%
                  <br />• 💝추천할인: 5%
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-base font-bold">🎁 포인트 적립</h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-100 p-3">
                <p className="mb-1 text-sm font-semibold">기본</p>
                <p className="pl-2 text-xs text-gray-700">• 구매액의 0.1%</p>
              </div>

              <div className="rounded-lg bg-gray-100 p-3">
                <p className="mb-1 text-sm font-semibold">추가</p>
                <p className="pl-2 text-xs text-gray-700">
                  • 화요일: 2배
                  <br />
                  • 키보드+마우스: +50p
                  <br />
                  • 풀세트: +100p
                  <br />• 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="mb-1 text-xs font-bold">💡 TIP</p>
            <p className="text-2xs leading-relaxed text-gray-600">
              • 화요일 대량구매 = MAX 혜택
              <br />
              • ⚡+💝 중복 가능
              <br />• 상품4 = 품절
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
