// 宣威市城市洞察平台 - 主JavaScript文件

// 全局配置
const CONFIG = {
    animationDuration: 1000,
    chartColors: {
        primary: '#667eea',
        secondary: '#764ba2',
        success: '#38a169',
        warning: '#d69e2e',
        error: '#e53e3e',
        info: '#3182ce'
    },
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    }
};

// 主应用类
class XuanweiApp {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.isMobile = window.innerWidth <= CONFIG.breakpoints.mobile;
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupResponsive();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupEventListeners();
        
        // 页面特定初始化
        this.initPageSpecific();
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename.replace('.html', '');
    }
    
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.querySelector('.nav-toggle, .hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // 移动端导航切换
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
        
        // 导航链接点击
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // 移除所有活动状态
                navLinks.forEach(l => l.classList.remove('active'));
                // 添加当前活动状态
                link.classList.add('active');
                
                // 移动端关闭菜单
                if (this.isMobile && navMenu) {
                    navMenu.classList.remove('active');
                    if (navToggle) navToggle.classList.remove('active');
                }
            });
        });
        
        // 滚动时导航栏样式
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }
    
    setupResponsive() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= CONFIG.breakpoints.mobile;
            this.handleResize();
        });
    }
    
    handleResize() {
        // 重新计算图表大小
        if (window.Chart) {
            Object.values(Chart.instances).forEach(chart => {
                if (chart && chart.resize) {
                    chart.resize();
                }
            });
        }
        
        // 重新计算地图大小
        if (window.map && window.map.invalidateSize) {
            setTimeout(() => {
                window.map.invalidateSize();
            }, 100);
        }
    }
    
    setupScrollEffects() {
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // 滚动到顶部按钮
        this.createScrollToTopButton();
    }
    
    createScrollToTopButton() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollBtn.setAttribute('aria-label', '返回顶部');
        
        // 样式
        Object.assign(scrollBtn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            opacity: '0',
            visibility: 'hidden',
            zIndex: '1000'
        });
        
        document.body.appendChild(scrollBtn);
        
        // 滚动显示/隐藏
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        });
        
        // 点击滚动到顶部
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // 悬停效果
        scrollBtn.addEventListener('mouseenter', () => {
            scrollBtn.style.transform = 'translateY(-3px)';
            scrollBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
        });
        
        scrollBtn.addEventListener('mouseleave', () => {
            scrollBtn.style.transform = 'translateY(0)';
            scrollBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
    }
    
    setupAnimations() {
        // 观察器用于触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible', 'animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // 观察需要动画的元素
        document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupEventListeners() {
        // 全局错误处理
        window.addEventListener('error', (e) => {
            console.error('页面错误:', e.error);
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 页面隐藏时暂停动画
                this.pauseAnimations();
            } else {
                // 页面显示时恢复动画
                this.resumeAnimations();
            }
        });
        
        // 键盘导航
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }
    
    handleKeyboardNavigation(e) {
        // ESC键关闭模态框或菜单
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            const activeMenu = document.querySelector('.nav-menu.active');
            
            if (activeModal) {
                this.closeModal(activeModal);
            } else if (activeMenu) {
                activeMenu.classList.remove('active');
                const navToggle = document.querySelector('.nav-toggle.active');
                if (navToggle) navToggle.classList.remove('active');
            }
        }
        
        // Tab键焦点管理
        if (e.key === 'Tab') {
            this.manageFocus(e);
        }
    }
    
    manageFocus(e) {
        const focusableElements = document.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
    
    initPageSpecific() {
        // 根据当前页面初始化特定功能
        switch (this.currentPage) {
            case 'index':
                this.initHomePage();
                break;
            case 'geography':
                this.initGeographyPage();
                break;
            case 'economy':
                this.initEconomyPage();
                break;
            case 'culture':
                this.initCulturePage();
                break;
            case 'dashboard':
                this.initDashboardPage();
                break;
            case 'timeline':
                this.initTimelinePage();
                break;
            case 'upload':
                this.initUploadPage();
                break;
            case 'export':
                this.initExportPage();
                break;
        }
    }
    
    initHomePage() {
        // 首页特定初始化
        this.animateHeroStats();
    }
    
    initGeographyPage() {
        // 地理页面特定初始化
        if (window.GeographyModule) {
            window.geographyModule = new GeographyModule();
        }
    }
    
    initEconomyPage() {
        // 经济页面特定初始化
        if (window.EconomyModule) {
            window.economyModule = new EconomyModule();
        }
    }
    
    initCulturePage() {
        // 文化页面特定初始化
        if (window.CultureModule) {
            window.cultureModule = new CultureModule();
        }
    }
    
    initDashboardPage() {
        // 仪表盘页面特定初始化
        if (window.DashboardModule) {
            window.dashboardModule = new DashboardModule();
        }
    }
    
    initTimelinePage() {
        // 时间轴页面特定初始化
        if (window.TimelineModule) {
            window.timelineModule = new TimelineModule();
        }
    }
    
    initUploadPage() {
        // 上传页面特定初始化
        if (window.UploadModule) {
            window.uploadModule = new UploadModule();
        }
    }
    
    initExportPage() {
        // 导出页面特定初始化
        if (window.ExportModule) {
            window.exportModule = new ExportModule();
        }
    }
    
    animateHeroStats() {
        const statNumbers = document.querySelectorAll('.stat-number, .hero-stats .stat-item .stat-number');
        
        statNumbers.forEach((element, index) => {
            const target = parseFloat(element.textContent.replace(/[^\d.]/g, ''));
            if (isNaN(target)) return;
            
            setTimeout(() => {
                this.animateNumber(element, target, element.textContent.includes('.'));
            }, index * 200);
        });
    }
    
    animateNumber(element, target, hasDecimal = false) {
        const duration = CONFIG.animationDuration;
        const startTime = performance.now();
        const startValue = 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = startValue + (target - startValue) * this.easeOutCubic(progress);
            
            if (hasDecimal) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }
    
    resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }
    
    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // 工具方法
    static formatNumber(num, decimals = 0) {
        return num.toLocaleString('zh-CN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }
    
    static formatCurrency(num) {
        return `¥${XuanweiApp.formatNumber(num, 2)}`;
    }
    
    static formatPercent(num) {
        return `${XuanweiApp.formatNumber(num, 1)}%`;
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.xuanweiApp = new XuanweiApp();
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    // 清理定时器、事件监听器等
    if (window.xuanweiApp) {
        // 执行清理工作
    }
});

// 导出全局配置和应用类
window.CONFIG = CONFIG;
window.XuanweiApp = XuanweiApp;

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .slide-up {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    
    .slide-up.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .scale-in {
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.6s ease;
    }
    
    .scale-in.visible {
        opacity: 1;
        transform: scale(1);
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            z-index: 999;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .hamburger {
            display: block;
            cursor: pointer;
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
`;
document.head.appendChild(style);