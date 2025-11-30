// DTOs for API communication
export interface SessionCreateDto {
  startDate: string;        // ISO 8601 date string
  endDate: string;          // ISO 8601 date string
  score: number;            // Overall score
  goodScore: number;        // Good posture score
  badScore: number;         // Bad posture score
  goodPostureTime: number;  // Time in seconds
  badPostureTime: number;   // Time in seconds
  duration: number;         // Total duration in seconds
  numberOfPauses: number;   // Count of pauses
  averagePauseDuration: number; // Average pause duration in seconds
}

// API Response types
export interface SessionResponse {
  id: number;
  startDate: string;        // ISO 8601 date string
  endDate: string;          // ISO 8601 date string
  score: number;
  goodScore: number;
  badScore: number;
  goodPostureTime: number;  // Time in seconds
  badPostureTime: number;   // Time in seconds
  duration: number;         // Total duration in seconds
  numberOfPauses: number;
  averagePauseDuration: number; // Average pause duration in seconds
}

export interface SessionDetailResponse extends SessionResponse {
  // Additional details if needed
}

// Frontend display models
export interface SessionSummary {
  id: string;
  date: string;
  duration: string;
}

export interface SessionDetail {
  id: string;
  date: string;
  duration: string;
  posture: {
    goodPercent: number;
    badPercent: number;
    goodTime: string;
    badTime: string;
  };
  pauses: {
    count: number;
    avgTime: string;
    totalTime: string;
  };
}
