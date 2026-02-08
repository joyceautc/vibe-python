import type { ReactNode } from 'react'
import { CodeBlock } from './CodeBlock'

interface ContentRendererProps {
  content: string
}

export function ContentRenderer({ content }: ContentRendererProps) {
  const elements = parseContent(content)
  return <div className="section-body">{elements}</div>
}

function parseContent(content: string): ReactNode[] {
  const result: ReactNode[] = []
  let key = 0

  // Split by code fences first
  const parts = content.split(/(```[\s\S]*?```)/g)

  for (const part of parts) {
    // Code fence block
    const codeMatch = part.match(/^```(\w*)\n?([\s\S]*?)```$/)
    if (codeMatch) {
      const lang = codeMatch[1] || undefined
      const code = codeMatch[2]
      result.push(<CodeBlock key={key++} code={code} language={lang} />)
      continue
    }

    // Process non-code text
    const lines = part.split('\n')
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // Blank line — skip
      if (line.trim() === '') {
        i++
        continue
      }

      // Warning callout: ⚠️ lines
      if (line.trim().startsWith('⚠️') || line.trim().startsWith('⚠')) {
        result.push(
          <div key={key++} className="callout-warning">
            {renderInline(line.trim())}
          </div>
        )
        i++
        continue
      }

      // Blockquote: > lines
      if (line.trim().startsWith('> ')) {
        const quoteLines: string[] = []
        while (i < lines.length && lines[i].trim().startsWith('> ')) {
          quoteLines.push(lines[i].trim().slice(2))
          i++
        }
        result.push(
          <blockquote key={key++}>
            {renderInline(quoteLines.join('\n'))}
          </blockquote>
        )
        continue
      }

      // Unordered list: - or * at start
      if (/^\s*[-*•]\s+/.test(line)) {
        const items: string[] = []
        while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*[-*•]\s+/, ''))
          i++
        }
        result.push(
          <ul key={key++}>
            {items.map((item, idx) => (
              <li key={idx}>{renderInline(item)}</li>
            ))}
          </ul>
        )
        continue
      }

      // Ordered list: 1. 2. etc
      if (/^\s*\d+[.、]\s+/.test(line)) {
        const items: string[] = []
        while (i < lines.length && /^\s*\d+[.、]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*\d+[.、]\s+/, ''))
          i++
        }
        result.push(
          <ol key={key++}>
            {items.map((item, idx) => (
              <li key={idx}>{renderInline(item)}</li>
            ))}
          </ol>
        )
        continue
      }

      // Regular paragraph — collect until blank line or special line
      const paraLines: string[] = []
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].trim().startsWith('> ') &&
        !lines[i].trim().startsWith('⚠') &&
        !/^\s*[-*•]\s+/.test(lines[i]) &&
        !/^\s*\d+[.、]\s+/.test(lines[i]) &&
        !lines[i].trim().startsWith('```')
      ) {
        paraLines.push(lines[i])
        i++
      }

      if (paraLines.length > 0) {
        result.push(
          <p key={key++}>{renderInline(paraLines.join('\n'))}</p>
        )
      }
    }
  }

  return result
}

function renderInline(text: string): ReactNode {
  // Process inline formatting: **bold**, `code`, and regular text
  const parts: ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Find earliest inline pattern
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    const codeMatch = remaining.match(/`([^`]+)`/)

    let earliest: { index: number; length: number; node: ReactNode } | null = null

    if (boldMatch && boldMatch.index !== undefined) {
      earliest = {
        index: boldMatch.index,
        length: boldMatch[0].length,
        node: <strong key={`b${key++}`}>{boldMatch[1]}</strong>,
      }
    }

    if (codeMatch && codeMatch.index !== undefined) {
      if (!earliest || codeMatch.index < earliest.index) {
        earliest = {
          index: codeMatch.index,
          length: codeMatch[0].length,
          node: <code key={`c${key++}`}>{codeMatch[1]}</code>,
        }
      }
    }

    if (earliest) {
      if (earliest.index > 0) {
        parts.push(remaining.slice(0, earliest.index))
      }
      parts.push(earliest.node)
      remaining = remaining.slice(earliest.index + earliest.length)
    } else {
      parts.push(remaining)
      break
    }
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>
}
