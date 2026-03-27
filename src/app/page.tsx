"use client";

import Link from "next/link";
import { ArrowRight, Shield, Zap, TrendingUp, Video, Briefcase, MessageCircle } from "lucide-react";
import { useUserStore } from "@/stores/user";

export default function HomePage() {
  const { profile } = useUserStore();

  const features = [
    {
      icon: Zap,
      title: "AI视频面试",
      desc: "录一段视频，让招聘方更了解你",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Shield,
      title: "AI评测报告",
      desc: "获得专业的面试反馈和改进建议",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: TrendingUp,
      title: "精准岗位推荐",
      desc: "基于你的情况，AI推荐最适合的职位",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  // 已注册用户专属首页
  if (profile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 pt-12 pb-8">
          <h1 className="text-2xl font-bold text-white">
            你好{profile.name || "职粉"}
          </h1>
          <p className="text-blue-100 text-sm mt-0.5">找到适合自己的好工作</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Link
              href="/jobs"
              className="bg-white/15 backdrop-blur rounded-xl p-3 text-center flex flex-col items-center gap-1.5"
            >
              <Briefcase size={22} className="text-white" />
              <span className="text-white text-xs font-medium">找职位</span>
            </Link>
            <Link
              href="/interview"
              className="bg-white/15 backdrop-blur rounded-xl p-3 text-center flex flex-col items-center gap-1.5"
            >
              <Video size={22} className="text-white" />
              <span className="text-white text-xs font-medium">AI面试</span>
            </Link>
            <Link
              href="/chat"
              className="bg-white/15 backdrop-blur rounded-xl p-3 text-center flex flex-col items-center gap-1.5"
            >
              <MessageCircle size={22} className="text-white" />
              <span className="text-white text-xs font-medium">在线聊</span>
            </Link>
          </div>
        </div>
        <div className="px-5 mt-8 mb-24">
          <h2 className="text-lg font-bold text-gray-900 mb-4">推荐职位</h2>
          <Link
            href="/jobs"
            className="block bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏭</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">工厂操作工 · 苏州电子厂</h3>
                <p className="text-xs text-gray-500 mt-0.5">制造业 · 距离2.3km · 包吃住</p>
              </div>
              <div className="text-right">
                <div className="text-blue-600 font-bold">¥6000</div>
                <div className="text-[10px] text-gray-400">/月</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // 未注册用户落地页
  return (
    <div className="min-h-screen bg-white">
      {/* 顶部背景 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 pt-12 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">职速达</h1>
            <p className="text-blue-100 text-sm mt-0.5">AI驱动·精准匹配·快速上岗</p>
          </div>
          <div className="text-4xl">🤖</div>
        </div>
        <div className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20">
          <p className="text-white text-sm leading-relaxed">
            <span className="text-yellow-300 font-semibold">蓝领朋友们</span>
            ，找工作还在发愁？上传一段视频自我介绍，AI帮你分析面试表现，精准推荐靠谱工作！
          </p>
        </div>
      </div>

      {/* 负溢价效果 */}
      <div className="px-5 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">3步</div>
              <div className="text-xs text-gray-500 mt-1">完成AI面试</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">30秒</div>
              <div className="text-xs text-gray-500 mt-1">生成视频简历</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">1天</div>
              <div className="text-xs text-gray-500 mt-1">拿到offer</div>
            </div>
          </div>
        </div>
      </div>

      {/* 功能介绍 */}
      <div className="px-5 mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">为什么用职速达？</h2>
        <div className="space-y-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <div className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center flex-shrink-0`}>
                <f.icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 工作推荐预览 */}
      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">推荐职位</h2>
          <Link href="/jobs" className="text-sm text-blue-600 font-medium flex items-center gap-1">
            查看更多 <ArrowRight size={14} />
          </Link>
        </div>
        <Link href="/jobs/job-001" className="block bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏭</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">工厂操作工 · 苏州电子厂</h3>
              <p className="text-xs text-gray-500 mt-0.5">制造业 · 距离2.3km · 包吃住</p>
            </div>
            <div className="text-right">
              <div className="text-blue-600 font-bold">¥6000</div>
              <div className="text-[10px] text-gray-400">/月</div>
            </div>
          </div>
        </Link>
      </div>

      {/* CTA */}
      <div className="px-5 mt-8 mb-24">
        <Link
          href="/register"
          className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl font-semibold text-base active:bg-blue-700 transition-colors"
        >
          立即开始AI面试
        </Link>
        <p className="text-center text-xs text-gray-400 mt-3">预计3分钟完成 · 完全免费</p>
      </div>
    </div>
  );
}
