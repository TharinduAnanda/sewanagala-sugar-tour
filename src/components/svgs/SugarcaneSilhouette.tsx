export default function SugarcaneSilhouette({ className = "" }: { className?: string }) {
  // Pre-calculated values to avoid hydration mismatch
  const stalks = [
    { height: 250, opacity: 0.8 },
    { height: 280, opacity: 0.9 },
    { height: 230, opacity: 0.7 },
    { height: 290, opacity: 0.95 },
    { height: 240, opacity: 0.75 },
    { height: 270, opacity: 0.85 },
    { height: 260, opacity: 0.8 },
    { height: 285, opacity: 0.9 },
    { height: 245, opacity: 0.75 },
    { height: 275, opacity: 0.85 },
    { height: 255, opacity: 0.8 },
    { height: 265, opacity: 0.82 },
    { height: 250, opacity: 0.78 },
    { height: 280, opacity: 0.88 },
    { height: 270, opacity: 0.85 }
  ]

  return (
    <svg 
      viewBox="0 0 800 400" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sugarcane stalks - scattered pattern */}
      {stalks.map((stalk, i) => {
        const x = 50 + i * 50
        const height = stalk.height
        const sway = i % 3
        return (
          <g key={i}>
            {/* Stalk */}
            <rect 
              x={x} 
              y={400 - height} 
              width="8" 
              height={height}
              opacity={stalk.opacity}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`0 ${x + 4} 400;${sway * 2} ${x + 4} 400;0 ${x + 4} 400`}
                dur={`${3 + sway}s`}
                repeatCount="indefinite"
              />
            </rect>
            
            {/* Leaves */}
            <ellipse 
              cx={x + 4} 
              cy={400 - height + 30} 
              rx="25" 
              ry="8" 
              opacity="0.5"
              transform={`rotate(-45 ${x + 4} ${400 - height + 30})`}
            />
            <ellipse 
              cx={x + 4} 
              cy={400 - height + 50} 
              rx="25" 
              ry="8" 
              opacity="0.5"
              transform={`rotate(45 ${x + 4} ${400 - height + 50})`}
            />
            <ellipse 
              cx={x + 4} 
              cy={400 - height + 70} 
              rx="20" 
              ry="7" 
              opacity="0.5"
              transform={`rotate(-30 ${x + 4} ${400 - height + 70})`}
            />
          </g>
        )
      })}
      
      {/* Ground */}
      <rect x="0" y="390" width="800" height="10" opacity="0.3" />
    </svg>
  )
}
