// Игровые переменные
let count = 0;
let energy = 200;
const counter = document.getElementById('counter');
const energyElement = document.getElementById('energy');
const clicker = document.getElementById('clicker-btn');

const clickQuestBtn1000 = document.getElementById('click-quest-btn-1000');
const clickCounter1000 = document.getElementById('click-counter-1000');
let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;

let casesOpened = parseInt(localStorage.getItem('casesOpened')) || 0;
const caseQuestBtn = document.getElementById('case-quest-btn');
const caseCounter = document.getElementById('case-counter');



// Блокировка жестов масштабирования
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

// Блокировка двойного тапа
let lastTap = 0;
document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTap <= 300) e.preventDefault(); // Блокировка быстрых двойных тапов
    lastTap = now;
});



// Генерация уникального ID игрока
let playerId = localStorage.getItem('playerId');
if (!playerId) {
    const randomId = 'GR-' + Math.floor(Math.random() * 900000 + 100000);
    playerId = randomId;
    localStorage.setItem('playerId', playerId);
}

// Для анимации промокода
const PROMO_CODE = "GIFTRUN"; // Ваш секретный код
let promoUsed = localStorage.getItem('promoUsed') === 'true';

// Загрузка сохраненных значений при запуске
if (localStorage.getItem('savedCount')) {
    count = parseInt(localStorage.getItem('savedCount'));
    counter.textContent = count;
}

if (localStorage.getItem('savedEnergy')) {
    energy = parseInt(localStorage.getItem('savedEnergy'));
    energyElement.textContent = energy;
    
    // Обновляем прозрачность кнопки в зависимости от энергии
    clicker.style.opacity = energy > 0 ? "1" : "0.5";
}

// Добавьте:
updateCaseQuestUI(); // Инициализация интерфейса задания


setInterval(() => {
    if (energy < 200) {
        energy++;
        localStorage.setItem('savedEnergy', energy); // Сохраняем энергию
        energyElement.textContent = energy;
        if (energy > 0) clicker.style.opacity = "1";
    }
}, 1000);

// Обработчик кликов
clicker.addEventListener('mousedown', () => {
    if (energy > 0) {
        clicker.classList.add('pressed');
    }
});

clicker.addEventListener('mouseup', () => {
    clicker.classList.remove('pressed');
});

clicker.addEventListener('mouseleave', () => {
    clicker.classList.remove('pressed');
});

clicker.addEventListener('click', (e) => {
    if (energy > 0) {
        energy--;
        count += 1;

        function updateClickCounter1000(clicks) {
    clickCounter1000.textContent = `${clicks}/1000`;
    
    if (clicks >= 1000 && !localStorage.getItem('clickQuestCompleted1000')) {
        clickQuestBtn1000.disabled = false;
    }
}
        
        // Сохраняем новые значения
        localStorage.setItem('savedCount', count);
        localStorage.setItem('savedEnergy', energy);
        
        energyElement.textContent = energy;
        counter.textContent = count;
        
        // Анимация счетчика
        counter.classList.add('changed');
        setTimeout(() => counter.classList.remove('changed'), 200);

        // Эффект клика
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        const rect = clicker.getBoundingClientRect();
        effect.style.left = (e.clientX - rect.left - 10) + 'px';
        effect.style.top = (e.clientY - rect.top - 10) + 'px';
        clicker.appendChild(effect);
        setTimeout(() => effect.remove(), 800);
    } else {
        clicker.style.opacity = "0.5";
    }



        // Обновляем счетчики заданий
        if (!localStorage.getItem('clickQuestCompleted') || !localStorage.getItem('clickQuestCompleted1000')) {
            totalClicks++;
            localStorage.setItem('totalClicks', totalClicks);
            
            // Обновляем счетчик 500 кликов
            if (!localStorage.getItem('clickQuestCompleted')) {
                clickCounter.textContent = `${totalClicks}/500`;
                if (totalClicks >= 500) {
                    document.getElementById('click-quest-btn').disabled = false;
                }
            }
            
            // Обновляем счетчик 1000 кликов
            if (!localStorage.getItem('clickQuestCompleted1000')) {
                clickCounter1000.textContent = `${totalClicks}/1000`;
                if (totalClicks >= 1000) {
                    clickQuestBtn1000.disabled = false;
                }
            }
        }


});


// Система вкладок
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.menu-btn, .tab-screen').forEach(el => {
            el.classList.remove('active');
        });
        this.classList.add('active');
        document.getElementById(this.dataset.tab).classList.add('active');
    });
});

// Текущий выбранный кейс
let currentCase = null;

// Система кейсов
// Оригинальный код до этого места остается без изменений...
// Обработчик кликов по кейсам (полная версия)
document.querySelectorAll('.case').forEach(caseEl => {
    caseEl.addEventListener('click', function() {
        currentCase = this;
        const caseName = this.querySelector('.case-name').textContent;
        const requiredPoints = parseInt(this.dataset.price);
        
        // Обновляем интерфейс
        document.getElementById('case-view-title').textContent = caseName;
        document.getElementById('required-points').textContent = requiredPoints;
        document.getElementById('current-points').textContent = count;
        
        // Скрываем все сетки
        document.querySelectorAll('.rewards-grid').forEach(grid => {
            grid.style.display = 'none';
        });
        
        // Показываем нужную сетку
        switch(caseName) {
            case 'Кейс бомж':
                document.getElementById('rewards-grid').style.display = 'grid';
                break;
            case 'Кейс новичок':
                document.getElementById('rewards-grid-novice').style.display = 'grid';
                break;
            case 'Начальный кейс':
                document.getElementById('rewards-grid-starter').style.display = 'grid';
                break;
            case 'Лучший бесплатный':
                document.getElementById('rewards-grid-premium').style.display = 'grid';
                break;
        }
        
        document.getElementById('open-case-btn').disabled = count < requiredPoints;
        document.querySelectorAll('.tab-screen').forEach(el => el.classList.remove('active'));
        document.getElementById('case-view').classList.add('active');
    });
});




// Кнопка открытия кейса
document.getElementById('open-case-btn').addEventListener('click', function() {
    if (currentCase && count >= parseInt(currentCase.dataset.price)) {
        const caseName = currentCase.querySelector('.case-name').textContent;

        if (caseName === 'Кейс бомж') {
            openBomjCase();
        } else if (caseName === 'Кейс новичок') {
            openNoviceCase();
} else if (caseName === 'Начальный кейс') {
    openStarterCase();
} else if (caseName === 'Лучший бесплатный') {
    openPremiumCase();
} else {
    // Обработка других кейсов
}
    }
});



function openBomjCase() {
// В начале каждой функции open...Case() должно быть:
if (!localStorage.getItem('caseQuestCompleted')) {
    casesOpened++;
    localStorage.setItem('casesOpened', casesOpened);
    updateCaseQuestUI();
}
    const rewards = [
        { type: 'gift', value: 'gift1.png', name: 'Блокнот', chance: 0 },
        { type: 'gift', value: 'gift2.png', name: 'Кольцо', chance: 0 },
        { type: 'gift', value: 'gift3.png', name: 'Подарок', chance: 0 },
        { type: 'gift', value: 'gift4.png', name: 'Сердечко', chance: 1 },
        { type: 'points', value: 3000, name: '3000', chance: 6 },
        { type: 'points', value: 1500, name: '1500', chance: 15 },
        { type: 'points', value: 500, name: '500', chance: 58 },
        { type: 'points', value: 100, name: '100', chance: 20 }
    ];

    const rewardItems = document.querySelectorAll('#rewards-grid .reward-item');
    const resultElement = document.querySelector('.case-special-block');
    const openBtn = document.getElementById('open-case-btn');
    const closeBtn = document.getElementById('close-case-btn');
    const currentPointsElement = document.getElementById('current-points');
    
    openBtn.disabled = true;
    closeBtn.disabled = true;
    rewardItems.forEach(item => item.classList.remove('active'));
    
    // ФИКС: Используем фиксированную стоимость 1000
    const casePrice = 1000;

    // После строки count -= casePrice;
localStorage.setItem('savedCount', count);

    count -= casePrice;
    counter.textContent = count;
    currentPointsElement.textContent = count;
    
    let random = Math.random() * 100;
    let selectedIndex = 0;
    let accumulatedChance = 0;
    
    for (let i = 0; i < rewards.length; i++) {
        accumulatedChance += rewards[i].chance;
        if (random <= accumulatedChance) {
            selectedIndex = i;
            break;
        }
    }
    
    const selectedReward = rewards[selectedIndex];
    let currentIndex = 0;
    let speed = 100;
    let cycles = 0;
    const totalCycles = 3;
    
    function animateSelection() {
        rewardItems[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % rewardItems.length;
        rewardItems[currentIndex].classList.add('active');
        
        if (currentIndex === 0) {
            cycles++;
            if (cycles === totalCycles) speed += 20;
            else speed += 50;
        }
        
        if (cycles >= totalCycles && currentIndex === selectedIndex) {
            setTimeout(() => {
                if (selectedReward.type === 'points') {
                    count += selectedReward.value;
                    // И после строки count += selectedReward.value;
localStorage.setItem('savedCount', count);
                    counter.textContent = count;
                    currentPointsElement.textContent = count;
                    resultElement.textContent = `Вы выиграли: ${selectedReward.value} очков`;
                } else {
                    resultElement.textContent = `Вы выиграли: ${selectedReward.name}`;
                }
                
                resultElement.classList.add('win');
                setTimeout(() => resultElement.classList.remove('win'), 3000);
                openBtn.disabled = false;
                closeBtn.disabled = false;
                document.getElementById('open-case-btn').disabled = count < casePrice;
            }, 500);
            return;
        }
        
        setTimeout(animateSelection, speed);
    }
    
    resultElement.textContent = 'Вы выиграли: ...';
    setTimeout(animateSelection, speed);
}



function openNoviceCase() {
// В самое начало каждой функции, перед const rewards = [...]
// В начале каждой функции open...Case() должно быть:
if (!localStorage.getItem('caseQuestCompleted')) {
    casesOpened++;
    localStorage.setItem('casesOpened', casesOpened);
    updateCaseQuestUI();
}
    const rewards = [
        { type: 'gift', value: 'gift5.png', name: 'Шапка', chance: 0 },
        { type: 'gift', value: 'gift6.png', name: 'Колечко', chance: 0 },
        { type: 'gift', value: 'gift7.png', name: 'Букетик', chance: 0 },
        { type: 'gift', value: 'gift8.png', name: 'Подарок', chance: 1 },
        { type: 'points', value: 4000, name: '4000', chance: 6 },
        { type: 'points', value: 2800, name: '2800', chance: 15 },
        { type: 'points', value: 1200, name: '1200', chance: 58 },
        { type: 'points', value: 500, name: '500', chance: 20 }
    ];

    const rewardItems = document.querySelectorAll('#rewards-grid-novice .reward-item');
    const resultElement = document.querySelector('.case-special-block');
    const openBtn = document.getElementById('open-case-btn');
    const closeBtn = document.getElementById('close-case-btn');
    const currentPointsElement = document.getElementById('current-points');
    
    // Блокируем кнопки во время анимации
    openBtn.disabled = true;
    closeBtn.disabled = true;
    
    // Снимаем выделение со всех элементов
    rewardItems.forEach(item => item.classList.remove('active'));
    
    // Вычитаем стоимость кейса (2000 очков для "Кейс новичок")
    const casePrice = 2000;
    // После строки count -= casePrice;
localStorage.setItem('savedCount', count);

    count -= casePrice;
    counter.textContent = count;
    currentPointsElement.textContent = count;
    
    // Выбираем случайный приз согласно шансам
    let random = Math.random() * 100;
    let selectedIndex = 0;
    let accumulatedChance = 0;
    
    for (let i = 0; i < rewards.length; i++) {
        accumulatedChance += rewards[i].chance;
        if (random <= accumulatedChance) {
            selectedIndex = i;
            break;
        }
    }
    
    const selectedReward = rewards[selectedIndex];
    
    // Анимация выбора приза
    let currentIndex = 0;
    let speed = 100;
    let cycles = 0;
    const totalCycles = 3;
    
    function animateSelection() {
        rewardItems[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % rewardItems.length;
        rewardItems[currentIndex].classList.add('active');
        
        if (currentIndex === 0) {
            cycles++;
            if (cycles === totalCycles) {
                speed += 20;
            } else {
                speed += 50;
            }
        }
        
        if (cycles >= totalCycles && currentIndex === selectedIndex) {
            setTimeout(() => {
                if (selectedReward.type === 'points') {
                    count += selectedReward.value;
                    // И после строки count += selectedReward.value;
localStorage.setItem('savedCount', count);
                    counter.textContent = count;
                    currentPointsElement.textContent = count;
                    resultElement.textContent = `Вы выиграли: ${selectedReward.value} очков`;
                } else {
                    resultElement.textContent = `Вы выиграли: ${selectedReward.name}`;
                }
                
                resultElement.classList.add('win');
                setTimeout(() => resultElement.classList.remove('win'), 3000);
                
                openBtn.disabled = false;
                closeBtn.disabled = false;
                
                document.getElementById('open-case-btn').disabled = count < casePrice;
            }, 500);
            return;
        }
        
        setTimeout(animateSelection, speed);
    }
    
    resultElement.textContent = 'Вы выиграли: ...';
    setTimeout(animateSelection, speed);
}


function openStarterCase() {
// В начале каждой функции open...Case() должно быть:
if (!localStorage.getItem('caseQuestCompleted')) {
    casesOpened++;
    localStorage.setItem('casesOpened', casesOpened);
    updateCaseQuestUI();
}
    const rewards = [
        { type: 'gift', value: 'gift9.png', name: 'Желе', chance: 0 },
        { type: 'gift', value: 'gift10.png', name: 'Печенька', chance: 0 },
        { type: 'gift', value: 'gift11.png', name: 'Кольцо', chance: 0 },
        { type: 'gift', value: 'gift12.png', name: 'Букет', chance: 1 },
        { type: 'points', value: 10000, name: '10000', chance: 6 },
        { type: 'points', value: 6500, name: '6500', chance: 15 },
        { type: 'points', value: 3000, name: '3000', chance: 58 },
        { type: 'points', value: 1500, name: '1500', chance: 20 }
    ];

    const rewardItems = document.querySelectorAll('#rewards-grid-starter .reward-item');
    const resultElement = document.querySelector('.case-special-block');
    const openBtn = document.getElementById('open-case-btn');
    const closeBtn = document.getElementById('close-case-btn');
    const currentPointsElement = document.getElementById('current-points');
    
    // Блокируем кнопки во время анимации
    openBtn.disabled = true;
    closeBtn.disabled = true;
    
    // Снимаем выделение со всех элементов
    rewardItems.forEach(item => item.classList.remove('active'));
    
    // Вычитаем стоимость кейса (5000 очков для начального кейса)
    const casePrice = 5000;
    // После строки count -= casePrice;
localStorage.setItem('savedCount', count);

    count -= casePrice;
    counter.textContent = count;
    currentPointsElement.textContent = count;
    
    // Выбираем случайный приз согласно шансам
    let random = Math.random() * 100;
    let selectedIndex = 0;
    let accumulatedChance = 0;
    
    for (let i = 0; i < rewards.length; i++) {
        accumulatedChance += rewards[i].chance;
        if (random <= accumulatedChance) {
            selectedIndex = i;
            break;
        }
    }
    
    const selectedReward = rewards[selectedIndex];
    
    // Анимация выбора приза
    let currentIndex = 0;
    let speed = 100;
    let cycles = 0;
    const totalCycles = 3;
    
    function animateSelection() {
        rewardItems[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % rewardItems.length;
        rewardItems[currentIndex].classList.add('active');
        
        if (currentIndex === 0) {
            cycles++;
            if (cycles === totalCycles) {
                speed += 20;
            } else {
                speed += 50;
            }
        }
        
        if (cycles >= totalCycles && currentIndex === selectedIndex) {
            setTimeout(() => {
                if (selectedReward.type === 'points') {
                    count += selectedReward.value;
                    // После строки count -= casePrice;
localStorage.setItem('savedCount', count);

                    counter.textContent = count;
                    currentPointsElement.textContent = count;
                    resultElement.textContent = `Вы выиграли: ${selectedReward.value} очков`;
                } else {
                    resultElement.textContent = `Вы выиграли: ${selectedReward.name}`;
                }
                
                resultElement.classList.add('win');
                setTimeout(() => resultElement.classList.remove('win'), 3000);
                
                openBtn.disabled = false;
                closeBtn.disabled = false;
                
                document.getElementById('open-case-btn').disabled = count < casePrice;
            }, 500);
            return;
        }
        
        setTimeout(animateSelection, speed);
    }
    
    resultElement.textContent = 'Вы выиграли: ...';
    setTimeout(animateSelection, speed);
}

function openPremiumCase() {
// В начале каждой функции open...Case() должно быть:
if (!localStorage.getItem('caseQuestCompleted')) {
    casesOpened++;
    localStorage.setItem('casesOpened', casesOpened);
    updateCaseQuestUI();
}
    const rewards = [
        { type: 'gift', value: 'gift13.png', name: 'Цветок', chance: 0 },
        { type: 'gift', value: 'gift14.png', name: 'Шляпа', chance: 0 },
        { type: 'gift', value: 'gift15.png', name: 'Тамагочи', chance: 0 },
        { type: 'gift', value: 'gift16.png', name: 'Алмаз', chance: 1 },
        { type: 'points', value: 20000, name: '20000', chance: 6 },
        { type: 'points', value: 12000, name: '12000', chance: 15 },
        { type: 'points', value: 7000, name: '7000', chance: 58 },
        { type: 'points', value: 3000, name: '3000', chance: 20 }
    ];

    const rewardItems = document.querySelectorAll('#rewards-grid-premium .reward-item');
    const resultElement = document.querySelector('.case-special-block');
    const openBtn = document.getElementById('open-case-btn');
    const closeBtn = document.getElementById('close-case-btn');
    const currentPointsElement = document.getElementById('current-points');
    
    // Блокируем кнопки во время анимации
    openBtn.disabled = true;
    closeBtn.disabled = true;
    
    // Снимаем выделение со всех элементов
    rewardItems.forEach(item => item.classList.remove('active'));
    
    // Вычитаем стоимость кейса (10000 очков для "Лучший начальный")
    const casePrice = 10000;
    // После строки count -= casePrice;
localStorage.setItem('savedCount', count);
    count -= casePrice;
    counter.textContent = count;
    currentPointsElement.textContent = count;
    
    // Выбираем случайный приз согласно шансам
    let random = Math.random() * 100;
    let selectedIndex = 0;
    let accumulatedChance = 0;
    
    for (let i = 0; i < rewards.length; i++) {
        accumulatedChance += rewards[i].chance;
        if (random <= accumulatedChance) {
            selectedIndex = i;
            break;
        }
    }
    
    const selectedReward = rewards[selectedIndex];
    
    // Анимация выбора приза
    let currentIndex = 0;
    let speed = 100;
    let cycles = 0;
    const totalCycles = 3;
    
    function animateSelection() {
        rewardItems[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % rewardItems.length;
        rewardItems[currentIndex].classList.add('active');
        
        if (currentIndex === 0) {
            cycles++;
            if (cycles === totalCycles) {
                speed += 20;
            } else {
                speed += 50;
            }
        }
        
        if (cycles >= totalCycles && currentIndex === selectedIndex) {
            setTimeout(() => {
                if (selectedReward.type === 'points') {
                    count += selectedReward.value;
                    // И после строки count += selectedReward.value;
localStorage.setItem('savedCount', count);
                    counter.textContent = count;
                    currentPointsElement.textContent = count;
                    resultElement.textContent = `Вы выиграли: ${selectedReward.value} очков`;
                } else {
                    resultElement.textContent = `Вы выиграли: ${selectedReward.name}`;
                }
                
                resultElement.classList.add('win');
                setTimeout(() => resultElement.classList.remove('win'), 3000);
                
                openBtn.disabled = false;
                closeBtn.disabled = false;
                
                document.getElementById('open-case-btn').disabled = count < casePrice;
            }, 500);
            return;
        }
        
        setTimeout(animateSelection, speed);
    }
    
    resultElement.textContent = 'Вы выиграли: ...';
    setTimeout(animateSelection, speed);
}



// Кнопка закрытия кейса
document.getElementById('close-case-btn').addEventListener('click', function() {
    // Возвращаемся на экран кейсов
    document.querySelectorAll('.tab-screen').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById('cases').classList.add('active');
    
    // Активируем кнопку "Кейсы" в меню
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.menu-btn[data-tab="cases"]').classList.add('active');
});

function updateCaseQuestUI() {
    caseCounter.textContent = `${casesOpened}/5`;
    if (casesOpened >= 5 && !localStorage.getItem('caseQuestCompleted')) {
        caseQuestBtn.disabled = false;
        caseQuestBtn.style.background = '#4285f4'; // Синий цвет активной кнопки
    }
}

function updateClickCounter1000(clicks) {
    clickCounter1000.textContent = `${clicks}/1000`;
    if (clicks >= 1000 && !localStorage.getItem('clickQuestCompleted1000')) {
        clickQuestBtn1000.disabled = false;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Элементы заданий
    const questBtn = document.getElementById('telegram-quest-btn');
    const clickQuestBtn = document.getElementById('click-quest-btn');
    const clickCounter = document.getElementById('click-counter');
    
        // === ВСТАВЬТЕ ЭТУ СТРОЧКУ ЗДЕСЬ ===
    document.getElementById('player-id-value').textContent = playerId;
    // ===================================
    
// Обновляем кнопки магазина при загрузке
updateShopButtons();

    // Проверка состояния заданий при загрузке
    if (localStorage.getItem('telegramQuestCompleted')) {
        lockButton(questBtn);
    }
    
    // Инициализация счетчика кликов
    const savedClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
    const clickQuestDone = localStorage.getItem('clickQuestCompleted') === 'true';
    
    // Первоначальное отображение счетчика
    updateClickCounter(savedClicks);
    
    if (clickQuestDone) {
        lockButton(clickQuestBtn);
    } else if (savedClicks >= 500) {
        clickQuestBtn.disabled = false;
    }

    // Обработчик Telegram задания
    questBtn.addEventListener('click', function() {
        if (!localStorage.getItem('telegramQuestCompleted')) {
            count += 2000;
                    localStorage.setItem('savedCount', count); // Добавьте эту строку
            counter.textContent = count;
            lockButton(questBtn);
            localStorage.setItem('telegramQuestCompleted', 'true');
            
            setTimeout(() => {
                window.open('https://t.me/gift_run', '_blank');
            }, 300);
        }
    });

    // Обработчик клик-задания
    clickQuestBtn.addEventListener('click', function() {
        if (!localStorage.getItem('clickQuestCompleted')) {
            count += 500;
                    localStorage.setItem('savedCount', count); // Добавьте эту строку
            counter.textContent = count;
            lockButton(clickQuestBtn);
            localStorage.setItem('clickQuestCompleted', 'true');
        }
    });

    // Функция обновления счетчика
    function updateClickCounter(clicks) {
        clickCounter.textContent = `${clicks}/500`;
        localStorage.setItem('totalClicks', clicks);
        
        if (clicks >= 500 && !localStorage.getItem('clickQuestCompleted')) {
            clickQuestBtn.disabled = false;
        }
    }

    // Функция блокировки кнопки
    function lockButton(btn) {
        btn.textContent = '✓ Выполнено';
        btn.style.background = '#cccccc';
        btn.style.color = '#666666';
        btn.disabled = true;
        btn.style.cursor = 'default';
        btn.style.transform = 'none';
        btn.style.boxShadow = 'none';
    }




// Добавить после проверки других заданий
const clickQuestDone1000 = localStorage.getItem('clickQuestCompleted1000') === 'true';
updateClickCounter1000(savedClicks);

if (clickQuestDone1000) {
    lockButton(clickQuestBtn1000);
} else if (savedClicks >= 1000) {
    clickQuestBtn1000.disabled = false;
}

// Добавить после аналогичного кода для других заданий
caseCounter.textContent = `${casesOpened}/5`;
if (localStorage.getItem('caseQuestCompleted')) {
    caseQuestBtn.disabled = true;
    caseQuestBtn.textContent = '✓ Выполнено';
    caseQuestBtn.classList.add('completed');
} else if (casesOpened >= 5) {
    caseQuestBtn.disabled = false;
}

// Проверка состояния при загрузке
if (localStorage.getItem('caseQuestCompleted')) {
    caseQuestBtn.disabled = true;
    caseQuestBtn.textContent = '✓ Выполнено';
    caseQuestBtn.style.background = '#4CAF50'; // Зеленый для выполненного
} else if (casesOpened >= 5) {
    caseQuestBtn.disabled = false;
    caseQuestBtn.style.background = '#4285f4'; // Синий для активного
}



// Инициализация счетчика 1000 кликов
if (localStorage.getItem('clickQuestCompleted1000')) {
    lockButton(clickQuestBtn1000);
} else {
    updateClickCounter1000(totalClicks);
    if (totalClicks >= 1000) {
        clickQuestBtn1000.disabled = false;
    }
}

// Обработчик задания на 1000 кликов
clickQuestBtn1000.addEventListener('click', function() {
    if (!localStorage.getItem('clickQuestCompleted1000')) {
        count += 1000;
        localStorage.setItem('savedCount', count);
        counter.textContent = count;
        lockButton(clickQuestBtn1000);
        localStorage.setItem('clickQuestCompleted1000', 'true');
    }


});

document.getElementById('promo-btn').addEventListener('click', function() {
    if (promoUsed) {
        this.textContent = 'Уже использован';
        return;
    }

    const input = document.getElementById('promo-code-input');
    if (input.value === PROMO_CODE) {
        // Начисление бонуса
        count += 2000;
        counter.textContent = count;
        localStorage.setItem('savedCount', count);
        
        // Сохраняем факт использования
        promoUsed = true;
        localStorage.setItem('promoUsed', 'true');
        
        // Блокируем поле и кнопку
        input.disabled = true;
        this.textContent = 'Активирован!';
        this.classList.add('completed');
        
        // Показываем сообщение
        const successMsg = document.getElementById('promo-success');
        successMsg.classList.add('show');
        
        // Анимация счетчика
        counter.classList.add('counter-update');
        
        // Убираем сообщение через 1.5 секунды
        setTimeout(() => {
            successMsg.classList.remove('show');
            counter.classList.remove('counter-update');
        }, 1500);
        
    } else {
        this.textContent = 'Неверно!';
        setTimeout(() => this.textContent = 'Активировать', 1000);
    }
});

});

caseQuestBtn.addEventListener('click', function() {
    if (casesOpened >= 5 && !localStorage.getItem('caseQuestCompleted')) {
        // Начисляем награду
        count += 1000;
        counter.textContent = count;
        localStorage.setItem('savedCount', count);
        
        // Помечаем задание как выполненное
        localStorage.setItem('caseQuestCompleted', 'true');
        
        // Обновляем интерфейс
        this.disabled = true;
        this.textContent = '✓ Выполнено';
        this.style.background = '#4CAF50';
        this.style.cursor = 'default';
        
        // Добавляем анимацию
        counter.classList.add('counter-update');
        setTimeout(() => counter.classList.remove('counter-update'), 300);
    }
});

// Обработчики покупки в магазине
document.querySelectorAll('.shop-buy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const item = this.closest('.shop-item');
        const price = parseInt(item.dataset.price);
        
        if (count >= price) {
            // Списываем очки
            count -= price;
            counter.textContent = count;
            localStorage.setItem('savedCount', count);
            
            // Показываем сообщение
            const message = document.getElementById('purchase-message');
            message.classList.add('show');
            setTimeout(() => message.classList.remove('show'), 1500);
            
            // Анимация
            counter.classList.add('changed');
            setTimeout(() => counter.classList.remove('changed'), 200);
        } else {
            // Недостаточно средств
            this.textContent = 'Недостаточно';
            this.style.background = '#ff0000';
            setTimeout(() => {
                this.textContent = 'Купить';
                this.style.background = 'linear-gradient(to right, #ff3366, #ff1493)';
            }, 1000);
        }
    });
});

// Обновляем состояние кнопок при загрузке
function updateShopButtons() {
    document.querySelectorAll('.shop-item').forEach(item => {
        const btn = item.querySelector('.shop-buy-btn');
        const price = parseInt(item.dataset.price);
        btn.disabled = count < price;
    });
}

// Вызываем при загрузке и после покупки
updateShopButtons();  
