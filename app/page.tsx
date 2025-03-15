import { VideoHighlightTool } from "@/components/video-highlight-tool"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Video Highlight Tool</h1>
        <p className="text-muted-foreground mb-8">
          Upload a video, select highlights from the transcript, and create a highlight clip.
        </p>
        <VideoHighlightTool />
      </div>
    </main>
  )
}

