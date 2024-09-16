document.addEventListener('DOMContentLoaded', function() {
    // 检查本地存储中的主题偏好
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        toggleTheme();
    }
    updateTime();
});

document.getElementById('retirementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const yearOfBirth = parseInt(document.getElementById('yearOfBirth').value);
    const monthOfBirth = parseInt(document.getElementById('monthOfBirth').value);

    if (isNaN(yearOfBirth) || isNaN(monthOfBirth) || yearOfBirth < 1900 || yearOfBirth > 2100 || monthOfBirth < 1 || monthOfBirth > 12) {
        alert('请输入有效的出生年份和月份');
        return;
    }

    const result = calculateRetirement(type, yearOfBirth, monthOfBirth);

    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <p class="retirement-age theme-text">退休年龄：${result.retirementAge}</p>
        <p class="retirement-info theme-text">退休时间：${result.retirementTime}</p>
        <p class="retirement-info theme-text">延迟退休：${result.delayMonths}</p>
    `;
    resultElement.style.display = 'block';
    scrollToResult();
    updateResultTheme(); // 添加这行来更新结果的主题
});

// 添加输入验证
document.getElementById('yearOfBirth').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value.length > 4) this.value = this.value.slice(0, 4);
});

document.getElementById('monthOfBirth').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value.length > 2) this.value = this.value.slice(0, 2);
    if (parseInt(this.value) > 12) this.value = '12';
});

// 添加平滑滚动到结果
function scrollToResult() {
    const resultElement = document.getElementById('result');
    resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function monthDiff(year1, month1, year2, month2) {
    return (year2 - year1) * 12 + (month2 - month1);
}

function addMonths(date, months) {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
}

function calculateRetirement(type, yearOfBirth, monthOfBirth) {
    let retirementAge, retirementTime, delayMonths;

    if (type === 'male') {
        if (yearOfBirth < 1960) {
            retirementAge = '60岁';
            delayMonths = 0;
        } else if (yearOfBirth > 1974) {
            retirementAge = '63岁';
            delayMonths = 36;
        } else {
            const diff = Math.ceil(monthDiff(1960, 1, yearOfBirth, monthOfBirth) / 4);
            const extraYears = Math.floor(diff / 12);
            const extraMonths = diff % 12;
            retirementAge = `${60 + extraYears}岁${extraMonths > 0 ? `${extraMonths}个月` : ''}`;
            delayMonths = diff;
        }
    } else if (type === 'female55') {
        if (yearOfBirth < 1970) {
            retirementAge = '55岁';
            delayMonths = 0;
        } else if (yearOfBirth > 1981) {
            retirementAge = '58岁';
            delayMonths = 36;
        } else {
            const diff = Math.ceil(monthDiff(1970, 1, yearOfBirth, monthOfBirth) / 4);
            const extraYears = Math.floor(diff / 12);
            const extraMonths = diff % 12;
            retirementAge = `${55 + extraYears}岁${extraMonths > 0 ? `${extraMonths}个月` : ''}`;
            delayMonths = diff;
        }
    } else if (type === 'female50') {
        if (yearOfBirth < 1975) {
            retirementAge = '50岁';
            delayMonths = 0;
        } else if (yearOfBirth > 1984) {
            retirementAge = '55岁';
            delayMonths = 60;
        } else {
            const diff = Math.ceil(monthDiff(1975, 1, yearOfBirth, monthOfBirth) / 2);
            const extraYears = Math.floor(diff / 12);
            const extraMonths = diff % 12;
            retirementAge = `${50 + extraYears}岁${extraMonths > 0 ? `${extraMonths}个月` : ''}`;
            delayMonths = diff;
        }
    }

    const retirementStartDate = addMonths(
        new Date(yearOfBirth, monthOfBirth - 1),
        (type === 'male' ? 60 : type === 'female55' ? 55 : 50) * 12 + delayMonths,
    );
    retirementTime = `${retirementStartDate.getFullYear()}年${retirementStartDate.getMonth() + 1}月`;

    return {
        retirementAge,
        retirementTime,
        delayMonths: `${delayMonths}个月`,
    };
}

// 获取模态框元素
const modal = document.getElementById("modal");

// 获取打开模态框的按钮元素
const infoButton = document.getElementById("infoButton");

// 获取关闭模态框的按钮元素
const closeModal = document.getElementById("closeModal");

// 修改打开模态框的函数
infoButton.onclick = function() {
    modal.style.display = "block";
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// 修改关闭模态框的函数
function closeModalWithAnimation() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = "none";
    }, 300); // 等待过渡动画完成
}

// 点击 "我知道了" 按钮关闭模态框
closeModal.onclick = closeModalWithAnimation;

// 在用户点击模态框外区域时，关闭它
window.onclick = function(event) {
    if (event.target == modal) {
        closeModalWithAnimation();
    }
}

function updateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
    const weekdayString = now.toLocaleDateString('zh-CN', { weekday: 'long' });
    const timeString = now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false // 设置为24小时制
    });
    const dateElement = document.getElementById('current-date');
    const weekdayElement = document.getElementById('current-weekday');
    const timeElement = document.getElementById('current-time');
    dateElement.textContent = dateString;
    weekdayElement.textContent = weekdayString;
    timeElement.textContent = timeString;
    
    // 添加可点击的样式
    dateElement.style.cursor = 'pointer';
    timeElement.style.cursor = 'pointer';
}

// 每秒更新一次时间
setInterval(updateTime, 1000);

// 初始化时立即更新一次时间
updateTime();

// 确保在 DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
});

let isDarkTheme = false;

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme', isDarkTheme);
    
    // 更新主题状态文本
    const themeStatus = document.getElementById('theme-status');
    themeStatus.textContent = isDarkTheme ? '当前主题：黑夜' : '当前主题：白天';

    // 保存主题偏好到本地存储
    localStorage.setItem('darkTheme', isDarkTheme);

    updateResultTheme(); // 添加这行
}

// 为整个右侧卡片添加点击事件监听器
document.getElementById('result-right').addEventListener('click', toggleTheme);

// 在 DOMContentLoaded 事件中添加以下代码
document.addEventListener('DOMContentLoaded', function() {
    // 检查本地存储中的主题偏好
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        toggleTheme();
    }
    updateTime();
});

// 添加以下函数
function updateResultTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    const themeTexts = document.querySelectorAll('#result .theme-text');
    
    themeTexts.forEach(text => {
        text.style.color = isDark ? '#ffffff' : '#333333';
    });
}