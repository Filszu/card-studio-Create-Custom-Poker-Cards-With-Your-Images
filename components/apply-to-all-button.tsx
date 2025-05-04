"use client"

import { Button } from "@/components/ui/button"
import { CopyCheck } from "lucide-react"
import { useState } from "react"

interface ApplyToAllButtonProps {
  onClick: () => void
  className?: string
}

export function ApplyToAllButton({ onClick, className = "" }: ApplyToAllButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    onClick()

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)
  }

  return (
    <Button
      variant="outline"
      className={`border-white/20 text-white hover:bg-white/10 ${className} ${isAnimating ? "animate-pulse" : ""}`}
      onClick={handleClick}
    >
      <CopyCheck className="mr-2 h-4 w-4" />
      Apply to All Cards
    </Button>
  )
}
