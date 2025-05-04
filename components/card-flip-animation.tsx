"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { CardPreview } from "./card-preview"
import { CardBackPreview } from "./card-back-preview"
import { Button } from "@/components/ui/button"
import { Repeat } from "lucide-react"

interface CardFlipAnimationProps {
  card: any
  cardBack: any
  suit: string
  value: string
}

export function CardFlipAnimation({ card, cardBack, suit, value }: CardFlipAnimationProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Use refs to prevent unnecessary re-renders
  const cardRef = useRef(card)
  const cardBackRef = useRef(cardBack)
  const suitRef = useRef(suit)
  const valueRef = useRef(value)

  // Only update refs when props change - don't trigger re-renders
  useEffect(() => {
    cardRef.current = card
    cardBackRef.current = cardBack
    suitRef.current = suit
    valueRef.current = value
  }, [card, cardBack, suit, value])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="relative">
      <div className="perspective-1000 relative w-full aspect-[2.5/3.5]">
        <motion.div
          className="w-full h-full relative preserve-3d"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute w-full h-full backface-hidden">
            <CardPreview card={card} suit={suit} value={value} />
          </div>
          <div className="absolute w-full h-full backface-hidden" style={{ transform: "rotateY(180deg)" }}>
            <CardBackPreview cardBack={cardBack} />
          </div>
        </motion.div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="absolute bottom-4 right-4 border-white/20 text-white hover:bg-white/10 z-20"
        onClick={handleFlip}
      >
        <Repeat className="mr-2 h-4 w-4" />
        Flip
      </Button>
    </div>
  )
}
