import json, os, base64, sys

repo = "cclank/lanshu-animated-architecture-diagram"
out = sys.argv[1]
branch = "main"

# Get repo tree
r = os.popen(f'curl.exe -k -s "https://api.github.com/repos/{repo}/git/trees/{branch}?recursive=1"').read()
data = json.loads(r)

text_files = [
    "scripts/render_animated_diagram.py",
    "assets/default-spec.json",
    "references/spec-format.md",
    "requirements.txt",
]

for item in data.get("tree", []):
    if item["type"] == "blob":
        path = item["path"]
        if path not in text_files:
            continue
        
        # Get file content via blob SHA
        sha = item["sha"]
        r2 = os.popen(f'curl.exe -k -s "https://api.github.com/repos/{repo}/git/blobs/{sha}"').read()
        try:
            blob = json.loads(r2)
            content = base64.b64decode(blob["content"]).decode("utf-8")
            
            # Create subdirectories
            full_path = os.path.join(out, path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            with open(full_path, "w", encoding="utf-8") as fp:
                fp.write(content)
            print(f"OK: {path} ({blob['size']}B)")
        except Exception as e:
            print(f"FAIL: {path} - {e}")
