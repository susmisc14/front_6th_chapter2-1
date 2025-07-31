import"./modulepreload-polyfill-B5Qt9EMX.js";const $="p1",U="p2",F="p3",W="p4",X="p5",R=.2,q=.05,J=3e4,Z=6e4;function tt(){return[{id:$,name:"버그 없애는 키보드",val:1e4,originalVal:1e4,q:50,onSale:!1,suggestSale:!1},{id:U,name:"생산성 폭발 마우스",val:2e4,originalVal:2e4,q:30,onSale:!1,suggestSale:!1},{id:F,name:"거북목 탈출 모니터암",val:3e4,originalVal:3e4,q:20,onSale:!1,suggestSale:!1},{id:W,name:"에러 방지 노트북 파우치",val:15e3,originalVal:15e3,q:0,onSale:!1,suggestSale:!1},{id:X,name:"코딩할 때 듣는 Lo-Fi 스피커",val:25e3,originalVal:25e3,q:10,onSale:!1,suggestSale:!1}]}const S=new Map;function u(t){if(S.has(t))return S.get(t);const e=document.querySelector(t);return S.set(t,e),e}function D(t=null){t?S.delete(t):S.clear()}function m(t){if(!t||typeof t!="string")return console.warn("createUIElement: template is not a valid string",t),document.createElement("div");const e=document.createElement("div");e.innerHTML=t.trim();const a=e.firstElementChild;if(!a){console.warn("Template did not produce a valid element:",t);const s=document.createElement("div");return s.innerHTML=t.trim(),s}return a}function d(t,e={}){return t?(Object.entries(e).forEach(([a,s])=>{a==="className"?t.className=s:a==="id"?t.id=s:a.startsWith("data-")?t.setAttribute(a,s):a==="style"&&typeof s=="object"?Object.assign(t.style,s):t[a]=s}),t):(console.warn("Cannot set attributes on null element"),t)}function x(t,e){return!t||typeof t!="string"?(console.warn("bindTemplate: template is not a valid string",t),""):t.replace(/\{\{(\w+)\}\}/g,(a,s)=>e[s]!==void 0?e[s]:a)}function et(t){return document.createTextNode(t)}function T(t,e){return t&&(t.innerHTML="",t.appendChild(et(e)),t)}function C(t,e){return t&&(t.innerHTML=e,t)}function L(t,e){return t&&(e?t.style.display="block":t.style.display="none",t)}function H(t,e){return!t||!e||t.appendChild(e),t}function P(t,e){return t&&(e.forEach(a=>{a&&t.appendChild(a)}),t)}function nt(t){const e=t.onSale&&t.suggestSale?"⚡💝":t.onSale?"⚡":t.suggestSale?"💝":"",a=t.onSale||t.suggestSale?`<span class="line-through text-gray-400">₩${t.originalVal.toLocaleString()}</span> <span class="${t.onSale&&t.suggestSale?"text-purple-600":t.onSale?"text-red-500":"text-blue-500"}">₩${t.val.toLocaleString()}</span>`:`₩${t.val.toLocaleString()}`,s=`
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${e}${t.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${a}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${t.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${t.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${a}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${t.id}">Remove</a>
    </div>
  `,n=m(`
    <div class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      ${s}
    </div>
  `);return d(n,{id:t.id,className:"grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"})}function j(t){const e=u("#stock-status");if(!e)return;let a="",s=0;for(let n=0;n<t.length;n++)s+=t[n].q;t.forEach(function(n){n.q<5&&(n.q>0?a=a+n.name+": 재고 부족 ("+n.q+`개 남음)
`:a=a+n.name+`: 품절
`)}),T(e,a)}function B(t,e){for(const a of t){const s=a.id,n=e.find(r=>r.id===s);if(!n)continue;const i=a.querySelector(".text-lg"),o=a.querySelector("h3");!i||!o||(n.onSale&&n.suggestSale?(C(i,`<span class="line-through text-gray-400">₩${n.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${n.val.toLocaleString()}</span>`),T(o,"⚡💝"+n.name)):n.onSale?(C(i,`<span class="line-through text-gray-400">₩${n.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${n.val.toLocaleString()}</span>`),T(o,"⚡"+n.name)):n.suggestSale?(C(i,`<span class="line-through text-gray-400">₩${n.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${n.val.toLocaleString()}</span>`),T(o,"💝"+n.name)):(T(i,"₩"+n.val.toLocaleString()),T(o,n.name)))}}const st=`
  <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
  <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
  <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
`,at=`
  <div class="mb-8">
    {{headerContent}}
  </div>
`,it=`
  <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
    <!-- 옵션들은 동적으로 생성됨 -->
  </select>
`,ot=`
  <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
    Add to Cart
  </button>
`,rt=`
  <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line">
    <!-- 재고 정보는 동적으로 업데이트됨 -->
  </div>
`,lt=`
  <div id="cart-items" class="cart-items">
    <!-- 장바구니 아이템들은 동적으로 추가됨 -->
  </div>
`,ct=`
  <div class="mb-6 pb-6 border-b border-gray-200">
    <!-- 상품 선택기, 추가 버튼, 재고 정보가 동적으로 추가됨 -->
  </div>
`,dt=`
  <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
    <!-- 선택기 컨테이너와 장바구니 표시가 동적으로 추가됨 -->
  </div>
`,ut=`
  <div class="bg-black text-white p-8 flex flex-col">
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩0</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
        </div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
          <div class="flex items-center gap-2">
            <span class="text-2xs">🎉</span>
            <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
          </div>
        </div>
      </div>
    </div>
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  </div>
`,ft=`
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
    <!-- 왼쪽/오른쪽 컬럼이 동적으로 추가됨 -->
  </div>
`,gt=`
  <button class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  </button>
`,mt=`
  <div class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300">
  </div>
`,pt=`
  <div class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300">
    {{panelContent}}
  </div>
`,ht=`
  <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  </button>
  <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
 
  <div class="mb-6">
    <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
    <div class="space-y-3">
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">개별 상품</p>
        <p class="text-gray-700 text-xs pl-2">
          • 키보드 10개↑: 10%<br>
          • 마우스 10개↑: 15%<br>
          • 모니터암 10개↑: 20%<br>
          • 스피커 10개↑: 25%
        </p>
      </div>
     
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">전체 수량</p>
        <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
      </div>
     
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">특별 할인</p>
        <p class="text-gray-700 text-xs pl-2">
          • 화요일: +10%<br>
          • ⚡번개세일: 20%<br>
          • 💝추천할인: 5%
        </p>
      </div>
    </div>
  </div>
 
  <div class="mb-6">
    <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
    <div class="space-y-3">
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">기본</p>
        <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
      </div>
     
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">추가</p>
        <p class="text-gray-700 text-xs pl-2">
          • 화요일: 2배<br>
          • 키보드+마우스: +50p<br>
          • 풀세트: +100p<br>
          • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
        </p>
      </div>
    </div>
  </div>
 
  <div class="border-t border-gray-200 pt-4 mt-4">
    <p class="text-xs font-bold mb-1">💡 TIP</p>
    <p class="text-2xs text-gray-600 leading-relaxed">
      • 화요일 대량구매 = MAX 혜택<br>
      • ⚡+💝 중복 가능<br>
      • 상품4 = 품절
    </p>
  </div>
`,bt=`
  <option value="{{productId}}">{{displayText}}</option>
`,xt=`
  <option value="{{productId}}" disabled class="text-gray-400">{{displayText}}</option>
`,yt=`
  <option value="{{productId}}">{{displayText}}</option>
`;function Tt(t){let e=`${t.name} - ${t.val}원`;return t.onSale&&t.suggestSale?e=`⚡💝${t.name} - ${t.originalVal}원 → ${t.val}원 (25% SUPER SALE!)`:t.onSale?e=`⚡${t.name} - ${t.originalVal}원 → ${t.val}원 (20% SALE!)`:t.suggestSale&&(e=`💝${t.name} - ${t.originalVal}원 → ${t.val}원 (5% 추천할인!)`),e}function vt(t){const e=Tt(t);return t.q===0?x(xt,{productId:t.id,displayText:e+" (품절)"}):t.q<5?x(yt,{productId:t.id,displayText:e+` (재고 부족: ${t.q}개)`}):x(bt,{productId:t.id,displayText:e})}function k(t,e){if(!t)return;t.querySelectorAll("option").forEach(n=>n.remove());let s=0;for(const n of e)s+=n.q;for(const n of e){const i=vt(n),o=m(i);n.onSale&&n.suggestSale?d(o,{className:"text-purple-600 font-bold"}):n.onSale?d(o,{className:"text-red-500 font-bold"}):n.suggestSale&&d(o,{className:"text-blue-500 font-bold"}),H(t,o)}s<50?d(t,{style:{borderColor:"orange"}}):d(t,{style:{borderColor:""}})}function Et(){const t=x(st,{}),e=x(at,{headerContent:t}),a=m(e);return d(a,{className:"mb-8"})}function It(){const t=m(it);return d(t,{id:"product-select",className:"w-full p-3 border border-gray-300 rounded-lg text-base mb-3"})}function St(){const t=m(ot);return d(t,{id:"add-to-cart",className:"w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"})}function Ct(){const t=m(rt);return d(t,{id:"stock-status",className:"text-xs text-red-500 mt-3 whitespace-pre-line"})}function wt(){const t=m(lt);return d(t,{id:"cart-items",className:"cart-items"})}function At(t,e,a){const s=m(ct),n=d(s,{className:"mb-6 pb-6 border-b border-gray-200"});return P(n,[t,e,a]),n}function Ot(t,e){const a=m(dt),s=d(a,{className:"bg-white border border-gray-200 p-8 overflow-y-auto"});return P(s,[t,e]),s}function Nt(){const t=m(ut);return d(t,{className:"bg-black text-white p-8 flex flex-col"})}function _t(t,e){const a=m(ft),s=d(a,{className:"grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden"});return P(s,[t,e]),s}function Dt(){const t=m(gt);return d(t,{className:"fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"})}function Pt(){const t=x(mt,{}),e=m(t);return d(e,{className:"fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300"})}function Lt(){const t=x(ht,{}),e=x(pt,{panelContent:t}),a=m(e);return d(a,{className:"fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300"})}function Mt(){const t=u("#app");if(!t)return console.error("App root element not found"),{};const e=Et(),a=It(),s=St(),n=Ct(),i=wt(),o=Nt(),r=At(a,s,n),l=Ot(r,i),c=_t(l,o),g=Dt(),p=Pt(),y=Lt();P(t,[e,c,g,p]),H(p,y);const v=u("#cart-items"),f=u("#product-select"),h=u("#add-to-cart"),I=u("#stock-status"),O=u("#cart-total"),b=u("#loyalty-points");return b&&(b.style.display="none"),{cartDisplay:v,productSelector:f,addToCartButton:h,stockInfo:I,sumElement:O}}const M=new Map,kt=(t,e)=>{const a=t.map(n=>`${n.id}:${n.quantity}`).join("|"),s=e.map(n=>`${n.id}:${n.q}`).join("|");return`${a}|${s}`};function Rt(t,e,a){const s=kt(t,e);if(M.has(s))return M.get(s);let n=0,i=0,o=0,r=[],l=[];for(let f=0;f<e.length;f++)e[f].q<5&&e[f].q>0&&l.push(e[f].name);for(let f=0;f<t.length;f++){let h=null;for(let N=0;N<e.length;N++)if(e[N].id===t[f].id){h=e[N];break}if(!h)continue;const I=t[f].quantity,O=h.val*I;let b=0;i+=I,o+=O,I>=10&&(h.id===$?b=10/100:h.id===U?b=15/100:h.id===F?b=20/100:h.id==="p4"?b=5/100:h.id==="p5"&&(b=25/100),b>0&&r.push({name:h.name,discount:b*100})),n+=O*(1-b)}let c=0;const g=o;i>=30?(n=o*75/100,c=25/100):c=(o-n)/o;const y=new Date().getDay()===2;y&&n>0&&(n=n*90/100,c=1-n/g);const v={totalAmt:Math.round(n),itemCnt:i,subTot:o,discRate:c,isTuesday:y,itemDiscounts:r,lowStockItems:l,originalTotal:g};return M.set(s,v),v}function qt(t,e,a,s){if(t.length===0)return{finalPoints:0,pointsDetail:[]};let n=Math.floor(s/1e3),i=0,o=[];n>0&&(i=n,o.push("기본: "+n+"p")),new Date().getDay()===2&&n>0&&(i=n*2,o.push("화요일 2배"));const l=Vt(t),c=l.hasKeyboard,g=l.hasMouse,p=l.hasMonitorArm;return c&&g&&(i+=50,o.push("키보드+마우스 세트 +50p")),c&&g&&p&&(i+=100,o.push("풀세트 구매 +100p")),l.totalQuantity>=30?(i+=100,o.push("대량구매(30개+) +100p")):l.totalQuantity>=20?(i+=50,o.push("대량구매(20개+) +50p")):l.totalQuantity>=10&&(i+=20,o.push("대량구매(10개+) +20p")),{finalPoints:i,pointsDetail:o}}function Vt(t){let e=!1,a=!1,s=!1,n=0;for(const i of t){const o=i.querySelector(".quantity-number"),r=o?parseInt(o.textContent):0;n+=r,i.id==="p1"?e=!0:i.id==="p2"?a=!0:i.id==="p3"&&(s=!0)}return{hasKeyboard:e,hasMouse:a,hasMonitorArm:s,totalQuantity:n}}function $t(t){const e=u("#tuesday-special");e&&(t?d(e,{className:e.className.replace("hidden","").trim()}):d(e,{className:e.className+" hidden"}))}function Ut(t,e,a){const s=u("#summary-details");if(!s)return;const{subTot:n,itemCnt:i,itemDiscounts:o,isTuesday:r}=t;let l="";if(n>0){for(let c=0;c<e.length;c++){const g=e[c];let p=null;for(let f=0;f<a.length;f++)if(a[f].id===g.id){p=a[f];break}if(!p)continue;const y=g.quantity,v=p.val*y;l+=`
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${p.name} x ${y}</span>
          <span>₩${v.toLocaleString()}</span>
        </div>
      `}l+=`
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${n.toLocaleString()}</span>
      </div>
    `,i>=30?l+=`
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `:o.length>0&&o.forEach(function(c){l+=`
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${c.name} (10개↑)</span>
            <span class="text-xs">-${c.discount}%</span>
          </div>
        `}),r&&(l+=`
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `),l+=`
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `}C(s,l)}function Ft(t){const e=u("#discount-info");if(!e)return;const{discRate:a,totalAmt:s,originalTotal:n}=t;if(e.innerHTML="",a>0&&s>0){const i=n-s;e.innerHTML=`
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(a*100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(i).toLocaleString()} 할인되었습니다</div>
      </div>
    `}}function Ht(t){const{itemCnt:e,totalAmt:a}=t,s=u("#item-count");s&&(s.textContent=`🛍️ ${e} items in cart`);const n=u("#cart-total .text-2xl");n&&(n.textContent=`₩${Math.round(a).toLocaleString()}`)}function jt(t,e,a,s){const n=document.getElementById("loyalty-points");if(!n)return;const{totalAmt:i}=t,o=u("#cart-items");if(!o||o.children.length===0){L(n,!1);return}const r=qt(e,a,s,i),{finalPoints:l,pointsDetail:c}=r;l>0?(C(n,'<div>적립 포인트: <span class="font-bold">'+l+'p</span></div><div class="text-2xs opacity-70 mt-1">'+c.join(", ")+"</div>"),L(n,!0)):(T(n,"적립 포인트: 0p"),L(n,!0))}function Bt(t){return u(`#${t}`)}function Gt(t,e){const a=t.querySelector(".quantity-number");if(!a)return console.warn("Quantity element not found"),!1;const s=parseInt(a.textContent),n=s+1;return n<=e.q+s?(a.textContent=n,e.q--,!0):!1}function Kt(t,e){const a=nt(t);e.appendChild(a),t.q--,D()}const E={VALIDATION:"VALIDATION",BUSINESS_LOGIC:"BUSINESS_LOGIC"},w={PRODUCT_NOT_FOUND:"PRODUCT_NOT_FOUND",INSUFFICIENT_STOCK:"INSUFFICIENT_STOCK",NO_PRODUCT_SELECTED:"NO_PRODUCT_SELECTED",INVALID_QUANTITY:"INVALID_QUANTITY"};class A extends Error{constructor(e,a,s=E.BUSINESS_LOGIC){super(e),this.name="CartError",this.code=a,this.type=s,this.timestamp=new Date().toISOString()}}function Qt(t,e=1){return t?t.q<e?{isValid:!1,error:new A(`재고가 부족합니다. (현재: ${t.q}개)`,w.INSUFFICIENT_STOCK,E.VALIDATION)}:{isValid:!0,error:null}:{isValid:!1,error:new A("상품을 찾을 수 없습니다.",w.PRODUCT_NOT_FOUND,E.VALIDATION)}}function zt(t){return!t||t.trim()===""?{isValid:!1,error:new A("상품을 선택해주세요.",w.NO_PRODUCT_SELECTED,E.VALIDATION)}:{isValid:!0,error:null}}function Yt(t,e){return t<=0?{isValid:!1,error:new A("수량은 1개 이상이어야 합니다.",w.INVALID_QUANTITY,E.VALIDATION)}:t>e?{isValid:!1,error:new A("재고가 부족합니다.",w.INSUFFICIENT_STOCK,E.VALIDATION)}:{isValid:!0,error:null}}const Wt=(t,e)=>{const a=zt(t);if(!a.isValid)return{product:null,isValid:!1,error:a.error};const s=e.find(i=>i.id===t);if(!s)return{product:null,isValid:!1,error:"상품을 찾을 수 없습니다."};const n=Qt(s);return n.isValid?{product:s,isValid:!0,error:null}:{product:s,isValid:!1,error:n.error}},_=(t,e)=>{e.cache=null,e.isTuesday=new Date().getDay()===2,ee(t,e)};function Xt(t,e,a){const s=u("#product-select").value,n=u("#cart-items"),{product:i,isValid:o,error:r}=Wt(s,e);if(!o){console.error("[VALIDATION] INSUFFICIENT_STOCK:",r),window.alert(r.message);return}const l=Bt(i.id);if(l){if(!Gt(l,i)){console.error("[VALIDATION] INSUFFICIENT_STOCK: 재고가 부족합니다.");return}}else Kt(i,n);a.lastSelectedProduct=s,D(),_(e,a)}function Jt(t,e,a){const s=t.target,n=s.getAttribute("data-product-id");!n||!e.find(o=>o.id===n)||(s.classList.contains("quantity-change")?Zt(s,e,a):s.classList.contains("remove-item")&&te(s,e,a))}function Zt(t,e,a){const s=t.getAttribute("data-product-id"),n=parseInt(t.getAttribute("data-change")),i=u(`#${s}`);if(!i||!s)return;const o=e.find(p=>p.id===s);if(!o)return;const r=i.querySelector(".quantity-number");if(!r)return;const l=parseInt(r.textContent),c=l+n;if(c<=0){i.remove(),_(e,a);return}const g=Yt(c,o.q+l);if(!g.isValid){console.error("[VALIDATION] INSUFFICIENT_STOCK:",g.error),window.alert(g.error.message);return}r.textContent=c,o.q-=n,c<=0&&i.remove(),D(),_(e,a)}function te(t,e,a){const s=t.getAttribute("data-product-id"),n=u(`#${s}`);if(!n||!s)return;const i=e.find(r=>r.id===s);if(!i)return;const o=n.querySelector(".quantity-number");if(o){const r=parseInt(o.textContent);i.q+=r}n.remove(),D(),_(e,a)}function ee(t,e){const a=Array.from(document.querySelectorAll("[id^='p']")),s=a.map(i=>{const o=i.querySelector(".quantity-number");return{id:i.id,quantity:o?parseInt(o.textContent):0}}),n=Rt(s,t);ne(e,n),Ht(n),Ut(n,s,t),Ft(n),j(t),jt(n,a,t,e),$t(n.isTuesday)}function ne(t,e){t.totalAmount=e.totalAmt,t.itemCount=e.itemCnt,t.discountRate=e.discRate,t.isTuesday=e.isTuesday}function se(t,e,a){const s=()=>{e.classList.toggle("hidden"),a.classList.toggle("translate-x-full")},n=i=>{i.target===e&&(e.classList.add("hidden"),a.classList.add("translate-x-full"))};t.addEventListener("click",s),e.addEventListener("click",n)}function ae(t,e,a,s){t.addEventListener("click",r=>{Xt(r,a,s)}),e.addEventListener("click",r=>{Jt(r,a,s)});const n=document.querySelector(".fixed.top-4.right-4"),i=document.querySelector(".fixed.inset-0"),o=document.querySelector(".fixed.right-0.top-0");n&&i&&o&&se(n,i,o)}class ie{constructor(){this.timers=new Set}setTimeout(e,a){const s=setTimeout(e,a);return this.timers.add(s),s}setInterval(e,a){const s=setInterval(e,a);return this.timers.add(s),s}clearTimer(e){this.timers.has(e)&&(clearTimeout(e),clearInterval(e),this.timers.delete(e))}clearAllTimers(){this.timers.forEach(e=>{clearTimeout(e),clearInterval(e)}),this.timers.clear()}}const G=new ie;function K(t,e){return G.setTimeout(t,e)}function Q(t,e){return G.setInterval(t,e)}const z={INFO:"info",PROMOTION:"promotion"};class oe{constructor(){this.subscribers=new Set,this.notifications=[]}subscribe(e){return this.subscribers.add(e),()=>this.subscribers.delete(e)}show(e,a=z.INFO,s={}){const n={id:Date.now()+Math.random(),message:e,type:a,timestamp:new Date,...s};return this.notifications.push(n),this.notifySubscribers(n),s.autoRemove!==!1&&setTimeout(()=>{this.remove(n.id)},s.duration||5e3),n.id}notifySubscribers(e){this.subscribers.forEach(a=>{try{a(e)}catch(s){console.error("알림 콜백 실행 중 오류:",s)}})}remove(e){const a=this.notifications.findIndex(s=>s.id===e);a>-1&&this.notifications.splice(a,1)}clear(){this.notifications=[]}getNotifications(){return[...this.notifications]}}const re=new oe;function Y(t,e={}){return re.show(t,z.PROMOTION,{duration:8e3,...e})}function le(t,e){ce(t,e),de(t,e)}function ce(t,e){const a=Math.random()*1e4;K(()=>{Q(()=>{const s=Math.floor(Math.random()*t.length),n=t[s];n.q>0&&!n.onSale&&(n.val=Math.round(n.originalVal*(1-R)),n.onSale=!0,Y(`⚡번개세일! ${n.name}이(가) ${R*100}% 할인 중입니다!`),k(e.productSelector,t),B(Array.from(e.cartDisplay.children),t))},J)},a)}function de(t,e){const a=Math.random()*2e4;K(()=>{Q(()=>{if(e.cartDisplay.children.length!==0&&e.lastSelectedProduct){const s=ue(t,e.lastSelectedProduct);s&&(Y(`💝 ${s.name}은(는) 어떠세요? 지금 구매하시면 ${q*100}% 추가 할인!`),s.val=Math.round(s.val*(1-q)),s.suggestSale=!0,k(e.productSelector,t),B(Array.from(e.cartDisplay.children),t))}},Z)},a)}function ue(t,e){for(const a of t)if(a.id!==e&&a.q>0&&!a.suggestSale)return a;return null}function fe(t){t.productList=tt(),k(t.productSelector,t.productList),j(t.productList),ae(t.addToCartButton,t.cartDisplay,t.productList,t),le(t.productList,t),console.log("🛒 쇼핑 카트 애플리케이션이 시작되었습니다.")}const V={productList:[],cartDisplay:null,productSelector:null,addToCartButton:null,stockInfo:null,sumElement:null,totalAmount:0,itemCount:0,lastSelectedProduct:null,isTuesday:new Date().getDay()===2};function ge(){const t=Mt();Object.assign(V,t),fe(V)}ge();
