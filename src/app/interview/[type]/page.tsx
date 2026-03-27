"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Video, VideoOff, RotateCcw, ArrowRight, CheckCircle } from "lucide-react";
import { QUESTION_BANKS } from "@/data/questions";
import { useInterviewStore } from "@/stores/interview";
import { useUserStore } from "@/stores/user";
import { formatTime, cn } from "@/lib/utils";

export default function InterviewPage() {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const { startInterview, answers, currentQuestionIndex, saveAnswer, nextQuestion, setRecording, isRecording, setSubmitting, isSubmitting, reset } = useInterviewStore();
  const { setInterviewResult } = useUserStore();

  const questions = QUESTION_BANKS[type] || QUESTION_BANKS["manufacturing"];
  const currentQ = questions[currentQuestionIndex];

  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // cameraStream 只作为 useEffect 的 trigger，stream 本身存在 ref 里
  const [renderTick, setRenderTick] = useState(0);

  // srcObject 绑定到 ref 上的 stream，state 变化触发这个 effect
  useEffect(() => {
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [renderTick]);

  // Start camera — 带Abort重试
  const startCamera = async () => {
    let lastErr: any;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise(r => setTimeout(r, 500 * attempt));
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setRenderTick(t => t + 1);
        setIsPreview(true);
        setCameraError(null);
        return;
      } catch (err: any) {
        lastErr = err;
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setCameraError("请允许摄像头权限");
          return;
        }
      }
    }
    setCameraError("无法访问摄像头：" + lastErr?.message);
  };

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsPreview(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stopCamera]);

  // Countdown before recording
  const startCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          startRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) return;
    setRecording(true);
    setRecordingTime(0);

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm;codecs=vp8,opus",
    });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      saveAnswer({
        questionId: currentQ.id,
        jobType: type,
        videoBlob: blob,
        videoUrl: url,
        duration: recordingTime,
      });
      setRecording(false);
    };

    mediaRecorder.start(1000);
    timerRef.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
  };

  // Stop recording
  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  // Re-record
  const reRecord = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecordingTime(0);
    setRecording(false);
    startCountdown();
  };

  // Submit and go to next
  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
      setRecordingTime(0);
      // Don't stop camera, keep preview
    } else {
      // Last question - submit
      await handleSubmit();
    }
  };

  // Submit all answers
  const handleSubmit = async () => {
    setSubmitting(true);
    stopCamera();

    // Generate mock AI result
    const result = {
      jobType: type,
      date: new Date().toISOString(),
      overallScore: Math.floor(Math.random() * 15) + 80,
      dimensions: [
        { name: "表达能力", score: Math.floor(Math.random() * 20) + 75, detail: "表达清晰，语言流畅" },
        { name: "形象气质", score: Math.floor(Math.random() * 20) + 78, detail: "着装得体，精神面貌良好" },
        { name: "岗位匹配", score: Math.floor(Math.random() * 20) + 80, detail: "符合岗位基本要求" },
        { name: "稳定性", score: Math.floor(Math.random() * 20) + 70, detail: "工作意愿较强" },
      ],
      highlights: [
        "视频回答完整，无中断",
        "语言表达清晰流畅",
        "展现出对工作的积极态度",
      ],
      suggestions: [
        "建议在介绍工作经验时更具体一些",
        "可以提前了解目标公司的基本信息",
        "保持自信，注意语速适中",
      ],
    };

    setInterviewResult({ ...result, answers: answers.map((a) => ({ questionId: a.questionId, jobType: a.jobType, videoUrl: a.videoUrl, duration: a.duration })) });
    reset();
    router.push("/interview/result");
  };

  // Check if current question answered
  const currentAnswer = answers[currentQuestionIndex];
  const hasAnswer = currentAnswer?.videoUrl != null;

  // Progress
  const progress = ((currentQuestionIndex + (hasAnswer ? 1 : 0)) / questions.length) * 100;

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">AI 正在分析你的面试表现…</p>
          <p className="text-gray-400 text-sm mt-2">预计需要 10-15 秒</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* 顶部 */}
      <div className="bg-gray-800 px-4 pt-12 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => {
              stopCamera();
              reset();
              router.back();
            }}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-semibold text-base">AI 视频面试</h1>
            <p className="text-gray-400 text-xs">
              问题 {currentQuestionIndex + 1} / {questions.length}
            </p>
          </div>
          {hasAnswer && (
            <CheckCircle size={20} className="text-green-500" />
          )}
        </div>

        {/* 进度条 */}
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 progress-stripe"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 问题 */}
      <div className="bg-gray-800 mx-4 mt-3 rounded-xl p-4">
        <p className="text-white font-medium text-base leading-relaxed">
          {currentQ.text}
        </p>
        {currentQ.hint && (
          <p className="text-gray-400 text-xs mt-2">
            💡 {currentQ.hint}
          </p>
        )}
      </div>

      {/* 视频区域 */}
      <div className="flex-1 mx-4 mt-3 relative">
        {/* 视频始终渲染，opacity 始终为 1 */}
        <div className="w-full aspect-[4/3] bg-black rounded-xl overflow-hidden relative">
          <video
            ref={videoRef}
            autoPlay={true}
            muted={true}
            playsInline={true}
            style={{ transform: "scaleX(-1)", width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />

          {/* 录制状态指示 */}
          {isRecording && (
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">
                REC {formatTime(recordingTime)}
              </span>
            </div>
          )}

          {/* 倒计时 */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="text-white text-8xl font-bold countdown-pulse">
                {countdown}
              </span>
            </div>
          )}

          {/* 录制时长 */}
          {!isRecording && isPreview && currentAnswer == null && (
            <div className="absolute top-3 left-3">
              <span className="text-white text-sm">
                ⏱️ {formatTime(recordingTime)} / {formatTime(currentQ.duration)}
              </span>
            </div>
          )}
        </div>

        {/* 摄像头出错 */}
        {cameraError && (
          <div className="absolute inset-0 w-full aspect-[4/3] bg-gray-800 rounded-xl flex flex-col items-center justify-center">
            <VideoOff size={48} className="text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm text-center px-8">{cameraError}</p>
            <button
              onClick={startCamera}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              重新尝试
            </button>
          </div>
        )}

        {/* 未开启摄像头时的占位 */}
        {!isPreview && !isRecording && !cameraError && (
          <div className="absolute inset-0 w-full aspect-[4/3] bg-gray-800 rounded-xl flex flex-col items-center justify-center">
            <Video size={48} className="text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">点击开启摄像头</p>
            <button
              onClick={startCamera}
              className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium"
            >
              开启摄像头
            </button>
          </div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className="px-4 py-4 safe-bottom">
        {!isPreview ? (
          <button
            onClick={startCamera}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2"
          >
            <Video size={20} /> 开启摄像头
          </button>
        ) : isRecording ? (
          <div className="flex gap-3">
            <button
              onClick={reRecord}
              className="flex-1 py-4 bg-gray-700 text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> 重新录制
            </button>
            <button
              onClick={stopRecording}
              className="flex-1 py-4 bg-red-500 text-white rounded-xl font-semibold text-base"
            >
              完成录制
            </button>
          </div>
        ) : hasAnswer ? (
          <div className="flex gap-3">
            <button
              onClick={reRecord}
              className="flex-1 py-4 bg-gray-700 text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> 重新录制
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>下一题 <ArrowRight size={20} /></>
              ) : (
                <>提交面试 <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={startCountdown}
            className="w-full py-4 bg-red-500 text-white rounded-xl font-semibold text-base"
          >
            开始录制
          </button>
        )}

        {/* 提示 */}
        <p className="text-center text-gray-500 text-xs mt-3">
          {!isPreview ? "请确保在安静、光线充足的环境下录制" :
           isRecording ? "录制中，请保持正脸在画面中" :
           hasAnswer ? "可重新录制或进入下一题" :
           `请在 ${currentQ.duration} 秒内完成回答`}
        </p>
      </div>
    </div>
  );
}
