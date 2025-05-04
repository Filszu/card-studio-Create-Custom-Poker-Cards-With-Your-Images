"use client"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface CardTemplate {
  id: string
  name: string
  preview: {
    bgColor: string
    borderColor: string
    borderWidth: number
    borderRadius: number
    textColor: string
    fontFamily: string
    symbolSize: number
    textShadow: number
  }
}

interface CardTemplatesProps {
  onSelectTemplate: (template: any) => void
}

export function CardTemplates({ onSelectTemplate }: CardTemplatesProps) {
  const templates: CardTemplate[] = [
    {
      id: "classic",
      name: "Classic",
      preview: {
        bgColor: "#FFFFFF",
        borderColor: "#000000",
        borderWidth: 2,
        borderRadius: 8,
        textColor: "#000000",
        fontFamily: "serif",
        symbolSize: 18,
        textShadow: 0,
      },
    },
    {
      id: "modern",
      name: "Modern",
      preview: {
        bgColor: "#2D2A4A",
        borderColor: "#FF7E67",
        borderWidth: 4,
        borderRadius: 12,
        textColor: "#FFFFFF",
        fontFamily: "sans-serif",
        symbolSize: 16,
        textShadow: 2,
      },
    },
    {
      id: "neon",
      name: "Neon",
      preview: {
        bgColor: "#121212",
        borderColor: "#00FF99",
        borderWidth: 3,
        borderRadius: 10,
        textColor: "#00FF99",
        fontFamily: "monospace",
        symbolSize: 16,
        textShadow: 5,
      },
    },
    {
      id: "vintage",
      name: "Vintage",
      preview: {
        bgColor: "#E8D0A9",
        borderColor: "#B45309",
        borderWidth: 5,
        borderRadius: 0,
        textColor: "#78350F",
        fontFamily: "'Times New Roman', serif",
        symbolSize: 18,
        textShadow: 1,
      },
    },
    {
      id: "minimalist",
      name: "Minimalist",
      preview: {
        bgColor: "#F9FAFB",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        borderRadius: 16,
        textColor: "#111827",
        fontFamily: "Arial, sans-serif",
        symbolSize: 14,
        textShadow: 0,
      },
    },
    {
      id: "dark",
      name: "Dark Mode",
      preview: {
        bgColor: "#1F2937",
        borderColor: "#4B5563",
        borderWidth: 2,
        borderRadius: 8,
        textColor: "#F3F4F6",
        fontFamily: "sans-serif",
        symbolSize: 16,
        textShadow: 3,
      },
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectTemplate(template.preview)}
          >
            <CardContent className="p-4">
              <div
                className="aspect-[2.5/3.5] rounded-lg mb-2"
                style={{
                  backgroundColor: template.preview.bgColor,
                  borderRadius: `${template.preview.borderRadius}px`,
                  border: `${template.preview.borderWidth}px solid ${template.preview.borderColor}`,
                }}
              >
                <div className="flex justify-between p-2">
                  <div
                    className="text-xl"
                    style={{
                      color: template.preview.textColor,
                      fontFamily: template.preview.fontFamily,
                      textShadow: template.preview.textShadow
                        ? `0 0 ${template.preview.textShadow}px rgba(0,0,0,0.5)`
                        : "none",
                    }}
                  >
                    A<span className="ml-1">♠</span>
                  </div>
                  <div
                    className="text-xl"
                    style={{
                      color: template.preview.textColor,
                      fontFamily: template.preview.fontFamily,
                      textShadow: template.preview.textShadow
                        ? `0 0 ${template.preview.textShadow}px rgba(0,0,0,0.5)`
                        : "none",
                    }}
                  >
                    ♠
                  </div>
                </div>
              </div>
              <div className="text-center text-sm font-medium text-white">{template.name}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
