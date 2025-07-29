// 地理交通页面功能
class GeographyModule {
    constructor() {
        this.map = null;
        this.currentLayer = 'satellite';
        this.markers = [];
        this.charts = {};
        this.init();
    }

    init() {
        this.initMap();
        this.initCharts();
        this.bindEvents();
        this.loadTransportData();
    }

    // 初始化地图
    initMap() {
        // 宣威市中心坐标
        const xuanweiCenter = [25.5547, 104.1041];
        
        this.map = L.map('xuanwei-map').setView(xuanweiCenter, 10);
        
        // 默认卫星图层
        this.addSatelliteLayer();
        
        // 添加地标和交通枢纽
        this.addLandmarks();
        this.addTransportHubs();
        
        // 添加地图控件
        this.addMapControls();
    }

    // 添加卫星图层
    addSatelliteLayer() {
        // 使用更稳定的OpenStreetMap服务
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);
    }

    // 添加地形图层
    addTerrainLayer() {
        this.map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                this.map.removeLayer(layer);
            }
        });
        
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            maxZoom: 17
        }).addTo(this.map);
    }

    // 添加标准地图图层
    addStandardLayer() {
        this.map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                this.map.removeLayer(layer);
            }
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);
    }

    // 添加地标
    addLandmarks() {
        const landmarks = [
            {
                name: '宣威市政府',
                coords: [25.5547, 104.1041],
                type: 'government',
                description: '宣威市人民政府所在地'
            },
            {
                name: '宣威火车站',
                coords: [25.5420, 104.0980],
                type: 'transport',
                description: '沪昆高铁宣威站'
            },
            {
                name: '宣威汽车客运站',
                coords: [25.5580, 104.1100],
                type: 'transport',
                description: '宣威市主要客运站'
            },
            {
                name: '宣威工业园区',
                coords: [25.5200, 104.1200],
                type: 'industry',
                description: '宣威市重要工业基地'
            },
            {
                name: '尼珠河大峡谷',
                coords: [25.6500, 104.2000],
                type: 'scenic',
                description: '著名自然景观'
            }
        ];

        landmarks.forEach(landmark => {
            const icon = this.getMarkerIcon(landmark.type);
            const marker = L.marker(landmark.coords, { icon })
                .addTo(this.map)
                .bindPopup(`
                    <div style="text-align: center; padding: 10px;">
                        <h4 style="margin-bottom: 8px; color: #2c5530;">${landmark.name}</h4>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">${landmark.description}</p>
                    </div>
                `);
            
            this.markers.push(marker);
        });
    }

    // 添加交通枢纽
    addTransportHubs() {
        const transportHubs = [
            {
                name: '北盘江大桥',
                coords: [25.7000, 104.3500],
                type: 'bridge',
                description: '世界第一高桥，连接云南贵州'
            },
            {
                name: '普宣高速入口',
                coords: [25.5300, 104.0800],
                type: 'highway',
                description: '普宣高速公路宣威入口'
            },
            {
                name: '宣曲高速入口',
                coords: [25.5800, 104.1300],
                type: 'highway',
                description: '宣曲高速公路入口'
            },
            {
                name: '宣威港',
                coords: [25.5100, 104.0900],
                type: 'port',
                description: '内河货运港口'
            }
        ];

        transportHubs.forEach(hub => {
            const icon = this.getMarkerIcon(hub.type);
            const marker = L.marker(hub.coords, { icon })
                .addTo(this.map)
                .bindPopup(`
                    <div style="text-align: center; padding: 10px;">
                        <h4 style="margin-bottom: 8px; color: #2c5530;">${hub.name}</h4>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">${hub.description}</p>
                    </div>
                `);
            
            this.markers.push(marker);
        });
    }

    // 获取标记图标
    getMarkerIcon(type) {
        const iconMap = {
            government: '🏛️',
            transport: '🚉',
            industry: '🏭',
            scenic: '🏔️',
            bridge: '🌉',
            highway: '🛣️',
            port: '⚓'
        };

        return L.divIcon({
            html: `<div style="
                background: linear-gradient(45deg, #2c5530, #4a7c59);
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                border: 2px solid white;
            ">${iconMap[type] || '📍'}</div>`,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    // 添加地图控件
    addMapControls() {
        // 添加比例尺
        L.control.scale({
            position: 'bottomleft',
            metric: true,
            imperial: false
        }).addTo(this.map);

        // 添加图例
        const legend = L.control({ position: 'topright' });
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'map-legend');
            div.innerHTML = `
                <div style="
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    font-size: 0.85rem;
                ">
                    <h4 style="margin: 0 0 10px 0; color: #2c5530;">图例</h4>
                    <div style="margin-bottom: 5px;">🏛️ 政府机构</div>
                    <div style="margin-bottom: 5px;">🚉 交通枢纽</div>
                    <div style="margin-bottom: 5px;">🏭 工业园区</div>
                    <div style="margin-bottom: 5px;">🏔️ 景点景区</div>
                    <div style="margin-bottom: 5px;">🌉 重要桥梁</div>
                    <div style="margin-bottom: 5px;">🛣️ 高速入口</div>
                    <div>⚓ 港口码头</div>
                </div>
            `;
            return div;
        };
        legend.addTo(this.map);
    }

    // 初始化图表
    initCharts() {
        this.initTransportChart();
        this.initPassengerChart();
        this.initCargoChart();
        this.initInvestmentChart();
    }

    // 交通网络里程统计图表
    initTransportChart() {
        const ctx = document.getElementById('transportChart');
        if (!ctx) return;

        this.charts.transport = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['高速公路', '国道', '省道', '县道', '乡道'],
                datasets: [{
                    data: [285, 156, 234, 567, 1234],
                    backgroundColor: [
                        '#2c5530',
                        '#4a7c59',
                        '#6b8e23',
                        '#8fbc8f',
                        '#98fb98'
                    ],
                    borderWidth: 2,
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
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + ' 公里';
                            }
                        }
                    }
                }
            }
        });
    }

    // 客运量年度变化图表
    initPassengerChart() {
        const ctx = document.getElementById('passengerChart');
        if (!ctx) return;

        this.charts.passenger = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: '铁路客运量',
                    data: [280, 195, 220, 310, 385, 420],
                    borderColor: '#2c5530',
                    backgroundColor: 'rgba(44, 85, 48, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: '公路客运量',
                    data: [450, 380, 420, 480, 520, 580],
                    borderColor: '#4a7c59',
                    backgroundColor: 'rgba(74, 124, 89, 0.1)',
                    tension: 0.4,
                    fill: true
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
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '客运量 (万人次)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '年份'
                        }
                    }
                }
            }
        });
    }

    // 货运量分析图表
    initCargoChart() {
        const ctx = document.getElementById('cargoChart');
        if (!ctx) return;

        this.charts.cargo = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['煤炭', '农产品', '建材', '化工', '机械', '其他'],
                datasets: [{
                    label: '货运量 (万吨)',
                    data: [1250, 680, 420, 380, 290, 180],
                    backgroundColor: [
                        '#2c5530',
                        '#4a7c59',
                        '#6b8e23',
                        '#8fbc8f',
                        '#98fb98',
                        '#90ee90'
                    ],
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '货运量 (万吨)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '货物类型'
                        }
                    }
                }
            }
        });
    }

    // 交通投资趋势图表
    initInvestmentChart() {
        const ctx = document.getElementById('investmentChart');
        if (!ctx) return;

        this.charts.investment = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: '基础设施投资',
                    data: [15.2, 18.5, 22.3, 28.7, 35.2, 42.1],
                    backgroundColor: 'rgba(44, 85, 48, 0.8)',
                    borderColor: '#2c5530',
                    borderWidth: 1
                }, {
                    label: '交通建设投资',
                    data: [8.5, 12.3, 16.8, 21.2, 26.5, 32.8],
                    backgroundColor: 'rgba(74, 124, 89, 0.8)',
                    borderColor: '#4a7c59',
                    borderWidth: 1
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
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '投资额 (亿元)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '年份'
                        }
                    }
                }
            }
        });
    }

    // 绑定事件
    bindEvents() {
        // 地图图层切换
        document.querySelectorAll('.map-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layer = e.target.dataset.layer;
                this.switchMapLayer(layer);
                
                // 更新按钮状态
                document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // 窗口大小改变时重新调整地图
        window.addEventListener('resize', () => {
            if (this.map) {
                setTimeout(() => {
                    this.map.invalidateSize();
                }, 100);
            }
        });
    }

    // 切换地图图层
    switchMapLayer(layer) {
        this.currentLayer = layer;
        
        switch (layer) {
            case 'satellite':
                this.addSatelliteLayer();
                break;
            case 'terrain':
                this.addTerrainLayer();
                break;
            case 'transport':
                this.addStandardLayer();
                this.highlightTransportNetwork();
                break;
            case 'landmarks':
                this.addStandardLayer();
                this.highlightLandmarks();
                break;
        }
    }

    // 高亮交通网络
    highlightTransportNetwork() {
        // 添加交通路线
        const transportRoutes = [
            {
                name: '沪昆高铁',
                coords: [[25.5420, 104.0980], [25.6000, 104.2000], [25.7000, 104.3500]],
                color: '#ff6b6b',
                type: 'railway'
            },
            {
                name: '普宣高速',
                coords: [[25.5300, 104.0800], [25.5547, 104.1041], [25.6000, 104.1500]],
                color: '#4ecdc4',
                type: 'highway'
            }
        ];

        transportRoutes.forEach(route => {
            const polyline = L.polyline(route.coords, {
                color: route.color,
                weight: 4,
                opacity: 0.8
            }).addTo(this.map);
            
            polyline.bindPopup(`
                <div style="text-align: center; padding: 10px;">
                    <h4 style="margin-bottom: 8px; color: ${route.color};">${route.name}</h4>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">${route.type === 'railway' ? '铁路线' : '高速公路'}</p>
                </div>
            `);
        });
    }

    // 高亮地标
    highlightLandmarks() {
        // 为重要地标添加圆形高亮
        const importantLandmarks = [
            { coords: [25.5547, 104.1041], radius: 2000, name: '市中心区域' },
            { coords: [25.5420, 104.0980], radius: 1500, name: '火车站区域' },
            { coords: [25.6500, 104.2000], radius: 3000, name: '景区范围' }
        ];

        importantLandmarks.forEach(landmark => {
            const circle = L.circle(landmark.coords, {
                color: '#2c5530',
                fillColor: '#4a7c59',
                fillOpacity: 0.2,
                radius: landmark.radius
            }).addTo(this.map);
            
            circle.bindPopup(`
                <div style="text-align: center; padding: 10px;">
                    <h4 style="margin-bottom: 8px; color: #2c5530;">${landmark.name}</h4>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">半径: ${landmark.radius/1000}公里</p>
                </div>
            `);
        });
    }

    // 加载交通数据
    loadTransportData() {
        // 模拟数据加载
        setTimeout(() => {
            this.updateTransportStats();
        }, 1000);
    }

    // 更新交通统计数据
    updateTransportStats() {
        const stats = document.querySelectorAll('.stat-number');
        const targetValues = [3, 1, 15, 2];
        
        stats.forEach((stat, index) => {
            if (index < targetValues.length) {
                this.animateNumber(stat, 0, targetValues[index], 2000);
            }
        });
    }

    // 数字动画
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 销毁实例
    destroy() {
        if (this.map) {
            this.map.remove();
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.geographyModule = new GeographyModule();
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (window.geographyModule) {
        window.geographyModule.destroy();
    }
});