import React, {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { LIGHTNING_SALE_INTERVAL, PRODUCT_DATA, SUGGEST_SALE_INTERVAL } from "../constants";
import type { AppAction, AppState, UIState } from "../types";

// 초기 UI 상태
const initialUIState: UIState = {
  selectedProductId: null,
  isTuesday: false,
  showTuesdayBanner: false,
  showDiscountInfo: false,
  discountRate: 0,
  savedAmount: 0,
  loyaltyPoints: 0,
  pointsDetail: [],
};

// 초기 앱 상태
const initialState: AppState = {
  productList: Object.values(PRODUCT_DATA),
  cartItems: [],
  totalAmount: 0,
  itemCount: 0,
  lastSelectedProduct: null,
  uiState: initialUIState,
};

// 리듀서 함수
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { productId, quantity } = action.payload;
      const product = state.productList.find((p) => p.id === productId);

      if (!product || product.q < quantity) {
        return state; // 재고 부족 시 상태 변경 없음
      }

      const existingItem = state.cartItems.find((item) => item.id === productId);
      let newCartItems;

      if (existingItem) {
        // 기존 아이템 수량 증가
        newCartItems = state.cartItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.q) }
            : item,
        );
      } else {
        // 새 아이템 추가
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.val,
          originalPrice: product.originalVal,
          quantity: Math.min(quantity, product.q),
          onSale: product.onSale,
          suggestSale: product.suggestSale,
        };
        newCartItems = [...state.cartItems, newItem];
      }

      return {
        ...state,
        cartItems: newCartItems,
        lastSelectedProduct: productId,
      };
    }

    case "REMOVE_FROM_CART": {
      const { productId } = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== productId),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      const product = state.productList.find((p) => p.id === productId);

      if (!product) return state;

      if (quantity <= 0) {
        // 수량이 0 이하면 제거
        return {
          ...state,
          cartItems: state.cartItems.filter((item) => item.id !== productId),
        };
      }

      // 재고 확인
      const maxQuantity = Math.min(quantity, product.q);

      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === productId ? { ...item, quantity: maxQuantity } : item,
        ),
      };
    }

    case "SELECT_PRODUCT": {
      const { productId } = action.payload;
      return {
        ...state,
        lastSelectedProduct: productId,
        uiState: {
          ...state.uiState,
          selectedProductId: productId,
        },
      };
    }

    case "UPDATE_UI_STATE": {
      return {
        ...state,
        uiState: {
          ...state.uiState,
          ...action.payload,
        },
      };
    }

    case "RESET_CART": {
      return {
        ...state,
        cartItems: [],
        totalAmount: 0,
        itemCount: 0,
        uiState: {
          ...state.uiState,
          discountRate: 0,
          savedAmount: 0,
          loyaltyPoints: 0,
          pointsDetail: [],
        },
      };
    }

    case "UPDATE_PROMOTIONS": {
      const { promotions } = action.payload;
      return {
        ...state,
        productList: state.productList.map((product) => ({
          ...product,
          onSale: promotions.includes("lightning"),
          suggestSale: promotions.includes("suggest"),
        })),
      };
    }

    case "APPLY_LIGHTNING_SALE": {
      const { productId, discountedPrice } = action.payload;
      return {
        ...state,
        productList: state.productList.map((product) =>
          product.id === productId
            ? {
                ...product,
                val: discountedPrice,
                onSale: true,
              }
            : product,
        ),
      };
    }

    case "APPLY_SUGGEST_SALE": {
      const { productId, discountedPrice } = action.payload;
      return {
        ...state,
        productList: state.productList.map((product) =>
          product.id === productId
            ? {
                ...product,
                val: discountedPrice,
                suggestSale: true,
              }
            : product,
        ),
      };
    }

    default:
      return state;
  }
}

// Context 생성
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider 컴포넌트
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 동적 프로모션 시스템 (main.original.js와 동일한 로직)
  useEffect(() => {
    // 번개세일 프로모션 (30초마다)
    const lightningDelay = Math.random() * 10000;
    const lightningTimer = setTimeout(() => {
      const lightningInterval = setInterval(() => {
        const availableProducts = state.productList.filter((p) => p.q > 0 && !p.onSale);
        if (availableProducts.length > 0) {
          const luckyProduct =
            availableProducts[Math.floor(Math.random() * availableProducts.length)];

          // 20% 할인 적용
          const discountedPrice = Math.round(luckyProduct.originalVal * 0.8);

          dispatch({
            type: "APPLY_LIGHTNING_SALE",
            payload: {
              productId: luckyProduct.id,
              discountedPrice,
            },
          });

          alert(`⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
        }
      }, LIGHTNING_SALE_INTERVAL);

      return () => clearInterval(lightningInterval);
    }, lightningDelay);

    // 추천할인 프로모션 (60초마다)
    const suggestDelay = Math.random() * 20000;
    const suggestTimer = setTimeout(() => {
      const suggestInterval = setInterval(() => {
        if (state.cartItems.length > 0 && state.lastSelectedProduct) {
          const availableProducts = state.productList.filter(
            (p) => p.q > 0 && !p.suggestSale && p.id !== state.lastSelectedProduct,
          );

          if (availableProducts.length > 0) {
            const suggestProduct = availableProducts[0];

            // 5% 할인 적용
            const discountedPrice = Math.round(suggestProduct.val * 0.95);

            dispatch({
              type: "APPLY_SUGGEST_SALE",
              payload: {
                productId: suggestProduct.id,
                discountedPrice,
              },
            });

            alert(`💝 ${suggestProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          }
        }
      }, SUGGEST_SALE_INTERVAL);

      return () => clearInterval(suggestInterval);
    }, suggestDelay);

    return () => {
      clearTimeout(lightningTimer);
      clearTimeout(suggestTimer);
    };
  }, [state.productList, state.cartItems.length, state.lastSelectedProduct]);

  const contextValue = useCallback(() => ({ state, dispatch }), [state, dispatch]);

  return <AppContext.Provider value={contextValue()}>{children}</AppContext.Provider>;
};

// 커스텀 훅
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
