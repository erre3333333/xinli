import zipfile, os, sys, tempfile, shutil
src = sys.argv[1]
dst = sys.argv[2]
tmp = tempfile.mkdtemp()
with zipfile.ZipFile(src) as z:
    z.extractall(tmp)
items = os.listdir(tmp)
if items:
    srcdir = os.path.join(tmp, items[0])
    if os.path.isdir(srcdir):
        if os.path.exists(dst):
            shutil.rmtree(dst)
        shutil.copytree(srcdir, dst)
        print(f"Installed to: {dst}")
        for f in os.listdir(dst):
            print(f"  {f}")
    else:
        print("No root directory in zip")
else:
    print("Empty zip")
shutil.rmtree(tmp)
