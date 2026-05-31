export interface TopicStruggle {
  id: string;
  course: string;
  topic: string;
  questions_asked: number;
  avg_confidence: number;
  struggling_students: number;
  questionsAsked?: number;
  avgConfidence?: number;
  strugglingStudents?: number;
  updated_at: string;
}

export interface HeatmapCell {
  topic: string;
  questionsAsked: number;
  avgConfidence: number;
  strugglingStudents: number;
  heatIntensity: number;
}
