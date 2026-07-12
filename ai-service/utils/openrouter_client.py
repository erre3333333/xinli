from config import OPENROUTER_API_KEY, DEFAULT_MODEL, SITE_URL, APP_NAME
import httpx

OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

HEADERS = {
    'Authorization': f'Bearer {OPENROUTER_API_KEY}',
    'Content-Type': 'application/json',
    'HTTP-Referer': SITE_URL,
    'X-Title': APP_NAME,
}

async def stream_chat(messages, model=None):
    model = model or DEFAULT_MODEL
    payload = {
        'model': model,
        'messages': messages,
        'stream': True,
        'max_tokens': 4096,
        'temperature': 0.7,
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        async with client.stream('POST', OPENROUTER_URL, json=payload, headers=HEADERS) as resp:
            if resp.status_code != 200:
                error_text = await resp.aread()
                yield f'请求 AI 失败: {resp.status_code} - {error_text.decode()}'
                return

            async for line in resp.aiter_lines():
                if line.startswith('data: '):
                    data = line[6:].strip()
                    if not data or data == '[DONE]':
                        break
                    try:
                        import json
                        chunk = json.loads(data)
                        choices = chunk.get('choices', [])
                        if not choices:
                            continue
                        delta = choices[0].get('delta', {})
                        content = delta.get('content', '')
                        if content:
                            yield content
                    except json.JSONDecodeError:
                        continue
