"use client"

import { useState } from "react"
import { VideoUploader } from "./video-uploader"
import { TranscriptEditor } from "./transcript-editor"
import { VideoPreview } from "./video-preview"
import { mockProcessVideo } from "@/lib/mock-api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export type VideoData = {
  videoUrl: string
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
}

export const VideoHighlightTool = () => {
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const { toast } = useToast()

  const handleVideoUpload = async (file: File) => {
    try {
      setIsProcessing(true)
      // Create a URL for the uploaded video
      const videoUrl = URL.createObjectURL(file)

      // Process the video with our mock API
      const processedData = await mockProcessVideo(file)

      // Set the video data with the URL and processed transcript
      setVideoData({
        videoUrl,
        transcript: processedData,
      })

      toast({
        title: "Video processed successfully",
        description: "Your video has been processed and is ready for editing.",
      })
    } catch (error) {
      toast({
        title: "Error processing video",
        description: "There was an error processing your video. Please try again.",
        variant: "destructive",
      })
      console.error("Error processing video:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleHighlight = (sectionId: string, sentenceId: string) => {
    if (!videoData) return

    setVideoData({
      ...videoData,
      transcript: {
        sections: videoData.transcript.sections.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              sentences: section.sentences.map((sentence) => {
                if (sentence.id === sentenceId) {
                  return {
                    ...sentence,
                    isHighlighted: !sentence.isHighlighted,
                  }
                }
                return sentence
              }),
            }
          }
          return section
        }),
      },
    })
  }

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time)
  }

  const getHighlightedSentences = () => {
    if (!videoData) return []

    const highlighted: {
      id: string
      text: string
      startTime: number
      endTime: number
    }[] = []

    videoData.transcript.sections.forEach((section) => {
      section.sentences.forEach((sentence) => {
        if (sentence.isHighlighted) {
          highlighted.push({
            id: sentence.id,
            text: sentence.text,
            startTime: sentence.startTime,
            endTime: sentence.endTime,
          })
        }
      })
    })

    // Sort by start time
    return highlighted.sort((a, b) => a.startTime - b.startTime)
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Processing your video...</p>
        <p className="text-muted-foreground">This may take a moment</p>
      </div>
    )
  }

  if (!videoData) {
    return <VideoUploader onUpload={handleVideoUpload} />
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-2 md:h-[calc(100vh-200px)]">
      <div className="md:w-1/2 h-full overflow-scroll">
        <TranscriptEditor
          transcript={videoData.transcript}
          currentTime={currentTime}
          onToggleHighlight={toggleHighlight}
          onSeek={(time) => setCurrentTime(time)}
        />
      </div>
      <div className="md:w-1/2 h-full">
        <VideoPreview
          videoUrl={videoData.videoUrl}
          highlightedSentences={getHighlightedSentences()}
          currentTime={currentTime}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
    </div>
  )
}

