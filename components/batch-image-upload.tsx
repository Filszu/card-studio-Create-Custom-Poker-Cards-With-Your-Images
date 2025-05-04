"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface BatchImageUploadProps {
  onUpload: (images: { cardId: string; image: string; name: string }[]) => void
}

export function BatchImageUpload({ onUpload }: BatchImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files)
    setSelectedFiles((prev) => [...prev, ...newFiles])

    // Create preview URLs
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls])

    // Reset the input value to allow selecting the same files again
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index])

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) return

    // Card suits and values
    const suits = ["hearts", "diamonds", "clubs", "spades"]
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

    // Map files to cards
    const cardImages = selectedFiles.map((file, index) => {
      // Calculate suit and value based on index
      const suitIndex = Math.floor(index / values.length) % suits.length
      const valueIndex = index % values.length

      return {
        cardId: `${suits[suitIndex]}-${values[valueIndex]}`,
        image: previewUrls[index],
        name: file.name,
      }
    })

    onUpload(cardImages)

    // Clean up
    setSelectedFiles([])
    setPreviewUrls([])
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6">
        <div className="space-y-6 text-white">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-white/50 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Batch Upload Images</h3>
            <p className="text-white/70 mb-6 max-w-md">
              Upload multiple images at once. Images will be assigned to cards in order.
            </p>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="batch-image-upload"
            />
            <Label
              htmlFor="batch-image-upload"
              className="bg-[#FF7E67] hover:bg-[#FF7E67]/90 text-white py-2 px-4 rounded-md cursor-pointer"
            >
              Select Images
            </Label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Selected Images ({selectedFiles.length})</h3>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={handleUpload}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Apply to Cards
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto p-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square relative rounded-md overflow-hidden">
                      <Image src={url || "/placeholder.svg"} alt={`Preview ${index}`} fill className="object-cover" />
                    </div>
                    <button
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="text-xs text-white/70 truncate mt-1">{selectedFiles[index].name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
