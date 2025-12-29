'use client'

interface FootprintPathProps {
  startX: number
  startY: number
  endX: number
  endY: number
  containerWidth: number
  containerHeight: number
}

export default function FootprintPath({
  startX,
  startY,
  endX,
  endY,
}: FootprintPathProps) {
  // Calculate path
  const dx = endX - startX
  const dy = endY - startY
  const distance = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  // Number of footprints based on distance
  const footprintSpacing = 30
  const numFootprints = Math.floor(distance / footprintSpacing)

  const footprints = []
  for (let i = 0; i <= numFootprints; i++) {
    const progress = i / (numFootprints || 1)
    const x = startX + dx * progress
    const y = startY + dy * progress
    const isLeft = i % 2 === 0
    const offset = isLeft ? -8 : 8

    footprints.push({
      x,
      y,
      offset,
      rotation: angle,
      key: i
    })
  }

  return (
    <>
      {footprints.map((fp) => (
        <div
          key={fp.key}
          className="absolute pointer-events-none"
          style={{
            left: `${fp.x}px`,
            top: `${fp.y}px`,
            transform: `translate(-50%, -50%) rotate(${fp.rotation}deg) translateY(${fp.offset}px)`,
            zIndex: 5
          }}
        >
          {/* Simple footprint using emoji or text */}
          <span style={{ 
            fontSize: '16px', 
            opacity: 0.4,
            color: '#8B4513',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            👣
          </span>
        </div>
      ))}
    </>
  )
}
