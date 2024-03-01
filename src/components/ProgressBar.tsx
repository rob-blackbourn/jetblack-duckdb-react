export interface ProgressBarProps {
  color: string
  progress: number
  height: number | string
}

export default function ProgressBar({
  color,
  progress,
  height
}: ProgressBarProps) {
  return (
    <div
      style={{
        height: height,
        width: '90%%',
        backgroundColor: 'whitesmoke',
        borderRadius: 40,
        margin: 50
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: color,
          borderRadius: 40,
          textAlign: 'right'
        }}
      >
        <span
          style={{ padding: 10, color: 'black', fontWeight: 900 }}
        >{`${progress}%`}</span>
      </div>
    </div>
  )
}
