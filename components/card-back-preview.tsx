"use client"

import { useRef } from "react"
import Image from "next/image"

interface CardBackPreviewProps {
  cardBack: any
}

export function CardBackPreview({ cardBack }: CardBackPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Generate pattern based on selected pattern type
  const getPatternStyle = () => {
    if (!cardBack?.pattern || cardBack.pattern === "none") return {}

    const patternColor = cardBack.patternColor || "#ffffff"
    const opacity = cardBack.patternOpacity || 0.2

    switch (cardBack.pattern) {
      case "dots":
        return {
          backgroundImage: `radial-gradient(${patternColor}${Math.round(opacity * 255).toString(16)} 1px, transparent 1px)`,
          backgroundSize: "10px 10px",
        }
      case "lines":
        return {
          backgroundImage: `linear-gradient(90deg, ${patternColor}${Math.round(opacity * 255).toString(
            16,
          )} 1px, transparent 1px)`,
          backgroundSize: "10px 10px",
        }
      case "grid":
        return {
          backgroundImage: `linear-gradient(${patternColor}${Math.round(opacity * 255).toString(
            16,
          )} 1px, transparent 1px), 
                           linear-gradient(90deg, ${patternColor}${Math.round(opacity * 255).toString(
                             16,
                           )} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }
      case "diamonds":
        return {
          backgroundImage: `linear-gradient(45deg, ${patternColor}${Math.round(opacity * 255).toString(
            16,
          )} 25%, transparent 25%), 
                           linear-gradient(-45deg, ${patternColor}${Math.round(opacity * 255).toString(
                             16,
                           )} 25%, transparent 25%)`,
          backgroundSize: "20px 20px",
        }
      case "waves":
        return {
          backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${patternColor}${Math.round(
            opacity * 255,
          ).toString(16)} 10px)`,
          backgroundSize: "20px 20px",
        }
      case "zigzag":
        return {
          backgroundImage: `linear-gradient(135deg, ${patternColor}${Math.round(opacity * 255).toString(
            16,
          )} 25%, transparent 25%) 0 0,
                           linear-gradient(225deg, ${patternColor}${Math.round(opacity * 255).toString(
                             16,
                           )} 25%, transparent 25%) 0 0`,
          backgroundSize: "20px 20px",
        }
      case "chevron":
        return {
          backgroundImage: `linear-gradient(135deg, ${patternColor}${Math.round(opacity * 255).toString(
            16,
          )} 25%, transparent 25%) 0 0,
                           linear-gradient(225deg, ${patternColor}${Math.round(opacity * 255).toString(
                             16,
                           )} 25%, transparent 25%) 0 0`,
          backgroundSize: "20px 40px",
        }
      default:
        return {}
    }
  }

  return (
    <div
      ref={cardRef}
      className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden"
      style={{
        backgroundColor: cardBack?.bgColor || "#2D2A4A",
        borderRadius: `${cardBack?.borderRadius || 12}px`,
        border: `${cardBack?.borderWidth || 4}px solid ${cardBack?.borderColor || "#FF7E67"}`,
        ...getPatternStyle(),
      }}
    >
      {cardBack?.image && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="w-full h-full relative"
            style={{
              transform: `scale(${(cardBack?.imageScale || 100) / 100})`,
              transformOrigin: "center",
            }}
          >
            <Image
              src={cardBack?.image || "/placeholder.svg"}
              alt="Card Back"
              fill
              className="object-cover"
              style={{ opacity: (cardBack?.opacity || 100) / 100 }}
            />
          </div>
        </div>
      )}

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {!cardBack?.image && !cardBack?.pattern && <div className="text-4xl font-bold text-white/20">Card Back</div>}
      </div>
    </div>
  )
}
