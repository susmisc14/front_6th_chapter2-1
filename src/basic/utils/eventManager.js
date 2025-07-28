/**
 * 이벤트 관리 유틸리티
 * React 마이그레이션을 위한 이벤트 관리 시스템
 */

/**
 * 이벤트 관리자 클래스
 */
export class EventManager {
  constructor() {
    this.listeners = new Map();
    this.elementListeners = new WeakMap();
  }

  /**
   * 이벤트 리스너 추가
   * @param {HTMLElement} element - 대상 요소
   * @param {string} eventType - 이벤트 타입
   * @param {Function} handler - 이벤트 핸들러
   * @param {Object} options - 이벤트 옵션
   * @returns {Function} 정리 함수
   */
  addEventListener(element, eventType, handler, options = {}) {
    if (!element) return () => {};

    const key = `${eventType}_${Date.now()}_${Math.random()}`;

    // 요소별 리스너 추적
    if (!this.elementListeners.has(element)) {
      this.elementListeners.set(element, new Map());
    }

    const elementListeners = this.elementListeners.get(element);
    elementListeners.set(key, { eventType, handler, options });

    // 실제 이벤트 리스너 추가
    element.addEventListener(eventType, handler, options);

    // 정리 함수 반환
    return () => {
      this.removeEventListener(element, key);
    };
  }

  /**
   * 이벤트 리스너 제거
   * @param {HTMLElement} element - 대상 요소
   * @param {string} key - 리스너 키
   */
  removeEventListener(element, key) {
    if (!element) return;

    const elementListeners = this.elementListeners.get(element);
    if (!elementListeners) return;

    const listener = elementListeners.get(key);
    if (listener) {
      element.removeEventListener(listener.eventType, listener.handler, listener.options);
      elementListeners.delete(key);
    }
  }

  /**
   * 요소의 모든 이벤트 리스너 제거
   * @param {HTMLElement} element - 대상 요소
   */
  removeAllEventListeners(element) {
    if (!element) return;

    const elementListeners = this.elementListeners.get(element);
    if (!elementListeners) return;

    elementListeners.forEach((listener, key) => {
      element.removeEventListener(listener.eventType, listener.handler, listener.options);
    });

    elementListeners.clear();
    this.elementListeners.delete(element);
  }

  /**
   * 모든 이벤트 리스너 정리
   */
  cleanup() {
    this.elementListeners.forEach((listeners, element) => {
      listeners.forEach((listener, key) => {
        element.removeEventListener(listener.eventType, listener.handler, listener.options);
      });
    });

    this.elementListeners.clear();
    this.listeners.clear();
  }

  /**
   * 이벤트 위임 설정
   * @param {HTMLElement} parent - 부모 요소
   * @param {string} selector - 대상 선택자
   * @param {string} eventType - 이벤트 타입
   * @param {Function} handler - 이벤트 핸들러
   * @param {Object} options - 이벤트 옵션
   * @returns {Function} 정리 함수
   */
  delegate(parent, selector, eventType, handler, options = {}) {
    const delegatedHandler = (event) => {
      const target = event.target.closest(selector);
      if (target && parent.contains(target)) {
        handler.call(target, event, target);
      }
    };

    return this.addEventListener(parent, eventType, delegatedHandler, options);
  }
}

/**
 * 전역 이벤트 관리자 인스턴스
 */
export const eventManager = new EventManager();

/**
 * 편의 함수들
 */
export function addClickHandler(element, handler, options = {}) {
  return eventManager.addEventListener(element, "click", handler, options);
}

export function addChangeHandler(element, handler, options = {}) {
  return eventManager.addEventListener(element, "change", handler, options);
}

export function addSubmitHandler(element, handler, options = {}) {
  return eventManager.addEventListener(element, "submit", handler, options);
}

export function addKeydownHandler(element, handler, options = {}) {
  return eventManager.addEventListener(element, "keydown", handler, options);
}

/**
 * 안전한 이벤트 핸들러 래퍼
 * @param {Function} handler - 원본 핸들러
 * @param {Function} errorHandler - 에러 핸들러
 * @returns {Function} 래핑된 핸들러
 */
export function safeEventHandler(handler, errorHandler = console.error) {
  return function (event) {
    try {
      return handler.call(this, event);
    } catch (error) {
      errorHandler(error);
    }
  };
}

/**
 * 디바운스된 이벤트 핸들러
 * @param {Function} handler - 원본 핸들러
 * @param {number} delay - 지연 시간 (ms)
 * @returns {Function} 디바운스된 핸들러
 */
export function debouncedEventHandler(handler, delay = 300) {
  let timeoutId;

  return function (event) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      handler.call(this, event);
    }, delay);
  };
}

/**
 * 쓰로틀된 이벤트 핸들러
 * @param {Function} handler - 원본 핸들러
 * @param {number} limit - 제한 시간 (ms)
 * @returns {Function} 쓰로틀된 핸들러
 */
export function throttledEventHandler(handler, limit = 300) {
  let inThrottle;

  return function (event) {
    if (!inThrottle) {
      handler.call(this, event);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
