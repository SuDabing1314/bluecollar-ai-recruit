"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, ThumbsUp, Lightbulb, ArrowRight, RefreshCw, Home } from "lucide-react";
import { useUserStore } from "@/stores/user";
import { JOB_TYPES } from "@/data/jobs";

export default function InterviewResultPage() {
  const router = useRouter();
  const { interviewResult, profile } = useUserStore();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!interviewResult) {
      router.replace("/interview");
    } else {
      setTimeout(() => setAnimated(true), 100);
    }
  }, [interviewResult, router]);

  if (!interviewResult) return null;

  const jobLabel = JOB_TYPES.find((j) => j.value === interviewResult.jobType)?.label || "通用";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 pt-12 pb-8">
        <div className="text-center">
          <div className={`w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-700 ${animated ? "scale-100" : "scale-0"}`}>
            <Trophy size={40} className="text-yellow-300" />
          </div>
          <h1 className="text-white text-xl font-bold mb-1">面试完成！</h1>
          <p className="text-blue-100 text-sm">
            {jobLabel} · AI 评测报告
          </p>
        </div>
      </div>

      {/* 综合评分 */}
      <div className="px-4 -mt-5">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">综合评分</h2>
            <span className="text-xs text-gray-400">
              {new Date(interviewResult.date).toLocaleDateString("zh-CN")}
            </span>
          </div>

          <div className="flex items-end gap-3">
            <div className={`text-6xl font-bold text-blue-600 transition-all duration-1000 ${animated ? "opacity-100" : "opacity-0 translate-y-4"}`}>
              {interviewResult.overallScore}
            </div>
            <div className="text-blue-400 text-lg mb-2">分</div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">评价</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${star <= Math.ceil(interviewResult.overallScore / 20) ? "bg-yellow-400" : "bg-gray-200"}`}
                    style={{ transitionDelay: `${star * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 分项评分 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">分项表现</h2>
          <div className="space-y-4">
            {interviewResult.dimensions.map((dim, i) => (
              <div key={dim.name} className={`transition-all duration-500 ${animated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`} style={{ transitionDelay: `${300 + i * 100}ms` }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-gray-700">{dim.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{dim.score}分</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{
                      width: animated ? `${dim.score}%` : "0%",
                      transitionDelay: `${400 + i * 100}ms`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{dim.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 亮点 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ThumbsUp size={18} className="text-green-500" /> 面试亮点
          </h2>
          <div className="space-y-2">
            {interviewResult.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 建议 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb size={18} className="text-orange-500" /> 改进建议
          </h2>
          <div className="space-y-2">
            {interviewResult.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部操作 */}
      <div className="px-4 mt-6">
        <div className="space-y-3">
          <Link
            href="/jobs"
            className="block w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-base text-center flex items-center justify-center gap-2"
          >
            查看匹配职位 <ArrowRight size={18} />
          </Link>
          <div className="flex gap-3">
            <Link
              href="/interview"
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm text-center flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> 再练一次
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm text-center flex items-center justify-center gap-2"
            >
              <Home size={16} /> 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
