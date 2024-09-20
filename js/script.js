document.addEventListener('DOMContentLoaded', function() {
    // 检查本地存储中的主题偏好
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        toggleTheme(true);
    } else if (savedTheme === 'false') {
        toggleTheme(false);
    } else {
        checkTimeAndSetTheme();  // 如果没有保存的偏好，根据时间设置主题
    }
    updateTime();
    
    // 在 DOMContentLoaded 事件监听器中调用这个函数
    fetchWeather();
});

let isCalculating = false; // 保留这个标志来防止重复计算

document.getElementById('retirementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (isCalculating) return; // 如果正在计算，则忽略新的提交
    isCalculating = true; // 设置标志为正在计算
    
    // 隐藏结果容器，显示加载图标
    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('loadingSpinner').style.display = 'block';
    
    // 使用 setTimeout 来模拟短暂的加载时间，可以根据需要调整延迟时间
    setTimeout(() => {
        // 隐藏加载图标，显示结果
        document.getElementById('loadingSpinner').style.display = 'none';
        calculateRetirement();
        document.getElementById('resultContainer').style.display = 'flex';
        isCalculating = false; // 重置标志
    }, 500); // 500毫秒的延迟，可以根据需要调整
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

function calculateRetirement() {
    const type = document.getElementById('type').value;
    const yearOfBirth = parseInt(document.getElementById('yearOfBirth').value);
    const monthOfBirth = parseInt(document.getElementById('monthOfBirth').value);

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
            retirementAge = '50';
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

    // 在计算完成后，更新结果显示
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <p>您的退休年龄为：<span class="theme-text">${retirementAge}</span></p>
        <p>您的退休时间为：<span class="theme-text">${retirementTime}</span></p>
        <p>延迟退休时间：<span class="theme-text">${delayMonths}个月</span></p>
    `;

    // 显示结果容器
    document.getElementById('resultContainer').style.display = 'flex';

    // 更新结果主题
    updateResultTheme();

    // 滚动到结果
    scrollToResult();
}

// 获取模态框元素
const modal = document.getElementById("modal");

// 获取打开模态框的按钮元素
const infoButton = document.getElementById("infoButton");

// 获取关闭模态框的按钮元素
const closeModal = document.getElementById("closeModal");

// 修改打开模态框函数
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
    let timeString = now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
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

function toggleTheme(forceDark = null) {
    const newTheme = forceDark !== null ? forceDark : !isDarkTheme;
    isDarkTheme = newTheme;
    document.body.classList.toggle('dark-theme', isDarkTheme);
    
    // 更新主题状态文本
    const themeStatus = document.getElementById('theme-status');
    if (themeStatus) {
        themeStatus.textContent = isDarkTheme ? '当前主题：黑夜' : '当前主题：白天';
    }

    // 保存主题偏好到本地存储
    localStorage.setItem('darkTheme', isDarkTheme);

    updateResultTheme();
    updateWeatherInfoTheme();

    console.log('Theme toggled:', isDarkTheme ? 'dark' : 'light'); // 添加日志
}

// 为整个右侧卡片添加点击事件监听器
document.addEventListener('DOMContentLoaded', function() {
    const resultRight = document.getElementById('result-right');
    if (resultRight) {
        resultRight.addEventListener('click', function() {
            toggleTheme();
            console.log('Right card clicked'); // 添加日志
        });
    } else {
        console.log('Right card element not found'); // 添加日志
    }

    // 初始化主题
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        toggleTheme(true);
    } else if (savedTheme === 'false') {
        toggleTheme(false);
    } else {
        checkTimeAndSetTheme();
    }
});

function checkTimeAndSetTheme() {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 20 || hour < 7) {
        toggleTheme(true);  // 强制切换到黑夜模式
    } else {
        toggleTheme(false);  // 强制切换到白天模式
    }
}

// 每分钟检查一次时间并设置主题
setInterval(checkTimeAndSetTheme, 60000);

// 在页面加载时立即检查时间并设置主题
document.addEventListener('DOMContentLoaded', function() {
    // 检查本地存储中的主题偏好
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        toggleTheme(true);
    } else if (savedTheme === 'false') {
        toggleTheme(false);
    } else {
        checkTimeAndSetTheme();  // 如果没有保存的偏好，根据时间设置主题
    }
    updateTime();
});

// 添加以下函数
function updateResultTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    const themeTexts = document.querySelectorAll('#result .theme-text, #result-left h3, #result p');
    const inlineStyleElements = document.querySelectorAll('[style*="color"]');
    
    themeTexts.forEach(text => {
        text.style.color = isDark ? '#ecf0f1' : '#333333';
    });

    inlineStyleElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const currentColor = computedStyle.color;
        if (currentColor !== 'rgb(236, 240, 241)' && currentColor !== 'rgb(51, 51, 51)') {
            element.style.color = isDark ? '#ecf0f1' : '#333333';
        }
    });
}

function updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // 修改这里以确保时间始终显示为00:00:00 - 23:59:59
    document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
}

// 确保每秒更新时间
setInterval(updateCurrentTime, 1000);

// 初始化时立即更新一次时间
updateCurrentTime();

// 确保在 DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
});

function fetchWeather() {
    fetch('https://api.oioweb.cn/api/weather/GetWeather')
        .then(response => response.json())
        .then(data => {
            if (data.code === 200 && data.result) {
                const weather = data.result;
                const weatherInfoElement = document.getElementById('holidayInfo');
                weatherInfoElement.innerHTML = `
                    <p>城市：${weather.city.City}</p>
                    <p>天气：${weather.condition.day_weather}</p>
                    <p>温度：${weather.condition.min_degree}°C ~ ${weather.condition.max_degree}°C</p>
                    <p>风向：${weather.condition.day_wind_direction} ${weather.condition.day_wind_power}级</p>
                `;
            }
        })
        .catch(error => console.error('获取天气信息失败:', error));
}

// 在 DOMContentLoaded 事件监听器中调用这个函数
document.addEventListener('DOMContentLoaded', function() {
    // ... 现有代码 ...
    fetchWeather();
});

function updateWeatherInfoTheme() {
    const weatherInfo = document.querySelector('.weather-info');
    const weatherInfoTitle = document.querySelector('.weather-info h3');
    if (weatherInfo) {
        weatherInfo.style.backgroundColor = isDarkTheme ? '#3a3a3a' : 'white';
        weatherInfo.style.color = isDarkTheme ? '#ecf0f1' : '#333333';
        weatherInfo.style.boxShadow = isDarkTheme ? '0 4px 8px rgba(0, 0, 0, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.2)';
    }
    if (weatherInfoTitle) {
        weatherInfoTitle.style.color = isDarkTheme ? '#ecf0f1' : '#333333';
    }
}
