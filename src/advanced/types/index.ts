/**
 * TypeScript 타입 정의
 * React 마이그레이션을 위한 타입 시스템
 */

/**
 * 상품 타입
 */
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly val: number; // 현재 가격 (양수)
  readonly originalVal: number; // 원래 가격 (양수)
  readonly q: number; // 재고 수량 (0 이상)
  readonly onSale: boolean; // 번개세일 여부
  readonly suggestSale: boolean; // 추천할인 여부
}

/**
 * 장바구니 아이템 타입
 */
export interface CartItem {
  readonly id: string;
  readonly name: string;
  readonly price: number; // 현재 가격 (양수)
  readonly originalPrice: number; // 원래 가격 (양수)
  readonly quantity: number; // 수량 (1 이상)
  readonly onSale: boolean; // 번개세일 여부
  readonly suggestSale: boolean; // 추천할인 여부
}

/**
 * 포인트 정보 타입
 */
export interface PointsInfo {
  base: number; // 기본 포인트
  setBonus: number; // 세트 보너스 포인트
  quantityBonus: number; // 수량 보너스 포인트
  total: number; // 총 포인트
}

/**
 * 계산 결과 타입
 */
export interface CalculationResult {
  subtotal: number; // 소계
  totalAmount: number; // 총 결제 금액
  itemCount: number; // 총 아이템 수
  discountRate: number; // 할인율
  itemDiscounts: Array<{
    productId: string;
    discountRate: number;
    savedAmount: number;
  }>;
  isTuesday: boolean; // 화요일 여부
  points: PointsInfo;
}

/**
 * UI 상태 타입
 */
export interface UIState {
  selectedProductId: string | null; // 선택된 상품 ID
  isTuesday: boolean; // 화요일 여부
  showTuesdayBanner: boolean; // 화요일 배너 표시 여부
  showDiscountInfo: boolean; // 할인 정보 표시 여부
  discountRate: number; // 할인율
  savedAmount: number; // 절약된 금액
  loyaltyPoints: number; // 적립 포인트
  pointsDetail: string[]; // 포인트 상세 정보
}

/**
 * 앱 상태 타입
 */
export interface AppState {
  productList: Product[]; // 상품 목록
  cartItems: CartItem[]; // 장바구니 아이템들
  totalAmount: number; // 총 결제 금액
  itemCount: number; // 총 아이템 수
  lastSelectedProduct: string | null; // 마지막 선택된 상품
  uiState: UIState;
}

/**
 * 액션 결과 타입
 */
export interface ActionResult {
  success: boolean; // 성공 여부
  newState: AppState; // 새로운 상태
  error: Error | null; // 에러 객체
}

/**
 * 프로모션 타입
 */
export type PromotionType = "lightning" | "suggest" | "super";

/**
 * 할인율 설정 타입
 */
export interface DiscountRates {
  p1: number; // 상품1 할인율
  p2: number; // 상품2 할인율
  p3: number; // 상품3 할인율
  p4: number; // 상품4 할인율
  p5: number; // 상품5 할인율
}

/**
 * 계산 옵션 타입
 */
export interface CalculationOptions {
  discountRates: DiscountRates; // 할인율 설정
  bulkThreshold: number; // 대량구매 임계값
  bulkDiscountRate: number; // 대량구매 할인율
  tuesdayDiscountRate: number; // 화요일 할인율
  basePointsRate: number; // 기본 포인트 적립률
  tuesdayMultiplier: number; // 화요일 포인트 배수
  setBonuses: Record<string, number>; // 세트 보너스 설정
  quantityBonuses: Record<string, number>; // 수량 보너스 설정
}

/**
 * 액션 타입
 */
export type AppAction =
  | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: { productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "SELECT_PRODUCT"; payload: { productId: string } }
  | { type: "UPDATE_UI_STATE"; payload: Partial<UIState> }
  | { type: "RESET_CART" }
  | { type: "UPDATE_PROMOTIONS"; payload: { promotions: PromotionType[] } }
  | { type: "APPLY_LIGHTNING_SALE"; payload: { productId: string; discountedPrice: number } }
  | { type: "APPLY_SUGGEST_SALE"; payload: { productId: string; discountedPrice: number } };

/**
 * 타입 검증 함수들
 */
export function isValidProduct(product: any): product is Product {
  return (
    product &&
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.val === "number" &&
    typeof product.originalVal === "number" &&
    typeof product.q === "number" &&
    typeof product.onSale === "boolean" &&
    typeof product.suggestSale === "boolean"
  );
}

export function isValidCartItem(item: any): item is CartItem {
  return (
    item &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.originalPrice === "number" &&
    typeof item.quantity === "number" &&
    typeof item.onSale === "boolean" &&
    typeof item.suggestSale === "boolean"
  );
}

export function isValidAppState(state: any): state is AppState {
  return (
    state &&
    Array.isArray(state.productList) &&
    Array.isArray(state.cartItems) &&
    typeof state.totalAmount === "number" &&
    typeof state.itemCount === "number" &&
    (state.lastSelectedProduct === null || typeof state.lastSelectedProduct === "string") &&
    state.uiState &&
    typeof state.uiState.selectedProductId === "string" &&
    typeof state.uiState.isTuesday === "boolean" &&
    typeof state.uiState.showTuesdayBanner === "boolean" &&
    typeof state.uiState.showDiscountInfo === "boolean" &&
    typeof state.uiState.discountRate === "number" &&
    typeof state.uiState.savedAmount === "number" &&
    typeof state.uiState.loyaltyPoints === "number" &&
    Array.isArray(state.uiState.pointsDetail)
  );
}

export function isValidCalculationResult(result: any): result is CalculationResult {
  return (
    result &&
    typeof result.subtotal === "number" &&
    typeof result.totalAmount === "number" &&
    typeof result.itemCount === "number" &&
    typeof result.discountRate === "number" &&
    Array.isArray(result.itemDiscounts) &&
    typeof result.isTuesday === "boolean" &&
    result.points &&
    typeof result.points.base === "number" &&
    typeof result.points.setBonus === "number" &&
    typeof result.points.quantityBonus === "number" &&
    typeof result.points.total === "number"
  );
}
