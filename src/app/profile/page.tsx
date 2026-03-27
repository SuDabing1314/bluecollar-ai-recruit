"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Phone,
  Briefcase,
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut,
  FileText,
  Star,
} from "lucide-react";
import { useUserStore } from "@/stores/user";
import { JOB_TYPES } from "@/data/jobs";
import { formatPhone } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, interviewResult, applications, reset } = useUserStore();
  const [hydrated, setHydrated] = useState(false);

  // 等待 Zustand persist 完成 rehydration
  useEffect(() => {
    if (useUserStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    // 轮询直到 rehydration 完成（最多 3 秒）
    const timeout = setTimeout(() => setHydrated(true), 3000);
    const interval = setInterval(() => {
      if (useUserStore.persist.hasHydrated()) {
        setHydrated(true);
        clearInterval(interval);
        clearTimeout(timeout);
      }
    }, 50);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!profile) {
      router.replace("/register");
    }
  }, [hydrated, profile, router]);

  if (!profile) return null;

  const menuGroups = [
    {
      title: "我的资料",
      items: [
        {
          icon: FileText,
          label: "视频简历",
          desc: interviewResult
            ? `综合评分 ${interviewResult.overallScore} 分`
            : "尚未完成面试",
          href: interviewResult ? "/interview/result" : "/interview",
          color: "text-blue-600",
          bg: "bg-blue-50",
        },
        {
          icon: Star,
          label: "我的评分",
          desc: interviewResult ? "查看 AI 评测报告" : "暂无数据",
          href: interviewResult ? "/interview/result" : undefined,
          color: "text-yellow-500",
          bg: "bg-yellow-50",
        },
      ],
    },
    {
      title: "求职管理",
      items: [
        {
          icon: Briefcase,
          label: "投递记录",
          desc: `${applications.length} 个职位`,
          href: "/applications",
          color: "text-green-600",
          bg: "bg-green-50",
        },
      ],
    },
    {
      title: "其他",
      items: [
        {
          icon: HelpCircle,
          label: "帮助与反馈",
          desc: "遇到问题？联系我们",
          href: "#",
          color: "text-gray-500",
          bg: "bg-gray-50",
        },
        {
          icon: Settings,
          label: "设置",
          desc: "账号、通知等",
          href: "#",
          color: "text-gray-500",
          bg: "bg-gray-50",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 pt-12 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">{profile.name}</h1>
            <p className="text-blue-100 text-sm mt-0.5">
              {profile.city} · {profile.age}岁
            </p>
            <p className="text-blue-200 text-xs mt-1">
              {formatPhone(profile.phone)}
            </p>
          </div>
        </div>

        {/* 意向工种 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.jobTypes.map((jt) => {
            const job = JOB_TYPES.find((j) => j.value === jt);
            return (
              <span
                key={jt}
                className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full"
              >
                {job?.icon} {job?.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* 快捷数据 */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-xl p-4 shadow-sm flex justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {interviewResult ? `${interviewResult.overallScore}` : "--"}
            </div>
            <div className="text-xs text-gray-500 mt-1">综合评分</div>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {applications.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">投递记录</div>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {applications.filter((a) => a.status === "pending").length || "--"}
            </div>
            <div className="text-xs text-gray-500 mt-1">待回复</div>
          </div>
        </div>
      </div>

      {/* 菜单 */}
      <div className="px-4 mt-4 space-y-4">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-medium text-gray-400 uppercase mb-2 px-1">
              {group.title}
            </h3>
            <div className="bg-white rounded-xl overflow-hidden">
              {group.items.map((item, i) => {
                const Icon = item.icon;
                const isLast = i === group.items.length - 1;
                const content = (
                  <div
                    className={`flex items-center gap-3 px-4 py-3.5 ${
                      item.href && item.href !== "#"
                        ? "active:bg-gray-50"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center`}
                    >
                      <Icon size={18} className={item.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    {item.href && item.href !== "#" ? (
                      <ChevronRight size={18} className="text-gray-300" />
                    ) : null}
                  </div>
                );

                return (
                  <div key={item.label}>
                    {item.href && item.href !== "#" ? (
                      <Link href={item.href}>{content}</Link>
                    ) : (
                      content
                    )}
                    {!isLast && <div className="h-px bg-gray-100 mx-4" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 退出 */}
      <div className="px-4 mt-6">
        <button
          onClick={() => {
            reset();
            router.replace("/");
          }}
          className="w-full py-3 text-red-500 text-sm font-medium flex items-center justify-center gap-2"
        >
          <LogOut size={16} /> 退出登录
        </button>
      </div>
    </div>
  );
}
