import type { ReactNode } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
}

// Regex-based Python syntax highlighter
function tokenize(code: string): ReactNode[] {
  const patterns: [RegExp, string][] = [
    // Comments
    [/#[^\n]*/, 'token-comment'],
    // Triple-quoted strings
    [/"""[\s\S]*?"""|'''[\s\S]*?'''/, 'token-string'],
    // Strings (double and single quotes)
    [/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, 'token-string'],
    // Decorators
    [/@\w+/, 'token-decorator'],
    // Numbers
    [/\b\d+\.?\d*\b/, 'token-number'],
    // Keywords
    [/\b(?:def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|raise|with|yield|lambda|pass|break|continue|and|or|not|in|is|global|nonlocal|assert|del|async|await)\b/, 'token-keyword'],
    // Booleans & None
    [/\b(?:True|False|None)\b/, 'token-boolean'],
    // Builtins
    [/\b(?:print|len|range|int|str|float|list|dict|set|tuple|type|input|open|sorted|enumerate|zip|map|filter|sum|min|max|abs|round|isinstance|hasattr|getattr|setattr|super|property|staticmethod|classmethod)\b/, 'token-builtin'],
    // Function/method calls (name followed by parenthesis)
    [/\b[a-zA-Z_]\w*(?=\s*\()/, 'token-function'],
    // Class names (capitalized words not already matched)
    [/\b[A-Z][a-zA-Z0-9_]*\b/, 'token-class'],
  ]

  const result: ReactNode[] = []
  let remaining = code
  let key = 0

  while (remaining.length > 0) {
    let earliest: { index: number; match: string; cls: string } | null = null

    for (const [pattern, cls] of patterns) {
      const m = remaining.match(pattern)
      if (m && m.index !== undefined) {
        if (!earliest || m.index < earliest.index) {
          earliest = { index: m.index, match: m[0], cls }
        }
      }
    }

    if (!earliest || earliest.index > 0) {
      const plain = remaining.slice(0, earliest?.index ?? remaining.length)
      result.push(plain)
      remaining = remaining.slice(plain.length)
    }

    if (earliest) {
      result.push(
        <span key={key++} className={earliest.cls}>{earliest.match}</span>
      )
      remaining = remaining.slice(earliest.match.length)
    }
  }

  return result
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const trimmed = code.replace(/^\n+|\n+$/g, '')
  const highlighted = tokenize(trimmed)

  return (
    <div className="code-block-wrapper">
      {language && (
        <div className="code-block-header">
          <span>{language}</span>
        </div>
      )}
      <pre className="code-block">
        <code>{highlighted}</code>
      </pre>
    </div>
  )
}
