"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardPreview } from "@/components/card-preview"
import { ChevronLeft, Printer, ArrowLeft, ArrowRight } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useRouter } from "next/navigation"

export default function PrintPreviewPage({ params }: { params: { suit: string } }) {
  const [cards, setCards] = useLocalStorage<Record<string, any>>("cards", {})
  const [deckName, setDeckName] = useLocalStorage("deckName", "My Custom Deck")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Decode the suit parameter
  const suit = decodeURIComponent(params.suit)

  // Filter cards by the selected suit
  const suitCards = Object.entries(cards).filter(([cardId]) => cardId.startsWith(`${suit}-`))

  // Sort cards by value (A, 2, 3, ..., J, Q, K)
  const sortedCards = suitCards.sort(([idA], [idB]) => {
    const valueA = idA.split("-")[1]
    const valueB = idB.split("-")[1]

    const valueOrder: Record<string, number> = {
      A: 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      "10": 10,
      J: 11,
      Q: 12,
      K: 13,
    }

    return valueOrder[valueA] - valueOrder[valueB]
  })

  // Navigate to next/previous suit
  const navigateToSuit = (direction: "next" | "prev") => {
    const suits = ["hearts", "diamonds", "clubs", "spades"]
    const currentIndex = suits.indexOf(suit)

    let newIndex
    if (direction === "next") {
      newIndex = (currentIndex + 1) % suits.length
    } else {
      newIndex = (currentIndex - 1 + suits.length) % suits.length
    }

    router.push(`/print/${suits[newIndex]}`)
  }

  // Handle print action
  const handlePrint = () => {
    window.print()
  }

  // Set loading state
  useEffect(() => {
    setIsLoading(false)
  }, [])

  // Get a readable suit name
  const getSuitName = (suit: string) => {
    return suit.charAt(0).toUpperCase() + suit.slice(1)
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#2D2A4A] text-white flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#2D2A4A]">
      {/* Header - hidden when printing */}
      <header className="border-b border-white/10 bg-[#2D2A4A]/95 backdrop-blur-sm sticky top-0 z-10 print:hidden">
        <div className="container flex items-center justify-between py-4">
          <Link href="/create" className="flex items-center text-white">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Link>
          <div className="text-xl font-bold text-white">
            {deckName} - {getSuitName(suit)}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigateToSuit("prev")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Suit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigateToSuit("next")}
            >
              Next Suit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button className="bg-[#FF7E67] hover:bg-[#FF7E67]/90 text-white" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </header>

      {/* Print title - only visible when printing */}
      <div className="hidden print:block print:mb-4 print:text-center">
        <h1 className="text-2xl font-bold">
          {deckName} - {getSuitName(suit)}
        </h1>
      </div>

      {/* Main content */}
      <main className="container py-6 print:py-0">
        {sortedCards.length === 0 ? (
          <div className="text-center text-white p-12 bg-white/5 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">No Cards Found</h2>
            <p className="mb-6">There are no cards created for the {getSuitName(suit)} suit yet.</p>
            <Button asChild>
              <Link href="/create">Go to Card Editor</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-3 print:gap-2">
            {sortedCards.map(([cardId, cardData]) => {
              const [suit, value] = cardId.split("-")
              return (
                <div key={cardId} className="print:break-inside-avoid">
                  <CardPreview card={cardData} suit={suit} value={value} />
                  <div className="text-center text-sm text-white/70 mt-1 print:text-black">
                    {value} of {getSuitName(suit)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
            color: black;
          }
          
          @page {
            size: auto;
            margin: 0.5cm;
          }
        }
      `}</style>
    </div>
  )
}
