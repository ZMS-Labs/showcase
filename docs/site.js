(()=>{
  const examples={
    investigate:{name:'Triage',question:'Which observation would distinguish this cause from the alternatives?',body:'Compare competing explanations, inspect the relevant evidence, and use a targeted test to narrow the cause. Then carry the supported repair through to verification.',result:'A supported cause and a checked repair.'},
    verify:{name:'Did It Land',question:'What does the actual consumer do with the change?',body:'Follow the change to the artifact or behavior that depends on it. Check the requested outcome at that boundary and report any part that could not be observed.',result:'An observed outcome, with its scope and limits.'},
    review:{name:'Perspective / Gauntlet',question:'What concern or competing interpretation could change the decision?',body:'Use focused scrutiny for a specific concern. Use plural review when several independent examinations and an adjudicated outcome are warranted.',result:'A reasoned decision that preserves material disagreement.'}
  };
  document.querySelectorAll('[data-method]').forEach(button=>button.addEventListener('click',()=>{
    const value=examples[button.dataset.method];
    document.querySelectorAll('[data-method]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.querySelector('#method-name').textContent=value.name;
    document.querySelector('#method-question').textContent=value.question;
    document.querySelector('#method-body').textContent=value.body;
    document.querySelector('#method-result').textContent=value.result;
  }));
  const measurements={
    measured:[['3','Terminal events match the fixture oracle.'],['1','Utterance produced by the deterministic path.'],['2 runs','The canonical event ledger hash matches.']],
    unmeasured:[['Unknown','OCR and perception accuracy were not measured.'],['Unknown','Commentary name/number accuracy was not independently evaluated.'],['Unverified','Live game capture, save compatibility and full-game operation.']]
  };
  document.querySelectorAll('[data-measurement]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-measurement]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const cards=document.querySelectorAll('#measurements .measure');
    measurements[button.dataset.measurement].forEach((v,i)=>{cards[i].querySelector('strong').textContent=v[0];cards[i].querySelector('span').textContent=v[1]});
  }));
  document.querySelectorAll('[data-view-src]').forEach(button=>button.addEventListener('click',()=>{
    const group=button.closest('.design-view');
    group.querySelectorAll('[data-view-src]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const picture=group.querySelector('.design-screen');picture.src=button.dataset.viewSrc;picture.alt=button.dataset.viewAlt;
    group.querySelector('.view-caption').textContent=button.dataset.viewCaption;
    group.querySelector('[data-full-resolution]').href=picture.src;
  }));
  const dialog=document.querySelector('.image-dialog');
  let opener=null;
  document.querySelectorAll('[data-enlarge]').forEach(button=>button.addEventListener('click',()=>{
    const group=button.closest('.design-view');const picture=group.querySelector('.design-screen');
    dialog.querySelector('img').src=picture.src;dialog.querySelector('img').alt=picture.alt;
    dialog.querySelector('[data-dialog-original]').href=picture.src;
    dialog.querySelector('.dialog-caption').textContent=group.querySelector('.view-caption').textContent;
    opener=button;dialog.showModal();dialog.querySelector('[data-close]').focus();
  }));
  if(dialog){dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>opener?.focus())}
})();
