import { LIGHTNING_INITIAL_DELAY_MAX_MS, SUGGEST_INITIAL_DELAY_MAX_MS, LIGHTNING_INTERVAL_MS, SUGGEST_INTERVAL_MS } from '../utils/constants.js';

export class TimerService {
  constructor({ onLightningSale, onSuggestSale, getProducts, getLastSelected }) {
    this.onLightningSale = onLightningSale;
    this.onSuggestSale = onSuggestSale;
    this.getProducts = getProducts;
    this.getLastSelected = getLastSelected;
    this._timers = [];
  }

  start() {
    const lightningDelay = Math.random() * LIGHTNING_INITIAL_DELAY_MAX_MS;
    const t1 = setTimeout(() => {
      const tInt = setInterval(() => {
        const products = this.getProducts();
        const luckyIdx = Math.floor(Math.random() * products.length);
        const luckyItem = products[luckyIdx];
        if (luckyItem.q > 0 && !luckyItem.onSale) {
          this.onLightningSale(luckyItem);
        }
      }, LIGHTNING_INTERVAL_MS);
      this._timers.push(tInt);
    }, lightningDelay);

    const suggestDelay = Math.random() * SUGGEST_INITIAL_DELAY_MAX_MS;
    const t2 = setTimeout(() => {
      const tInt2 = setInterval(() => {
        const products = this.getProducts();
        const lastSel = this.getLastSelected();
        if (!lastSel) return;
        let suggest = null;
        for (let k = 0; k < products.length; k++) {
          if (products[k].id !== lastSel && products[k].q > 0 && !products[k].suggestSale) {
            suggest = products[k];
            break;
          }
        }
        if (suggest) this.onSuggestSale(suggest);
      }, SUGGEST_INTERVAL_MS);
      this._timers.push(tInt2);
    }, suggestDelay);

    this._timers.push(t1, t2);
  }

  stop() {
    for (const id of this._timers) {
      clearTimeout(id);
      clearInterval(id);
    }
    this._timers = [];
  }
}


