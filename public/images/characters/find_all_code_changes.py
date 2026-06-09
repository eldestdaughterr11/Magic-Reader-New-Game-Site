import os
import json

log_path = r"C:\Users\tipid\.gemini\antigravity\brain\08f30127-b483-4fd3-b81d-63eebcc1d189\.system_generated\logs\transcript.jsonl"
if os.path.exists(log_path):
    with open(log_path, 'r', encoding='utf-8') as f:
        for idx, line in enumerate(f):
            try:
                data = json.loads(line)
                if data.get('tool_calls'):
                    for tc in data['tool_calls']:
                        name = tc.get('name')
                        args = tc.get('arguments', {})
                        content_str = str(args)
                        if 'sylla' in content_str.lower() or 'process' in content_str.lower():
                            print(f"Step {data.get('step_index')}: {name}")
                            # Print only keys and a preview of values
                            for k, v in args.items():
                                val_preview = str(v)[:200]
                                print(f"  {k}: {val_preview} ...")
                            print("-------------------")
            except Exception as e:
                pass
