// 时间轴模块
class TimelineModule {
    constructor() {
        this.currentFilter = 'all';
        this.timelineItems = [];
        this.init();
    }

    init() {
        this.initTimelineItems();
        this.initFilterControls();
        this.initScrollAnimations();
        this.animateStats();
        this.initInteractiveFeatures();
        
        // 页面卸载时清理
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    initTimelineItems() {
        // 获取所有时间轴项目
        this.timelineItems = document.querySelectorAll('.timeline-item');
        
        // 为每个项目添加交互功能
        this.timelineItems.forEach((item, index) => {
            this.setupItemInteractions(item, index);
        });
    }

    setupItemInteractions(item, index) {
        const content = item.querySelector('.timeline-content');
        const icon = item.querySelector('.timeline-icon');
        
        if (content) {
            // 鼠标悬停效果
            content.addEventListener('mouseenter', () => {
                this.highlightTimelineItem(item, true);
            });
            
            content.addEventListener('mouseleave', () => {
                this.highlightTimelineItem(item, false);
            });
            
            // 点击展开/收缩效果
            content.addEventListener('click', () => {
                this.toggleItemDetails(item);
            });
        }
        
        if (icon) {
            // 图标动画
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'translateX(-50%) scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'translateX(-50%) scale(1)';
            });
        }
    }

    highlightTimelineItem(item, highlight) {
        const content = item.querySelector('.timeline-content');
        const icon = item.querySelector('.timeline-icon');
        const date = item.querySelector('.timeline-date');
        
        if (highlight) {
            content.style.transform = 'translateY(-8px)';
            content.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.2)';
            
            if (icon) {
                icon.style.borderColor = '#f093fb';
                icon.style.color = '#f093fb';
                icon.style.backgroundColor = '#fff';
            }
            
            if (date) {
                date.style.transform = 'translateX(-50%) scale(1.05)';
                date.style.background = 'linear-gradient(135deg, #f093fb, #f5576c)';
            }
        } else {
            content.style.transform = 'translateY(-5px)';
            content.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            
            if (icon) {
                icon.style.borderColor = '#667eea';
                icon.style.color = '#667eea';
                icon.style.backgroundColor = '#fff';
            }
            
            if (date) {
                date.style.transform = 'translateX(-50%) scale(1)';
                date.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }
        }
    }

    toggleItemDetails(item) {
        const highlights = item.querySelector('.event-highlights');
        if (!highlights) return;
        
        const isExpanded = item.classList.contains('expanded');
        
        if (isExpanded) {
            item.classList.remove('expanded');
            highlights.style.maxHeight = '0';
            highlights.style.opacity = '0';
            highlights.style.marginTop = '0';
        } else {
            item.classList.add('expanded');
            highlights.style.maxHeight = highlights.scrollHeight + 'px';
            highlights.style.opacity = '1';
            highlights.style.marginTop = '20px';
        }
    }

    initFilterControls() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const filter = btn.dataset.filter;
                this.applyFilter(filter);
                
                // 更新按钮状态
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 添加点击动画
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    applyFilter(filter) {
        this.currentFilter = filter;
        
        this.timelineItems.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.style.display = 'flex';
                // 延迟显示动画
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 100);
            } else {
                item.classList.remove('visible');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // 更新统计数据
        this.updateFilterStats(filter);
    }

    updateFilterStats(filter) {
        const visibleItems = Array.from(this.timelineItems).filter(item => {
            return filter === 'all' || item.dataset.category === filter;
        });
        
        const totalEvents = document.getElementById('totalEvents');
        if (totalEvents) {
            this.animateNumber(totalEvents, parseInt(totalEvents.textContent), visibleItems.length, 1000);
        }
    }

    initScrollAnimations() {
        // 创建交叉观察器
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // 为时间轴项目添加特殊动画
                    if (entry.target.classList.contains('timeline-item')) {
                        this.animateTimelineItem(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // 观察所有需要动画的元素
        const animatedElements = document.querySelectorAll('.fade-in');
        animatedElements.forEach(el => observer.observe(el));
    }

    animateTimelineItem(item) {
        const content = item.querySelector('.timeline-content');
        const icon = item.querySelector('.timeline-icon');
        const date = item.querySelector('.timeline-date');
        
        // 内容动画
        if (content) {
            content.style.transform = 'translateY(50px)';
            content.style.opacity = '0';
            
            setTimeout(() => {
                content.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                content.style.transform = 'translateY(0)';
                content.style.opacity = '1';
            }, 100);
        }
        
        // 图标动画
        if (icon) {
            icon.style.transform = 'translateX(-50%) scale(0)';
            
            setTimeout(() => {
                icon.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                icon.style.transform = 'translateX(-50%) scale(1)';
            }, 200);
        }
        
        // 日期动画
        if (date) {
            date.style.transform = 'translateX(-50%) scale(0)';
            
            setTimeout(() => {
                date.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                date.style.transform = 'translateX(-50%) scale(1)';
            }, 300);
        }
    }

    animateStats() {
        // 动画显示统计数值
        const statNumbers = document.querySelectorAll('.stat-number, .stat-value');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
                    
                    if (!isNaN(numericValue)) {
                        this.animateNumber(target, 0, numericValue, finalValue, 2000);
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateNumber(element, start, end, originalText, duration) {
        const startTime = performance.now();
        const isYear = originalText.includes('年') || originalText.length === 4;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * this.easeOutQuart(progress);
            
            if (isYear) {
                element.textContent = Math.floor(current);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
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

    initInteractiveFeatures() {
        // 时间轴线条动画
        this.animateTimelineLine();
        
        // 键盘导航
        this.initKeyboardNavigation();
        
        // 搜索功能
        this.initSearchFeature();
        
        // 导出功能
        this.initExportFeature();
    }

    animateTimelineLine() {
        const timelineLine = document.querySelector('.timeline-line');
        if (!timelineLine) return;
        
        // 创建动态渐变效果
        let gradientPosition = 0;
        
        const animateGradient = () => {
            gradientPosition += 0.5;
            if (gradientPosition > 100) gradientPosition = 0;
            
            timelineLine.style.background = `linear-gradient(to bottom, 
                #667eea ${gradientPosition}%, 
                #764ba2 ${gradientPosition + 20}%, 
                #f093fb ${gradientPosition + 40}%, 
                #667eea ${gradientPosition + 60}%)`;
            
            requestAnimationFrame(animateGradient);
        };
        
        animateGradient();
    }

    initKeyboardNavigation() {
        let currentIndex = -1;
        const visibleItems = () => Array.from(this.timelineItems).filter(item => 
            item.style.display !== 'none'
        );
        
        document.addEventListener('keydown', (e) => {
            const items = visibleItems();
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    currentIndex = Math.min(currentIndex + 1, items.length - 1);
                    this.focusTimelineItem(items[currentIndex]);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    currentIndex = Math.max(currentIndex - 1, 0);
                    this.focusTimelineItem(items[currentIndex]);
                    break;
                    
                case 'Enter':
                    if (currentIndex >= 0 && items[currentIndex]) {
                        this.toggleItemDetails(items[currentIndex]);
                    }
                    break;
                    
                case 'Escape':
                    currentIndex = -1;
                    this.clearFocus();
                    break;
            }
        });
    }

    focusTimelineItem(item) {
        if (!item) return;
        
        // 清除之前的焦点
        this.clearFocus();
        
        // 设置新焦点
        item.classList.add('keyboard-focus');
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 高亮效果
        this.highlightTimelineItem(item, true);
    }

    clearFocus() {
        this.timelineItems.forEach(item => {
            item.classList.remove('keyboard-focus');
            this.highlightTimelineItem(item, false);
        });
    }

    initSearchFeature() {
        // 创建搜索框
        const searchContainer = document.createElement('div');
        searchContainer.className = 'timeline-search';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="timelineSearch" placeholder="搜索事件...">
                <i class="fas fa-search"></i>
            </div>
        `;
        
        const filterControls = document.querySelector('.filter-controls');
        if (filterControls) {
            filterControls.parentNode.insertBefore(searchContainer, filterControls);
        }
        
        // 搜索功能
        const searchInput = document.getElementById('timelineSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTimeline(e.target.value);
            });
        }
    }

    searchTimeline(query) {
        const searchTerm = query.toLowerCase().trim();
        
        this.timelineItems.forEach(item => {
            const title = item.querySelector('.event-title')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.event-description')?.textContent.toLowerCase() || '';
            const category = item.querySelector('.event-category')?.textContent.toLowerCase() || '';
            
            const matches = !searchTerm || 
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                category.includes(searchTerm);
            
            if (matches && (this.currentFilter === 'all' || item.dataset.category === this.currentFilter)) {
                item.style.display = 'flex';
                item.classList.add('visible');
            } else {
                item.style.display = 'none';
                item.classList.remove('visible');
            }
        });
    }

    initExportFeature() {
        // 创建导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.className = 'export-timeline-btn';
        exportBtn.innerHTML = '<i class="fas fa-download"></i> 导出时间轴';
        exportBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 50px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        exportBtn.addEventListener('mouseenter', () => {
            exportBtn.style.transform = 'translateY(-3px)';
            exportBtn.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
        });
        
        exportBtn.addEventListener('mouseleave', () => {
            exportBtn.style.transform = 'translateY(0)';
            exportBtn.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
        });
        
        exportBtn.addEventListener('click', () => {
            this.exportTimeline();
        });
        
        document.body.appendChild(exportBtn);
    }

    exportTimeline() {
        const timelineData = [];
        
        this.timelineItems.forEach(item => {
            if (item.style.display !== 'none') {
                const data = {
                    date: item.querySelector('.timeline-date')?.textContent || '',
                    category: item.querySelector('.event-category')?.textContent || '',
                    title: item.querySelector('.event-title')?.textContent || '',
                    description: item.querySelector('.event-description')?.textContent || '',
                    highlights: []
                };
                
                const highlights = item.querySelectorAll('.highlight-item');
                highlights.forEach(highlight => {
                    data.highlights.push({
                        value: highlight.querySelector('.highlight-value')?.textContent || '',
                        label: highlight.querySelector('.highlight-label')?.textContent || ''
                    });
                });
                
                timelineData.push(data);
            }
        });
        
        // 创建并下载JSON文件
        const dataStr = JSON.stringify(timelineData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `宣威市发展时间轴_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        // 显示成功提示
        this.showNotification('时间轴数据导出成功！', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `timeline-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    cleanup() {
        // 清理事件监听器和动画
        const exportBtn = document.querySelector('.export-timeline-btn');
        if (exportBtn) {
            document.body.removeChild(exportBtn);
        }
        
        const searchContainer = document.querySelector('.timeline-search');
        if (searchContainer) {
            searchContainer.parentNode.removeChild(searchContainer);
        }
    }
}

// 添加搜索框样式
const style = document.createElement('style');
style.textContent = `
    .timeline-search {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
    }
    
    .search-box {
        position: relative;
        max-width: 400px;
        width: 100%;
    }
    
    .search-box input {
        width: 100%;
        padding: 15px 50px 15px 20px;
        border: 2px solid #e2e8f0;
        border-radius: 25px;
        font-size: 16px;
        outline: none;
        transition: all 0.3s ease;
    }
    
    .search-box input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .search-box i {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: #718096;
        font-size: 16px;
    }
    
    .keyboard-focus {
        outline: 3px solid #667eea;
        outline-offset: 5px;
        border-radius: 15px;
    }
    
    @media (max-width: 768px) {
        .export-timeline-btn {
            bottom: 20px !important;
            right: 20px !important;
            padding: 12px 20px !important;
            font-size: 12px !important;
        }
        
        .timeline-notification {
            top: 20px !important;
            right: 20px !important;
            left: 20px !important;
            right: 20px !important;
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new TimelineModule();
});