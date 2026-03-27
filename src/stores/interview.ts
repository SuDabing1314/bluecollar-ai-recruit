import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InterviewAnswer {
  questionId: string;
  /** 回答对应的职类（用于投递判断） */
  jobType: string;
  videoBlob: Blob | null;
  videoUrl: string | null;
  duration: number;
}

export interface InterviewResult {
  jobType: string;
  date: string;
  overallScore: number;
  dimensions: {
    name: string;
    score: number;
    detail: string;
  }[];
  highlights: string[];
  suggestions: string[];
}

interface InterviewStore {
  currentJobType: string | null;
  answers: InterviewAnswer[];
  currentQuestionIndex: number;
  isRecording: boolean;
  isSubmitting: boolean;

  startInterview: (jobType: string) => void;
  saveAnswer: (answer: InterviewAnswer) => void;
  nextQuestion: () => void;
  setRecording: (recording: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set, get) => ({
      currentJobType: null,
      answers: [],
      currentQuestionIndex: 0,
      isRecording: false,
      isSubmitting: false,

      startInterview: (jobType) =>
        set({
          currentJobType: jobType,
          answers: [],
          currentQuestionIndex: 0,
          isRecording: false,
          isSubmitting: false,
        }),
      saveAnswer: (answer) =>
        set((state) => {
          const answers = [...state.answers];
          answers[state.currentQuestionIndex] = {
            questionId: answer.questionId,
            jobType: state.currentJobType || answer.jobType,
            videoBlob: null, // Blob 不入 state，避免 persist 序列化失败
            videoUrl: answer.videoUrl,
            duration: answer.duration,
          };
          return { answers };
        }),
      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: state.currentQuestionIndex + 1,
          isRecording: false,
        })),
      setRecording: (recording) => set({ isRecording: recording }),
      setSubmitting: (submitting) => set({ isSubmitting: submitting }),
      reset: () =>
        set({
          currentJobType: null,
          answers: [],
          currentQuestionIndex: 0,
          isRecording: false,
          isSubmitting: false,
        }),
    }),
    {
      name: "bluecollar-interview-v2",
      partialize: (state) => {
        try {
          return {
            currentJobType: state.currentJobType,
            answers: state.answers.map((a) => ({
              questionId: a.questionId,
              jobType: a.jobType,
              videoBlob: null as null,
              videoUrl: a.videoUrl,
              duration: a.duration,
            })),
            currentQuestionIndex: state.currentQuestionIndex,
            isRecording: false,
            isSubmitting: false,
          };
        } catch {
          // 序列化失败返回安全空状态
          return {
            currentJobType: null,
            answers: [],
            currentQuestionIndex: 0,
            isRecording: false,
            isSubmitting: false,
          };
        }
      },
    }
  )
);
