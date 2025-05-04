"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface DraggableTextProps {
  children: React.ReactNode
  position: { x: number; y: number }
  onPositionChange: (position: { x: number; y: number }) => void
  className?: string
  style?: React.CSSProperties
  constraintsRef: React.RefObject<HTMLDivElement>
}

export function DraggableText({
  children,
  position,
  onPositionChange,
  className = "",
  style = {},
  constraintsRef,
}: DraggableTextProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <motion.div
      className={`absolute cursor-move ${isDragging ? "z-50" : "z-10"} ${className}`}
      drag
      dragMomentum={false}
      dragConstraints={constraintsRef}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false)
        onPositionChange({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        })
      }}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      style={style}
    >
      {children}
    </motion.div>
  )
}
