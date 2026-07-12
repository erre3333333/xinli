import zipfile, os, sys
src = sys.argv[1]
dst = sys.argv[2]
os.makedirs(dst, exist_ok=True)
with zipfile.ZipFile(src) as z:
    z.extractall(dst)
for f in os.listdir(dst):
    print(f)
