import { createInitialProducts } from '../data/products.js';
import { TimerService } from '../services/TimerService.js';
import { CartController } from './CartController.js';
import { SummaryController } from './SummaryController.js';
import {
  updateProductSelect,
  setupHelpModalEvents,
  assembleLayout,
  assembleLayoutFromArrayConfig,
  assembleLayoutFromVisualConfig,
  extractSummaryElements
} from '../services/UIUpdater.js';
import { createHeaderElement } from '../components/Header.template.js';
import { createProductSelectorElement } from '../components/ProductSelect.template.js';
import { createAddToCartButton } from '../components/AddToCartButton.template.js';
import { createStockInfo } from '../components/StockInfo.template.js';
import { createCartDisplay } from '../components/CartDisplay.template.js';
import { createGridContainer } from '../components/GridContainer.template.js';
import { createLeftColumn } from '../components/LeftColumn.template.js';
import { createSelectorContainer } from '../components/SelectorContainer.template.js';
import { createOrderSummaryElement } from '../components/OrderSummary.template.js';
import { createHelpModalToggle } from '../components/HelpModalToggle.template.js';
import { createHelpModalOverlay } from '../components/HelpModalOverlay.template.js';
import { createHelpModalContent } from '../components/HelpModalContent.template.js';

export class AppController {
  constructor(root) {
    this.root = root;
    this.prodList = createInitialProducts();
    this.lastSelected = null;
  }

  initDom() {
    // Create all UI components directly from components
    const header = createHeaderElement()[0];
    this.sel = createProductSelectorElement()[0];
    this.addBtn = createAddToCartButton()[0];
    this.stockInfo = createStockInfo()[0];
    this.cartDisp = createCartDisplay()[0];
    
    const gridContainer = createGridContainer()[0];
    const leftColumn = createLeftColumn()[0];
    const selectorContainer = createSelectorContainer()[0];
    const rightColumn = createOrderSummaryElement()[0];
    const manualToggle = createHelpModalToggle()[0];
    const manualOverlay = createHelpModalOverlay()[0];
    const manualColumn = createHelpModalContent()[0];
    
    // Setup help modal events
    setupHelpModalEvents(manualToggle, manualOverlay, manualColumn);
    
    // Assemble the layout (현재 방식 - 호환성 유지)
    assembleLayout(this.root, header, gridContainer, leftColumn, selectorContainer, rightColumn, this.sel, this.addBtn, this.stockInfo, this.cartDisp, manualToggle, manualOverlay);
    
    // 🚀 새로운 배열 기반 레이아웃 사용 예시 (주석 처리)
    // const elements = {
    //   header,
    //   gridContainer,
    //   leftColumn,
    //   selectorContainer,
    //   rightColumn,
    //   selector: this.sel,
    //   addButton: this.addBtn,
    //   stockInfo: this.stockInfo,
    //   cartDisplay: this.cartDisp,
    //   manualToggle,
    //   manualOverlay
    // };
    // 
    // // 환경별 레이아웃 옵션
    // const layoutOptions = {
    //   // 예: 모바일에서는 도움말 비활성화
    //   disabledElements: window.innerWidth < 768 ? ['manualToggle', 'manualOverlay'] : [],
    //   // 예: 개발 환경에서만 특정 요소 표시
    //   // enabledElements: process.env.NODE_ENV === 'development' ? null : ['header', 'gridContainer', 'leftColumn', 'rightColumn', 'selectorContainer', 'selector', 'addButton', 'cartDisplay']
    // };
    // 
    // const layoutResult = assembleLayoutFromArrayConfig(this.root, elements, layoutOptions);
    // console.log('배열 기반 레이아웃 적용:', layoutResult.appliedLayout.length, '개 요소');
    
    // 🎨 새로운 시각적 레이아웃 사용 예시 (React JSX-like) - 주석 처리
    // const elements = {
    //   header, gridContainer, leftColumn, selectorContainer, rightColumn,
    //   selector: this.sel, addButton: this.addBtn, stockInfo: this.stockInfo, 
    //   cartDisplay: this.cartDisp, manualToggle, manualOverlay
    // };
    // 
    // // 시각적 레이아웃으로 조립 (구조가 한눈에 보임!)
    // const visualResult = assembleLayoutFromVisualConfig(this.root, elements, {
    //   debug: true, // 콘솔에 레이아웃 구조 출력
    //   disabledElements: window.innerWidth < 768 ? ['manualToggle', 'manualOverlay'] : []
    // });
    // 
    // console.log('🎨 시각적 레이아웃 적용 완료!');
    // console.log('📋 JSX 구조:\n', visualResult.visualizations.jsx);
    // console.log('🌐 HTML 구조:\n', visualResult.visualizations.html);
    
    // Extract summary elements
    const summaryElements = extractSummaryElements(rightColumn, header);
    this.sum = summaryElements.sum;
    this.summaryDetails = summaryElements.summaryDetails;
    this.discountInfo = summaryElements.discountInfo;
    this.points = summaryElements.points;
    this.itemCount = summaryElements.itemCount;
    this.tuesdayBanner = summaryElements.tuesdayBanner;
  }

  initControllers() {
    updateProductSelect(this.sel, this.prodList);

    this.summaryController = new SummaryController({
      getProducts: () => this.prodList,
      cartDisp: this.cartDisp,
      elements: {
        sumContainer: this.sum,
        summaryDetails: this.summaryDetails,
        discountInfo: this.discountInfo,
        itemCount: this.itemCount,
        points: this.points,
        tuesdayBanner: this.tuesdayBanner,
        stockInfo: this.stockInfo,
      },
    });

    this.cartController = new CartController({
      sel: this.sel,
      addBtn: this.addBtn,
      cartDisp: this.cartDisp,
      stockInfo: this.stockInfo,
      onCalculate: () => this.summaryController.calculateAndRender(),
      getProducts: () => this.prodList,
      setLastSelected: (val) => { this.lastSelected = val; },
    });
    this.cartController.init();
  }

  startTimers() {
    const timer = new TimerService({
      onLightningSale: (luckyItem) => {
        luckyItem.val = Math.round(luckyItem.originalVal * 80 / 100);
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProductSelect(this.sel, this.prodList);
        this.summaryController.updatePricesAndRecalc();
      },
      onSuggestSale: (suggest) => {
        alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
        suggest.val = Math.round(suggest.val * (100 - 5) / 100);
        suggest.suggestSale = true;
        updateProductSelect(this.sel, this.prodList);
        this.summaryController.updatePricesAndRecalc();
      },
      getProducts: () => this.prodList,
      getLastSelected: () => this.lastSelected,
    });
    timer.start();
  }

  init() {
    this.initDom();
    this.initControllers();
    this.summaryController.calculateAndRender();
    this.startTimers();
  }
}


