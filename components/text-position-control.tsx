"use client"

import { Button } from "@/components/ui/button"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
} from "lucide-react"

interface TextPositionControlProps {
  textAlign: string
  verticalAlign: string
  onChange: (key: string, value: string) => void
}

export function TextPositionControl({ textAlign, verticalAlign, onChange }: TextPositionControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm text-white/70">Horizontal Alignment</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className={`border-white/20 ${textAlign === "left" ? "bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => onChange("textAlign", "left")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`border-white/20 ${textAlign === "center" ? "bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => onChange("textAlign", "center")}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`border-white/20 ${textAlign === "right" ? "bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => onChange("textAlign", "right")}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-between mt-4">
        <span className="text-sm text-white/70">Vertical Alignment</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className={`border-white/20 ${verticalAlign === "top" ? "bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => onChange("verticalAlign", "top")}
        >
          <AlignStartVertical className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`border-white/20 ${verticalAlign === "middle" ? "bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => onChange("verticalAlign", "middle")}
        >
          <AlignCenterVertical className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`border-white/20 ${verticalAlign === "bottom" ? "bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => onChange("verticalAlign", "bottom")}
        >
          <AlignEndVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
