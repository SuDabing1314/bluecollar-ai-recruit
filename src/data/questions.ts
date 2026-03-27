export interface Question {
  id: string;
  type: "self-intro" | "experience" | "scenario" | "document";
  text: string;
  duration: number;
  required: boolean;
  hint?: string;
}

export const QUESTION_BANKS: Record<string, Question[]> = {
  manufacturing: [
    {
      id: "m-q1",
      type: "self-intro",
      text: "请用30秒做一个自我介绍，包括你的名字、年龄、和之前做过什么工作",
      duration: 45,
      required: true,
      hint: "语速适中，表达清晰即可",
    },
    {
      id: "m-q2",
      type: "experience",
      text: "你之前在工厂做过什么具体的活？做了多久？",
      duration: 30,
      required: true,
      hint: "说说具体工作内容和时间",
    },
    {
      id: "m-q3",
      type: "scenario",
      text: "工厂流水线有时候需要连续站几个小时，你能接受吗？能说说你的体力情况吗？",
      duration: 30,
      required: true,
      hint: "如实回答，体力是重要参考",
    },
    {
      id: "m-q4",
      type: "document",
      text: "你有没有健康证或者特种设备操作证？能展示一下吗？",
      duration: 15,
      required: false,
      hint: "有就展示，没有如实说明即可",
    },
    {
      id: "m-q5",
      type: "scenario",
      text: "如果让你加班赶货，你愿意吗？对倒班有什么想法？",
      duration: 30,
      required: true,
    },
  ],
  restaurant: [
    {
      id: "r-q1",
      type: "self-intro",
      text: "请用30秒介绍一下自己",
      duration: 45,
      required: true,
      hint: "展示一个积极的服务态度",
    },
    {
      id: "r-q2",
      type: "experience",
      text: "你之前做过餐饮行业吗？是哪类餐厅？主要负责什么？",
      duration: 30,
      required: true,
    },
    {
      id: "r-q3",
      type: "scenario",
      text: "高峰期一个人同时端几桌的菜你能应付得过来吗？举例子说说",
      duration: 30,
      required: true,
      hint: "按实际情况说，不需要夸大",
    },
    {
      id: "r-q4",
      type: "scenario",
      text: "遇到难缠的客人，你会怎么处理？",
      duration: 30,
      required: true,
    },
    {
      id: "r-q5",
      type: "document",
      text: "你有健康证吗？可以展示一下",
      duration: 15,
      required: false,
    },
  ],
  logistics: [
    {
      id: "l-q1",
      type: "self-intro",
      text: "请用30秒介绍一下自己",
      duration: 45,
      required: true,
    },
    {
      id: "l-q2",
      type: "document",
      text: "你有没有驾照或者叉车证？展示一下",
      duration: 15,
      required: false,
    },
    {
      id: "l-q3",
      type: "scenario",
      text: "货物分拣需要持续弯腰和搬运，你身体吃得消吗？",
      duration: 30,
      required: true,
    },
    {
      id: "l-q4",
      type: "experience",
      text: "你之前做过类似的物流或者体力工作吗？说说情况",
      duration: 30,
      required: true,
    },
  ],
  housekeeping: [
    {
      id: "h-q1",
      type: "self-intro",
      text: "请用30秒介绍一下自己",
      duration: 45,
      required: true,
    },
    {
      id: "h-q2",
      type: "scenario",
      text: "你之前做过家政或者保洁吗？主要做什么类型的清洁？",
      duration: 30,
      required: true,
    },
    {
      id: "h-q3",
      type: "scenario",
      text: "你知道怎么清洁油烟机、浴室这些难点吗？简单说说方法",
      duration: 30,
      required: false,
    },
    {
      id: "h-q4",
      type: "document",
      text: "你有健康证吗？可以展示一下",
      duration: 15,
      required: false,
    },
  ],
  security: [
    {
      id: "s-q1",
      type: "self-intro",
      text: "请用30秒介绍一下自己",
      duration: 45,
      required: true,
    },
    {
      id: "s-q2",
      type: "scenario",
      text: "如果有人不登记硬要进小区，你怎么处理？",
      duration: 30,
      required: true,
    },
    {
      id: "s-q3",
      type: "experience",
      text: "你之前做过保安或者有类似的工作经验吗？",
      duration: 30,
      required: false,
    },
    {
      id: "s-q4",
      type: "scenario",
      text: "夜班需要熬夜，你能适应夜班吗？",
      duration: 30,
      required: true,
    },
  ],
};
