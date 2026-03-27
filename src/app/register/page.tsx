"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useUserStore } from "@/stores/user";
import { JOB_TYPES } from "@/data/jobs";

const STEPS = ["基本信息", "工种选择", "完成注册"];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [form, setForm] = useState({
    phone: "",
    name: "",
    age: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { setProfile } = useUserStore();

  const validateStep0 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.phone || form.phone.length !== 11) {
      newErrors.phone = "请输入11位手机号";
    } else if (!/^1[3-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = "手机号格式不正确";
    }
    if (!form.name || form.name.length < 1) {
      newErrors.name = "请输入姓名";
    }
    if (!form.age || Number(form.age) < 18 || Number(form.age) > 60) {
      newErrors.age = "年龄需在18-60岁之间";
    }
    if (!form.city) {
      newErrors.city = "请选择城市";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleJob = (job: string) => {
    setSelectedJobs((prev) =>
      prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]
    );
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && selectedJobs.length === 0) {
      setErrors({ jobTypes: "请至少选择一个意向工种" });
      return;
    }
    setErrors({});
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Submit
      setProfile({
        phone: form.phone,
        name: form.name,
        age: Number(form.age),
        city: form.city,
        jobTypes: selectedJobs,
        documents: {
          hasHealthCert: false,
          hasDriverLicense: false,
          hasEquipmentCert: false,
        },
      });
      router.push("/interview");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部 */}
      <div className="bg-blue-600 px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-white/80 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-white text-lg font-semibold flex-1">
            {step < 2 ? STEPS[step] : "注册成功"}
          </h1>
        </div>

        {/* 步骤条 */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-white" : "bg-white/30"
                }`}
              />
            </div>
          ))}
        </div>
        <p className="text-blue-100 text-xs mt-2">
          第{step + 1}步，共{STEPS.length}步
        </p>
      </div>

      {/* 内容 */}
      <div className="px-4 py-6">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                手机号
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={11}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="请输入手机号"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                姓名
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="请输入真实姓名"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                年龄
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="18-60岁"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                所在城市
              </label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">请选择城市</option>
                <option value="北京">北京</option>
                <option value="上海">上海</option>
                <option value="广州">广州</option>
                <option value="深圳">深圳</option>
                <option value="杭州">杭州</option>
                <option value="苏州">苏州</option>
                <option value="成都">成都</option>
                <option value="武汉">武汉</option>
                <option value="西安">西安</option>
                <option value="其他">其他</option>
              </select>
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              选择你想要从事的工种（可多选），我们将为你匹配合适的岗位
            </p>
            {errors.jobTypes && (
              <p className="text-red-500 text-xs mb-3">{errors.jobTypes}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {JOB_TYPES.map((job) => {
                const isSelected = selectedJobs.includes(job.value);
                return (
                  <button
                    key={job.value}
                    type="button"
                    onClick={() => toggleJob(job.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all active:scale-95 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{job.icon}</span>
                      {isSelected && (
                        <Check size={18} className="text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {job.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              注册成功！
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              接下来完成一个AI面试，获得你的专属视频简历
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">
                📋 你的信息
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="text-gray-400">姓名：</span>
                  {form.name}
                </p>
                <p>
                  <span className="text-gray-400">手机：</span>
                  {form.phone}
                </p>
                <p>
                  <span className="text-gray-400">城市：</span>
                  {form.city}
                </p>
                <p>
                  <span className="text-gray-400">意向：</span>
                  {selectedJobs
                    .map((j) => JOB_TYPES.find((t) => t.value === j)?.label)
                    .join("、")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 按钮 */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleNext}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-base active:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {step < 2 ? (
              <>下一步 <ArrowRight size={18} /></>
            ) : (
              "开始AI面试"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
