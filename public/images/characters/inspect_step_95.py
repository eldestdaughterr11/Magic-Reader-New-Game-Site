import os
import json

log_path = r"C:\Users\tipid\.gemini\antigravity\brain\08f30127-b483-4fd3-b81d-63eebcc1d189\.system_generated\logs\transcript.jsonl"
if os.path.exists(log_path):
    with open(log_path, 'r', encoding='utf-8') as f:
        for idx, line in enumerate(f):
            try:
                data = json.loads(line)
                if data.get('step_index') in (94, 95, 96, 112, 113, 114):
                    print(f"Step {data.get('step_index')}: {data.get('type')}")
                    if data.get('tool_calls'):
                        for tc in data['tool_calls']:
                            print(f"  Tool: {tc.get('name')}")
                            args = tc.get('arguments', {})
                            if 'CodeContent' in args:
                                print("--- CodeContent ---")
                                print(args['CodeContent'])
                                print("-------------------")
            except Exception as e:
                pass
