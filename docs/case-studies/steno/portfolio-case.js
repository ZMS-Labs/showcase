'use strict';
(() => {
 document.documentElement.classList.add('js');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 let readingStatic=false;
 let motion=!reduce.matches;
 document.addEventListener('readingmodechange',event=>{readingStatic=event.detail.static;motion=!reduce.matches&&!readingStatic;request();});
 document.documentElement.classList.toggle('motion',motion);
 const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 const data=window.STENO_CASE_STUDY;
 const cases=[...document.querySelectorAll('[data-case]')];
 function showCase(id){
  const c=data?.cases?.find(x=>x.id===id);if(!c)return;
  cases.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.case===id)));
  document.getElementById('document-tag').textContent=c.label;
  document.getElementById('change-explanation').textContent=c.explanation;
  const clauses=document.getElementById('clauses'),findings=document.getElementById('findings');clauses.replaceChildren();findings.replaceChildren();
  for(const clause of c.clauses){const e=make('section','clause');e.dataset.id=clause.id;e.tabIndex=-1;if(id==='after'&&['demo-incident','demo-liability'].includes(clause.id))e.classList.add('has-change');const label=make('div','clause-label');label.append(make('b','',clause.reference),make('span','',clause.title));e.append(label,make('p','clause-text',clause.text));clauses.append(e);}
  const count=document.getElementById('finding-count');count.textContent=String(c.findings.length);count.setAttribute('aria-label',c.findings.length+' recorded findings');
  if(!c.findings.length){const e=make('div','empty-findings');e.append(make('h4','',data.emptyFindings.heading),make('p','',data.emptyFindings.body));findings.append(e);}
  for(const f of c.findings){const e=make('article','finding');e.append(make('span','severity',f.levelLabel),make('h4','',f.title),make('p','',f.explanation));if(f.clauseIds?.length){const b=make('button','finding-link',f.linkLabel);b.type='button';b.addEventListener('click',()=>{const ids=f.clauseIds;for(const clause of clauses.children)clause.classList.toggle('is-highlighted',ids.includes(clause.dataset.id));const first=[...clauses.children].find(x=>ids.includes(x.dataset.id));if(first){first.focus({preventScroll:true});first.scrollIntoView({behavior:motion?'smooth':'instant',block:'center'});}});e.append(b);}findings.append(e);}
  document.body.dataset.selectedCase=id;
 }
 if(data?.cases?.length){cases.forEach(b=>b.addEventListener('click',()=>showCase(b.dataset.case)));showCase('before');}else cases.forEach(b=>b.disabled=true);
 const views={map:{file:'../../assets/steno/matter-map.png',alt:"Steno's archived matter workspace with a made-up graph, layers and inspector",caption:'Matter Map: one matter, meaning one contract with its related documents and open questions.'},document:{file:'../../assets/steno/workstation.png',alt:"Steno's archived document review workspace with a made-up agreement and decision rail",caption:"Document workstation: the archived prototype's document view, with made-up content and review choices beside it."}};
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{const v=views[b.dataset.view];if(!v)return;document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const image=document.getElementById('archive-image');image.src=v.file;image.alt=v.alt;document.getElementById('full-image').href=v.file;document.getElementById('archive-caption').textContent=v.caption;}));
 const palette={paper:'#f1ebdf',chalk:'#fbf8f1',ink:'#12232d',blue:'#e5ebef'},chapters=[...document.querySelectorAll('.chapter')];
 const mix=(a,b,t)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
 const scenes=[{el:document.querySelector('.contract-composition'),variable:'--hero-scene',from:'#172d39',to:'#355a68'},{el:document.getElementById('archive'),variable:'--archive-scene',from:'#12232d',to:'#264854'},{el:document.getElementById('hallmark'),variable:'--hallmark-scene',from:'#e5ebef',to:'#f1ebdf'}].filter(scene=>scene.el);
 let queued=false;
 function update(){queued=false;const total=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--reading',total>0?Math.min(1,scrollY/total):0);if(!motion){document.documentElement.style.setProperty('--hero-progress',0);return;}const target=innerHeight*.46;if(!chapters.length)return;let active=chapters[0];for(const c of chapters)if(c.getBoundingClientRect().top<=target)active=c;document.documentElement.style.setProperty('--wash',palette[active.dataset.tone]);const h=chapters[0].getBoundingClientRect();document.documentElement.style.setProperty('--hero-progress',Math.max(0,Math.min(1,-h.top/h.height)));document.querySelectorAll('.nav-row nav a').forEach(a=>{if(a.hash==='#'+active.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
 function updateScenes(){for(const scene of scenes){if(!motion){document.documentElement.style.removeProperty(scene.variable);continue;}const r=scene.el.getBoundingClientRect(),progress=Math.max(0,Math.min(1,(innerHeight*.75-r.top)/(r.height+innerHeight*.5)));document.documentElement.style.setProperty(scene.variable,mix(scene.from,scene.to,progress));}}
 function request(){if(!queued){queued=true;requestAnimationFrame(()=>{update();updateScenes();});}}
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);
 reduce.addEventListener('change',()=>{motion=!reduce.matches&&!readingStatic;document.documentElement.classList.toggle('motion',motion);if(!motion)document.documentElement.style.setProperty('--wash',palette.paper);request();});
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('seen');observer.unobserve(entry.target);}},{threshold:.08});document.querySelectorAll('.illustration').forEach(e=>observer.observe(e));}
 request();
})();
