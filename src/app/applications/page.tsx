"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Eye, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { useUserStore } from "@/stores/user";
import { formatCurrency } from "@/lib/utils";

const statusConfig = {
  pending: { label: "待查看", color: "text-orange-500", bg: "bg-orange-50", icon: Clock },
  viewed: { label: "已查看", color: "text-blue-500", bg: "bg-blue-50", icon: Eye },
  interview: { label: "面试中", color: "text-purple-500", bg: "bg-purple-50", icon: MessageSquare },
  hired: { label: "已录用", color: "text-green-500", bg: "bg-green-50", icon: CheckCircle },
  rejected: { label: "不合适", color: "text-gray-500", bg: "bg-gray-100", icon: XCircle },
};

export default function ApplicationsPage() {
  const router = useRouter();
  const { profile, applications } = useUserStore();

  useEffect(() => {
    if (!profile) router.replace("/register");
  }, [profile, router]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部 */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-900">投递记录</h1>
        </div>
      </div>

      {/* 列表 */}
      <div className="px-4 py-3 space-y-3">
        {applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500 text-sm">还没有投递记录</p>
            <Link
              href="/jobs"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              去看看职位
            </Link>
          </div>
        ) : (
          applications.map((app) => {
            const status = statusConfig[app.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={`${app.jobId}-${app.appliedAt}`}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {app.jobTitle}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{app.company}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-blue-600 font-bold text-sm">
                      {formatCurrency(app.salary)}
                    </div>
                    <div className="text-[10px] text-gray-400">/月</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">
                    投递于 {new Date(app.appliedAt).toLocaleDateString("zh-CN")}
                  </span>
                  <span
                    className={`${status.bg} ${status.color} text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1`}
                  >
                    <StatusIcon size={10} />
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
