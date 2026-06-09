import os
import json

log_path = r"C:\Users\tipid\.gemini\antigravity\brain\08f30127-b483-4fd3-b81d-63eebcc1d189\.system_generated\logs\transcript.jsonl"
if not os.path.exists(log_path):
    print("Transcript log not found")
else:
    with open(log_path, 'r', encoding='utf-8') as f:
        for idx, line in enumerate(f):
            try:
                data = json.loads(line)
                content = str(data)
                # Check for relevant keywords
                if "sylla" in content.lower() or "flood" in content.lower():
                    # Print summary of the step
                    print(f"Step {data.get('step_index')}: {data.get('type')} status={data.get('status')}")
                    # If it's a command run, print the command line
                    if data.get('tool_calls'):
                        for tc in data['tool_calls']:
                            if 'CommandLine' in tc.get('arguments', {}):
                                print(f"  Command: {tc['arguments']['CommandLine']}")
                            elif 'CodeContent' in tc.get('arguments', {}):
                                print(f"  Code written length: {len(tc['arguments']['CodeContent'])}")
            except Exception as e:
                pass
