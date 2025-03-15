// This file simulates an AI processing API for video transcription and highlight suggestions

// Helper function to generate a random ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 9)
}

// Helper function to format time in seconds
const formatTimeToSeconds = (minutes: number, seconds: number) => {
  return minutes * 60 + seconds
}

// Mock function to process a video and return transcript data
export const mockProcessVideo = async (file: File) => {
  // Simulate API processing time
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock transcript data
  const mockTranscript = {
    sections: [
      {
        id: generateId(),
        title: "Introduction to the Project",
        sentences: [
          {
            id: generateId(),
            text: "Hello everyone, today I'm going to talk about our new product launch.",
            startTime: formatTimeToSeconds(0, 0),
            endTime: formatTimeToSeconds(0, 5),
            isHighlighted: false,
            isSuggested: true,
          },
          {
            id: generateId(),
            text: "We've been working on this for the past six months and we're really excited to share it with you.",
            startTime: formatTimeToSeconds(0, 5),
            endTime: formatTimeToSeconds(0, 11),
            isHighlighted: false,
            isSuggested: false,
          },
          {
            id: generateId(),
            text: "This product represents a major step forward in our company's vision.",
            startTime: formatTimeToSeconds(0, 11),
            endTime: formatTimeToSeconds(0, 16),
            isHighlighted: false,
            isSuggested: true,
          },
        ],
      },
      {
        id: generateId(),
        title: "Key Features and Benefits",
        sentences: [
          {
            id: generateId(),
            text: "The first key feature is the improved user interface.",
            startTime: formatTimeToSeconds(0, 16),
            endTime: formatTimeToSeconds(0, 20),
            isHighlighted: false,
            isSuggested: false,
          },
          {
            id: generateId(),
            text: "We've completely redesigned it based on user feedback and usability testing.",
            startTime: formatTimeToSeconds(0, 20),
            endTime: formatTimeToSeconds(0, 25),
            isHighlighted: false,
            isSuggested: false,
          },
          {
            id: generateId(),
            text: "Second, we've added powerful AI capabilities that make the product much more intuitive.",
            startTime: formatTimeToSeconds(0, 25),
            endTime: formatTimeToSeconds(0, 31),
            isHighlighted: false,
            isSuggested: true,
          },
          {
            id: generateId(),
            text: "This means users can accomplish tasks in half the time compared to our previous version.",
            startTime: formatTimeToSeconds(0, 31),
            endTime: formatTimeToSeconds(0, 37),
            isHighlighted: false,
            isSuggested: false,
          },
        ],
      },
      {
        id: generateId(),
        title: "Market Analysis and Competition",
        sentences: [
          {
            id: generateId(),
            text: "Looking at the market, we're positioned uniquely compared to our competitors.",
            startTime: formatTimeToSeconds(0, 37),
            endTime: formatTimeToSeconds(0, 42),
            isHighlighted: false,
            isSuggested: false,
          },
          {
            id: generateId(),
            text: "Our research shows that customers are looking for exactly the solution we've built.",
            startTime: formatTimeToSeconds(0, 42),
            endTime: formatTimeToSeconds(0, 48),
            isHighlighted: false,
            isSuggested: true,
          },
          {
            id: generateId(),
            text: "We expect to capture significant market share within the first quarter after launch.",
            startTime: formatTimeToSeconds(0, 48),
            endTime: formatTimeToSeconds(0, 54),
            isHighlighted: false,
            isSuggested: false,
          },
        ],
      },
      {
        id: generateId(),
        title: "Launch Timeline and Strategy",
        sentences: [
          {
            id: generateId(),
            text: "We'll be launching the product next month with a major online event.",
            startTime: formatTimeToSeconds(0, 54),
            endTime: formatTimeToSeconds(1, 0),
            isHighlighted: false,
            isSuggested: true,
          },
          {
            id: generateId(),
            text: "The marketing team has prepared an extensive campaign across multiple channels.",
            startTime: formatTimeToSeconds(1, 0),
            endTime: formatTimeToSeconds(1, 6),
            isHighlighted: false,
            isSuggested: false,
          },
          {
            id: generateId(),
            text: "We're also partnering with several influencers to maximize our reach.",
            startTime: formatTimeToSeconds(1, 6),
            endTime: formatTimeToSeconds(1, 11),
            isHighlighted: false,
            isSuggested: false,
          },
        ],
      },
      {
        id: generateId(),
        title: "Conclusion and Next Steps",
        sentences: [
          {
            id: generateId(),
            text: "In conclusion, this product launch represents a major milestone for our company.",
            startTime: formatTimeToSeconds(1, 11),
            endTime: formatTimeToSeconds(1, 16),
            isHighlighted: false,
            isSuggested: true,
          },
          {
            id: generateId(),
            text: "I want to thank the entire team for their hard work and dedication.",
            startTime: formatTimeToSeconds(1, 16),
            endTime: formatTimeToSeconds(1, 21),
            isHighlighted: false,
            isSuggested: false,
          },
          {
            id: generateId(),
            text: "We're excited to see how users respond and we're already planning the next phase of development.",
            startTime: formatTimeToSeconds(1, 21),
            endTime: formatTimeToSeconds(1, 28),
            isHighlighted: false,
            isSuggested: true,
          },
        ],
      },
    ],
  }

  return mockTranscript
}

