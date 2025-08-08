import { renderPriceLabel, renderNamePrefix, setPriceLabelNode } from '../components/PriceLabel.template.js';
import { renderProductSelectOptions } from '../components/ProductSelect.template.js';
import { LOW_STOCK_TOTAL_THRESHOLD } from '../utils/constants.js';
import {
  updateSelectElement,
  updateCartItemElements,
  renderSummaryDetailsToContainer,
  updateDiscountInfoElement,
  updateLoyaltyPointsElement,
  setupHelpModalEventListeners,
  assembleLayoutElements,
  assembleLayoutFromArray,
  assembleLayoutFromVisual,
  extractSummaryElementsFromDOM
} from '../utils/domUpdates.js';
import { sum } from '../utils/declarativeHelpers.js';

export function updateProductSelect(sel, prodList) {
  const optionsHtml = renderProductSelectOptions(prodList);
  const totalStock = sum(prodList, product => product.q);
  
  updateSelectElement(sel, {
    optionsHtml,
    totalStock,
    threshold: LOW_STOCK_TOTAL_THRESHOLD
  });
}

export function updateCartItemPrices(cartDisp, prodList) {
  updateCartItemElements(cartDisp, {
    setPriceLabelNode,
    renderNamePrefix,
    products: prodList
  });
}

export function renderSummaryDetails(container, cartItems, prodList, subTot, itemCnt, isTuesday, totalAmt, itemDiscounts) {
  renderSummaryDetailsToContainer(container, {
    cartItems,
    products: prodList,
    subtotal: subTot,
    itemCount: itemCnt,
    isTuesday,
    totalAmount: totalAmt,
    itemDiscounts
  });
}

export function updateDiscountInfo(discountInfoDiv, discRate, savedAmount, totalAmt) {
  updateDiscountInfoElement(discountInfoDiv, {
    discountRate: discRate,
    savedAmount,
    totalAmount: totalAmt
  });
}

export function updateLoyaltyPoints(loyaltyPointsDiv, bonusPts, pointsDetail) {
  updateLoyaltyPointsElement(loyaltyPointsDiv, bonusPts, pointsDetail);
}



export function setupHelpModalEvents(manualToggle, manualOverlay, manualColumn) {
  setupHelpModalEventListeners(manualToggle, manualOverlay, manualColumn);
}

export function assembleLayout(root, header, gridContainer, leftColumn, selectorContainer, rightColumn, sel, addBtn, stockInfo, cartDisp, manualToggle, manualOverlay) {
  assembleLayoutElements(root, {
    header,
    gridContainer,
    leftColumn,
    selectorContainer,
    rightColumn,
    selector: sel,
    addButton: addBtn,
    stockInfo,
    cartDisplay: cartDisp,
    manualToggle,
    manualOverlay
  });
}

/**
 * 배열 기반 레이아웃 조립 (새로운 방식)
 * @param {HTMLElement} root - 루트 요소
 * @param {Object} elements - 요소들
 * @param {Object} options - 레이아웃 옵션
 * @param {Array} options.disabledElements - 비활성화할 요소 ID들 (예: ['manualToggle', 'manualOverlay'])
 * @param {Array} options.enabledElements - 활성화할 요소 ID들만 지정할 때 사용
 * @returns {Object} 적용된 레이아웃 정보
 */
export function assembleLayoutFromArrayConfig(root, elements, options = {}) {
  const elementMap = {
    header: elements.header,
    gridContainer: elements.gridContainer,
    leftColumn: elements.leftColumn,
    selectorContainer: elements.selectorContainer,
    rightColumn: elements.rightColumn,
    selector: elements.selector || elements.sel,
    addButton: elements.addButton || elements.addBtn,
    stockInfo: elements.stockInfo,
    cartDisplay: elements.cartDisplay || elements.cartDisp,
    manualToggle: elements.manualToggle,
    manualOverlay: elements.manualOverlay
  };
  
  return assembleLayoutFromArray(root, elementMap, options);
}

/**
 * 시각적 레이아웃 조립 (React JSX-like)
 * @param {HTMLElement} root - 루트 요소
 * @param {Object} elements - 요소들
 * @param {Object} options - 레이아웃 옵션
 * @param {Array} options.disabledElements - 비활성화할 요소 ID들
 * @param {Array} options.enabledElements - 활성화할 요소 ID들만 지정할 때 사용
 * @param {Object} options.visualLayout - 커스텀 시각적 레이아웃
 * @param {boolean} options.debug - 디버그 모드 (레이아웃 구조 콘솔 출력)
 * @returns {Object} 적용된 레이아웃 정보와 시각화 결과
 */
export function assembleLayoutFromVisualConfig(root, elements, options = {}) {
  const elementMap = {
    header: elements.header,
    gridContainer: elements.gridContainer,
    leftColumn: elements.leftColumn,
    selectorContainer: elements.selectorContainer,
    rightColumn: elements.rightColumn,
    selector: elements.selector || elements.sel,
    addButton: elements.addButton || elements.addBtn,
    stockInfo: elements.stockInfo,
    cartDisplay: elements.cartDisplay || elements.cartDisp,
    manualToggle: elements.manualToggle,
    manualOverlay: elements.manualOverlay
  };
  
  return assembleLayoutFromVisual(root, elementMap, options);
}

export function extractSummaryElements(rightColumn, header) {
  return extractSummaryElementsFromDOM(rightColumn, header);
}

