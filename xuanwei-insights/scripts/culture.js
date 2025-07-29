// 文化旅游模块
class CultureModule {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        this.initCharts();
        this.animateStats();
        this.setupInteractions();
        
        // 页面卸载时清理
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    initCharts() {
        // 游客接待量趋势图
        this.createVisitorChart();
        
        // 旅游收入构成图
        this.createRevenueChart();
        
        // 游客来源分布图
        this.createSourceChart();
        
        // 季节性客流变化图
        this.createSeasonChart();
    }

    createVisitorChart() {
        const ctx = document.getElementById('visitorChart');
        if (!ctx) return;

        this.charts.visitor = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2019年', '2020年', '2021年', '2022年', '2023年', '2024年'],
                datasets: [{
                    label: '游客接待量 (万人次)',
                    data: [420, 380, 450, 520, 580, 620],
                    borderColor: '#8b0000',
                    backgroundColor: 'rgba(139, 0, 0, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#dc143c',
                    pointBorderColor: '#8b0000',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#8b0000',
                        borderWidth: 1
                    }
                },
                scales: {
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
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        this.charts.revenue = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['住宿餐饮', '景区门票', '购物消费', '交通费用', '娱乐活动', '其他'],
                datasets: [{
                    data: [28.5, 18.2, 22.8, 12.5, 10.3, 7.7],
                    backgroundColor: [
                        '#8b0000',
                        '#dc143c',
                        '#ff6347',
                        '#ff7f50',
                        '#ffa07a',
                        '#ffb6c1'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#8b0000',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '亿元';
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

    createSourceChart() {
        const ctx = document.getElementById('sourceChart');
        if (!ctx) return;

        this.charts.source = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['云南省内', '四川', '贵州', '广西', '重庆', '其他省份', '境外'],
                datasets: [{
                    label: '游客数量 (万人次)',
                    data: [320, 85, 72, 45, 38, 28, 12],
                    backgroundColor: [
                        '#8b0000',
                        '#dc143c',
                        '#ff6347',
                        '#ff7f50',
                        '#ffa07a',
                        '#ffb6c1',
                        '#ffc0cb'
                    ],
                    borderColor: '#8b0000',
                    borderWidth: 1,
                    borderRadius: 8,
                    borderSkipped: false
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
                        borderColor: '#8b0000',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '万人次';
                            }
                        }
                    }
                },
                scales: {
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
                    },
                    x: {
                        grid: {
                            display: false
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

    createSeasonChart() {
        const ctx = document.getElementById('seasonChart');
        if (!ctx) return;

        this.charts.season = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [
                    {
                        label: '2023年',
                        data: [35, 28, 45, 52, 68, 58, 72, 75, 85, 78, 62, 42],
                        borderColor: '#8b0000',
                        backgroundColor: 'rgba(139, 0, 0, 0.2)',
                        borderWidth: 2,
                        pointBackgroundColor: '#dc143c',
                        pointBorderColor: '#8b0000',
                        pointBorderWidth: 2
                    },
                    {
                        label: '2024年',
                        data: [38, 32, 48, 58, 72, 65, 78, 82, 92, 85, 68, 48],
                        borderColor: '#ff6347',
                        backgroundColor: 'rgba(255, 99, 71, 0.2)',
                        borderWidth: 2,
                        pointBackgroundColor: '#ff7f50',
                        pointBorderColor: '#ff6347',
                        pointBorderWidth: 2
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
                        borderColor: '#8b0000',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.r + '万人次';
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        pointLabels: {
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            display: false
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

    animateStats() {
        // 动画显示统计数据
        const stats = document.querySelectorAll('.culture-stat div:first-child, .flow-number');
        
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
        
        stats.forEach(stat => observer.observe(stat));
    }

    animateNumber(element, start, end, originalText, duration) {
        const startTime = performance.now();
        const suffix = originalText.replace(/[0-9.]/g, '');
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * this.easeOutQuart(progress);
            
            if (end >= 1000) {
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

    setupInteractions() {
        // 节庆卡片悬停效果
        const festivalCards = document.querySelectorAll('.festival-card');
        festivalCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-10px)';
            });
        });

        // 景点卡片交互
        const scenicCards = document.querySelectorAll('.scenic-card');
        scenicCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                this.showScenicDetails(title);
            });
        });

        // 地图标记点击事件
        const markers = document.querySelectorAll('.marker');
        markers.forEach(marker => {
            marker.addEventListener('click', () => {
                const name = marker.getAttribute('data-name');
                this.showMarkerInfo(name);
            });
        });

        // 响应式处理
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    showScenicDetails(title) {
        // 显示景点详细信息（模拟）
        const details = {
            '尼珠河大峡谷': {
                description: '尼珠河大峡谷是云南省最深的峡谷之一，峡谷深达2000多米，两岸悬崖峭壁，风光壮美。这里是户外探险和摄影的绝佳去处，每年吸引大量游客前来观光。',
                features: ['峡谷深度2000+米', '悬崖峭壁景观', '户外探险基地', '摄影胜地'],
                bestTime: '4-10月',
                duration: '1-2天'
            },
            '芙蓉彝寨': {
                description: '芙蓉彝寨是保存完好的彝族传统村落，展现原生态的彝族文化和建筑风格。游客可以在这里体验民族风情，了解彝族传统文化。',
                features: ['彝族传统建筑', '民族文化体验', '手工艺品制作', '民族歌舞表演'],
                bestTime: '全年',
                duration: '半天-1天'
            }
            // 可以添加更多景点信息
        };

        const info = details[title];
        if (info) {
            alert(`${title}\n\n${info.description}\n\n特色：${info.features.join('、')}\n最佳游览时间：${info.bestTime}\n建议游览时长：${info.duration}`);
        }
    }

    showMarkerInfo(name) {
        // 显示地图标记信息
        const markerInfo = {
            '尼珠河大峡谷': '位置：宣威市普立乡\n特色：云南最深峡谷之一\n门票：80元/人',
            '芙蓉彝寨': '位置：宣威市龙场镇\n特色：彝族传统村落\n门票：60元/人',
            '九龙瀑布群': '位置：宣威市罗平县界\n特色：九级瀑布群\n门票：95元/人',
            '宣威火腿博物馆': '位置：宣威市区\n特色：火腿文化展示\n门票：免费',
            '东山森林公园': '位置：宣威市东山\n特色：城市绿肺，春季赏花\n门票：30元/人',
            '宛水公园': '位置：宣威市中心\n特色：综合性城市公园\n门票：免费'
        };

        const info = markerInfo[name];
        if (info) {
            alert(`${name}\n\n${info}`);
        }
    }

    handleResize() {
        // 处理窗口大小变化
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    cleanup() {
        // 清理图表资源
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new CultureModule();
});