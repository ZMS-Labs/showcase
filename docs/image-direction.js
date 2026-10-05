(() => {
 for(const art of document.querySelectorAll('[data-visual-art]')){
  const buttons=[...art.querySelectorAll('[data-visual-view]')],image=art.querySelector('.visual-image');
  for(const button of buttons){button.hidden=false;button.addEventListener('click',()=>{
   const detail=button.dataset.visualView==='detail';art.dataset.view=detail?'detail':'context';
   for(const other of buttons)other.setAttribute('aria-pressed',String(other===button));
   if(image){const next=detail?image.dataset.detailSrc:image.dataset.contextSrc;if(next)image.src=next;}
  });}
 }
})();
