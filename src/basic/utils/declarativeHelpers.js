/**
 * 선언적 프로그래밍을 위한 헬퍼 함수들
 * 명령형 코드를 선언적 패턴으로 변환하여 의도를 명확하게 표현합니다.
 */

/**
 * 배열에서 조건에 맞는 첫 번째 요소를 찾음
 * @param {Array} array - 검색할 배열
 * @param {Function} predicate - 조건 함수
 * @returns {any|null} 찾은 요소 또는 null
 */
export const findItem = (array, predicate) => array.find(predicate) || null;

/**
 * 배열의 총합을 계산
 * @param {Array} array - 계산할 배열
 * @param {Function} selector - 값을 선택하는 함수 (기본값: identity)
 * @returns {number} 총합
 */
export const sum = (array, selector = (x) => x) => 
  array.reduce((total, item) => total + selector(item), 0);

/**
 * 조건부 요소 생성
 * @param {boolean} condition - 생성 조건
 * @param {Function} createElement - 요소 생성 함수
 * @returns {Array} 조건에 따른 요소 배열
 */
export const conditionalElement = (condition, createElement) => 
  condition ? [createElement()] : [];

/**
 * 여러 조건부 요소들을 평탄화
 * @param {Array<Function>} elementCreators - 요소 생성 함수 배열
 * @returns {Array} 평탄화된 요소 배열
 */
export const flattenElements = (elementCreators) => 
  elementCreators.flat().filter(Boolean);

/**
 * 카트 아이템에서 상품과 수량 정보를 추출
 * @param {HTMLElement} cartItem - 카트 아이템 요소
 * @param {Array} products - 상품 배열
 * @returns {Object|null} {product, quantity, total} 또는 null
 */
export const extractCartItemData = (cartItem, products) => {
  const product = findItem(products, p => p.id === cartItem.id);
  if (!product) return null;
  
  const quantityElement = cartItem.querySelector('.quantity-number');
  const quantity = parseInt(quantityElement?.textContent || '0');
  const total = product.val * quantity;
  
  return { product, quantity, total };
};

/**
 * 할인 정보 리스트를 생성
 * @param {Object} discountData - 할인 데이터
 * @param {number} discountData.itemCount - 아이템 개수
 * @param {Array} discountData.itemDiscounts - 개별 아이템 할인
 * @param {boolean} discountData.isTuesday - 화요일 여부
 * @param {number} discountData.totalAmount - 총 금액
 * @returns {Array} 할인 정보 요소 배열
 */
export const createDiscountElements = ({ itemCount, itemDiscounts, isTuesday, totalAmount }) => {
  const bulkDiscount = conditionalElement(
    itemCount >= 30,
    () => ({ type: 'bulk', text: '🎉 대량구매 할인 (30개 이상)', value: '-25%' })
  );
  
  const individualDiscounts = itemCount < 30 
    ? itemDiscounts.map(item => ({ 
        type: 'individual', 
        text: `${item.name} (10개↑)`, 
        value: `-${item.discount}%` 
      }))
    : [];
  
  const tuesdayDiscount = conditionalElement(
    isTuesday && totalAmount > 0,
    () => ({ type: 'tuesday', text: '🌟 화요일 추가 할인', value: '-10%' })
  );
  
  return flattenElements([bulkDiscount, individualDiscounts, tuesdayDiscount]);
};

/**
 * 요약 섹션의 구조를 선언적으로 정의
 * @param {Object} summaryData - 요약 데이터
 * @returns {Array} 요약 섹션 구조 배열
 */
export const createSummaryStructure = (summaryData) => {
  const { cartItems, products, subtotal, itemCount, isTuesday, totalAmount, itemDiscounts } = summaryData;
  
  return [
    {
      type: 'items',
      data: Array.from(cartItems).map(item => extractCartItemData(item, products)).filter(Boolean)
    },
    {
      type: 'divider',
      className: 'border-t border-white/10 my-3'
    },
    {
      type: 'subtotal',
      label: 'Subtotal',
      value: `₩${subtotal.toLocaleString()}`,
      className: 'flex justify-between text-sm tracking-wide'
    },
    {
      type: 'discounts',
      items: createDiscountElements({ itemCount, itemDiscounts, isTuesday, totalAmount })
    },
    {
      type: 'shipping',
      label: 'Shipping',
      value: 'Free',
      className: 'flex justify-between text-sm tracking-wide text-gray-400'
    }
  ];
};

/**
 * 레이아웃 관계를 선언적으로 정의 (객체 기반 - 호환성용)
 * @param {Object} elements - 레이아웃 요소들
 * @returns {Array} 부모-자식 관계 배열
 */
export const defineLayoutRelationships = (elements) => {
  const { selectorContainer, leftColumn, gridContainer, root } = elements;
  const { selector, addButton, stockInfo, cartDisplay, header, rightColumn, manualToggle, manualOverlay } = elements;
  
  return [
    { parent: selectorContainer, children: [selector, addButton, stockInfo] },
    { parent: leftColumn, children: [selectorContainer, cartDisplay] },
    { parent: gridContainer, children: [leftColumn, rightColumn] },
    { parent: root, children: [header, gridContainer, manualToggle, manualOverlay] }
  ];
};

/**
 * 레이아웃 요소 정의 (배열 기반)
 * 순서대로 배치되며, 요소 추가/제거가 용이함
 * @returns {Array} 레이아웃 요소 정의 배열
 */
export const defineLayoutElements = () => [
  {
    id: 'header',
    type: 'header',
    parent: 'root',
    order: 0,
    required: true,
    description: '앱 헤더'
  },
  {
    id: 'gridContainer',
    type: 'container',
    parent: 'root',
    order: 1,
    required: true,
    description: '메인 그리드 컨테이너'
  },
  {
    id: 'leftColumn',
    type: 'column',
    parent: 'gridContainer',
    order: 0,
    required: true,
    description: '왼쪽 컬럼 (상품 선택 + 카트)'
  },
  {
    id: 'rightColumn',
    type: 'column',
    parent: 'gridContainer',
    order: 1,
    required: true,
    description: '오른쪽 컬럼 (주문 요약)'
  },
  {
    id: 'selectorContainer',
    type: 'container',
    parent: 'leftColumn',
    order: 0,
    required: true,
    description: '상품 선택 영역'
  },
  {
    id: 'selector',
    type: 'input',
    parent: 'selectorContainer',
    order: 0,
    required: true,
    description: '상품 선택 드롭다운'
  },
  {
    id: 'addButton',
    type: 'button',
    parent: 'selectorContainer',
    order: 1,
    required: true,
    description: '장바구니 추가 버튼'
  },
  {
    id: 'stockInfo',
    type: 'info',
    parent: 'selectorContainer',
    order: 2,
    required: true,
    description: '재고 정보 표시'
  },
  {
    id: 'cartDisplay',
    type: 'display',
    parent: 'leftColumn',
    order: 1,
    required: true,
    description: '장바구니 아이템 표시'
  },
  {
    id: 'manualToggle',
    type: 'button',
    parent: 'root',
    order: 2,
    required: false,
    description: '도움말 토글 버튼'
  },
  {
    id: 'manualOverlay',
    type: 'modal',
    parent: 'root',
    order: 3,
    required: false,
    description: '도움말 모달 오버레이'
  }
];

/**
 * 배열 기반 레이아웃에서 부모-자식 관계를 생성
 * @param {Array} layoutDefinitions - 레이아웃 정의 배열
 * @param {Object} elementMap - 실제 DOM 요소들의 맵
 * @returns {Array} 부모-자식 관계 배열
 */
export const createLayoutRelationshipsFromArray = (layoutDefinitions, elementMap) => {
  // 부모별로 그룹화
  const parentGroups = layoutDefinitions.reduce((acc, def) => {
    if (!def.parent || def.parent === 'root') return acc;
    
    if (!acc[def.parent]) {
      acc[def.parent] = [];
    }
    acc[def.parent].push(def);
    return acc;
  }, {});
  
  // 부모-자식 관계 배열 생성
  const relationships = [];
  
  Object.entries(parentGroups).forEach(([parentId, children]) => {
    const parentElement = elementMap[parentId];
    if (!parentElement) return;
    
    // order 기준으로 정렬
    const sortedChildren = children
      .sort((a, b) => a.order - b.order)
      .map(child => elementMap[child.id])
      .filter(Boolean);
    
    if (sortedChildren.length > 0) {
      relationships.push({
        parent: parentElement,
        children: sortedChildren
      });
    }
  });
  
  // root 레벨 요소들 처리
  const rootChildren = layoutDefinitions
    .filter(def => def.parent === 'root')
    .sort((a, b) => a.order - b.order)
    .map(def => elementMap[def.id])
    .filter(Boolean);
    
  if (rootChildren.length > 0 && elementMap.root) {
    relationships.push({
      parent: elementMap.root,
      children: rootChildren
    });
  }
  
  return relationships;
};

/**
 * 레이아웃 요소 필터링 (선택적 요소 제어)
 * @param {Array} layoutDefinitions - 전체 레이아웃 정의
 * @param {Array} enabledElements - 활성화할 요소 ID 배열
 * @param {Array} disabledElements - 비활성화할 요소 ID 배열
 * @returns {Array} 필터링된 레이아웃 정의
 */
export const filterLayoutElements = (layoutDefinitions, enabledElements = null, disabledElements = []) => {
  return layoutDefinitions.filter(def => {
    // 필수 요소는 항상 포함
    if (def.required) return true;
    
    // 비활성화 목록에 있으면 제외
    if (disabledElements.includes(def.id)) return false;
    
    // 활성화 목록이 지정되어 있으면 그것만 포함
    if (enabledElements && !enabledElements.includes(def.id)) return false;
    
    return true;
  });
};

/**
 * JSX-like 레이아웃 구조 정의 (시각적으로 보기 쉬운 형태)
 * @returns {Object} 트리 구조로 표현된 레이아웃
 */
export const defineVisualLayout = () => ({
  type: 'root',
  id: 'root',
  children: [
    {
      type: 'header',
      id: 'header',
      description: '🏪 앱 헤더 (제목, 아이템 카운트)',
      required: true
    },
    {
      type: 'container',
      id: 'gridContainer',
      description: '📦 메인 그리드 컨테이너',
      required: true,
      children: [
        {
          type: 'column',
          id: 'leftColumn',
          description: '👈 왼쪽 컬럼',
          required: true,
          children: [
            {
              type: 'container',
              id: 'selectorContainer',
              description: '🛒 상품 선택 영역',
              required: true,
              children: [
                {
                  type: 'input',
                  id: 'selector',
                  description: '📋 상품 선택 드롭다운',
                  required: true
                },
                {
                  type: 'button',
                  id: 'addButton',
                  description: '➕ 장바구니 추가 버튼',
                  required: true
                },
                {
                  type: 'info',
                  id: 'stockInfo',
                  description: '📊 재고 정보 표시',
                  required: true
                }
              ]
            },
            {
              type: 'display',
              id: 'cartDisplay',
              description: '🛍️ 장바구니 아이템 목록',
              required: true
            }
          ]
        },
        {
          type: 'column',
          id: 'rightColumn',
          description: '👉 오른쪽 컬럼 (주문 요약)',
          required: true
        }
      ]
    },
    {
      type: 'button',
      id: 'manualToggle',
      description: '❓ 도움말 토글 버튼',
      required: false
    },
    {
      type: 'modal',
      id: 'manualOverlay',
      description: '📖 도움말 모달 오버레이',
      required: false
    }
  ]
});

/**
 * 시각적 레이아웃을 텍스트 트리로 출력
 * @param {Object} layout - 레이아웃 객체
 * @param {number} depth - 들여쓰기 깊이
 * @returns {string} 트리 형태의 텍스트
 */
export const visualizeLayoutTree = (layout, depth = 0) => {
  const indent = '  '.repeat(depth);
  const icon = layout.required ? '🔒' : '🔧';
  const line = `${indent}${icon} ${layout.id} (${layout.type}) - ${layout.description || ''}`;
  
  if (!layout.children || layout.children.length === 0) {
    return line;
  }
  
  const childrenText = layout.children
    .map(child => visualizeLayoutTree(child, depth + 1))
    .join('\n');
    
  return `${line}\n${childrenText}`;
};

/**
 * HTML-like 구조로 레이아웃 시각화
 * @param {Object} layout - 레이아웃 객체
 * @param {number} depth - 들여쓰기 깊이
 * @returns {string} HTML-like 구조 텍스트
 */
export const visualizeLayoutHTML = (layout, depth = 0) => {
  const indent = '  '.repeat(depth);
  const requiredAttr = layout.required ? ' required' : '';
  const typeAttr = layout.type ? ` type="${layout.type}"` : '';
  
  if (!layout.children || layout.children.length === 0) {
    return `${indent}<${layout.id}${typeAttr}${requiredAttr} />`;
  }
  
  const childrenHTML = layout.children
    .map(child => visualizeLayoutHTML(child, depth + 1))
    .join('\n');
    
  return `${indent}<${layout.id}${typeAttr}${requiredAttr}>\n${childrenHTML}\n${indent}</${layout.id}>`;
};

/**
 * React Component처럼 레이아웃 구조 표현
 * @param {Object} layout - 레이아웃 객체
 * @param {number} depth - 들여쓰기 깊이
 * @returns {string} React-like JSX 구조
 */
export const visualizeLayoutJSX = (layout, depth = 0) => {
  const indent = '  '.repeat(depth);
  const requiredProp = layout.required ? ' required={true}' : ' required={false}';
  const typeProp = layout.type ? ` type="${layout.type}"` : '';
  const descProp = layout.description ? ` description="${layout.description}"` : '';
  
  if (!layout.children || layout.children.length === 0) {
    return `${indent}<${capitalize(layout.id)}${typeProp}${requiredProp}${descProp} />`;
  }
  
  const childrenJSX = layout.children
    .map(child => visualizeLayoutJSX(child, depth + 1))
    .join('\n');
    
  return `${indent}<${capitalize(layout.id)}${typeProp}${requiredProp}${descProp}>\n${childrenJSX}\n${indent}</${capitalize(layout.id)}>`;
};

/**
 * 문자열 첫 글자를 대문자로 변환
 * @param {string} str - 변환할 문자열
 * @returns {string} 첫 글자가 대문자인 문자열
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * 시각적 레이아웃을 플랫 배열로 변환 (기존 시스템과 호환)
 * @param {Object} layout - 시각적 레이아웃 객체
 * @param {string} parentId - 부모 ID
 * @param {number} order - 순서
 * @returns {Array} 플랫 배열 형태의 레이아웃 정의
 */
export const convertVisualLayoutToFlat = (layout, parentId = 'root', order = 0) => {
  const flatLayout = [];
  
  // 현재 요소 추가
  if (layout.id !== 'root') {
    flatLayout.push({
      id: layout.id,
      type: layout.type,
      parent: parentId,
      order,
      required: layout.required || false,
      description: layout.description || ''
    });
  }
  
  // 자식 요소들 재귀적으로 처리
  if (layout.children) {
    layout.children.forEach((child, index) => {
      const childLayout = convertVisualLayoutToFlat(
        child, 
        layout.id === 'root' ? 'root' : layout.id, 
        index
      );
      flatLayout.push(...childLayout);
    });
  }
  
  return flatLayout;
};

/**
 * 레이아웃 시각화 모든 형태 출력
 * @param {Object} layout - 레이아웃 객체 (기본값: defineVisualLayout())
 * @returns {Object} 모든 시각화 결과
 */
export const getAllLayoutVisualizations = (layout = defineVisualLayout()) => {
  return {
    tree: visualizeLayoutTree(layout),
    html: visualizeLayoutHTML(layout),
    jsx: visualizeLayoutJSX(layout),
    flat: convertVisualLayoutToFlat(layout)
  };
};

/**
 * 요소 선택자를 그룹별로 정의
 * @returns {Object} 선택자 그룹들
 */
export const defineSelectorGroups = () => ({
  summaryElements: {
    sum: '#cart-total',
    summaryDetails: '#summary-details',
    discountInfo: '#discount-info',
    points: '#loyalty-points',
    tuesdayBanner: '#tuesday-special'
  },
  headerElements: {
    itemCount: '#item-count'
  }
});

/**
 * UI 업데이트 설정을 선언적으로 정의
 * @param {Object} config - 설정 객체
 * @returns {Object} UI 업데이트 설정
 */
export const defineUIUpdateConfig = (config) => ({
  productSelect: {
    content: config.optionsHtml || '',
    style: { borderColor: 'orange' },
    condition: (config.totalStock || 0) < (config.threshold || 0)
  },
  
  cartItems: {
    matcher: (element, product) => element.id === product.id,
    updater: (element, product, { setPriceLabelNode, renderNamePrefix }) => ({
      priceElement: { selector: '.text-lg', updater: setPriceLabelNode },
      nameElement: { selector: 'h3', content: renderNamePrefix(product) + product.name }
    })
  },
  
  discountInfo: {
    template: (data) => `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(data.discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(data.savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>`,
    condition: (data) => data.discountRate > 0 && data.totalAmount > 0
  },
  
  loyaltyPoints: {
    template: (data) => data.bonusPoints > 0 
      ? `<div>적립 포인트: <span class="font-bold">${data.bonusPoints}p</span></div>` +
        `<div class="text-2xs opacity-70 mt-1">${data.pointsDetail.join(', ')}</div>`
      : '적립 포인트: 0p',
    isHTML: (data) => data.bonusPoints > 0
  }
});
