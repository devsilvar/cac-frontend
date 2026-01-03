import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gloss?: boolean
  neon?: boolean
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = true, 
  gloss = false,
  neon = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -8, scale: 1.02 } : undefined}
      transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
      className={clsx(
        'relative overflow-hidden transition-all duration-500',
        gloss && 'bg-white/80 backdrop-blur-xl border border-white/30',
        neon && 'bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30',
        !gloss && !neon && 'bg-white/90 backdrop-blur-sm border border-gray-200/50',
        'rounded-2xl shadow-xl hover:shadow-2xl',
        neon && 'hover:shadow-indigo-500/20',
        className
      )}
    >
      {/* Animated gradient border */}
      {neon && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl animate-pulse" />
      )}
      
      {/* Glass reflection effect */}
      {gloss && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
      )}
      
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Floating particles */}
      {neon && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}