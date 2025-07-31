import React, { memo, useCallback } from "react";
import { CSS_CLASSES } from "../../constants";
import { useAppContext } from "../../context/AppContext";
import CartItem from "./CartItem";

const Cart: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const handleQuantityChange = useCallback(
    (productId: string, quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
    },
    [dispatch],
  );

  const handleRemove = useCallback(
    (productId: string) => {
      dispatch({ type: "REMOVE_FROM_CART", payload: { productId } });
    },
    [dispatch],
  );

  if (state.cartItems.length === 0) {
    return (
      <div id="cart-items" data-testid="cart-items" className={CSS_CLASSES.CART_ITEMS}>
        <p className="py-8 text-center text-gray-500">장바구니가 비어있습니다.</p>
      </div>
    );
  }

  return (
    <div id="cart-items" data-testid="cart-items" className={CSS_CLASSES.CART_ITEMS}>
      {state.cartItems.map((item, index) => (
        <CartItem
          key={item.id}
          item={item}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
          isFirst={index === 0}
          isLast={index === state.cartItems.length - 1}
        />
      ))}
    </div>
  );
};

export default memo(Cart);
