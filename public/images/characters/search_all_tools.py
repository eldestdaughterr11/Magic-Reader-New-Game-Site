import os
import json

log_path = r"C:\Users\tipid\.gemini\antigravity\brain\08f30127-b483-4fd3-b81d-63eebcc1d189\.system_generated\logs\transcript.jsonl"
if os.path.exists(log_path):
    with open(log_path, 'r', encoding='utf-8') as f:
        for idx, line in enumerate(f):
            try:
                data = json.loads(line)
                step_type = data.get('type')
                content = data.get('content', '')
                # If content or thinking has python code or sylla, print it
                if any(x in str(data).lower() for x in ['pil', 'process_sylla', 'syllabella-1.png', 'flood']):
                    print(f"Step {data.get('step_index')}: {step_type}")
                    if 'tool_calls' in data:
                        for tc in data['tool_calls']:
                            print(f"  Tool: {tc.get('name')}")
                            print(f"  Args: {str(tc.get('arguments'))[:500]}")
                    if content and len(str(content)) < 1000:
                        print(f"  Content: {content}")
                    print("-------------------")
            except Exception as e:
                pass
