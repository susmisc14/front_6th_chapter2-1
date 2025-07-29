/**
 * 액션 핸들러 순수 함수들
 * React 마이그레이션을 위해 DOM 조작과 분리된 비즈니스 로직
 */
import { findProductById } from "../services/productService.js";
import { calculateCartTotals } from "./businessLogic.js";
import { CartError, ERROR_CODES, ERROR_TYPES } from "./errorHandler.js";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  updateFromCalculation,
  updateProductStock,
  updateSelectedProduct,
} from "./stateManager.js";
import { validateProductAvailability, validateProductSelection } from "./validation.js";

/**
 * 상품 선택 액션
 * @param {Object} state - 현재 상태
 * @param {string} productId - 선택된 상품 ID
 * @returns {Object} { success, newState, error }
 */
export function handleProductSelection(state, productId) {
  // 상품 선택 유효성 검사
  const selectionValidation = validateProductSelection(productId);
  if (!selectionValidation.isValid) {
    return {
      success: false,
      newState: state,
      error: selectionValidation.error,
    };
  }

  const newState = updateSelectedProduct(state, productId);

  return {
    success: true,
    newState,
    error: null,
  };
}

/**
 * 장바구니 추가 액션
 * @param {Object} state - 현재 상태
 * @param {string} productId - 추가할 상품 ID
 * @param {number} quantity - 수량
 * @returns {Object} { success, newState, error }
 */
export function handleAddToCartAction(state, productId, quantity = 1) {
  // 상품 선택 유효성 검사
  const selectionValidation = validateProductSelection(productId);
  if (!selectionValidation.isValid) {
    return {
      success: false,
      newState: state,
      error: selectionValidation.error,
    };
  }

  const product = findProductById(state.productList, productId);

  // 상품 가용성 검사
  const availabilityValidation = validateProductAvailability(product, quantity);
  if (!availabilityValidation.isValid) {
    return {
      success: false,
      newState: state,
      error: availabilityValidation.error,
    };
  }

  // 장바구니에 추가
  let newState = addToCart(state, product, quantity);

  // 재고 감소
  newState = updateProductStock(newState, productId, quantity);

  // 계산 실행
  const calculationResult = calculateCartTotals(newState.cartItems, newState.productList);
  newState = updateFromCalculation(newState, calculationResult);

  // 선택된 상품 업데이트
  newState = updateSelectedProduct(newState, productId);

  return {
    success: true,
    newState,
    error: null,
  };
}

/**
 * 수량 변경 액션
 * @param {Object} state - 현재 상태
 * @param {string} productId - 상품 ID
 * @param {number} change - 변경 수량
 * @returns {Object} { success, newState, error }
 */
export function handleQuantityChangeAction(state, productId, change) {
  const product = findProductById(state.productList, productId);
  if (!product) {
    return {
      success: false,
      newState: state,
      error: new CartError("상품을 찾을 수 없습니다.", ERROR_CODES.PRODUCT_NOT_FOUND),
    };
  }

  const cartItem = state.cartItems.find((item) => item.id === productId);
  if (!cartItem) {
    return {
      success: false,
      newState: state,
      error: new CartError("장바구니에 해당 상품이 없습니다.", ERROR_CODES.ITEM_NOT_FOUND),
    };
  }

  const newQuantity = cartItem.quantity + change;

  // 재고 체크
  if (newQuantity > 0 && newQuantity > cartItem.quantity + product.q) {
    return {
      success: false,
      newState: state,
      error: new CartError("재고가 부족합니다.", ERROR_CODES.INSUFFICIENT_STOCK),
    };
  }

  // 장바구니 수량 업데이트
  let newState = updateCartItemQuantity(state, productId, change);

  // 재고 업데이트 (수량이 0이 되면 재고 복구)
  if (newQuantity <= 0) {
    newState = updateProductStock(newState, productId, -cartItem.quantity);
  } else {
    newState = updateProductStock(newState, productId, -change);
  }

  // 계산 실행
  const calculationResult = calculateCartTotals(newState.cartItems, newState.productList);
  newState = updateFromCalculation(newState, calculationResult);

  return {
    success: true,
    newState,
    error: null,
  };
}

/**
 * 아이템 제거 액션
 * @param {Object} state - 현재 상태
 * @param {string} productId - 제거할 상품 ID
 * @returns {Object} { success, newState, error }
 */
export function handleRemoveItemAction(state, productId) {
  const cartItem = state.cartItems.find((item) => item.id === productId);
  if (!cartItem) {
    return {
      success: false,
      newState: state,
      error: new CartError("장바구니에 해당 상품이 없습니다.", ERROR_CODES.ITEM_NOT_FOUND),
    };
  }

  // 장바구니에서 제거
  let newState = removeFromCart(state, productId);

  // 재고 복구
  newState = updateProductStock(newState, productId, -cartItem.quantity);

  // 계산 실행
  const calculationResult = calculateCartTotals(newState.cartItems, newState.productList);
  newState = updateFromCalculation(newState, calculationResult);

  return {
    success: true,
    newState,
    error: null,
  };
}

/**
 * 장바구니 계산 액션
 * @param {Object} state - 현재 상태
 * @returns {Object} { success, newState, error }
 */
export function handleCalculateCartAction(state) {
  try {
    const calculationResult = calculateCartTotals(state.cartItems, state.productList);
    const newState = updateFromCalculation(state, calculationResult);

    return {
      success: true,
      newState,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      newState: state,
      error: new CartError("계산 중 오류가 발생했습니다.", ERROR_CODES.CALCULATION_ERROR),
    };
  }
}

/**
 * 프로모션 액션 (번개세일, 추천할인 등)
 * @param {Object} state - 현재 상태
 * @param {string} promotionType - 프로모션 타입
 * @param {string} productId - 대상 상품 ID
 * @returns {Object} { success, newState, error }
 */
export function handlePromotionAction(state, promotionType, productId) {
  const productIndex = state.productList.findIndex((p) => p.id === productId);
  if (productIndex === -1) {
    return {
      success: false,
      newState: state,
      error: new CartError("상품을 찾을 수 없습니다.", ERROR_CODES.PRODUCT_NOT_FOUND),
    };
  }

  const updatedProducts = [...state.productList];
  const product = { ...updatedProducts[productIndex] };

  switch (promotionType) {
    case "lightning":
      product.onSale = true;
      product.val = Math.round(product.originalVal * 0.8); // 20% 할인
      break;
    case "suggest":
      product.suggestSale = true;
      product.val = Math.round(product.originalVal * 0.95); // 5% 할인
      break;
    case "super":
      product.onSale = true;
      product.suggestSale = true;
      product.val = Math.round(product.originalVal * 0.75); // 25% 할인
      break;
    default:
      return {
        success: false,
        newState: state,
        error: new CartError("알 수 없는 프로모션 타입입니다.", ERROR_CODES.INVALID_PROMOTION),
      };
  }

  updatedProducts[productIndex] = product;

  const newState = {
    ...state,
    productList: updatedProducts,
  };

  // 계산 재실행
  const calculationResult = calculateCartTotals(newState.cartItems, newState.productList);
  const finalState = updateFromCalculation(newState, calculationResult);

  return {
    success: true,
    newState: finalState,
    error: null,
  };
}
