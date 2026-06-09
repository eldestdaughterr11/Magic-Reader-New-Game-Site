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
                        if tc.get('name') == 'write_to_file':
                            args = tc.get('arguments', {})
                            code = args.get('CodeContent', '')
                            if 'sylla' in code.lower() or 'syllabella' in code.lower():
                                print(f"Step {data.get('step_index')}: write_to_file for {args.get('TargetFile')}")
                                print("--- Code ---")
                                print(code)
                                print("------------")
            except Exception as e:
                pass
