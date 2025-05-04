"use client"

import { CardPreview } from "./card-preview"
import { motion } from "framer-motion"

interface DeckGridPreviewProps {
  cards: Record<string, any>
  onCardSelect?: (suit: string, value: string) => void
}

export function DeckGridPreview({ cards, onCardSelect }: DeckGridPreviewProps) {
  const cardEntries = Object.entries(cards)

  if (cardEntries.length === 0) {
    return (
      <div className="text-center text-white/50 p-6">
        No cards created yet. Start by selecting a card and uploading an image.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 max-h-[500px] overflow-y-auto">
      {cardEntries.map(([cardId, cardData], index) => {
        const [suit, value] = cardId.split("-")
        return (
          <motion.div
            key={cardId}
            className="transform transition-transform cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onCardSelect && onCardSelect(suit, value)}
          >
            <CardPreview card={cardData} suit={suit} value={value} />
            <div className="text-center text-xs text-white/70 mt-1">
              {value} of {suit}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
