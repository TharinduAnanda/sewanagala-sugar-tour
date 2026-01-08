// Simple timeline pattern for History/Story section
export default function TimelineSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 1200 800" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Horizontal timeline */}
      <line x1="100" y1="400" x2="1100" y2="400" stroke="currentColor" strokeWidth="3" opacity="0.06" />
      
      {/* Timeline markers */}
      {[150, 350, 550, 750, 950].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="400" r="30" opacity="0.05" />
          <circle cx={x} cy="400" r="15" opacity="0.08" />
          {/* Connecting lines */}
          <line x1={x} y1="370" x2={x} y2="280" stroke="currentColor" strokeWidth="2" opacity="0.04" />
          <circle cx={x} cy="280" r="20" opacity="0.04" />
        </g>
      ))}

      {/* Decorative clock elements */}
      <circle cx="200" cy="600" r="80" opacity="0.03" />
      <line x1="200" y1="600" x2="200" y2="540" stroke="currentColor" strokeWidth="3" opacity="0.04" />
      <line x1="200" y1="600" x2="240" y2="630" stroke="currentColor" strokeWidth="2" opacity="0.04" />
      
      <circle cx="1000" cy="200" r="60" opacity="0.03" />
      <line x1="1000" y1="200" x2="1000" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.04" />
      <line x1="1000" y1="200" x2="1030" y2="220" stroke="currentColor" strokeWidth="2" opacity="0.04" />
    </svg>
  )
}
