/**
 * UI 템플릿 상수들
 * 모든 UI 템플릿을 중앙화하여 관리
 */

/**
 * 헤더 템플릿
 */
export const HEADER_TEMPLATE = `
  <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
  <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
  <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
`;

/**
 * 화요일 특별 할인 배너 템플릿
 */
export const TUESDAY_BANNER_TEMPLATE = `
  <div class="flex items-center">
    <span class="text-lg mr-2">🎉</span>
    <span class="font-medium">화요일 특별 할인!</span>
    <span class="ml-2">모든 상품 10% 추가 할인</span>
  </div>
`;

/**
 * 상품 선택기 템플릿
 */
export const PRODUCT_SELECTOR_TEMPLATE = `
  <select class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
    <!-- 옵션들은 동적으로 생성됨 -->
  </select>
`;

/**
 * 장바구니 추가 버튼 템플릿
 */
export const ADD_TO_CART_BUTTON_TEMPLATE = `
  <button class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
    Add to Cart
  </button>
`;

/**
 * 재고 정보 템플릿
 */
export const STOCK_INFO_TEMPLATE = `
  <div class="text-xs text-red-500 mt-3 whitespace-pre-line">
    <!-- 재고 정보는 동적으로 업데이트됨 -->
  </div>
`;

/**
 * 장바구니 표시 영역 템플릿
 */
export const CART_DISPLAY_TEMPLATE = `
  <div class="cart-items">
    <!-- 장바구니 아이템들은 동적으로 추가됨 -->
  </div>
`;

/**
 * 그리드 컨테이너 템플릿
 */
export const GRID_CONTAINER_TEMPLATE = `
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
    <!-- 왼쪽/오른쪽 컬럼이 동적으로 추가됨 -->
  </div>
`;

/**
 * 왼쪽 컬럼 템플릿
 */
export const LEFT_COLUMN_TEMPLATE = `
  <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
    <!-- 선택기 컨테이너와 장바구니 표시가 동적으로 추가됨 -->
  </div>
`;

/**
 * 선택기 컨테이너 템플릿
 */
export const SELECTOR_CONTAINER_TEMPLATE = `
  <div class="mb-6 pb-6 border-b border-gray-200">
    <!-- 상품 선택기, 추가 버튼, 재고 정보가 동적으로 추가됨 -->
  </div>
`;

/**
 * 오른쪽 컬럼 템플릿 (개선된 버전)
 */
export const RIGHT_COLUMN_IMPROVED_TEMPLATE = `
  <div class="bg-white p-8 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6">Order Summary</h2>
    <div class="space-y-4">
      <div id="summary-details" class="space-y-3"></div>
      <div class="flex justify-between">
        <span>Subtotal:</span>
        <span id="subtotal">₩0</span>
      </div>
      <div class="flex justify-between">
        <span>Discount:</span>
        <span id="discount-info">₩0</span>
      </div>
      <div class="flex justify-between font-bold text-lg">
        <span>Total:</span>
        <span id="cart-total">₩0</span>
      </div>
    </div>
    <div id="loyalty-points" class="mt-6 p-4 bg-blue-50 rounded-lg" style="display: none;">
      <h3 class="font-semibold text-blue-800 mb-2">🎁 Loyalty Points</h3>
      <p class="text-sm text-blue-600">You'll earn: <span id="points-amount">0p</span></p>
    </div>
  </div>
`;

/**
 * 도움말 토글 버튼 템플릿
 */
export const HELP_TOGGLE_BUTTON_TEMPLATE = `
  <button class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
    ❓
  </button>
`;

/**
 * 도움말 모달 템플릿 (개선된 버전)
 */
export const HELP_MODAL_IMPROVED_TEMPLATE = `
  <div class="bg-white p-8 rounded-lg max-w-md mx-4">
    <h3 class="text-xl font-bold mb-4">🛒 Shopping Cart Help</h3>
    <div class="space-y-3 text-sm">
      <p><strong>Add Items:</strong> Select a product and click "Add to Cart"</p>
      <p><strong>Change Quantity:</strong> Use +/- buttons to adjust quantity</p>
      <p><strong>Remove Items:</strong> Click "Remove" button to delete items</p>
      <p><strong>Discounts:</strong> Automatic discounts apply based on quantity and special offers</p>
      <p><strong>Points:</strong> Earn loyalty points on every purchase</p>
    </div>
    <button id="close-help" class="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Close</button>
  </div>
`;

/**
 * 슬라이드 패널 템플릿
 */
export const SLIDE_PANEL_TEMPLATE = `
  <div class="fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out">
    <!-- 슬라이드 패널 내용은 동적으로 추가됨 -->
  </div>
`;

/**
 * 장바구니 아이템 템플릿
 */
export const CART_ITEM_TEMPLATE = `
  <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
    <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
  </div>
  <div>
    <h3 class="text-base font-normal mb-1 tracking-tight">{{productName}}</h3>
    <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
    <p class="text-xs text-black mb-3">{{priceDisplay}}</p>
    <div class="flex items-center gap-2">
      <button class="quantity-change text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded" data-change="-1" data-product-id="{{productId}}">-</button>
      <span class="quantity-number text-sm font-medium">1</span>
      <button class="quantity-change text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded" data-change="1" data-product-id="{{productId}}">+</button>
      <button class="remove-item text-xs bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded ml-2" data-product-id="{{productId}}">Remove</button>
    </div>
  </div>
  <div class="text-right">
    <p class="text-sm font-medium">{{priceDisplay}}</p>
  </div>
`;

/**
 * 장바구니 아이템 컨테이너 템플릿
 */
export const CART_ITEM_CONTAINER_TEMPLATE = `
  <div id="{{productId}}" class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
    {{cartItemContent}}
  </div>
`;

/**
 * 가격 표시 템플릿 (할인 없음)
 */
export const PRICE_DISPLAY_NORMAL_TEMPLATE = `
  <span>₩{{price}}</span>
`;

/**
 * 가격 표시 템플릿 (번개세일)
 */
export const PRICE_DISPLAY_SALE_TEMPLATE = `
  <span class="line-through text-gray-400">₩{{originalPrice}}</span> 
  <span class="text-red-500">₩{{salePrice}}</span>
`;

/**
 * 가격 표시 템플릿 (추천할인)
 */
export const PRICE_DISPLAY_SUGGEST_TEMPLATE = `
  <span class="line-through text-gray-400">₩{{originalPrice}}</span> 
  <span class="text-blue-500">₩{{salePrice}}</span>
`;

/**
 * 가격 표시 템플릿 (번개세일 + 추천할인)
 */
export const PRICE_DISPLAY_SUPER_SALE_TEMPLATE = `
  <span class="line-through text-gray-400">₩{{originalPrice}}</span> 
  <span class="text-purple-600">₩{{salePrice}}</span>
`;

/**
 * 재고 부족 메시지 템플릿
 */
export const STOCK_LOW_MESSAGE_TEMPLATE = `
  <div class="text-xs text-red-500 mt-3 whitespace-pre-line">
    {{stockMessages}}
  </div>
`;

/**
 * 재고 부족 아이템 템플릿
 */
export const STOCK_LOW_ITEM_TEMPLATE = `
  {{productName}}: 재고 부족 ({{stockCount}}개 남음)
`;

/**
 * 품절 아이템 템플릿
 */
export const STOCK_OUT_ITEM_TEMPLATE = `
  {{productName}}: 품절
`;

/**
 * 화요일 특별 할인 표시 템플릿
 */
export const TUESDAY_SPECIAL_DISPLAY_TEMPLATE = `
  <div class="bg-purple-500/20 rounded-lg p-3">
    <div class="flex justify-between items-center mb-1">
      <span class="text-xs uppercase tracking-wide text-purple-400">화요일 특별 할인</span>
      <span class="text-sm font-medium text-purple-400">-10%</span>
    </div>
    <div class="text-2xs text-gray-300">화요일에만 적용되는 추가 할인!</div>
  </div>
`;

/**
 * 주문 요약 기본 템플릿
 */
export const ORDER_SUMMARY_BASE_TEMPLATE = `
  <div class="flex justify-between text-sm tracking-wide">
    <span>Items</span>
    <span>{{itemCount}}</span>
  </div>
  <div class="border-t border-white/10 my-3"></div>
  <div class="flex justify-between text-sm tracking-wide">
    <span>Subtotal</span>
    <span>₩{{subtotal}}</span>
  </div>
`;

/**
 * 할인 항목 템플릿
 */
export const DISCOUNT_ITEM_TEMPLATE = `
  <div class="flex justify-between text-sm tracking-wide {{colorClass}}">
    <span class="text-xs">{{discountText}}</span>
    <span class="text-xs">-{{discountRate}}%</span>
  </div>
`;

/**
 * 배송 정보 템플릿
 */
export const SHIPPING_INFO_TEMPLATE = `
  <div class="flex justify-between text-sm tracking-wide text-gray-400">
    <span>Shipping</span>
    <span>Free</span>
  </div>
`;

/**
 * 할인 정보 박스 템플릿
 */
export const DISCOUNT_INFO_BOX_TEMPLATE = `
  <div class="bg-green-500/20 rounded-lg p-3">
    <div class="flex justify-between items-center mb-1">
      <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
      <span class="text-sm font-medium text-green-400">{{discountRate}}%</span>
    </div>
    <div class="text-2xs text-gray-300">₩{{savedAmount}} 할인되었습니다</div>
  </div>
`;

/**
 * 오른쪽 컬럼 템플릿
 */
export const RIGHT_COLUMN_TEMPLATE = `
  <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
  <div class="flex-1 flex flex-col">
    <div id="summary-details" class="space-y-3"></div>
    <div class="mt-auto">
      <div id="discount-info" class="mb-4"></div>
      <div id="cart-total" class="pt-5 border-t border-white/10">
        <div class="flex justify-between items-baseline">
          <span class="text-sm uppercase tracking-wider">Total</span>
          <div class="text-2xl tracking-tight">₩0</div>
        </div>
        <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right" style="display: none;">적립 포인트: 0p</div>
      </div>
      <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
        <div class="flex items-center gap-2">
          <span class="text-2xs">🎉</span>
          <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
        </div>
      </div>
    </div>
  </div>
  <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
    Proceed to Checkout
  </button>
  <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
    Free shipping on all orders.<br>
    <span id="points-notice">Earn loyalty points with purchase.</span>
  </p>
`;

/**
 * 도움말 모달 템플릿
 */
export const HELP_MODAL_TEMPLATE = `
  <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  </button>
  <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
 
  <div class="mb-6">
    <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
    <div class="space-y-3">
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">개별 상품</p>
        <p class="text-gray-700 text-xs pl-2">
          • 키보드 10개↑: 10%<br>
          • 마우스 10개↑: 15%<br>
          • 모니터암 10개↑: 20%<br>
          • 스피커 10개↑: 25%
        </p>
      </div>
     
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">전체 수량</p>
        <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
      </div>
     
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">특별 할인</p>
        <p class="text-gray-700 text-xs pl-2">
          • 화요일: +10%<br>
          • ⚡번개세일: 20%<br>
          • 💝추천할인: 5%
        </p>
      </div>
    </div>
  </div>
 
  <div class="mb-6">
    <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
    <div class="space-y-3">
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">기본</p>
        <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
      </div>
     
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">추가</p>
        <p class="text-gray-700 text-xs pl-2">
          • 화요일: 2배<br>
          • 키보드+마우스: +50p<br>
          • 풀세트: +100p<br>
          • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
        </p>
      </div>
    </div>
  </div>
 
  <div class="border-t border-gray-200 pt-4 mt-4">
    <p class="text-xs font-bold mb-1">💡 TIP</p>
    <p class="text-2xs text-gray-600 leading-relaxed">
      • 화요일 대량구매 = MAX 혜택<br>
      • ⚡+💝 중복 가능<br>
      • 상품4 = 품절
    </p>
  </div>
`;

/**
 * 도움말 토글 버튼 템플릿
 */
export const HELP_TOGGLE_TEMPLATE = `
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
`;

/**
 * 헤더 템플릿 (개선된 버전)
 */
export const HEADER_IMPROVED_TEMPLATE = `
  <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
  <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
  <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
`;

/**
 * 상품 선택기 템플릿 (개선된 버전)
 */
export const PRODUCT_SELECTOR_IMPROVED_TEMPLATE = `
  <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
    <!-- 옵션들은 동적으로 생성됨 -->
  </select>
`;

/**
 * 장바구니 추가 버튼 템플릿 (개선된 버전)
 */
export const ADD_TO_CART_BUTTON_IMPROVED_TEMPLATE = `
  <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
    Add to Cart
  </button>
`;

/**
 * 재고 정보 템플릿 (개선된 버전)
 */
export const STOCK_INFO_IMPROVED_TEMPLATE = `
  <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line">
    <!-- 재고 정보는 동적으로 업데이트됨 -->
  </div>
`;

/**
 * 장바구니 표시 영역 템플릿 (개선된 버전)
 */
export const CART_DISPLAY_IMPROVED_TEMPLATE = `
  <div id="cart-items" class="cart-items">
    <!-- 장바구니 아이템들은 동적으로 추가됨 -->
  </div>
`;

/**
 * 선택기 컨테이너 템플릿 (개선된 버전)
 */
export const SELECTOR_CONTAINER_IMPROVED_TEMPLATE = `
  <div class="mb-6 pb-6 border-b border-gray-200">
    <!-- 상품 선택기, 추가 버튼, 재고 정보가 동적으로 추가됨 -->
  </div>
`;

/**
 * 왼쪽 컬럼 템플릿 (개선된 버전)
 */
export const LEFT_COLUMN_IMPROVED_TEMPLATE = `
  <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
    <!-- 선택기 컨테이너와 장바구니 표시가 동적으로 추가됨 -->
  </div>
`;

/**
 * 그리드 컨테이너 템플릿 (개선된 버전)
 */
export const GRID_CONTAINER_IMPROVED_TEMPLATE = `
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
    <!-- 왼쪽/오른쪽 컬럼이 동적으로 추가됨 -->
  </div>
`;

/**
 * 도움말 토글 버튼 템플릿 (개선된 버전)
 */
export const HELP_TOGGLE_BUTTON_IMPROVED_TEMPLATE = `
  <button id="help-toggle" class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
    ❓
  </button>
`;

/**
 * 슬라이드 패널 템플릿 (개선된 버전)
 */
export const SLIDE_PANEL_IMPROVED_TEMPLATE = `
  <div class="fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out">
    <!-- 슬라이드 패널 내용은 동적으로 추가됨 -->
  </div>
`;

/**
 * 상품 옵션 템플릿 (정상 상품)
 */
export const PRODUCT_OPTION_NORMAL_TEMPLATE = `
  <option value="{{productId}}">{{displayText}}</option>
`;

/**
 * 상품 옵션 템플릿 (품절 상품)
 */
export const PRODUCT_OPTION_SOLD_OUT_TEMPLATE = `
  <option value="{{productId}}" disabled>{{displayText}}</option>
`;

/**
 * 상품 옵션 템플릿 (재고 부족)
 */
export const PRODUCT_OPTION_LOW_STOCK_TEMPLATE = `
  <option value="{{productId}}">{{displayText}}</option>
`;

/**
 * 재고 경고 옵션 템플릿
 */
export const STOCK_WARNING_OPTION_TEMPLATE = `
  <option disabled>{{warningMessage}}</option>
`;

/**
 * 헤더 컨테이너 템플릿
 */
export const HEADER_CONTAINER_TEMPLATE = `
  <div class="mb-8">
    {{headerContent}}
  </div>
`;

/**
 * 화요일 배너 컨테이너 템플릿
 */
export const TUESDAY_BANNER_CONTAINER_TEMPLATE = `
  <div id="tuesday-special" class="hidden bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg mb-4">
    {{bannerContent}}
  </div>
`;

/**
 * 도움말 모달 컨테이너 템플릿
 */
export const HELP_MODAL_CONTAINER_TEMPLATE = `
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
    {{modalContent}}
  </div>
`;

/**
 * 슬라이드 패널 컨테이너 템플릿
 */
export const SLIDE_PANEL_CONTAINER_TEMPLATE = `
  <div class="fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out">
    {{panelContent}}
  </div>
`;
