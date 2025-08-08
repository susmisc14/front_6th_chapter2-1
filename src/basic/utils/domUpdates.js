/**
 * 순수한 DOM 업데이트 함수들
 * 각 함수는 입력을 받아서 DOM 요소를 업데이트하는 순수 함수입니다.
 * 비즈니스 로직은 포함하지 않고, 오직 DOM 조작만 담당합니다.
 */

import {
  updateElementContent,
  updateElementStyle,
  toggleElementVisibility,
  createTextRow,
  createHTMLRow,
  updateChildElements,
  appendElements,
  selectElements,
  establishParentChildRelationships
} from './domAbstractions.js';

import {
  sum,
  createSummaryStructure,
  defineLayoutRelationships,
  defineSelectorGroups,
  defineUIUpdateConfig,
  defineLayoutElements,
  createLayoutRelationshipsFromArray,
  filterLayoutElements,
  defineVisualLayout,
  convertVisualLayoutToFlat,
  getAllLayoutVisualizations
} from './declarativeHelpers.js';

/**
 * select 요소의 innerHTML을 업데이트하고 재고 상태에 따라 스타일을 적용
 * @param {HTMLSelectElement} selectElement - 업데이트할 select 요소
 * @param {Object} options - 옵션 객체
 * @param {string} options.optionsHtml - select 옵션들의 HTML 문자열
 * @param {number} options.totalStock - 총 재고 수량
 * @param {number} options.threshold - 낮은 재고 임계값
 */
export function updateSelectElement(selectElement, options) {
  const config = defineUIUpdateConfig(options).productSelect;
  
  updateElementContent(selectElement, config.content);
  updateElementStyle(selectElement, config.style, config.condition);
}

/**
 * 카트 아이템들의 가격과 이름을 업데이트
 * @param {HTMLElement} cartContainer - 카트 컨테이너 요소
 * @param {Object} config - 설정 객체
 * @param {Function} config.setPriceLabelNode - 가격 라벨을 설정하는 함수
 * @param {Function} config.renderNamePrefix - 이름 접두사를 렌더링하는 함수
 * @param {Array} config.products - 상품 배열
 */
export function updateCartItemElements(cartContainer, config) {
  const updateConfig = defineUIUpdateConfig(config).cartItems;
  
  updateChildElements(cartContainer, {
    items: config.products,
    matcher: updateConfig.matcher,
    updater: (element, product) => {
      const updateInfo = updateConfig.updater(element, product, config);
      const priceDiv = element.querySelector(updateInfo.priceElement.selector);
      const nameDiv = element.querySelector(updateInfo.nameElement.selector);
      
      updateInfo.priceElement.updater(priceDiv, product);
      updateElementContent(nameDiv, updateInfo.nameElement.content, true, false);
    }
  });
}

/**
 * 주문 요약 세부사항을 렌더링
 * @param {HTMLElement} container - 요약 컨테이너 요소
 * @param {Object} data - 렌더링 데이터
 * @param {Array} data.cartItems - 카트 아이템들
 * @param {Array} data.products - 상품 배열
 * @param {number} data.subtotal - 소계
 * @param {number} data.itemCount - 아이템 개수
 * @param {boolean} data.isTuesday - 화요일 여부
 * @param {number} data.totalAmount - 총 금액
 * @param {Array} data.itemDiscounts - 아이템 할인 정보
 */
export function renderSummaryDetailsToContainer(container, data) {
  updateElementContent(container, '', data.subtotal <= 0);
  if (data.subtotal <= 0) return;
  
  const summaryStructure = createSummaryStructure(data);
  const elements = renderSummaryStructure(summaryStructure);
  
  appendElements(container, elements, true);
}

/**
 * 요약 구조를 실제 DOM 요소로 렌더링
 * @param {Array} structure - 요약 구조 배열
 * @returns {Array} DOM 요소 배열
 */
function renderSummaryStructure(structure) {
  return structure.flatMap(section => {
    switch (section.type) {
      case 'items':
        return section.data.map(({ product, quantity, total }) =>
          createTextRow(
            `${product.name} x ${quantity}`,
            `₩${total.toLocaleString()}`
          )
        );
        
      case 'divider':
        const divider = document.createElement('div');
        divider.className = section.className;
        return [divider];
        
      case 'subtotal':
        return [createTextRow(section.label, section.value, section.className)];
        
      case 'discounts':
        return section.items.map(discount => {
          const className = discount.type === 'tuesday' 
            ? 'flex justify-between text-sm tracking-wide text-purple-400'
            : 'flex justify-between text-sm tracking-wide text-green-400';
          return createHTMLRow(discount.text, discount.value, className);
        });
        
      case 'shipping':
        return [createHTMLRow(section.label, section.value, section.className)];
        
      default:
        return [];
    }
  });
}

/**
 * 할인 정보를 업데이트
 * @param {HTMLElement} discountInfoDiv - 할인 정보 div 요소
 * @param {Object} discount - 할인 정보
 * @param {number} discount.discountRate - 할인율
 * @param {number} discount.savedAmount - 절약된 금액
 * @param {number} discount.totalAmount - 총 금액
 */
export function updateDiscountInfoElement(discountInfoDiv, discountData) {
  const config = defineUIUpdateConfig(discountData).discountInfo;
  const content = config.template(discountData);
  const shouldShow = config.condition(discountData);
  
  updateElementContent(discountInfoDiv, content, shouldShow);
}

/**
 * 적립 포인트 정보를 업데이트
 * @param {HTMLElement} loyaltyPointsDiv - 적립 포인트 div 요소
 * @param {number} bonusPoints - 보너스 포인트
 * @param {Array} pointsDetail - 포인트 세부사항 배열
 */
export function updateLoyaltyPointsElement(loyaltyPointsDiv, bonusPoints, pointsDetail) {
  const data = { bonusPoints, pointsDetail };
  const config = defineUIUpdateConfig(data).loyaltyPoints;
  const content = config.template(data);
  const isHTML = config.isHTML(data);
  
  updateElementContent(loyaltyPointsDiv, content, true, isHTML);
  toggleElementVisibility(loyaltyPointsDiv, true, 'block');
}

/**
 * 도움말 모달 이벤트를 설정
 * @param {HTMLElement} toggleButton - 토글 버튼
 * @param {HTMLElement} overlay - 오버레이 요소
 * @param {HTMLElement} modalContent - 모달 콘텐츠
 */
export function setupHelpModalEventListeners(toggleButton, overlay, modalContent) {
  toggleButton.onclick = function handleManualToggleClick() {
    overlay.classList.toggle('hidden');
    modalContent.classList.toggle('translate-x-full');
  };

  overlay.onclick = function handleOverlayBackgroundClick(e) {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      modalContent.classList.add('translate-x-full');
    }
  };

  overlay.appendChild(modalContent);
}

/**
 * 레이아웃을 조립 (객체 기반 - 호환성용)
 * @param {HTMLElement} root - 루트 요소
 * @param {Object} layout - 레이아웃 요소들
 * @param {HTMLElement} layout.header - 헤더 요소
 * @param {HTMLElement} layout.gridContainer - 그리드 컨테이너
 * @param {HTMLElement} layout.leftColumn - 왼쪽 컬럼
 * @param {HTMLElement} layout.selectorContainer - 셀렉터 컨테이너
 * @param {HTMLElement} layout.rightColumn - 오른쪽 컬럼
 * @param {HTMLElement} layout.selector - 셀렉터
 * @param {HTMLElement} layout.addButton - 추가 버튼
 * @param {HTMLElement} layout.stockInfo - 재고 정보
 * @param {HTMLElement} layout.cartDisplay - 카트 디스플레이
 * @param {HTMLElement} layout.manualToggle - 수동 토글
 * @param {HTMLElement} layout.manualOverlay - 수동 오버레이
 */
export function assembleLayoutElements(root, layoutElements) {
  const relationships = defineLayoutRelationships({ root, ...layoutElements });
  establishParentChildRelationships(relationships);
}

/**
 * 배열 기반 레이아웃을 조립
 * @param {HTMLElement} root - 루트 요소
 * @param {Object} elementMap - 요소 ID와 실제 DOM 요소의 맵
 * @param {Object} options - 레이아웃 옵션
 * @param {Array} options.enabledElements - 활성화할 요소 ID 배열
 * @param {Array} options.disabledElements - 비활성화할 요소 ID 배열
 * @param {Array} options.customLayout - 커스텀 레이아웃 정의 (기본값 사용 안 함)
 */
export function assembleLayoutFromArray(root, elementMap, options = {}) {
  const { enabledElements, disabledElements, customLayout } = options;
  
  // 레이아웃 정의 가져오기 (커스텀 또는 기본값)
  const baseLayout = customLayout || defineLayoutElements();
  
  // 요소 필터링 적용
  const filteredLayout = filterLayoutElements(baseLayout, enabledElements, disabledElements);
  
  // 실제 DOM 요소 맵에 root 추가
  const fullElementMap = { root, ...elementMap };
  
  // 부모-자식 관계 생성
  const relationships = createLayoutRelationshipsFromArray(filteredLayout, fullElementMap);
  
  // 관계에 따라 DOM 조립
  establishParentChildRelationships(relationships);
  
  return {
    appliedLayout: filteredLayout,
    relationships,
    elementMap: fullElementMap
  };
}

/**
 * 시각적 레이아웃 기반으로 DOM 조립 (React JSX-like)
 * @param {HTMLElement} root - 루트 요소
 * @param {Object} elementMap - 요소 ID와 실제 DOM 요소의 맵
 * @param {Object} options - 레이아웃 옵션
 * @param {Object} options.visualLayout - 커스텀 시각적 레이아웃 (기본값: defineVisualLayout())
 * @param {Array} options.enabledElements - 활성화할 요소 ID 배열
 * @param {Array} options.disabledElements - 비활성화할 요소 ID 배열
 * @param {boolean} options.debug - 디버그 모드 (레이아웃 구조 콘솔 출력)
 * @returns {Object} 적용된 레이아웃 정보와 시각화 결과
 */
export function assembleLayoutFromVisual(root, elementMap, options = {}) {
  const { visualLayout, enabledElements, disabledElements, debug = false } = options;
  
  // 시각적 레이아웃 정의 가져오기
  const baseVisualLayout = visualLayout || defineVisualLayout();
  
  // 시각적 레이아웃을 플랫 배열로 변환
  const flatLayout = convertVisualLayoutToFlat(baseVisualLayout);
  
  // 요소 필터링 적용
  const filteredLayout = filterLayoutElements(flatLayout, enabledElements, disabledElements);
  
  // 실제 DOM 요소 맵에 root 추가
  const fullElementMap = { root, ...elementMap };
  
  // 부모-자식 관계 생성
  const relationships = createLayoutRelationshipsFromArray(filteredLayout, fullElementMap);
  
  // 관계에 따라 DOM 조립
  establishParentChildRelationships(relationships);
  
  // 시각화 정보 생성
  const visualizations = getAllLayoutVisualizations(baseVisualLayout);
  
  // 디버그 모드일 때 콘솔에 출력
  if (debug) {
    console.log('🎨 레이아웃 구조 시각화:');
    console.log('\n📊 트리 구조:');
    console.log(visualizations.tree);
    console.log('\n🌐 HTML 구조:');
    console.log(visualizations.html);
    console.log('\n⚛️ JSX 구조:');
    console.log(visualizations.jsx);
    console.log('\n📋 적용된 요소:', filteredLayout.length, '개');
  }
  
  return {
    appliedLayout: filteredLayout,
    relationships,
    elementMap: fullElementMap,
    visualizations,
    originalVisualLayout: baseVisualLayout
  };
}

/**
 * 요약 요소들을 추출
 * @param {HTMLElement} rightColumn - 오른쪽 컬럼
 * @param {HTMLElement} header - 헤더
 * @returns {Object} 추출된 요소들
 */
export function extractSummaryElementsFromDOM(rightColumn, header) {
  const selectorGroups = defineSelectorGroups();
  
  return {
    ...selectElements(rightColumn, selectorGroups.summaryElements),
    ...selectElements(header, selectorGroups.headerElements)
  };
}
