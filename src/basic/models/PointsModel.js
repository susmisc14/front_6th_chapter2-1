import { PRODUCT_ONE, PRODUCT_TWO, PRODUCT_THREE, BASE_POINT_DIVISOR, KEYBOARD_MOUSE_COMBO_POINTS, FULL_SET_COMBO_POINTS, QUANTITY_BONUS_10_POINTS, QUANTITY_BONUS_20_POINTS, QUANTITY_BONUS_30_POINTS, QUANTITY_BONUS_10_THRESHOLD, QUANTITY_BONUS_20_THRESHOLD, QUANTITY_BONUS_30_THRESHOLD } from '../utils/constants.js';

export class PointsModel {
  static computeBasePoints(totalAmount) {
    return Math.floor(totalAmount / BASE_POINT_DIVISOR);
  }

  static computeBonusPoints(cartContainerElement, totalItemCount) {
    const nodes = cartContainerElement.children;
    let keyboardPresent = false;
    let mousePresent = false;
    let monitorArmPresent = false;
    for (const node of nodes) {
      const id = node.id;
      if (id === PRODUCT_ONE) keyboardPresent = true;
      else if (id === PRODUCT_TWO) mousePresent = true;
      else if (id === PRODUCT_THREE) monitorArmPresent = true;
    }

    const details = [];
    let bonus = 0;

    if (keyboardPresent && mousePresent) {
      bonus += KEYBOARD_MOUSE_COMBO_POINTS;
      details.push(`키보드+마우스 세트 +${KEYBOARD_MOUSE_COMBO_POINTS}p`);
    }
    if (keyboardPresent && mousePresent && monitorArmPresent) {
      bonus += FULL_SET_COMBO_POINTS;
      details.push(`풀세트 구매 +${FULL_SET_COMBO_POINTS}p`);
    }

    if (totalItemCount >= QUANTITY_BONUS_30_THRESHOLD) {
      bonus += QUANTITY_BONUS_30_POINTS;
      details.push(`대량구매(${QUANTITY_BONUS_30_THRESHOLD}개+) +${QUANTITY_BONUS_30_POINTS}p`);
    } else if (totalItemCount >= QUANTITY_BONUS_20_THRESHOLD) {
      bonus += QUANTITY_BONUS_20_POINTS;
      details.push(`대량구매(${QUANTITY_BONUS_20_THRESHOLD}개+) +${QUANTITY_BONUS_20_POINTS}p`);
    } else if (totalItemCount >= QUANTITY_BONUS_10_THRESHOLD) {
      bonus += QUANTITY_BONUS_10_POINTS;
      details.push(`대량구매(${QUANTITY_BONUS_10_THRESHOLD}개+) +${QUANTITY_BONUS_10_POINTS}p`);
    }

    return { bonus, details };
  }
}

