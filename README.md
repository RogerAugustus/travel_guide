# 🗺️ 旅行路书

一站式旅行规划工具。在日历上管理每日行程，右侧地图展示路线，底部面板收集吃喝玩乐建议，支持天气和台风预警。

## ✨ 功能

| 模块 | 说明 |
|------|------|
| 📅 **行程日历** | 月视图日历，显示每日住宿、景点、交通、活动，支持拖入活动卡片 |
| ✏️ **日详情编辑** | 点击日期展开详情面板，双击任意文字即可编辑，支持折叠不需要的模块 |
| 🗺️ **行程地图** | Leaflet + 高德瓦片，自动标注住宿/景点位置，绘制路线连线 |
| 🌦️ **天气预报** | 接入和风天气 API，展示 7 天逐日预报，每小时自动刷新 |
| ⚠️ **台风预警** | 自动检测行程日期与城市的台风/暴雨预警，红橙黄蓝四级提醒 |
| 🍜 **吃喝玩乐** | 预设广州/上海各 20+ 条活动建议，支持搜索、分类筛选、新增编辑 |
| 🚌 **交通规划** | 高铁、飞机、大巴、自驾等多种交通方式，记录班次、时间、出发到达地 |
| 🏨 **住宿延续** | 设置入住天数后自动将酒店信息复制到后续日期 |
| 📱 **手机适配** | 自适应布局，手机端底部标签切换，PWA 可安装到桌面 |
| 💾 **数据持久化** | LocalStorage 自动保存，支持 JSON 导出/导入备份 |

## 🚀 快速开始

### 本地运行

```bash
npm install
npm run dev
```

或者双击 **`启动.bat`**，自动打开浏览器。

### 手机访问

1. 电脑运行 `启动.bat`
2. 终端显示 `Network: http://26.x.x.x:5173/`
3. 手机连同一 WiFi，浏览器打开该地址
4. 浏览器菜单选「添加到主屏幕」，安装为 PWA

### 部署到公网（GitHub Pages）

```bash
# 1. 在 GitHub 创建新仓库（不要勾选初始化）

# 2. 关联远程仓库
git remote add origin https://github.com/<用户名>/<仓库名>.git
git branch -M main
git push -u origin main

# 3. 部署
npm run deploy
```

部署后访问 `https://<用户名>.github.io/<仓库名>/`，手机随时随地打开。

## ⚙️ 配置天气 API

默认使用模拟天气数据。获取真实天气：

1. 注册 [和风天气](https://id.qweather.com/#/register)（免费，每日 1000 次调用）
2. 控制台 → 项目管理 → 创建项目 → 免费订阅 → 复制 API Key
3. 在应用中点右上角「设置」→ 粘贴 Key → 保存

配置后天气和台风预警均使用真实数据。

## 🏗️ 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | React 19 |
| 构建 | Vite |
| 地图 | Leaflet + react-leaflet（高德瓦片） |
| 天气 | 和风天气 API v7 |
| 图标 | Lucide React |
| 拖拽 | HTML5 Drag & Drop |
| 存储 | LocalStorage |
| 部署 | GitHub Pages / Vercel / Netlify |

## 📁 项目结构

```
src/
├── App.jsx                        # 主组件，桌面/手机双布局
├── components/
│   ├── Calendar/                  # 日历 + 日详情
│   │   ├── Calendar.jsx           #   月视图日历网格
│   │   ├── DayCell.jsx            #   单日格子
│   │   └── DayDetail.jsx          #   日详情编辑面板
│   ├── MapPanel/MapPanel.jsx      # 地图面板
│   ├── WeatherBar/                # 天气
│   │   ├── WeatherBar.jsx         #   7天预报条
│   │   └── TyphoonAlert.jsx       #   台风预警
│   ├── ActivityPanel/             # 吃喝玩乐
│   │   ├── ActivityPanel.jsx      #   活动建议面板
│   │   └── ActivityCard.jsx       #   活动卡片（可拖拽）
│   ├── Header/Header.jsx          # 顶栏
│   └── common/                    # 通用组件
│       ├── EditableText.jsx       #   双击可编辑文本
│       └── Modal.jsx              #   弹窗
├── hooks/                         # 自定义 Hooks
│   ├── useTripData.js             #   数据 CRUD
│   ├── useWeather.js              #   天气获取
│   ├── useDragDrop.js             #   拖拽逻辑
│   └── useMobile.js               #   手机检测
├── services/                      # 服务层
│   ├── storage.js                 #   LocalStorage 封装
│   ├── weatherApi.js              #   和风天气 API
│   └── typhoonApi.js              #   台风预警
├── data/defaultActivities.js      # 广州/上海预设数据
└── constants/                     # 常量
    ├── mapTiles.js                #   高德瓦片 + 城市坐标
    └── weatherIcons.js            #   天气图标映射
```
