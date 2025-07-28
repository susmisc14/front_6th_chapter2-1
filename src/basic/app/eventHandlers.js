/**
 * 이벤트 핸들러 함수들
 * 사용자 인터랙션 처리, 장바구니 조작 등의 이벤트를 관리
 */
import { calculateCartTotal, renderBonusPoints } from "../cart/cartService.js";
import { updatePricesInCart, updateStockInfo } from "../cart/cartUI.js";
import { findProductById } from "../product/productService.js";
import { updateSelectOptions } from "../product/productUI.js";

/**
 * 장바구니 추가 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleAddToCart(event, productList, appState) {
  const selectedProductId = appState.productSelector.value;

  if (!selectedProductId) return;

  const product = findProductById(productList, selectedProductId);
  if (!product || product.q <= 0) {
    alert("재고가 부족합니다.");
    return;
  }

  // 기존 아이템이 있는지 확인
  const existingItem = document.getElementById(product.id);

  if (existingItem) {
    // 기존 아이템 수량 증가
    const quantityElement = existingItem.querySelector(".quantity-number");
    const currentQuantity = parseInt(quantityElement.textContent);
    const newQuantity = currentQuantity + 1;

    if (newQuantity <= product.q + currentQuantity) {
      quantityElement.textContent = newQuantity;
      product.q--;
    } else {
      alert("재고가 부족합니다.");
      return;
    }
  } else {
    // 새 아이템 추가
    const newItem = document.createElement("div");
    newItem.id = product.id;
    newItem.className =
      "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";

    const discountClass =
      product.onSale && product.suggestSale
        ? "text-purple-600"
        : product.onSale
          ? "text-red-500"
          : product.suggestSale
            ? "text-blue-500"
            : "";

    const discountIcon =
      product.onSale && product.suggestSale
        ? "⚡💝"
        : product.onSale
          ? "⚡"
          : product.suggestSale
            ? "💝"
            : "";

    const priceDisplay =
      product.onSale || product.suggestSale
        ? `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${discountClass}">₩${product.val.toLocaleString()}</span>`
        : `₩${product.val.toLocaleString()}`;

    newItem.innerHTML = `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${discountIcon}${product.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${priceDisplay}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
      </div>
    `;

    appState.cartDisplay.appendChild(newItem);
    product.q--;
  }

  // 상태 업데이트
  appState.lastSelectedProduct = selectedProductId;
  handleCalculateCartStuff(productList, appState);
}

/**
 * 장바구니 아이템 액션 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleCartItemAction(event, productList, appState) {
  const target = event.target;

  if (target.classList.contains("quantity-change")) {
    handleQuantityChange(target, productList, appState);
  } else if (target.classList.contains("remove-item")) {
    handleItemRemove(target, productList, appState);
  }
}

/**
 * 수량 변경 이벤트 핸들러
 * @param {HTMLElement} target - 클릭된 요소
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleQuantityChange(target, productList, appState) {
  const productId = target.dataset.productId;
  const change = parseInt(target.dataset.change);
  const itemElement = document.getElementById(productId);
  const product = findProductById(productList, productId);

  if (!itemElement || !product) return;

  const quantityElement = itemElement.querySelector(".quantity-number");
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + change;

  if (newQuantity > 0 && newQuantity <= product.q + currentQuantity) {
    quantityElement.textContent = newQuantity;
    product.q -= change;
  } else if (newQuantity <= 0) {
    // 수량이 0이 되면 아이템 제거
    product.q += currentQuantity;
    itemElement.remove();
  } else {
    alert("재고가 부족합니다.");
    return;
  }

  handleCalculateCartStuff(productList, appState);
  updateSelectOptions(appState.productSelector, productList);
}

/**
 * 아이템 제거 이벤트 핸들러
 * @param {HTMLElement} target - 클릭된 요소
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleItemRemove(target, productList, appState) {
  const productId = target.dataset.productId;
  const itemElement = document.getElementById(productId);
  const product = findProductById(productList, productId);

  if (!itemElement || !product) return;

  const quantityElement = itemElement.querySelector(".quantity-number");
  const removedQuantity = parseInt(quantityElement.textContent);

  product.q += removedQuantity;
  itemElement.remove();

  handleCalculateCartStuff(productList, appState);
  updateSelectOptions(appState.productSelector, productList);
}

/**
 * 장바구니 계산 및 UI 업데이트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
function handleCalculateCartStuff(productList, appState) {
  const cartItems = appState.cartDisplay.children;
  const result = calculateCartTotal(Array.from(cartItems), productList, appState);

  // 앱 상태 업데이트
  appState.totalAmount = result.totalAmount;
  appState.itemCount = result.itemCount;

  // UI 업데이트
  updateCartUI(result, appState);
  renderBonusPoints(Array.from(cartItems), productList, appState, result.totalAmount);
  updateStockInfo(productList);
}

/**
 * 장바구니 UI 업데이트
 * @param {Object} result - 계산 결과
 * @param {Object} appState - 앱 상태
 */
function updateCartUI(result, appState) {
  // 아이템 수 표시 업데이트
  const itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${result.itemCount} items in cart`;
  }

  // 총액 표시 업데이트
  const totalDiv = appState.sumElement?.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = "₩" + result.totalAmount.toLocaleString();
  }

  // 주문 요약 업데이트
  updateOrderSummary(result, appState);

  // 화요일 특별 할인 표시
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (tuesdaySpecial) {
    if (result.isTuesday && result.totalAmount > 0) {
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  }
}

/**
 * 주문 요약 업데이트
 * @param {Object} result - 계산 결과
 * @param {Object} appState - 앱 상태
 */
function updateOrderSummary(result, appState) {
  const summaryDetails = document.getElementById("summary-details");
  const discountInfo = document.getElementById("discount-info");

  if (!summaryDetails || !discountInfo) return;

  summaryDetails.innerHTML = "";

  if (result.subtotal > 0) {
    // 장바구니 아이템들 표시
    const cartItems = appState.cartDisplay.children;
    for (const item of cartItems) {
      const product = findProductById(appState.productList, item.id);
      if (!product) continue;

      const quantity = parseInt(item.querySelector(".quantity-number").textContent);
      const itemTotal = product.val * quantity;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 구분선
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${result.subtotal.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    if (result.itemCount >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (result.itemDiscounts.length > 0) {
      result.itemDiscounts.forEach((item) => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (result.isTuesday) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  // 할인 정보 표시
  if (result.discountRate > 0 && result.totalAmount > 0) {
    const savedAmount = result.subtotal - result.totalAmount;
    discountInfo.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(result.discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  } else {
    discountInfo.innerHTML = "";
  }
}

/**
 * 이벤트 리스너 설정
 * @param {HTMLElement} addToCartButton - 장바구니 추가 버튼
 * @param {HTMLElement} cartDisplay - 장바구니 표시 영역
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function setupEventListeners(addToCartButton, cartDisplay, productList, appState) {
  // 장바구니 추가 버튼 이벤트
  addToCartButton.addEventListener("click", (event) => {
    handleAddToCart(event, productList, appState);
  });

  // 장바구니 아이템 액션 이벤트
  cartDisplay.addEventListener("click", (event) => {
    handleCartItemAction(event, productList, appState);
  });

  // 도움말 모달 이벤트
  const manualToggle = document.querySelector(".fixed.top-4.right-4");
  const manualOverlay = document.querySelector(".fixed.inset-0");
  const manualColumn = document.querySelector(".fixed.right-0.top-0");

  if (manualToggle && manualOverlay && manualColumn) {
    manualToggle.onclick = function () {
      manualOverlay.classList.toggle("hidden");
      manualColumn.classList.toggle("translate-x-full");
    };

    manualOverlay.onclick = function (e) {
      if (e.target === manualOverlay) {
        manualOverlay.classList.add("hidden");
        manualColumn.classList.add("translate-x-full");
      }
    };
  }
}
