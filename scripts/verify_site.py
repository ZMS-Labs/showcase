from pathlib import Path,PurePosixPath
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import html
import json
import argparse
import hashlib
import re
import subprocess
from contextlib import contextmanager
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser(description='Verify the static portfolio and its presentation controls, and count what would stop it from being published.')
parser.add_argument('--base-url', help='Optionally verify an already deployed copy, including its media.')
parser.add_argument('--screenshots', type=Path, help='Optional inspection images outside the published docs directory.')
parser.add_argument('--root', type=Path, help="Check a copy of the site in another folder, such as an export. The default is this repository's docs directory.")
parser.add_argument('--prepublish', action='store_true', help='Also fail on anything that must not be published: placeholder tags left for the author, em or en dashes, ruled-out wording, and breaks in the project list or its order. Without this flag they are only counted.')
args=parser.parse_args()
root=(args.root or Path(__file__).resolve().parents[1]/'docs').resolve()
repo=root.parent
if args.screenshots:
 assert not args.screenshots.resolve().is_relative_to(root), 'Screenshots must stay outside the site payload'
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
  # A <source srcset> in a <picture> has to point at a real file too. Each candidate is "URL [size]".
  if a.get('srcset') and not a['srcset'].startswith('data:'):
   for candidate in a['srcset'].split(','):
    if candidate.strip():self.refs.append((tag,'srcset',candidate.split()[0]))
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
# The Steno receipt records the evidence file's SHA-256 over the bytes the site serves. It has to
# equal both the file itself and the site's checksum list, so the two records cannot drift apart.
evidence=root/'case-studies/steno/recorded-checks/evidence'
checksums={name:digest for digest,name in (line.split('  ',1) for line in (root/'SHA256SUMS.txt').read_text(encoding='utf-8').splitlines() if line)}
receipt_digest=json.loads((evidence/'verification.json').read_text(encoding='utf-8')).get('served_bytes_sha256')
served_digest=hashlib.sha256((evidence/'recorded-checks.json').read_bytes()).hexdigest()
listed_digest=checksums.get((evidence/'recorded-checks.json').relative_to(root).as_posix())
assert receipt_digest==served_digest==listed_digest,{'verification.json served_bytes_sha256':receipt_digest,'recorded-checks.json':served_digest,'SHA256SUMS.txt':listed_digest}
# A typographic quote inside <pre> or <code> breaks a command someone copies into a shell.
class CodeText(HTMLParser):
 def __init__(self):super().__init__();self.depth=0;self.parts=[]
 def handle_starttag(self,tag,attrs):
  if tag in ('pre','code'):self.depth+=1
 def handle_endtag(self,tag):
  if tag in ('pre','code') and self.depth:self.depth-=1
 def handle_data(self,data):
  if self.depth:self.parts.append(data)
curly=[]
for path in pages:
 code=CodeText();code.feed(path.read_text(encoding='utf-8-sig'));text=''.join(code.parts)
 found=[i for i,c in enumerate(text) if 0x2018<=ord(c)<=0x201f]  # the eight typographic single and double quotes
 if found:curly.append({'page':path.relative_to(root).as_posix(),'curly_quotes_in_code':len(found),'near':text[max(0,found[0]-40):found[0]+40]})
assert not curly,curly

# Publishing checks. A normal run counts these problems; --prepublish fails while any are left.
# They read every text file in the repository, not only the site, because GitHub shows the rest too.
def repository_files():
 """Every file git tracks or would add. Without git, every file outside hidden folders."""
 try:
  listed=subprocess.run(['git','-C',str(repo),'ls-files','-z','--cached','--others','--exclude-standard'],capture_output=True,check=True).stdout.decode('utf-8')
 except (OSError,subprocess.CalledProcessError):
  return [p for p in sorted(repo.rglob('*')) if p.is_file() and not any(part.startswith('.') or part in ('__pycache__','outputs') for part in p.relative_to(repo).parts)],'in the folder (git was unavailable)'
 return sorted({repo/p for p in listed.split('\0') if p and (repo/p).is_file()}),'that git tracks or would add'
scan_files,scan_scope=repository_files()
texts={}
for path in scan_files:
 if path.resolve()==Path(__file__).resolve():continue  # this script spells out what it looks for, so it skips itself
 try:content=path.read_bytes().decode('utf-8-sig')
 except UnicodeDecodeError:continue  # images, video, fonts and archives
 texts[path.relative_to(repo).as_posix()]=html.unescape(content) if path.suffix in ('.html','.htm','.xml','.svg') else content
def line_of(content,index):return content.count('\n',0,index)+1
def hits(pattern,skip=()):
 return [f'{name}:{line_of(content,m.start())}' for name,content in texts.items() if PurePosixPath(name).name not in skip for m in pattern.finditer(content)]
# A placeholder tag is a bracketed note for the author to answer or cut, addressed to Zach or naming where a draft came from.
tags=hits(re.compile(r'\[\s*zach\s*[:\]]|\[\s*from\s+(?:r[e\xe9]sum[e\xe9]|corpus)\b',re.I))
# The house style has no em or en dashes, or their look-alikes, anywhere a reader can see.
# They are named by code point (figure dash to horizontal bar, then the two- and three-em dashes).
dashes=hits(re.compile('['+''.join(map(chr,(0x2012,0x2013,0x2014,0x2015,0x2e3a,0x2e3b)))+']'))
# Wording ruled out for these pages: giving AI tools only a share of the coding (AI tools write the code),
# and anything about employment, since these are personal projects. License texts are quoted as issued, so they are skipped.
wording=hits(re.compile(r'with\s+AI\s+assistance|\b(?:most|much|nearly\s+all|almost\s+all)\s+of\s+(?:the\s+|my\s+)?(?:code|coding|programming|building)\b|\b(?:employers?|linkedin|careers?|my\s+(?:day\s+)?job)\b|r\xe9sum|resum\xe9',re.I),skip=('LICENSE','OFL.txt'))

# The project list is decided: four featured projects, then five supporting ones, in this order.
# A case study that is not listed here, or a link to one, is a problem to fix before publishing.
ORDER=('steno','savebench','epistemic-skills','fleet-orchestrator','neuraxic','krewcible','gridiron','enaction','poiesis')
FEATURED=ORDER[:4]
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
HEADINGS=('h1','h2','h3','h4','h5','h6')
class Tree(HTMLParser):
 """A page as nested dicts ({'tag','attrs','kids'}), enough to ask which links and labels sit inside which block."""
 def __init__(self,path):
  super().__init__();self.path=path;self.top={'tag':'','attrs':{},'kids':[]};self.open=[self.top]
  self.feed(path.read_text(encoding='utf-8-sig'));self.close()
 def handle_starttag(self,tag,attrs):
  node={'tag':tag,'attrs':{k:v or '' for k,v in attrs},'kids':[]};self.open[-1]['kids'].append(node)
  if tag not in VOID:self.open.append(node)
 def handle_startendtag(self,tag,attrs):self.open[-1]['kids'].append({'tag':tag,'attrs':{k:v or '' for k,v in attrs},'kids':[]})
 def handle_endtag(self,tag):
  for i in range(len(self.open)-1,0,-1):
   if self.open[i]['tag']==tag:del self.open[i:];break
 def handle_data(self,data):self.open[-1]['kids'].append(data)
 def find(self,test,node=None):
  for kid in (node or self.top)['kids']:
   if isinstance(kid,dict):
    if test(kid):yield kid
    yield from self.find(test,kid)
 def target(self,href):
  """The file a link opens, relative to the site root; None for a link that leaves the site."""
  u=urlsplit(href)
  if u.scheme or u.netloc:return None
  try:return (self.path.parent/unquote(u.path)).resolve().relative_to(root).as_posix() if u.path else self.path.relative_to(root).as_posix()
  except ValueError:return None
 def targets(self,node=None,test=lambda e:True):
  return [self.target(a['attrs']['href']) for a in self.find(lambda e:e['tag']=='a' and bool(e['attrs'].get('href')) and test(e),node)]
 def labels(self,node=None):
  """Status labels: the bold word in a link to the Evidence key."""
  return [text(b) for a in self.find(lambda e:e['tag']=='a' and e['attrs'].get('href','').endswith('evidence.html#status'),node) for b in self.find(is_tag('b'),a)]
def text(node):return ' '.join(' '.join(k if isinstance(k,str) else text(k) for k in node['kids']).split())  # a space between blocks keeps words apart
def is_tag(*names):return lambda e:e['tag'] in names
def has_class(name):return lambda e:name in e['attrs'].get('class','').split()
def project(target):
 m=re.match(r'case-studies/([^/]+)/',target or '')
 return m.group(1) if m else None
def unique(items):return list(dict.fromkeys(i for i in items if i))
def out_of_order(where,found,expected):return f'{where}: the projects run {", ".join(found) or "(none)"}; expected {", ".join(expected)}'
contract=[]
folders={p.name for p in (root/'case-studies').iterdir() if p.is_dir()}
contract+=[f'case-studies/{name}/ is in the site but is not one of the listed projects' for name in sorted(folders-set(ORDER))]
contract+=[f'case-studies/{name}/index.html is missing' for name in ORDER if not (root/'case-studies'/name/'index.html').is_file()]
for name,content in texts.items():
 contract+=[f'{name}:{line_of(content,m.start())} points at case study "{m.group(1)}", which is not one of the listed projects' for m in re.finditer(r'case-studies/([A-Za-z0-9_.-]+)/',content) if m.group(1) not in ORDER]
home=Tree(root/'index.html')
cards=unique(map(project,home.targets(test=has_class('primary-link'))))
if cards!=list(ORDER):contract.append(out_of_order('index.html cards',cards,ORDER))
board=Tree(root/'evidence.html')
key=[text(dt) for dl in board.find(lambda e:e['tag']=='dl' and has_class('status-key')(e)) for dt in board.find(is_tag('dt'),dl)]
if not key:contract.append('evidence.html: no status key (a dl with class status-key) was found')
shown={}
for table in list(board.find(is_tag('table')))[:1]:
 for row in board.find(is_tag('tr'),table):
  names=unique(map(project,board.targets(row)))
  if names and names[0] not in shown:shown[names[0]]=' '.join(text(cell) for cell in board.find(has_class('shown'),row))
if list(shown)!=list(ORDER):contract.append(out_of_order('evidence.html table',list(shown),ORDER))
if key:contract+=[f'evidence.html table: {name} is shown as "{label}", which is not in the status key' for name,label in shown.items() if label not in key]
for path in pages:
 doc=Tree(path);rel=path.relative_to(root).as_posix()
 if key:contract+=[f'{rel}: status label "{label}" is not in the Evidence key' for label in doc.labels() if label not in key]
 # A card or entry about one project has to carry that project's label from the Evidence table.
 for box in doc.find(is_tag('article','section','li')):
  names=unique(map(project,doc.targets(box)));found=doc.labels(box)
  if len(names)==1 and found and names[0] in shown and found[0]!=shown[names[0]]:
   contract.append(f'{rel}: the entry for {names[0]} is labeled "{found[0]}", but the Evidence table says "{shown[names[0]]}"')
for index,name in enumerate(ORDER):
 path=root/'case-studies'/name/'index.html'
 if not path.is_file():continue
 doc=Tree(path);rel=path.relative_to(root).as_posix()
 first=doc.labels()[:1]
 if not first:contract.append(f'{rel}: no status label links to the Evidence key')
 elif name in shown and first[0]!=shown[name]:contract.append(f'{rel}: labeled "{first[0]}", but the Evidence table says "{shown[name]}"')
 # The continue link walks the list in order; the last case study hands over to More work.
 ends=[t for box in doc.find(has_class('next-project')) for t in doc.targets(box)]
 onward=[n for n in unique(map(project,ends)) if n!=name]
 if index+1<len(ORDER):
  if onward!=[ORDER[index+1]]:contract.append(f'{rel}: continues to {" and ".join(onward) or "no project"}; expected {ORDER[index+1]}')
 elif onward or 'more-work.html' not in ends:contract.append(f'{rel}: the last case study should continue to more-work.html only')
 crumb=' '.join(text(e) for e in doc.find(has_class('crumbs')))
 tier,other=('Featured','Supporting') if name in FEATURED else ('Supporting','Featured')
 if not re.search(rf'\b{tier}\b',crumb,re.I) or re.search(rf'\b{other}\b',crumb,re.I):contract.append(f'{rel}: the crumb reads "{crumb}"; it should say {tier}')
 heads=[text(h) for h in doc.find(is_tag(*HEADINGS))]
 for block in ('What is real here','What went into this work'):
  count=sum(h.startswith(block) for h in heads)
  if count!=1:contract.append(f'{rel}: {count} headings start "{block}"; expected one')
 blocks=list(doc.find(lambda e:any(isinstance(k,dict) and k['tag'] in HEADINGS and text(k).startswith('What went into this work') for k in e['kids'])))
 if blocks and not re.search(r'\bAI tools (?:write|wrote) the code\b',' '.join(text(b) for b in blocks)):contract.append(f'{rel}: the "What went into this work" block does not say "AI tools write the code."')
 if blocks and not any(a['attrs'].get('href','').endswith('about.html#how-i-work') for b in blocks for a in doc.find(is_tag('a'),b)):contract.append(f'{rel}: the "What went into this work" block does not link to about.html#how-i-work')
more=Tree(root/'more-work.html')
listed=[n for n in unique(map(project,more.targets())) if n in ORDER]
if listed!=sorted(listed,key=ORDER.index):contract.append(out_of_order('more-work.html',listed,sorted(listed,key=ORDER.index)))
readme=repo/'README.md'
if readme.is_file():
 items=re.findall(r'^[ \t]*[-*+][ \t]+\[[^\]]*\]\([^)\s]*?case-studies/([A-Za-z0-9_.-]+)/',readme.read_text(encoding='utf-8'),re.M)
 if not any(items[i:i+len(ORDER)]==list(ORDER) for i in range(len(items))):contract.append(out_of_order('README.md project list',items,ORDER))
problems={'placeholder_tags':tags,'dashes':dashes,'ruled_out_wording':wording,'project_contract':contract}
if args.prepublish and any(problems.values()):
 raise SystemExit('Not ready to publish:\n'+json.dumps({k:v for k,v in problems.items() if v},indent=2))

modes={'walkthroughs_stepped':0,'walkthroughs_stacked':0,'galleries_expanded':0,'galleries_link_only':0}
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
    # The numbered step strip lists every step and links to each one.
    strip=walk.locator('.walk-strip a')
    assert strip.count()==n and all(strip.nth(i).get_attribute('href')=='#'+steps.nth(i).get_attribute('id') for i in range(n)),(path.name,width,'the step strip does not match the steps')
    if not walk.locator('[data-walk-controls]').is_visible():
     # Phones may stack every step instead of stepping through them. Desktop keeps the step controls.
     assert width<1000,(path.name,width,'the walkthrough has no step controls on desktop')
     assert all(steps.nth(i).is_visible() for i in range(n)),(path.name,width,'a stacked walkthrough step is hidden')
     modes['walkthroughs_stacked']+=1
     continue
    modes['walkthroughs_stepped']+=1
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
    for index in range(n-1,-1,-1):
     strip.nth(index).click()
     assert steps.nth(index).is_visible() and walk.locator('[data-walk-step]:visible').count()==1,(path.name,width,'strip link',index+1)
     assert strip.nth(index).get_attribute('aria-current')=='step' and walk.locator('.walk-strip [aria-current]').count()==1,(path.name,width,'strip link not marked as the current step',index+1)
     assert walk.locator('[data-walk-status]').inner_text()==f'Step {index+1} of {n}'
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
    opener=gallery.locator('[data-enlarge]')
    if not opener.is_visible():
     # Phones may drop the enlarge control in favor of the full-resolution link, which must then be on screen.
     assert width<1000,(path.name,width,'the gallery has no enlarge control on desktop')
     assert gallery.locator('[data-full-resolution]').is_visible(),(path.name,width,'no visible way to open the full image')
     modes['galleries_link_only']+=1
     continue
    modes['galleries_expanded']+=1
    opener.click()
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
    b=page.get_by_role('button',name='Expand design view',exact=True)
    if b.is_visible():b.click();assert page.locator('dialog').is_visible();assert page.locator('[data-dialog-original]').get_attribute('href').endswith('workstation.png');page.keyboard.press('Escape');assert not page.locator('dialog').is_visible();assert b.evaluate('(e)=>e===document.activeElement')
    else:assert width<1000,(path.name,width,'Expand design view is missing on desktop')
   elif path.parent.name=='krewcible':
    page.get_by_role('button',name='Initial state',exact=True).click();assert page.locator('.design-screen').first.get_attribute('src').endswith('comparison.png');assert page.locator('.design-view [data-full-resolution]').first.get_attribute('href').endswith('comparison.png');assert 'four applied traits' in page.locator('.view-caption').first.inner_text()
    page.get_by_role('button',name='After changes',exact=True).click();assert page.locator('.design-screen').first.get_attribute('src').endswith('workspace.png');assert page.locator('.design-view [data-full-resolution]').first.get_attribute('href').endswith('workspace.png');assert 'arcane bearing removed' in page.locator('.view-caption').first.inner_text()
    b=page.get_by_role('button',name='Expand design view',exact=True)
    if b.is_visible():b.click();assert page.locator('dialog').is_visible();page.get_by_role('button',name='Close',exact=True).click();assert not page.locator('dialog').is_visible()
    else:assert width<1000,(path.name,width,'Expand design view is missing on desktop')
   elif path.parent.name=='gridiron':
    page.get_by_role('button',name='Still unmeasured',exact=True).click();assert page.locator('#measurements').inner_text().count('Unknown')==2
    page.get_by_role('button',name='Observed in the replay',exact=True).click();assert page.locator('#measurements .measure strong').first.inner_text()=='3'
   elif path.parent.name=='recorded-checks':
    # The two drafts are found by id, so their button labels can change without touching this check.
    page.locator('button#draft-after').click();assert page.locator('#finding-count').inner_text()=='0'
    page.locator('button#draft-before').click();assert page.locator('#finding-count').inner_text()=='2'
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

print(json.dumps({'page_viewport_checks':len(checks),'local_links':'passed','video_playback_checks':media_checks,'interactions':f'existing controls, walkthroughs, galleries, no-JS fallback, transcripts and {media_checks} HTTP video/text-track playback checks passed',**modes,'javascript_errors':len(errors),'external_requests':len(remote),'steno_receipt':'served-bytes digest matches the file and SHA256SUMS.txt','curly_quotes_in_code':0,'text_files_scanned':f'{len(texts)} {scan_scope}',**{k:len(v) for k,v in problems.items()},'ready_to_publish':not any(problems.values())},indent=2))
