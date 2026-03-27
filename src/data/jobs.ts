export const JOB_TYPES = [
  { value: "manufacturing", label: "制造业", icon: "🏭" },
  { value: "restaurant", label: "餐饮服务", icon: "🍜" },
  { value: "logistics", label: "物流仓储", icon: "📦" },
  { value: "housekeeping", label: "家政保洁", icon: "🧹" },
  { value: "security", label: "保安门禁", icon: "🔒" },
];

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  salary: number;
  salaryType: "月" | "日" | "小时";
  location: string;
  distance: number;
  tags: string[];
  requirements: string[];
  description: string;
  workTime: string;
  jobType: string;
  /** 是否急聘 */
  hot?: boolean;
  /** 工作环境图片 URL 列表 */
  environmentImages?: string[];
  /** 福利待遇列表 */
  welfare?: string[];
  /** 身体要求 */
  physicalRequirement?: string;
  /** 年龄要求 */
  ageRequirement?: string;
  /** 资质证书 */
  certificates?: string[];
  /** 联系电话 */
  phone?: string;
}

export const JOBS: Job[] = [
  {
    id: "job-001",
    title: "工厂操作工",
    company: "苏州电子厂",
    logo: "🏭",
    salary: 6000,
    salaryType: "月",
    location: "苏州市工业园区星湖街328号",
    distance: 2300,
    workTime: "早8:00 - 晚8:00，两班倒，每周休息1天",
    requirements: ["身体健康", "无犯罪记录", "能适应流水线作业"],
    jobType: "manufacturing",
    hot: true,
    tags: ["包吃住", "五险一金", "当日入职"],
    welfare: ["免费三餐", "免费住宿（4人间）", "五险一金", "全勤奖200元/月", "夜班补贴30元/天", "节日礼金"],
    physicalRequirement: "手臂灵活，久站可耐受",
    ageRequirement: "18-45周岁",
    certificates: [],
    environmentImages: [
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80",
    ],
    description:
      "主要从事电子元器件组装、检测、包装等流水线工作。工作环境整洁，中央空调恒温，无重体力活。",
      phone: "138-0000-1001",
  },
  {
    id: "job-002",
    title: "餐厅服务员",
    company: "外婆家",
    logo: "🍽️",
    salary: 5000,
    salaryType: "月",
    location: "杭州市西湖区文二路288号",
    distance: 1500,
    workTime: "早10:00 - 晚10:00，做一休一",
    requirements: ["形象端正", "能说普通话", "有服务意识"],
    jobType: "restaurant",
    hot: true,
    tags: ["包吃住", "晋升快", "环境好"],
    welfare: ["免费工作餐（午+晚）", "员工宿舍", "月休4天", "生日福利", "节日补贴"],
    physicalRequirement: "行走站立正常，善于沟通",
    ageRequirement: "18-35周岁",
    certificates: ["健康证（可入职后办理）"],
    environmentImages: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80",
    ],
    description:
      "负责点餐、上菜、桌面清洁、顾客接待等日常服务工作。门店位于商圈，人流量大但节奏适中。",
      phone: "138-0000-1002",
  },
  {
    id: "job-003",
    title: "快递分拣员",
    company: "顺丰速运上海分拨中心",
    logo: "📦",
    salary: 280,
    salaryType: "日",
    location: "上海市青浦区华新镇",
    distance: 18000,
    workTime: "早班 6:00-14:00 / 晚班 14:00-22:00，轮班制",
    requirements: ["身体强健", "吃苦耐劳", "能上夜班"],
    jobType: "logistics",
    hot: false,
    tags: ["日结", "就近住宿", "夜班补贴"],
    welfare: ["日结工资", "可安排宿舍（300元/月）", "夜班额外补贴20元/天", "高温费（6-9月）"],
    physicalRequirement: "体力活，需搬运20kg以内货物",
    ageRequirement: "18-50周岁",
    certificates: [],
    environmentImages: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80",
    ],
    description:
      "负责快递包裹的分拣、扫描、装车工作。室内作业，自动化分拣设备辅助，体力劳动强度中等。",
      phone: "138-0000-1003",
  },
  {
    id: "job-004",
    title: "家政保洁师",
    company: "天鹅到家",
    logo: "🏠",
    salary: 8000,
    salaryType: "月",
    location: "成都市武侯区桐梓林小区（就近分配）",
    distance: 3200,
    workTime: "早9:00 - 晚6:00，每周休息1天",
    requirements: ["手脚勤快", "细心耐心", "工具自备"],
    jobType: "housekeeping",
    hot: false,
    tags: ["派单制", "时间灵活", "高单提成"],
    welfare: ["系统派单，无需自己获客", "高单提成（500元起/单）", "工具包免费领取", "购买家政意外险"],
    physicalRequirement: "弯腰、抬手等日常家务动作",
    ageRequirement: "30-55周岁",
    certificates: ["家政从业资格证（优先）"],
    environmentImages: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    ],
    description:
      "为家庭客户提供日常保洁、深度清洁、收纳整理等服务。根据客户地址系统就近派单，每天2-4单。",
      phone: "138-0000-1004",
  },
  {
    id: "job-005",
    title: "小区保安",
    company: "万科物业",
    logo: "🛡️",
    salary: 4800,
    salaryType: "月",
    location: "南京市建邺区江山大街288号",
    distance: 5700,
    workTime: "三班轮换（早中晚各8小时），月休4天",
    requirements: ["男性优先", "170cm以上", "无犯罪记录"],
    jobType: "security",
    hot: false,
    tags: ["包住", "五险", "年终奖"],
    welfare: ["免费住宿（集体宿舍）", "五险", "年终奖（1-2个月工资）", "退伍军人优先"],
    physicalRequirement: "体态端正，站立巡逻需耐受",
    ageRequirement: "18-50周岁",
    certificates: ["保安员证（可入职后考取，公司报销）"],
    environmentImages: [
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    ],
    description:
      "负责小区门禁管理、巡逻、车辆指挥等工作。工作强度低，环境稳定，适合长期发展。",
      phone: "138-0000-1005",
  },
  {
    id: "job-006",
    title: "超市理货员",
    company: "大润发",
    logo: "🛒",
    salary: 4200,
    salaryType: "月",
    location: "武汉市江汉区解放大道688号",
    distance: 4100,
    workTime: "早7:00 - 晚10:00，轮班制，每天工作8小时",
    requirements: ["手脚麻利", "有超市工作经验优先", "可排班适应"],
    jobType: "retail",
    hot: false,
    tags: ["就近分配", "员工折扣", "节日福利"],
    welfare: ["员工内部折扣（9折）", "节日礼金/礼品", "年度体检", "带薪年假5天起"],
    physicalRequirement: "走动作业，搬运轻物（5kg内）",
    ageRequirement: "18-50周岁",
    certificates: ["健康证（可入职后办理）"],
    environmentImages: [
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&q=80",
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80",
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80",
    ],
    description:
      "负责货架整理、补货、收银辅助、顾客引导等工作。室内空调环境，工作强度低。",
      phone: "138-0000-1006",
  },
];
