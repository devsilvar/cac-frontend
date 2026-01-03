import React from 'react'
import { motion } from 'framer-motion'
import { Card } from './ui/Card'

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  delay: number
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <Card neon hover className="h-full group cursor-pointer">
        <div className="text-center">
          <motion.div 
            className="mb-6 flex justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
          
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {title}
          </h3>
          
          <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
            {description}
          </p>
          
          {/* Hover effect indicator */}
          <motion.div 
            className="mt-6 w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            transition={{ delay: delay + 0.3, duration: 0.5 }}
          />
        </div>
      </Card>
    </motion.div>
  )
}

export default FeatureCard