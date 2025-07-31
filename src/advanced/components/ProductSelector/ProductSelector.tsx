import React, { memo, useCallback } from "react";
import { CSS_CLASSES, MESSAGES } from "../../constants";
import { useAppContext } from "../../context/AppContext";

const ProductSelector: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const handleProductSelect = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const productId = event.target.value;
      if (productId) {
        dispatch({ type: "SELECT_PRODUCT", payload: { productId } });
      }
    },
    [dispatch],
  );

  const handleAddToCart = useCallback(() => {
    const selectedProduct = state.productList.find((p) => p.id === state.uiState.selectedProductId);
    if (selectedProduct && selectedProduct.q > 0) {
      dispatch({
        type: "ADD_TO_CART",
        payload: { productId: selectedProduct.id, quantity: 1 },
      });
    }
  }, [state.uiState.selectedProductId, state.productList, dispatch]);

  const getStockStatus = () => {
    // main.original.js와 동일하게 모든 재고 부족/품절 상품 정보 표시
    let infoMsg = "";

    state.productList.forEach((item) => {
      if (item.q < 5) {
        if (item.q > 0) {
          infoMsg += `${item.name}: ${MESSAGES.LOW_STOCK_WARNING} (${item.q}개 남음)\n`;
        } else {
          infoMsg += `${item.name}: ${MESSAGES.OUT_OF_STOCK}\n`;
        }
      }
    });

    return infoMsg;
  };

  const getButtonStyle = () => {
    if (!state.uiState.selectedProductId) return CSS_CLASSES.ADD_BUTTON;

    const product = state.productList.find((p) => p.id === state.uiState.selectedProductId);
    if (!product) return CSS_CLASSES.ADD_BUTTON;

    // 품절 상품일 때 빨간색 스타일 적용
    if (product.q === 0) {
      return "w-full py-3 bg-red-600 text-white text-sm font-medium uppercase tracking-wider hover:bg-red-700 transition-all";
    }

    return CSS_CLASSES.ADD_BUTTON;
  };

  const formatProductOption = (product: any) => {
    let displayText = "";

    if (product.q === 0) {
      displayText = `${product.name} - ${product.val.toLocaleString()}원 (${MESSAGES.OUT_OF_STOCK})`;
    } else {
      if (product.onSale && product.suggestSale) {
        displayText = `⚡💝${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (25% SUPER SALE!)`;
      } else if (product.onSale) {
        displayText = `⚡${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (20% SALE!)`;
      } else if (product.suggestSale) {
        displayText = `💝${product.name} - ${product.originalVal.toLocaleString()}원 → ${product.val.toLocaleString()}원 (5% 추천할인!)`;
      } else {
        displayText = `${product.name} - ${product.val.toLocaleString()}원`;
      }
    }

    return displayText;
  };

  return (
    <div className={CSS_CLASSES.SELECTOR_CONTAINER}>
      <select
        id="product-select"
        className={CSS_CLASSES.PRODUCT_SELECT}
        value={state.uiState.selectedProductId || ""}
        onChange={handleProductSelect}
        aria-label="상품을 선택하세요"
      >
        <option value="" disabled>
          상품을 선택하세요
        </option>
        {state.productList.map((product) => (
          <option key={product.id} value={product.id} disabled={product.q === 0}>
            {formatProductOption(product)}
          </option>
        ))}
      </select>

      <button
        id="add-to-cart"
        className={getButtonStyle()}
        onClick={handleAddToCart}
        disabled={!state.uiState.selectedProductId}
      >
        Add to Cart
      </button>

      <div id="stock-status" data-testid="stock-status" className={CSS_CLASSES.STOCK_INFO}>
        {getStockStatus()}
      </div>
    </div>
  );
};

export default memo(ProductSelector);
