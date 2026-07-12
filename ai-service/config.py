import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / '.env')

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '')
DEFAULT_MODEL = 'google/gemma-4-31b-it:free'
AI_SERVICE_HOST = os.getenv('AI_SERVICE_HOST', '0.0.0.0')
AI_SERVICE_PORT = int(os.getenv('AI_SERVICE_PORT', '8000'))

SITE_URL = os.getenv('SITE_URL', 'http://localhost:5173')
APP_NAME = os.getenv('APP_NAME', 'MindGarden')
