import os
import json

log_path = r"C:\Users\tipid\.gemini\antigravity\brain\08f30127-b483-4fd3-b81d-63eebcc1d189\.system_generated\logs\transcript.jsonl"
steps_to_inspect = {95, 96, 113, 114}

if os.path.exists(log_path):
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                step = data.get('step_index')
                if step in steps_to_inspect:
                    print(f"=== Step {step}: {data.get('type')} ===")
                    # Check for tool_calls in the main data
                    if 'tool_calls' in data:
                        for tc in data['tool_calls']:
                            print(f"  Tool: {tc.get('name')}")
                            args = tc.get('arguments', {})
                            if 'CodeContent' in args:
                                print("--- CodeContent ---")
                                print(args['CodeContent'])
                                print("-------------------")
            except Exception as e:
                pass
