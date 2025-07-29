// 经济产业页面功能
class EconomyModule {
    constructor() {
        this.charts = {};
        this.animationDuration = 2000;
        this.init();
    }

    init() {
        this.initCharts();
        this.bindEvents();
        this.startAnimations();
        this.loadEconomicData();
    }

    // 初始化所有图表
    initCharts() {
        this.initHamProductionChart();
        this.initHamSalesChart();
        this.initGDPChart();
        this.initIndustryChart();
        this.initInvestmentChart();
        this.initEmploymentChart();
    }

    // 火腿产量趋势图表
    initHamProductionChart() {
        const ctx = document.getElementById('hamProductionChart');
        if (!ctx) return;

        this.charts.hamProduction = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: '火腿产量 (万吨)',
                    data: [6.2, 6.8, 7.1, 7.6, 8.1, 8.5],
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#8b4513',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    }
                }
            }
        });
    }

    // 火腿销售渠道分布图表
    initHamSalesChart() {
        const ctx = document.getElementById('hamSalesChart');
        if (!ctx) return;

        this.charts.hamSales = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['线下零售', '电商平台', '批发市场', '出口贸易', '餐饮渠道'],
                datasets: [{
                    data: [35, 28, 18, 12, 7],
                    backgroundColor: [
                        '#fff',
                        'rgba(255, 255, 255, 0.8)',
                        'rgba(255, 255, 255, 0.6)',
                        'rgba(255, 255, 255, 0.4)',
                        'rgba(255, 255, 255, 0.2)'
                    ],
                    borderWidth: 2,
                    borderColor: '#8b4513'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#fff',
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // GDP增长趋势图表
    initGDPChart() {
        const ctx = document.getElementById('gdpChart');
        if (!ctx) return;

        this.charts.gdp = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'GDP总量 (亿元)',
                    data: [398.5, 425.8, 452.3, 468.9, 486.7],
                    backgroundColor: 'rgba(212, 175, 55, 0.8)',
                    borderColor: '#d4af37',
                    borderWidth: 2,
                    borderRadius: 5
                }, {
                    label: '增长率 (%)',
                    data: [6.8, 6.9, 6.2, 3.7, 3.8],
                    type: 'line',
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    yAxisID: 'y1',
                    tension: 0.4
                }]
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
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '年份'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'GDP总量 (亿元)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: '增长率 (%)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    // 产业结构分布图表
    initIndustryChart() {
        const ctx = document.getElementById('industryChart');
        if (!ctx) return;

        this.charts.industry = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['第一产业', '第二产业', '第三产业'],
                datasets: [{
                    data: [18.3, 49.2, 32.5],
                    backgroundColor: [
                        '#228b22',
                        '#d4af37',
                        '#4ecdc4'
                    ],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // 投资结构分析图表
    initInvestmentChart() {
        const ctx = document.getElementById('investmentChart');
        if (!ctx) return;

        this.charts.investment = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['基础设施', '工业投资', '房地产', '社会事业', '农业投资', '服务业'],
                datasets: [{
                    label: '2023年',
                    data: [85, 78, 65, 72, 68, 75],
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#d4af37'
                }, {
                    label: '2024年',
                    data: [92, 85, 70, 78, 75, 82],
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#4ecdc4'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                }
            }
        });
    }

    // 就业结构变化图表
    initEmploymentChart() {
        const ctx = document.getElementById('employmentChart');
        if (!ctx) return;

        this.charts.employment = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: '第一产业就业',
                    data: [45.2, 43.8, 42.1, 40.5, 38.9],
                    borderColor: '#228b22',
                    backgroundColor: 'rgba(34, 139, 34, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: '第二产业就业',
                    data: [28.5, 29.8, 31.2, 32.8, 34.1],
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: '第三产业就业',
                    data: [26.3, 26.4, 26.7, 26.7, 27.0],
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '年份'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 50,
                        title: {
                            display: true,
                            text: '就业比例 (%)'
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    }

    // 绑定事件
    bindEvents() {
        // 图表控制按钮
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const container = e.target.closest('.chart-container');
                const buttons = container.querySelectorAll('.chart-btn');
                
                // 更新按钮状态
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // 处理图表切换
                this.handleChartSwitch(e.target);
            });
        });

        // 窗口大小改变时重新调整图表
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => {
                if (chart) {
                    chart.resize();
                }
            });
        });
    }

    // 处理图表切换
    handleChartSwitch(button) {
        const period = button.dataset.period;
        const view = button.dataset.view;
        const type = button.dataset.type;
        const sector = button.dataset.sector;

        if (period && this.charts.gdp) {
            this.updateGDPChart(period);
        }
        
        if (view && this.charts.industry) {
            this.updateIndustryChart(view);
        }
        
        if (type && this.charts.investment) {
            this.updateInvestmentChart(type);
        }
        
        if (sector && this.charts.employment) {
            this.updateEmploymentChart(sector);
        }
    }

    // 更新GDP图表
    updateGDPChart(period) {
        let labels, gdpData, growthData;
        
        if (period === '10year') {
            labels = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
            gdpData = [285.6, 312.8, 338.9, 365.2, 378.5, 398.5, 425.8, 452.3, 468.9, 486.7];
            growthData = [8.2, 9.5, 8.3, 7.8, 3.6, 5.3, 6.9, 6.2, 3.7, 3.8];
        } else {
            labels = ['2020', '2021', '2022', '2023', '2024'];
            gdpData = [398.5, 425.8, 452.3, 468.9, 486.7];
            growthData = [5.3, 6.9, 6.2, 3.7, 3.8];
        }
        
        this.charts.gdp.data.labels = labels;
        this.charts.gdp.data.datasets[0].data = gdpData;
        this.charts.gdp.data.datasets[1].data = growthData;
        this.charts.gdp.update('active');
    }

    // 更新产业结构图表
    updateIndustryChart(view) {
        let data, labels;
        
        if (view === 'target') {
            data = [15.5, 52.8, 31.7];
            labels = ['第一产业 (目标)', '第二产业 (目标)', '第三产业 (目标)'];
        } else {
            data = [18.3, 49.2, 32.5];
            labels = ['第一产业', '第二产业', '第三产业'];
        }
        
        this.charts.industry.data.labels = labels;
        this.charts.industry.data.datasets[0].data = data;
        this.charts.industry.update('active');
    }

    // 更新投资结构图表
    updateInvestmentChart(type) {
        if (type === 'foreign') {
            this.charts.investment.data.labels = ['制造业', '服务业', '农业', '基础设施', '房地产', '高新技术'];
            this.charts.investment.data.datasets[0].data = [65, 58, 45, 72, 38, 85];
            this.charts.investment.data.datasets[1].data = [72, 65, 52, 78, 45, 92];
            this.charts.investment.data.datasets[0].label = '2023年外商投资';
            this.charts.investment.data.datasets[1].label = '2024年外商投资';
        } else {
            this.charts.investment.data.labels = ['基础设施', '工业投资', '房地产', '社会事业', '农业投资', '服务业'];
            this.charts.investment.data.datasets[0].data = [85, 78, 65, 72, 68, 75];
            this.charts.investment.data.datasets[1].data = [92, 85, 70, 78, 75, 82];
            this.charts.investment.data.datasets[0].label = '2023年';
            this.charts.investment.data.datasets[1].label = '2024年';
        }
        
        this.charts.investment.update('active');
    }

    // 更新就业结构图表
    updateEmploymentChart(sector) {
        if (sector === 'urban') {
            this.charts.employment.data.datasets[0].data = [25.2, 23.8, 22.1, 20.5, 18.9];
            this.charts.employment.data.datasets[1].data = [38.5, 39.8, 41.2, 42.8, 44.1];
            this.charts.employment.data.datasets[2].data = [36.3, 36.4, 36.7, 36.7, 37.0];
            this.charts.employment.data.datasets[0].label = '第一产业就业 (城镇)';
            this.charts.employment.data.datasets[1].label = '第二产业就业 (城镇)';
            this.charts.employment.data.datasets[2].label = '第三产业就业 (城镇)';
        } else {
            this.charts.employment.data.datasets[0].data = [45.2, 43.8, 42.1, 40.5, 38.9];
            this.charts.employment.data.datasets[1].data = [28.5, 29.8, 31.2, 32.8, 34.1];
            this.charts.employment.data.datasets[2].data = [26.3, 26.4, 26.7, 26.7, 27.0];
            this.charts.employment.data.datasets[0].label = '第一产业就业';
            this.charts.employment.data.datasets[1].label = '第二产业就业';
            this.charts.employment.data.datasets[2].label = '第三产业就业';
        }
        
        this.charts.employment.update('active');
    }

    // 开始动画
    startAnimations() {
        // 数字动画
        this.animateIndicators();
        
        // 进度条动画
        setTimeout(() => {
            this.animateProgressBars();
        }, 500);
    }

    // 指标数字动画
    animateIndicators() {
        const indicators = document.querySelectorAll('.indicator-value');
        
        indicators.forEach(indicator => {
            const target = parseFloat(indicator.dataset.target);
            this.animateNumber(indicator, 0, target, this.animationDuration);
        });
    }

    // 进度条动画
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            const width = bar.dataset.width;
            bar.style.width = width + '%';
        });
    }

    // 数字动画函数
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const isDecimal = end % 1 !== 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * this.easeOutCubic(progress);
            
            if (isDecimal) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = isDecimal ? end.toFixed(1) : end;
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 缓动函数
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // 加载经济数据
    loadEconomicData() {
        // 模拟数据加载
        setTimeout(() => {
            this.updateRealTimeData();
        }, 1000);
    }

    // 更新实时数据
    updateRealTimeData() {
        // 模拟实时数据更新
        setInterval(() => {
            this.updateRandomData();
        }, 30000); // 每30秒更新一次
    }

    // 更新随机数据
    updateRandomData() {
        // 随机更新一些数据点
        const charts = ['gdp', 'industry', 'investment'];
        const randomChart = charts[Math.floor(Math.random() * charts.length)];
        
        if (this.charts[randomChart]) {
            // 添加小幅随机变化
            const dataset = this.charts[randomChart].data.datasets[0];
            dataset.data = dataset.data.map(value => {
                const change = (Math.random() - 0.5) * 0.02; // ±1%的变化
                return Math.max(0, value * (1 + change));
            });
            
            this.charts[randomChart].update('none');
        }
    }

    // 销毁实例
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.economyModule = new EconomyModule();
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (window.economyModule) {
        window.economyModule.destroy();
    }
});