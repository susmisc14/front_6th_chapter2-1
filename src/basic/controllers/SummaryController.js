import { DiscountModel } from '../models/DiscountModel.js';
import { PointsModel } from '../models/PointsModel.js';
import { updateCartItemPrices, renderSummaryDetails, updateDiscountInfo, updateLoyaltyPoints } from '../services/UIUpdater.js';
import { LOW_STOCK_THRESHOLD, TUESDAY_DAY_OF_WEEK } from '../utils/constants.js';

export class SummaryController {
  constructor({ getProducts, cartDisp, elements }) {
    this.getProducts = getProducts;
    this.cartDisp = cartDisp;
    this.els = elements; // { sumContainer, summaryDetails, discountInfo, itemCount, points, tuesdayBanner, stockInfo }
  }

  calculateAndRender() {
    const prodList = this.getProducts();
    const cartItems = this.cartDisp.children;
    // Empty cart: hide points and reset minimal UI
    if (cartItems.length === 0) {
      if (this.els.points) this.els.points.style.display = 'none';
      if (this.els.summaryDetails) this.els.summaryDetails.innerHTML = '';
      if (this.els.sumContainer) {
        const totalDiv = this.els.sumContainer.querySelector('.text-2xl');
        if (totalDiv) totalDiv.textContent = '₩0';
      }
      if (this.els.discountInfo) this.els.discountInfo.innerHTML = '';
      if (this.els.itemCount) this.els.itemCount.textContent = '🛍️ 0 items in cart';
      if (this.els.tuesdayBanner) this.els.tuesdayBanner.classList.add('hidden');
      if (this.els.stockInfo) this.els.stockInfo.textContent = '';
      return;
    }
    let itemCount = 0;
    let subTotal = 0;
    let totalAmount = 0;
    const itemDiscounts = [];

    // low-stock detection (used for stockInfo only)
    for (let idx = 0; idx < prodList.length; idx++) {
      // no-op push list here; we build message below
    }

    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) { curItem = prodList[j]; break; }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTot = curItem.val * q;
      let disc = DiscountModel.getItemDiscountRate(curItem.id, q);
      itemCount += q;
      subTotal += itemTot;

      const priceElems = cartItems[i].querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function handlePriceElem(elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
        }
      });
      if (q >= 10 && disc > 0) itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      totalAmount += itemTot * (1 - disc);
    }

    const today = new Date();
    const isTuesday = today.getDay() === TUESDAY_DAY_OF_WEEK;
    const after = DiscountModel.applyBulkAndTuesdayDiscount(subTotal, totalAmount, itemCount, isTuesday);
    totalAmount = after.totalAmt;
    const discRate = after.discRate;

    // Update UI: item count
    if (this.els.itemCount) {
      const previousCount = parseInt(this.els.itemCount.textContent.match(/\d+/) || 0);
      this.els.itemCount.textContent = '🛍️ ' + itemCount + ' items in cart';
      if (previousCount !== itemCount) this.els.itemCount.setAttribute('data-changed', 'true');
    }

    // Summary details and discount info
    renderSummaryDetails(this.els.summaryDetails, cartItems, prodList, subTotal, itemCount, isTuesday, totalAmount, itemDiscounts);
    const totalDiv = this.els.sumContainer.querySelector('.text-2xl');
    if (totalDiv) totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();
    const savedAmount = subTotal - totalAmount;
    updateDiscountInfo(this.els.discountInfo, discRate, savedAmount, totalAmount);

    // Tuesday banner
    if (after.tuesdayApplied) this.els.tuesdayBanner.classList.remove('hidden');
    else this.els.tuesdayBanner.classList.add('hidden');

    // Stock info
    let stockMsg = '';
    for (let stockIdx = 0; stockIdx < prodList.length; stockIdx++) {
      const item = prodList[stockIdx];
      if (item.q < LOW_STOCK_THRESHOLD) {
        stockMsg += item.name + ': ' + (item.q > 0 ? `재고 부족 (${item.q}개 남음)` : '품절') + '\n';
      }
    }
    this.els.stockInfo.textContent = stockMsg;

    // Points
    const basePoints = PointsModel.computeBasePoints(totalAmount);
    let finalPoints = 0;
    const pointsDetail = [];
    if (basePoints > 0) { finalPoints = basePoints; pointsDetail.push('기본: ' + basePoints + 'p'); }
    if (new Date().getDay() === TUESDAY_DAY_OF_WEEK && basePoints > 0) { finalPoints = basePoints * 2; pointsDetail.push('화요일 2배'); }
    const extra = PointsModel.computeBonusPoints(this.cartDisp, itemCount);
    finalPoints += extra.bonus;
    pointsDetail.push(...extra.details);
    updateLoyaltyPoints(this.els.points, finalPoints, pointsDetail);
  }

  updatePricesAndRecalc() {
    updateCartItemPrices(this.cartDisp, this.getProducts());
    this.calculateAndRender();
  }
}


