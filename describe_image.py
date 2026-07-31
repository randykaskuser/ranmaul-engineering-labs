import json
import base64
import urllib.request
import sys

image_path = "C:/Users/Randy M/DOWNLOADS/Chrome Dowloads/ChatGPT Image Jul 30, 2026, 12_42_48 PM.png"
with open(image_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

# Try using standard gemini API payload structure if anthropic-like doesn't work, 
# or just look at the image directly since I can see it via the Read tool result!

