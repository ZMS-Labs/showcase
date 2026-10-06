(()=>{
  'use strict';
  const root=document.documentElement;
  root.classList.add('js');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const store={get(){try{return localStorage.getItem('motion')}catch{return null}},set(v){try{localStorage.setItem('motion',v)}catch{}}};
  const motionAllowed=()=>!reduce.matches&&store.get()!=='off';

  // Motion is an enhancement. Without scripts, or with motion turned off, every step and
  // every number is already visible in its final state.
  function applyMotion(){
    const on=motionAllowed();
    root.classList.toggle('js-motion',on);
    const toggle=document.querySelector('.motion-toggle');
    if(toggle){
      toggle.hidden=false;
      toggle.disabled=reduce.matches;
      toggle.setAttribute('aria-pressed',String(!on));
      toggle.textContent=reduce.matches?'Motion reduced by your settings':on?'Turn off motion':'Turn on motion';
    }
    if(!on)document.querySelectorAll('.reveal,.timeline li,.bars').forEach(el=>el.classList.add('seen'));
  }
  document.querySelector('.motion-toggle')?.addEventListener('click',()=>{store.set(motionAllowed()?'off':'on');applyMotion()});
  reduce.addEventListener?.('change',applyMotion);
  applyMotion();

  // Things that appear once as they come into view: section reveals, timeline entries, bar charts.
  if('IntersectionObserver' in window){
    const seen=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('seen');seen.unobserve(e.target)}},{rootMargin:'0px 0px -12% 0px',threshold:.15});
    document.querySelectorAll('.reveal,.timeline li,.bars').forEach(el=>seen.observe(el));
  }else document.querySelectorAll('.reveal,.timeline li,.bars').forEach(el=>el.classList.add('seen'));

  // Scroll stories. The steps are ordinary text that scrolls; the picture beside them follows
  // whichever step sits in the middle of the screen, scrolling up or down. The story's
  // data-graphic target receives data-state from the active step's data-state.
  document.querySelectorAll('[data-story]').forEach(story=>{
    const steps=[...story.querySelectorAll('.story-step')];
    const graphic=story.querySelector('[data-graphic]');
    if(!steps.length||!graphic||!('IntersectionObserver' in window))return;
    story.classList.add('js-story');
    let active=-1;
    const activate=i=>{
      if(i===active)return;active=i;
      steps.forEach((s,n)=>s.classList.toggle('is-active',n===i));
      const state=steps[i].dataset.state;
      graphic.dataset.state=state;
      graphic.querySelectorAll('[data-on]').forEach(el=>el.classList.toggle('on',el.dataset.on.split(' ').includes(state)));
      graphic.setAttribute('data-active',state);
      const live=story.querySelector('[data-story-live]');
      if(live)live.textContent=steps[i].querySelector('h3')?.textContent||'';
    };
    const io=new IntersectionObserver(entries=>{
      for(const e of entries)if(e.isIntersecting)activate(steps.indexOf(e.target));
    },{rootMargin:'-45% 0px -45% 0px',threshold:0});
    steps.forEach(s=>io.observe(s));
    activate(0);
  });

  // Method selection (Epistemic Skills). The example the page shows first is read from the page,
  // so its wording lives in one place; the other two examples live here.
  const examples={
    verify:{name:'Did It Land',question:'Where does this change land, and what would look different if it had not?',body:'Follow the change to the file or behavior that depends on it. Check the outcome there and say which parts could not be observed.',result:'An observed outcome, with what it does and does not cover.'},
    review:{name:'Perspective / Gauntlet',question:'What concern or competing reading could change this decision?',body:'One concern gets one focused look. A decision with more at stake gets several separate looks and a judgment between them.',result:'A reasoned decision with the disagreement kept.'}
  };
  const methodFields=['name','question','body','result'];
  const firstMethod=document.querySelector('[data-method][aria-pressed="true"]');
  if(firstMethod&&document.querySelector('#method-name'))examples[firstMethod.dataset.method]=Object.fromEntries(methodFields.map(field=>[field,document.querySelector('#method-'+field).textContent]));
  document.querySelectorAll('[data-method]').forEach(button=>button.addEventListener('click',()=>{
    const value=examples[button.dataset.method];if(!value)return;
    document.querySelectorAll('[data-method]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    methodFields.forEach(field=>{document.querySelector('#method-'+field).textContent=value[field]});
  }));

  // Replay results (Gridiron). The tiles the page shows first are read from the page;
  // the still-unmeasured set lives here.
  const measurements={
    unmeasured:[['Unknown','how accurately Gridiron reads the game screen.'],['Unknown','whether its commentary gets names and numbers right.'],['Unverified','live capture, real saves and a complete played game.']]
  };
  const cards=[...document.querySelectorAll('#measurements .measure')];
  const firstMeasurement=document.querySelector('[data-measurement][aria-pressed="true"]');
  if(firstMeasurement&&cards.length)measurements[firstMeasurement.dataset.measurement]=cards.map(card=>[card.querySelector('strong').textContent,card.querySelector('span').textContent]);
  document.querySelectorAll('[data-measurement]').forEach(button=>button.addEventListener('click',()=>{
    const values=measurements[button.dataset.measurement];if(!values)return;
    document.querySelectorAll('[data-measurement]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    values.forEach((v,i)=>{if(cards[i]){cards[i].querySelector('strong').textContent=v[0];cards[i].querySelector('span').textContent=v[1]}});
  }));

  // Galleries: switch views, keep the caption and the full-resolution link with the picture.
  document.querySelectorAll('[data-view-src]').forEach(button=>button.addEventListener('click',()=>{
    const group=button.closest('.design-view');
    group.querySelectorAll('[data-view-src]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const picture=group.querySelector('.design-screen');picture.src=button.dataset.viewSrc;picture.alt=button.dataset.viewAlt;
    group.querySelector('.view-caption').textContent=button.dataset.viewCaption;
    group.querySelector('[data-full-resolution]').href=picture.src;
  }));
  // The enlarged view shows the image at full size and pans; Escape or Close returns focus.
  const dialog=document.querySelector('.image-dialog');
  let opener=null;
  document.querySelectorAll('[data-enlarge]').forEach(button=>button.addEventListener('click',()=>{
    const group=button.closest('.design-view');const picture=group.querySelector('.design-screen');
    dialog.querySelector('img').src=picture.src;dialog.querySelector('img').alt=picture.alt;
    dialog.querySelector('[data-dialog-original]').href=picture.src;
    dialog.querySelector('.dialog-caption').textContent=group.querySelector('.view-caption').textContent;
    opener=button;dialog.showModal();dialog.scrollTop=0;dialog.scrollLeft=0;dialog.querySelector('[data-close]').focus();
  }));
  if(dialog){dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>opener?.focus())}

  // Recordings keep the shape of the video itself.
  document.querySelectorAll('.video-study video').forEach(video=>{
    const fit=()=>{if(video.videoWidth&&video.videoHeight)video.style.aspectRatio=video.videoWidth+' / '+video.videoHeight};
    if(video.readyState>=1)fit();else video.addEventListener('loadedmetadata',fit,{once:true});
  });

  // A link to something inside a closed disclosure opens it.
  function openTo(hash){
    let target=null;try{target=hash&&document.getElementById(decodeURIComponent(hash.slice(1)))}catch{}
    for(let p=target?.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;
    return target;
  }
  addEventListener('hashchange',()=>openTo(location.hash)?.scrollIntoView());
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a)openTo(a.hash)});
  if(location.hash){const t=openTo(location.hash);if(t)requestAnimationFrame(()=>t.scrollIntoView())}
})();
