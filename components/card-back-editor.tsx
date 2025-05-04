"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Upload, Trash2 } from "lucide-react"
import Image from "next/image"

interface CardBackEditorProps {
  cardBack: any
  onSave: (cardBackData: any) => void
}

export function CardBackEditor({ cardBack, onSave }: CardBackEditorProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(cardBack?.image || null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const imageUrl = URL.createObjectURL(file)
    setPreviewImage(imageUrl)
    onSave({
      ...cardBack,
      image: imageUrl,
      name: file.name,
    })
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    onSave({
      ...cardBack,
      image: null,
      name: null,
    })
  }

  const handleChange = (key: string, value: any) => {
    onSave({
      ...cardBack,
      [key]: value,
    })
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6">
        <div className="space-y-6 text-white">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
            {previewImage ? (
              <div className="space-y-4">
                <div className="relative w-40 h-56 mx-auto">
                  <Image
                    src={previewImage || "/placeholder.svg"}
                    alt="Card Back"
                    fill
                    className="object-cover rounded-md"
                    style={{ opacity: (cardBack?.opacity || 100) / 100 }}
                  />
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => document.getElementById("card-back-upload")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Change Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-white/50 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Upload Card Back Image</h3>
                <p className="text-white/70 mb-6 max-w-md">
                  Upload an image for the back of your cards. This will be used for all cards in the deck.
                </p>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => document.getElementById("card-back-upload")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
              </>
            )}
            <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="card-back-upload" />
          </div>

          <div>
            <Label htmlFor="back-bg-color">Background Color</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                id="back-bg-color"
                value={cardBack?.bgColor || "#2D2A4A"}
                onChange={(e) => handleChange("bgColor", e.target.value)}
                className="w-12 h-10 p-1 bg-transparent"
              />
              <Input
                type="text"
                value={cardBack?.bgColor || "#2D2A4A"}
                onChange={(e) => handleChange("bgColor", e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="back-border-color">Border Color</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                id="back-border-color"
                value={cardBack?.borderColor || "#FF7E67"}
                onChange={(e) => handleChange("borderColor", e.target.value)}
                className="w-12 h-10 p-1 bg-transparent"
              />
              <Input
                type="text"
                value={cardBack?.borderColor || "#FF7E67"}
                onChange={(e) => handleChange("borderColor", e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="back-border-width">Border Width</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="back-border-width"
                min={0}
                max={20}
                step={1}
                value={[cardBack?.borderWidth || 4]}
                onValueChange={(value) => handleChange("borderWidth", value[0])}
                className="flex-1"
              />
              <span className="w-8 text-center">{cardBack?.borderWidth || 4}px</span>
            </div>
          </div>

          <div>
            <Label htmlFor="back-border-radius">Border Radius</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="back-border-radius"
                min={0}
                max={30}
                step={1}
                value={[cardBack?.borderRadius || 12]}
                onValueChange={(value) => handleChange("borderRadius", value[0])}
                className="flex-1"
              />
              <span className="w-8 text-center">{cardBack?.borderRadius || 12}px</span>
            </div>
          </div>

          {cardBack?.image && (
            <>
              <div>
                <Label htmlFor="back-image-scale">Image Scale</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="back-image-scale"
                    min={100}
                    max={200}
                    step={5}
                    value={[cardBack?.imageScale || 100]}
                    onValueChange={(value) => handleChange("imageScale", value[0])}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{cardBack?.imageScale || 100}%</span>
                </div>
              </div>

              <div>
                <Label htmlFor="back-opacity">Image Opacity</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="back-opacity"
                    min={0}
                    max={100}
                    step={1}
                    value={[cardBack?.opacity || 100]}
                    onValueChange={(value) => handleChange("opacity", value[0])}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{cardBack?.opacity || 100}%</span>
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="back-pattern">Pattern</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {["none", "dots", "lines", "grid", "diamonds", "waves", "zigzag", "chevron"].map((pattern) => (
                <Button
                  key={pattern}
                  variant="outline"
                  size="sm"
                  className={`border-white/20 capitalize ${
                    cardBack?.pattern === pattern ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                  onClick={() => handleChange("pattern", pattern)}
                >
                  {pattern}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
