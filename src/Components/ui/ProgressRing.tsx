export default function ProgressRing({ value, label = `${value} %` }: { value: number; label?: string }) {
  const progress = Math.max(0, Math.min(100, value))
  return <div className="progress-circle" style={{ background: `conic-gradient(var(--color-accent) 0 ${progress}%, #2a6da0 ${progress}% 100%)` }}><strong>{label}</strong></div>
}
