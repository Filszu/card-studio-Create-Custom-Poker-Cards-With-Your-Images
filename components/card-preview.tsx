"use client"

import { useRef } from "react"
import Image from "next/image"
import { DraggableText } from "./draggable-text"

interface CardPreviewProps {
  card: any
  suit: string
  value: string
  isEditing?: boolean
  onTextPositionChange?: (key: string, position: { x: number; y: number }) => void
  forExport?: boolean // New prop to indicate if this is for export
}

export function CardPreview({
  card,
  suit,
  value,
  isEditing = false,
  onTextPositionChange,
  forExport = false,
}: CardPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const suitSymbol =
    suit === "hearts" ? "♥" : suit === "diamonds" ? "♦" : suit === "clubs" ? "♣" : suit === "spades" ? "♠" : ""

  const suitColor = suit === "hearts" || suit === "diamonds" ? card.textColor || "#FF7E67" : card.textColor || "#ffffff"

  // Default positions if not set
  const titlePosition = card.titlePosition || { x: 0, y: 0 }
  const subtitlePosition = card.subtitlePosition || { x: 0, y: 20 }

  // Handle vertical alignment
  const getVerticalPosition = () => {
    const verticalAlign = card.verticalAlign || "middle"
    if (verticalAlign === "top") return "flex-start"
    if (verticalAlign === "bottom") return "flex-end"
    return "center" // middle
  }

  return (
    <div
      ref={cardRef}
      className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden"
      style={{
        backgroundColor: card.bgColor || "#2D2A4A",
        borderRadius: `${card.borderRadius || 12}px`,
        border: `${card.borderWidth || 4}px solid ${card.borderColor || "#FF7E67"}`,
      }}
    >
      {card.image && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="w-full h-full relative"
            style={{
              transform: `scale(${(card.imageScale || 100) / 100})`,
              transformOrigin: "center",
            }}
          >
            <Image
              src={card.image || "/placeholder.svg"}
              alt={`${value} of ${suit}`}
              fill
              className="object-cover"
              style={{ opacity: (card.opacity || 100) / 100 }}
            />
          </div>
        </div>
      )}

      <div className="absolute inset-0 z-10 p-2 flex flex-col" style={{ justifyContent: getVerticalPosition() }}>
        <div className="flex justify-between">
          <div
            className="text-xl"
            style={{
              color: suitColor,
              textShadow: card.textShadow ? `0 0 ${card.textShadow}px rgba(0,0,0,0.5)` : "none",
              fontWeight: card.bold ? "bold" : "normal",
              fontStyle: card.italic ? "italic" : "normal",
              fontFamily: card.fontFamily || "sans-serif",
              fontSize: `${card.symbolSize || 16}px`,
            }}
          >
            {value}
            <span className="ml-1">{suitSymbol}</span>
          </div>
          <div
            className="text-xl"
            style={{
              color: suitColor,
              textShadow: card.textShadow ? `0 0 ${card.textShadow}px rgba(0,0,0,0.5)` : "none",
              fontFamily: card.fontFamily || "sans-serif",
              fontSize: `${card.symbolSize || 16}px`,
            }}
          >
            {suitSymbol}
          </div>
        </div>

        {isEditing && card.title && onTextPositionChange ? (
          <DraggableText
            position={titlePosition}
            onPositionChange={(pos) => onTextPositionChange("titlePosition", pos)}
            constraintsRef={cardRef}
          >
            <div
              className="px-2 py-1 bg-black/20 backdrop-blur-sm rounded border border-white/20"
              style={{
                color: card.textColor || "#ffffff",
                textShadow: card.textShadow ? `0 0 ${card.textShadow}px rgba(0,0,0,0.5)` : "none",
                fontWeight: card.bold ? "bold" : "normal",
                fontStyle: card.italic ? "italic" : "normal",
                textAlign: card.textAlign || "center",
                fontFamily: card.fontFamily || "sans-serif",
                fontSize: `${card.fontSize || 14}px`,
              }}
            >
              {card.title}
            </div>
          </DraggableText>
        ) : card.title ? (
          <div
            className="text-center"
            style={{
              color: card.textColor || "#ffffff",
              textShadow: card.textShadow ? `0 0 ${card.textShadow}px rgba(0,0,0,0.5)` : "none",
              fontWeight: card.bold ? "bold" : "normal",
              fontStyle: card.italic ? "italic" : "normal",
              textAlign: card.textAlign || "center",
              fontFamily: card.fontFamily || "sans-serif",
              fontSize: `${card.fontSize || 14}px`,
              transform: `translate(${titlePosition.x}px, ${titlePosition.y}px)`,
            }}
          >
            {card.title}
          </div>
        ) : null}

        {isEditing && card.subtitle && onTextPositionChange ? (
          <DraggableText
            position={subtitlePosition}
            onPositionChange={(pos) => onTextPositionChange("subtitlePosition", pos)}
            constraintsRef={cardRef}
            className="mt-1"
          >
            <div
              className="px-2 py-1 bg-black/20 backdrop-blur-sm rounded border border-white/20"
              style={{
                color: card.textColor || "#ffffff",
                textShadow: card.textShadow ? `0 0 ${card.textShadow}px rgba(0,0,0,0.5)` : "none",
                fontWeight: card.bold ? "bold" : "normal",
                fontStyle: card.italic ? "italic" : "normal",
                textAlign: card.textAlign || "center",
                fontFamily: card.fontFamily || "sans-serif",
                fontSize: `${(card.fontSize || 14) - 2}px`,
              }}
            >
              {card.subtitle}
            </div>
          </DraggableText>
        ) : card.subtitle ? (
          <div
            className="text-center mt-1"
            style={{
              color: card.textColor || "#ffffff",
              textShadow: card.textShadow ? `0 0 ${card.textShadow}px rgba(0,0,0,0.5)` : "none",
              fontWeight: card.bold ? "bold" : "normal",
              fontStyle: card.italic ? "italic" : "normal",
              textAlign: card.textAlign || "center",
              fontFamily: card.fontFamily || "sans-serif",
              fontSize: `${(card.fontSize || 14) - 2}px`,
              transform: `translate(${subtitlePosition.x}px, ${subtitlePosition.y}px)`,
            }}
          >
            {card.subtitle}
          </div>
        ) : null}

        <div className="mt-auto flex justify-between">
          <div
            className="text-xl"
            style={{
              color: suitColor,
              textShadow: card.textShadow ? `0 0 ${card.textShadow}px rgba(0,0,0,0.5)` : "none",
              fontFamily: card.fontFamily || "sans-serif",
              fontSize: `${card.symbolSize || 16}px`,
            }}
          >
            {suitSymbol}
          </div>
          <div
            className="text-xl"
            style={{
              color: suitColor,
              textShadow: card.textShadow ? `0 0 ${card.textShadow}px rgba(0,0,0,0.5)` : "none",
              fontWeight: card.bold ? "bold" : "normal",
              fontStyle: card.italic ? "italic" : "normal",
              fontFamily: card.fontFamily || "sans-serif",
              fontSize: `${card.symbolSize || 16}px`,
            }}
          >
            <span className="mr-1">{suitSymbol}</span>
            {value}
          </div>
        </div>
      </div>
    </div>
  )
}
