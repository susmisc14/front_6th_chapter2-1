/**
 * 고차 DOM 추상화 함수들
 * 공통적인 DOM 조작 패턴들을 추상화하여 재사용 가능한 함수들로 제공합니다.
 */

/**
 * 요소의 내용을 조건부로 업데이트
 * @param {HTMLElement} element - 업데이트할 요소
 * @param {any} content - 설정할 내용 (HTML 문자열 또는 텍스트)
 * @param {boolean} condition - 업데이트 조건 (기본값: true)
 * @param {boolean} isHTML - HTML로 설정할지 여부 (기본값: true)
 */
export function updateElementContent(element, content, condition = true, isHTML = true) {
  if (!condition) {
    element.innerHTML = '';
    return;
  }
  
  if (isHTML) {
    element.innerHTML = content;
  } else {
    element.textContent = content;
  }
}

/**
 * 요소의 스타일을 조건부로 업데이트
 * @param {HTMLElement} element - 업데이트할 요소
 * @param {Object} styles - 설정할 스타일 객체
 * @param {boolean} condition - 스타일 적용 조건
 */
export function updateElementStyle(element, styles, condition = true) {
  if (condition) {
    Object.assign(element.style, styles);
  } else {
    // 조건이 false면 스타일 제거
    Object.keys(styles).forEach(key => {
      element.style[key] = '';
    });
  }
}

/**
 * 요소의 표시/숨김을 토글
 * @param {HTMLElement} element - 토글할 요소
 * @param {boolean} visible - 표시 여부
 * @param {string} displayValue - 표시할 때의 display 값 (기본값: 'block')
 */
export function toggleElementVisibility(element, visible, displayValue = 'block') {
  element.style.display = visible ? displayValue : 'none';
}

/**
 * 두 개의 텍스트가 포함된 row 요소를 생성
 * @param {string} leftText - 왼쪽 텍스트
 * @param {string} rightText - 오른쪽 텍스트
 * @param {string} className - 추가할 클래스명
 * @returns {HTMLElement} 생성된 row 요소
 */
export function createTextRow(leftText, rightText, className = 'flex justify-between text-xs tracking-wide text-gray-400') {
  const row = document.createElement('div');
  row.className = className;
  
  const left = document.createElement('span');
  left.textContent = leftText;
  
  const right = document.createElement('span');
  right.textContent = rightText;
  
  row.appendChild(left);
  row.appendChild(right);
  
  return row;
}

/**
 * HTML 내용이 포함된 row 요소를 생성
 * @param {string} leftHTML - 왼쪽 HTML 내용
 * @param {string} rightHTML - 오른쪽 HTML 내용
 * @param {string} className - 추가할 클래스명
 * @returns {HTMLElement} 생성된 row 요소
 */
export function createHTMLRow(leftHTML, rightHTML, className = 'flex justify-between text-sm tracking-wide text-green-400') {
  const row = document.createElement('div');
  row.className = className;
  row.innerHTML = `<span class="text-xs">${leftHTML}</span><span class="text-xs">${rightHTML}</span>`;
  return row;
}

/**
 * 컨테이너의 자식 요소들을 일괄 업데이트
 * @param {HTMLElement} container - 컨테이너 요소
 * @param {Object} config - 설정 객체
 * @param {Array} config.items - 업데이트할 아이템 배열
 * @param {Function} config.matcher - 아이템을 매칭하는 함수 (element, item) => boolean
 * @param {Function} config.updater - 업데이트 함수 (element, item) => void
 */
export function updateChildElements(container, { items, matcher, updater }) {
  const children = Array.from(container.children);
  
  children.forEach(child => {
    const matchedItem = items.find(item => matcher(child, item));
    if (matchedItem) {
      updater(child, matchedItem);
    }
  });
}

/**
 * 컨테이너에 여러 요소들을 일괄 추가
 * @param {HTMLElement} container - 컨테이너 요소
 * @param {Array<HTMLElement>} elements - 추가할 요소들
 * @param {boolean} clearFirst - 먼저 컨테이너를 비울지 여부 (기본값: false)
 */
export function appendElements(container, elements, clearFirst = false) {
  if (clearFirst) {
    container.innerHTML = '';
  }
  
  elements.forEach(element => {
    container.appendChild(element);
  });
}

/**
 * 이벤트 리스너를 일괄 설정
 * @param {Array} eventConfigs - 이벤트 설정 배열 [{element, event, handler, options}]
 */
export function setupEventListeners(eventConfigs) {
  eventConfigs.forEach(({ element, event, handler, options }) => {
    element.addEventListener(event, handler, options);
  });
}

/**
 * 조건부 클래스 토글
 * @param {HTMLElement} element - 대상 요소
 * @param {string} className - 토글할 클래스명
 * @param {boolean} condition - 토글 조건
 */
export function toggleClass(element, className, condition) {
  if (condition) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

/**
 * 다중 요소 스타일 업데이트
 * @param {Array<HTMLElement>} elements - 업데이트할 요소들
 * @param {Object} styles - 적용할 스타일 객체
 * @param {boolean} condition - 적용 조건
 */
export function updateMultipleElementStyles(elements, styles, condition = true) {
  elements.forEach(element => {
    updateElementStyle(element, styles, condition);
  });
}

/**
 * 요소의 속성을 조건부로 업데이트
 * @param {HTMLElement} element - 업데이트할 요소
 * @param {Object} attributes - 설정할 속성 객체
 * @param {boolean} condition - 설정 조건
 */
export function updateElementAttributes(element, attributes, condition = true) {
  if (condition) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  } else {
    Object.keys(attributes).forEach(key => {
      element.removeAttribute(key);
    });
  }
}

/**
 * 요소 선택기 추상화
 * @param {HTMLElement} root - 루트 요소
 * @param {Object} selectors - 셀렉터 객체 {key: selector}
 * @returns {Object} 선택된 요소들의 객체
 */
export function selectElements(root, selectors) {
  const result = {};
  Object.entries(selectors).forEach(([key, selector]) => {
    result[key] = root.querySelector(selector);
  });
  return result;
}

/**
 * 부모-자식 관계를 일괄 설정
 * @param {Array} relationships - 관계 배열 [{parent, children}]
 */
export function establishParentChildRelationships(relationships) {
  relationships.forEach(({ parent, children }) => {
    children.forEach(child => {
      parent.appendChild(child);
    });
  });
}
