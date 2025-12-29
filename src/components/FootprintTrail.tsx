'use client'

import { motion } from 'framer-motion'

interface FootprintTrailProps {
  startX: number
  startY: number
  endX: number
  endY: number
}

export default function FootprintTrail({
  startX,
  startY,
  endX,
  endY,
}: FootprintTrailProps) {
  // Calculate the path
  const dx = endX - startX
  const dy = endY - startY
  const distance = Math.sqrt(dx * dx + dy * dy)
  // Calculate angle in degrees - this determines footprint direction
  const pathAngle = Math.atan2(dy, dx) * (180 / Math.PI)

  // Create footprint positions - increased spacing
  const footprintSpacing = 4.0 // percentage units (increased spacing)
  const numFootprints = Math.floor(distance / footprintSpacing)
  const footprints = []

  for (let i = 1; i < numFootprints; i++) {
    const progress = i / numFootprints
    const x = startX + dx * progress
    const y = startY + dy * progress
    const isLeft = i % 2 === 0
    
    footprints.push({
      x,
      y,
      isLeft,
      key: i,
      pathAngle: pathAngle
    })
  }

  return (
    <>
      {footprints.map((fp, index) => {
        // Calculate perpendicular offset for left/right foot
        // Perpendicular to path is pathAngle + 90 degrees
        const perpendicularAngle = (fp.pathAngle + 90) * (Math.PI / 180)
        const offsetDistance = 0.4 // percentage units (increased from 0.3)
        const offsetX = fp.isLeft ? -Math.cos(perpendicularAngle) * offsetDistance : Math.cos(perpendicularAngle) * offsetDistance
        const offsetY = fp.isLeft ? -Math.sin(perpendicularAngle) * offsetDistance : Math.sin(perpendicularAngle) * offsetDistance

        return (
          <motion.div
            key={fp.key}
            className="absolute pointer-events-none"
            style={{
              left: `${fp.x + offsetX}%`,
              top: `${fp.y + offsetY}%`,
              transform: `translate(-50%, -50%)`,
              zIndex: 6
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.05,
              duration: 0.3 
            }}
          >
            {/* Footprint SVG - pointing FORWARD (subtract 90 instead of add) */}
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              style={{
                // Subtract 90 to point forward, then add path angle
                transform: `rotate(${fp.pathAngle - 90 + (fp.isLeft ? -15 : 15)}deg)`,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                transformOrigin: 'center center'
              }}
            >
              {/* Foot sole - larger for better visibility */}
              <ellipse 
                cx="12" 
                cy="14" 
                rx="4" 
                ry="6" 
                fill="hsl(var(--primary))" 
                opacity="0.9"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
              />
              {/* Toes - slightly larger */}
              <circle cx="9" cy="7" r="1.8" fill="hsl(var(--primary))" opacity="0.9" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
              <circle cx="12" cy="6" r="1.8" fill="hsl(var(--primary))" opacity="0.9" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
              <circle cx="15" cy="7" r="1.8" fill="hsl(var(--primary))" opacity="0.9" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
            </svg>
          </motion.div>
        )
      })}
    </>
  )
}
