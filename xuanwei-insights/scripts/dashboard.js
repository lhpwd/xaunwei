// 数据分析仪表盘模块
class DashboardModule {
    constructor() {
        this.charts = {};
        this.updateInterval = null;
        this.currentData = {};
        this.init();
    }

    init() {
        this.initCharts();
        this.initControls();
        this.initDataTable();
        this.startRealTimeUpdates();
        this.animateKPIs();
        
        // 页面卸载时清理
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    initCharts() {
        // 综合发展趋势图
        this.createTrendChart();
        
        // 经济结构分析图
        this.createEconomicChart();
        
        // 人口分布图
        this.createPopulationChart();
        
        // 旅游热力图
        this.createTourismChart();
        
        // 交通流量图
        this.createTransportChart();
        
        // 环境质量仪表盘
        this.createEnvironmentGauges();
    }

    createTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [
                    {
                        label: 'GDP增长率 (%)',
                        data: [6.8, 7.2, 8.1, 8.5, 9.2, 8.8, 9.5, 9.8, 10.2, 9.6, 8.9, 9.1],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: '旅游收入增长率 (%)',
                        data: [12.5, 15.2, 18.8, 22.1, 25.6, 20.3, 28.9, 32.1, 35.8, 30.2, 25.8, 28.5],
                        borderColor: '#f093fb',
                        backgroundColor: 'rgba(240, 147, 251, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y1'
                    },
                    {
                        label: '人口增长率 (%)',
                        data: [1.8, 2.1, 2.3, 2.0, 2.2, 2.4, 2.1, 2.3, 2.5, 2.2, 2.0, 2.1],
                        borderColor: '#4facfe',
                        backgroundColor: 'rgba(79, 172, 254, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y2'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(102, 126, 234, 0.1)'
                        },
                        ticks: {
                            color: '#667eea'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            color: '#f093fb'
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: false,
                        position: 'right'
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createEconomicChart() {
        const ctx = document.getElementById('economicChart');
        if (!ctx) return;

        this.charts.economic = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['第一产业', '第二产业', '第三产业'],
                datasets: [{
                    data: [18.5, 45.2, 36.3],
                    backgroundColor: [
                        '#43e97b',
                        '#667eea',
                        '#f093fb'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });
    }

    createPopulationChart() {
        const ctx = document.getElementById('populationChart');
        if (!ctx) return;

        this.charts.population = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0-14岁', '15-24岁', '25-34岁', '35-44岁', '45-54岁', '55-64岁', '65岁以上'],
                datasets: [
                    {
                        label: '男性 (万人)',
                        data: [12.5, 8.9, 15.2, 18.6, 16.8, 12.3, 8.9],
                        backgroundColor: '#4facfe',
                        borderColor: '#4facfe',
                        borderWidth: 1,
                        borderRadius: 6
                    },
                    {
                        label: '女性 (万人)',
                        data: [11.8, 8.2, 14.6, 17.9, 15.9, 11.8, 9.6],
                        backgroundColor: '#f093fb',
                        borderColor: '#f093fb',
                        borderWidth: 1,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '万';
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createTourismChart() {
        const ctx = document.getElementById('tourismChart');
        if (!ctx) return;

        this.charts.tourism = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [
                    {
                        label: '游客数量 (万人次)',
                        data: [35, 28, 45, 52, 68, 58, 72, 75, 85, 78, 62, 42],
                        borderColor: '#fa709a',
                        backgroundColor: 'rgba(250, 112, 154, 0.2)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#fa709a',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    },
                    {
                        label: '旅游收入 (亿元)',
                        data: [4.2, 3.5, 5.8, 6.9, 8.5, 7.2, 9.1, 9.8, 11.2, 10.5, 8.8, 6.4],
                        borderColor: '#fee140',
                        backgroundColor: 'rgba(254, 225, 64, 0.2)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#fee140',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#fa709a',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createTransportChart() {
        const ctx = document.getElementById('transportChart');
        if (!ctx) return;

        this.charts.transport = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['高速公路', '国道', '省道', '县道', '乡道', '铁路'],
                datasets: [{
                    label: '日均流量 (万车次)',
                    data: [15.8, 12.3, 8.9, 6.2, 4.1, 2.8],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '万车次/日';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '万';
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createEnvironmentGauges() {
        // 空气质量仪表盘
        this.createGaugeChart('airQualityGauge', 85, '空气质量', '#43e97b');
        
        // 水质指数仪表盘
        this.createGaugeChart('waterQualityGauge', 92, '水质指数', '#4facfe');
    }

    createGaugeChart(canvasId, value, label, color) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [value, 100 - value],
                    backgroundColor: [color, '#e2e8f0'],
                    borderWidth: 0,
                    cutout: '80%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });
    }

    initControls() {
        // 时间范围控制
        const timeRange = document.getElementById('timeRange');
        if (timeRange) {
            timeRange.addEventListener('change', (e) => {
                this.updateChartsData(e.target.value);
            });
        }

        // 数据类型控制
        const dataType = document.getElementById('dataType');
        if (dataType) {
            dataType.addEventListener('change', (e) => {
                this.filterDataByType(e.target.value);
            });
        }

        // 区域控制
        const region = document.getElementById('region');
        if (region) {
            region.addEventListener('change', (e) => {
                this.filterDataByRegion(e.target.value);
            });
        }

        // 刷新按钮
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshAllData();
            });
        }

        // 图表控制按钮
        this.initChartControls();
    }

    initChartControls() {
        // 趋势图控制
        const trendControls = document.querySelectorAll('[data-period]');
        trendControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.updateTrendPeriod(e.target.dataset.period);
                this.setActiveButton(e.target, trendControls);
            });
        });

        // 经济图控制
        const economicControls = document.querySelectorAll('[data-type]');
        economicControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.updateEconomicType(e.target.dataset.type);
                this.setActiveButton(e.target, economicControls);
            });
        });

        // 人口图控制
        const populationControls = document.querySelectorAll('[data-demo]');
        populationControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.updatePopulationDemo(e.target.dataset.demo);
                this.setActiveButton(e.target, populationControls);
            });
        });

        // 旅游图控制
        const tourismControls = document.querySelectorAll('[data-tourism]');
        tourismControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.updateTourismView(e.target.dataset.tourism);
                this.setActiveButton(e.target, tourismControls);
            });
        });

        // 交通图控制
        const transportControls = document.querySelectorAll('[data-transport]');
        transportControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.updateTransportView(e.target.dataset.transport);
                this.setActiveButton(e.target, transportControls);
            });
        });

        // 数据表格控制
        const tableControls = document.querySelectorAll('[data-table]');
        tableControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.updateTableView(e.target.dataset.table);
                this.setActiveButton(e.target, tableControls);
            });
        });
    }

    setActiveButton(activeBtn, allBtns) {
        allBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    updateTrendPeriod(period) {
        // 根据周期更新趋势图数据
        const periodData = {
            month: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                gdp: [6.8, 7.2, 8.1, 8.5, 9.2, 8.8, 9.5, 9.8, 10.2, 9.6, 8.9, 9.1]
            },
            quarter: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                gdp: [7.4, 8.8, 9.8, 9.2]
            },
            year: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                gdp: [6.2, 5.8, 7.5, 8.2, 8.8, 9.1]
            }
        };

        const data = periodData[period];
        if (data && this.charts.trend) {
            this.charts.trend.data.labels = data.labels;
            this.charts.trend.data.datasets[0].data = data.gdp;
            this.charts.trend.update('active');
        }
    }

    updateEconomicType(type) {
        const typeData = {
            industry: {
                labels: ['第一产业', '第二产业', '第三产业'],
                data: [18.5, 45.2, 36.3]
            },
            ownership: {
                labels: ['国有经济', '民营经济', '外资经济', '其他'],
                data: [25.8, 52.3, 15.6, 6.3]
            }
        };

        const data = typeData[type];
        if (data && this.charts.economic) {
            this.charts.economic.data.labels = data.labels;
            this.charts.economic.data.datasets[0].data = data.data;
            this.charts.economic.update('active');
        }
    }

    updatePopulationDemo(demo) {
        const demoData = {
            age: {
                labels: ['0-14岁', '15-24岁', '25-34岁', '35-44岁', '45-54岁', '55-64岁', '65岁以上'],
                male: [12.5, 8.9, 15.2, 18.6, 16.8, 12.3, 8.9],
                female: [11.8, 8.2, 14.6, 17.9, 15.9, 11.8, 9.6]
            },
            education: {
                labels: ['小学', '初中', '高中', '大专', '本科', '硕士', '博士'],
                male: [18.5, 25.8, 22.3, 15.6, 12.8, 4.2, 0.8],
                female: [16.9, 24.2, 23.1, 16.8, 14.2, 4.1, 0.7]
            }
        };

        const data = demoData[demo];
        if (data && this.charts.population) {
            this.charts.population.data.labels = data.labels;
            this.charts.population.data.datasets[0].data = data.male;
            this.charts.population.data.datasets[1].data = data.female;
            this.charts.population.update('active');
        }
    }

    updateTourismView(view) {
        // 旅游视图更新逻辑
        console.log('更新旅游视图:', view);
    }

    updateTransportView(view) {
        // 交通视图更新逻辑
        console.log('更新交通视图:', view);
    }

    updateTableView(view) {
        // 数据表格视图更新逻辑
        this.populateDataTable(view);
    }

    initDataTable() {
        this.populateDataTable('current');
    }

    populateDataTable(view) {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;

        const tableData = {
            current: [
                {
                    name: 'GDP总量',
                    current: '1,285.6亿元',
                    target: '1,300亿元',
                    completion: '98.9%',
                    growth: '+8.5%',
                    status: 'good',
                    updateTime: '2024-12-20 14:30'
                },
                {
                    name: '总人口',
                    current: '142.8万人',
                    target: '145万人',
                    completion: '98.5%',
                    growth: '+2.1%',
                    status: 'good',
                    updateTime: '2024-12-20 14:25'
                },
                {
                    name: '年接待游客',
                    current: '580万人次',
                    target: '600万人次',
                    completion: '96.7%',
                    growth: '+15.2%',
                    status: 'good',
                    updateTime: '2024-12-20 14:20'
                },
                {
                    name: '工业总产值',
                    current: '485.2亿元',
                    target: '500亿元',
                    completion: '97.0%',
                    growth: '+12.8%',
                    status: 'good',
                    updateTime: '2024-12-20 14:15'
                },
                {
                    name: '旅游收入',
                    current: '68.9亿元',
                    target: '70亿元',
                    completion: '98.4%',
                    growth: '+18.5%',
                    status: 'good',
                    updateTime: '2024-12-20 14:10'
                },
                {
                    name: '环境质量指数',
                    current: '89.5',
                    target: '90',
                    completion: '99.4%',
                    growth: '+5.2%',
                    status: 'warning',
                    updateTime: '2024-12-20 14:05'
                }
            ]
        };

        const data = tableData[view] || tableData.current;
        
        tableBody.innerHTML = data.map(row => `
            <tr>
                <td>${row.name}</td>
                <td>${row.current}</td>
                <td>${row.target}</td>
                <td>${row.completion}</td>
                <td>${row.growth}</td>
                <td><span class="status-badge status-${row.status}">${this.getStatusText(row.status)}</span></td>
                <td>${row.updateTime}</td>
            </tr>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            good: '良好',
            warning: '警告',
            danger: '危险'
        };
        return statusMap[status] || '未知';
    }

    animateKPIs() {
        // 动画显示KPI数值
        const kpiValues = document.querySelectorAll('.kpi-value');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
                    
                    if (!isNaN(numericValue)) {
                        this.animateNumber(target, 0, numericValue, finalValue, 2000);
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        kpiValues.forEach(kpi => observer.observe(kpi));
    }

    animateNumber(element, start, end, originalText, duration) {
        const startTime = performance.now();
        const suffix = originalText.replace(/[0-9.]/g, '');
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * this.easeOutQuart(progress);
            
            if (end >= 100) {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            } else {
                element.textContent = current.toFixed(1) + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = originalText;
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    startRealTimeUpdates() {
        // 模拟实时数据更新
        this.updateInterval = setInterval(() => {
            this.updateRealTimeData();
        }, 30000); // 每30秒更新一次
        
        // 更新时间显示
        this.updateLastUpdateTime();
        setInterval(() => {
            this.updateLastUpdateTime();
        }, 1000);
    }

    updateRealTimeData() {
        // 模拟数据变化
        const kpiElements = {
            gdp: document.getElementById('gdpValue'),
            population: document.getElementById('populationValue'),
            tourist: document.getElementById('touristValue'),
            industrial: document.getElementById('industrialValue'),
            revenue: document.getElementById('revenueValue'),
            environment: document.getElementById('environmentValue')
        };

        // 随机小幅度变化
        Object.entries(kpiElements).forEach(([key, element]) => {
            if (element) {
                const currentValue = parseFloat(element.textContent.replace(/[^0-9.]/g, ''));
                const change = (Math.random() - 0.5) * 0.1; // ±0.05%的变化
                const newValue = currentValue * (1 + change / 100);
                
                if (currentValue >= 100) {
                    element.textContent = Math.floor(newValue).toLocaleString();
                } else {
                    element.textContent = newValue.toFixed(1);
                }
            }
        });

        // 更新环境质量仪表盘
        const airQuality = 85 + (Math.random() - 0.5) * 10;
        const waterQuality = 92 + (Math.random() - 0.5) * 8;
        
        document.getElementById('airQualityValue').textContent = Math.floor(airQuality);
        document.getElementById('waterQualityValue').textContent = Math.floor(waterQuality);
    }

    updateLastUpdateTime() {
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            lastUpdate.textContent = `最后更新：${timeString}`;
        }
    }

    updateChartsData(timeRange) {
        console.log('更新图表数据，时间范围:', timeRange);
        // 根据时间范围更新所有图表数据
    }

    filterDataByType(dataType) {
        console.log('按类型过滤数据:', dataType);
        // 根据数据类型过滤显示
    }

    filterDataByRegion(region) {
        console.log('按区域过滤数据:', region);
        // 根据区域过滤显示
    }

    refreshAllData() {
        // 刷新所有数据
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            const icon = refreshBtn.querySelector('i');
            icon.style.animation = 'spin 1s linear infinite';
            
            setTimeout(() => {
                icon.style.animation = '';
                this.updateRealTimeData();
                
                // 重新渲染所有图表
                Object.values(this.charts).forEach(chart => {
                    if (chart && typeof chart.update === 'function') {
                        chart.update('active');
                    }
                });
            }, 1000);
        }
    }

    cleanup() {
        // 清理定时器
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // 清理图表资源
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// 添加旋转动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new DashboardModule();
});