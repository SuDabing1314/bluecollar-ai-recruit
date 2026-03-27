"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Video, CheckCircle } from "lucide-react";
import { useUserStore } from "@/stores/user";
import { useInterviewStore } from "@/stores/interview";
import { JOB_TYPES } from "@/data/jobs";
import { QUESTION_BANKS } from "@/data/questions";

export default function InterviewListPage() {
  const router = useRouter();
  const { profile } = useUserStore();
  const { currentJobType, answers, startInterview } = useInterviewStore();

  useEffect(() => {
    if (!profile) {
      router.replace("/register");
    }
  }, [profile, router]);

  const handleStart = (jobType: string) => {
    startInterview(jobType);
    router.push(`/interview/${jobType}`);
  };

  const hasInProgress = currentJobType && answers.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部 */}
      <div className="bg-blue-600 px-4 pt-12 pb-6">
        <h1 className="text-white text-xl font-bold">AI 视频面试</h1>
        <p className="text-blue-100 text-sm mt-1">
          选一个工种，练习 5 道题，获得专属评测报告
        </p>
      </div>

      {/* 进行中的面试 */}
      {hasInProgress && (
        <div className="px-4 mt-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-orange-700 text-sm font-medium mb-3">
              ⏳ 你有未完成的面试
            </p>
            <button
              onClick={() => router.push(`/interview/${currentJobType}`)}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-sm"
            >
              继续面试
            </button>
          </div>
        </div>
      )}

      {/* 工种列表 */}
      <div className="px-4 mt-4">
        <h2 className="text-sm font-medium text-gray-500 mb-3">选择工种类型</h2>
        <div className="space-y-3">
          {JOB_TYPES.map((job) => {
            const questions = QUESTION_BANKS[job.value] || [];
            return (
              <button
                key={job.value}
                onClick={() => handleStart(job.value)}
                className="w-full bg-white rounded-xl p-4 text-left shadow-sm active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                    {job.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {job.label}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {questions.length} 道面试题 · 约{Math.ceil(questions.reduce((acc: number, q: { duration: number }) => acc + q.duration, 0) / 60)}分钟
                    </p>
                  </div>
                  <Video size={18} className="text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 说明 */}
      <div className="px-4 mt-6">
        <div className="bg-gray-100 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">面试流程</h3>
          <div className="space-y-2">
            {[
              "选择工种，进入对应面试题",
              "每道题有准备时间，录制备答案",
              "AI 分析你的表现，生成专属报告",
              "获得报告后，可直接投递简历",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] flex-shrink-0">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
