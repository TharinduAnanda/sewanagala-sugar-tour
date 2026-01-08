// Simple CSR/sustainability pattern
export default function CSRSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 1200 800" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Tree/nature symbol */}
      <circle cx="300" cy="450" r="60" opacity="0.04" />
      <circle cx="250" cy="400" r="50" opacity="0.04" />
      <circle cx="350" cy="400" r="50" opacity="0.04" />
      <circle cx="300" cy="350" r="55" opacity="0.04" />
      <rect x="285" y="450" width="30" height="120" rx="15" opacity="0.05" />
      
      {/* Leaves scattered */}
      {[
        {x: 500, y: 300},
        {x: 600, y: 350},
        {x: 700, y: 320},
        {x: 800, y: 380}
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.x}
          cy={leaf.y}
          rx="35"
          ry="20"
          opacity="0.04"
          transform={`rotate(${i * 30} ${leaf.x} ${leaf.y})`}
        />
      ))}
      
      {/* Recycle symbol simplified */}
      <path d="M 900 400 L 950 300 L 1000 400 Z" fill="none" stroke="currentColor" strokeWidth="12" opacity="0.04" />
      <path d="M 1000 400 L 1000 500 L 900 500 Z" fill="none" stroke="currentColor" strokeWidth="12" opacity="0.04" />
      <path d="M 900 500 L 850 400 L 900 400 Z" fill="none" stroke="currentColor" strokeWidth="12" opacity="0.04" />
      
      {/* Water drops */}
      {[
        {x: 200, y: 600},
        {x: 400, y: 650},
        {x: 600, y: 620}
      ].map((drop, i) => (
        <path
          key={i}
          d={`M ${drop.x} ${drop.y} Q ${drop.x - 25} ${drop.y - 40}, ${drop.x} ${drop.y - 60} Q ${drop.x + 25} ${drop.y - 40}, ${drop.x} ${drop.y} Z`}
          opacity="0.04"
        />
      ))}
      
      {/* Earth/globe */}
      <circle cx="1000" cy="650" r="70" opacity="0.04" />
      <path d="M 930 650 Q 1000 620, 1070 650" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.05" />
      <path d="M 930 650 Q 1000 680, 1070 650" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.05" />
      <line x1="1000" y1="580" x2="1000" y2="720" stroke="currentColor" strokeWidth="3" opacity="0.05" />
    </svg>
  )
}
