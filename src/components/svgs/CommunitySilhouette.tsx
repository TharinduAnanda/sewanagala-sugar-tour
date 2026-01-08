// Simple people/community pattern
export default function CommunitySilhouette({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 1200 800" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Simple people silhouettes */}
      {[
        {x: 200, y: 400, scale: 1},
        {x: 350, y: 420, scale: 0.9},
        {x: 500, y: 390, scale: 1.1},
        {x: 650, y: 410, scale: 0.95},
        {x: 800, y: 400, scale: 1},
        {x: 950, y: 420, scale: 0.9}
      ].map((person, i) => (
        <g key={i} transform={`translate(${person.x}, ${person.y}) scale(${person.scale})`}>
          {/* Head */}
          <circle cx="0" cy="-60" r="25" opacity="0.04" />
          {/* Body */}
          <rect x="-20" y="-35" width="40" height="60" rx="20" opacity="0.04" />
          {/* Arms */}
          <rect x="-35" y="-25" width="70" height="12" rx="6" opacity="0.04" />
          {/* Legs */}
          <rect x="-15" y="25" width="12" height="40" rx="6" opacity="0.04" />
          <rect x="3" y="25" width="12" height="40" rx="6" opacity="0.04" />
        </g>
      ))}
      
      {/* Heart symbols */}
      <path d="M 250 200 C 250 185, 235 175, 225 175 C 215 175, 205 185, 205 200 C 205 185, 190 175, 180 175 C 170 175, 155 185, 155 200 C 155 235, 205 265, 205 265 C 205 265, 250 235, 250 200 Z" opacity="0.04" />
      <path d="M 1050 250 C 1050 235, 1035 225, 1025 225 C 1015 225, 1005 235, 1005 250 C 1005 235, 990 225, 980 225 C 970 225, 955 235, 955 250 C 955 285, 1005 315, 1005 315 C 1005 315, 1050 285, 1050 250 Z" opacity="0.04" />
      
      {/* Hands joining */}
      <path d="M 400 600 Q 500 550, 600 600" stroke="currentColor" strokeWidth="20" fill="none" opacity="0.04" strokeLinecap="round" />
      <circle cx="400" cy="600" r="30" opacity="0.04" />
      <circle cx="600" cy="600" r="30" opacity="0.04" />
    </svg>
  )
}
