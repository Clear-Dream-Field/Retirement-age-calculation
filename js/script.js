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
        <p>退休年龄：${result.retirementAge}</p>
        <p>退休时间：${result.retirementTime}</p>
        <p>延迟退休：${result.delayMonths}</p>
    `;
    resultElement.style.display = 'block';
    scrollToResult();
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

// 点击按钮打开模态框 
infoButton.onclick = function() {
    modal.style.display = "block";
}

// 点击 "我知道了" 按钮关闭模态框
closeModal.onclick = function() {
    modal.style.display = "none";
}

// 在用户点击模态框外区域时，关闭它
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}