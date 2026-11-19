import os, glob
from PIL import Image

folder = os.path.join(os.path.dirname(__file__), '..', 'assets', 'images')
for path in glob.glob(os.path.join(folder, '*.jpg')):
    img = Image.open(path).convert('RGB')
    w, h = img.size
    if w > 1600:
        img = img.resize((1600, int(h * 1600 / w)), Image.LANCZOS)
    out = os.path.splitext(path)[0] + '.webp'
    img.save(out, 'WEBP', quality=82, method=6)
    print(os.path.basename(out), os.path.getsize(out))
