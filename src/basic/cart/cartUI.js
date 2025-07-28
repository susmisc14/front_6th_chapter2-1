/**
 * 장바구니 UI 관련 함수들
 * 재고 정보 업데이트, 가격 업데이트 등의 UI 기능을 제공
 */
import { LOW_STOCK_THRESHOLD } from "../constants/productConstants.js";

/**
 * 재고 정보 업데이트
 * @param {Array} productList - 상품 목록
 */
export function updateStockInfo(productList) {
  const stockInfo = document.getElementById("stock-status");
  if (!stockInfo) return;

  let stockMsg = "";

  for (const item of productList) {
    if (item.q < LOW_STOCK_THRESHOLD) {
      if (item.q > 0) {
        stockMsg += `${item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else {
        stockMsg += `${item.name}: 품절\n`;
      }
    }
  }

  stockInfo.textContent = stockMsg;
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

    // 할인 상태에 따른 가격 표시
    if (product.onSale && product.suggestSale) {
      priceDiv.innerHTML = `
        <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
        <span class="text-purple-600">₩${product.val.toLocaleString()}</span>
      `;
      nameDiv.textContent = "⚡💝" + product.name;
    } else if (product.onSale) {
      priceDiv.innerHTML = `
        <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
        <span class="text-red-500">₩${product.val.toLocaleString()}</span>
      `;
      nameDiv.textContent = "⚡" + product.name;
    } else if (product.suggestSale) {
      priceDiv.innerHTML = `
        <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
        <span class="text-blue-500">₩${product.val.toLocaleString()}</span>
      `;
      nameDiv.textContent = "💝" + product.name;
    } else {
      priceDiv.textContent = "₩" + product.val.toLocaleString();
      nameDiv.textContent = product.name;
    }
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
