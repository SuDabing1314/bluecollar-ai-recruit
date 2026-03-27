"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft, MapPin, Clock, CheckCircle, Send, X, Play,
  ChevronRight, Users, Shield, Calendar, Banknote, Home,
  Heart, Award, Zap, Star, Phone, MessageCircle,
} from "lucide-react";
import { JOBS, Job } from "@/data/jobs";
import { formatDistance, formatCurrency } from "@/lib/utils";
import { useUserStore } from "@/stores/user";
import { useInterviewStore } from "@/stores/interview";
import { QUESTION_BANKS } from "@/data/questions";

interface VideoItem {
  questionId: string;
  questionText: string;
  videoUrl: string;
  duration: number;
  answerJobType: string;
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const job = JOBS.find((j) => j.id === id);
  const { profile, addApplication, interviewResult } = useUserStore();
  const { startInterview } = useInterviewStore();
  const [hydrated, setHydrated] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (useUserStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const interval = setInterval(() => {
      if (useUserStore.persist.hasHydrated()) {
        setHydrated(true);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">职位不存在</p>
      </div>
    );
  }

  // 从 user store 读取视频
  const allVideos: VideoItem[] = hydrated && interviewResult?.answers
    ? interviewResult.answers
        .filter((a: any) => !!a.videoUrl)
        .map((a: any) => {
          let questionText = "";
          for (const bank of Object.values(QUESTION_BANKS)) {
            const q = (bank as any[]).find((b) => b.id === a.questionId);
            if (q) { questionText = q.text; break; }
          }
          return {
            questionId: a.questionId,
            questionText,
            videoUrl: a.videoUrl,
            duration: a.duration,
            answerJobType: a.jobType,
          };
        })
    : [];

  const matchingVideos = allVideos.filter((v) => v.answerJobType === job.jobType);
  const selfIntroVideo = allVideos.find((v) => v.questionId.endsWith("-q1")) || null;
  const videosToShow: VideoItem[] = matchingVideos.length > 0 ? matchingVideos : selfIntroVideo ? [selfIntroVideo] : [];
  const hasVideos = videosToShow.length > 0;

  const handleApplyClick = () => {
    if (!profile) {
      router.push("/register");
      return;
    }
    if (!hasVideos) {
      startInterview(job.jobType);
      router.push(`/interview/${job.jobType}`);
      return;
    }
    setShowDialog(true);
  };

  const confirmApply = () => {
    setSubmitting(true);
    addApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      salary: job.salary,
      location: job.location,
      appliedAt: new Date().toISOString(),
      status: "pending",
    });
    setSubmitting(false);
    setShowDialog(false);
    setApplied(true);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getWelfareIcon = (item: string) => {
    if (item.includes("包吃") || item.includes("餐")) return "🍽️";
    if (item.includes("包住") || item.includes("宿舍")) return "🏠";
    if (item.includes("五险")) return "🛡️";
    if (item.includes("全勤")) return "⭐";
    if (item.includes("夜班") || item.includes("夜")) return "🌙";
    if (item.includes("节日") || item.includes("年终")) return "🎁";
    if (item.includes("高温")) return "☀️";
    return "✨";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* 顶部 */}
      <div className="bg-white px-4 pt-12 pb-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-500 active:text-gray-700">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900 truncate">{job.title}</h1>
            <p className="text-xs text-gray-400 truncate">{job.company}</p>
          </div>
          {job.hot && (
            <span className="bg-red-50 text-red-500 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0">
              <Zap size={10} /> 急聘
            </span>
          )}
        </div>
      </div>

      {/* 环境图片轮播 */}
      {job.environmentImages && job.environmentImages.length > 0 && (
        <div className="bg-white mb-3">
          <div className="relative overflow-hidden mx-4 mt-3 rounded-xl">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${activeImageIdx * 100}%)` }}
            >
              {job.environmentImages.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`工作环境${idx + 1}`}
                  className="w-full aspect-[16/9] object-cover flex-shrink-0"
                />
              ))}
            </div>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {job.environmentImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === activeImageIdx ? "bg-white w-4" : "bg-white/50 w-1.5"}`}
                />
              ))}
            </div>
          </div>
          <div className="px-4 pb-3">
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
              <Home size={12} /> 查看工作环境
            </p>
          </div>
        </div>
      )}

      {/* 薪资 Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 mx-4 rounded-xl p-4 mb-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-white">
            {formatCurrency(job.salary)}
          </span>
          <span className="text-blue-200 text-sm">/{job.salaryType}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.tags.map((tag) => (
            <span key={tag} className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 职位提供什么 */}
      <div className="mx-4 bg-white rounded-xl p-4 mb-3">
        <h2 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-1.5">
          <Banknote size={15} className="text-blue-600" />
          职位提供什么
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {job.welfare && job.welfare.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Banknote size={11} /> 薪资福利</p>
              <div className="space-y-1">
                {job.welfare.slice(0, 3).map((w) => (
                  <p key={w} className="text-xs text-gray-700 flex items-start gap-1">
                    <span className="flex-shrink-0">{getWelfareIcon(w)}</span><span>{w}</span>
                  </p>
                ))}
                {job.welfare.length > 3 && <p className="text-xs text-blue-500 font-medium">+{job.welfare.length - 3}项</p>}
              </div>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Clock size={11} /> 工作时间</p>
            <p className="text-xs text-gray-700 leading-relaxed">{job.workTime}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><MapPin size={11} /> 工作地点</p>
            <p className="text-xs text-gray-700 leading-relaxed">{job.location}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{formatDistance(job.distance)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Shield size={11} /> 社会保障</p>
            <div className="space-y-1">
              {(job.welfare || []).filter((w) => w.includes("五险")).map((w) => (
                <p key={w} className="text-xs text-gray-700 flex items-center gap-1">
                  <CheckCircle size={10} className="text-green-500" /> {w}
                </p>
              ))}
              {!(job.welfare || []).some((w) => w.includes("五险")) && <p className="text-xs text-gray-400">面议</p>}
            </div>
          </div>
        </div>
      </div>

      {/* 职位要求什么 */}
      <div className="mx-4 bg-white rounded-xl p-4 mb-3">
        <h2 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-1.5">
          <Users size={15} className="text-orange-500" />
          职位要求什么
        </h2>
        <div className="space-y-3">
          {job.requirements.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><CheckCircle size={11} /> 基本要求</p>
              <div className="space-y-1.5">
                {job.requirements.map((req) => (
                  <div key={req} className="flex items-start gap-2">
                    <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {job.certificates && job.certificates.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Award size={11} /> 资质证书</p>
              <div className="flex flex-wrap gap-1.5">
                {job.certificates.map((c) => (
                  <span key={c} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">{c}</span>
                ))}
              </div>
            </div>
          )}
          {job.ageRequirement && (
            <div>
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Calendar size={11} /> 年龄要求</p>
              <span className="text-sm text-gray-700 font-medium">{job.ageRequirement}</span>
            </div>
          )}
          {job.physicalRequirement && (
            <div>
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Heart size={11} /> 身体要求</p>
              <span className="text-sm text-gray-700">{job.physicalRequirement}</span>
            </div>
          )}
        </div>
      </div>

      {/* 职位介绍 */}
      <div className="mx-4 bg-white rounded-xl p-4 mb-3">
        <h2 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-1.5">
          <Star size={15} className="text-yellow-500" />
          职位介绍
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
      </div>

      {/* 底部申请栏 - 叠在底导上方 */}
      <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex gap-2.5">
            {applied ? (
              <div className="flex-1 bg-green-50 text-green-600 py-3.5 rounded-xl text-center font-semibold text-sm flex items-center justify-center gap-2">
                <Send size={16} /> 已投递，等待面试邀请
              </div>
            ) : (
              <>
                <button
                  onClick={handleApplyClick}
                  className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm active:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  投递视频简历
                </button>
                <button
                  onClick={() => setShowPhoneDialog(true)}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-xs active:bg-gray-50 flex flex-col items-center justify-center gap-1"
                >
                  <Phone size={16} />
                  电话
                </button>
                <button
                  onClick={() => router.push("/chat")}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-xs active:bg-gray-50 flex flex-col items-center justify-center gap-1"
                >
                  <MessageCircle size={16} />
                  在线
                </button>
              </>
            )}
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            {hasVideos ? "点击预览并投递您的专属视频简历" : "完成AI面试即可获得视频简历"}
          </p>
        </div>
      </div>

      {/* 电话沟通弹窗 */}
      {showPhoneDialog && job.phone && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowPhoneDialog(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900 text-base">电话沟通</h2>
                <p className="text-xs text-gray-400 mt-0.5">联系企业招聘负责人</p>
              </div>
              <button
                onClick={() => setShowPhoneDialog(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-4 py-5">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-400 mb-1">招聘电话</p>
                <p className="text-lg font-bold text-gray-900 tracking-wide">{job.phone}</p>
              </div>
              <button
                onClick={() => setShowPhoneDialog(false)}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold text-sm active:bg-green-700 flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                拨打 {job.phone}
              </button>
              <p className="text-center text-xs text-gray-400 mt-2.5">
                工作日 9:00-18:00 拨打，顾问将为您匹配合适岗位
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 视频简历弹窗 */}
      {showDialog && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => !submitting && setShowDialog(false)} />
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="font-semibold text-gray-900 text-base">视频简历</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {matchingVideos.length > 0
                    ? `投递将发送 ${videosToShow.length} 个面试视频`
                    : `投递自我介绍视频（其他面试视频与该职位不符）`}
                </p>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
                disabled={submitting}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {videosToShow.map((video, idx) => (
                <div key={video.questionId} className="rounded-xl overflow-hidden border border-gray-200">
                  <div className="bg-gray-900 relative aspect-video">
                    {playingVideo === video.videoUrl ? (
                      <video
                        src={video.videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                        onEnded={() => setPlayingVideo(null)}
                      />
                    ) : (
                      <button
                        onClick={() => setPlayingVideo(video.videoUrl)}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                          <Play size={24} className="text-white ml-1" />
                        </div>
                      </button>
                    )}
                  </div>
                  <div className="bg-gray-50 px-3 py-2">
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {idx + 1}. {video.questionText}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">⏱ {formatDuration(video.duration)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-4 border-t border-gray-100 flex-shrink-0 bg-white">
              <button
                onClick={confirmApply}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-sm active:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? "投递中…" : <>确认投递 <ChevronRight size={18} /></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
