/**
 * 상품 UI 관련 함수들
 * 상품 선택 옵션 업데이트, 사용자 인터페이스 생성 등의 기능을 제공
 */
import { TOTAL_STOCK_WARNING } from "../constants/productConstants.js";
import {
  ADD_TO_CART_BUTTON_IMPROVED_TEMPLATE,
  CART_DISPLAY_IMPROVED_TEMPLATE,
  GRID_CONTAINER_IMPROVED_TEMPLATE,
  HEADER_CONTAINER_TEMPLATE,
  HEADER_IMPROVED_TEMPLATE,
  HELP_MODAL_CONTAINER_TEMPLATE,
  HELP_MODAL_IMPROVED_TEMPLATE,
  HELP_TOGGLE_BUTTON_IMPROVED_TEMPLATE,
  LEFT_COLUMN_IMPROVED_TEMPLATE,
  PRODUCT_OPTION_LOW_STOCK_TEMPLATE,
  PRODUCT_OPTION_NORMAL_TEMPLATE,
  PRODUCT_OPTION_SOLD_OUT_TEMPLATE,
  PRODUCT_SELECTOR_IMPROVED_TEMPLATE,
  RIGHT_COLUMN_IMPROVED_TEMPLATE,
  SELECTOR_CONTAINER_IMPROVED_TEMPLATE,
  SLIDE_PANEL_CONTAINER_TEMPLATE,
  SLIDE_PANEL_IMPROVED_TEMPLATE,
  STOCK_INFO_IMPROVED_TEMPLATE,
  STOCK_WARNING_OPTION_TEMPLATE,
  TUESDAY_BANNER_CONTAINER_TEMPLATE,
  TUESDAY_BANNER_TEMPLATE,
} from "../constants/uiTemplates.js";
import {
  appendChild,
  appendChildren,
  bindTemplate,
  createFragment,
  createUIElement,
  setElementAttributes,
  setElementHTML,
} from "../ui/uiHelpers.js";
import { $ } from "../utils/$.js";

/**
 * 상품 표시 텍스트 생성
 * @param {Object} product - 상품 정보
 * @returns {string} 표시 텍스트
 */
function createProductDisplayText(product) {
  let displayText = `${product.name} - ${product.val}원`;

  if (product.onSale) displayText = "⚡ " + displayText;
  if (product.suggestSale) displayText = "💝 " + displayText;

  return displayText;
}

/**
 * 상품 옵션 템플릿 생성
 * @param {Object} product - 상품 정보
 * @returns {string} 옵션 HTML
 */
function createProductOptionTemplate(product) {
  const displayText = createProductDisplayText(product);

  if (product.q === 0) {
    return bindTemplate(PRODUCT_OPTION_SOLD_OUT_TEMPLATE, {
      productId: product.id,
      displayText: displayText + " (품절)",
    });
  } else if (product.q < 5) {
    return bindTemplate(PRODUCT_OPTION_LOW_STOCK_TEMPLATE, {
      productId: product.id,
      displayText: displayText + ` (재고 부족: ${product.q}개)`,
    });
  } else {
    return bindTemplate(PRODUCT_OPTION_NORMAL_TEMPLATE, {
      productId: product.id,
      displayText,
    });
  }
}

/**
 * 상품 선택 옵션 업데이트
 * @param {HTMLElement} selector - 상품 선택 요소
 * @param {Array} productList - 상품 목록
 */
export function updateSelectOptions(selector, productList) {
  if (!selector) return;

  // 기존 옵션들 제거
  const existingOptions = selector.querySelectorAll("option");
  existingOptions.forEach((option) => option.remove());

  let totalStock = 0;

  // 총 재고 계산
  for (const product of productList) {
    totalStock += product.q;
  }

  // 상품 옵션 생성
  for (const product of productList) {
    const optionHTML = createProductOptionTemplate(product);
    const optionElement = createUIElement(optionHTML);
    appendChild(selector, optionElement);
  }

  // 총 재고 경고 표시
  if (totalStock < 10) {
    const warningHTML = bindTemplate(STOCK_WARNING_OPTION_TEMPLATE, {
      warningMessage: TOTAL_STOCK_WARNING,
    });
    const warningElement = createUIElement(warningHTML);
    appendChild(selector, warningElement);
  }
}

/**
 * 헤더 요소 생성
 * @returns {HTMLElement} 헤더 요소
 */
function createHeader() {
  const headerContent = bindTemplate(HEADER_IMPROVED_TEMPLATE, {});
  const headerTemplate = bindTemplate(HEADER_CONTAINER_TEMPLATE, { headerContent });
  const headerElement = createUIElement(headerTemplate);
  return setElementAttributes(headerElement, { className: "mb-8" });
}

/**
 * 화요일 특별 할인 배너 생성
 * @returns {HTMLElement} 배너 요소
 */
function createTuesdayBanner() {
  const bannerContent = bindTemplate(TUESDAY_BANNER_TEMPLATE, {});
  const bannerTemplate = bindTemplate(TUESDAY_BANNER_CONTAINER_TEMPLATE, { bannerContent });
  const bannerElement = createUIElement(bannerTemplate);
  return setElementAttributes(bannerElement, {
    id: "tuesday-special",
    className: "hidden bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg mb-4",
  });
}

/**
 * 상품 선택기 생성
 * @returns {HTMLElement} 상품 선택기 요소
 */
function createProductSelector() {
  const selectorElement = createUIElement(PRODUCT_SELECTOR_IMPROVED_TEMPLATE);
  return setElementAttributes(selectorElement, {
    id: "product-select",
    className: "w-full p-3 border border-gray-300 rounded-lg text-base mb-3",
  });
}

/**
 * 장바구니 추가 버튼 생성
 * @returns {HTMLElement} 추가 버튼 요소
 */
function createAddToCartButton() {
  const buttonElement = createUIElement(ADD_TO_CART_BUTTON_IMPROVED_TEMPLATE);
  return setElementAttributes(buttonElement, {
    id: "add-to-cart",
    className:
      "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all",
  });
}

/**
 * 재고 정보 생성
 * @returns {HTMLElement} 재고 정보 요소
 */
function createStockInfo() {
  const stockElement = createUIElement(STOCK_INFO_IMPROVED_TEMPLATE);
  return setElementAttributes(stockElement, {
    id: "stock-status",
    className: "text-xs text-red-500 mt-3 whitespace-pre-line",
  });
}

/**
 * 장바구니 표시 영역 생성
 * @returns {HTMLElement} 장바구니 표시 요소
 */
function createCartDisplay() {
  const cartElement = createUIElement(CART_DISPLAY_IMPROVED_TEMPLATE);
  return setElementAttributes(cartElement, {
    id: "cart-items",
    className: "cart-items",
  });
}

/**
 * 선택기 컨테이너 생성
 * @param {HTMLElement} productSelector - 상품 선택기
 * @param {HTMLElement} addToCartButton - 추가 버튼
 * @param {HTMLElement} stockInfo - 재고 정보
 * @returns {HTMLElement} 선택기 컨테이너
 */
function createSelectorContainer(productSelector, addToCartButton, stockInfo) {
  const containerElement = createUIElement(SELECTOR_CONTAINER_IMPROVED_TEMPLATE);
  const container = setElementAttributes(containerElement, {
    className: "mb-6 pb-6 border-b border-gray-200",
  });

  // 자식 요소들을 컨테이너에 추가
  appendChildren(container, [productSelector, addToCartButton, stockInfo]);

  return container;
}

/**
 * 왼쪽 컬럼 생성
 * @param {HTMLElement} selectorContainer - 선택기 컨테이너
 * @param {HTMLElement} cartDisplay - 장바구니 표시
 * @returns {HTMLElement} 왼쪽 컬럼
 */
function createLeftColumn(selectorContainer, cartDisplay) {
  const leftColumnElement = createUIElement(LEFT_COLUMN_IMPROVED_TEMPLATE);
  const leftColumn = setElementAttributes(leftColumnElement, {
    className: "bg-white border border-gray-200 p-8 overflow-y-auto",
  });

  appendChildren(leftColumn, [selectorContainer, cartDisplay]);

  return leftColumn;
}

/**
 * 오른쪽 컬럼 생성
 * @returns {HTMLElement} 오른쪽 컬럼
 */
function createRightColumn() {
  const rightColumnElement = createUIElement(RIGHT_COLUMN_IMPROVED_TEMPLATE);
  return setElementAttributes(rightColumnElement, {
    className: "bg-white p-8 rounded-lg shadow-lg",
  });
}

/**
 * 그리드 컨테이너 생성
 * @param {HTMLElement} leftColumn - 왼쪽 컬럼
 * @param {HTMLElement} rightColumn - 오른쪽 컬럼
 * @returns {HTMLElement} 그리드 컨테이너
 */
function createGridContainer(leftColumn, rightColumn) {
  const gridContainerElement = createUIElement(GRID_CONTAINER_IMPROVED_TEMPLATE);
  const gridContainer = setElementAttributes(gridContainerElement, {
    className: "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden",
  });

  appendChildren(gridContainer, [leftColumn, rightColumn]);

  return gridContainer;
}

/**
 * 도움말 토글 버튼 생성
 * @returns {HTMLElement} 도움말 토글 버튼
 */
function createHelpToggle() {
  const toggleElement = createUIElement(HELP_TOGGLE_BUTTON_IMPROVED_TEMPLATE);
  return setElementAttributes(toggleElement, {
    id: "help-toggle",
    className:
      "fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50",
  });
}

/**
 * 도움말 모달 생성
 * @returns {HTMLElement} 도움말 모달
 */
function createHelpModal() {
  const modalContent = bindTemplate(HELP_MODAL_IMPROVED_TEMPLATE, {});
  const modalTemplate = bindTemplate(HELP_MODAL_CONTAINER_TEMPLATE, { modalContent });
  const modalElement = createUIElement(modalTemplate);
  return setElementAttributes(modalElement, {
    id: "help-modal",
    className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden",
  });
}

/**
 * 슬라이드 패널 생성
 * @returns {HTMLElement} 슬라이드 패널
 */
function createSlidePanel() {
  const panelElement = createUIElement(SLIDE_PANEL_CONTAINER_TEMPLATE);
  return setElementAttributes(panelElement, {
    id: "slide-panel",
    className:
      "fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out",
  });
}

/**
 * 사용자 인터페이스 생성
 * @returns {Object} 생성된 UI 요소들의 참조
 */
export function createUserInterface() {
  const root = $("#app");
  if (!root) {
    console.error("App root element not found");
    return {};
  }

  // UI 요소들 생성
  const header = createHeader();
  const tuesdayBanner = createTuesdayBanner();
  const productSelector = createProductSelector();
  const addToCartButton = createAddToCartButton();
  const stockInfo = createStockInfo();
  const cartDisplay = createCartDisplay();
  const rightColumn = createRightColumn();
  const selectorContainer = createSelectorContainer(productSelector, addToCartButton, stockInfo);
  const leftColumn = createLeftColumn(selectorContainer, cartDisplay);
  const gridContainer = createGridContainer(leftColumn, rightColumn);
  const helpToggle = createHelpToggle();
  const helpModal = createHelpModal();
  const slidePanel = createSlidePanel();

  // DOM에 요소들 추가
  appendChildren(root, [header, tuesdayBanner, gridContainer, helpToggle, helpModal, slidePanel]);

  // 실제 DOM 요소들 참조 가져오기
  const actualCartDisplay = $("#cart-items");
  const actualProductSelector = $("#product-select");
  const actualAddToCartButton = $("#add-to-cart");
  const actualStockInfo = $("#stock-status");
  const actualSumElement = $("#cart-total");

  return {
    cartDisplay: actualCartDisplay,
    productSelector: actualProductSelector,
    addToCartButton: actualAddToCartButton,
    stockInfo: actualStockInfo,
    sumElement: actualSumElement,
  };
}
