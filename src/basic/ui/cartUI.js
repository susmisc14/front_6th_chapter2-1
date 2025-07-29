/**
 * 장바구니 UI 관련 함수들
 * 장바구니 아이템 생성, 재고 정보 업데이트, 가격 업데이트 등의 UI 기능을 제공
 */
import { LOW_STOCK_THRESHOLD } from "../constants/productConstants.js";
import {
  CART_ITEM_CONTAINER_TEMPLATE,
  CART_ITEM_TEMPLATE,
  PRICE_DISPLAY_NORMAL_TEMPLATE,
  PRICE_DISPLAY_SALE_TEMPLATE,
  PRICE_DISPLAY_SUGGEST_TEMPLATE,
  PRICE_DISPLAY_SUPER_SALE_TEMPLATE,
  STOCK_LOW_ITEM_TEMPLATE,
  STOCK_LOW_MESSAGE_TEMPLATE,
  STOCK_OUT_ITEM_TEMPLATE,
} from "../constants/uiTemplates.js";
import { $ } from "../utils/$.js";
import { bindTemplate, createUIElement, setElementHTML, setElementText } from "./uiHelpers.js";

/**
 * 새 장바구니 아이템 생성
 * @param {Object} product - 상품 객체
 * @returns {Element} 생성된 장바구니 아이템 DOM 요소
 */
export function createCartItemElement(product) {
  const { discountIcon, priceDisplay } = calculateProductDiscountInfo(product);

  // 템플릿에 데이터 바인딩
  const cartItemContent = bindTemplate(CART_ITEM_TEMPLATE, {
    productName: `${discountIcon}${product.name}`,
    priceDisplay,
    productId: product.id,
  });

  // 컨테이너 템플릿에 내용 바인딩
  const containerTemplate = bindTemplate(CART_ITEM_CONTAINER_TEMPLATE, {
    productId: product.id,
    cartItemContent,
  });

  // UI 요소 생성
  const cartItemElement = createUIElement(containerTemplate);

  return cartItemElement;
}

/**
 * 상품 할인 정보 계산 (UI 표시용)
 * @param {Object} product - 상품 객체
 * @returns {Object} 할인 정보 객체
 */
function calculateProductDiscountInfo(product) {
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

  return { discountClass, discountIcon, priceDisplay };
}

/**
 * 재고 정보 업데이트
 * @param {Array} productList - 상품 목록
 */
export function updateStockInfo(productList) {
  const stockInfo = $("#stock-status");
  if (!stockInfo) return;

  const stockMessages = [];

  for (const item of productList) {
    if (item.q < LOW_STOCK_THRESHOLD) {
      if (item.q > 0) {
        const message = bindTemplate(STOCK_LOW_ITEM_TEMPLATE, {
          productName: item.name,
          stockCount: item.q,
        });
        stockMessages.push(message);
      } else {
        const message = bindTemplate(STOCK_OUT_ITEM_TEMPLATE, {
          productName: item.name,
        });
        stockMessages.push(message);
      }
    }
  }

  const stockMsg = stockMessages.join("\n");
  setElementText(stockInfo, stockMsg);
}

/**
 * 가격 표시 템플릿 생성
 * @param {Object} product - 상품 정보
 * @returns {string} 가격 표시 HTML
 */
function createPriceDisplay(product) {
  const originalPrice = product.originalVal?.toLocaleString() || product.val.toLocaleString();
  const salePrice = product.val.toLocaleString();

  if (product.onSale && product.suggestSale) {
    return bindTemplate(PRICE_DISPLAY_SUPER_SALE_TEMPLATE, {
      originalPrice,
      salePrice,
    });
  } else if (product.onSale) {
    return bindTemplate(PRICE_DISPLAY_SALE_TEMPLATE, {
      originalPrice,
      salePrice,
    });
  } else if (product.suggestSale) {
    return bindTemplate(PRICE_DISPLAY_SUGGEST_TEMPLATE, {
      originalPrice,
      salePrice,
    });
  } else {
    return bindTemplate(PRICE_DISPLAY_NORMAL_TEMPLATE, {
      price: product.val.toLocaleString(),
    });
  }
}

/**
 * 상품명 표시 템플릿 생성
 * @param {Object} product - 상품 정보
 * @returns {string} 상품명
 */
function createProductNameDisplay(product) {
  let name = product.name;

  if (product.onSale && product.suggestSale) {
    name = "⚡💝" + name;
  } else if (product.onSale) {
    name = "⚡" + name;
  } else if (product.suggestSale) {
    name = "💝" + name;
  }

  return name;
}

/**
 * 장바구니 내 가격 업데이트
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 */
export function updatePricesInCart(cartItems, productList) {
  for (const cartItem of cartItems) {
    const product = findProductById(productList, cartItem.id);
    if (!product) continue;

    const priceDiv = cartItem.querySelector(".text-lg");
    const nameDiv = cartItem.querySelector("h3");

    if (!priceDiv || !nameDiv) continue;

    // 템플릿을 활용한 가격 표시 생성
    const priceDisplay = createPriceDisplay(product);
    const productName = createProductNameDisplay(product);

    // uiHelpers를 사용하여 요소 생성
    setElementHTML(priceDiv, priceDisplay);
    setElementText(nameDiv, productName);
  }
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
