// 数据上传模块
class UploadModule {
    constructor() {
        this.uploadedData = null;
        this.currentChart = null;
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.supportedFormats = ['csv', 'json'];
        this.uploadedFilesCount = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.animateStats();
        this.observeElements();
    }

    setupEventListeners() {
        // 文件输入
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // 清除按钮
        const clearBtn = document.getElementById('clearBtn');
        clearBtn.addEventListener('click', () => this.clearData());

        // 预览标签切换
        const previewTabs = document.querySelectorAll('.preview-tab');
        previewTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchPreviewTab(e.target.dataset.tab));
        });

        // 图表控制
        const chartType = document.getElementById('chartType');
        const xAxisData = document.getElementById('xAxisData');
        const yAxisData = document.getElementById('yAxisData');
        const groupData = document.getElementById('groupData');

        [chartType, xAxisData, yAxisData, groupData].forEach(control => {
            if (control) {
                control.addEventListener('change', () => this.updateChart());
            }
        });

        // 示例卡片点击
        const sampleCards = document.querySelectorAll('.sample-card');
        sampleCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('download-sample')) {
                    this.loadSampleData(card.dataset.sample);
                }
            });
        });
    }

    setupDragAndDrop() {
        const uploadZone = document.getElementById('uploadZone');

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files);
        });
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.handleFiles(files);
    }

    handleFiles(files) {
        if (files.length === 0) return;

        // 验证文件
        const validFiles = files.filter(file => this.validateFile(file));
        
        if (validFiles.length === 0) {
            this.showError('没有有效的文件被选择');
            return;
        }

        // 处理第一个有效文件
        this.processFile(validFiles[0]);
    }

    validateFile(file) {
        // 检查文件大小
        if (file.size > this.maxFileSize) {
            this.showError(`文件 "${file.name}" 超过最大大小限制 (10MB)`);
            return false;
        }

        // 检查文件格式
        const extension = file.name.split('.').pop().toLowerCase();
        if (!this.supportedFormats.includes(extension)) {
            this.showError(`不支持的文件格式: ${extension}`);
            return false;
        }

        return true;
    }

    processFile(file) {
        this.showProgress(true);
        this.updateProgress(0);

        const reader = new FileReader();
        const extension = file.name.split('.').pop().toLowerCase();

        reader.onload = (e) => {
            try {
                let data;
                
                if (extension === 'csv') {
                    data = this.parseCSV(e.target.result);
                } else if (extension === 'json') {
                    data = this.parseJSON(e.target.result);
                }

                this.uploadedData = data;
                this.displayFileInfo(file, data);
                this.displayDataPreview(data);
                this.updateUploadedFilesCount();
                this.showSuccess(`文件 "${file.name}" 上传成功！`);
                
            } catch (error) {
                this.showError(`解析文件时出错: ${error.message}`);
            } finally {
                this.updateProgress(100);
                setTimeout(() => this.showProgress(false), 1000);
            }
        };

        reader.onerror = () => {
            this.showError('读取文件时出错');
            this.showProgress(false);
        };

        // 模拟进度
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 90) {
                clearInterval(progressInterval);
                progress = 90;
            }
            this.updateProgress(progress);
        }, 100);

        reader.readAsText(file);
    }

    parseCSV(csvText) {
        const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
        });

        if (result.errors.length > 0) {
            throw new Error('CSV解析错误: ' + result.errors[0].message);
        }

        return {
            headers: result.meta.fields,
            rows: result.data,
            type: 'csv'
        };
    }

    parseJSON(jsonText) {
        const jsonData = JSON.parse(jsonText);
        
        // 如果是数组，直接使用
        if (Array.isArray(jsonData)) {
            if (jsonData.length === 0) {
                throw new Error('JSON数组为空');
            }
            
            const headers = Object.keys(jsonData[0]);
            return {
                headers: headers,
                rows: jsonData,
                type: 'json'
            };
        }
        
        // 如果是对象，尝试找到数组字段
        const arrayFields = Object.keys(jsonData).filter(key => Array.isArray(jsonData[key]));
        
        if (arrayFields.length === 0) {
            throw new Error('JSON中没有找到数组数据');
        }
        
        const dataArray = jsonData[arrayFields[0]];
        const headers = Object.keys(dataArray[0]);
        
        return {
            headers: headers,
            rows: dataArray,
            type: 'json'
        };
    }

    displayFileInfo(file, data) {
        const fileInfo = document.getElementById('fileInfo');
        const fileDetails = document.getElementById('fileDetails');
        
        const fileSize = (file.size / 1024).toFixed(2);
        const rowCount = data.rows.length;
        const columnCount = data.headers.length;
        
        fileDetails.innerHTML = `
            <div class="file-detail">
                <span class="detail-value">${file.name}</span>
                <span class="detail-label">文件名</span>
            </div>
            <div class="file-detail">
                <span class="detail-value">${fileSize} KB</span>
                <span class="detail-label">文件大小</span>
            </div>
            <div class="file-detail">
                <span class="detail-value">${rowCount}</span>
                <span class="detail-label">数据行数</span>
            </div>
            <div class="file-detail">
                <span class="detail-value">${columnCount}</span>
                <span class="detail-label">数据列数</span>
            </div>
            <div class="file-detail">
                <span class="detail-value">${data.type.toUpperCase()}</span>
                <span class="detail-label">文件类型</span>
            </div>
        `;
        
        fileInfo.classList.add('show');
    }

    displayDataPreview(data) {
        this.displayTable(data);
        this.setupChartControls(data);
        this.displayStatistics(data);
        
        const dataPreview = document.getElementById('dataPreview');
        dataPreview.classList.add('show');
    }

    displayTable(data) {
        const tableHead = document.getElementById('tableHead');
        const tableBody = document.getElementById('tableBody');
        
        // 创建表头
        const headerRow = document.createElement('tr');
        data.headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        tableHead.innerHTML = '';
        tableHead.appendChild(headerRow);
        
        // 创建表体（限制显示前100行）
        tableBody.innerHTML = '';
        const displayRows = data.rows.slice(0, 100);
        
        displayRows.forEach(row => {
            const tr = document.createElement('tr');
            data.headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header] || '';
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
        
        if (data.rows.length > 100) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = data.headers.length;
            td.textContent = `... 还有 ${data.rows.length - 100} 行数据`;
            td.style.textAlign = 'center';
            td.style.fontStyle = 'italic';
            td.style.color = '#718096';
            tr.appendChild(td);
            tableBody.appendChild(tr);
        }
    }

    setupChartControls(data) {
        const xAxisData = document.getElementById('xAxisData');
        const yAxisData = document.getElementById('yAxisData');
        const groupData = document.getElementById('groupData');
        
        // 清空选项
        [xAxisData, yAxisData, groupData].forEach(select => {
            if (select) {
                select.innerHTML = '';
            }
        });
        
        // 添加列选项
        data.headers.forEach(header => {
            const option1 = document.createElement('option');
            option1.value = header;
            option1.textContent = header;
            xAxisData.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = header;
            option2.textContent = header;
            yAxisData.appendChild(option2);
            
            const option3 = document.createElement('option');
            option3.value = header;
            option3.textContent = header;
            groupData.appendChild(option3);
        });
        
        // 设置默认选择
        if (data.headers.length >= 2) {
            xAxisData.value = data.headers[0];
            yAxisData.value = data.headers[1];
        }
        
        // 生成初始图表
        this.updateChart();
    }

    updateChart() {
        if (!this.uploadedData) return;
        
        const chartType = document.getElementById('chartType').value;
        const xAxis = document.getElementById('xAxisData').value;
        const yAxis = document.getElementById('yAxisData').value;
        const groupBy = document.getElementById('groupData').value;
        
        if (!xAxis || !yAxis) return;
        
        const chartData = this.prepareChartData(chartType, xAxis, yAxis, groupBy);
        this.renderChart(chartType, chartData);
    }

    prepareChartData(chartType, xAxis, yAxis, groupBy) {
        const data = this.uploadedData.rows;
        
        if (groupBy && groupBy !== '') {
            // 分组数据
            const groups = {};
            data.forEach(row => {
                const groupValue = row[groupBy];
                if (!groups[groupValue]) {
                    groups[groupValue] = [];
                }
                groups[groupValue].push(row);
            });
            
            const labels = [...new Set(data.map(row => row[xAxis]))];
            const datasets = Object.keys(groups).map((groupName, index) => {
                const groupData = groups[groupName];
                const values = labels.map(label => {
                    const item = groupData.find(row => row[xAxis] === label);
                    return item ? (typeof item[yAxis] === 'number' ? item[yAxis] : 0) : 0;
                });
                
                return {
                    label: groupName,
                    data: values,
                    backgroundColor: this.getChartColor(index, 0.7),
                    borderColor: this.getChartColor(index, 1),
                    borderWidth: 2
                };
            });
            
            return { labels, datasets };
        } else {
            // 简单数据
            const labels = data.map(row => row[xAxis]);
            const values = data.map(row => typeof row[yAxis] === 'number' ? row[yAxis] : 0);
            
            if (chartType === 'pie' || chartType === 'doughnut') {
                // 饼图需要聚合相同标签的数据
                const aggregated = {};
                data.forEach(row => {
                    const label = row[xAxis];
                    const value = typeof row[yAxis] === 'number' ? row[yAxis] : 0;
                    aggregated[label] = (aggregated[label] || 0) + value;
                });
                
                return {
                    labels: Object.keys(aggregated),
                    datasets: [{
                        data: Object.values(aggregated),
                        backgroundColor: Object.keys(aggregated).map((_, index) => 
                            this.getChartColor(index, 0.7)
                        ),
                        borderColor: Object.keys(aggregated).map((_, index) => 
                            this.getChartColor(index, 1)
                        ),
                        borderWidth: 2
                    }]
                };
            }
            
            return {
                labels: labels,
                datasets: [{
                    label: yAxis,
                    data: values,
                    backgroundColor: this.getChartColor(0, 0.7),
                    borderColor: this.getChartColor(0, 1),
                    borderWidth: 2,
                    fill: chartType === 'line' ? false : true
                }]
            };
        }
    }

    renderChart(chartType, chartData) {
        const ctx = document.getElementById('dataChart').getContext('2d');
        
        if (this.currentChart) {
            this.currentChart.destroy();
        }
        
        const config = {
            type: chartType,
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                        borderColor: '#4facfe',
                        borderWidth: 1
                    }
                },
                scales: this.getScaleConfig(chartType)
            }
        };
        
        this.currentChart = new Chart(ctx, config);
    }

    getScaleConfig(chartType) {
        if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'radar') {
            return {};
        }
        
        return {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: '#4a5568'
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: '#4a5568'
                }
            }
        };
    }

    getChartColor(index, alpha = 1) {
        const colors = [
            `rgba(79, 172, 254, ${alpha})`,
            `rgba(0, 242, 254, ${alpha})`,
            `rgba(102, 126, 234, ${alpha})`,
            `rgba(118, 75, 162, ${alpha})`,
            `rgba(245, 101, 101, ${alpha})`,
            `rgba(56, 178, 172, ${alpha})`,
            `rgba(129, 140, 248, ${alpha})`,
            `rgba(251, 146, 60, ${alpha})`
        ];
        return colors[index % colors.length];
    }

    displayStatistics(data) {
        const container = document.getElementById('statisticsContainer');
        
        // 计算数值列的统计信息
        const numericColumns = data.headers.filter(header => {
            return data.rows.some(row => typeof row[header] === 'number');
        });
        
        let statsHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">';
        
        numericColumns.forEach(column => {
            const values = data.rows
                .map(row => row[column])
                .filter(val => typeof val === 'number' && !isNaN(val));
            
            if (values.length === 0) return;
            
            const stats = this.calculateStatistics(values);
            
            statsHTML += `
                <div class="chart-container" style="padding: 20px;">
                    <h4 style="color: #2d3748; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-calculator" style="color: #4facfe;"></i>
                        ${column} 统计信息
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                        <div style="text-align: center; padding: 10px; background: #f7fafc; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: bold; color: #4facfe;">${stats.count}</div>
                            <div style="font-size: 12px; color: #718096;">数据点数</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: #f7fafc; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: bold; color: #4facfe;">${stats.mean.toFixed(2)}</div>
                            <div style="font-size: 12px; color: #718096;">平均值</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: #f7fafc; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: bold; color: #4facfe;">${stats.median.toFixed(2)}</div>
                            <div style="font-size: 12px; color: #718096;">中位数</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: #f7fafc; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: bold; color: #4facfe;">${stats.std.toFixed(2)}</div>
                            <div style="font-size: 12px; color: #718096;">标准差</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: #f7fafc; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: bold; color: #4facfe;">${stats.min}</div>
                            <div style="font-size: 12px; color: #718096;">最小值</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: #f7fafc; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: bold; color: #4facfe;">${stats.max}</div>
                            <div style="font-size: 12px; color: #718096;">最大值</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        statsHTML += '</div>';
        container.innerHTML = statsHTML;
    }

    calculateStatistics(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const count = values.length;
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / count;
        
        const median = count % 2 === 0 
            ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
            : sorted[Math.floor(count / 2)];
        
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
        const std = Math.sqrt(variance);
        
        return {
            count,
            mean,
            median,
            std,
            min: Math.min(...values),
            max: Math.max(...values)
        };
    }

    switchPreviewTab(tabName) {
        // 更新标签状态
        document.querySelectorAll('.preview-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // 更新内容显示
        document.querySelectorAll('.preview-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(`${tabName}View`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    loadSampleData(sampleType) {
        const sampleData = this.getSampleData(sampleType);
        this.uploadedData = sampleData;
        this.displayDataPreview(sampleData);
        this.updateUploadedFilesCount();
        
        // 显示文件信息
        const fileInfo = document.getElementById('fileInfo');
        const fileDetails = document.getElementById('fileDetails');
        
        fileDetails.innerHTML = `
            <div class="file-detail">
                <span class="detail-value">${sampleType}_sample.csv</span>
                <span class="detail-label">示例文件</span>
            </div>
            <div class="file-detail">
                <span class="detail-value">${(JSON.stringify(sampleData).length / 1024).toFixed(2)} KB</span>
                <span class="detail-label">数据大小</span>
            </div>
            <div class="file-detail">
                <span class="detail-value">${sampleData.rows.length}</span>
                <span class="detail-label">数据行数</span>
            </div>
            <div class="file-detail">
                <span class="detail-value">${sampleData.headers.length}</span>
                <span class="detail-label">数据列数</span>
            </div>
            <div class="file-detail">
                <span class="detail-value">SAMPLE</span>
                <span class="detail-label">文件类型</span>
            </div>
        `;
        
        fileInfo.classList.add('show');
        this.showSuccess(`已加载 ${sampleType} 示例数据`);
    }

    getSampleData(type) {
        const samples = {
            economic: {
                headers: ['年份', 'GDP(亿元)', '第一产业', '第二产业', '第三产业', '增长率(%)'],
                rows: [
                    { '年份': 2019, 'GDP(亿元)': 1150.2, '第一产业': 175.8, '第二产业': 520.3, '第三产业': 454.1, '增长率(%)': 7.2 },
                    { '年份': 2020, 'GDP(亿元)': 1200.5, '第一产业': 180.2, '第二产业': 540.8, '第三产业': 479.5, '增长率(%)': 4.4 },
                    { '年份': 2021, 'GDP(亿元)': 1285.6, '第一产业': 185.3, '第二产业': 580.2, '第三产业': 520.1, '增长率(%)': 7.1 },
                    { '年份': 2022, 'GDP(亿元)': 1356.8, '第一产业': 192.1, '第二产业': 615.4, '第三产业': 549.3, '增长率(%)': 5.5 },
                    { '年份': 2023, 'GDP(亿元)': 1425.3, '第一产业': 198.7, '第二产业': 648.9, '第三产业': 577.7, '增长率(%)': 5.1 },
                    { '年份': 2024, 'GDP(亿元)': 1498.2, '第一产业': 205.4, '第二产业': 685.1, '第三产业': 607.7, '增长率(%)': 5.1 }
                ],
                type: 'sample'
            },
            population: {
                headers: ['年龄段', '男性(万人)', '女性(万人)', '总计(万人)', '占比(%)'],
                rows: [
                    { '年龄段': '0-14岁', '男性(万人)': 12.5, '女性(万人)': 11.8, '总计(万人)': 24.3, '占比(%)': 18.2 },
                    { '年龄段': '15-24岁', '男性(万人)': 8.9, '女性(万人)': 8.2, '总计(万人)': 17.1, '占比(%)': 12.8 },
                    { '年龄段': '25-34岁', '男性(万人)': 10.2, '女性(万人)': 9.8, '总计(万人)': 20.0, '占比(%)': 15.0 },
                    { '年龄段': '35-44岁', '男性(万人)': 11.5, '女性(万人)': 11.1, '总计(万人)': 22.6, '占比(%)': 16.9 },
                    { '年龄段': '45-54岁', '男性(万人)': 9.8, '女性(万人)': 9.5, '总计(万人)': 19.3, '占比(%)': 14.4 },
                    { '年龄段': '55-64岁', '男性(万人)': 8.1, '女性(万人)': 8.3, '总计(万人)': 16.4, '占比(%)': 12.3 },
                    { '年龄段': '65岁以上', '男性(万人)': 6.8, '女性(万人)': 7.5, '总计(万人)': 14.3, '占比(%)': 10.7 }
                ],
                type: 'sample'
            },
            tourism: {
                headers: ['月份', '游客数量(万人次)', '旅游收入(亿元)', '酒店入住率(%)', '景点评分'],
                rows: [
                    { '月份': '1月', '游客数量(万人次)': 35.2, '旅游收入(亿元)': 4.2, '酒店入住率(%)': 68, '景点评分': 4.3 },
                    { '月份': '2月', '游客数量(万人次)': 28.5, '旅游收入(亿元)': 3.5, '酒店入住率(%)': 55, '景点评分': 4.2 },
                    { '月份': '3月', '游客数量(万人次)': 42.8, '旅游收入(亿元)': 5.1, '酒店入住率(%)': 72, '景点评分': 4.4 },
                    { '月份': '4月', '游客数量(万人次)': 58.3, '旅游收入(亿元)': 7.2, '酒店入住率(%)': 85, '景点评分': 4.5 },
                    { '月份': '5月', '游客数量(万人次)': 65.7, '旅游收入(亿元)': 8.1, '酒店入住率(%)': 89, '景点评分': 4.6 },
                    { '月份': '6月', '游客数量(万人次)': 52.4, '旅游收入(亿元)': 6.8, '酒店入住率(%)': 78, '景点评分': 4.4 },
                    { '月份': '7月', '游客数量(万人次)': 71.2, '旅游收入(亿元)': 9.3, '酒店入住率(%)': 92, '景点评分': 4.7 },
                    { '月份': '8月', '游客数量(万人次)': 68.9, '旅游收入(亿元)': 8.9, '酒店入住率(%)': 90, '景点评分': 4.6 },
                    { '月份': '9月', '游客数量(万人次)': 45.6, '旅游收入(亿元)': 6.2, '酒店入住率(%)': 75, '景点评分': 4.4 },
                    { '月份': '10月', '游客数量(万人次)': 62.1, '旅游收入(亿元)': 8.5, '酒店入住率(%)': 88, '景点评分': 4.5 },
                    { '月份': '11月', '游客数量(万人次)': 38.7, '旅游收入(亿元)': 5.3, '酒店入住率(%)': 70, '景点评分': 4.3 },
                    { '月份': '12月', '游客数量(万人次)': 33.1, '旅游收入(亿元)': 4.6, '酒店入住率(%)': 65, '景点评分': 4.2 }
                ],
                type: 'sample'
            },
            transport: {
                headers: ['道路类型', '里程(公里)', '日均流量(万车次)', '货运量(万吨)', '投资额(亿元)'],
                rows: [
                    { '道路类型': '高速公路', '里程(公里)': 156.8, '日均流量(万车次)': 15.8, '货运量(万吨)': 285.6, '投资额(亿元)': 45.2 },
                    { '道路类型': '国道', '里程(公里)': 289.5, '日均流量(万车次)': 12.3, '货运量(万吨)': 198.7, '投资额(亿元)': 28.9 },
                    { '道路类型': '省道', '里程(公里)': 425.7, '日均流量(万车次)': 8.9, '货运量(万吨)': 156.3, '投资额(亿元)': 18.5 },
                    { '道路类型': '县道', '里程(公里)': 678.2, '日均流量(万车次)': 5.2, '货运量(万吨)': 89.4, '投资额(亿元)': 12.8 },
                    { '道路类型': '乡道', '里程(公里)': 892.4, '日均流量(万车次)': 2.8, '货运量(万吨)': 45.7, '投资额(亿元)': 8.9 },
                    { '道路类型': '铁路', '里程(公里)': 125.6, '日均流量(万车次)': 0.8, '货运量(万吨)': 456.8, '投资额(亿元)': 89.5 }
                ],
                type: 'sample'
            }
        };
        
        return samples[type] || samples.economic;
    }

    clearData() {
        this.uploadedData = null;
        
        // 清除文件信息
        const fileInfo = document.getElementById('fileInfo');
        fileInfo.classList.remove('show');
        
        // 清除数据预览
        const dataPreview = document.getElementById('dataPreview');
        dataPreview.classList.remove('show');
        
        // 清除图表
        if (this.currentChart) {
            this.currentChart.destroy();
            this.currentChart = null;
        }
        
        // 重置文件输入
        const fileInput = document.getElementById('fileInput');
        fileInput.value = '';
        
        // 清除消息
        this.hideMessages();
        
        this.showSuccess('数据已清除');
    }

    showProgress(show) {
        const progressBar = document.getElementById('progressBar');
        progressBar.style.display = show ? 'block' : 'none';
    }

    updateProgress(percent) {
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = `${percent}%`;
    }

    showError(message) {
        this.hideMessages();
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        this.hideMessages();
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }

    hideMessages() {
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    }

    updateUploadedFilesCount() {
        this.uploadedFilesCount++;
        const counter = document.getElementById('uploadedFiles');
        this.animateNumber(counter, this.uploadedFilesCount);
    }

    animateStats() {
        const stats = [
            { id: 'supportedFormats', target: 2 },
            { id: 'maxFileSize', target: 10 },
            { id: 'chartTypes', target: 6 },
            { id: 'uploadedFiles', target: 0 }
        ];
        
        stats.forEach((stat, index) => {
            setTimeout(() => {
                const element = document.getElementById(stat.id);
                this.animateNumber(element, stat.target);
            }, index * 200);
        });
    }

    animateNumber(element, target) {
        const start = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (target - start) * this.easeOutCubic(progress));
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    cleanup() {
        if (this.currentChart) {
            this.currentChart.destroy();
        }
    }
}

// 下载示例文件函数
function downloadSample(type) {
    const module = new UploadModule();
    const sampleData = module.getSampleData(type);
    
    // 转换为CSV格式
    let csvContent = sampleData.headers.join(',') + '\n';
    sampleData.rows.forEach(row => {
        const values = sampleData.headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        });
        csvContent += values.join(',') + '\n';
    });
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_sample.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.uploadModule = new UploadModule();
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (window.uploadModule) {
        window.uploadModule.cleanup();
    }
});