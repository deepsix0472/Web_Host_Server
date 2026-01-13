#!/usr/bin/env python3
"""
AI Auto-Fix Script for Jenkins Pipeline
Uses Claude API to automatically fix lint errors, type errors, and security issues.

Requirements:
    pip install anthropic

Usage:
    export ANTHROPIC_API_KEY="your-api-key"
    python3 scripts/ai-autofix.py lint-errors.txt
    python3 scripts/ai-autofix.py --type semgrep semgrep-results.json
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("Error: anthropic package not installed. Run: pip install anthropic")
    sys.exit(1)


def read_file(filepath: str) -> str:
    """Read file contents."""
    with open(filepath, 'r') as f:
        return f.read()


def write_file(filepath: str, content: str) -> None:
    """Write content to file."""
    with open(filepath, 'w') as f:
        f.write(content)


def get_file_context(filepath: str, line_number: int, context_lines: int = 10) -> str:
    """Get file content around a specific line."""
    try:
        with open(filepath, 'r') as f:
            lines = f.readlines()
        
        start = max(0, line_number - context_lines - 1)
        end = min(len(lines), line_number + context_lines)
        
        result = []
        for i, line in enumerate(lines[start:end], start=start + 1):
            marker = ">>> " if i == line_number else "    "
            result.append(f"{marker}{i}: {line.rstrip()}")
        
        return '\n'.join(result)
    except Exception as e:
        return f"Could not read file: {e}"


def parse_eslint_output(output: str) -> list:
    """Parse ESLint output and extract errors."""
    errors = []
    current_file = None
    
    for line in output.split('\n'):
        line = line.strip()
        if not line:
            continue
        
        # File path line
        if line.startswith('/') and not line.startswith('  '):
            current_file = line
            continue
        
        # Error line format: "  line:col  error  message  rule-name"
        if current_file and ':' in line and ('error' in line or 'warning' in line):
            parts = line.split()
            if len(parts) >= 4:
                location = parts[0]
                if ':' in location:
                    line_num, col = location.split(':')
                    errors.append({
                        'file': current_file,
                        'line': int(line_num),
                        'column': int(col),
                        'severity': parts[1],
                        'message': ' '.join(parts[2:-1]),
                        'rule': parts[-1]
                    })
    
    return errors


def parse_typescript_output(output: str) -> list:
    """Parse TypeScript compiler output."""
    errors = []
    
    for line in output.split('\n'):
        # Format: "src/file.ts(10,5): error TS2322: message"
        if ': error TS' in line:
            try:
                path_part, rest = line.split(': error ')
                file_match = path_part.rsplit('(', 1)
                if len(file_match) == 2:
                    filepath = file_match[0]
                    location = file_match[1].rstrip(')')
                    line_num, col = location.split(',')
                    errors.append({
                        'file': filepath,
                        'line': int(line_num),
                        'column': int(col),
                        'message': rest,
                        'type': 'typescript'
                    })
            except Exception:
                continue
    
    return errors


def parse_semgrep_output(json_file: str) -> list:
    """Parse Semgrep JSON output."""
    errors = []
    
    try:
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        for result in data.get('results', []):
            errors.append({
                'file': result['path'],
                'line': result['start']['line'],
                'end_line': result['end']['line'],
                'message': result['extra']['message'],
                'rule': result['check_id'],
                'severity': result['extra'].get('severity', 'warning'),
                'fix': result['extra'].get('fix', None)
            })
    except Exception as e:
        print(f"Error parsing Semgrep output: {e}")
    
    return errors


def call_claude_for_fix(client: anthropic.Anthropic, error: dict, file_content: str, file_context: str) -> str | None:
    """Call Claude API to get a fix for the error."""
    
    prompt = f"""You are a code fixing assistant. Fix the following error in the code.

ERROR DETAILS:
- File: {error['file']}
- Line: {error['line']}
- Message: {error['message']}
- Rule/Type: {error.get('rule', error.get('type', 'unknown'))}

CODE CONTEXT (line {error['line']} marked with >>>):
{file_context}

FULL FILE CONTENT:
```
{file_content}
```

INSTRUCTIONS:
1. Analyze the error and understand what needs to be fixed
2. Return ONLY the complete fixed file content
3. Do not include any explanation, just the fixed code
4. Maintain all existing functionality
5. Do not change anything unrelated to the error

Return the complete fixed file content:"""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8192,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        response = message.content[0].text
        
        # Clean up response if it has code blocks
        if response.startswith('```'):
            lines = response.split('\n')
            # Remove first line (```language) and last line (```)
            lines = lines[1:]
            if lines and lines[-1].strip() == '```':
                lines = lines[:-1]
            response = '\n'.join(lines)
        
        return response
    
    except Exception as e:
        print(f"Error calling Claude API: {e}")
        return None


def fix_errors(errors: list, dry_run: bool = False) -> tuple[int, int]:
    """Attempt to fix all errors using Claude."""
    
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set")
        sys.exit(1)
    
    client = anthropic.Anthropic(api_key=api_key)
    
    fixed_count = 0
    failed_count = 0
    
    # Group errors by file to avoid multiple writes
    files_to_fix = {}
    for error in errors:
        filepath = error['file']
        if filepath not in files_to_fix:
            files_to_fix[filepath] = []
        files_to_fix[filepath].append(error)
    
    for filepath, file_errors in files_to_fix.items():
        print(f"\n{'='*60}")
        print(f"Processing: {filepath}")
        print(f"Errors to fix: {len(file_errors)}")
        print('='*60)
        
        if not os.path.exists(filepath):
            print(f"  ⚠ File not found, skipping")
            failed_count += len(file_errors)
            continue
        
        current_content = read_file(filepath)
        
        # Fix errors one at a time (could be optimized to batch)
        for error in file_errors:
            print(f"\n  Fixing: Line {error['line']} - {error['message'][:60]}...")
            
            file_context = get_file_context(filepath, error['line'])
            fixed_content = call_claude_for_fix(client, error, current_content, file_context)
            
            if fixed_content and fixed_content.strip() != current_content.strip():
                if dry_run:
                    print(f"  ✓ Fix generated (dry run, not applied)")
                    fixed_count += 1
                else:
                    write_file(filepath, fixed_content)
                    current_content = fixed_content  # Update for next error
                    print(f"  ✓ Fix applied")
                    fixed_count += 1
            else:
                print(f"  ✗ Could not generate fix")
                failed_count += 1
    
    return fixed_count, failed_count


def main():
    parser = argparse.ArgumentParser(description='AI-powered code auto-fix using Claude')
    parser.add_argument('input_file', help='Error output file to parse')
    parser.add_argument('--type', choices=['eslint', 'typescript', 'semgrep'], 
                        default='eslint', help='Type of error output')
    parser.add_argument('--dry-run', action='store_true',
                        help='Generate fixes but do not apply them')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.input_file):
        print(f"Error: Input file not found: {args.input_file}")
        sys.exit(1)
    
    print(f"AI Auto-Fix Script")
    print(f"Input: {args.input_file}")
    print(f"Type: {args.type}")
    print(f"Mode: {'Dry Run' if args.dry_run else 'Apply Fixes'}")
    
    # Parse errors based on type
    if args.type == 'eslint':
        content = read_file(args.input_file)
        errors = parse_eslint_output(content)
    elif args.type == 'typescript':
        content = read_file(args.input_file)
        errors = parse_typescript_output(content)
    elif args.type == 'semgrep':
        errors = parse_semgrep_output(args.input_file)
    
    if not errors:
        print("\nNo errors found to fix!")
        sys.exit(0)
    
    print(f"\nFound {len(errors)} error(s) to fix")
    
    # Attempt fixes
    fixed, failed = fix_errors(errors, dry_run=args.dry_run)
    
    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"  Fixed: {fixed}")
    print(f"  Failed: {failed}")
    print(f"{'='*60}")
    
    # Exit with error if any fixes failed
    sys.exit(0 if failed == 0 else 1)


if __name__ == '__main__':
    main()
