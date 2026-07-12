import json, os
path = os.path.expandvars(r'$TEMP\ls.json')
with open(path) as f:
    content = f.read().encode('utf-8', errors='ignore').decode('utf-8')
    items = json.loads(content)
for i in items:
    print(f"{i['type']:4s} {i['name']:30s} {i.get('size',0)}B")
