#!/usr/bin/env python3
"""Comprehensive code audit for manifestation-island click issues."""

import os
import re
import json

PROJECT = r"C:\Users\Administrator\Documents\kimi\manifestation-island"
os.chdir(PROJECT)

# Read files with proper CR handling
with open('app.js', 'rb') as f:
    app_raw = f.read()
    
# Handle CR line endings - replace \r with \n for analysis
if b'\r' in app_raw and b'\n' not in app_raw:
    app_content = app_raw.replace(b'\r', b'\n').decode('utf-8', errors='replace')
elif b'\r\n' in app_raw:
    app_content = app_raw.decode('utf-8', errors='replace').replace('\r\n', '\n')
else:
    app_content = app_raw.decode('utf-8', errors='replace')

with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    html_content = f.read()

print("=" * 60)
print("1. SCRIPT LOADING ORDER ANALYSIS")
print("=" * 60)

script_order = []
for m in re.finditer(r'<script([^>]*)>(.*?)</script>', html_content, re.DOTALL):
    attrs = m.group(1)
    body = m.group(2).strip()
    src_match = re.search(r'src=["\']([^"\']+)["\']', attrs)
    type_match = re.search(r'type=["\']([^"\']+)["\']', attrs)
    src = src_match.group(1) if src_match else '(inline)'
    typ = type_match.group(1) if type_match else 'text/javascript'
    script_order.append({'src': src, 'type': typ, 'inline_len': len(body)})

for i, s in enumerate(script_order):
    marker = ""
    if 'app.js' in s['src']:
        marker = " <-- ES MODULE"
    elif s['src'].startswith('data/'):
        marker = " <-- data file"
    elif s['src'].startswith('js/'):
        marker = " <-- loaded AFTER app.js"
    print(f"  {i+1}. [{s['type']}] {s['src']} {marker}")

# Check data files before/after app.js
app_idx = next((i for i, s in enumerate(script_order) if 'app.js' in s['src']), -1)
data_after_app = [s['src'] for s in script_order[app_idx+1:] if s['src'].startswith('data/')]
data_before_app = [s['src'] for s in script_order[:app_idx] if s['src'].startswith('data/')]
print(f"\n  Data files BEFORE app.js: {len(data_before_app)}")
print(f"  Data files AFTER app.js: {len(data_after_app)}")
if data_after_app:
    print(f"  WARNING: Data files after app.js: {data_after_app}")

print("\n" + "=" * 60)
print("2. INLINE EVENT HANDLERS IN HTML (onclick, onchange, etc.)")
print("=" * 60)

# Find all inline event handlers
event_handlers = []
for m in re.finditer(r'\s(onclick|onchange|onsubmit|oninput|onkeydown|onkeyup|onload|onerror)\s*=\s*"([^"]*)"', html_content):
    event_handlers.append((m.group(1), m.group(2), html_content[max(0, m.start()-50):m.start()+len(m.group(0))+20]))
for m in re.finditer(r"\s(onclick|onchange|onsubmit|oninput|onkeydown|onkeyup|onload|onerror)\s*=\s*'([^']*)'", html_content):
    event_handlers.append((m.group(1), m.group(2), html_content[max(0, m.start()-50):m.start()+len(m.group(0))+20]))

print(f"  Total inline event handlers: {len(event_handlers)}")

# Extract function names from onclick handlers
onclick_funcs = set()
for evt, code, ctx in event_handlers:
    if evt == 'onclick':
        # Extract function name (e.g., "showPage('home')" -> "showPage")
        func = code.strip().split('(')[0].split('.')[-1].strip()
        if func and not func.startswith('if(') and not func.startswith('event'):
            onclick_funcs.add(func)

print(f"  Unique functions referenced in onclick: {len(onclick_funcs)}")
for f in sorted(onclick_funcs):
    print(f"    - {f}")

print("\n" + "=" * 60)
print("3. FUNCTIONS EXPOSED TO WINDOW IN app.js")
print("=" * 60)

exposed_funcs = set()
for m in re.finditer(r'window\.(\w+)\s*=\s*\w+', app_content):
    exposed_funcs.add(m.group(1))

print(f"  Total functions exposed to window: {len(exposed_funcs)}")
for f in sorted(exposed_funcs):
    print(f"    - {f}")

# Find missing exposures
missing = onclick_funcs - exposed_funcs - {'window', 'document', 'console', 'location', 'history', 'event', 'this'}
# Also filter out common globals and simple expressions
missing = {f for f in missing if re.match(r'^[a-zA-Z_$][a-zA-Z0-9_$]*$', f)}
# Remove known globals
known_globals = {'hideModal', 'goBack', 'switchTab', 'showPage', 'toggleTheme', 'openSettings', 
                 'closeSettings', 'playSound', 'stopSound', 'saveData', 'loadData', 'showToast',
                 'startTimer', 'stopTimer', 'pauseTimer', 'resumeTimer', 'togglePlay',
                 'shareContent', 'copyToClipboard', 'toggleFav', 'rateApp', 'closeModal',
                 'setLanguage', 'toggleMute', 'toggleVibrate', 'toggleNotification',
                 'addToHome', 'showTutorial', 'skipTutorial', 'startTutorial',
                 'scrollToTop', 'scrollToBottom', 'toggleFullscreen', 'printPage',
                 'downloadFile', 'uploadFile', 'previewFile', 'deleteFile',
                 'createFolder', 'renameFile', 'moveFile', 'copyFile', 'pasteFile',
                 'undoAction', 'redoAction', 'cutFile', 'selectAll', 'deselectAll',
                 'invertSelection', 'sortBy', 'filterBy', 'groupBy', 'searchFor',
                 'refreshPage', 'reloadPage', 'goForward', 'goHome', 'goToURL',
                 'bookmarkPage', 'addToReadingList', 'addToFavorites', 'sendFeedback',
                 'reportBug', 'requestFeature', 'contactSupport', 'viewSource',
                 'inspectElement', 'toggleDevTools', 'showConsole', 'clearConsole',
                 'toggleSidebar', 'togglePanel', 'toggleToolbar', 'toggleStatusBar',
                 'toggleMenuBar', 'toggleTabs', 'toggleBookmarks', 'toggleHistory',
                 'toggleDownloads', 'toggleExtensions', 'toggleSettings', 'toggleHelp',
                 'toggleAbout', 'toggleProfile', 'toggleAccount', 'toggleLogin',
                 'toggleSignup', 'toggleLogout', 'toggleRegister', 'toggleForgot',
                 'toggleReset', 'toggleVerify', 'toggleConfirm', 'toggleCancel',
                 'toggleSubmit', 'toggleApply', 'toggleSave', 'toggleLoad',
                 'toggleNew', 'toggleOpen', 'toggleClose', 'toggleEdit',
                 'toggleView', 'toggleInsert', 'toggleFormat', 'toggleTools',
                 'toggleTable', 'toggleImage', 'toggleLink', 'toggleMedia',
                 'toggleCode', 'toggleQuote', 'toggleList', 'toggleAlign',
                 'toggleIndent', 'toggleOutdent', 'toggleUndo', 'toggleRedo',
                 'toggleCut', 'toggleCopy', 'togglePaste', 'toggleDelete',
                 'toggleFind', 'toggleReplace', 'toggleGoto', 'toggleSelect',
                 'toggleZoom', 'toggleRotate', 'toggleFlip', 'toggleCrop',
                 'toggleResize', 'toggleMove', 'toggleDraw', 'toggleErase',
                 'toggleFill', 'toggleStroke', 'toggleText', 'toggleShape'}
missing = missing - known_globals

if missing:
    print(f"\n  POTENTIALLY MISSING window exposures ({len(missing)}):")
    for f in sorted(missing):
        print(f"    !! {f}")
else:
    print("\n  All referenced onclick functions appear to be exposed (or are known globals).")

print("\n" + "=" * 60)
print("4. CSS POINTER-EVENTS & OVERLAY ANALYSIS")
print("=" * 60)

# Check for pointer-events: none or overlay layers in critical CSS
if 'pointer-events' in html_content:
    print("  'pointer-events' found in HTML/CSS")
    for m in re.finditer(r'pointer-events\s*:\s*([^;\}"\']+)', html_content):
        val = m.group(1).strip()
        ctx = html_content[max(0, m.start()-100):m.start()+len(m.group(0))+50]
        print(f"    Value: '{val}' near: ...{ctx[-80:]}...")
else:
    print("  No 'pointer-events' found in HTML")

# Check for modal backdrop / overlay
modal_patterns = ['modal-backdrop', 'modal-overlay', 'overlay', 'backdrop', 'mask']
for pat in modal_patterns:
    count = html_content.count(pat)
    if count > 0:
        print(f"  Found '{pat}': {count} occurrences")

print("\n" + "=" * 60)
print("5. DOMContentLoaded / INIT PATTERNS")
print("=" * 60)

if 'DOMContentLoaded' in app_content:
    print("  'DOMContentLoaded' found in app.js")
    for m in re.finditer(r'.{0,60}DOMContentLoaded.{0,60}', app_content):
        line = m.group(0).replace('\n', ' ')
        print(f"    {line[:120]}...")
else:
    print("  'DOMContentLoaded' NOT found in app.js!")

if 'document.addEventListener' in app_content:
    print("  'document.addEventListener' found in app.js")
else:
    print("  'document.addEventListener' NOT found in app.js!")

# Check for init function
init_patterns = ['function init(', 'const init ', 'let init ', 'var init ', 'init()']
for pat in init_patterns:
    if pat in app_content:
        print(f"  Found '{pat}' in app.js")
        break
else:
    print("  No obvious init() pattern found in app.js")

print("\n" + "=" * 60)
print("6. TRY-CATCH SILENT ERROR SWALLOWING")
print("=" * 60)

# Find try blocks that might swallow errors
try_catches = []
for m in re.finditer(r'try\s*\{[\s\S]*?\}\s*catch\s*\(\s*\w*\s*\)\s*\{[\s\S]*?\}', app_content):
    catch_block = m.group(0)
    # Check if catch block is empty or just has console/empty
    catch_inner = re.search(r'catch\s*\([^)]*\)\s*\{([\s\S]*?)\}', catch_block)
    if catch_inner:
        inner = catch_inner.group(1).strip()
        if not inner or inner in ['{}', ''] or inner.startswith('//') or 'console.' in inner or len(inner) < 30:
            # Get line context
            start = max(0, m.start() - 50)
            ctx = app_content[start:m.start() + 200].replace('\n', ' ')
            try_catches.append((len(inner), ctx[:150]))

print(f"  Potentially silent try-catch blocks: {len(try_catches)}")
for length, ctx in try_catches[:10]:
    print(f"    (catch body {length} chars) ...{ctx}...")

print("\n" + "=" * 60)
print("7. LOCALSTORAGE ACCESS PATTERNS")
print("=" * 60)

ls_patterns = ['localStorage.getItem', 'localStorage.setItem', 'localStorage.removeItem', 'localStorage.clear']
for pat in ls_patterns:
    count = app_content.count(pat)
    print(f"  '{pat}': {count} occurrences")

# Check for try-catch around localStorage
ls_in_try = re.findall(r'try\s*\{[^}]*localStorage[\s\S]*?\}\s*catch', app_content)
print(f"  localStorage inside try-catch: {len(ls_in_try)}")

print("\n" + "=" * 60)
print("8. INNERHTML / INSERTADJACENTHTML WITH ONCLICK")
print("=" * 60)

# Find innerHTML assignments
innerhtml_assigns = []
for m in re.finditer(r'\.innerHTML\s*=\s*[`"\']([^`"\']{0,500})[`"\']', app_content):
    val = m.group(1)
    if 'onclick' in val:
        innerhtml_assigns.append(val[:200])

print(f"  innerHTML assignments containing 'onclick': {len(innerhtml_assigns)}")
for i, val in enumerate(innerhtml_assigns[:5]):
    print(f"    Example {i+1}: {val[:120]}...")

# Check insertAdjacentHTML
iahtml = []
for m in re.finditer(r'\.insertAdjacentHTML\s*\([^)]*\)', app_content):
    ctx = app_content[max(0, m.start()-100):m.start()+200]
    if 'onclick' in ctx:
        iahtml.append(ctx[:200])
print(f"  insertAdjacentHTML calls with onclick: {len(iahtml)}")

print("\n" + "=" * 60)
print("9. SERVICE WORKER & CACHING")
print("=" * 60)

if 'serviceWorker' in html_content:
    print("  Service Worker registration found in HTML")
    for m in re.finditer(r'.{0,80}serviceWorker.{0,80}', html_content, re.IGNORECASE):
        line = m.group(0).replace('\n', ' ')
        print(f"    {line[:120]}")
else:
    print("  No Service Worker registration in HTML")

if os.path.exists('sw.js'):
    with open('sw.js', 'r') as f:
        sw_content = f.read()
    print(f"  sw.js exists ({len(sw_content)} chars)")
    if 'Cache' in sw_content or 'cache' in sw_content:
        print("  WARNING: Service Worker uses caching - old versions may persist")
else:
    print("  sw.js not found")

print("\n" + "=" * 60)
print("10. ADDEVENTLISTENER PATTERNS")
print("=" * 60)

# Find addEventListener calls
ael_calls = []
for m in re.finditer(r'([a-zA-Z0-9_$.)]+)\.addEventListener\s*\(\s*["\']([^"\']+)["\']', app_content):
    target = m.group(1)
    event = m.group(2)
    ael_calls.append((target, event))

print(f"  Total addEventListener calls: {len(ael_calls)}")
from collections import Counter
target_counter = Counter(t for t, e in ael_calls)
event_counter = Counter(e for t, e in ael_calls)
print("  By target:")
for t, c in target_counter.most_common(10):
    print(f"    {t}: {c}")
print("  By event type:")
for e, c in event_counter.most_common(10):
    print(f"    {e}: {c}")

# Check for event delegation
delegation_patterns = ['event.target', 'e.target', 'ev.target', 'closest(', 'matches(']
print("\n  Event delegation indicators:")
for pat in delegation_patterns:
    count = app_content.count(pat)
    print(f"    '{pat}': {count} occurrences")

print("\n" + "=" * 60)
print("11. MODULE-LEVEL EXECUTION (top-level code in app.js)")
print("=" * 60)

# Check if app.js has top-level code that might fail
# Count lines to get a sense of structure
lines = app_content.split('\n')
print(f"  Total lines in app.js (after CR normalization): {len(lines)}")

# Check first few lines for immediate execution
first_code = '\n'.join(lines[:30])
immediate_patterns = ['document.querySelector', 'document.getElementById', 'window.addEventListener']
for pat in immediate_patterns:
    if pat in first_code:
        print(f"  WARNING: '{pat}' found in first 30 lines - potential race condition if DOM not ready")

print("\n" + "=" * 60)
print("12. CONTENT SECURITY POLICY CHECK")
print("=" * 60)

csp_match = re.search(r'content-security-policy"?\s+content="([^"]+)"', html_content, re.IGNORECASE)
if csp_match:
    csp = csp_match.group(1)
    print(f"  CSP found: {csp[:200]}...")
    if "'unsafe-inline'" not in csp.lower():
        print("  WARNING: CSP does not include 'unsafe-inline' for scripts - inline handlers may be blocked!")
    if "'unsafe-eval'" not in csp.lower():
        print("  NOTE: CSP does not include 'unsafe-eval'")
else:
    print("  No CSP meta tag found")

print("\n" + "=" * 60)
print("AUDIT COMPLETE")
print("=" * 60)
