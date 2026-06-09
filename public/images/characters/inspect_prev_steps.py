import os
import json

log_path = r"C:\Users\tipid\.gemini\antigravity\brain\08f30127-b483-4fd3-b81d-63eebcc1d189\.system_generated\logs\transcript.jsonl"
steps_to_inspect = {101, 102, 103, 104, 125, 126, 127, 134, 139}

if os.path.exists(log_path):
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                step = data.get('step_index')
                if step in steps_to_inspect:
                    print(f"\n=== Step {step} ===")
                    if data.get('tool_calls'):
                        for tc in data['tool_calls']:
                            print(f"Tool: {tc.get('name')}")
                            args = tc.get('arguments', {})
                            if 'CommandLine' in args:
                                print(f"  CommandLine: {args['CommandLine']}")
                            if 'CodeContent' in args:
                                print("  CodeContent:")
                                # Print first few lines and last few lines
                                lines = args['CodeContent'].splitlines()
                                if len(lines) > 20:
                                    print('\n'.join(lines[:15]))
                                    print("...")
                                    print('\n'.join(lines[-5:]))
                                else:
                                    print('\n'.join(lines))
            except Exception as e:
                print(e)
