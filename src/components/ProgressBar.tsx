interface ProgressBarProps {
  completed: number
  total: number
  color?: string
}

export function ProgressBar({ completed, total, color }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{
          width: `${pct}%`,
          ...(color ? { background: color } : {}),
        }}
      />
    </div>
  )
}
