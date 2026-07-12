import json, os, base64, sys

repo = "cclank/lanshu-animated-architecture-diagram"
out = sys.argv[1]
branch = "main"

# Get repo tree
r = os.popen(f'curl.exe -k -s "https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1"').read()
data = json.loads(r)

file_count = 0
for item in data.get("tree", []):
    if item["type"] == "blob":
        path = item["path"]
        file_count += 1

os.makedirs(os.path.join(out, "scripts"), exist_ok=True)
os.makedirs(os.path.join(out, "assets"), exist_ok=True)
os.makedirs(os.path.join(out, "references"), exist_ok=True)

# List all files
for item in data.get("tree", []):
    if item["type"] == "blob":
        path = item["path"]
        print(path)

print(f"\nTotal files: {file_count}")
