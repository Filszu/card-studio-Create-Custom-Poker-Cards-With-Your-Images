"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface CardEditorProps {
  card: any
  onSave: (cardData: any) => void
  cardInfo: { suit: string; value: string }
}

export function CardEditor({ card, onSave, cardInfo }: CardEditorProps) {
  // Apply changes immediately without needing to click save
  const handleChange = (key: string, value: any) => {
    onSave({
      ...card,
      [key]: value,
    })
  }

  return (
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
                  value={[card.borderWidth || 4]}
                  onValueChange={(value) => handleChange("borderWidth", value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{card.borderWidth || 4}px</span>
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
                  value={[card.borderRadius || 12]}
                  onValueChange={(value) => handleChange("borderRadius", value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{card.borderRadius || 12}px</span>
              </div>
            </div>
          </div>

          {card.image && (
            <div>
              <Label htmlFor="image-scale">Image Scale</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="image-scale"
                  min={100}
                  max={200}
                  step={5}
                  value={[card.imageScale || 100]}
                  onValueChange={(value) => handleChange("imageScale", value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{card.imageScale || 100}%</span>
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
                value={[card.opacity || 100]}
                onValueChange={(value) => handleChange("opacity", value[0])}
                className="flex-1"
              />
              <span className="w-8 text-center">{card.opacity || 100}%</span>
            </div>
          </div>

          <div>
            <Label>Text Formatting</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="icon"
                className={`border-white/20 ${card.bold ? "bg-white/20" : "hover:bg-white/10"}`}
                onClick={() => handleChange("bold", !card.bold)}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`border-white/20 ${card.italic ? "bg-white/20" : "hover:bg-white/10"}`}
                onClick={() => handleChange("italic", !card.italic)}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`border-white/20 ${card.textAlign === "left" ? "bg-white/20" : "hover:bg-white/10"}`}
                onClick={() => handleChange("textAlign", "left")}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`border-white/20 ${card.textAlign === "center" ? "bg-white/20" : "hover:bg-white/10"}`}
                onClick={() => handleChange("textAlign", "center")}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`border-white/20 ${card.textAlign === "right" ? "bg-white/20" : "hover:bg-white/10"}`}
                onClick={() => handleChange("textAlign", "right")}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
