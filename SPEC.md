# 蓝领AI招聘 C端产品 - 开发大纲

> 版本：v0.1
> 创建时间：2026-03-26
> 技术栈：Next.js 15 (App Router) + Tailwind CSS + TypeScript
> 部署：Vercel

---

## 一、技术架构

### 1.1 技术选型

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 框架 | Next.js 15 (App Router) | SSR + 静态导出，SEO友好，首屏快 |
| 样式 | Tailwind CSS | 原子化CSS，移动端开发效率高 |
| 组件库 | Radix UI (headless) | 无样式组件，移动端交互完善 |
| 视频录制 | MediaRecorder API + IndexedDB | 浏览器原生API，离线可存 |
| 状态管理 | Zustand | 轻量，适合移动端 |
| 表单 | React Hook Form + Zod | 类型安全，验证简单 |
| 部署 | Vercel | 边缘计算，冷启动快 |
| 图标 | Lucide React | 轻量，SVG |

### 1.2 目录结构

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 根布局（移动端viewport优化）
│   ├── page.tsx              # 首页（落地页）
│   ├── register/             # 注册流程
│   │   └── page.tsx
│   ├── jobs/                 # 职位推荐列表
│   │   ├── page.tsx
│   │   └── [id]/page.tsx    # 职位详情
│   ├── interview/            # AI面试
│   │   ├── page.tsx          # 面试准备/选择工种
│   │   ├── [jobType]/page.tsx # 面试答题页
│   │   └── result/page.tsx   # 面试结果
│   ├── profile/              # 个人中心/视频简历
│   │   └── page.tsx
│   └── api/                  # API路由（Mock数据）
│       ├── jobs/route.ts
│       ├── interview/route.ts
│       └── user/route.ts
├── components/
│   ├── ui/                   # 基础UI组件（Radix封装）
│   ├── interview/             # 面试相关组件
│   ├── jobs/                 # 职位相关组件
│   └── layout/               # 布局组件（底部导航等）
├── hooks/                    # 自定义Hooks
├── lib/                      # 工具函数
└── stores/                   # Zustand状态
```

### 1.3 移动端优先设计原则

- **REM 弹性布局**：所有尺寸基于 16px 根字体，使用 rem/vw/vh
- **底部导航**：主要操作在屏幕下半部分，单手可及
- **大触摸目标**：最小点击区域 44x44px
- **简化输入**：能用选项不用文字输入，能用语音不用打字
- **弱网友好**：视频本地预览，面试完成后上传
- **进度保存**：面试中途退出可续录（IndexedDB存储）

---

## 二、页面结构

### 2.1 页面地图

```
首页 (/)
  ↓ 价值主张 + 立刻开始
注册页 (/register)
  ↓ 手机号 + 基础信息
职位推荐 (/jobs)
  ↓ 浏览 + 投递视频简历
职位详情 (/jobs/[id])
  ↓ 查看详情 + 发起AI面试
AI面试 (/interview/[jobType])
  ↓ 录制答题 + 提交
面试结果 (/interview/result)
  ↓ 查看评分 + 高光视频
个人中心 (/profile)
  ↓ 视频简历管理 + 我的投递
```

### 2.2 核心页面说明

#### 首页（/）
- **目标**：30秒内让用户理解产品价值并开始注册
- **内容**：
  - 一句话价值主张："用AI面试，快速找到靠谱工作"
  - 3个核心卖点（图标+文案）
  - 大按钮："立即开始AI面试"
  - 底部企业端入口（次级）

#### 注册页（/register）
- **目标**：60秒完成注册，开始使用
- **字段**：手机号（必填）、姓名、年龄、城市、工种意向（多选）、期望薪资、证件情况
- **交互**：单页式，一步一步引导，每个问题一个焦点

#### 职位推荐（/jobs）
- **目标**：快速找到匹配的职位
- **内容**：
  - 顶部：搜索框（支持语音）+ 筛选标签（工种/距离/薪资）
  - 列表：卡片式，展示岗位关键信息（薪资、距离、工作时间）
  - 点击直接投递视频简历（无需再填简历）

#### AI面试（/interview/[jobType]）
- **目标**：完成一个工种的标准AI面试，录制视频答案
- **流程**：
  1. 准备页：面试说明 + 题目预览 + 录制环境检测
  2. 答题页：题目展示 → 前置摄像头录制 → 提交答案
  3. 提交页：等待AI处理
- **视频录制**：MediaRecorder API，支持重录，答案暂存本地

#### 面试结果（/interview/result）
- **目标**：让用户看到自己的AI评分和改进建议
- **内容**：
  - 综合评分（雷达图/数字分）
  - 各维度评分（表达能力、形象、经验匹配度）
  - AI改进建议（文字）
  - 视频高光片段（自动剪辑）
  - 匹配岗位推荐

#### 个人中心（/profile）
- **目标**：管理自己的视频简历
- **内容**：
  - 视频简历展示
  - 投递记录
  - 收藏职位
  - 设置

---

## 三、核心组件清单

### 3.1 UI基础组件

| 组件 | 说明 | 状态 |
|------|------|------|
| Button | 主要/次要/文字按钮 | 待开发 |
| Input | 文本输入（含手机号特殊处理） | 待开发 |
| Select | 单选/多选下拉 | 待开发 |
| Card | 职位卡片 | 待开发 |
| BottomNav | 底部导航（固定，H5兼容） | 待开发 |
| Progress | 面试进度条 | 待开发 |
| Toast | 操作反馈提示 | 待开发 |
| Modal | 底部弹层（移动端交互） | 待开发 |

### 3.2 业务组件

| 组件 | 说明 |
|------|------|
| VideoRecorder | 面试录制（前置摄像头+倒计时+重录） |
| QuestionCard | 面试题目展示（含倒计时） |
| ScoreRadar | AI评分雷达图 |
| JobCard | 职位推荐卡片 |
| ResumeVideo | 视频简历播放器 |
| FilterSheet | 底部筛选面板 |

---

## 四、AI面试流程（技术实现）

### 4.1 录制技术栈

```
MediaRecorder API
  → 获取 video+audio stream
  → 编码：video/webm;codecs=vp9（优先）/vp8（兼容）
  → Blob 分段写入 IndexedDB
  → 完成时合并为完整文件
  → 上传至服务器（模拟：本地预览）
```

### 4.2 面试流程状态机

```
IDLE → PREPARING → RECORDING → REVIEWING → UPLOADING → DONE
                    ↓
               (可重录，返回RECORDING)
```

### 4.3 面试题目数据结构

```typescript
interface Question {
  id: string
  type: 'self-intro' | 'experience' | 'scenario' | 'document'
  text: string          // 题目文字
  duration: number     // 答题时长限制（秒）
  required: boolean
  hint?: string         // 给用户的提示
}

// 工种题库（Phase 1 覆盖）
const jobQuestionBanks = {
  manufacturing: [...],   // 制造业
  restaurant: [...],       // 餐饮
  logistics: [...],        // 物流
}
```

---

## 五、开发里程碑

### Phase 1：骨架 + 首页 + 注册（预计 2-3 小时）

- [ ] Next.js 项目初始化 + Tailwind 配置
- [ ] 移动端基础布局（viewport/字体/安全区）
- [ ] 底部导航组件
- [ ] 首页（价值主张 + CTA）
- [ ] 注册表单页（手机号 + 基础信息）

### Phase 2：职位模块（预计 2-3 小时）

- [ ] Mock职位数据 API
- [ ] 职位推荐列表页
- [ ] 职位详情页
- [ ] 筛选底部面板

### Phase 3：AI面试核心（预计 4-5 小时）

- [ ] 视频录制组件（MediaRecorder）
- [ ] 面试准备页 + 环境检测
- [ ] 答题页（题目展示 + 录制 + 提交）
- [ ] 面试结果页（评分展示 + 高光视频）
- [ ] IndexedDB 本地存储（续录功能）

### Phase 4：个人中心 + 细节打磨（预计 2-3 小时）

- [ ] 个人中心页
- [ ] 视频简历管理
- [ ] 投递记录
- [ ] 动画过渡 + 弱网状态处理
- [ ] Vercel 部署

---

## 六、Mock数据说明

Phase 1-2 使用纯前端 Mock，不依赖后端：

- 职位数据：`/src/data/jobs.ts`
- 用户数据：`Zustand store`（localStorage持久化）
- 面试结果：预设评分数据（可扩展为调用AI接口）

---

## 七、部署方案

### 7.1 Vercel 部署

```bash
# 本地构建测试
npm run build

# 直接推送 GitHub，Vercel 自动构建部署
git push origin main
```

### 7.2 域名绑定（可选）

Vercel 控制台 → Domains → 添加自定义域名

---

## 八、待确认/风险项

- [ ] 视频上传至哪个存储（Vercel Blob / 阿里云OSS / 模拟）？
- [ ] AI评分接口是否有可用provider（Coze/豆包/硅基）？
- [ ] 是否需要真实的用户认证体系？
