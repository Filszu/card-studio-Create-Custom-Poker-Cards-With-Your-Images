"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface SuitPreviewButtonProps {
  suit: string
  className?: string
}

export function SuitPreviewButton({ suit, className = "" }: SuitPreviewButtonProps) {
  // Get a readable suit name
  const getSuitName = (suit: string) => {
    return suit.charAt(0).toUpperCase() + suit.slice(1)
  }

  // Get suit symbol
  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case "hearts":
        return "♥"
      case "diamonds":
        return "♦"
      case "clubs":
        return "♣"
      case "spades":
        return "♠"
      default:
        return ""
    }
  }

  // Get suit color
  const getSuitColor = (suit: string) => {
    return suit === "hearts" || suit === "diamonds" ? "text-[#FF7E67]" : "text-white"
  }

  return (
    <Button variant="outline" className={`border-white/20 text-white hover:bg-white/10 ${className}`} asChild>
      <Link href={`/print/${suit}`}>
        <Eye className="mr-2 h-4 w-4" />
        <span className={getSuitColor(suit)}>{getSuitSymbol(suit)}</span>
        <span className="ml-1">{getSuitName(suit)}</span>
      </Link>
    </Button>
  )
}
