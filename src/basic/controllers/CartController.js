import { updateProductSelect, updateCartItemPrices } from '../services/UIUpdater.js';
import { renderPriceLabel, renderNamePrefix } from '../components/PriceLabel.template.js';
import { createCartItemElement } from '../components/CartItem.template.js';

export class CartController {
  constructor({ sel, addBtn, cartDisp, stockInfo, onCalculate, getProducts, setLastSelected }) {
    this.sel = sel;
    this.addBtn = addBtn;
    this.cartDisp = cartDisp;
    this.stockInfo = stockInfo;
    this.onCalculate = onCalculate;
    this.getProducts = getProducts;
    this.setLastSelected = setLastSelected;
  }

  init() {
    const handleAddClick = (/* event */) => this.handleAdd();
    const handleCartClick = (e) => this.handleCartClick(e);
    this.addBtn.addEventListener('click', handleAddClick);
    this.cartDisp.addEventListener('click', handleCartClick);
    updateProductSelect(this.sel, this.getProducts());
    this.onCalculate();
  }

  handleAdd() {
    const prodList = this.getProducts();
    const selItem = this.sel.value;
    let itemFound = false;
    for (let idx = 0; idx < prodList.length; idx++) { if (prodList[idx].id === selItem) { itemFound = true; break; } }
    if (!selItem || !itemFound) return;

    let itemToAdd = null;
    for (let j = 0; j < prodList.length; j++) { if (prodList[j].id === selItem) { itemToAdd = prodList[j]; break; } }
    if (itemToAdd && itemToAdd.q > 0) {
      const existing = document.getElementById(itemToAdd.id);
      if (existing) {
        const qtyElem = existing.querySelector('.quantity-number');
        const newQty = parseInt(qtyElem.textContent) + 1;
        if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
          qtyElem.textContent = newQty;
          itemToAdd.q--;
        } else { alert('재고가 부족합니다.'); }
      } else {
        const newItem = createCartItemElement(itemToAdd)[0];
        this.cartDisp.appendChild(newItem);
        itemToAdd.q--;
      }
      this.onCalculate();
      this.setLastSelected(selItem);
    }
  }

  handleCartClick(event) {
    const prodList = this.getProducts();
    const tgt = event.target;
    if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      if (!itemElem) return;
      let prod = null;
      for (let prdIdx = 0; prdIdx < prodList.length; prdIdx++) { if (prodList[prdIdx].id === prodId) { prod = prodList[prdIdx]; break; } }
      if (!prod) return;
      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const qtyElem = itemElem.querySelector('.quantity-number');
        if (!qtyElem) return;
        const currentQty = parseInt(qtyElem.textContent);
        const newQty = currentQty + qtyChange;
        if (newQty > 0 && newQty <= prod.q + currentQty) {
          qtyElem.textContent = newQty;
          prod.q -= qtyChange;
        } else if (newQty <= 0) {
          prod.q += currentQty;
          itemElem.remove();
        } else { alert('재고가 부족합니다.'); }
      } else if (tgt.classList.contains('remove-item')) {
        const qtyElem = itemElem.querySelector('.quantity-number');
        const remQty = parseInt(qtyElem.textContent);
        prod.q += remQty;
        itemElem.remove();
      }
      this.onCalculate();
      updateProductSelect(this.sel, this.getProducts());
    }
  }
}


