"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"

interface VideoPreviewProps {
  videoUrl: string
  highlightedSentences: {
    id: string
    text: string
    startTime: number
    endTime: number
  }[]
  currentTime: number
  onTimeUpdate: (time: number) => void
}

export const VideoPreview = ({ videoUrl, highlightedSentences, currentTime, onTimeUpdate }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentSentence, setCurrentSentence] = useState<string | null>(null)
  const [highlightClips, setHighlightClips] = useState<{ start: number; end: number }[]>([])
  const [currentClipIndex, setCurrentClipIndex] = useState(0)

  // Process highlighted sentences into clips
  useEffect(() => {
    if (highlightedSentences.length === 0) {
      setHighlightClips([])
      return
    }

    // Merge adjacent or overlapping sentences into continuous clips
    const clips: { start: number; end: number }[] = []
    let currentClip: { start: number; end: number } | null = null

    highlightedSentences.forEach((sentence) => {
      if (!currentClip) {
        currentClip = { start: sentence.startTime, end: sentence.endTime }
      } else if (sentence.startTime <= currentClip.end + 0.5) {
        // If this sentence starts before or just after the current clip ends, extend the clip
        currentClip.end = Math.max(currentClip.end, sentence.endTime)
      } else {
        // Otherwise, finish the current clip and start a new one
        clips.push(currentClip)
        currentClip = { start: sentence.startTime, end: sentence.endTime }
      }
    })

    if (currentClip) {
      clips.push(currentClip)
    }

    setHighlightClips(clips)
  }, [highlightedSentences])

  // Handle video metadata loaded
  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  // Handle time update from video player
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime
      onTimeUpdate(time)

      // Find the current sentence being played
      const sentence = highlightedSentences.find((s) => time >= s.startTime && time <= s.endTime)
      setCurrentSentence(sentence?.text || null)

      // Handle clip transitions
      if (highlightClips.length > 0) {
        const currentClip = highlightClips[currentClipIndex]
        if (time > currentClip.end) {
          // Move to the next clip if available
          if (currentClipIndex < highlightClips.length - 1) {
            setCurrentClipIndex(currentClipIndex + 1)
            if (videoRef.current) {
              videoRef.current.currentTime = highlightClips[currentClipIndex + 1].start
            }
          } else {
            // End of all clips, pause the video
            setIsPlaying(false)
            if (videoRef.current) {
              videoRef.current.pause()
            }
          }
        }
      }
    }
  }

  // Sync video player with external currentTime
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime
    }
  }, [currentTime])

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        // If we have highlight clips and not currently playing, start from the first clip
        if (highlightClips.length > 0 && !isPlaying) {
          videoRef.current.currentTime = highlightClips[0].start
          setCurrentClipIndex(0)
        }
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Skip to next highlight
  const skipNext = () => {
    if (highlightClips.length > 0 && currentClipIndex < highlightClips.length - 1) {
      setCurrentClipIndex(currentClipIndex + 1)
      if (videoRef.current) {
        videoRef.current.currentTime = highlightClips[currentClipIndex + 1].start
        if (!isPlaying) {
          videoRef.current.play()
          setIsPlaying(true)
        }
      }
    }
  }

  // Skip to previous highlight
  const skipPrevious = () => {
    if (highlightClips.length > 0 && currentClipIndex > 0) {
      setCurrentClipIndex(currentClipIndex - 1)
      if (videoRef.current) {
        videoRef.current.currentTime = highlightClips[currentClipIndex - 1].start
        if (!isPlaying) {
          videoRef.current.play()
          setIsPlaying(true)
        }
      }
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      onTimeUpdate(value[0])
    }
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Highlight Preview</h2>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="relative flex-1 bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleMetadataLoaded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Text overlay */}
          {currentSentence && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/70 text-white text-center">
              <p className="text-lg font-medium">{currentSentence}</p>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Timeline visualization */}
          <div className="mb-4 relative h-8">
            <div className="absolute inset-0 bg-muted rounded-md"></div>
            {highlightClips.map((clip, index) => (
              <div
                key={index}
                className={`absolute h-full rounded-md ${index === currentClipIndex ? "bg-primary" : "bg-primary/60"}`}
                style={{
                  left: `${(clip.start / duration) * 100}%`,
                  width: `${((clip.end - clip.start) / duration) * 100}%`,
                }}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = clip.start
                    setCurrentClipIndex(index)
                  }
                }}
              ></div>
            ))}
          </div>

          {/* Video controls */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-12">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                min={0}
                max={duration}
                step={0.1}
                onValueChange={handleSliderChange}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">{formatTime(duration)}</span>
            </div>

            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={skipPrevious}
                disabled={highlightClips.length === 0 || currentClipIndex === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button variant="default" size="icon" className="h-10 w-10" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={skipNext}
                disabled={highlightClips.length === 0 || currentClipIndex === highlightClips.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {highlightClips.length > 0 ? (
                <span>
                  Highlight {currentClipIndex + 1} of {highlightClips.length}
                </span>
              ) : (
                <span>No highlights selected</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

