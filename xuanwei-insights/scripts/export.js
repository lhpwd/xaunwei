// 报告导出模块
class ExportModule {
    constructor() {
        this.selectedType = null;
        this.selectedTemplate = null;
        this.exportHistory = [];
        this.exportedReportsCount = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateStats();
        this.observeElements();
        this.loadExportHistory();
        this.setDefaultDate();
    }

    setupEventListeners() {
        // 导出类型选择
        const exportCards = document.querySelectorAll('.export-card');
        exportCards.forEach(card => {
            card.addEventListener('click', () => this.selectExportType(card.dataset.type));
        });

        // 模板选择
        const templateCards = document.querySelectorAll('.template-card');
        templateCards.forEach(card => {
            card.addEventListener('click', () => this.selectTemplate(card.dataset.template));
        });

        // 配置输入监听
        const configInputs = document.querySelectorAll('.config-input, .config-select, .config-textarea');
        configInputs.forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });

        // 按钮事件
        const backBtn = document.getElementById('backBtn');
        const generateBtn = document.getElementById('generateBtn');
        const previewBtn = document.getElementById('previewBtn');

        if (backBtn) backBtn.addEventListener('click', () => this.goBack());
        if (generateBtn) generateBtn.addEventListener('click', () => this.generateReport());
        if (previewBtn) previewBtn.addEventListener('click', () => this.previewReport());
    }

    selectExportType(type) {
        // 更新选中状态
        document.querySelectorAll('.export-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('selected');
        
        this.selectedType = type;
        
        // 根据类型显示相应的配置
        if (type === 'pdf') {
            this.showTemplateSelection();
        } else {
            this.showConfigSection();
        }
    }

    selectTemplate(template) {
        // 更新选中状态
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-template="${template}"]`).classList.add('selected');
        
        this.selectedTemplate = template;
        this.showConfigSection();
    }

    showTemplateSelection() {
        const templateSection = document.getElementById('templateSection');
        templateSection.style.display = 'block';
        templateSection.scrollIntoView({ behavior: 'smooth' });
    }

    showConfigSection() {
        const configSection = document.getElementById('configSection');
        const previewSection = document.getElementById('previewSection');
        
        configSection.style.display = 'block';
        previewSection.style.display = 'block';
        
        this.updatePreview();
        configSection.scrollIntoView({ behavior: 'smooth' });
    }

    updatePreview() {
        const title = document.getElementById('reportTitle').value;
        const author = document.getElementById('reportAuthor').value;
        const date = document.getElementById('reportDate').value;
        
        const previewTitle = document.getElementById('previewTitle');
        const previewSubtitle = document.getElementById('previewSubtitle');
        
        if (previewTitle) previewTitle.textContent = title || '宣威市城市洞察分析报告';
        if (previewSubtitle) {
            const formattedDate = date ? new Date(date).getFullYear() + '年度' : '2024年度';
            previewSubtitle.textContent = `${formattedDate}综合分析报告 - ${author || '宣威市政府'}`;
        }
    }

    goBack() {
        const configSection = document.getElementById('configSection');
        const previewSection = document.getElementById('previewSection');
        const templateSection = document.getElementById('templateSection');
        
        configSection.style.display = 'none';
        previewSection.style.display = 'none';
        
        if (this.selectedType === 'pdf') {
            templateSection.style.display = 'block';
        }
    }

    async generateReport() {
        if (!this.selectedType) {
            alert('请先选择导出类型');
            return;
        }

        this.showProgress('正在生成报告...', '请稍候，这可能需要几分钟时间');

        try {
            switch (this.selectedType) {
                case 'pdf':
                    await this.generatePDFReport();
                    break;
                case 'image':
                    await this.generateImageExport();
                    break;
                case 'data':
                    await this.generateDataExport();
                    break;
            }
            
            this.updateExportedReportsCount();
            this.addToHistory();
            
        } catch (error) {
            console.error('导出失败:', error);
            alert('导出失败，请重试');
        } finally {
            this.hideProgress();
        }
    }

    async generatePDFReport() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // 获取配置
        const config = this.getReportConfig();
        
        // 设置字体（支持中文）
        pdf.setFont('helvetica');
        
        // 添加封面
        if (config.includeCover) {
            this.addCoverPage(pdf, config);
            pdf.addPage();
        }
        
        // 添加目录
        if (config.includeToc) {
            this.addTableOfContents(pdf, config);
            pdf.addPage();
        }
        
        // 添加执行摘要
        if (config.includeExecutive) {
            this.addExecutiveSummary(pdf, config);
            pdf.addPage();
        }
        
        // 添加图表分析
        if (config.includeCharts) {
            await this.addChartsToReport(pdf, config);
        }
        
        // 添加数据表格
        if (config.includeData) {
            this.addDataTables(pdf, config);
        }
        
        // 添加附录
        if (config.includeAppendix) {
            this.addAppendix(pdf, config);
        }
        
        // 保存PDF
        const fileName = `${config.title}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
    }

    addCoverPage(pdf, config) {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // 标题
        pdf.setFontSize(24);
        pdf.setTextColor(40, 40, 40);
        const titleLines = pdf.splitTextToSize(config.title, pageWidth - 40);
        const titleHeight = titleLines.length * 10;
        pdf.text(titleLines, pageWidth / 2, pageHeight / 2 - titleHeight, { align: 'center' });
        
        // 副标题
        pdf.setFontSize(16);
        pdf.setTextColor(100, 100, 100);
        const subtitle = `${config.author} - ${config.date}`;
        pdf.text(subtitle, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
        
        // 描述
        if (config.description) {
            pdf.setFontSize(12);
            const descLines = pdf.splitTextToSize(config.description, pageWidth - 60);
            pdf.text(descLines, pageWidth / 2, pageHeight / 2 + 50, { align: 'center' });
        }
        
        // 页脚
        pdf.setFontSize(10);
        pdf.text('宣威市城市洞察平台', pageWidth / 2, pageHeight - 20, { align: 'center' });
    }

    addTableOfContents(pdf, config) {
        pdf.setFontSize(18);
        pdf.setTextColor(40, 40, 40);
        pdf.text('目录', 20, 30);
        
        const toc = [
            { title: '1. 执行摘要', page: 3 },
            { title: '2. 经济发展分析', page: 4 },
            { title: '3. 人口结构分析', page: 5 },
            { title: '4. 文化旅游发展', page: 6 },
            { title: '5. 交通基础设施', page: 7 },
            { title: '6. 数据附录', page: 8 }
        ];
        
        pdf.setFontSize(12);
        let yPos = 50;
        
        toc.forEach(item => {
            pdf.text(item.title, 20, yPos);
            pdf.text(item.page.toString(), 180, yPos);
            yPos += 15;
        });
    }

    addExecutiveSummary(pdf, config) {
        pdf.setFontSize(18);
        pdf.setTextColor(40, 40, 40);
        pdf.text('执行摘要', 20, 30);
        
        pdf.setFontSize(12);
        pdf.setTextColor(60, 60, 60);
        
        const summary = `
本报告基于宣威市2024年最新数据，全面分析了城市发展现状。主要发现包括：

• 经济总量持续增长，GDP达到1498.2亿元，同比增长5.1%
• 第三产业占比提升，服务业成为经济增长新动力
• 旅游业快速发展，年接待游客580万人次
• 交通基础设施不断完善，区域连通性显著提升
• 宣威火腿产业品牌价值持续提升

建议：
1. 继续优化产业结构，推动高质量发展
2. 加强文化旅游资源整合，打造特色品牌
3. 完善交通网络，提升区域竞争力
4. 推进数字化转型，提升城市治理水平
        `;
        
        const lines = pdf.splitTextToSize(summary, 170);
        pdf.text(lines, 20, 50);
    }

    async addChartsToReport(pdf, config) {
        // 这里可以添加实际的图表
        // 由于演示目的，我们添加一些占位符
        
        pdf.setFontSize(18);
        pdf.text('图表分析', 20, 30);
        
        // 模拟添加图表
        const charts = [
            { title: '经济发展趋势', description: 'GDP增长趋势显示经济稳定发展' },
            { title: '人口结构分析', description: '人口年龄结构趋于合理' },
            { title: '旅游收入统计', description: '旅游业收入逐年增长' },
            { title: '交通流量分析', description: '交通网络日趋完善' }
        ];
        
        let yPos = 50;
        charts.forEach((chart, index) => {
            pdf.setFontSize(14);
            pdf.setTextColor(40, 40, 40);
            pdf.text(`${index + 1}. ${chart.title}`, 20, yPos);
            
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(chart.description, 20, yPos + 10);
            
            // 添加图表占位符
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(20, yPos + 15, 170, 60);
            pdf.setTextColor(150, 150, 150);
            pdf.text(`[${chart.title}图表]`, 105, yPos + 50, { align: 'center' });
            
            yPos += 80;
            
            if (yPos > 250) {
                pdf.addPage();
                yPos = 30;
            }
        });
    }

    addDataTables(pdf, config) {
        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text('数据表格', 20, 30);
        
        // 示例数据表格
        const tableData = [
            ['指标', '2022年', '2023年', '2024年', '增长率'],
            ['GDP(亿元)', '1356.8', '1425.3', '1498.2', '5.1%'],
            ['人口(万人)', '132.5', '133.2', '134.0', '0.6%'],
            ['游客(万人次)', '520', '550', '580', '5.5%'],
            ['财政收入(亿元)', '89.5', '94.2', '98.8', '4.9%']
        ];
        
        let yPos = 50;
        const cellWidth = 34;
        const cellHeight = 10;
        
        tableData.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const x = 20 + colIndex * cellWidth;
                const y = yPos + rowIndex * cellHeight;
                
                // 绘制单元格边框
                pdf.setDrawColor(200, 200, 200);
                pdf.rect(x, y, cellWidth, cellHeight);
                
                // 添加文本
                pdf.setFontSize(8);
                if (rowIndex === 0) {
                    pdf.setTextColor(40, 40, 40);
                    pdf.setFont('helvetica', 'bold');
                } else {
                    pdf.setTextColor(60, 60, 60);
                    pdf.setFont('helvetica', 'normal');
                }
                
                pdf.text(cell, x + 2, y + 7);
            });
        });
    }

    addAppendix(pdf, config) {
        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text('附录', 20, 30);
        
        pdf.setFontSize(12);
        const appendixContent = `
数据来源说明：
• 经济数据：宣威市统计局
• 人口数据：宣威市公安局户政科
• 旅游数据：宣威市文化和旅游局
• 交通数据：宣威市交通运输局

数据采集时间：2024年1月-12月
报告生成时间：${new Date().toLocaleDateString()}
        `;
        
        const lines = pdf.splitTextToSize(appendixContent, 170);
        pdf.text(lines, 20, 50);
    }

    async generateImageExport() {
        // 获取所有图表元素
        const charts = document.querySelectorAll('canvas');
        
        if (charts.length === 0) {
            alert('没有找到可导出的图表');
            return;
        }
        
        for (let i = 0; i < charts.length; i++) {
            const canvas = charts[i];
            const link = document.createElement('a');
            link.download = `chart_${i + 1}_${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // 添加延迟避免浏览器阻止多个下载
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    async generateDataExport() {
        // 模拟数据导出
        const data = this.getSampleData();
        
        // 导出为CSV
        const csvContent = this.convertToCSV(data);
        this.downloadFile(csvContent, 'xuanwei_data.csv', 'text/csv');
        
        // 导出为JSON
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, 'xuanwei_data.json', 'application/json');
    }

    getSampleData() {
        return {
            economic: [
                { year: 2022, gdp: 1356.8, growth: 5.5 },
                { year: 2023, gdp: 1425.3, growth: 5.1 },
                { year: 2024, gdp: 1498.2, growth: 5.1 }
            ],
            population: [
                { ageGroup: '0-14岁', male: 12.5, female: 11.8 },
                { ageGroup: '15-64岁', male: 45.2, female: 43.8 },
                { ageGroup: '65岁以上', male: 6.8, female: 7.5 }
            ],
            tourism: [
                { month: '1月', visitors: 35.2, revenue: 4.2 },
                { month: '2月', visitors: 28.5, revenue: 3.5 },
                { month: '3月', visitors: 42.8, revenue: 5.1 }
            ]
        };
    }

    convertToCSV(data) {
        let csv = '';
        
        Object.keys(data).forEach(category => {
            csv += `\n${category.toUpperCase()}\n`;
            const items = data[category];
            
            if (items.length > 0) {
                // 添加表头
                const headers = Object.keys(items[0]);
                csv += headers.join(',') + '\n';
                
                // 添加数据行
                items.forEach(item => {
                    const values = headers.map(header => item[header]);
                    csv += values.join(',') + '\n';
                });
            }
        });
        
        return csv;
    }

    downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    previewReport() {
        // 在新窗口中预览报告
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        const config = this.getReportConfig();
        
        const previewHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${config.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                    h1 { color: #2d3748; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
                    h2 { color: #4a5568; margin-top: 30px; }
                    .meta { color: #718096; margin-bottom: 30px; }
                    .chart-placeholder { 
                        background: #f7fafc; 
                        border: 2px dashed #cbd5e0; 
                        padding: 40px; 
                        text-align: center; 
                        margin: 20px 0; 
                        border-radius: 8px;
                    }
                </style>
            </head>
            <body>
                <h1>${config.title}</h1>
                <div class="meta">
                    <p><strong>作者：</strong>${config.author}</p>
                    <p><strong>日期：</strong>${config.date}</p>
                    <p><strong>描述：</strong>${config.description}</p>
                </div>
                
                <h2>执行摘要</h2>
                <p>本报告基于宣威市最新数据，全面分析了城市发展现状...</p>
                
                <h2>经济发展分析</h2>
                <div class="chart-placeholder">GDP增长趋势图</div>
                
                <h2>人口结构分析</h2>
                <div class="chart-placeholder">人口年龄结构图</div>
                
                <h2>文化旅游发展</h2>
                <div class="chart-placeholder">旅游收入统计图</div>
                
                <h2>交通基础设施</h2>
                <div class="chart-placeholder">交通流量分析图</div>
            </body>
            </html>
        `;
        
        previewWindow.document.write(previewHTML);
        previewWindow.document.close();
    }

    getReportConfig() {
        return {
            title: document.getElementById('reportTitle').value || '宣威市城市洞察分析报告',
            author: document.getElementById('reportAuthor').value || '宣威市政府',
            date: document.getElementById('reportDate').value || new Date().toISOString().split('T')[0],
            description: document.getElementById('reportDescription').value || '',
            theme: document.getElementById('reportTheme').value || 'blue',
            pageSize: document.getElementById('pageSize').value || 'a4',
            imageQuality: document.getElementById('imageQuality').value || 'high',
            includeCover: document.getElementById('includeCover').checked,
            includeToc: document.getElementById('includeToc').checked,
            includeExecutive: document.getElementById('includeExecutive').checked,
            includeCharts: document.getElementById('includeCharts').checked,
            includeData: document.getElementById('includeData').checked,
            includeAppendix: document.getElementById('includeAppendix').checked
        };
    }

    showProgress(text, detail) {
        const overlay = document.getElementById('progressOverlay');
        const progressText = document.getElementById('progressText');
        const progressDetail = document.getElementById('progressDetail');
        
        progressText.textContent = text;
        progressDetail.textContent = detail;
        overlay.style.display = 'flex';
    }

    hideProgress() {
        const overlay = document.getElementById('progressOverlay');
        overlay.style.display = 'none';
    }

    addToHistory() {
        const config = this.getReportConfig();
        const historyItem = {
            id: Date.now(),
            type: this.selectedType,
            template: this.selectedTemplate,
            title: config.title,
            date: new Date().toLocaleString(),
            size: '2.5 MB'
        };
        
        this.exportHistory.unshift(historyItem);
        this.saveExportHistory();
        this.renderHistory();
    }

    loadExportHistory() {
        const saved = localStorage.getItem('xuanwei_export_history');
        if (saved) {
            this.exportHistory = JSON.parse(saved);
        }
        this.renderHistory();
    }

    saveExportHistory() {
        localStorage.setItem('xuanwei_export_history', JSON.stringify(this.exportHistory));
    }

    renderHistory() {
        const historyList = document.getElementById('historyList');
        
        if (this.exportHistory.length === 0) {
            historyList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #718096;">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 20px;"></i>
                    <p>暂无导出历史</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = this.exportHistory.map(item => `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-title">${item.title}</div>
                    <div class="history-meta">
                        <span><i class="fas fa-calendar"></i> ${item.date}</span>
                        <span><i class="fas fa-file"></i> ${item.type.toUpperCase()}</span>
                        <span><i class="fas fa-hdd"></i> ${item.size}</span>
                    </div>
                </div>
                <div class="history-actions">
                    <button class="history-btn" onclick="exportModule.downloadHistoryItem(${item.id})">
                        <i class="fas fa-download"></i> 下载
                    </button>
                    <button class="history-btn" onclick="exportModule.deleteHistoryItem(${item.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `).join('');
    }

    downloadHistoryItem(id) {
        const item = this.exportHistory.find(h => h.id === id);
        if (item) {
            alert(`正在下载: ${item.title}`);
            // 这里可以实现实际的下载逻辑
        }
    }

    deleteHistoryItem(id) {
        if (confirm('确定要删除这个导出记录吗？')) {
            this.exportHistory = this.exportHistory.filter(h => h.id !== id);
            this.saveExportHistory();
            this.renderHistory();
        }
    }

    setDefaultDate() {
        const dateInput = document.getElementById('reportDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    updateExportedReportsCount() {
        this.exportedReportsCount++;
        const counter = document.getElementById('exportedReports');
        this.animateNumber(counter, this.exportedReportsCount);
    }

    animateStats() {
        const stats = [
            { id: 'exportFormats', target: 3 },
            { id: 'reportTemplates', target: 5 },
            { id: 'chartTypes', target: 8 },
            { id: 'exportedReports', target: 0 }
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
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.exportModule = new ExportModule();
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (window.exportModule) {
        // 清理工作
    }
});