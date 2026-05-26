/**
 * Quiz utilities — centralized quiz data retrieval from data.json
 * This layer abstracts the data loading so components stay clean
 */

import data from "./data.json";
import type { QuizData } from "./types";

// Type helper for data.json structure
interface DataStore {
  quizzes: QuizData[];
  courses: any[];
  modules: any[];
  recommendations: any[];
}

const typedData = data as DataStore;

/**
 * Get all quizzes from the data store
 */
export function getAllQuizzes(): QuizData[] {
  return typedData.quizzes || [];
}

/**
 * Get a specific quiz by courseId
 * @param courseId - The course ID to find the quiz for
 * @returns Quiz data or undefined if not found
 */
export function getQuizByCourseId(courseId: string): QuizData | undefined {
  return typedData.quizzes?.find((quiz) => quiz.courseId === courseId);
}

/**
 * Get all questions for a specific quiz
 * @param courseId - The course ID
 * @returns Array of quiz questions or empty array
 */
export function getQuizQuestions(courseId: string) {
  const quiz = getQuizByCourseId(courseId);
  return quiz?.questions || [];
}

// Export the quizData as a Record for backward compatibility
export const quizData: Record<string, QuizData> = (() => {
  const record: Record<string, QuizData> = {};
  typedData.quizzes.forEach((quiz) => {
    record[quiz.courseId] = quiz;
  });
  return record;
})();
