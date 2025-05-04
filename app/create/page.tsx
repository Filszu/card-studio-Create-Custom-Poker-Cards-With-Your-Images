"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  ChevronLeft,
  Upload,
  ImageIcon,
  Type,
  Palette,
  Download,
  Bold,
  Italic,
  Save,
  Undo,
  Redo,
  FileImage,
} from "lucide-react"
import { CardPreview } from "@/components/card-preview"
import { DeckGridPreview } from "@/components/deck-grid-preview"
import { TextPositionControl } from "@/components/text-position-control"
import { FontSelector } from "@/components/font-selector"
import { ApplyToAllButton } from "@/components/apply-to-all-button"
import { CardTemplates } from "@/components/card-templates"
import { BatchImageUpload } from "@/components/batch-image-upload"
import { SuitPreviewButton } from "@/components/suit-preview-button"
import { exportCardAsImage, exportDeckAsZip } from "@/utils/export-utils"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useLocalStorage } from "@/hooks/use-local-storage"

const CARD_SUITS = ["hearts", "diamonds", "clubs", "spades"]
const CARD_VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

export default function CreatePage() {
  // Basic state
  const [selectedCard, setSelectedCard] = useState({ suit: "hearts", value: "A" })
  const [activeTab, setActiveTab] = useState("upload")
  const [isTextDraggable, setIsTextDraggable] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Use local storage for persistent state - with minimal dependencies
  const [deckName, setDeckName] = useLocalStorage("deckName", "My Custom Deck")
  const [cards, setCards] = useLocalStorage<Record<string, any>>("cards", {})
  const [cardBack, setCardBack] = useLocalStorage<any>("cardBack", {
    bgColor: "#2D2A4A",
    borderColor: "#FF7E67",
    borderWidth: 4,
    borderRadius: 12,
  })

  // History management - completely separate from local storage
  const [history, setHistory] = useState<Record<string, any>[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const isHistoryAction = useRef(false)
  const isInitialized = useRef(false)

  // Refs for export functionality
  const cardPreviewRef = useRef<HTMLDivElement>(null)
  const cardRefsMap = useRef<Map<string, HTMLDivElement>>(new Map())

  // Initialize history once when component mounts and cards are loaded
  useEffect(() => {
    if (!isInitialized.current && Object.keys(cards).length > 0) {
      setHistory([{ ...cards }])
      setHistoryIndex(0)
      isInitialized.current = true
    }
  }, [cards])

  // Add to history when cards change (but not during undo/redo)
  const addToHistory = useCallback(
    (newCards: Record<string, any>) => {
      if (isHistoryAction.current) {
        isHistoryAction.current = false
        return
      }

      // Only add if we have a valid history index
      if (historyIndex >= 0) {
        setHistory((prev) => [...prev.slice(0, historyIndex + 1), { ...newCards }])
        setHistoryIndex((prev) => prev + 1)
      }
    },
    [historyIndex],
  )

  // Debounced history update
  useEffect(() => {
    if (!isInitialized.current) return

    const timer = setTimeout(() => {
      if (!isHistoryAction.current) {
        addToHistory(cards)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [cards, addToHistory])

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isHistoryAction.current = true
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCards(history[newIndex])
    }
  }, [historyIndex, history, setCards])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isHistoryAction.current = true
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCards(history[newIndex])
    }
  }, [historyIndex, history, history.length, setCards])

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files || files.length === 0) return

      const file = files[0]
      const imageUrl = URL.createObjectURL(file)
      const cardId = `${selectedCard.suit}-${selectedCard.value}`

      setCards((prev) => ({
        ...prev,
        [cardId]: {
          ...(prev[cardId] || {}),
          image: imageUrl,
          name: file.name,
        },
      }))

      // Reset the input value to allow selecting the same file again
      event.target.value = ""
    },
    [selectedCard, setCards],
  )

  const handleBatchImageUpload = useCallback(
    (images: { cardId: string; image: string; name: string }[]) => {
      setCards((prev) => {
        const newCards = { ...prev }

        images.forEach(({ cardId, image, name }) => {
          newCards[cardId] = {
            ...(newCards[cardId] || {}),
            image,
            name,
          }
        })

        return newCards
      })

      toast({
        title: "Images Uploaded",
        description: `${images.length} images have been assigned to cards.`,
      })
    },
    [setCards],
  )

  const handleSaveCard = useCallback(
    (cardData: any) => {
      const cardId = `${selectedCard.suit}-${selectedCard.value}`

      setCards((prev) => ({
        ...prev,
        [cardId]: {
          ...(prev[cardId] || {}),
          ...cardData,
        },
      }))
    },
    [selectedCard, setCards],
  )

  const handleTextPositionChange = useCallback(
    (key: string, position: { x: number; y: number }) => {
      handleSaveCard({ [key]: position })
    },
    [handleSaveCard],
  )

  const handleApplyToAllCards = useCallback(() => {
    const currentCardId = `${selectedCard.suit}-${selectedCard.value}`

    setCards((prev) => {
      const currentCardData = prev[currentCardId] || {}

      // Properties to apply to all cards
      const commonProps = {
        bgColor: currentCardData.bgColor,
        borderColor: currentCardData.borderColor,
        borderWidth: currentCardData.borderWidth,
        borderRadius: currentCardData.borderRadius,
        textColor: currentCardData.textColor,
        textShadow: currentCardData.textShadow,
        fontFamily: currentCardData.fontFamily,
        fontSize: currentCardData.fontSize,
        symbolSize: currentCardData.symbolSize,
        bold: currentCardData.bold,
        italic: currentCardData.italic,
        textAlign: currentCardData.textAlign,
        verticalAlign: currentCardData.verticalAlign,
        accentColor: currentCardData.accentColor,
      }

      // Create a new cards object with updated properties
      const updatedCards = { ...prev }

      Object.keys(updatedCards).forEach((cardId) => {
        if (cardId !== currentCardId) {
          updatedCards[cardId] = {
            ...updatedCards[cardId],
            ...commonProps,
          }
        }
      })

      return updatedCards
    })

    toast({
      title: "Settings Applied",
      description: "Current card settings have been applied to all cards.",
    })
  }, [selectedCard, setCards])

  const handleApplyTemplate = useCallback(
    (template: any) => {
      handleSaveCard(template)

      toast({
        title: "Template Applied",
        description: "The template has been applied to the current card.",
      })
    },
    [handleSaveCard],
  )

  const handleExportCard = useCallback(async () => {
    if (!cardPreviewRef.current) return

    const cardId = `${selectedCard.suit}-${selectedCard.value}`
    const filename = `${deckName}_${selectedCard.value}_of_${selectedCard.suit}`

    await exportCardAsImage(cardPreviewRef.current, filename)

    toast({
      title: "Card Exported",
      description: `${selectedCard.value} of ${selectedCard.suit} has been exported.`,
    })
  }, [deckName, selectedCard])

  const handleExportDeck = useCallback(async () => {
    if (isExporting) return
    setIsExporting(true)

    try {
      const cardElements: HTMLElement[] = []
      const cardNames: string[] = []

      // Get all card elements from the refs map
      Object.entries(cards).forEach(([cardId, _]) => {
        const element = cardRefsMap.current.get(cardId)
        if (element) {
          const [suit, value] = cardId.split("-")
          cardElements.push(element)
          cardNames.push(`${value}_of_${suit}`)
        }
      })

      if (cardElements.length === 0) {
        toast({
          title: "No Cards to Export",
          description: "Please create at least one card before exporting.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Exporting Deck",
        description: "Please wait while your deck is being exported...",
      })

      await exportDeckAsZip(cardElements, cardNames, deckName)

      toast({
        title: "Deck Exported",
        description: `${deckName} has been exported with ${cardElements.length} cards.`,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your deck. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [cards, deckName, isExporting])

  // Function to register card refs for export
  const registerCardRef = useCallback((cardId: string, ref: HTMLDivElement | null) => {
    if (ref) {
      cardRefsMap.current.set(cardId, ref)
    } else {
      cardRefsMap.current.delete(cardId)
    }
  }, [])

  // Handle card selection from the grid
  const handleCardSelect = useCallback((suit: string, value: string) => {
    setSelectedCard({ suit, value })
    setActiveTab("design") // Switch to design tab when selecting a card
  }, [])

  const currentCardId = `${selectedCard.suit}-${selectedCard.value}`
  const currentCard = cards[currentCardId] || {}

  // Count cards by suit
  const cardCountBySuit = CARD_SUITS.reduce(
    (acc, suit) => {
      acc[suit] = Object.keys(cards).filter((cardId) => cardId.startsWith(`${suit}-`)).length
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-[#2D2A4A]">
      <Toaster />
      <header className="border-b border-white/10 bg-[#2D2A4A]/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center text-white">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-xl font-bold text-white">CARD STUDIO</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={handleExportCard}
              disabled={isExporting}
            >
              Export Card
            </Button>
            <Button
              className="bg-[#FF7E67] hover:bg-[#FF7E67]/90 text-white"
              size="sm"
              onClick={handleExportDeck}
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export Deck"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="deck-name" className="text-white">
              Deck Name
            </Label>
            <Input
              id="deck-name"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <Undo className="mr-2 h-4 w-4" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="mr-2 h-4 w-4" />
              Redo
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-white/10">
                <TabsTrigger value="upload" className="text-white data-[state=active]:bg-[#FF7E67]">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="batch" className="text-white data-[state=active]:bg-[#FF7E67]">
                  <FileImage className="mr-2 h-4 w-4" />
                  Batch
                </TabsTrigger>
                <TabsTrigger value="templates" className="text-white data-[state=active]:bg-[#FF7E67]">
                  <Save className="mr-2 h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="design" className="text-white data-[state=active]:bg-[#FF7E67]">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="text" className="text-white data-[state=active]:bg-[#FF7E67]">
                  <Type className="mr-2 h-4 w-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="colors" className="text-white data-[state=active]:bg-[#FF7E67]">
                  <Palette className="mr-2 h-4 w-4" />
                  Colors
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-6">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-12 text-center">
                      <ImageIcon className="h-12 w-12 text-white/50 mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">Upload Image for Card</h3>
                      <p className="text-white/70 mb-6 max-w-md">
                        Upload an image for the {selectedCard.value} of {selectedCard.suit}
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="card-image-upload"
                      />
                      <Label
                        htmlFor="card-image-upload"
                        className="bg-[#FF7E67] hover:bg-[#FF7E67]/90 text-white py-2 px-4 rounded-md cursor-pointer"
                      >
                        Select Image
                      </Label>

                      {currentCard.image && (
                        <div className="mt-6">
                          <p className="text-white/70 mb-2">Current image: {currentCard.name}</p>
                          <div className="relative w-40 h-40 mx-auto">
                            <Image
                              src={currentCard.image || "/placeholder.svg"}
                              alt={`${selectedCard.value} of ${selectedCard.suit}`}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="batch" className="mt-6">
                <BatchImageUpload onUpload={handleBatchImageUpload} />
              </TabsContent>

              <TabsContent value="templates" className="mt-6">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium text-white mb-4">Card Templates</h3>
                    <p className="text-white/70 mb-6">
                      Select a template to quickly style your card. Click on a template to apply it.
                    </p>
                    <CardTemplates onSelectTemplate={handleApplyTemplate} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="mt-6">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="space-y-6 text-white">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="border-width">Border Width</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="border-width"
                              min={0}
                              max={20}
                              step={1}
                              value={[currentCard.borderWidth || 4]}
                              onValueChange={(value) => handleSaveCard({ borderWidth: value[0] })}
                              className="flex-1"
                            />
                            <span className="w-8 text-center">{currentCard.borderWidth || 4}px</span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="border-radius">Border Radius</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="border-radius"
                              min={0}
                              max={30}
                              step={1}
                              value={[currentCard.borderRadius || 12]}
                              onValueChange={(value) => handleSaveCard({ borderRadius: value[0] })}
                              className="flex-1"
                            />
                            <span className="w-8 text-center">{currentCard.borderRadius || 12}px</span>
                          </div>
                        </div>
                      </div>

                      {currentCard.image && (
                        <div>
                          <Label htmlFor="image-scale">Image Scale</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="image-scale"
                              min={100}
                              max={200}
                              step={5}
                              value={[currentCard.imageScale || 100]}
                              onValueChange={(value) => handleSaveCard({ imageScale: value[0] })}
                              className="flex-1"
                            />
                            <span className="w-8 text-center">{currentCard.imageScale || 100}%</span>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="opacity">Image Opacity</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            id="opacity"
                            min={0}
                            max={100}
                            step={1}
                            value={[currentCard.opacity || 100]}
                            onValueChange={(value) => handleSaveCard({ opacity: value[0] })}
                            className="flex-1"
                          />
                          <span className="w-8 text-center">{currentCard.opacity || 100}%</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="symbol-size">Card Symbol Size</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            id="symbol-size"
                            min={12}
                            max={24}
                            step={1}
                            value={[currentCard.symbolSize || 16]}
                            onValueChange={(value) => handleSaveCard({ symbolSize: value[0] })}
                            className="flex-1"
                          />
                          <span className="w-8 text-center">{currentCard.symbolSize || 16}px</span>
                        </div>
                      </div>

                      <ApplyToAllButton onClick={handleApplyToAllCards} className="mt-4" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="text" className="mt-6">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="space-y-4 text-white">
                      <div>
                        <Label htmlFor="card-title">Card Title</Label>
                        <Input
                          id="card-title"
                          placeholder="Enter card title"
                          value={currentCard.title || ""}
                          onChange={(e) => handleSaveCard({ title: e.target.value })}
                          className="bg-white/10 border-white/20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="card-subtitle">Card Subtitle</Label>
                        <Input
                          id="card-subtitle"
                          placeholder="Enter card subtitle"
                          value={currentCard.subtitle || ""}
                          onChange={(e) => handleSaveCard({ subtitle: e.target.value })}
                          className="bg-white/10 border-white/20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="font-size">Text Size</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            id="font-size"
                            min={8}
                            max={24}
                            step={1}
                            value={[currentCard.fontSize || 14]}
                            onValueChange={(value) => handleSaveCard({ fontSize: value[0] })}
                            className="flex-1"
                          />
                          <span className="w-8 text-center">{currentCard.fontSize || 14}px</span>
                        </div>
                      </div>

                      <FontSelector
                        value={currentCard.fontFamily || "sans-serif"}
                        onChange={(value) => handleSaveCard({ fontFamily: value })}
                      />

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label htmlFor="text-color">Text Color</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              id="text-color"
                              value={currentCard.textColor || "#ffffff"}
                              onChange={(e) => handleSaveCard({ textColor: e.target.value })}
                              className="w-12 h-10 p-1 bg-transparent"
                            />
                            <Input
                              type="text"
                              value={currentCard.textColor || "#ffffff"}
                              onChange={(e) => handleSaveCard({ textColor: e.target.value })}
                              className="bg-white/10 border-white/20"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <Label htmlFor="text-shadow">Text Shadow</Label>
                          <Input
                            type="range"
                            id="text-shadow"
                            min="0"
                            max="10"
                            value={currentCard.textShadow || "0"}
                            onChange={(e) => handleSaveCard({ textShadow: e.target.value })}
                            className="bg-white/10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="mb-2 block">Text Formatting</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className={`border-white/20 ${currentCard.bold ? "bg-white/20" : "hover:bg-white/10"}`}
                            onClick={() => handleSaveCard({ bold: !currentCard.bold })}
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className={`border-white/20 ${currentCard.italic ? "bg-white/20" : "hover:bg-white/10"}`}
                            onClick={() => handleSaveCard({ italic: !currentCard.italic })}
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <TextPositionControl
                        textAlign={currentCard.textAlign || "center"}
                        verticalAlign={currentCard.verticalAlign || "middle"}
                        onChange={(key, value) => handleSaveCard({ [key]: value })}
                      />

                      <div className="flex items-center gap-2 pt-2">
                        <Label htmlFor="enable-drag" className="flex-1">
                          Enable Text Dragging
                        </Label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="enable-drag"
                            checked={isTextDraggable}
                            onChange={(e) => setIsTextDraggable(e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-white/70">
                            {isTextDraggable ? "Drag text to position" : "Enable to drag text"}
                          </span>
                        </div>
                      </div>

                      <ApplyToAllButton onClick={handleApplyToAllCards} className="mt-4" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="colors" className="mt-6">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="space-y-4 text-white">
                      <div>
                        <Label htmlFor="bg-color">Background Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            id="bg-color"
                            value={currentCard.bgColor || "#2D2A4A"}
                            onChange={(e) => handleSaveCard({ bgColor: e.target.value })}
                            className="w-12 h-10 p-1 bg-transparent"
                          />
                          <Input
                            type="text"
                            value={currentCard.bgColor || "#2D2A4A"}
                            onChange={(e) => handleSaveCard({ bgColor: e.target.value })}
                            className="bg-white/10 border-white/20"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="border-color">Border Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            id="border-color"
                            value={currentCard.borderColor || "#FF7E67"}
                            onChange={(e) => handleSaveCard({ borderColor: e.target.value })}
                            className="w-12 h-10 p-1 bg-transparent"
                          />
                          <Input
                            type="text"
                            value={currentCard.borderColor || "#FF7E67"}
                            onChange={(e) => handleSaveCard({ borderColor: e.target.value })}
                            className="bg-white/10 border-white/20"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="accent-color">Accent Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            id="accent-color"
                            value={currentCard.accentColor || "#89DAFF"}
                            onChange={(e) => handleSaveCard({ accentColor: e.target.value })}
                            className="w-12 h-10 p-1 bg-transparent"
                          />
                          <Input
                            type="text"
                            value={currentCard.accentColor || "#89DAFF"}
                            onChange={(e) => handleSaveCard({ accentColor: e.target.value })}
                            className="bg-white/10 border-white/20"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={() =>
                          handleSaveCard({
                            bgColor: "#2D2A4A",
                            borderColor: "#FF7E67",
                            accentColor: "#89DAFF",
                            textColor: "#ffffff",
                          })
                        }
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Reset to Default Colors
                      </Button>

                      <ApplyToAllButton onClick={handleApplyToAllCards} className="mt-4" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-white mb-4">Card Preview</h3>
                <div ref={cardPreviewRef}>
                  <CardPreview
                    card={currentCard}
                    suit={selectedCard.suit}
                    value={selectedCard.value}
                    isEditing={isTextDraggable}
                    onTextPositionChange={handleTextPositionChange}
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={handleExportCard}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Card
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-white mb-4">Select Card</h3>
                <div className="grid grid-cols-4 gap-2">
                  {CARD_SUITS.map((suit) => (
                    <Button
                      key={suit}
                      variant={selectedCard.suit === suit ? "default" : "outline"}
                      className={
                        selectedCard.suit === suit
                          ? "bg-[#FF7E67] hover:bg-[#FF7E67]/90 text-white"
                          : "border-white/20 text-white hover:bg-white/10"
                      }
                      onClick={() => setSelectedCard({ ...selectedCard, suit })}
                    >
                      {suit.charAt(0).toUpperCase() + suit.slice(1)}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {CARD_VALUES.map((value) => (
                    <Button
                      key={value}
                      variant={selectedCard.value === value ? "default" : "outline"}
                      className={
                        selectedCard.value === value
                          ? "bg-[#FF7E67] hover:bg-[#FF7E67]/90 text-white"
                          : "border-white/20 text-white hover:bg-white/10"
                      }
                      onClick={() => setSelectedCard({ ...selectedCard, value })}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                  <h3 className="text-lg font-medium text-white">Deck Preview</h3>
                  <Button
                    size="sm"
                    className="bg-[#FF7E67] hover:bg-[#FF7E67]/90 text-white w-full sm:w-auto"
                    onClick={handleExportDeck}
                    disabled={isExporting}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Export Deck"}
                  </Button>
                </div>

                {/* Print preview buttons */}
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CARD_SUITS.map((suit) => (
                    <SuitPreviewButton
                      key={suit}
                      suit={suit}
                      className={cardCountBySuit[suit] === 0 ? "opacity-50 cursor-not-allowed" : ""}
                    />
                  ))}
                </div>

                {/* Hidden card previews for export */}
                <div className="hidden">
                  {Object.entries(cards).map(([cardId, cardData]) => {
                    const [suit, value] = cardId.split("-")
                    return (
                      <div key={cardId} ref={(ref) => registerCardRef(cardId, ref as HTMLDivElement | null)}>
                        <CardPreview card={cardData} suit={suit} value={value} forExport={true} />
                      </div>
                    )
                  })}
                </div>

                <DeckGridPreview cards={cards} onCardSelect={handleCardSelect} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
