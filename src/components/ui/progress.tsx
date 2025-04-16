import * as React from "react"

interface ProgressProps {
  value: number
  className?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, className }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
      >
        <div
          className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress } 