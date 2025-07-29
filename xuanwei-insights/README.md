# 宣威市城市洞察平台

一个基于现代Web技术构建的城市数据可视化平台，全方位展示云南省宣威市的经济发展、文化旅游、地理交通等城市全景信息。

## 🌟 项目特色

- **数据可视化**: 使用Chart.js提供丰富的图表展示
- **响应式设计**: 完美适配各种设备屏幕
- **交互体验**: 支持数据上传、报告导出等交互功能
- **模块化架构**: 清晰的功能模块划分
- **现代UI**: 基于CSS3的现代化界面设计

## 📁 项目结构

```
xuanwei-insights/
├── index.html              # 首页 - 城市概况和导航入口
├── geography.html          # 地理交通页 - 地图、交通枢纽
├── economy.html            # 经济产业页 - 火腿产业、农业数据
├── culture.html            # 文化旅游页 - 景点、文化节庆
├── dashboard.html          # 数据分析页 - 综合仪表盘
├── timeline.html           # 时间轴页 - 城市发展历程
├── upload.html             # 数据上传页 - CSV/JSON文件上传
├── export.html             # 报告导出页 - PDF/图片导出
├── styles/
│   ├── main.css           # 主样式文件
│   ├── geography.css      # 地理交通页样式
│   ├── economy.css        # 经济产业页样式
│   ├── culture.css        # 文化旅游页样式
│   ├── dashboard.css      # 数据分析页样式
│   ├── timeline.css       # 时间轴页样式
│   ├── upload.css         # 数据上传页样式
│   └── export.css         # 报告导出页样式
├── scripts/
│   ├── main.js            # 主JavaScript文件
│   ├── geography.js       # 地理交通功能
│   ├── economy.js         # 经济产业功能
│   ├── culture.js         # 文化旅游功能
│   ├── dashboard.js       # 数据分析功能
│   ├── timeline.js        # 时间轴功能
│   ├── upload.js          # 数据上传功能
│   └── export.js          # 报告导出功能
├── data/
│   ├── sample_economic.csv    # 经济数据样例
│   ├── sample_population.csv  # 人口数据样例
│   ├── sample_tourism.csv     # 旅游数据样例
│   └── sample_transport.csv   # 交通数据样例
└── README.md              # 项目说明文档
```

## 🚀 功能模块

### 1. 首页 (index.html)
- 城市概况展示（位置、面积、人口、特色）
- 全站导航入口
- 城市关键统计数据
- 平台功能介绍

### 2. 地理交通页 (geography.html)
- 交互式地图展示
- 交通枢纽信息（昆曲宣城际动车、北盘江大桥、普宣高速等）
- 地理位置和区域分布
- 交通流量数据可视化

### 3. 经济产业页 (economy.html)
- 宣威火腿产业数据（年产量、产值、就业）
- 地方农业产业分析
- 经济发展趋势图表
- 产业结构分析

### 4. 文化旅游页 (culture.html)
- 火腿美食文化节展示
- 主要景点介绍（尼珠河大峡谷、芙蓉彝寨等）
- 旅游数据统计
- 文化遗产展示

### 5. 数据分析页 (dashboard.html)
- 综合数据仪表盘
- 经济数据、人口趋势、游客流量图表
- 实时数据更新
- 多维度数据分析

### 6. 时间轴页 (timeline.html)
- 城市重大事件展示
- 历年火腿节活动记录
- 发展历程可视化
- 事件筛选和搜索

### 7. 数据上传页 (upload.html)
- 支持CSV/JSON文件上传
- 数据解析和预览
- 自动生成图表
- 数据验证和错误处理

### 8. 报告导出页 (export.html)
- PDF报告生成
- 图表截图导出
- 多种导出格式支持
- 自定义报告模板

## 🛠️ 技术栈

- **前端框架**: 原生HTML5 + CSS3 + JavaScript
- **图表库**: Chart.js
- **地图库**: Leaflet.js
- **图标库**: Font Awesome
- **PDF生成**: jsPDF
- **文件解析**: PapaParse (CSV)
- **截图功能**: html2canvas

## 📊 数据格式

### 经济数据 (CSV格式)
```csv
year,gdp,growth_rate,primary_industry,secondary_industry,tertiary_industry
2022,1356.8,5.5,156.2,542.3,658.3
2023,1425.3,5.1,162.8,567.9,694.6
2024,1498.2,5.1,168.5,589.2,740.5
```

### 人口数据 (CSV格式)
```csv
age_group,male,female,total
0-14,12.5,11.8,24.3
15-64,45.2,43.8,89.0
65+,6.8,7.5,14.3
```

### 旅游数据 (CSV格式)
```csv
month,visitors,revenue,satisfaction
1月,35.2,4.2,4.6
2月,28.5,3.5,4.5
3月,42.8,5.1,4.7
```

### 交通数据 (CSV格式)
```csv
route,type,daily_flow,capacity
昆曲宣城际,高铁,8500,12000
普宣高速,高速公路,25000,40000
320国道,国道,15000,25000
```

## 🎨 设计特色

### 色彩方案
- **主色调**: 渐变蓝紫色 (#667eea → #764ba2)
- **经济模块**: 金色系 (#ffd700)
- **文化模块**: 红色系 (#e53e3e)
- **地理模块**: 绿色系 (#38a169)
- **数据模块**: 蓝色系 (#3182ce)

### 交互效果
- 卡片悬停动画
- 数字滚动动画
- 渐入渐出效果
- 响应式布局
- 平滑滚动

## 🚀 快速开始

1. **克隆项目**
   ```bash
   git clone [项目地址]
   cd xuanwei-insights
   ```

2. **启动本地服务器**
   ```bash
   # 使用Python
   python -m http.server 8000
   
   # 或使用Node.js
   npx serve .
   
   # 或使用Live Server (VS Code扩展)
   ```

3. **访问平台**
   打开浏览器访问 `http://localhost:8000`

## 📱 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔧 自定义配置

### 修改城市数据
1. 编辑各页面HTML文件中的数据
2. 更新JavaScript文件中的数据源
3. 替换样例CSV文件

### 添加新模块
1. 创建新的HTML页面
2. 添加对应的CSS和JavaScript文件
3. 更新导航菜单
4. 添加数据接口

### 自定义样式
1. 修改CSS变量定义
2. 调整色彩方案
3. 更新字体和布局

## 📈 性能优化

- 图片懒加载
- CSS和JavaScript压缩
- 缓存策略
- 响应式图片
- 代码分割

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者: [维护者姓名]
- 邮箱: [邮箱地址]
- 项目链接: [项目地址]

## 🙏 致谢

- Chart.js 团队提供的优秀图表库
- Leaflet.js 团队提供的地图解决方案
- Font Awesome 提供的图标库
- 所有贡献者的支持和帮助

---

**宣威市城市洞察平台** - 让数据说话，让城市更智慧 🏙️