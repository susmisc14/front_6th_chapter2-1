# main.basic.js 리팩토링 계획서

## 📋 개요

현재 `main.basic.js` 파일은 763줄의 단일 파일로 구성되어 있으며, 모든 기능이 하나의 파일에 집중되어 있습니다. 이는 유지보수성과 테스트 가능성을 저해하는 구조입니다.

**🎯 리팩토링 기준점**: `main.original.js` (787줄)
- 모든 리팩토링은 `main.original.js`의 기능과 **완전히 동일한** 동작 보장
- 시각적 표현, 사용자 상호작용, 계산 로직 모든 면에서 **픽셀 단위 일치**
- 리팩토링 후에도 원본과 **구별할 수 없는** 동일한 사용자 경험 제공

## 🎯 리팩토링 목표

1. **관심사 분리**: UI 로직, 비즈니스 로직, 데이터 관리를 분리
2. **순수 함수화**: 전역 변수 의존성 제거
3. **UI 로직 분리**: Controller 패턴으로 UI 이벤트와 상태 관리 분리
4. **중앙 상태 관리**: StateManager를 통한 일관된 상태 관리
5. **ES6+ 최신 문법**: 모던 JavaScript 문법 적극 활용
6. **테스트 가능성 향상**: 각 기능의 독립적 테스트 가능
7. **코드 가독성 개선**: 명확한 네이밍과 구조화

## 📁 새로운 파일 구조

```
src/
├── basic/
│   ├── main.basic.js (🔥 유일한 엔트리 포인트 - 수정만 가능)
│   ├── controllers/
│   │   ├── CartController.js (장바구니 UI 로직 관리)
│   │   ├── ProductController.js (상품 선택 UI 로직 관리)
│   │   ├── SummaryController.js (주문 요약 UI 로직 관리)
│   │   └── ModalController.js (도움말 모달 UI 로직)
│   ├── components/                       # 템플릿 리터럴 기반 UI 컴포넌트(순수 함수)
│   │   ├── Header.template.js            # 헤더 영역 마크업 생성
│   │   ├── ProductSelector.template.js   # 상품 선택 셀렉터/버튼/재고 알림
│   │   ├── CartItem.template.js          # 장바구니 아이템 라인
│   │   ├── OrderSummary.template.js      # 요약/합계/포인트/할인 블록
│   │   └── Modal.template.js             # 이용 안내 모달
│   ├── services/
│   │   ├── StateManager.js (중앙 상태 관리)
│   │   ├── UIUpdater.js (UI 업데이트 전용 서비스)
│   │   ├── TimerService.js (타이머 관리)
│   │   └── EventBus.js (컴포넌트 간 통신)
│   ├── models/
│   │   ├── CartModel.js (장바구니 비즈니스 로직)
│   │   ├── ProductModel.js (상품 관련 로직)
│   │   ├── DiscountModel.js (할인 정책 로직)
│   │   └── PointsModel.js (포인트 시스템 로직)
│   ├── utils/
│   │   ├── constants.js (상수 정의)
│   │   ├── calculations.js (계산 로직)
│   │   └── formatters.js (포맷팅 유틸)
│   └── data/
│       └── products.js (상품 데이터)
```

**⚠️ 중요**: `main.basic.js`는 새로 생성하지 않고 **기존 파일을 수정**하여 리팩토링합니다.

## 🔧 리팩토링 세부 계획

### 1. 상수 및 데이터 분리

**파일**: `src/basic/data/products.js`
- 상품 목록 데이터 분리
- 상품 ID 상수 정의
- 초기 재고 정보 관리

**파일**: `src/basic/utils/constants.js`
- 할인율 상수
- 포인트 적립률 상수
- UI 관련 상수

### 2. UI 로직과 비즈니스 로직 분리

**파일**: `src/basic/controllers/ProductController.js`
```javascript
class ProductController {
  constructor({ stateManager, productModel, uiUpdater }) {
    this.stateManager = stateManager;
    this.productModel = productModel;
    this.uiUpdater = uiUpdater;
    this.bindEvents();
  }

  // UI 이벤트 처리 및 상태 관리 (ES6+ 화살표 함수)
  handleProductSelection = (productId) => {
    const product = this.stateManager.getProduct(productId);
    if (product?.id) {
      this.stateManager.setSelectedProduct(product);
      this.uiUpdater.updateProductInfo(product);
    }
  }
  
  // 구조 분해 할당 활용
  handleStockUpdate = ({ productId, newStock }) => {
    const updatedProducts = this.productModel.updateStock(productId, newStock);
    this.stateManager.updateProducts(updatedProducts);
  }
  
  bindEvents() {
    // DOM 이벤트 바인딩 (화살표 함수로 this 바인딩 자동 처리)
    document.getElementById('product-select')
      ?.addEventListener('change', (e) => this.handleProductSelection(e.target.value));
  }
}
```

**파일**: `src/basic/controllers/CartController.js`
```javascript
class CartController {
  #eventHandlers = new Map(); // Private 필드
  
  constructor({ stateManager, cartModel, uiUpdater }) {
    this.stateManager = stateManager;
    this.cartModel = cartModel;
    this.uiUpdater = uiUpdater;
    this.bindEvents();
  }

  // 장바구니 UI 이벤트 처리 (구조 분해 할당)
  handleAddToCart = async (productId) => {
    try {
      const { success, cart, message } = await this.cartModel.addItem(productId);
      
      if (success) {
        this.stateManager.updateCart(cart);
        this.uiUpdater.updateCartDisplay(cart);
      } else {
        this.uiUpdater.showError(message);
      }
    } catch (error) {
      this.uiUpdater.showError(`장바구니 추가 실패: ${error.message}`);
    }
  }

  // Rest 매개변수와 스프레드 연산자 활용
  handleQuantityChange = (productId, newQuantity, ...options) => {
    const updateConfig = { productId, newQuantity, ...options };
    const { cart, summary } = this.cartModel.updateQuantity(updateConfig);
    
    // 객체 축약 표현
    this.stateManager.setState({ cart, summary });
    this.uiUpdater.updateCartDisplay(cart);
  }

  // 배열 메서드 체이닝
  handleBulkUpdate = (updates) => {
    const validUpdates = updates
      .filter(({ quantity }) => quantity > 0)
      .map(({ productId, quantity }) => ({ productId, quantity }));
    
    this.cartModel.bulkUpdate(validUpdates);
  }

  destroy() {
    // Map을 활용한 이벤트 정리
    this.#eventHandlers.forEach((handler, element) => {
      element.removeEventListener('click', handler);
    });
    this.#eventHandlers.clear();
  }
}
```

**파일**: `src/basic/models/DiscountModel.js`
```javascript
class DiscountModel {
  // 상수를 static 필드로 정의 (ES6+)
  static DISCOUNT_RATES = {
    TUESDAY: 0.1,
    BULK_PURCHASE: 0.25,
    INDIVIDUAL_ITEM: 0.15
  };
  
  static THRESHOLDS = {
    BULK_QUANTITY: 30,
    INDIVIDUAL_QUANTITY: 10
  };

  #cache = new Map(); // Private 필드로 캐시

  // 할인 정책 계산 (순수 함수, 구조 분해 할당)
  calculateDiscount = (cart, currentDate = new Date()) => {
    const cacheKey = `${JSON.stringify(cart)}-${currentDate.toDateString()}`;
    
    // 캐시된 결과 반환 (Map 활용)
    if (this.#cache.has(cacheKey)) {
      return this.#cache.get(cacheKey);
    }

    let discount = 0;
    
    // 화요일 할인 (요일 기반) - Optional chaining
    if (currentDate?.getDay() === 2) {
      discount += DiscountModel.DISCOUNT_RATES.TUESDAY;
    }
    
    // 대량구매 할인 (배열 메서드 활용)
    const totalQuantity = cart.reduce((sum, { quantity }) => sum + quantity, 0);
    if (totalQuantity >= DiscountModel.THRESHOLDS.BULK_QUANTITY) {
      discount += DiscountModel.DISCOUNT_RATES.BULK_PURCHASE;
    }
    
    // 결과 캐시 후 반환
    this.#cache.set(cacheKey, discount);
    return discount;
  }

  // 개별 상품 할인 계산 (배열 메서드 체이닝, 스프레드 연산자)
  calculateItemDiscounts = (cart) => {
    return cart.map(item => ({
      ...item,
      discount: item.quantity >= DiscountModel.THRESHOLDS.INDIVIDUAL_QUANTITY 
        ? DiscountModel.DISCOUNT_RATES.INDIVIDUAL_ITEM 
        : 0
    }));
  }

  // 할인 타입별 계산 (객체 구조 분해, 기본 매개변수)
  calculateDiscountByType = ({ 
    cart, 
    discountType = 'ALL', 
    date = new Date() 
  } = {}) => {
    const discountStrategies = {
      TUESDAY: () => date.getDay() === 2 ? DiscountModel.DISCOUNT_RATES.TUESDAY : 0,
      BULK: () => {
        const total = cart.reduce((sum, { quantity }) => sum + quantity, 0);
        return total >= DiscountModel.THRESHOLDS.BULK_QUANTITY 
          ? DiscountModel.DISCOUNT_RATES.BULK_PURCHASE : 0;
      },
      ALL: () => this.calculateDiscount(cart, date)
    };

    return discountStrategies[discountType]?.() ?? 0;
  }

  // 캐시 정리
  clearCache = () => this.#cache.clear();
}
```

**파일**: `src/basic/services/StateManager.js`
```javascript
class StateManager {
  #state = { // Private 필드로 상태 보호
    products: [],
    cart: [],
    totalAmount: 0,
    bonusPoints: 0,
    selectedProduct: null
  };
  
  #observers = new Set(); // Set으로 중복 방지
  #stateHistory = []; // 상태 이력 관리

  constructor(initialState = {}) {
    // 스프레드 연산자로 초기 상태 설정
    this.#state = { ...this.#state, ...initialState };
    Object.freeze(this.#state); // 불변성 보장
  }

  // Getter로 상태 접근 (읽기 전용)
  get state() {
    return { ...this.#state }; // 복사본 반환
  }

  // 구조 분해 할당으로 특정 상태만 반환
  getState = (keys = []) => {
    if (keys.length === 0) return this.state;
    
    return keys.reduce((result, key) => ({
      ...result,
      [key]: this.#state[key]
    }), {});
  }

  // 불변성을 보장하는 상태 업데이트
  setState = (newState) => {
    const prevState = { ...this.#state };
    this.#state = { ...this.#state, ...newState };
    
    // 히스토리 저장 (최대 10개)
    this.#stateHistory.push(prevState);
    if (this.#stateHistory.length > 10) {
      this.#stateHistory.shift();
    }
    
    // 변경된 키들만 알림
    const changedKeys = Object.keys(newState);
    this.#notifyObservers('STATE_UPDATED', { newState, changedKeys });
  }

  // 개별 상태 업데이트 메서드들 (화살표 함수)
  updateCart = (newCart) => {
    this.setState({ cart: [...newCart] }); // 배열 복사
    this.#notifyObservers('CART_UPDATED', newCart);
  }

  updateProducts = (newProducts) => {
    this.setState({ products: [...newProducts] });
    this.#notifyObservers('PRODUCTS_UPDATED', newProducts);
  }

  // 배열 메서드로 안전한 아이템 추가/제거
  addCartItem = (item) => {
    const existingIndex = this.#state.cart.findIndex(({ id }) => id === item.id);
    
    let newCart;
    if (existingIndex >= 0) {
      // 기존 아이템 수량 업데이트
      newCart = this.#state.cart.map((cartItem, index) => 
        index === existingIndex 
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    } else {
      // 새 아이템 추가
      newCart = [...this.#state.cart, { ...item }];
    }
    
    this.updateCart(newCart);
  }

  removeCartItem = (itemId) => {
    const newCart = this.#state.cart.filter(({ id }) => id !== itemId);
    this.updateCart(newCart);
  }

  // Observer 패턴 (Set 활용)
  subscribe = (observer) => {
    this.#observers.add(observer);
    
    // Unsubscribe 함수 반환
    return () => this.#observers.delete(observer);
  }

  #notifyObservers = (eventType, data) => {
    // Set 이터레이터로 관찰자들에게 알림
    for (const observer of this.#observers) {
      if (typeof observer.update === 'function') {
        observer.update(eventType, data);
      }
    }
  }

  // 상태 롤백 기능
  rollback = (steps = 1) => {
    if (this.#stateHistory.length >= steps) {
      const targetState = this.#stateHistory[this.#stateHistory.length - steps];
      this.#state = { ...targetState };
      this.#stateHistory.splice(-steps); // 히스토리에서 제거
      this.#notifyObservers('STATE_ROLLBACK', this.#state);
    }
  }

  // 리소스 정리
  cleanup = () => {
    this.#observers.clear();
    this.#stateHistory.length = 0;
  }
}
```

### 3. UI 업데이트 서비스 구현

**파일**: `src/basic/services/UIUpdater.js`
```javascript
class UIUpdater {
  #elements = new Map(); // Private Map으로 DOM 요소 캐싱
  #updateQueue = new Set(); // 업데이트 대기열

  constructor() {
    this.#cacheElements();
  }

  // DOM 요소 캐싱 (Map 활용)
  #cacheElements = () => {
    const elementIds = [
      'cart-items', 'cart-total', 'item-count', 
      'summary-details', 'loyalty-points', 'product-select'
    ];
    
    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        this.#elements.set(id, element);
      }
    });
  }

  // 안전한 DOM 요소 접근
  #getElement = (id) => this.#elements.get(id);

  // 장바구니 UI 업데이트 (템플릿 리터럴, 배열 메서드)
  updateCartDisplay = (cartData = []) => {
    const cartElement = this.#getElement('cart-items');
    if (!cartElement) return;

    const cartHTML = cartData
      .map(({ id, name, quantity, price }) => `
        <div class="item-${id}" data-product-id="${id}">
          <div class="flex justify-between items-center p-4 border-b">
            <div class="flex-1">
              <h3 class="font-medium">${name}</h3>
              <div class="flex items-center gap-2 mt-2">
                <button class="quantity-change" data-product-id="${id}" data-action="decrease">-</button>
                <span class="quantity-number">${quantity}</span>
                <button class="quantity-change" data-product-id="${id}" data-action="increase">+</button>
              </div>
            </div>
            <div class="text-right">
              <div class="font-medium">₩${(price * quantity).toLocaleString()}</div>
              <button class="remove-item text-red-500" data-product-id="${id}">제거</button>
            </div>
          </div>
        </div>
      `)
      .join('');

    cartElement.innerHTML = cartHTML;
  }

  // 주문 요약 UI 업데이트 (구조 분해 할당)
  updateSummary = ({ cart = [], discount = 0, points = 0, total = 0 } = {}) => {
    this.#updateSummaryDetails(cart, discount);
    this.#updateTotal(total);
    this.#updatePoints(points);
    this.#updateItemCount(cart.length);
  }

  // Private 메서드들 (# 접두사)
  #updateSummaryDetails = (cart, discount) => {
    const summaryElement = this.#getElement('summary-details');
    if (!summaryElement) return;

    // 배열 메서드로 요약 정보 생성
    const itemSummaries = cart
      .filter(({ quantity }) => quantity > 0)
      .map(({ name, quantity, price }) => `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${name} x ${quantity}</span>
          <span>₩${(price * quantity).toLocaleString()}</span>
        </div>
      `)
      .join('');

    summaryElement.innerHTML = `
      ${itemSummaries}
      ${discount > 0 ? `
        <div class="border-t border-white/10 my-3"></div>
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">할인 적용</span>
          <span class="text-xs">-${(discount * 100).toFixed(1)}%</span>
        </div>
      ` : ''}
    `;
  }

  #updateTotal = (amount) => {
    const totalElement = this.#getElement('cart-total')?.querySelector('.text-2xl');
    if (totalElement) {
      totalElement.textContent = `₩${amount.toLocaleString()}`;
    }
  }

  #updatePoints = (points) => {
    const pointsElement = this.#getElement('loyalty-points');
    if (pointsElement) {
      pointsElement.textContent = `적립 포인트: ${points}p`;
      pointsElement.style.display = points > 0 ? 'block' : 'none';
    }
  }

  #updateItemCount = (count) => {
    const countElement = this.#getElement('item-count');
    if (countElement) {
      countElement.textContent = `🛍️ ${count} items in cart`;
    }
  }

  // 에러 표시 (기본 매개변수, 템플릿 리터럴)
  showError = (message, duration = 3000) => {
    const errorElement = document.createElement('div');
    errorElement.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50';
    errorElement.textContent = message;
    
    document.body.appendChild(errorElement);
    
    // 자동 제거
    setTimeout(() => {
      errorElement?.remove();
    }, duration);
  }

  // 배치 업데이트 (성능 최적화)
  batchUpdate = (updates = []) => {
    // requestAnimationFrame으로 DOM 업데이트 최적화
    requestAnimationFrame(() => {
      updates.forEach(({ type, data }) => {
        switch (type) {
          case 'cart':
            this.updateCartDisplay(data);
            break;
          case 'summary':
            this.updateSummary(data);
            break;
          default:
            console.warn(`Unknown update type: ${type}`);
        }
      });
    });
  }

  // 리소스 정리
  cleanup = () => {
    this.#elements.clear();
    this.#updateQueue.clear();
  }
}
```

### 3.5 템플릿 리터럴 기반 UI 컴포넌트 분리 (React-like)

**목표**: `main.basic.js` 내부에 산재한 템플릿 리터럴 HTML을 재사용 가능한 순수 함수 컴포넌트로 분리하여 응집도와 테스트 용이성을 높입니다. 각 컴포넌트는 DOM 조작 없이 문자열만 반환해야 합니다.

**규칙**
- 파일 접미사: `*.template.js`
- 함수 네이밍: `renderXxxTemplate(props)` 형태, 순수 함수(사이드이펙트 금지)
- 입력: 명시적 `props` 객체 (UI 데이터만)
- 출력: 문자열(HTML)만. 이벤트 바인딩/DOM 조작 금지
- 보안: 필요한 경우 안전 이스케이프 유틸을 통과
- 사용: `UIUpdater` 또는 Controller에서 `container.innerHTML = render...()`로만 주입

**예시 파일**
- `src/basic/components/Header.template.js` → 헤더 블록 생성
- `src/basic/components/ProductSelector.template.js` → 셀렉터/버튼/재고 블록 생성
- `src/basic/components/CartItem.template.js` → 장바구니 아이템 라인 생성
- `src/basic/components/OrderSummary.template.js` → 요약/합계/포인트/할인 블록 생성
- `src/basic/components/Modal.template.js` → 이용 안내 모달 생성

**검증 포인트**
- 기존 DOM 구조/클래스명/텍스트가 원본과 바이트 단위로 동일해야 함
- 템플릿 분리 전/후 `basic.test.js` 77개 테스트 전부 통과
- 동기 실행 보존: 템플릿 렌더링은 호출 즉시 문자열 반환

**파일**: `src/basic/controllers/SummaryController.js`
```javascript
class SummaryController {
  constructor(stateManager, discountModel, pointsModel, uiUpdater) {
    this.stateManager = stateManager;
    this.discountModel = discountModel;
    this.pointsModel = pointsModel;
    this.uiUpdater = uiUpdater;
    
    // 상태 변경 구독
    this.stateManager.subscribe(this);
  }

  // StateManager에서 알림 받아 UI 업데이트
  update(eventType, data) {
    switch(eventType) {
      case 'CART_UPDATED':
        this.recalculateAndUpdate();
        break;
      case 'DISCOUNT_APPLIED':
        this.updateDiscountDisplay(data);
        break;
    }
  }

  recalculateAndUpdate() {
    const cart = this.stateManager.getCart();
    const discount = this.discountModel.calculateDiscount(cart, new Date());
    const points = this.pointsModel.calculatePoints(cart);
    
    const summaryData = { cart, discount, points };
    this.uiUpdater.updateSummary(summaryData);
  }
}
```

**파일**: `src/basic/controllers/ModalController.js`
```javascript
class ModalController {
  constructor() {
    this.modalElement = null;
    this.overlayElement = null;
    this.bindEvents();
  }

  // 모달 UI 로직만 담당
  showModal() {
    this.overlayElement.classList.remove('hidden');
    this.modalElement.classList.remove('translate-x-full');
  }

  hideModal() {
    this.overlayElement.classList.add('hidden');
    this.modalElement.classList.add('translate-x-full');
  }
}
```

### 4. 계산 로직 분리

**파일**: `src/basic/utils/calculations.js`
- 할인 계산 함수
- 포인트 계산 함수
- 총액 계산 함수
- **순수 함수로 구현**

**파일**: `src/basic/utils/formatters.js`
- 가격 포맷팅
- 포인트 포맷팅
- 수량 포맷팅
- **DOM 조작 없는 포맷팅**

### 5. 이벤트 관리 및 통신 시스템

**파일**: `src/basic/services/EventBus.js`
```javascript
class EventBus {
  constructor() {
    this.events = new Map();
  }

  // 이벤트 구독
  subscribe(eventType, callback) {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, []);
    }
    this.events.get(eventType).push(callback);
  }

  // 이벤트 발행
  emit(eventType, data) {
    const callbacks = this.events.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // 구독 해제
  unsubscribe(eventType, callback) {
    const callbacks = this.events.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}
```

**파일**: `src/basic/services/TimerService.js`
```javascript
class TimerService {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.timers = [];
  }

  // 번개세일 타이머 (30초마다)
  startLightningTimer() {
    const timerId = setInterval(() => {
      this.eventBus.emit('LIGHTNING_SALE_TRIGGERED', {
        timestamp: Date.now()
      });
    }, 30000);
    
    this.timers.push({ id: timerId, type: 'lightning' });
  }

  // 추천할인 타이머 (60초마다)
  startSuggestionTimer() {
    const timerId = setInterval(() => {
      this.eventBus.emit('SUGGESTION_DISCOUNT_TRIGGERED', {
        timestamp: Date.now()
      });
    }, 60000);
    
    this.timers.push({ id: timerId, type: 'suggestion' });
  }

  // 모든 타이머 정리
  cleanup() {
    this.timers.forEach(timer => {
      clearInterval(timer.id);
    });
    this.timers = [];
  }
}
```

## 🚀 구현 단계

### 📌 즉시 반영 원칙 (PHASE_IMMEDIATE_APPLY)
- 각 Phase 및 서브태스크에서 구현이 완료되는 즉시 `src/basic/main.basic.js`에 변경을 반영합니다.
- 변경 누적 후 일괄 반영 금지. 즉시 반영 후 테스트를 실행해 회귀를 빠르게 감지합니다.
- 동기 실행 보존 원칙과 충돌하는 비동기화(예: async/await, requestAnimationFrame, setTimeout(0))를 도입하지 않습니다.

### Phase 0: 코드 분석 및 정리 (사전 준비)
1. **`main.original.js` 원본 코드 완전 분석**:
   - 함수별 역할과 의존성 파악
   - 전역 변수 사용 패턴 분석
   - DOM 조작 방식 이해
   - 타이머 로직 (번개세일 30초, 추천할인 60초) 상세 분석
   - 이벤트 처리 방식 분석
2. **주석 그룹화**: 기능별로 코드 블록을 주석으로 구분
3. **포맷팅 정리**: 일관된 들여쓰기와 공백 적용
4. **변수명 정리**: 의미가 명확한 변수명으로 개선
5. **로직 흐름 파악**: 데이터 흐름과 상태 변화 추적
6. **원본 대비 현재 `main.basic.js` 차이점 분석**: 리팩토링 대상 명확화

### Phase 0.5: 기술적 리스크 분석 및 인프라 준비 ⚡**[새로 추가]**
1. **`main.original.js` 기준 비동기 로직 분석**: 
   - 원본의 `setTimeout` 기반 번개세일(30초마다) + 추천할인(60초마다) 매핑
   - 타이머 ID 관리 및 정리 전략 수립
   - 전역 상태와 타이머 간 의존성 분석
   - **원본과 동일한 타이밍 보장** 전략 수립
2. **테스트 호환성 검증 (`main.original.js` 기준)**: 
   - 77개 테스트 케이스별 **DOM 의존성 분석**
   - 원본 DOM 구조 유지 필수 요소 식별
   - 테스트 실패 시나리오 예측 및 대응책 마련
3. **상태 의존성 그래프 매핑**: 
   - 전역 변수들(`prodList`, `totalAmt`, `bonusPts` 등) 상호 의존성 분석
   - Controller/Model 분리 시 순환 의존성 발생 가능성 검토
   - 상태 변경 시 렌더링 트리거 순서 정의
4. **이벤트 관리 전략 수립**: 
   - 기존 `addEventListener` + 이벤트 위임 패턴 분석
   - Controller 패턴 도입 시 이벤트 바인딩 타이밍 전략
   - 메모리 누수 방지를 위한 이벤트 정리 계획
5. **하이브리드 모드 설계**: 
   - 기존 전역 함수와 새 Controller/Model의 **점진적 전환 전략**
   - Phase별 호환성 레이어 설계
   - 롤백 시점 및 기준 명확화
6. **원본 동기 실행 보존 (CRITICAL)**:
   - 분석 결과: '번개세일'과 '추천할인' 타이머를 제외한 모든 로직은 동기적으로 동작
   - 요구사항: 리팩토링 후에도 동일한 동기 실행 순서 보존 (이벤트 핸들러, 계산 로직, DOM 업데이트는 호출 즉시 완료)
   - 금지 사항: Promise/async 변환, requestAnimationFrame, setTimeout(0) 등으로의 불필요한 비동기화 금지
   - 테스트 호환성: 동기성 변경 시 테스트 타이밍이 달라져 실패 가능 — 반드시 동기 유지

### Phase 1: 데이터 및 상수 분리
1. 상품 데이터를 별도 파일로 분리
2. 상수 정의 파일 생성 (**UPPER_SNAKE_CASE** 적용)
3. 기존 코드에서 참조하도록 수정
4. **JSDoc 타입 힌트 추가**
5. **🚀 ES6+ 문법 적용**:
   - **`var` → `const`/`let` 전면 교체** (100% 적용)
   - **템플릿 리터럴**로 문자열 처리 개선
   - **객체 축약 표현** 적용
6. **🎨 컨벤션 적용**: 파일명 camelCase, 매직넘버 네이밍

### Phase 2: Models 및 Services 구현
1. **StateManager 우선 구현**: 
   - 중앙 상태 관리 시스템 구축
   - Observer 패턴으로 상태 변경 알림
   - 기존 전역 변수들을 StateManager로 이관
2. **비즈니스 로직 Models 구현**:
   - `CartModel`: 장바구니 비즈니스 로직 (추가/제거/수량변경)
   - `ProductModel`: 상품 관련 로직 (재고 관리, 상품 검색)
   - `DiscountModel`: 할인 정책 로직 (화요일/번개세일/추천할인 통합)
   - `PointsModel`: 포인트 계산 로직 (기본/보너스 포인트)
3. **Services 구현**:
   - `TimerService`: 번개세일/추천할인 타이머 관리
   - `EventBus`: 컴포넌트 간 통신 시스템
   - `UIUpdater`: DOM 업데이트 전용 서비스
4. **🚀 ES6+ 문법 적용**:
   - **화살표 함수** 메서드 우선 적용
   - **구조 분해 할당** 매개변수/반환값 처리
   - **배열 메서드** (`map`, `filter`, `reduce`) 전면 적용
   - **ES6 클래스** 기반 아키텍처 구현
5. **에러 핸들링 로직 추가**
6. **하이브리드 모드 적용**: 기존 전역 함수와 새 Models 병행 운영
7. **🎨 컨벤션 적용**: 
   - 클래스명 PascalCase 적용
   - 일관된 반환 타입 (Result 패턴)
   - 단일 책임 원칙 (SRP) 준수

### Phase 3: Controllers 구현 (UI 로직 분리)
1. **테스트 호환성 검증**: 기존 DOM 구조 유지하면서 Controller 도입
2. **Controllers 구현**:
   - `CartController`: 장바구니 UI 이벤트 처리 - **기존 HTML 구조 완전 일치**
   - `ProductController`: 상품 선택 UI 이벤트 처리 - **기존 드롭다운 동작 보장**
   - `SummaryController`: 주문 요약 UI 로직 - **기존 계산 로직 정확성 유지**
   - `ModalController`: 도움말 모달 UI 로직 - **기존 이벤트 처리 방식 보존**
3. **UIUpdater 서비스 구현**: DOM 업데이트 전용 서비스
4. **🚀 ES6+ 문법 적용**:
   - **Private 필드** (`#`) 캡슐화 강화
   - **스프레드 연산자**로 불변성 상태 업데이트
   - **async/await** 패턴으로 UI 업데이트 최적화
   - **Map/Set** 활용한 이벤트 관리 시스템
5. **이벤트 바인딩 통합**: 각 Controller에서 담당 영역의 이벤트 관리
6. **StateManager와 Controllers 연결**: Observer 패턴으로 상태 동기화
7. **각 Controller별 테스트 통과 확인**: Phase 3 완료 시 77개 테스트 모두 통과
8. **성능 최적화**: 불필요한 UI 업데이트 방지
9. **🎨 컨벤션 적용**:
   - 컨트롤러 파일명 PascalCase (CartController.js)
   - 이벤트 핸들러 handle- 접두사 적용
   - 관련 로직 응집성 확보 (기능별 그룹화)

### Phase 4: 이벤트 시스템 및 통합
1. **EventBus 구현 및 통합**: 컴포넌트 간 통신 시스템 구축
2. **TimerService 구현**: 번개세일/추천할인 타이머를 EventBus와 연동
3. **Controllers와 Services 통합**: 
   - Controllers에서 EventBus 구독
   - Models에서 EventBus로 상태 변경 알림
   - UIUpdater에서 EventBus 이벤트 처리
4. **🚀 ES6+ 문법 적용**:
   - **선택적 체이닝** (`?.`) 안전한 속성 접근
   - **Nullish 병합** (`??`) 기본값 처리
   - **Promise 체이닝** 및 **async/await** 타이머 개선
   - **Map 기반 이벤트 시스템** 성능 최적화
5. **타이머 기반 할인 시스템 연결**: **기존 타이밍과 완전 일치** 보장
6. **이벤트 기반 UI 업데이트**: 상태 변경 시 자동 UI 업데이트
7. **이벤트 리스너 최적화**: 메모리 누수 방지 및 성능 최적화
8. **메모리 누수 검증**: DevTools로 타이머 및 이벤트 리스너 정리 확인
9. **🎨 컨벤션 적용**:
   - 이벤트명 SCREAMING_SNAKE_CASE (CART_UPDATED)
   - 콜백 함수 화살표 함수 지양
   - 이벤트 핸들러 네이밍 일관성

### Phase 5: App Class 아키텍처 도입 (Controller 통합)
1. **ShoppingCartApp 클래스 설계**:
   - 생명주기 관리 (init, start, destroy)
   - Controllers와 Services 조합 및 관리
   - 의존성 주입 패턴 (Controllers, Models, Services 주입)
   - 완벽한 cleanup 메서드 (타이머, 이벤트 리스너 정리)
2. **기존 테스트 호환성 보장**:
   - **`main()` 함수 구조 절대 유지**: 테스트가 `import` 후 바로 DOM 접근
   - `main()` 함수 내부에서 App 인스턴스 생성 및 실행
   - 모든 DOM 요소 ID/클래스 구조 보존
   - 기존 이벤트 처리 방식 완전 호환
3. **🚀 ES6+ 문법 적용** (모던 패턴):
   - **모듈 시스템** (`import`/`export`) 의존성 관리
   - **Static 메서드** 팩토리 패턴 적용
   - **Getter/Setter** 속성 접근 제어
   - **WeakMap/WeakSet** 메모리 효율적 캐싱
4. **Controllers와 Services 통합**:
   - `StateManager`, `EventBus`, `TimerService` → App 인스턴스 속성
   - 각 Controller들을 App에서 생성 및 관리
   - 의존성 주입을 통한 Controllers 간 통신
5. **단계별 전환 전략**:
   - Phase 5a: App 클래스 기본 구조 생성 (`main()` 함수는 그대로 유지)
   - Phase 5b: Controllers와 Services를 App에서 조합
   - Phase 5c: 기존 전역 함수들을 App 메서드로 점진적 이동
   - Phase 5d: 생명주기 메서드 완성 및 cleanup 구현
   - **주의**: 모든 단계에서 `function main() { ... } main();` 패턴 절대 유지
6. **🎨 컨벤션 적용**:
   - 클래스명 PascalCase (ShoppingCartApp)
   - 의존성 주입으로 결합도 감소
   - Controller 조합 패턴 적용
   - 생명주기 메서드 명확한 네이밍

### Phase 6: 메인 파일 정리 및 통합 완성
1. **`main()` 함수 단순화**: App 인스턴스 생성 및 실행만 담당
2. **Controllers와 Services를 App 생성자에서 조합**:
   - StateManager, EventBus, TimerService 인스턴스 생성
   - 각 Model 인스턴스 생성 및 연결
   - 각 Controller 인스턴스 생성 및 의존성 주입
3. **🚀 ES6+ 문법 최종 완성**:
   - **모든 `var` 완전 제거** 및 `const`/`let` 전환 완료
   - **전역 함수** → **클래스 메서드** 완전 이관
   - **레거시 DOM 조작** → **모던 패턴** 전환 완료
   - **ES6+ 문법 적용률 100%** 달성
4. **이벤트 시스템 최종 연결**: 모든 이벤트 핸들러를 Controller로 통합
5. **기존 전역 함수들 완전 제거**: Controllers와 Models로 완전 이관
6. **테스트 호환성 최종 확인**: `main()` 구조 변경 없이 완료

### Phase 7: 품질 보증
1. **ESLint 규칙 적용 및 코드 품질 검사**
2. **각 Controller/Model별 단위 테스트 작성** (기존 테스트와 별도로 추가)
3. **통합 테스트 시나리오 추가** (기존 77개 테스트 외 추가 검증)
4. **문서화 완료 (JSDoc, README)**
5. **최종 회귀 테스트**: `npx vitest run`으로 모든 테스트 통과 확인
6. **성능 벤치마크 비교**: 리팩토링 전후 성능 수치 비교
7. **메모리 누수 최종 검증**: 장시간 실행 테스트로 메모리 안정성 확인

## ✅ 검증 기준

### 🔴 **필수 검증 (실패 시 현재 Phase부터 리팩토링 재시작)**

**⚠️ 리팩토링 기준점: `main.original.js`**
- 모든 검증은 **`main.original.js`를 절대 기준**으로 수행
- 리팩토링된 `main.basic.js`가 원본과 완전히 동일해야 함
- 원본 코드와 **실시간 비교 검증** 필수

1. **테스트 통과**: `npx vitest run`으로 모든 테스트 통과
2. **기능 동일성**: **`main.original.js`와 완전히 동일한 동작**
   - 장바구니 추가/제거/수량 변경 동작 일치
   - 할인 계산 로직 정확성 (화요일, 번개세일, 추천할인)
   - 포인트 적립 계산 정확성 (기본, 세트, 대량구매)
   - 재고 관리 및 알림 동작 일치
   - 타이머 기반 기능 (번개세일 30초, 추천할인 60초) 동작 일치
3. **🎨 스타일 완전 일치**: **`main.original.js`와 픽셀 단위로 동일한** 레이아웃과 스타일
   - 브라우저에서 원본과 리팩토링 버전 **동시 실행 비교** 필수
   - 모든 화면 크기에서 동일한 렌더링 확인
   - 반응형 레이아웃 동작 일치 확인
   - DOM 구조 및 CSS 클래스 완전 일치

### 🟡 **품질 검증**
4. **성능 유지**: 기존과 동일한 성능
5. **코드 품질**: ESLint 규칙 준수, 함수 복잡도 제한
6. **타입 안정성**: JSDoc 타입 힌트 완성도
7. **에러 핸들링**: 예외 상황 처리 검증
8. **메모리 누수**: 이벤트 리스너 정리 확인
9. **🎨 프론트엔드 컨벤션**: Toss 4대 원칙 + nbilly 네이밍 규칙 준수

## 🎯 예상 효과

1. **유지보수성 향상**: 각 기능이 독립적으로 관리됨
2. **테스트 용이성**: 각 Controller와 Model을 독립적으로 테스트 가능
3. **React 마이그레이션 준비**: Controller/Model 패턴으로 이미 구조화됨
4. **코드 가독성**: 명확한 관심사 분리로 이해하기 쉬운 구조
5. **DOM 조작 안정성**: 직접 조작 대신 데이터 기반 렌더링으로 버그 감소
6. **성능 최적화**: 불필요한 DOM 조작 제거로 렌더링 성능 향상
7. **타입 안정성**: JSDoc으로 런타임 에러 감소
8. **에러 복원력**: 체계적인 에러 핸들링으로 안정성 향상
9. **개발자 경험**: 명확한 API와 문서화로 개발 효율성 증대
10. **리팩토링 안정성**: 단계별 접근으로 로직 꼬임 방지

## ⚠️ 주의사항 (절대 원칙)

### 🚨 **절대 금지 사항**
1. **기능 변경 금지**: 동작이나 구현이 바뀌면 안 됨
2. **🎨 레이아웃/스타일 변경 절대 금지**: `main.original.js`의 레이아웃과 스타일에서 **1픽셀도** 벗어나지 말 것
   - HTML 구조 변경 금지
   - CSS 클래스명 변경 금지  
   - 인라인 스타일 변경 금지
   - UI 컴포넌트 배치 변경 금지
   - **명시적 요청이 없는 한 시각적 변경 일체 금지**
3. **📁 새로운 엔트리포인트 생성 절대 금지**: 
   - `main.basic.js` **외에는 절대로** 새로운 엔트리포인트 파일 생성 금지
   - `index.js`, `app.js`, `entry.js` 등 어떤 형태의 엔트리포인트도 생성 금지
   - **오직 `main.basic.js` 파일만** 수정하여 리팩토링 진행
   - Phase 종료 시 `main.basic.js` 최신화 시키고 테스트 진행 
   - 테스트는 여전히 `main.basic.js`를 import하여 동작해야 함
4. **🧪 테스트 코드 절대 수정 금지**: 
   - **`basic.test.js` 파일은 어떤 이유로도 수정 금지**
   - 총 77개의 테스트 케이스가 모두 그대로 통과해야 함
   - 테스트 헬퍼 함수, 어서션, 시나리오 수정 일체 금지
   - 리팩토링은 **테스트 코드 기준**으로 검증되어야 함
   - **테스트가 실패하면 코드를 수정해야 하며, 테스트를 수정해서는 안 됨**
5. **테스트 통과**: 모든 기존 테스트가 통과해야 함

### 📋 **개발 원칙**
5. **순수 함수**: 전역 변수 의존성 제거
6. **DOM 조작 분리**: 직접적인 innerHTML, textContent 조작 지양
7. **Controller 패턴**: UI 로직 분리를 통한 효율적 업데이트 방식 적용
8. **단계별 접근**: 한 번에 모든 것을 바꾸지 말고 단계별로 진행
9. **코드 이해 우선**: 리팩토링 전에 기존 로직을 완전히 파악

## 🚀 **ES6+ 최신 문법 적극 활용**

### 📋 **적용할 ES6+ 문법 목록**

#### **1. 변수 선언 및 스코프**
```javascript
// ❌ 기존 var 사용
var prodList = [...];
var totalAmt = 0;

// ✅ const/let 사용
const PRODUCTS = [...];
let totalAmount = 0;

// ✅ 블록 스코프 활용
{
  const tempCalculation = calculateDiscount();
  // tempCalculation은 이 블록에서만 유효
}
```

#### **2. 화살표 함수 및 함수 개선**
```javascript
// ❌ 기존 function 표현식
document.getElementById('cart-items').addEventListener('click', function(event) {
  handleCartClick(event);
});

// ✅ 화살표 함수 + 간결한 표현
document.getElementById('cart-items').addEventListener('click', (event) => {
  this.handleCartClick(event);
});

// ✅ 기본 매개변수
const calculateDiscount = (totalAmount, discountRate = 0.1) => {
  return totalAmount * discountRate;
};

// ✅ Rest 매개변수
const updateCartItems = (...items) => {
  return items.filter(item => item.quantity > 0);
};
```

#### **3. 구조 분해 할당**
```javascript
// ❌ 기존 방식
const product = this.stateManager.getProduct(productId);
const name = product.name;
const price = product.val;
const quantity = product.q;

// ✅ 객체 구조 분해
const { name, val: price, q: quantity } = this.stateManager.getProduct(productId);

// ✅ 배열 구조 분해
const [firstItem, secondItem, ...restItems] = cartItems;

// ✅ 함수 매개변수 구조 분해
const updateProduct = ({ id, name, price, quantity }) => {
  // 매개변수를 바로 사용 가능
};
```

#### **4. 템플릿 리터럴**
```javascript
// ❌ 문자열 연결
cartDisplay.innerHTML = '<div class="item-' + item.id + '">' + 
  '<span>' + item.name + ' x ' + item.quantity + '</span>' +
  '<span>₩' + item.price.toLocaleString() + '</span>' +
  '</div>';

// ✅ 템플릿 리터럴
cartDisplay.innerHTML = `
  <div class="item-${item.id}">
    <span>${item.name} x ${item.quantity}</span>
    <span>₩${item.price.toLocaleString()}</span>
  </div>
`;

// ✅ 태그드 템플릿 리터럴 (HTML 이스케이프)
const createSafeHTML = (strings, ...values) => {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? escapeHTML(values[i]) : '';
    return result + string + value;
  }, '');
};
```

#### **5. 객체 및 배열 고급 기능**
```javascript
// ✅ 객체 축약 표현
const createCartItem = (id, name, quantity) => {
  return { id, name, quantity }; // { id: id, name: name, quantity: quantity }
};

// ✅ 계산된 속성명
const dynamicKey = 'product_' + productId;
const productState = {
  [dynamicKey]: productData
};

// ✅ 스프레드 연산자
const newCartState = {
  ...currentState,
  cart: [...currentState.cart, newItem]
};

// ✅ 배열 메서드 체이닝
const discountedItems = cartItems
  .filter(item => item.quantity >= 10)
  .map(item => ({ ...item, discount: 0.15 }))
  .reduce((total, item) => total + item.price * item.quantity, 0);
```

#### **6. 클래스 및 모듈**
```javascript
// ✅ ES6 클래스 (기존 function 생성자 대신)
class CartController {
  #privateState = new Map(); // Private 필드
  
  constructor(dependencies) {
    this.stateManager = dependencies.stateManager;
  }
  
  // 정적 메서드
  static createInstance(config) {
    return new CartController(config);
  }
  
  // Getter/Setter
  get cartItems() {
    return this.stateManager.getCart();
  }
  
  set cartItems(items) {
    this.stateManager.updateCart(items);
  }
}

// ✅ 모듈 import/export
export { CartController };
export default StateManager;
import { CartController } from './controllers/CartController.js';
import StateManager from './services/StateManager.js';
```

#### **7. 프로미스 및 비동기 처리**
```javascript
// ❌ 기존 setTimeout 콜백
setTimeout(function() {
  applyLightningSale();
}, 30000);

// ✅ 프로미스 기반
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const startLightningTimer = async () => {
  await delay(30000);
  this.applyLightningSale();
};

// ✅ async/await 패턴
class TimerService {
  async startPeriodicDiscount() {
    try {
      while (this.isActive) {
        await this.delay(30000);
        await this.triggerLightningSale();
      }
    } catch (error) {
      console.error('Timer error:', error);
    }
  }
}
```

#### **8. 현대적 배열/객체 메서드**
```javascript
// ✅ 강력한 배열 메서드
const products = [
  { id: 'p1', category: 'keyboard', inStock: true },
  { id: 'p2', category: 'mouse', inStock: false },
  { id: 'p3', category: 'monitor', inStock: true }
];

// 조건에 맞는 항목 찾기
const availableProduct = products.find(p => p.inStock);
const hasKeyboard = products.some(p => p.category === 'keyboard');
const allInStock = products.every(p => p.inStock);

// ✅ Map/Set 활용
const productCache = new Map();
const uniqueCategories = new Set(products.map(p => p.category));

// ✅ Object 정적 메서드
const productEntries = Object.entries(productData);
const mergedConfig = Object.assign({}, defaultConfig, userConfig);
const clonedProduct = Object.freeze({ ...originalProduct });
```

#### **9. 선택적 체이닝 및 Nullish 병합**
```javascript
// ✅ 옵셔널 체이닝 (ES2020)
const productName = product?.details?.name ?? 'Unknown Product';
const firstCartItem = cart?.[0]?.name;

// ✅ Nullish 병합 연산자
const quantity = userInput ?? defaultQuantity; // null/undefined만 체크
const config = {
  timeout: userTimeout ?? 5000,
  retries: userRetries ?? 3
};
```

### 🎯 **적용 우선순위**

#### **Phase별 ES6+ 문법 도입 계획**

**Phase 1-2: 기본 문법 전환**
- `var` → `const`/`let` 전면 교체 (**100% 적용**)
- 함수 표현식 → 화살표 함수 (**메서드는 화살표 함수 우선**)
- 문자열 연결 → 템플릿 리터럴 (**모든 문자열 조합**)
- `for` 루프 → 배열 메서드 (`map`, `filter`, `forEach`, `reduce`)

**Phase 3-4: 고급 문법 적용**
- 구조 분해 할당 적극 활용 (**매개변수, 객체/배열 접근**)
- 스프레드 연산자로 상태 업데이트 (**불변성 보장**)
- 클래스 기반 Controller/Model 구현 (**Private 필드 포함**)
- `async`/`await`로 타이머 로직 개선 (**콜백 지옥 해결**)

**Phase 5-6: 모던 패턴 적용**
- Private 필드 (`#`) 활용 (**캡슐화 강화**)
- 선택적 체이닝으로 안전한 속성 접근 (**`?.`, `??` 연산자**)
- Map/Set으로 캐시/상태 시스템 구현 (**성능 최적화**)
- 모듈 시스템으로 의존성 관리 (**`import`/`export`**)

### 🎯 **ES6+ 문법 우선순위 매트릭스**

| 문법 카테고리 | 필수 적용 | 권장 적용 | 선택 적용 |
|--------------|----------|----------|----------|
| **변수 선언** | `const`/`let` | - | - |
| **함수** | 화살표 함수 | 기본 매개변수 | Rest/Spread |
| **객체/배열** | 구조 분해 | 스프레드 연산자 | 계산된 속성 |
| **문자열** | 템플릿 리터럴 | - | 태그드 템플릿 |
| **배열 처리** | `map`/`filter` | `find`/`some` | `flatMap` |
| **비동기** | `async`/`await` | Promise 체이닝 | Generator |
| **클래스** | ES6 클래스 | Private 필드 | Static 메서드 |
| **모던 문법** | 선택적 체이닝 | Nullish 병합 | Optional Catch |

### ✅ **ES6+ 문법 적용 검증 체크리스트**

#### **🔴 필수 검증 (100% 적용 필수)**
- [ ] **변수 선언**: `var` 완전 제거, `const`/`let` 적절히 활용
- [ ] **함수**: 화살표 함수 우선 사용, 메서드는 화살표 함수 적용
- [ ] **문자열**: 모든 문자열 연결을 템플릿 리터럴로 전환
- [ ] **배열 처리**: `for` 루프 → `map`/`filter`/`reduce` 전환 완료
- [ ] **클래스**: ES6 클래스 문법, Private 필드 적극 활용

#### **🟡 권장 검증 (80% 이상 적용 권장)**
- [ ] **구조 분해**: 매개변수, 객체/배열 접근에 적극 활용
- [ ] **스프레드 연산자**: 배열/객체 불변성 업데이트에 활용
- [ ] **기본 매개변수**: 함수 매개변수 기본값 설정
- [ ] **비동기**: `async`/`await` 패턴으로 타이머 로직 개선
- [ ] **배열 메서드**: `find`, `some`, `every` 조건 검사에 활용

#### **🟢 선택 검증 (필요시 적용)**
- [ ] **선택적 체이닝**: 안전한 속성 접근 (`?.` 연산자)
- [ ] **Nullish 병합**: 기본값 처리 (`??` 연산자)
- [ ] **Map/Set**: 캐시, 이벤트 관리 시스템에 활용
- [ ] **모듈**: `import`/`export` 의존성 관리 (환경 허용 시)
- [ ] **Static 메서드**: 팩토리 패턴, 유틸리티 메서드
- [ ] **Getter/Setter**: 속성 접근 제어
- [ ] **계산된 속성**: 동적 객체 키 생성

#### **📊 ES6+ 문법 적용률 측정**
```javascript
// 자동화된 검증 스크립트 예시
const ES6_VALIDATION = {
  // 금지 패턴 (0% 허용)
  forbidden: [
    /\bvar\s+/g,                    // var 사용 금지
    /function\s*\(/g,               // function 표현식 지양
    /['"]\s*\+\s*\w+/g,            // 문자열 연결 지양
    /for\s*\(\s*var\s+/g           // for 루프 지양
  ],
  
  // 권장 패턴 (확인 필요)
  recommended: [
    /const\s+\w+\s*=/g,            // const 사용
    /=>\s*\{/g,                    // 화살표 함수 사용
    /`[^`]*\$\{[^}]*\}/g,          // 템플릿 리터럴 사용
    /\.map\(|\.filter\(|\.reduce\(/g, // 배열 메서드 사용
    /\.\.\.\w+/g,                  // 스프레드 연산자 사용
    /\{[^}]*:\s*\w+[^}]*\}/g       // 구조 분해 할당
  ]
};

// Phase별 목표 적용률
const PHASE_TARGETS = {
  'Phase 1-2': { forbidden: 0, recommended: 60 },
  'Phase 3-4': { forbidden: 0, recommended: 80 },
  'Phase 5-6': { forbidden: 0, recommended: 95 }
};
```

## 🎨 **프론트엔드 컨벤션 준수**

### 📋 **적용 우선순위**
1. **Toss 컨벤션 우선**: 가독성, 예측가능성, 응집성, 결합도 4대 원칙
2. **nbilly 컨벤션 보완**: 네이밍 규칙, 파일 구조, 타입 정의 등
3. **상충 시 Toss 우선**: 두 컨벤션이 충돌하는 경우 Toss 우선 적용

### 🎯 **Toss 컨벤션 4대 원칙**

#### 1. **가독성 (Readability)**
```javascript
// ✅ 매직 넘버 네이밍
const LIGHTNING_SALE_INTERVAL_MS = 30000;
const SUGGESTION_INTERVAL_MS = 60000;

// ✅ 복잡한 조건문 네이밍
const discountApplicable = itemQty >= 10 && !item.onSale;
const bulkDiscountEligible = totalQty >= 30;

// ✅ 구현 세부사항 추상화
class ShoppingCartApp {
  // 복잡한 초기화 로직을 메서드로 분리
  initializeTimerSystem() { /* ... */ }
  setupDiscountPolicies() { /* ... */ }
}
```

#### 2. **예측가능성 (Predictability)**
```javascript
// ✅ 일관된 반환 타입 (ValidationResult 패턴)
type TValidationResult = { ok: true } | { ok: false; reason: string };

function validateProductQuantity(qty: number): TValidationResult {
  if (qty <= 0) return { ok: false, reason: '수량은 1개 이상이어야 합니다.' };
  if (qty > 50) return { ok: false, reason: '한 번에 50개까지만 구매 가능합니다.' };
  return { ok: true };
}

// ✅ 단일 책임 원칙 (SRP)
function calculateDiscount(items: TCartItem[]): number {
  // 할인 계산만 수행, 다른 사이드 이펙트 없음
}

function applyDiscountAndLog(items: TCartItem[]): void {
  const discount = calculateDiscount(items); // 계산
  logDiscountApplied(discount); // 로깅 (명시적)
}
```

#### 3. **응집성 (Cohesion)**
```javascript
// ✅ 기능별 디렉토리 구조
src/basic/
├── controllers/
│   ├── useCart.js          // 장바구니 관련 로직만
│   ├── useDiscount.js      // 할인 관련 로직만
│   └── useProducts.js      // 상품 관련 로직만
├── components/
│   ├── CartRenderer.js     // 장바구니 렌더링만
│   └── OrderSummary.js     // 주문 요약만

// ✅ 관련 상수를 로직 근처에 정의
const BULK_DISCOUNT_THRESHOLD = 30;
function calculateBulkDiscount(totalQty: number) {
  return totalQty >= BULK_DISCOUNT_THRESHOLD ? 0.25 : 0;
}
```

#### 4. **결합도 (Coupling)**
```javascript
// ✅ 의존성 주입으로 결합도 감소
class ShoppingCartApp {
  constructor(dependencies = {}) {
    this.discountService = dependencies.discountService || new DiscountService();
    this.cartService = dependencies.cartService || new CartService();
  }
}

// ✅ 상태 관리 분리 (과도한 전역 상태 지양)
function useCartState() { /* 장바구니 상태만 */ }
function useDiscountState() { /* 할인 상태만 */ }
function useProductState() { /* 상품 상태만 */ }
```

### 📝 **nbilly 컨벤션 핵심 규칙**

#### 1. **파일 네이밍**
```javascript
// ✅ React Components: PascalCase
ShoppingCartApp.js
CartRenderer.js
ProductSelector.js

// ✅ Multiple Exports: camelCase  
discountCalculations.js
cartHelpers.js

// ✅ Directories: kebab-case
src/basic/
├── controllers/
├── components/
└── utils/
```

#### 2. **함수 네이밍**
```javascript
// ✅ 모든 함수는 반드시 이름 있어야 함
const initializeApp = function initializeApp() {
  // 디버깅과 프로파일링을 위해 익명 함수 금지
};

// ✅ 이벤트 핸들러: handle- 접두사
const handleAddToCart = function handleAddToCart() { /* ... */ };
const handleQuantityChange = function handleQuantityChange() { /* ... */ };

// ✅ 콜백 props: on- 접두사  
<Button onClick={handleAddToCart}>Add to Cart</Button>
```

#### 3. **타입 정의**
```javascript
// ✅ type 우선 사용, interface는 필요시만
type TCartItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type TDiscountPolicy = {
  threshold: number;
  rate: number;
  type: 'BULK' | 'INDIVIDUAL' | 'SPECIAL';
};

// ✅ PascalCase + T- 접두사
type TShoppingCartState = {
  items: TCartItem[];
  totalAmount: number;
  discountRate: number;
};
```

#### 4. **Boolean 변수**
```javascript
// ✅ 동사 접두사 지양 (is-, has- 등)
let discountApplied = false;    // ❌ isDiscountApplied
let stockAvailable = true;      // ❌ hasStock
let timerActive = false;      2 // ❌ isTimerActive
```

### 🔧 **리팩토링 적용 방법**

#### **Phase별 컨벤션 적용**

**Phase 1-2: 기본 구조**
- 파일 네이밍 규칙 적용 (PascalCase/camelCase)
- 함수 네이밍 규칙 적용 (handle-, on- 접두사)
- 매직 넘버 상수화

**Phase 3-4: 로직 분리**  
- 단일 책임 원칙 적용 (예측가능성)
- 관련 로직 응집성 확보
- 컴포넌트 간 결합도 최소화

**Phase 5-6: 고급 패턴**
- 의존성 주입 패턴 적용
- 타입 안정성 강화 (TValidationResult 등)
- 상태 관리 분리

### ✅ **컨벤션 검증 체크리스트**

#### **Toss 컨벤션 검증**
- [ ] **가독성**: 매직 넘버 네이밍, 복잡한 조건문 분리
- [ ] **예측가능성**: 일관된 반환 타입, 사이드 이펙트 분리  
- [ ] **응집성**: 관련 로직 그룹화, 상수-로직 근접 배치
- [ ] **결합도**: 의존성 주입, 상태 관리 분리

#### **nbilly 컨벤션 검증**
- [ ] **파일명**: PascalCase(컴포넌트), camelCase(유틸), kebab-case(디렉토리)
- [ ] **함수명**: 익명 함수 금지, handle-/on- 접두사 규칙
- [ ] **타입**: type 우선 사용, T- 접두사, PascalCase
- [ ] **변수**: Boolean 동사 접두사 지양

### 🚨 **컨벤션 위반 시 조치**

1. **Phase 완료 후 검증**: 각 단계에서 컨벤션 준수 확인
2. **위반 시 수정**: 다음 Phase 진행 전 반드시 수정

## 🔧 추가 개선 사항 (개발자 관점)

### 1. **타입 안정성 강화**
- JSDoc 주석 추가로 타입 힌트 제공
- 함수 시그니처 명확화
- 매개변수 검증 로직 추가

### 2. **에러 핸들링 개선**
- 각 Controller/Model에서 에러 상태 관리
- UIUpdater에서 에러 바운더리 패턴 적용
- 사용자 친화적 에러 메시지

### 3. **성능 최적화**
- 불필요한 재렌더링 방지 (메모이제이션)
- 이벤트 리스너 최적화 (디바운싱/쓰로틀링)
- 메모리 누수 방지 (이벤트 리스너 정리)

### 4. **테스트 전략 강화**
- 각 Controller/Model별 단위 테스트 추가
- UIUpdater 서비스 테스트
- 통합 테스트 시나리오 추가

### 5. **코드 품질 개선**
- 함수 복잡도 제한 (Cyclomatic Complexity)
- 네이밍 컨벤션 통일
- **코드 가독성 향상**: 주석과 포맷팅 개선
- **로직 이해도 증대**: 복잡한 로직의 단계별 분석

### 6. **문서화 강화**
- 각 Controller/Model의 사용법 예제
- 컴포넌트 API 문서
- 마이그레이션 가이드
- **코드 분석 문서**: 기존 로직의 상세 분석 결과

## 🔐 **리팩토링 체크리스트**

### ✅ **시작 전 필수 확인**
- [ ] **`main.original.js` 기준점 확정**: 원본 코드 동작 및 시각적 모습 확인
- [ ] `main.original.js`의 시각적 모습을 스크린샷으로 저장
- [ ] `main.original.js` 모든 기능 동작 확인 및 기록
- [ ] 모든 화면 크기(데스크톱/태블릿/모바일)에서 스크린샷 저장
- [ ] 기존 테스트 실행하여 통과 확인 (`main.original.js` 기준)
- [ ] **기존 `main.basic.js` 파일 백업** (새 파일 생성하지 않음 확인)
- [ ] **원본 비교 환경 준비**: 브라우저에서 동시 실행 가능한 설정

### ✅ **각 단계 완료 후 확인**
- [ ] `npx vitest run` 테스트 통과
- [ ] **`main.original.js`와 실시간 비교 검증**:
  - [ ] 브라우저에서 원본과 리팩토링 버전 동시 실행
  - [ ] 시각적 완전 일치 확인 (스크린샷 대조)
  - [ ] 기능 동작 완전 일치 확인 (클릭, 입력, 계산 등)
  - [ ] 타이머 기능 정확성 확인 (번개세일, 추천할인)
- [ ] **🚀 ES6+ 문법 적용 확인**:
  - [ ] `var` 사용 완전 제거 (0% 허용)
  - [ ] 화살표 함수 우선 적용 (메서드 80% 이상)
  - [ ] 템플릿 리터럴 문자열 처리 (100% 적용)
  - [ ] 배열 메서드 활용 (`map`/`filter`/`reduce`)
  - [ ] 구조 분해 할당 적극 활용
  - [ ] Phase별 목표 적용률 달성
- [ ] **🎨 프론트엔드 컨벤션 준수 확인**
  - [ ] Toss 4대 원칙 (가독성, 예측가능성, 응집성, 결합도)
  - [ ] nbilly 네이밍 규칙 (파일명, 함수명, 타입, 변수)

### ✅ **최종 완료 확인**
- [ ] **`main.original.js`와 완전 동일성 검증**:
  - [ ] **시각적 완전 일치** (원본과 1픽셀 차이 없음)
  - [ ] **기능 완전 일치** (모든 상호작용 동일)
  - [ ] **성능 동일성** (로딩 속도, 응답 시간)
  - [ ] **브라우저 호환성** (원본과 동일한 브라우저에서 동작)
- [ ] **테스트 100% 통과** (원본 기준 테스트)
- [ ] **🚀 ES6+ 문법 100% 완성**:
  - [ ] **`var` 사용 0%** (완전 제거 달성)
  - [ ] **화살표 함수 95% 이상** 적용
  - [ ] **템플릿 리터럴 100%** 적용 (문자열 연결 완전 제거)
  - [ ] **배열 메서드 90% 이상** (`for` 루프 최소화)
  - [ ] **ES6 클래스 100%** (`function` 생성자 완전 제거)
  - [ ] **Private 필드 적극 활용** (캡슐화 강화)
  - [ ] **모던 문법 적절 활용** (선택적 체이닝, Nullish 병합)
- [ ] **🎨 프론트엔드 컨벤션 100% 준수**
  - [ ] Toss 컨벤션 4대 원칙 완전 적용
  - [ ] nbilly 컨벤션 네이밍 규칙 완전 준수
  - [ ] ESLint 검증 통과 (컨벤션 자동 검증)
- [ ] **최종 원본 대조 검증**:
  - [ ] 데스크톱/태블릿/모바일 모든 환경에서 원본과 완전 일치
  - [ ] 모든 사용자 시나리오 원본과 동일하게 동작
  - [ ] 개발자 도구에서 DOM 구조 원본과 완전 일치

---

**⚠️ 중요**: 위 체크리스트 중 하나라도 실패하면 해당 단계를 롤백하고 문제를 해결해야 합니다.

**🎯 핵심 원칙**: 모든 검증은 **`main.original.js`를 절대 기준**으로 수행하며, 리팩토링된 코드가 원본과 **완전히 동일**해야 합니다.

## 🔧 **기술적 리스크 관리 계획**

### ⚡ **비동기 로직 처리 전략**

#### 1. 타이머 관리 통합 아키텍처
```javascript
// 타이머 관리 훅 예시 설계
const useTimers = () => {
  const timers = useRef([]);
  
  const addTimer = (callback, delay, type = 'general') => {
    const id = setTimeout(() => {
      callback();
      // 타이머 완료 후 자동 정리
      removeTimer(id);
    }, delay);
    
    timers.current.push({ id, type, startTime: Date.now() });
    return id;
  };
  
  const removeTimer = (id) => {
    clearTimeout(id);
    timers.current = timers.current.filter(timer => timer.id !== id);
  };
  
  const cleanup = () => {
    timers.current.forEach(timer => clearTimeout(timer.id));
    timers.current = [];
  };
  
  return { addTimer, removeTimer, cleanup, getActiveTimers: () => timers.current };
};
```

#### 2. `main.original.js` 타이머 로직 완전 호환성 보장
- **번개세일**: 원본과 동일한 `Math.random() * 10000` 후 30초마다 반복
- **추천할인**: 원본과 동일한 `Math.random() * 20000` 후 60초마다 반복  
- **호환성**: 원본 `setTimeout` 방식과 **완전히 동일한** 동작 보장
- **알림 메시지**: 원본과 동일한 `alert` 메시지 유지
- **정리**: 컴포넌트 unmount 시 모든 타이머 자동 정리
 - **동기성 보존**: 위 타이머 두 개를 제외한 모든 로직은 동기적으로 유지 (비동기 변환 금지)

### 🧪 **테스트 호환성 보장 전략**

#### 1. DOM 구조 보존 필수 요소
```javascript
// 테스트에서 요구하는 필수 DOM 구조
const REQUIRED_DOM_STRUCTURE = {
  // 선택자 요소
  '#product-select': 'ProductSelector 컴포넌트에서 유지',
  '#add-to-cart': '기존 ID 및 이벤트 처리 방식 보존',
  
  // 장바구니 요소  
  '#cart-items': 'CartRenderer에서 기존 HTML 구조 완전 복제',
  '.quantity-number': '수량 표시 클래스명 및 구조 유지',
  '.quantity-change': '수량 변경 버튼 구조 보존',
  '.remove-item': '제거 버튼 구조 보존',
  
  // 계산 요소
  '#cart-total': 'OrderSummary에서 기존 포맷 유지',
  '#loyalty-points': '포인트 표시 구조 보존',
  '#discount-info': '할인 정보 표시 구조 보존',
  '#stock-status': '재고 상태 표시 구조 보존',
  '#item-count': '아이템 수 표시 구조 보존'
};
```

#### 2. 테스트 실패 방지 체크포인트
- **Phase별 검증**: 각 Phase 완료 후 즉시 `npx vitest run` 실행
- **DOM 구조 검증**: 브라우저 DevTools로 기존 구조와 비교
- **이벤트 처리 검증**: 클릭, 변경 이벤트 정상 동작 확인
- **계산 로직 검증**: 할인, 포인트 계산 정확성 확인

### 📊 **성능 모니터링 체크포인트**

#### 1. 각 Phase별 성능 측정
```bash
# Phase 0 완료 후 기준선 측정
npm run test:performance  # 기본 성능 측정 스크립트 필요

# Phase별 비교 측정 항목
- 초기 로딩 시간
- 상품 추가/제거 응답 시간  
- 전체 재렌더링 시간
- 메모리 사용량 (DevTools Memory tab)
- 활성 이벤트 리스너 수
- 활성 타이머 수
```

#### 2. 성능 저하 허용 기준
- **렌더링 성능**: ±5% 이내 유지
- **메모리 사용량**: ±10% 이내 유지
- **응답 시간**: 기존과 동일하거나 더 빠르게
- **초기 로딩**: 기존 대비 성능 저하 없음

### 🔄 **롤백 전략 상세화**

#### 1. Git 브랜치 전략
```bash
main                    # 안정된 버전
├── refactor-phase-0   # Phase 0 작업
├── refactor-phase-1   # Phase 1 작업  
├── refactor-phase-2   # Phase 2 작업
└── refactor-phase-3   # Phase 3 작업
```

#### 2. 자동 롤백 조건
- **테스트 실패**: 77개 테스트 중 1개라도 실패 시
- **성능 저하**: 허용 기준 초과 시
- **메모리 누수**: DevTools에서 누수 감지 시
- **시각적 차이**: 스크린샷 비교에서 차이 발견 시

#### 3. 롤백 실행 스크립트
```bash
#!/bin/bash
# 자동 롤백 스크립트 예시
echo "테스트 실행 중..."
if ! npm test; then
    echo "테스트 실패 - 이전 Phase로 롤백"
    git checkout refactor-phase-$(($CURRENT_PHASE - 1))
    echo "Phase $((CURRENT_PHASE - 1))로 롤백 완료"
    exit 1
fi
```

### 💡 **개발 시 실시간 검증 도구**

#### 1. 필수 검증 명령어
```bash
# 개발 중 수시로 실행할 명령어들
npm run test:quick      # 핵심 테스트만 빠르게 실행
npm run lint:fix        # ESLint 자동 수정
npm run format         # 코드 포맷팅 통일  
npm run check:memory   # 메모리 누수 검사
npm run check:timers   # 활성 타이머 확인
```

#### 2. IDE 통합 검증
- **실시간 linting**: ESLint 설정으로 즉시 오류 표시
- **타입 검증**: JSDoc 기반 타입 힌트 활용
- **테스트 자동 실행**: 파일 저장 시 관련 테스트 자동 실행
- **성능 모니터링**: VS Code 확장으로 렌더링 성능 추적

## 🏗️ **App Class 아키텍처 설계**

### 📋 **ShoppingCartApp 클래스 구조**

```javascript
/**
 * Shopping Cart Application Main Class
 * Controllers와 Services를 조합하여 애플리케이션 관리
 */
class ShoppingCartApp {
  constructor(dependencies = {}) {
    // 핵심 서비스 의존성 주입
    this.stateManager = dependencies.stateManager || new StateManager();
    this.eventBus = dependencies.eventBus || new EventBus();
    this.timerService = dependencies.timerService || new TimerService(this.eventBus);
    this.uiUpdater = dependencies.uiUpdater || new UIUpdater();
    
    // 비즈니스 로직 Models
    this.cartModel = dependencies.cartModel || new CartModel();
    this.productModel = dependencies.productModel || new ProductModel();
    this.discountModel = dependencies.discountModel || new DiscountModel();
    this.pointsModel = dependencies.pointsModel || new PointsModel();
    
    // UI Controllers
    this.cartController = null;
    this.productController = null;
    this.summaryController = null;
    this.modalController = null;
    
    // 생명주기 상태
    this.isInitialized = false;
    this.isStarted = false;
  }
  
  /**
   * 애플리케이션 초기화
   * Controllers와 Services를 조합하여 시스템 구축
   * 동기적으로 실행되어야 함 (테스트 호환성)
   */
  init() {
    if (this.isInitialized) return;
    
    // 1. 상태 초기화 (기존 prodList, totalAmt 등 설정)
    this.initializeState();
    
    // 2. DOM 구조 생성 (기존 HTML 구조 완전 보존)
    this.createDOMStructure();
    
    // 3. Controllers 생성 및 의존성 주입
    this.initializeControllers();
    
    // 4. 이벤트 시스템 연결
    this.connectEventSystem();
    
    // 5. 초기 UI 렌더링
    this.render();
    
    this.isInitialized = true;
  }
  
  /**
   * Controllers 초기화 및 의존성 주입
   */
  initializeControllers() {
    this.cartController = new CartController(
      this.stateManager, 
      this.cartModel, 
      this.uiUpdater
    );
    
    this.productController = new ProductController(
      this.stateManager, 
      this.productModel, 
      this.uiUpdater
    );
    
    this.summaryController = new SummaryController(
      this.stateManager,
      this.discountModel,
      this.pointsModel,
      this.uiUpdater
    );
    
    this.modalController = new ModalController();
  }
  
  /**
   * 이벤트 시스템 연결
   */
  connectEventSystem() {
    // Controllers가 StateManager 상태 변경을 구독
    this.stateManager.subscribe(this.summaryController);
    
    // 타이머 이벤트 구독
    this.eventBus.subscribe('LIGHTNING_SALE_TRIGGERED', 
      (data) => this.handleLightningSale(data));
    this.eventBus.subscribe('SUGGESTION_DISCOUNT_TRIGGERED', 
      (data) => this.handleSuggestionDiscount(data));
  }
  
  /**
   * 애플리케이션 시작
   * 타이머, 실시간 기능 활성화
   */
  start() {
    if (!this.isInitialized || this.isStarted) return;
    
    // 번개세일 및 추천할인 타이머 시작
    this.timerService.startLightningTimer();
    this.timerService.startSuggestionTimer();
    
    this.isStarted = true;
  }
  
  /**
   * 애플리케이션 종료 및 정리
   * 메모리 누수 방지를 위한 완벽한 cleanup
   */
  destroy() {
    // 타이머 정리
    this.timerService.cleanup();
    
    // 이벤트 버스 정리
    this.eventBus.clear();
    
    // Controllers 정리
    this.cleanupControllers();
    
    // StateManager 정리
    this.stateManager.cleanup();
    
    // DOM 정리
    this.cleanupDOM();
    
    this.isInitialized = false;
    this.isStarted = false;
  }
  
  /**
   * Controllers 정리
   */
  cleanupControllers() {
    if (this.cartController) {
      this.cartController.destroy();
      this.cartController = null;
    }
    if (this.productController) {
      this.productController.destroy();
      this.productController = null;
    }
    if (this.summaryController) {
      this.summaryController.destroy();
      this.summaryController = null;
    }
    if (this.modalController) {
      this.modalController.destroy();
      this.modalController = null;
    }
  }
  
  /**
   * 전체 애플리케이션 재렌더링
   * Controllers를 통한 UI 업데이트 트리거
   */
  render() {
    // 각 Controller를 통한 UI 업데이트
    const currentState = this.stateManager.getState();
    this.uiUpdater.updateCartDisplay(currentState.cart);
    this.uiUpdater.updateSummary(currentState);
    this.uiUpdater.updateProductSelector(currentState.products);
    this.uiUpdater.updateStockStatus(currentState.products);
  }
  
  // Private 메서드들...
  initializeState() { 
    // StateManager에 초기 상태 설정
    const initialProducts = [/* 기존 prodList */];
    this.stateManager.setState({
      products: initialProducts,
      cart: [],
      totalAmount: 0,
      bonusPoints: 0,
      selectedProduct: null
    });
    
    // Backward compatibility를 위해 전역 변수도 유지 (필요시)
    window.prodList = initialProducts;
    window.totalAmt = 0;
    window.bonusPts = 0;
  }
  
  createDOMStructure() { 
    /* 기존 main()의 DOM 생성 로직 그대로 */ 
  }
  
  cleanupDOM() { 
    /* DOM 정리 */ 
  }
  
  // 타이머 이벤트 핸들러들
  handleLightningSale(data) {
    // 번개세일 로직 처리
    const updatedProducts = this.discountModel.applyLightningSale(
      this.stateManager.getProducts()
    );
    this.stateManager.updateProducts(updatedProducts);
  }
  
  handleSuggestionDiscount(data) {
    // 추천할인 로직 처리
    const updatedProducts = this.discountModel.applySuggestionDiscount(
      this.stateManager.getProducts()
    );
    this.stateManager.updateProducts(updatedProducts);
  }
}

// 기존 main() 함수 구조 유지 (테스트 호환성을 위해 필수)
function main() {
  // App 인스턴스 생성 및 의존성 주입 가능
  const app = new ShoppingCartApp({
    // 테스트 시 Mock 객체 주입 가능
    // stateManager: new MockStateManager(),
    // eventBus: new MockEventBus()
  });
  
  // 기존 main() 함수 인터페이스 그대로 유지
  app.init();
  app.start();
  
  // 디버깅을 위해 전역에서 접근 가능하도록 설정
  window.__shoppingCartApp = app;
}

// 기존과 동일하게 파일 로드 시 즉시 실행 (테스트 호환성 핵심)
main();
```

### 🔗 **의존성 주입 패턴 활용**

```javascript
// 테스트 시 Mock 서비스 주입 예시
const mockDependencies = {
  productService: new MockProductService(),
  timerService: new MockTimerService(), // 타이머 없이 즉시 실행
  discountService: new MockDiscountService()
};

const testApp = new ShoppingCartApp(mockDependencies);
```

### 📊 **상태 관리 중앙화**

```javascript
// 기존: 전역 변수 산재
var prodList = [...];
var totalAmt = 0;
var bonusPts = 0;

// 개선: App 클래스 내 중앙 관리
class ShoppingCartApp {
  constructor() {
    this.state = {
      products: [...],      // 기존 prodList
      totalAmount: 0,       // 기존 totalAmt  
      bonusPoints: 0,       // 기존 bonusPts
      cart: [],             // 장바구니 상태
      ui: {                 // UI 상태 관리
        selectedProduct: null,
        isModalOpen: false
      }
    };
  }
  
  // 상태 변경 시 자동 렌더링
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.render(); // 상태 변경 시 자동 리렌더링
  }
}
```

### ✅ **Controller 패턴 + App Class 도입의 기대 효과**

1. **🧹 코드 정리**: 764줄 main() 함수 → 명확한 Controller/Model/Service 구조
2. **🔄 생명주기 관리**: init → start → destroy 명확한 단계
3. **🧪 테스트 용이성**: 의존성 주입으로 Mock 객체 활용 가능
4. **🚀 성능 최적화**: 필요한 부분만 업데이트하는 효율적 UI 관리
5. **🛡️ 메모리 안정성**: cleanup 메서드로 완벽한 정리
6. **🎯 UI 로직 분리**: Controller가 UI 이벤트와 비즈니스 로직을 중재
7. **🔧 유지보수성**: 관심사 분리로 기능별 독립적 수정 가능
8. **📡 이벤트 기반 통신**: EventBus로 느슨한 결합의 컴포넌트 통신

### ⚠️ **Controller 패턴 + App Class 도입 시 주의사항**

1. **🚨 CRITICAL: `main()` 함수 구조 절대 유지**:
   - 테스트는 `import('../main.basic.js')` 후 즉시 DOM 요소 접근
   - `main()` 함수는 반드시 파일 끝에서 `main()` 형태로 호출
   - App 클래스는 `main()` 함수 **내부에서만** 사용
   - 기존 `function main() { ... } main();` 패턴 절대 변경 금지
2. **테스트 호환성**: 기존 77개 테스트 모두 통과 필수
3. **DOM 구조 보존**: 기존 HTML 구조와 ID/클래스 완전 일치  
4. **이벤트 처리**: Controllers가 기존 이벤트 핸들링 방식 완전 호환
5. **타이머 로직**: EventBus 기반으로 번개세일/추천할인 동작 정확히 재현
6. **성능 유지**: UI 업데이트 최적화로 기존 성능 수준 유지 또는 개선
7. **점진적 도입**: 한 번에 모든 것을 변경하지 말고 단계별 적용
8. **의존성 관리**: Controllers 간 순환 의존성 방지

이 계획서를 바탕으로 단계별 리팩토링을 진행하겠습니다.
