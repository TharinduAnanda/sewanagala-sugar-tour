// Simple gears pattern for About/Factory section
export default function GearsSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 1200 800" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Large gear */}
      <circle cx="300" cy="400" r="150" opacity="0.03" />
      <circle cx="300" cy="400" r="100" opacity="0.05" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * Math.PI / 180
        const x1 = 300 + Math.cos(angle) * 100
        const y1 = 400 + Math.sin(angle) * 100
        const x2 = 300 + Math.cos(angle) * 150
        const y2 = 400 + Math.sin(angle) * 150
        return (
          <rect
            key={i}
            x={x1}
            y={y1 - 10}
            width={Math.round(Math.sqrt((x2-x1)**2 + (y2-y1)**2))}
            height="20"
            transform={`rotate(${i * 30} ${x1} ${y1})`}
            opacity="0.04"
          />
        )
      })}
      
      {/* Medium gear */}
      <circle cx="700" cy="300" r="120" opacity="0.03" />
      <circle cx="700" cy="300" r="80" opacity="0.05" />
      {[...Array(10)].map((_, i) => {
        const angle = (i * 36) * Math.PI / 180
        const x1 = 700 + Math.cos(angle) * 80
        const y1 = 300 + Math.sin(angle) * 80
        const x2 = 700 + Math.cos(angle) * 120
        const y2 = 300 + Math.sin(angle) * 120
        return (
          <rect
            key={i}
            x={x1}
            y={y1 - 8}
            width={Math.round(Math.sqrt((x2-x1)**2 + (y2-y1)**2))}
            height="16"
            transform={`rotate(${i * 36} ${x1} ${y1})`}
            opacity="0.04"
          />
        )
      })}

      {/* Small gear */}
      <circle cx="950" cy="550" r="90" opacity="0.03" />
      <circle cx="950" cy="550" r="60" opacity="0.05" />
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) * Math.PI / 180
        const x1 = 950 + Math.cos(angle) * 60
        const y1 = 550 + Math.sin(angle) * 60
        const x2 = 950 + Math.cos(angle) * 90
        const y2 = 550 + Math.sin(angle) * 90
        return (
          <rect
            key={i}
            x={x1}
            y={y1 - 7}
            width={Math.round(Math.sqrt((x2-x1)**2 + (y2-y1)**2))}
            height="14"
            transform={`rotate(${i * 45} ${x1} ${y1})`}
            opacity="0.04"
          />
        )
      })}
    </svg>
  )
}
