"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"

interface TranscriptEditorProps {
  transcript: {
    sections: {
      id: string
      title: string
      sentences: {
        id: string
        text: string
        startTime: number
        endTime: number
        isHighlighted: boolean
        isSuggested: boolean
      }[]
    }[]
  }
  currentTime: number
  onToggleHighlight: (sectionId: string, sentenceId: string) => void
  onSeek: (time: number) => void
}

export const TranscriptEditor = ({ transcript, currentTime, onToggleHighlight, onSeek }: TranscriptEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeSentenceRef = useRef<HTMLDivElement>(null)

  // Find the active sentence based on current time
  const findActiveSentence = () => {
    for (const section of transcript.sections) {
      for (const sentence of section.sentences) {
        if (currentTime >= sentence.startTime && currentTime <= sentence.endTime) {
          return { sectionId: section.id, sentenceId: sentence.id }
        }
      }
    }
    return null
  }

  const activeSentence = findActiveSentence()

  // Auto-scroll to keep the active sentence visible
  useEffect(() => {
    if (activeSentence && activeSentenceRef.current && containerRef.current) {
      const container = containerRef.current
      const element = activeSentenceRef.current

      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()

      if (elementRect.bottom > containerRect.bottom || elementRect.top < containerRect.top) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }, [activeSentence])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Transcript</h2>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto pr-2 space-y-6">
        {transcript.sections.map((section) => (
          <Card key={section.id} className="border border-border">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4 space-y-3">
              {section.sentences.map((sentence) => (
                <div
                  key={sentence.id}
                  ref={
                    activeSentence?.sectionId === section.id && activeSentence?.sentenceId === sentence.id
                      ? activeSentenceRef
                      : null
                  }
                  className={`flex items-start gap-3 p-2 rounded-md transition-colors ${
                    activeSentence?.sectionId === section.id && activeSentence?.sentenceId === sentence.id
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    id={`highlight-${section.id}-${sentence.id}`}
                    checked={sentence.isHighlighted}
                    onCheckedChange={() => onToggleHighlight(section.id, sentence.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => onSeek(sentence.startTime)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(sentence.startTime)}
                      </Button>

                      {sentence.isSuggested && (
                        <Badge variant="outline" className="bg-primary/10 h-6 px-2">
                          <Star className="h-3 w-3 mr-1 text-primary" />
                          Suggested
                        </Badge>
                      )}
                    </div>
                    <label
                      htmlFor={`highlight-${section.id}-${sentence.id}`}
                      className={`text-sm ${sentence.isHighlighted ? "font-medium" : ""}`}
                    >
                      {sentence.text}
                    </label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

