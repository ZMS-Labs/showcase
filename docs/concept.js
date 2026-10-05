(() => {
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const root=document.documentElement,button=document.querySelector('.reading-toggle');
  let readerMode=false,frame=0;
  const sequences=[...document.querySelectorAll('.sequence')];
  const mix=(a,b,p)=>a.map((v,i)=>Math.round(v+(b[i]-v)*p));
  const rgb=v=>`rgb(${v.join(',')})`;
  function render(){
    frame=0;
    const active=!readerMode&&!preference.matches;
    root.classList.toggle('motion',active);
    for(const sequence of sequences){
      const stage=sequence.querySelector('.sticky-scene'),steps=sequence.querySelector('.steps');
      // Short or enlarged viewports use ordinary flow. No essential text is in the scene.
      const canPin=active&&innerWidth>740&&stage.offsetHeight+140<innerHeight;
      sequence.classList.toggle('static-sequence',!canPin);
      const first=steps.firstElementChild,last=steps.lastElementChild;
      const start=first.getBoundingClientRect().top+scrollY-160;
      const end=last.getBoundingClientRect().top+scrollY-160;
      const p=active?Math.max(0,Math.min(1,(scrollY-start)/Math.max(1,end-start))):0;
      sequence.style.setProperty('--progress',p.toFixed(5));
      sequence.dataset.progress=p.toFixed(4);
      const color=p<.5?mix([216,223,209],[33,58,57],p*2):mix([33,58,57],[169,73,43],(p-.5)*2);
      sequence.style.background=rgb(color);
      const linear=color.map(v=>{const c=v/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});
      const luminance=.2126*linear[0]+.7152*linear[1]+.0722*linear[2];
      // Choose the higher-contrast text color at every interpolated background.
      sequence.style.color=(1.05/(luminance+.05))>=((luminance+.05)/.05)?'#fff':'#000';
      const visual=sequence.querySelector('.scene,.narrative-scene');
      if(visual)visual.style.background=rgb(mix([198,205,187],[127,148,121],p));
    }
    if(button){button.hidden=false;button.setAttribute('aria-pressed',String(readerMode));button.textContent=readerMode?'Enable motion':preference.matches?'Motion reduced by preference':'Read without motion';button.disabled=preference.matches;}
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(render)}
  button?.addEventListener('click',()=>{readerMode=!readerMode;render()});
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);addEventListener('pageshow',schedule);addEventListener('hashchange',schedule);
  preference.addEventListener('change',render);
  document.fonts.ready.then(schedule);
  const holder=document.querySelector('#draft-cases');
  if(holder&&window.STENO_CASE_STUDY){
    const data=window.STENO_CASE_STUDY;
    holder.className='draft-columns';
    const add=(parent,tag,value)=>{const e=document.createElement(tag);e.textContent=value;parent.append(e);return e};
    for(const item of data.cases){
      const column=document.createElement('article');column.className='draft-column';holder.append(column);
      add(column,'h3',item.label);add(column,'p',item.explanation);
      for(const clause of item.clauses){const details=document.createElement('details');column.append(details);add(details,'summary',clause.title);add(details,'p',clause.text)}
      if(item.findings.length){add(column,'h4','The two recorded findings');const list=document.createElement('ul');column.append(list);for(const finding of item.findings)add(list,'li',finding.explanation)}
      else{add(column,'h4',data.emptyFindings.heading);add(column,'p',data.emptyFindings.body)}
    }
  }
  render();
})();
