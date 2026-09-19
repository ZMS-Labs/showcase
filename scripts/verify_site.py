from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]/'docs'

class Links(HTMLParser):
 def __init__(self):super().__init__();self.refs=[];self.ids=set()
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  for key in ['href','src']:
   if a.get(key):self.refs.append((tag,key,a[key]))
errors=[];remote=[];checks=[];missing=[]
pages=[root/'index.html',*sorted(root.glob('case-studies/*/index.html')),root/'evidence.html',root/'case-studies/steno/recorded-checks/index.html']
for path in pages:
 parsed=Links();parsed.feed(path.read_text(encoding='utf-8-sig'))
 for tag,attr,url in parsed.refs:
  u=urlsplit(url)
  if u.scheme in ['http','https','mailto','data']:continue
  target=(path.parent/unquote(u.path)).resolve() if u.path else path
  if not target.is_file():missing.append({'page':str(path.relative_to(root)),'target':url});continue
  if u.fragment and target.suffix=='.html':
   dest=Links();dest.feed(target.read_text(encoding='utf-8-sig'))
   if u.fragment not in dest.ids:missing.append({'page':str(path.relative_to(root)),'anchor':url})
assert not missing,missing
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for width,height in [(1440,1050),(390,844),(320,700)]:
  context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,offline=True,reduced_motion='reduce')
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:remote.append(r.url) if r.url.startswith(('https://','http://')) else None)
  for path in pages:
   page.goto(path.as_uri(),wait_until='load');page.evaluate('document.fonts.ready')
   assert page.locator('h1').count()==1,str(path)
   assert not page.evaluate('document.documentElement.scrollWidth > innerWidth+1'),(path.name,width,'overflow')
   for img in page.locator('img[src]').all():
    img.scroll_into_view_if_needed();img.evaluate('(e)=>e.decode()')
    assert img.evaluate('(e)=>e.complete&&e.naturalWidth>0'),(path,img.get_attribute('src'))
   page.evaluate('window.scrollTo(0,0)')
   checks.append({'page':path.relative_to(root).as_posix(),'viewport':[width,height],'images':'loaded','horizontal_overflow':False})
   if path.parent.name=='epistemic-skills':
    page.get_by_role('button',name='Verify a change',exact=True).click();assert page.locator('#method-name').inner_text()=='Did It Land'
    b=page.get_by_role('button',name='Examine a decision',exact=True);b.focus();page.keyboard.press('Enter');assert page.locator('#method-name').inner_text()=='Perspective / Gauntlet';assert b.get_attribute('aria-pressed')=='true'
   elif path.parent.name=='steno':
    page.get_by_role('button',name='Document workstation',exact=True).click();assert page.locator('.design-screen').get_attribute('src').endswith('workstation.png')
    assert page.locator('.design-view [data-full-resolution]').get_attribute('href').endswith('workstation.png')
    b=page.get_by_role('button',name='Expand design view',exact=True);b.click();assert page.locator('dialog').is_visible();assert page.locator('[data-dialog-original]').get_attribute('href').endswith('workstation.png');page.keyboard.press('Escape');assert not page.locator('dialog').is_visible();assert b.evaluate('(e)=>e===document.activeElement')
   elif path.parent.name=='krewcible':
    page.get_by_role('button',name='Initial state',exact=True).click();assert page.locator('.design-screen').get_attribute('src').endswith('comparison.png');assert page.locator('.design-view [data-full-resolution]').get_attribute('href').endswith('comparison.png');assert 'four applied traits' in page.locator('.view-caption').inner_text()
    page.get_by_role('button',name='After changes',exact=True).click();assert page.locator('.design-screen').get_attribute('src').endswith('workspace.png');assert page.locator('.design-view [data-full-resolution]').get_attribute('href').endswith('workspace.png');assert 'arcane bearing removed' in page.locator('.view-caption').inner_text()
    page.get_by_role('button',name='Expand design view',exact=True).click();assert page.locator('dialog').is_visible();page.get_by_role('button',name='Close',exact=True).click();assert not page.locator('dialog').is_visible()
   elif path.parent.name=='gridiron':
    page.get_by_role('button',name='Still unmeasured',exact=True).click();assert page.locator('#measurements').inner_text().count('Unknown')==2
    page.get_by_role('button',name='Observed in the replay',exact=True).click();assert page.locator('#measurements .measure strong').first.inner_text()=='3'
   elif path.parent.name=='recorded-checks':
    page.get_by_role('button',name='Proposed edits',exact=True).click();assert page.locator('#finding-count').inner_text()=='0'
    page.get_by_role('button',name='Initial draft',exact=True).click();assert page.locator('#finding-count').inner_text()=='2'
  context.close()
 browser.close()
assert not errors,errors
assert not remote,remote
receipt={'scope':'Static portfolio presentation and controls; not product acceptance','pages':checks,'local_links':'passed','javascript_errors':errors,'external_requests':remote,'interactions':'method selection, measurement boundaries, galleries, full-resolution target synchronization, dialog close/focus, recorded linter replay passed','limitations':'No full assistive-technology certification; authentic product rendering receipts are separate.'}

print(json.dumps({'page_viewport_checks':len(checks),'local_links':'passed','interactions':'passed','javascript_errors':len(errors),'external_requests':len(remote)},indent=2))
