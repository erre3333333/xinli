import json, os, base64, sys

# GitHub API - file content
repo = "cclank/lanshu-animated-architecture-diagram"
branch = "main"
out = sys.argv[1]

files = [
    "SKILL.md",
    "README.md",
    "package.json",
]

for fname in files:
    url = f"https://api.github.com/repos/{repo}/contents/{fname}?ref={branch}"
    r = os.popen(f'curl.exe -k -s "{url}"').read()
    try:
        data = json.loads(r)
        content = base64.b64decode(data["content"]).decode("utf-8")
        with open(os.path.join(out, fname), "w", encoding="utf-8") as fp:
            fp.write(content)
        print(f"  {fname}: {data['size']}B")
    except Exception as e:
        print(f"  {fname}: FAIL - {e}")
