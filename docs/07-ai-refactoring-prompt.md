# AI 리팩토링 실행 프롬프트

## 🎯 MISSION: main.basic.js 완전 리팩토링

당신은 **Senior Full-Stack Developer**로서 레거시 JavaScript 코드를 현대적인 아키텍처로 리팩토링하는 임무를 수행합니다.

### 🔥 CRITICAL CONSTRAINTS (절대 준수)

```yaml
ABSOLUTE_REQUIREMENTS:
  - REFERENCE_BASELINE: "main.original.js - 모든 동작과 시각적 표현의 절대 기준점"
  - VISUAL_IDENTITY: "원본과 1픽셀도 다르지 않은 완전 동일한 UI/UX"
  - FUNCTIONAL_IDENTITY: "모든 기능, 계산, 타이머 동작 완전 일치"
  - TEST_COMPATIBILITY: "기존 77개 테스트 케이스 100% 통과 필수"
  - ENTRY_POINT_PRESERVATION: "main.basic.js 파일만 수정, 새 엔트리포인트 생성 금지"
  - TEST_CODE_UNTOUCHABLE: "basic.test.js 파일 수정 절대 금지"
  - SYNCHRONOUS_EXECUTION: "main.original.js 분석 결과, '번개세일'과 '추천할인' 타이머를 제외한 모든 로직은 동기적으로 동작함. 리팩토링 코드에서도 동일한 동기 실행 순서를 유지해야 하며, Promise/async, requestAnimationFrame, setTimeout(0) 등으로 실행을 지연시키지 말 것. init(), 이벤트 핸들러, 계산 및 DOM 업데이트는 호출 즉시 완료되어야 함"
  - PHASE_IMMEDIATE_APPLY: "각 Phase 및 서브태스크 완료 즉시 main.basic.js에 반영하고, 누적 일괄 반영 금지. 적용 직후 테스트 실행"
```

### 📁 TARGET ARCHITECTURE

```
src/basic/
├── main.basic.js           # 🔥 유일한 엔트리포인트 (수정만 가능)
├── controllers/
│   ├── CartController.js   # 장바구니 UI 이벤트 처리
│   ├── ProductController.js # 상품 선택 UI 이벤트 처리
│   ├── SummaryController.js # 주문 요약 UI 업데이트
│   └── ModalController.js  # 모달 UI 관리
├── components/             # 템플릿 리터럴 기반 UI 컴포넌트(순수 함수)
│   ├── Header.template.js            # 헤더 블록
│   ├── ProductSelector.template.js   # 셀렉터/버튼/재고
│   ├── CartItem.template.js          # 장바구니 아이템 라인
│   ├── OrderSummary.template.js      # 요약/합계/포인트/할인
│   └── Modal.template.js             # 이용 안내 모달
├── services/
│   ├── StateManager.js     # 중앙 상태 관리 (Observer 패턴)
│   ├── UIUpdater.js        # DOM 업데이트 전용
│   ├── TimerService.js     # 번개세일/추천할인 타이머
│   └── EventBus.js         # 컴포넌트 간 통신
├── models/
│   ├── CartModel.js        # 장바구니 비즈니스 로직
│   ├── ProductModel.js     # 상품 관리 로직
│   ├── DiscountModel.js    # 할인 정책 (화요일/번개세일/추천)
│   └── PointsModel.js      # 포인트 계산 로직
├── utils/
│   ├── constants.js        # 상수 정의 (UPPER_SNAKE_CASE)
│   ├── calculations.js     # 순수 계산 함수
│   └── formatters.js       # 포맷팅 유틸리티
└── data/
    └── products.js         # 상품 데이터
```

## 🚀 EXECUTION PHASES

### PHASE 0: 코드 분석 및 기반 준비
```yaml
TASKS:
  - main.original.js 완전 분석 (함수별 역할, 의존성, DOM 조작 방식)
  - 타이머 로직 상세 분석 (번개세일 30초, 추천할인 60초)
  - 현재 main.basic.js와 원본 차이점 분석
  - 테스트 케이스별 DOM 의존성 매핑
  - ES6+ 문법 적용 계획 수립
  - 원본의 동기/비동기 경계 확정: 타이머(번개세일/추천할인) 외 모든 경로가 동기임을 확인하고, 동기 실행 보존 전략 수립

DELIVERABLES:
  - 코드 분석 보고서
  - 리팩토링 전략 문서
  - 기술적 리스크 분석
```

### PHASE 1: 데이터 및 상수 분리
```yaml
TASKS:
  - products.js: 상품 데이터 분리
  - constants.js: 할인율, 포인트율, UI 상수 정의
  - var → const/let 전면 교체 (100% 적용)
  - 템플릿 리터럴 도입 (문자열 연결 제거)
  - 기존 코드에서 새 모듈 import

ES6_FOCUS:
  - const/let 완전 전환
  - 템플릿 리터럴 100% 적용
  - 객체 축약 표현 도입
  - 배열 메서드 기본 적용

VALIDATION:
  - npx vitest run (모든 테스트 통과)
  - 원본과 시각적 완전 일치 확인
  - 기능 동작 정확성 검증
```

### PHASE 2: Models 및 Services 구현
```yaml
TASKS:
  - StateManager: 중앙 상태 관리 (Observer 패턴)
  - CartModel: 장바구니 비즈니스 로직 (순수 함수)
  - ProductModel: 상품 관리 로직
  - DiscountModel: 할인 정책 (화요일/번개세일/추천할인)
  - PointsModel: 포인트 계산 로직
  - TimerService: 타이머 관리 (EventBus 연동)
  - EventBus: 컴포넌트 간 통신

ES6_FOCUS:
  - ES6 클래스 기반 아키텍처
  - Private 필드 (#) 적극 활용
  - 화살표 함수 메서드 우선 적용
  - 구조 분해 할당 매개변수/반환값
  - 스프레드 연산자 상태 업데이트
  - Map/Set 이벤트 관리

ARCHITECTURE_PATTERNS:
  - Observer 패턴 (StateManager)
  - Strategy 패턴 (DiscountModel)
  - Command 패턴 (EventBus)
  - 의존성 주입 (생성자)
```

### PHASE 3: Controllers 구현 (UI 로직 분리)
```yaml
TASKS:
  - CartController: 장바구니 UI 이벤트 처리
  - ProductController: 상품 선택 UI 이벤트
  - SummaryController: 주문 요약 UI 업데이트
  - ModalController: 모달 UI 관리
  - UIUpdater: DOM 업데이트 전용 서비스
  - Template Components: 템플릿 리터럴 HTML을 `components/*.template.js` 순수 함수로 분리하고, Controller/UIUpdater에서 결과 문자열만 주입

DOM_PRESERVATION:
  - 기존 HTML 구조 완전 보존
  - ID/클래스명 변경 금지
  - 이벤트 처리 방식 호환성 유지
  - 테스트 의존성 DOM 요소 보존

ES6_FOCUS:
  - async/await 타이머 개선
  - 선택적 체이닝 (?.) 안전한 접근
  - Nullish 병합 (??) 기본값 처리
  - 배열 메서드 체이닝 활용
  - Rest/Spread 매개변수 활용
```

### PHASE 4: 이벤트 시스템 통합
```yaml
TASKS:
  - EventBus와 Controllers 연결
  - TimerService 이벤트 기반 통합
  - 타이머 기반 할인 시스템 연결
  - 이벤트 리스너 최적화
  - 메모리 누수 방지 시스템

TIMER_COMPATIBILITY:
  - 번개세일: Math.random() * 10000 후 30초마다
  - 추천할인: Math.random() * 20000 후 60초마다
  - 기존 alert 메시지 보존
  - 타이머 정리 시스템 구축
  - 그 외 모든 로직은 동기 실행 유지 (비동기 변환 금지)
```

### PHASE 5: App Class 아키텍처 도입
```yaml
TASKS:
  - ShoppingCartApp 클래스 설계
  - 생명주기 관리 (init, start, destroy)
  - Controllers/Services 조합 관리
  - 의존성 주입 패턴 구현
  - main() 함수 구조 보존

MAIN_FUNCTION_PRESERVATION:
  - function main() { ... } main(); 패턴 절대 유지
  - main() 내부에서만 App 인스턴스 생성
  - 테스트 호환성 완전 보장
  - DOM 접근 타이밍 보존

APP_CLASS_STRUCTURE:
```javascript
class ShoppingCartApp {
  constructor(dependencies = {}) {
    // 의존성 주입
  }
  
  init() {
    // 동기적 초기화 (테스트 호환성)
  }
  
  start() {
    // 타이머 시작
  }
  
  destroy() {
    // 완벽한 정리
  }
}

function main() {
  const app = new ShoppingCartApp();
  app.init();
  app.start();
  window.__shoppingCartApp = app; // 디버깅용
}

main(); // 기존 패턴 유지
```
```

### PHASE 6: 최종 통합 및 정리
```yaml
TASKS:
  - main.basic.js 파일 최종 정리
  - 전역 함수 완전 제거
  - ES6+ 문법 100% 완성
  - 이벤트 시스템 최종 연결
  - 테스트 호환성 최종 확인

ES6_COMPLETION:
  - var 사용 0% (완전 제거)
  - 화살표 함수 95% 적용
  - 템플릿 리터럴 100% 적용
  - 배열 메서드 90% 적용 (for 루프 최소화)
  - 클래스 100% (function 생성자 제거)
  - 모듈 시스템 적절 활용
```

### PHASE 7: 품질 보증 및 검증
```yaml
TASKS:
  - ESLint 규칙 적용
  - 성능 벤치마크 비교
  - 메모리 누수 검증
  - 문서화 완료
  - 최종 회귀 테스트

VALIDATION_CHECKLIST:
  - 모든 테스트 통과 (npx vitest run)
  - 원본과 시각적 완전 일치
  - 기능 동작 완전 일치
  - 성능 저하 없음
  - 메모리 안정성 확인
```

## 🎨 CODING STANDARDS

### ES6+ 문법 필수 적용
```javascript
// ✅ REQUIRED PATTERNS
const products = [...];           // const/let only
const calculateTotal = (items) => { ... }; // arrow functions
const html = `<div>${item.name}</div>`;    // template literals
const filtered = items.filter(item => item.active); // array methods
const { name, price } = product;   // destructuring
const newState = { ...state, updated: true }; // spread operator

class CartController {
  #privateState = new Map();      // private fields
  
  handleClick = (event) => {      // arrow method
    const { target } = event;    // destructuring params
    this.#updateState(target);   // private method call
  }
}

// ❌ FORBIDDEN PATTERNS
var anything;                    // var usage
function() { ... }              // function expressions
"string" + variable             // string concatenation
for(var i=0; i<len; i++)       // for loops (use array methods)
```

### Template Components (React-like) 원칙
```yaml
GOAL: 템플릿 리터럴 HTML을 재사용 가능한 순수 함수 컴포넌트로 분리
RULES:
  - File Suffix: *.template.js
  - Function Name: renderXxxTemplate(props) – 반드시 순수 함수(사이드이펙트 금지)
  - Input: props 객체만 (UI 데이터)
  - Output: 문자열(HTML)만 – DOM 조작/이벤트 바인딩 금지
  - Injection: Controller/UIUpdater에서 container.innerHTML = render...() 로만 주입
  - Security: 필요 시 escape 유틸 사용으로 XSS 방지
VALIDATION:
  - 기존 DOM 구조/클래스/텍스트 완전 일치
  - 호출 즉시 문자열 반환(동기 보존)
  - 모든 기존 테스트 통과 유지
```

### 프론트엔드 컨벤션 (Toss + nbilly)
```javascript
// 📁 File Naming
CartController.js      // PascalCase (React components)
cartHelpers.js        // camelCase (multiple exports)
src/controllers/      // kebab-case (directories)

// 🏷️ Function Naming
const handleAddToCart = function handleAddToCart() { ... }; // named functions
const handleQuantityChange = (event) => { ... };            // event handlers

// 🔤 Variable Naming
const DISCOUNT_RATE = 0.1;        // UPPER_SNAKE_CASE (constants)
let cartItems = [];               // camelCase (variables)
let discountApplied = false;      // boolean without is-/has- prefix

// 📊 Type Definitions (JSDoc)
/**
 * @typedef {Object} TCartItem
 * @property {string} id
 * @property {string} name
 * @property {number} quantity
 * @property {number} price
 */
```

## 🧪 VALIDATION PROTOCOL

### 실시간 검증 명령어
```bash
npx vitest run              # 모든 테스트 실행
npm run lint:fix           # ESLint 자동 수정
npm run format             # 코드 포맷팅
```

### Phase별 필수 검증
```yaml
AFTER_EACH_PHASE:
  0. Apply Edits: 해당 Phase(또는 서브태스크) 결과를 즉시 main.basic.js에 반영
  1. Test Execution: "npx vitest run" → ALL PASS
  2. Visual Comparison: 원본과 브라우저 동시 실행 비교
  3. Functional Testing: 모든 사용자 시나리오 동작 확인
  4. Performance Check: 렌더링/응답 시간 비교
  5. Memory Check: DevTools로 누수 확인

ROLLBACK_CONDITIONS:
  - 테스트 1개라도 실패
  - 시각적 차이 발견
  - 기능 동작 차이 발견
  - 성능 저하 5% 초과
  - 메모리 누수 감지
```

## 🎯 SUCCESS METRICS

### 최종 달성 목표
```yaml
CODE_QUALITY:
  - ES6+ 문법 적용률: 95% 이상
  - var 사용률: 0% (완전 제거)
  - 함수 복잡도: 10 이하
  - 파일당 라인 수: 200 이하

FUNCTIONALITY:
  - 테스트 통과율: 100% (77/77)
  - 원본 동일성: 100% (시각적/기능적)
  - 성능 유지: ±5% 이내
  - 메모리 안정성: 누수 0건

MAINTAINABILITY:
  - 관심사 분리: Controller/Model/Service 완전 분리
  - 의존성 주입: 100% 적용
  - 단일 책임: 각 클래스별 명확한 역할
  - 테스트 가능성: Mock 주입 가능 구조
```

## 🚨 EMERGENCY PROTOCOLS

### 문제 발생 시 대응
```yaml
TEST_FAILURE:
  1. 즉시 현재 작업 중단
  2. git status 확인
  3. 이전 통과 지점으로 롤백
  4. 문제 원인 분석 후 재시도

VISUAL_DIFFERENCE:
  1. 스크린샷 비교로 차이점 식별
  2. CSS/HTML 구조 변경사항 확인
  3. 원본 구조로 복원
  4. 단계별 재적용

PERFORMANCE_DEGRADATION:
  1. DevTools Performance 탭 분석
  2. 불필요한 재렌더링 식별
  3. 이벤트 리스너 최적화
  4. 메모이제이션 적용 검토

MEMORY_LEAK:
  1. DevTools Memory 탭 분석
  2. 이벤트 리스너 정리 확인
  3. 타이머 정리 확인
  4. 순환 참조 해결
```

## 💡 AI EXECUTION GUIDANCE

### 단계별 실행 방법
1. **Phase 시작 전**: 현재 상태 백업 및 목표 명확화
2. **코드 작성 시**: ES6+ 문법 우선 적용, 컨벤션 준수
3. **완료 후**: 즉시 검증 실행, 문제 시 롤백
4. **다음 Phase**: 이전 Phase 완전 검증 후 진행

### 코드 작성 우선순위
1. **기능 보존**: 원본과 완전 동일한 동작
2. **ES6+ 문법**: 모던 JavaScript 패턴 적용
3. **아키텍처**: Controller/Model/Service 분리
4. **성능**: 불필요한 렌더링 최소화
5. **테스트**: 기존 테스트 호환성 유지

이 프롬프트를 바탕으로 `main.basic.js` 리팩토링을 단계별로 실행하세요. 각 Phase는 독립적으로 검증 가능하며, 문제 발생 시 즉시 롤백하여 안정성을 보장합니다.
