import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  phone: string;
  name: string;
  age?: number;
  city?: string;
  jobTypes: string[];
  expectedSalary?: number;
  documents: {
    hasHealthCert: boolean;
    hasDriverLicense: boolean;
    hasEquipmentCert: boolean;
  };
}

export interface InterviewAnswer {
  questionId: string;
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
  /** 面试视频答案（投递用），reset 前转移到这里永久保存 */
  answers: {
    questionId: string;
    jobType: string;
    videoUrl: string | null;
    duration: number;
  }[];
  videoHighlightsUrl?: string;
}

export interface JobApplication {
  jobId: string;
  jobTitle: string;
  company: string;
  salary: number;
  location: string;
  appliedAt: string;
  status: "pending" | "viewed" | "interview" | "hired" | "rejected";
}

interface UserStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  currentInterview: {
    jobType: string;
    answers: InterviewAnswer[];
    currentQuestion: number;
  } | null;
  startInterview: (jobType: string) => void;
  saveAnswer: (answer: InterviewAnswer) => void;
  nextQuestion: () => void;
  finishInterview: () => void;
  interviewResult: InterviewResult | null;
  setInterviewResult: (result: InterviewResult) => void;
  applications: JobApplication[];
  addApplication: (job: JobApplication) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),

      currentInterview: null,
      startInterview: (jobType) =>
        set({
          currentInterview: {
            jobType,
            answers: [],
            currentQuestion: 0,
          },
        }),
      saveAnswer: (answer) =>
        set((state) => {
          if (!state.currentInterview) return state;
          const answers = [...state.currentInterview.answers];
          // Blob 不入 state，避免 persist 序列化失败
          answers[state.currentInterview.currentQuestion] = {
            questionId: answer.questionId,
            videoBlob: null,
            videoUrl: answer.videoUrl,
            duration: answer.duration,
          };
          return {
            currentInterview: {
              ...state.currentInterview,
              answers,
            },
          };
        }),
      nextQuestion: () =>
        set((state) => {
          if (!state.currentInterview) return state;
          return {
            currentInterview: {
              ...state.currentInterview,
              currentQuestion: state.currentInterview.currentQuestion + 1,
            },
          };
        }),
      finishInterview: () =>
        set({
          currentInterview: null,
        }),

      interviewResult: null,
      setInterviewResult: (result) => set({ interviewResult: result }),

      applications: [],
      addApplication: (job) =>
        set((state) => ({
          applications: [job, ...state.applications],
        })),
      reset: () =>
        set({
          profile: null,
          currentInterview: null,
          interviewResult: null,
          applications: [],
        }),
    }),
    {
      name: "bluecollar-user-v2", // 改名触发旧数据重建
      // 防御：任何序列化错误都不阻断 profile 和 applications 的保存
      onRehydrateStorage: () => (state) => {
        // rehydrate 后清掉潜在的有问题的 field
      },
      partialize: (state) => {
        try {
          return {
            profile: state.profile,
            applications: state.applications,
            interviewResult: state.interviewResult,
          };
        } catch {
          return { profile: state.profile, applications: [], interviewResult: null };
        }
      },
    }
  )
);
