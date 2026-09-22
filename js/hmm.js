/* =========================================================
   MAXGAME — ui-extras.js

   1) SKINS : button -> sheet -> skin chuno -> <html data-skin="..."> + localStorage
   2) HERO  : boards ko drag karo (chhodte hi spring-back)
              + desktop pe halka mouse parallax

   app.js ko chhua nahi — ye alag module hai, index.html mein
   app.js ke baad load hota hai.

   Doosre pages (carrom.html / ludo.html) mein bhi same skin lagani ho
   to unme bas ye ek line daal do:

     document.documentElement.dataset.skin =
       localStorage.getItem('maxgame.skin') || 'classic';
========================================================= */

const SKIN_KEY = 'maxgame.skin';

const SKINS = {
  classic:  'Classic',
  midnight: 'Midnight',
  royal:    'Royal',
  emerald:  'Emerald'
};

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));


/* ---------------------------------------------------------
   storage (private mode mein localStorage fail ho sakta hai)
--------------------------------------------------------- */

const store = {
  get(){
    try{ return localStorage.getItem(SKIN_KEY); }
    catch(e){ return null; }
  },
  set(value){
    try{ localStorage.setItem(SKIN_KEY, value); }
    catch(e){ /* ignore */ }
  }
};


/* ---------------------------------------------------------
   toast (index.html ka existing #toast use hota hai)
--------------------------------------------------------- */

let toastTimer;

function toast(message){
  const el = document.getElementById('toast');
  if(!el) return;

  el.textContent = message;
  el.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}


/* =========================================================
   1) SKINS
========================================================= */

const skinCards = [...document.querySelectorAll('.skin-card')];
const skinName  = document.getElementById('skinName');
const skinOpen  = document.getElementById('skinOpen');
const sheet     = document.getElementById('skinSheet');

function paintSkin(id){
  root.setAttribute('data-skin', id);

  skinCards.forEach(card => {
    const on = card.dataset.skin === id;

    card.classList.toggle('active', on);
    card.setAttribute('aria-pressed', String(on));

    const state = card.querySelector('.skin-state');
    if(state) state.textContent = on ? 'EQUIPPED' : 'USE SKIN';
  });

  if(skinName) skinName.textContent = SKINS[id];
}

function equipSkin(id){
  if(!SKINS[id]) return;

  /* jahan chale wahan poore page ka smooth crossfade */
  if(document.startViewTransition && !reduceMotion){
    document.startViewTransition(() => paintSkin(id));
  }else{
    paintSkin(id);
  }

  store.set(id);

  /* app.js ya koi aur module sunna chahe to */
  window.dispatchEvent(new CustomEvent('maxgame:skin', { detail:{ skin:id } }));

  /* sheet khuli ho to toast modal ke peeche chhup jaata hai; wahan EQUIPPED pill hi kaafi hai */
  if(!(sheet && sheet.open)) toast(`${SKINS[id]} skin equipped`);
}

/* page khulte hi saved skin (head ka inline script pehle hi laga chuka hota hai) */
const savedSkin = store.get();
paintSkin(SKINS[savedSkin] ? savedSkin : 'classic');

skinCards.forEach(card => {
  card.addEventListener('click', () => {
    if(card.dataset.skin !== root.getAttribute('data-skin')){
      equipSkin(card.dataset.skin);
    }
  });
});


/* ---- skin sheet (native <dialog>) ---- */

let sheetClosing = false;

function openSheet(){
  if(!sheet) return;

  if(typeof sheet.showModal === 'function'){
    if(!sheet.open) sheet.showModal();
  }else{
    sheet.setAttribute('open', '');           /* purane browsers ke liye */
  }

  root.classList.add('sheet-open');           /* peeche ka page scroll na kare */
}

function closeSheet(){
  if(!sheet || !sheet.open || sheetClosing) return;

  sheetClosing = true;
  sheet.classList.add('closing');

  setTimeout(() => {
    sheet.classList.remove('closing');

    if(typeof sheet.close === 'function') sheet.close();
    else sheet.removeAttribute('open');

    root.classList.remove('sheet-open');
    sheetClosing = false;
  }, reduceMotion ? 0 : 210);
}

if(sheet && skinOpen){
  skinOpen.addEventListener('click', openSheet);

  sheet.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeSheet));

  /* sheet ke bahar (backdrop) tap karne par band */
  sheet.addEventListener('click', e => { if(e.target === sheet) closeSheet(); });

  /* Esc dabane par animation ke saath band */
  sheet.addEventListener('cancel', e => { e.preventDefault(); closeSheet(); });

  sheet.addEventListener('close', () => root.classList.remove('sheet-open'));
}


/* =========================================================
   2) HERO — boards ko drag karo
   CSS --dx / --dy / --dr variables se board hilta hai,
   chhodte hi .spring class overshoot ke saath wapas laati hai.
========================================================= */

const hero = document.querySelector('.hero');
const art  = document.querySelector('.hero-art');

if(hero && art){

  /* ---- mouse parallax (touch pe nahi, motion-reduced pe nahi) ---- */

  if(!reduceMotion){
    hero.addEventListener('pointermove', e => {
      if(e.pointerType !== 'mouse') return;

      const r  = art.getBoundingClientRect();
      const px = clamp(((e.clientX - r.left) / r.width  - .5) * 2, -1, 1);
      const py = clamp(((e.clientY - r.top)  / r.height - .5) * 2, -1, 1);

      art.style.setProperty('--px', px.toFixed(3));
      art.style.setProperty('--py', py.toFixed(3));
    });

    hero.addEventListener('pointerleave', () => {
      art.style.setProperty('--px', '0');
      art.style.setProperty('--py', '0');
    });
  }


  /* ---- drag ---- */

  art.querySelectorAll('.hero-object').forEach(obj => {

    let drag = null;
    let springTimer;

    obj.addEventListener('pointerdown', e => {
      if(e.pointerType === 'mouse' && e.button !== 0) return;

      /* poora board hero card ke andar hi rahe (kinare se 6px chhod ke) */
      const h  = hero.getBoundingClientRect();
      const r  = obj.getBoundingClientRect();
      const ox = parseFloat(obj.style.getPropertyValue('--dx')) || 0;
      const oy = parseFloat(obj.style.getPropertyValue('--dy')) || 0;

      drag = {
        id:   e.pointerId,
        sx:   e.clientX,
        sy:   e.clientY,
        ox,
        oy,
        minX: ox + (h.left   + 6) - r.left,
        maxX: ox + (h.right  - 6) - r.right,
        minY: oy + (h.top    + 6) - r.top,
        maxY: oy + (h.bottom - 6) - r.bottom
      };

      obj.setPointerCapture(e.pointerId);
      obj.classList.remove('spring');
      obj.classList.add('dragging');
      hero.classList.add('is-used');       /* "DRAG THE BOARDS" hint chhup jaata hai */

      clearTimeout(springTimer);
      e.preventDefault();

      /* phone pe halka sa tactile "pick up" */
      if(e.pointerType === 'touch' && navigator.vibrate) navigator.vibrate(6);
    });

    obj.addEventListener('pointermove', e => {
      if(!drag || e.pointerId !== drag.id) return;

      const dx = clamp(drag.ox + e.clientX - drag.sx, drag.minX, drag.maxX);
      const dy = clamp(drag.oy + e.clientY - drag.sy, drag.minY, drag.maxY);

      obj.style.setProperty('--dx', dx + 'px');
      obj.style.setProperty('--dy', dy + 'px');
      obj.style.setProperty('--dr', clamp(dx * .12, -14, 14) + 'deg');   /* chalte hue thoda jhukta hai */
    });

    const release = e => {
      if(!drag) return;
      if(e && e.pointerId !== undefined && e.pointerId !== drag.id) return;

      drag = null;

      obj.classList.remove('dragging');
      obj.classList.add('spring');

      obj.style.setProperty('--dx', '0px');
      obj.style.setProperty('--dy', '0px');
      obj.style.setProperty('--dr', '0deg');

      springTimer = setTimeout(() => obj.classList.remove('spring'), 900);
    };

    obj.addEventListener('pointerup', release);
    obj.addEventListener('pointercancel', release);
    obj.addEventListener('lostpointercapture', release);

    /* long-press pe context menu / image drag nahi */
    obj.addEventListener('contextmenu', e => e.preventDefault());
    obj.addEventListener('dragstart', e => e.preventDefault());
  });
}
