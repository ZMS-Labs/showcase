(()=>{'use strict';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),button=document.querySelector('.reading-toggle');
 const stories=[...document.querySelectorAll('[data-story]')],reveals=[...document.querySelectorAll('[data-home-reveal]')];
 let reader=false,queued=0;
 const clamp=n=>Math.max(0,Math.min(1,n));
 const details=[...document.querySelectorAll('details.evidence-depth')];
 for(const d of details)d.open=false;
 function render(){queued=0;const active=!reader&&!reduce.matches;document.documentElement.classList.toggle('motion-enabled',active);
  for(const story of stories){const enabled=active&&innerHeight>=650&&(innerWidth>740||innerHeight>=800);story.classList.toggle('is-enhanced',enabled);
   const rect=story.getBoundingClientRect(),header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))||86;
   const travel=Math.max(1,rect.height-innerHeight+header+75),progress=enabled?clamp((header+62-rect.top)/travel):0;
   story.style.setProperty('--story-progress',progress.toFixed(5));story.dataset.progress=progress.toFixed(5);
   const frames=[...story.querySelectorAll('.story-frame')],phase=Math.min(frames.length-1,Math.floor(progress*frames.length));
   story.dataset.phase=String(phase);
   for(let i=0;i<frames.length;i++){const local=clamp(progress*frames.length-i),visible=i===phase;frames[i].dataset.active=String(visible);frames[i].style.setProperty('--frame-progress',local.toFixed(5));frames[i].style.setProperty('--frame-visibility',visible?String(Math.min(1,.82+local*2)): '0');}
   story.querySelectorAll('[data-story-go]').forEach(a=>a.setAttribute('aria-current',String(Number(a.dataset.storyGo)===phase)));
  }
  for(const el of reveals){const r=el.getBoundingClientRect(),p=active?clamp((innerHeight-r.top)/(innerHeight*.8)):1;el.style.setProperty('--reveal-progress',p.toFixed(5));}
  const entrance=document.querySelector('.home-entrance');if(entrance)entrance.style.setProperty('--entrance-progress',active?clamp(scrollY/innerHeight):0);
  if(button){button.hidden=false;button.disabled=reduce.matches;button.setAttribute('aria-pressed',String(reader));button.textContent=reduce.matches?'Motion reduced':reader?'Enable motion':'Pause motion';}
 }
 function schedule(){if(!queued)queued=requestAnimationFrame(render)}
 for(const story of stories)for(const a of story.querySelectorAll('[data-story-go]'))a.addEventListener('click',e=>{if(!story.classList.contains('is-enhanced'))return;e.preventDefault();const i=Number(a.dataset.storyGo),r=story.getBoundingClientRect(),header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))||86;const travel=Math.max(1,r.height-innerHeight+header+75);const fraction=(i+.45)/story.querySelectorAll('.story-frame').length;scrollTo({top:r.top+scrollY-header-62+travel*fraction,behavior:'auto'});history.replaceState(null,'',a.getAttribute('href'));render();});
 const notify=()=>document.dispatchEvent(new CustomEvent('readingmodechange',{detail:{static:reader||reduce.matches}}));
 function revealHash(){const id=decodeURIComponent(location.hash.slice(1)),target=id&&document.getElementById(id);if(target){for(let p=target.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;requestAnimationFrame(()=>target.scrollIntoView());}schedule();}
 button?.addEventListener('click',()=>{reader=!reader;for(const d of details)if(reader)d.open=true;notify();render();});
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pageshow',schedule);addEventListener('hashchange',revealHash);reduce.addEventListener('change',()=>{notify();render();});
 document.fonts.ready.then(schedule);notify();render();if(location.hash)revealHash();
})();
