import sys, json
data = json.load(sys.stdin)
for m in data.get('data', []):
    mid = m['id']
    pricing = m.get('pricing', {})
    prompt_cost = float(pricing.get('prompt', 1))
    completion_cost = float(pricing.get('completion', 1))
    is_free = 'free' in mid.lower() or (prompt_cost == 0 and completion_cost == 0)
    if is_free or prompt_cost < 0.001:
        print(f'{mid:60s} {"FREE" if prompt_cost == 0 else "$"+str(prompt_cost)}')
