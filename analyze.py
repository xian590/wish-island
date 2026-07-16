import re, json, sys

def analyze_files():
    issues = []
    
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()
    
    # Find all onclick function calls
    onclick_funcs = set()
    for m in re.finditer(r'onclick="([a-zA-Z_][a-zA-Z0-9_]*)', html):
        onclick_funcs.add(m.group(1))
    
    # Find all function definitions in app.js
    defined_funcs = set()
    for m in re.finditer(r'function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(', js):
        defined_funcs.add(m.group(1))
    for m in re.finditer(r'const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s*)?function\s*\(', js):
        defined_funcs.add(m.group(1))
    for m in re.finditer(r'const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s*)?\(', js):
        defined_funcs.add(m.group(1))
    
    # Find window exports
    window_exports = set()
    for m in re.finditer(r'window\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=', js):
        window_exports.add(m.group(1))
    
    # Check for missing exports
    missing_exports = onclick_funcs - window_exports - defined_funcs
    
    # Check bracket balance in app.js
    open_brackets = js.count('{')
    close_brackets = js.count('}')
    bracket_diff = open_brackets - close_brackets
    
    return {
        'onclick_count': len(onclick_funcs),
        'defined_count': len(defined_funcs),
        'exported_count': len(window_exports),
        'missing_exports': sorted(list(missing_exports)),
        'bracket_open': open_brackets,
        'bracket_close': close_brackets,
        'bracket_diff': bracket_diff,
        'sample_onclick': sorted(list(onclick_funcs))[:20]
    }

if __name__ == '__main__':
    result = analyze_files()
    print(json.dumps(result, ensure_ascii=False, indent=2))
