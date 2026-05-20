import shutil
from pathlib import Path

root = Path(__file__).resolve().parent.parent
old = root / 'images'
if old.exists() and old.is_dir():
    shutil.rmtree(old)
    print('removed images folder')
else:
    print('images folder not found')
