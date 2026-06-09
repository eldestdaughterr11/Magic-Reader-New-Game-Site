import os
folder = r"C:\Users\tipid\.gemini\antigravity\brain\08f30127-b483-4fd3-b81d-63eebcc1d189\.system_generated\logs"
if os.path.exists(folder):
    print(os.listdir(folder))
else:
    print("Folder does not exist")
