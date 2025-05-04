"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react"
import { CardPreview } from "./card-preview"
import { motion, AnimatePresence } from "framer-motion"

interface DeckPreviewProps {
  cards: Record<string, any>
}

export function DeckPreview({ cards }: DeckPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isShuffling, setIsShuffling] = useState(false)
  const [cardOrder, setCardOrder] = useState<string[]>([])

  const cardEntries = Object.entries(cards)
  const totalCards = cardEntries.length

  useEffect(() => {
    // Initialize card order
    setCardOrder(cardEntries.map(([cardId]) => cardId))
  }, [cards])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalCards - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalCards - 1 ? prev + 1 : 0))
  }

  const handleShuffle = () => {
    if (isShuffling || totalCards < 2) return

    setIsShuffling(true)

    // Create a shuffled copy of the card order
    const shuffled = [...cardOrder].sort(() => Math.random() - 0.5)

    // Animate the shuffle
    setTimeout(() => {
      setCardOrder(shuffled)
      setCurrentIndex(0)
      setIsShuffling(false)
    }, 1000)
  }

  if (totalCards === 0) {
    return (
      <div className="aspect-[2.5/3.5] rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center p-4 text-center text-white/50">
        No cards created yet. Start by selecting a card and uploading an image.
      </div>
    )
  }

  const currentCardId = cardOrder[currentIndex] || cardEntries[0][0]
  const [suit, value] = currentCardId.split("-")
  const cardData = cards[currentCardId]

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCardId}
          className="flex justify-center"
          initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <CardPreview card={cardData} suit={suit} value={value} />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          className="border-white/20 text-white hover:bg-white/10"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="text-white/70 text-sm">
            {currentIndex + 1} of {totalCards}
          </div>

          {totalCards > 1 && (
            <Button
              variant="outline"
              size="icon"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={handleShuffle}
              disabled={isShuffling}
            >
              <Shuffle className={`h-4 w-4 ${isShuffling ? "animate-spin" : ""}`} />
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="border-white/20 text-white hover:bg-white/10"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
