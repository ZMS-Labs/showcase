(()=>{
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
  // Replay evidence (Gridiron). The tiles the page shows first are read from the page;
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
  document.querySelectorAll('[data-view-src]').forEach(button=>button.addEventListener('click',()=>{
    const group=button.closest('.design-view');
    group.querySelectorAll('[data-view-src]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const picture=group.querySelector('.design-screen');picture.src=button.dataset.viewSrc;picture.alt=button.dataset.viewAlt;
    group.querySelector('.view-caption').textContent=button.dataset.viewCaption;
    group.querySelector('[data-full-resolution]').href=picture.src;
  }));
  // The enlarged view shows the image at full size, never narrower than the dialog, and pans.
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
  // Recordings keep the shape of the video itself, so no bars appear beside or above it.
  document.querySelectorAll('.video-study video').forEach(video=>{
    const fit=()=>{if(video.videoWidth&&video.videoHeight)video.style.aspectRatio=video.videoWidth+' / '+video.videoHeight};
    if(video.readyState>=1)fit();else video.addEventListener('loadedmetadata',fit,{once:true});
  });
})();
