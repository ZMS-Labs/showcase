'use strict';
(() => {
  const data = window.STENO_CASE_STUDY;
  const clauses = document.getElementById('clauses');
  const findings = document.getElementById('findings');
  const selectors = [...document.querySelectorAll('[data-case]')];
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  function highlight(ids) {
    for (const element of clauses.children) element.classList.toggle('is-highlighted', ids.includes(element.dataset.id));
    const first = [...clauses.children].find(element => ids.includes(element.dataset.id));
    if (first) { first.focus({preventScroll:true}); first.scrollIntoView({behavior:'instant',block:'nearest'}); }
  }
  function render(id) {
    const selected = data.cases.find(item => item.id === id);
    if (!selected) return;
    for (const button of selectors) button.setAttribute('aria-pressed', String(button.dataset.case === id));
    document.getElementById('document-tag').textContent = selected.label;
    document.getElementById('change-explanation').textContent = selected.explanation;
    clauses.replaceChildren(); findings.replaceChildren();
    for (const clause of selected.clauses) {
      const section = make('section','clause');
      section.dataset.id = clause.id; section.tabIndex = -1;
      const label = make('div','clause-label');
      label.append(make('b','',clause.reference), make('span','',clause.title));
      section.append(label,make('p','clause-text',clause.text));
      clauses.append(section);
    }
    document.getElementById('finding-count').textContent = String(selected.findings.length);
    document.getElementById('finding-count').setAttribute('aria-label',`${selected.findings.length} recorded findings`);
    if (!selected.findings.length) {
      const emptyCopy = data.emptyFindings || {};
      const empty=make('div','empty-findings');
      const symbol=make('div','empty-symbol','✓');symbol.setAttribute('aria-hidden','true');
      empty.append(symbol,make('h4','',emptyCopy.heading),make('p','',emptyCopy.body));
      findings.append(empty);
    }
    for (const finding of selected.findings) {
      const item = make('article','finding');
      item.append(make('span',`severity ${finding.level === 'info' ? 'info' : ''}`,finding.levelLabel || 'Drafting signal'));
      item.append(make('h4','finding-title',finding.title));
      item.append(make('p','',finding.explanation));
      const ids=finding.clauseIds || [];
      if(ids.length){const button=make('button','finding-link',finding.linkLabel || 'Locate the relevant clause');button.type='button';button.addEventListener('click',()=>highlight(ids));item.append(button);}
      findings.append(item);
    }
    document.body.dataset.selectedCase=id;
  }
  if (!data || !Array.isArray(data.cases) || !data.cases.length) {
    findings.append(make('p','','Recorded evidence could not be loaded. Open the accompanying evidence file to inspect the result.'));
    for(const button of selectors) button.disabled=true;
    return;
  }
  for(const button of selectors) button.addEventListener('click',()=>render(button.dataset.case));
  if (data.evidenceSummary) document.getElementById('evidence-result').textContent=data.evidenceSummary;
  const initial = selectors.find(button => button.getAttribute('aria-pressed') === 'true') || selectors[0];
  if (initial) render(initial.dataset.case);
})();
