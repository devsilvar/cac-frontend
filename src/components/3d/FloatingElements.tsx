import React from 'react'
import { motion } from 'framer-motion'

export const FloatingElements: React.FC = () => {
  const shapes = [
    { id: 1, size: 'w-16 h-16', color: 'bg-gradient-to-r from-blue-400 to-blue-600', delay: 0 },
    { id: 2, size: 'w-12 h-12', color: 'bg-gradient-to-r from-purple-400 to-purple-600', delay: 1 },
    { id: 3, size: 'w-20 h-20', color: 'bg-gradient-to-r from-pink-400 to-pink-600', delay: 2 },
    { id: 4, size: 'w-8 h-8', color: 'bg-gradient-to-r from-indigo-400 to-indigo-600', delay: 0.5 },
    { id: 5, size: 'w-14 h-14', color: 'bg-gradient-to-r from-cyan-400 to-cyan-600', delay: 1.5 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute ${shape.size} ${shape.color} rounded-full opacity-20 blur-xl`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Additional geometric shapes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`geo-${i}`}
          className="absolute w-2 h-2 bg-white rounded-full opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  )
}