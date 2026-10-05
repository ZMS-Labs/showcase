(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const root=document.documentElement;let pending=0;
 const scenes=[...document.querySelectorAll('[data-project-scene]')];
 const copies=[...document.querySelectorAll('.static-reading-copy')];
 if(root.classList.contains('motion')&&!reduce.matches)for(const copy of copies)copy.open=false;
 const sequences=[...document.querySelectorAll('.sequence')];
 function render(){pending=0;const active=root.classList.contains('motion')&&!reduce.matches&&!root.classList.contains('reading-static');
  if(!active)for(const copy of copies)copy.open=true;
  for(const sequence of sequences){const stage=sequence.querySelector('.court-scene'),narrative=sequence.querySelector('.narrative-scene'),p=Number(sequence.dataset.progress||0);if(stage){stage.dataset.phase=p<.35?'claim':p<.75?'terms':'result';stage.style.setProperty('--instrument-zoom',Math.max(0,Math.min(1,(p-.35)/.4)))}if(narrative){narrative.dataset.phase=p<.35?'first':p<.75?'second':'third';narrative.style.setProperty('--detail-progress',Math.max(0,Math.min(1,(p-.35)/.4)))}}
  for(const scene of scenes){const r=scene.getBoundingClientRect();const p=active?Math.max(0,Math.min(1,(innerHeight*.75-r.top)/(r.height+innerHeight*.3))):0;scene.style.setProperty('--scene-progress',p.toFixed(5));scene.dataset.sceneProgress=p.toFixed(4)}
 }
 function schedule(){if(!pending)pending=requestAnimationFrame(render)}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('hashchange',schedule);addEventListener('pageshow',schedule);reduce.addEventListener('change',schedule);
 document.querySelector('.reading-toggle')?.addEventListener('click',()=>{const reading=document.querySelector('.reading-toggle').getAttribute('aria-pressed')==='true';root.classList.toggle('reading-static',reading);document.dispatchEvent(new CustomEvent('readingmodechange',{detail:{static:reading}}));schedule()});
 new MutationObserver(schedule).observe(root,{attributes:true,attributeFilter:['class']});
 document.fonts.ready.then(schedule);render();
 document.querySelectorAll('a[href="#reading-copy"]').forEach(a=>a.addEventListener('click',()=>{document.getElementById('reading-copy').open=true}));
})();
