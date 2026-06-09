import os
import json

log_path = r"C:\Users\tipid\.gemini\antigravity\brain\08f30127-b483-4fd3-b81d-63eebcc1d189\.system_generated\logs\transcript.jsonl"
if os.path.exists(log_path):
    with open(log_path, 'r', encoding='utf-8') as f:
        for idx, line in enumerate(f):
            if idx < 5:
                print(f"--- Line {idx} ---")
                try:
                    data = json.loads(line)
                    # Print keys and structure
                    print(f"Keys: {list(data.keys())}")
                    print(f"type: {data.get('type')}, source: {data.get('source')}")
                    # Print content preview
                    print(f"content: {str(data.get('content'))[:200]}")
                except Exception as e:
                    print("Error parsing JSON:", e)
                    print(line[:200])
