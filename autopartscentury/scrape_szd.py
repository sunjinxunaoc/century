import urllib.request, urllib.parse, json, os, re, time

OUT = 'szd-images'
os.makedirs(OUT, exist_ok=True)

def iri_to_uri(url):
    parts = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(parts.path)
    return urllib.parse.urlunsplit((parts.scheme, parts.netloc, path, parts.query, parts.fragment))

def get(url):
    req = urllib.request.Request(iri_to_uri(url), headers={'User-Agent': 'Mozilla/5.0'})
    return urllib.request.urlopen(req, timeout=60)

def clean_name(name):
    name = re.sub(r'\$[\d.]+[^|]*', '', name)
    name = name.split(':')[0] if ':' in name and len(name.split(':')[0]) < 60 else name
    name = re.sub(r'[\\/:*?"<>|]', '', name).strip().strip('.')
    name = re.sub(r'\s+', ' ', name)[:80].strip()
    return name or 'unnamed'

products = []
page = 1
while True:
    resp = get(f'https://szd-china.com/wp-json/wc/store/v1/products?per_page=100&page={page}')
    data = json.load(resp)
    if not data:
        break
    products.extend(data)
    total_pages = int(resp.headers.get('X-WP-TotalPages', '1'))
    print(f'page {page}/{total_pages}: {len(data)} products')
    if page >= total_pages:
        break
    page += 1
    time.sleep(0.5)

print('total products:', len(products))

ok = fail = skip = 0
used = {}
for p in products:
    name = clean_name(p.get('name', ''))
    imgs = p.get('images') or []
    if not imgs:
        print('NOIMG', name)
        skip += 1
        continue
    src = imgs[0].get('src') or imgs[0].get('thumbnail')
    ext = os.path.splitext(src.split('?')[0])[1].lower()
    if ext not in ('.jpg', '.jpeg', '.png', '.webp', '.gif'):
        ext = '.jpg'
    fname = name
    if fname in used:
        used[fname] += 1
        fname = f'{fname}-{used[fname]}'
    else:
        used[fname] = 1
    path = os.path.join(OUT, fname + ext)
    if os.path.exists(path):
        skip += 1
        continue
    try:
        with open(path, 'wb') as f:
            f.write(get(src).read())
        ok += 1
        print('OK', fname + ext)
    except Exception as e:
        print('FAIL', name, e)
        fail += 1
    time.sleep(0.2)

print(f'done: ok={ok} fail={fail} noimg={skip}')
