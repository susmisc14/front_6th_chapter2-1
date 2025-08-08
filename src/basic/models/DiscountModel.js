import { PRODUCT_ONE, PRODUCT_TWO, PRODUCT_THREE, PRODUCT_FOUR, PRODUCT_FIVE, TEN_QUANTITY_THRESHOLD, DISCOUNT_KEYBOARD_RATE, DISCOUNT_MOUSE_RATE, DISCOUNT_MONITOR_ARM_RATE, DISCOUNT_POUCH_RATE, DISCOUNT_SPEAKER_RATE, BULK_COUNT_THRESHOLD, BULK_DISCOUNT_RATE, TUESDAY_DISCOUNT_RATE } from '../utils/constants.js';

export class DiscountModel {
  static getItemDiscountRate(productId, quantity) {
    if (quantity < TEN_QUANTITY_THRESHOLD) return 0;
    if (productId === PRODUCT_ONE) return DISCOUNT_KEYBOARD_RATE;
    if (productId === PRODUCT_TWO) return DISCOUNT_MOUSE_RATE;
    if (productId === PRODUCT_THREE) return DISCOUNT_MONITOR_ARM_RATE;
    if (productId === PRODUCT_FOUR) return DISCOUNT_POUCH_RATE;
    if (productId === PRODUCT_FIVE) return DISCOUNT_SPEAKER_RATE;
    return 0;
  }

  static applyBulkAndTuesdayDiscount(subTotalAmount, runningTotalAmount, totalItemCount, isTuesday) {
    let totalAmt = runningTotalAmount;
    let discRate;
    if (totalItemCount >= BULK_COUNT_THRESHOLD) {
      totalAmt = subTotalAmount * (1 - BULK_DISCOUNT_RATE);
      discRate = BULK_DISCOUNT_RATE;
    } else {
      discRate = subTotalAmount > 0 ? (subTotalAmount - totalAmt) / subTotalAmount : 0;
    }
    let tuesdayApplied = false;
    if (isTuesday && totalAmt > 0) {
      totalAmt = totalAmt * (1 - TUESDAY_DISCOUNT_RATE);
      discRate = subTotalAmount > 0 ? 1 - (totalAmt / subTotalAmount) : discRate;
      tuesdayApplied = true;
    }
    return { totalAmt, discRate, tuesdayApplied };
  }
}

