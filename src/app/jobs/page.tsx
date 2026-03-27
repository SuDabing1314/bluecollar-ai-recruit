"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, DollarSign, Filter, Clock } from "lucide-react";
import { JOBS } from "@/data/jobs";
import { formatDistance, formatCurrency, cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const { profile } = useUserStore();

  const filteredJobs = JOBS.filter(
    (job) =>
      job.title.includes(search) ||
      job.company.includes(search) ||
      job.location.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 */}
      <div className="bg-white px-4 pt-12 pb-3 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-xl font-bold text-gray-900">职位推荐</h1>
          {profile && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              {profile.city || "全国"}
            </span>
          )}
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索职位、公司、地点"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 标签筛选 */}
      <div className="bg-white px-4 py-2 flex gap-2 overflow-x-auto hide-scrollbar">
        {["包吃住", "五险一金", "当日入职", "高薪", "日结"].map((tag) => (
          <button
            key={tag}
            className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap active:bg-gray-200"
          >
            {tag}
          </button>
        ))}
        <button
          onClick={() => setFilterOpen(true)}
          className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap flex items-center gap-1 active:bg-gray-200"
        >
          <Filter size={12} /> 筛选
        </button>
      </div>

      {/* 职位列表 */}
      <div className="px-4 py-3 space-y-3 pb-20">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-sm">没有找到相关职位</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm active:scale-[0.99] transition-transform"
            >
              <div className="flex gap-3">
                <div className="text-3xl">{job.logo}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {job.title}
                    </h3>
                    {job.hot && (
                      <span className="bg-red-50 text-red-500 text-[10px] px-1.5 py-0.5 rounded flex-shrink-0">
                        热门
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{job.company}</p>

                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-0.5">
                      <MapPin size={12} /> {formatDistance(job.distance)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock size={12} /> {job.workTime}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-blue-600 font-bold">
                    {formatCurrency(job.salary)}
                  </div>
                  <div className="text-[10px] text-gray-400">/{job.salaryType}</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 空状态 */}
      {filteredJobs.length > 0 && (
        <div className="text-center text-xs text-gray-400 py-4 pb-20">
          已展示全部 {filteredJobs.length} 个职位
        </div>
      )}
    </div>
  );
}
