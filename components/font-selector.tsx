"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface FontSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
  const fonts = [
    { name: "Default", value: "sans-serif" },
    { name: "Serif", value: "serif" },
    { name: "Monospace", value: "monospace" },
    { name: "Cursive", value: "cursive" },
    { name: "Fantasy", value: "fantasy" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Tahoma", value: "Tahoma, sans-serif" },
    { name: "Times New Roman", value: "'Times New Roman', serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Courier New", value: "'Courier New', monospace" },
    { name: "Brush Script", value: "'Brush Script MT', cursive" },
  ]

  return (
    <div className="space-y-2">
      <Label htmlFor="font-family">Font Family</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="font-family" className="bg-white/10 border-white/20 text-white">
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {fonts.map((font) => (
            <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
