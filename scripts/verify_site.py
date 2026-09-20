from pathlib import Path,PurePosixPath
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json
import argparse
from contextlib import contextmanager
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]/'docs'
parser=argparse.ArgumentParser(description='Verify the static portfolio and its presentation controls.')
parser.add_argument('--base-url', help='Optionally verify an already deployed copy, including its media.')
parser.add_argument('--screenshots', type=Path, help='Optional inspection images outside the published docs directory.')
args=parser.parse_args()
if args.screenshots:
 assert not args.screenshots.resolve().is_relative_to(root.resolve()), 'Screenshots must stay outside the site payload'
 args.screenshots.mkdir(parents=True,exist_ok=True)
def destination(path):
 return args.base_url.rstrip('/')+'/'+path.relative_to(root).as_posix() if args.base_url else path.as_uri()
@contextmanager
def media_server():
 if args.base_url:
  yield args.base_url.rstrip('/')+'/'
  return
 class QuietHandler(SimpleHTTPRequestHandler):
  def log_message(self,*args): pass
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(root)))
 thread=Thread(target=server.serve_forever,daemon=True);thread.start()
 try:yield f'http://127.0.0.1:{server.server_port}/'
 finally:server.shutdown();server.server_close();thread.join()


class Links(HTMLParser):
 def __init__(self):super().__init__();self.refs=[];self.ids=set()
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  for key in ['href','src','poster']:
   if a.get(key):self.refs.append((tag,key,a[key]))
errors=[];remote=[];checks=[];missing=[]
pages=sorted(root.rglob('*.html'))
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
  context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,offline=not bool(args.base_url),reduced_motion='reduce')
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:remote.append(r.url) if r.url.startswith(('https://','http://')) and not (args.base_url and r.url.startswith(args.base_url.rstrip('/')+'/')) else None)
  for path in pages:
   page.goto(destination(path),wait_until='load');page.evaluate('document.fonts.ready')
   assert page.locator('h1').count()==1,str(path)
   assert not page.evaluate('document.documentElement.scrollWidth > innerWidth+1'),(path.name,width,'overflow')
   for img in page.locator('img[src]').all():
    img.scroll_into_view_if_needed();img.evaluate('(e)=>e.decode()')
    assert img.evaluate('(e)=>e.complete&&e.naturalWidth>0'),(path,img.get_attribute('src'))
   page.evaluate('window.scrollTo(0,0)')
   checks.append({'page':path.relative_to(root).as_posix(),'viewport':[width,height],'images':'loaded','horizontal_overflow':False})
   for walk in page.locator('[data-walkthrough]').all():
    steps=walk.locator('[data-walk-step]');n=steps.count()
    previous=walk.locator('[data-walk-previous]');next_button=walk.locator('[data-walk-next]')
    assert previous.is_disabled() and steps.nth(0).is_visible()
    for index in range(1,n):
     next_button.focus();page.keyboard.press('Enter')
     assert steps.nth(index).is_visible()
     assert walk.locator('[data-walk-step]:visible').count()==1
     assert walk.locator('[data-walk-status]').inner_text()==f'Step {index+1} of {n}'
     assert steps.nth(index).locator('h3').evaluate('(e)=>e===document.activeElement')
    assert next_button.is_disabled()
    for index in range(n-2,-1,-1):
     previous.click();assert steps.nth(index).is_visible()
    assert previous.is_disabled()
   for transcript in page.locator('details.transcript').all():
    transcript.locator('summary').click();assert transcript.locator('li').first.is_visible()
    transcript.locator('summary').click()
   if args.screenshots and width in [1440,390]:
    page.evaluate('window.scrollTo(0,0)')
    name=path.relative_to(root).as_posix().replace('/','-')
    page.screenshot(path=str(args.screenshots/f'{width}-{name}.png'))
    if page.locator('#walkthrough').count():
     page.locator('#walkthrough').scroll_into_view_if_needed()
     page.screenshot(path=str(args.screenshots/f'{width}-{name}-walkthrough.png'))
   # Additional coverage for every gallery, alongside the named product assertions below.
   for gallery in page.locator('.design-view').all():
    for option in gallery.locator('[data-view-src]').all():
     option.focus();page.keyboard.press('Enter')
     picture=gallery.locator('.design-screen');picture.evaluate('(e)=>e.decode()')
     expected=option.get_attribute('data-view-src')
     assert picture.get_attribute('src')==expected
     assert picture.get_attribute('alt')==option.get_attribute('data-view-alt')
     assert gallery.locator('.view-caption').inner_text()==option.get_attribute('data-view-caption')
     assert option.get_attribute('aria-pressed')=='true'
     assert gallery.locator('[aria-pressed=true]').count()==1
     assert gallery.locator('[data-full-resolution]').get_attribute('href').endswith(expected.removeprefix('../../'))
    opener=gallery.locator('[data-enlarge]');opener.click()
    page.evaluate('()=>{const d=document.querySelector("dialog");if(!d.__counting){d.__counting=true;d.addEventListener("close",()=>d.__seenClose=(d.__seenClose||0)+1)}d.__seenClose=0}')
    assert page.locator('dialog').is_visible()
    assert page.locator('[data-dialog-original]').get_attribute('href').endswith(gallery.locator('.design-screen').get_attribute('src').removeprefix('../../'))
    page.locator('dialog img').evaluate('(e)=>e.decode()')
    page.keyboard.press('Escape');assert not page.locator('dialog').is_visible()
    assert opener.evaluate('(e)=>e===document.activeElement')
    opener.click();page.get_by_role('button',name='Close',exact=True).click()
    assert not page.locator('dialog').is_visible()
    assert opener.evaluate('(e)=>e===document.activeElement')
    # The close event (and the focus return it triggers) fires shortly after close();
    # drain it here so it cannot steal focus from the next gallery's keyboard activation.
    page.wait_for_function('()=>document.querySelector("dialog").__seenClose>=2',polling=100)
   if path.parent.name=='epistemic-skills':
    page.get_by_role('button',name='Verify a change',exact=True).click();assert page.locator('#method-name').inner_text()=='Did It Land'
    b=page.get_by_role('button',name='Examine a decision',exact=True);b.focus();page.keyboard.press('Enter');assert page.locator('#method-name').inner_text()=='Perspective / Gauntlet';assert b.get_attribute('aria-pressed')=='true'
   elif path.parent.name=='steno':
    page.get_by_role('button',name='Document workstation',exact=True).click();assert page.locator('.design-screen').first.get_attribute('src').endswith('workstation.png')
    assert page.locator('.design-view [data-full-resolution]').first.get_attribute('href').endswith('workstation.png')
    b=page.get_by_role('button',name='Expand design view',exact=True);b.click();assert page.locator('dialog').is_visible();assert page.locator('[data-dialog-original]').get_attribute('href').endswith('workstation.png');page.keyboard.press('Escape');assert not page.locator('dialog').is_visible();assert b.evaluate('(e)=>e===document.activeElement')
   elif path.parent.name=='krewcible':
    page.get_by_role('button',name='Initial state',exact=True).click();assert page.locator('.design-screen').first.get_attribute('src').endswith('comparison.png');assert page.locator('.design-view [data-full-resolution]').first.get_attribute('href').endswith('comparison.png');assert 'four applied traits' in page.locator('.view-caption').first.inner_text()
    page.get_by_role('button',name='After changes',exact=True).click();assert page.locator('.design-screen').first.get_attribute('src').endswith('workspace.png');assert page.locator('.design-view [data-full-resolution]').first.get_attribute('href').endswith('workspace.png');assert 'arcane bearing removed' in page.locator('.view-caption').first.inner_text()
    page.get_by_role('button',name='Expand design view',exact=True).click();assert page.locator('dialog').is_visible();page.get_by_role('button',name='Close',exact=True).click();assert not page.locator('dialog').is_visible()
   elif path.parent.name=='gridiron':
    page.get_by_role('button',name='Still unmeasured',exact=True).click();assert page.locator('#measurements').inner_text().count('Unknown')==2
    page.get_by_role('button',name='Observed in the replay',exact=True).click();assert page.locator('#measurements .measure strong').first.inner_text()=='3'
   elif path.parent.name=='recorded-checks':
    page.get_by_role('button',name='Proposed edits',exact=True).click();assert page.locator('#finding-count').inner_text()=='0'
    page.get_by_role('button',name='Initial draft',exact=True).click();assert page.locator('#finding-count').inner_text()=='2'
  context.close()
 # Without JavaScript, all guided sequences remain readable.
 nojs=browser.new_context(java_script_enabled=False,offline=not bool(args.base_url))
 for path in root.glob('case-studies/*/index.html'):
  page=nojs.new_page();page.goto(destination(path))
  assert page.locator('[data-walk-step]').count()>0
  for step in page.locator('[data-walk-step]').all():assert step.is_visible()
  assert not page.locator('[data-walk-controls]').is_visible()
  page.close()
 # The nested recorded-check page is the most JavaScript-dependent; rglob reaches it
 # where the glob above does not. Without scripts its message and evidence links must survive.
 for path in root.rglob('case-studies/*/recorded-checks/index.html'):
  page=nojs.new_page();page.goto(destination(path))
  assert page.locator('noscript p').is_visible(),str(path)
  assert page.locator('a[href="evidence/recorded-checks.json"]').count()>=1,str(path)
  assert page.locator('a[href="evidence/verification.json"]').count()>=1,str(path)
  page.close()
 nojs.close()
 # Text tracks require HTTP; serve the static files temporarily for a same-origin media check.
 with media_server() as media_base:
  media=browser.new_context();page=media.new_page()
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('request',lambda r:remote.append(r.url) if r.url.startswith(('http://','https://')) and not r.url.startswith(media_base) else None)
  # Media identity (slug, duration, width) derives from the published asset manifest;
  # the manifest owns that metadata. Cue counts stay literal below on purpose:
  # they are deliberate content gates, not identity, and change only with reviewed text tracks.
  recordings={}
  for asset in json.loads((root/'assets/manifest.json').read_text(encoding='utf-8'))['assets']:
   if 'duration_seconds' in asset:
    slug=PurePosixPath(asset['path']).parts[-2]
    assert slug not in recordings,('duplicate recording slug',slug)
    recordings[slug]=(asset['duration_seconds'],asset['dimensions'][0])
  cue_pins={'steno':6,'krewcible':11,'neuraxic':7,'savebench':9}
  assert set(recordings)==set(cue_pins),{'missing_recordings':sorted(set(cue_pins)-set(recordings)),'unexpected_recordings':sorted(set(recordings)-set(cue_pins))}
  media_checks=0
  for slug,(expected_duration,expected_width) in recordings.items():
   cues=cue_pins[slug]
   page.goto(media_base+f'case-studies/{slug}/index.html',wait_until='load')
   page.locator('video').scroll_into_view_if_needed()
   page.wait_for_function('document.querySelector("video").readyState >= 1')
   page.wait_for_function('document.querySelector("track").track.cues?.length > 0')
   data=page.locator('video').evaluate('(v)=>({duration:v.duration,width:v.videoWidth,cues:v.textTracks[0].cues.length,autoplay:v.autoplay,controls:v.controls})')
   assert abs(data['duration']-expected_duration)<.1 and data['width']==expected_width,(slug,data)
   assert data['cues']==cues and data['controls'] and not data['autoplay'],(slug,data)
   if not args.base_url:
    # Python's temporary server does not implement byte ranges. Buffer locally before seeking;
    # the deployed check retains metadata preload and exercises the actual host's seek behavior.
    page.locator('video').evaluate('(v)=>{v.preload="auto";v.load();}')
    try:page.wait_for_function('(()=>{let v=document.querySelector("video");return v.buffered.length&&v.buffered.end(v.buffered.length-1)>=v.duration-.1})()',polling=100,timeout=5000)
    except Exception:
     # Chromium can stop prefetching a paused element before the whole file is buffered;
     # playing resumes the datasource. The buffer condition itself still must hold.
     page.locator('video').evaluate('(v)=>{v.muted=true;v.play()}')
     page.wait_for_function('(()=>{let v=document.querySelector("video");return v.buffered.length&&v.buffered.end(v.buffered.length-1)>=v.duration-.1})()',polling=100)
   # Seek while playing: a paused headless pipeline can stay suspended and drop seeks.
   # Interval polling: rAF-polled waits starve on an idle headless page and miss true
   # conditions. The assertions below are unchanged.
   page.locator('video').evaluate('(v)=>v.play()')
   page.locator('video').evaluate('(v)=>{v.currentTime=v.duration-2;}')
   page.wait_for_function('document.querySelector("video").currentTime > 30 && !document.querySelector("video").seeking',polling=100,timeout=45000)
   page.wait_for_function('!document.querySelector("video").paused && document.querySelector("video").readyState >= 2',polling=100)
   page.wait_for_function('(()=>{let v=document.querySelector("video");return v.currentTime>v.duration-1.5})()',polling=100)
   page.locator('video').evaluate('(v)=>new Promise(resolve=>v.requestVideoFrameCallback(resolve))')
   if args.screenshots:
    page.locator('video').scroll_into_view_if_needed();page.screenshot(path=str(args.screenshots/f'{slug}-video-end.png'))
   page.locator('video').evaluate('(v)=>v.pause()')
   media_checks+=1
  media.close()
 browser.close()
assert not errors,errors
assert not remote,remote
receipt={'scope':'Static portfolio presentation and controls; not product acceptance','pages':checks,'local_links':'passed','javascript_errors':errors,'external_requests':remote,'interactions':'method selection, measurement boundaries, galleries, full-resolution target synchronization, dialog close/focus, recorded linter replay passed','limitations':'No full assistive-technology certification; authentic product rendering receipts are separate.'}

print(json.dumps({'page_viewport_checks':len(checks),'local_links':'passed','video_playback_checks':media_checks,'interactions':f'existing controls, all keyboard walkthroughs, no-JS fallback, transcripts and {media_checks} HTTP video/text-track playback checks passed','javascript_errors':len(errors),'external_requests':len(remote)},indent=2))
