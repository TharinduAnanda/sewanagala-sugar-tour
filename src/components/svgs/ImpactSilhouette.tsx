// Simple growth/impact pattern
export default function ImpactSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 1200 800" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Growth chart bars */}
      {[
        {x: 200, height: 150},
        {x: 320, height: 200},
        {x: 440, height: 280},
        {x: 560, height: 350},
        {x: 680, height: 420}
      ].map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={600 - bar.height}
          width="80"
          height={bar.height}
          rx="5"
          opacity="0.04"
        />
      ))}
      
      {/* Upward arrow */}
      <path d="M 800 500 L 800 200" stroke="currentColor" strokeWidth="15" opacity="0.05" />
      <polygon points="800,150 850,250 750,250" opacity="0.05" />
      
      {/* Stars/achievements */}
      {[
        {x: 950, y: 200},
        {x: 1050, y: 300},
        {x: 900, y: 400}
      ].map((star, i) => (
        <g key={i}>
          <polygon
            points={`
              ${star.x},${star.y - 40}
              ${star.x + 12},${star.y - 12}
              ${star.x + 40},${star.y - 12}
              ${star.x + 16},${star.y + 8}
              ${star.x + 25},${star.y + 35}
              ${star.x},${star.y + 18}
              ${star.x - 25},${star.y + 35}
              ${star.x - 16},${star.y + 8}
              ${star.x - 40},${star.y - 12}
              ${star.x - 12},${star.y - 12}
            `}
            opacity="0.04"
          />
        </g>
      ))}
      
      {/* Target/goal circles */}
      <circle cx="300" cy="250" r="80" opacity="0.03" />
      <circle cx="300" cy="250" r="60" opacity="0.04" />
      <circle cx="300" cy="250" r="40" opacity="0.05" />
      <circle cx="300" cy="250" r="20" opacity="0.06" />
    </svg>
  )
}
