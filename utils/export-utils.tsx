"use client"

import html2canvas from "html2canvas"
import JSZip from "jszip"
import FileSaver from "file-saver"

export async function exportCardAsImage(cardElement: HTMLElement, filename: string): Promise<string | null> {
  try {
    const canvas = await html2canvas(cardElement, {
      backgroundColor: null,
      scale: 2, // Higher quality
      logging: false,
    })

    const dataUrl = canvas.toDataURL("image/png")

    // For direct download
    const link = document.createElement("a")
    link.download = `${filename}.png`
    link.href = dataUrl
    link.click()

    return dataUrl
  } catch (error) {
    console.error("Error exporting card:", error)
    alert("Failed to export card. Please try again.")
    return null
  }
}

export async function exportDeckAsZip(cardElements: HTMLElement[], cardNames: string[], deckName: string) {
  try {
    // Create status indicator
    const statusElement = document.createElement("div")
    statusElement.className = "fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50"
    document.body.appendChild(statusElement)

    statusElement.textContent = "Generating card images..."

    // Step 1: Generate all card images first and collect them as blobs
    const cardBlobs: { name: string; blob: Blob }[] = []

    for (let i = 0; i < cardElements.length; i++) {
      statusElement.textContent = `Generating card ${i + 1} of ${cardElements.length}...`

      try {
        // Ensure the element is visible for rendering
        const originalDisplay = cardElements[i].style.display
        cardElements[i].style.display = "block"

        // Hide any buttons that might be in the card (like flip buttons)
        const buttons = cardElements[i].querySelectorAll("button")
        buttons.forEach((button) => {
          button.style.display = "none"
        })

        const canvas = await html2canvas(cardElements[i], {
          backgroundColor: null,
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        })

        // Restore original display
        cardElements[i].style.display = originalDisplay
        buttons.forEach((button) => {
          button.style.display = ""
        })

        // Convert canvas to blob directly
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (blob) => {
              resolve(blob!)
            },
            "image/png",
            1.0,
          )
        })

        cardBlobs.push({
          name: cardNames[i],
          blob: blob,
        })
      } catch (err) {
        console.error(`Error generating card ${cardNames[i]}:`, err)
      }
    }

    // Step 2: Create the zip file
    statusElement.textContent = "Creating zip file..."

    const zip = new JSZip()

    // Add each card to the zip
    cardBlobs.forEach(({ name, blob }) => {
      zip.file(`${name}.png`, blob)
    })

    // Generate and save the zip file
    statusElement.textContent = "Finalizing and downloading..."

    const content = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    })

    FileSaver.saveAs(content, `${deckName}.zip`)

    // Clean up
    statusElement.textContent = "Download complete!"
    setTimeout(() => {
      document.body.removeChild(statusElement)
    }, 2000)
  } catch (error) {
    console.error("Error exporting deck:", error)
    alert("Failed to export deck. Please try again.")
  }
}
