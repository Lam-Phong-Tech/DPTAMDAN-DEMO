/* =========================================================================
   TWEAKS — panel vanilla theo host protocol
   ========================================================================= */
(function () {
  const LS = 'tamdan_tweaks';
  const saved = JSON.parse(localStorage.getItem(LS) || 'null');
  if (saved) Object.assign(APP.tweaks, saved);

  const THEMES = [
    { id: 'blue',  nm: 'Xanh y dược', sw: 'oklch(0.52 0.11 235)' },
    { id: 'green', nm: 'Xanh lá',     sw: 'oklch(0.52 0.10 162)' },
    { id: 'slate', nm: 'Slate trầm',  sw: 'oklch(0.44 0.04 245)' },
  ];
  const LAYOUTS = [
    { id: 'side',   nm: 'Panel bên phải' },
    { id: 'bottom', nm: 'Dải bên dưới' },
  ];

  let open = false, panel = null, pos = { x: null, y: null };

  function persist() { localStorage.setItem(LS, JSON.stringify(APP.tweaks)); }

  function build() {
    panel = document.createElement('div');
    panel.id = 'tweaks-panel';
    panel.style.cssText = `position:fixed;top:74px;right:20px;width:264px;background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow-lg);z-index:400;font-family:var(--font);overflow:hidden;display:none`;
    panel.innerHTML = `
      <div id="tw-head" style="display:flex;align-items:center;gap:8px;padding:13px 15px;border-bottom:1px solid var(--line);cursor:grab;background:var(--surface-2)">
        <span style="width:8px;height:8px;border-radius:50%;background:var(--accent)"></span>
        <span style="font-weight:700;font-size:13.5px">Tweaks</span>
        <button id="tw-x" style="margin-left:auto;width:26px;height:26px;border:none;background:none;color:var(--ink-mute);border-radius:6px;font-size:16px">✕</button>
      </div>
      <div style="padding:15px">
        <div class="tw-sec">Phong cách hình ảnh</div>
        <div id="tw-themes" style="display:flex;flex-direction:column;gap:6px;margin:8px 0 16px">
          ${THEMES.map(t=>`<button class="tw-opt" data-theme="${t.id}"><span style="width:18px;height:18px;border-radius:6px;background:${t.sw};flex-shrink:0"></span>${t.nm}<span class="tw-check">✓</span></button>`).join('')}
        </div>
        <div class="tw-sec">Bố cục màn hình đơn</div>
        <div id="tw-layouts" style="display:flex;gap:6px;margin-top:8px">
          ${LAYOUTS.map(l=>`<button class="tw-seg" data-layout="${l.id}" style="flex:1">${l.nm}</button>`).join('')}
        </div>
        <div style="font-size:11px;color:var(--ink-mute);margin-top:10px;line-height:1.5">Bố cục áp dụng cho màn “Xử lý đơn hàng”.</div>
      </div>`;
    document.body.appendChild(panel);

    const style = document.createElement('style');
    style.textContent = `
      .tw-sec{font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-mute);font-weight:700}
      .tw-opt{display:flex;align-items:center;gap:10px;padding:9px 11px;border:1px solid var(--line);border-radius:9px;background:var(--surface);font-family:inherit;font-size:13px;font-weight:500;color:var(--ink);text-align:left}
      .tw-opt:hover{background:var(--surface-2)}
      .tw-opt.on{border-color:var(--primary);background:var(--primary-50)}
      .tw-opt .tw-check{margin-left:auto;color:var(--primary);font-weight:800;opacity:0}
      .tw-opt.on .tw-check{opacity:1}
      .tw-seg{padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);font-family:inherit;font-size:12px;font-weight:600;color:var(--ink-soft)}
      .tw-seg.on{border-color:var(--primary);background:var(--primary-50);color:var(--primary-700)}`;
    document.head.appendChild(style);

    panel.querySelector('#tw-x').onclick = dismiss;
    panel.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>{ APP.tweaks.theme=b.dataset.theme; persist(); sync(); render(); });
    panel.querySelectorAll('[data-layout]').forEach(b=>b.onclick=()=>{ APP.tweaks.layout=b.dataset.layout; persist(); sync(); if(APP.screen==='order') render(); });
    dragHead();
    sync();
  }

  function sync() {
    if (!panel) return;
    panel.querySelectorAll('[data-theme]').forEach(b=>b.classList.toggle('on', b.dataset.theme===APP.tweaks.theme));
    panel.querySelectorAll('[data-layout]').forEach(b=>b.classList.toggle('on', b.dataset.layout===APP.tweaks.layout));
  }

  function dragHead() {
    const head = panel.querySelector('#tw-head');
    head.onmousedown = (e) => {
      if (e.target.id==='tw-x') return;
      const r = panel.getBoundingClientRect();
      const ox = e.clientX - r.left, oy = e.clientY - r.top;
      const move = (ev) => { panel.style.left = (ev.clientX-ox)+'px'; panel.style.top=(ev.clientY-oy)+'px'; panel.style.right='auto'; };
      const up = () => { document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); };
      document.addEventListener('mousemove',move); document.addEventListener('mouseup',up);
    };
  }

  function show(){ if(!panel) build(); open=true; panel.style.display='block'; }
  function hide(){ if(panel) panel.style.display='none'; open=false; }
  function dismiss(){ hide(); window.parent.postMessage({type:'__edit_mode_dismissed'},'*'); }

  window.addEventListener('message',(e)=>{
    const t = e?.data?.type;
    if (t==='__activate_edit_mode') show();
    else if (t==='__deactivate_edit_mode') hide();
  });
  window.parent.postMessage({type:'__edit_mode_available'},'*');
})();
