/**
 * 체계적인 에러 처리 시스템
 * 에러 타입별로 분류하고 적절한 처리 방법을 제공
 */

/**
 * 에러 타입 정의
 */
export const ERROR_TYPES = {
  VALIDATION: "VALIDATION",
  BUSINESS_LOGIC: "BUSINESS_LOGIC",
  DOM_OPERATION: "DOM_OPERATION",
  NETWORK: "NETWORK",
  UNKNOWN: "UNKNOWN",
};

/**
 * 에러 코드 정의
 */
export const ERROR_CODES = {
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  NO_PRODUCT_SELECTED: "NO_PRODUCT_SELECTED",
  INVALID_QUANTITY: "INVALID_QUANTITY",
  DOM_ELEMENT_NOT_FOUND: "DOM_ELEMENT_NOT_FOUND",
  CALCULATION_ERROR: "CALCULATION_ERROR",
};

/**
 * 커스텀 에러 클래스
 */
export class CartError extends Error {
  constructor(message, code, type = ERROR_TYPES.BUSINESS_LOGIC) {
    super(message);
    this.name = "CartError";
    this.code = code;
    this.type = type;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * 에러 로깅
 * @param {CartError} error - 에러 객체
 */
export function logError(error) {
  console.error(`[${error.type}] ${error.code}: ${error.message}`, {
    timestamp: error.timestamp,
    stack: error.stack,
  });
}

/**
 * 사용자 친화적 에러 메시지 생성
 * @param {CartError} error - 에러 객체
 * @returns {string} 사용자 친화적 메시지
 */
export function getUserFriendlyMessage(error) {
  const messageMap = {
    [ERROR_CODES.PRODUCT_NOT_FOUND]: "상품을 찾을 수 없습니다.",
    [ERROR_CODES.INSUFFICIENT_STOCK]: "재고가 부족합니다.",
    [ERROR_CODES.NO_PRODUCT_SELECTED]: "상품을 선택해주세요.",
    [ERROR_CODES.INVALID_QUANTITY]: "유효하지 않은 수량입니다.",
    [ERROR_CODES.DOM_ELEMENT_NOT_FOUND]: "페이지 요소를 찾을 수 없습니다.",
    [ERROR_CODES.CALCULATION_ERROR]: "계산 중 오류가 발생했습니다.",
  };

  return messageMap[error.code] || "알 수 없는 오류가 발생했습니다.";
}

/**
 * 에러 처리 및 사용자 알림
 * @param {CartError} error - 에러 객체
 * @param {boolean} showAlert - 알림 표시 여부
 */
export function handleError(error, showAlert = true) {
  logError(error);

  if (showAlert) {
    const userMessage = getUserFriendlyMessage(error);
    alert(userMessage);
  }
}

/**
 * 안전한 함수 실행 래퍼
 * @param {Function} fn - 실행할 함수
 * @param {string} context - 함수 컨텍스트
 * @returns {any} 함수 실행 결과
 */
export function safeExecute(fn, context = "Unknown") {
  try {
    return fn();
  } catch (error) {
    const cartError =
      error instanceof CartError
        ? error
        : new CartError(error.message, "UNKNOWN_ERROR", ERROR_TYPES.UNKNOWN);

    handleError(cartError);
    return null;
  }
}

/**
 * 비동기 함수 안전 실행 래퍼
 * @param {Function} asyncFn - 실행할 비동기 함수
 * @param {string} context - 함수 컨텍스트
 * @returns {Promise<any>} 함수 실행 결과
 */
export async function safeExecuteAsync(asyncFn, context = "Unknown") {
  try {
    return await asyncFn();
  } catch (error) {
    const cartError =
      error instanceof CartError
        ? error
        : new CartError(error.message, "UNKNOWN_ERROR", ERROR_TYPES.UNKNOWN);

    handleError(cartError);
    return null;
  }
}
