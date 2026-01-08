// Simple sugar products pattern
export default function ProductsSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 1200 800" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Sugar bags */}
      <rect x="150" y="400" width="120" height="180" rx="5" opacity="0.04" />
      <rect x="160" y="410" width="100" height="20" opacity="0.06" />
      <rect x="160" y="450" width="100" height="15" opacity="0.05" />
      
      <rect x="350" y="420" width="120" height="180" rx="5" opacity="0.04" />
      <rect x="360" y="430" width="100" height="20" opacity="0.06" />
      <rect x="360" y="470" width="100" height="15" opacity="0.05" />
      
      {/* Sugar cubes scattered */}
      {[
        {x: 600, y: 300, size: 60},
        {x: 700, y: 350, size: 50},
        {x: 780, y: 320, size: 55},
        {x: 650, y: 450, size: 50},
        {x: 750, y: 480, size: 60},
        {x: 850, y: 400, size: 50}
      ].map((cube, i) => (
        <rect
          key={i}
          x={cube.x}
          y={cube.y}
          width={cube.size}
          height={cube.size}
          rx="3"
          opacity="0.04"
        />
      ))}
      
      {/* Sugar spoon */}
      <ellipse cx="980" cy="500" rx="50" ry="60" opacity="0.05" />
      <rect x="960" y="500" width="40" height="120" rx="20" opacity="0.04" />
      
      {/* Sugar crystals pattern */}
      {[
        {x: 200, y: 200},
        {x: 400, y: 250},
        {x: 900, y: 250},
        {x: 1050, y: 350}
      ].map((pos, i) => (
        <g key={i}>
          <polygon
            points={`${pos.x},${pos.y} ${pos.x+15},${pos.y+25} ${pos.x},${pos.y+50} ${pos.x-15},${pos.y+25}`}
            opacity="0.03"
          />
        </g>
      ))}
    </svg>
  )
}
