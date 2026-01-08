export default function FactorySilhouette({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 1200 400" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main factory building */}
      <rect x="50" y="150" width="200" height="250" />
      
      {/* Tall chimney 1 */}
      <rect x="100" y="50" width="40" height="100" />
      <ellipse cx="120" cy="50" rx="25" ry="8" />
      
      {/* Smoke from chimney 1 */}
      <circle cx="120" cy="30" r="15" opacity="0.3">
        <animate attributeName="cy" values="30;10;30" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="110" cy="25" r="12" opacity="0.2">
        <animate attributeName="cy" values="25;5;25" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="3.5s" repeatCount="indefinite" />
      </circle>
      
      {/* Secondary building */}
      <rect x="260" y="180" width="180" height="220" />
      
      {/* Tall chimney 2 */}
      <rect x="320" y="80" width="35" height="100" />
      <ellipse cx="337.5" cy="80" rx="22" ry="7" />
      
      {/* Smoke from chimney 2 */}
      <circle cx="337" cy="60" r="13" opacity="0.3">
        <animate attributeName="cy" values="60;40;60" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2.8s" repeatCount="indefinite" />
      </circle>
      
      {/* Storage silos */}
      <rect x="450" y="200" width="80" height="200" rx="40" />
      <ellipse cx="490" cy="200" rx="40" ry="10" />
      
      <rect x="540" y="220" width="70" height="180" rx="35" />
      <ellipse cx="575" cy="220" rx="35" ry="8" />
      
      {/* Low building */}
      <rect x="620" y="250" width="150" height="150" />
      <polygon points="620,250 695,200 770,250" />
      
      {/* Industrial tank */}
      <rect x="780" y="220" width="100" height="180" rx="50" />
      <ellipse cx="830" cy="220" rx="50" ry="12" />
      <line x1="780" y1="260" x2="880" y2="260" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="780" y1="300" x2="880" y2="300" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      
      {/* Loading area */}
      <rect x="890" y="280" width="120" height="120" />
      <rect x="920" y="270" width="60" height="10" />
      
      {/* Conveyor belt structure */}
      <rect x="1020" y="300" width="150" height="100" />
      <polygon points="1020,300 1095,250 1170,300" />
      
      {/* Small details - windows */}
      <rect x="70" y="180" width="25" height="35" fill="rgba(255,255,255,0.2)" />
      <rect x="110" y="180" width="25" height="35" fill="rgba(255,255,255,0.2)" />
      <rect x="150" y="180" width="25" height="35" fill="rgba(255,255,255,0.2)" />
      <rect x="190" y="180" width="25" height="35" fill="rgba(255,255,255,0.2)" />
      
      <rect x="280" y="210" width="20" height="30" fill="rgba(255,255,255,0.2)" />
      <rect x="315" y="210" width="20" height="30" fill="rgba(255,255,255,0.2)" />
      <rect x="350" y="210" width="20" height="30" fill="rgba(255,255,255,0.2)" />
      <rect x="385" y="210" width="20" height="30" fill="rgba(255,255,255,0.2)" />
      
      {/* Ground line */}
      <line x1="0" y1="400" x2="1200" y2="400" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}
