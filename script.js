class ScratchCard {
    constructor() {
        this.cards = document.querySelectorAll('.scratch-card');
        this.resetButton = document.getElementById('reset-btn');

        // 中奖字配置（只有这些字能获得假期）
        this.winningWords = ['福', '财'];  // 中奖字
        this.luckyWords = ['福', '禄', '寿', '喜', '财', '吉'];  // 所有吉利字

        // 奖品配置（极高中奖率，再降低一个数量级）
        this.prizes = [
            { amount: 0.5, type: '年假', probability: 0.002 },    // 0.2% 概率
            { amount: 1, type: '年假', probability: 0.001 },     // 0.1% 概率
            { amount: 3, type: '病假', probability: 0.0005 },   // 0.05% 概率
            { amount: 5, type: '病假', probability: 0.0002 }     // 0.02% 概率
            // 99.6973% 的概率未中奖
        ];

        // 游戏状态
        this.scratchedCards = new Set();

        this.init();
    }

    init() {
        this.shuffleWinningWords();
        this.setupCards();
        // 移除重置功能和状态加载，一次性体验
    }

    shuffleWinningWords() {
        // 极限降低中奖字出现概率，控制"福"和"财"的出现频率
        // 增加更多非中奖字，让选择更丰富，非中奖字尽可能平均出现
        const normalWords = ['禄', '寿', '喜', '吉', '安', '康', '宁', '顺', '旺', '兴', '隆', '昌', '盛', '旺', '发', '达', '乐', '和', '美', '满', '福', '祥', '瑞', '吉', '庆', '贺', '喜', '悦', '欢', '乐'];  // 大幅增加非中奖字
        const winningWords = ['福', '财'];           // 中奖字

        // 为每个卡片分配字，极限降低中奖字概率
        this.cards.forEach((card, index) => {
            const luckyWord = card.querySelector('.lucky-word');
            let selectedWord;

            // 98%概率选择非中奖字，2%概率选择中奖字（极限降低）
            if (Math.random() < 0.98) {
                // 从丰富的非中奖字中随机选择，确保多样性
                selectedWord = normalWords[Math.floor(Math.random() * normalWords.length)];
            } else {
                // 从中奖字中随机选择（极限概率）
                selectedWord = winningWords[Math.floor(Math.random() * winningWords.length)]
            }

            luckyWord.textContent = selectedWord;
        });
    }

    setupCards() {
        this.cards.forEach((card, index) => {
            const canvas = card.querySelector('.scratch-canvas');
            const prizeContent = card.querySelector('.prize-content');
            const prizeAmount = card.querySelector('.prize-amount');
            const prizeType = card.querySelector('.prize-type');
            const luckyWord = card.querySelector('.lucky-word');

            // 获取当前卡片的吉利字
            const currentWord = luckyWord.textContent;

            // 判断是否为中奖字
            const isWinningWord = this.winningWords.includes(currentWord);
            let prize = { amount: 0, type: '谢谢参与' };

            if (isWinningWord) {
                // 中奖字才有奖品，但极限限制中奖天数
                // 95%概率给最小天数，只有5%概率按正常概率分配
                if (Math.random() < 0.95) {
                    // 95%概率给最小奖品（0.5天年假）
                    prize = { amount: 0.5, type: '年假' };
                } else {
                    // 只有5%概率按正常概率分配（可能中大奖）
                    prize = this.generatePrize();
                }
            }

            // 设置奖品内容，只保留天数显示
            if (prize.amount === 0) {
                // 非中奖字的天数规则：随机出现各种天数
                const fakeDayOptions = ['1天', '2天', '3天', '5天', '7天', '10天'];
                // 随机选择天数，让分布更自然
                const fakeDayIndex = Math.floor(Math.random() * fakeDayOptions.length);
                const fakeDays = fakeDayOptions[fakeDayIndex];
                prizeAmount.textContent = fakeDays;
                prizeType.textContent = '';
                prizeContent.classList.add('no-prize');
            } else {
                prizeAmount.textContent = `${prize.amount}天`;
                prizeType.textContent = '';
            }

            // 存储奖品信息到卡片
            card.dataset.prizeAmount = prize.amount;
            card.dataset.prizeType = prize.type;
            card.dataset.isWinningWord = isWinningWord;

            // 设置canvas刮开效果
            this.setupCanvas(canvas, card);
        });
    }

    generatePrize() {
        // 极限降低大奖概率，调整奖品分布
        const random = Math.random();
        let cumulativeProbability = 0;

        // 调整奖品概率，进一步降低大奖概率
        const adjustedPrizes = [
            { amount: 0.5, type: '年假', probability: 0.8 },      // 80% - 0.5天
            { amount: 1, type: '年假', probability: 0.15 },       // 15% - 1天
            { amount: 3, type: '年假', probability: 0.04 },       // 4% - 3天
            { amount: 7, type: '年假', probability: 0.008 },      // 0.8% - 7天
            { amount: 15, type: '年假', probability: 0.0015 },    // 0.15% - 15天
            { amount: 30, type: '年假', probability: 0.00045 },   // 0.045% - 30天
            { amount: 100, type: '年假', probability: 0.00005 }    // 0.005% - 100天（极限稀有）
        ];

        for (const prize of adjustedPrizes) {
            cumulativeProbability += prize.probability;
            if (random <= cumulativeProbability) {
                return prize;
            }
        }

        return { amount: 0.5, type: '年假' }; // 默认返回最小奖品
    }

    setupCanvas(canvas, card) {
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        // 设置canvas尺寸
        canvas.width = rect.width;
        canvas.height = rect.height;

        // 绘制银色刮刮层
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#c0c0c0');
        gradient.addColorStop(0.5, '#e0e0e0');
        gradient.addColorStop(1, '#a0a0a0');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 添加刮刮乐文字
        ctx.fillStyle = '#666';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('刮开', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText('有惊喜', canvas.width / 2, canvas.height / 2 + 10);

        // 设置刮开效果
        this.setupScratching(canvas, ctx, card);
    }

    setupScratching(canvas, ctx, card) {
        let isScratching = false;
        let scratchedArea = 0;
        const totalArea = canvas.width * canvas.height;
        const scratchThreshold = 0.5; // 50%刮开时显示奖品

        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            return { x, y };
        };

        const scratch = (x, y) => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, 2 * Math.PI);
            ctx.fill();

            // 计算刮开的面积
            this.calculateScratchedArea(canvas, ctx);
        };

        const startScratching = (e) => {
            if (this.scratchedCards.has(card.dataset.cardId)) {
                return;
            }

            isScratching = true;
            const pos = getMousePos(e);
            scratch(pos.x, pos.y);
        };

        const scratchMove = (e) => {
            if (!isScratching) return;

            const pos = getMousePos(e);
            scratch(pos.x, pos.y);

            // 检查是否刮开足够面积
            scratchedArea = this.calculateScratchedArea(canvas, ctx);
            if (scratchedArea / totalArea >= scratchThreshold) {
                this.revealPrize(card, canvas);
            }
        };

        const endScratching = () => {
            isScratching = false;
        };

        // 鼠标事件
        canvas.addEventListener('mousedown', startScratching);
        canvas.addEventListener('mousemove', scratchMove);
        canvas.addEventListener('mouseup', endScratching);
        canvas.addEventListener('mouseleave', endScratching);

        // 触摸事件
        canvas.addEventListener('touchstart', startScratching);
        canvas.addEventListener('touchmove', scratchMove);
        canvas.addEventListener('touchend', endScratching);
    }

    calculateScratchedArea(canvas, ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                transparentPixels++;
            }
        }

        return transparentPixels;
    }

    revealPrize(card, canvas) {
        if (this.scratchedCards.has(card.dataset.cardId)) {
            return;
        }

        // 完全清除canvas
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 标记为已刮开
        this.scratchedCards.add(card.dataset.cardId);
        card.classList.add('scratched');

        // 移除奖品统计更新

        // 移除游戏状态保存，一次性体验

        // 显示中奖效果
        this.showWinningEffect(card, prizeAmount, isWinningWord);
    }

    showWinningEffect(card, prizeAmount, isWinningWord) {
        if (prizeAmount > 0) {
            // 中奖字且有奖品 - 简单文字提示（移除浮动效果）
            const celebration = document.createElement('div');
            celebration.innerHTML = '🎉 中奖啦! 🎉';
            celebration.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.2em;
                font-weight: bold;
                color: #ff6b6b;
                background: rgba(255, 255, 255, 0.9);
                padding: 10px 15px;
                border-radius: 20px;
                pointer-events: none;
                z-index: 10;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            `;

            card.style.position = 'relative';
            card.appendChild(celebration);

            setTimeout(() => {
                celebration.remove();
            }, 1500);
        }
        // 移除非中奖字的提示效果
    }

    resetGame() {
        this.scratchedCards.clear();

        // 重置所有卡片
        this.cards.forEach(card => {
            card.classList.remove('scratched');
            const canvas = card.querySelector('.scratch-canvas');
            const prizeContent = card.querySelector('.prize-content');

            // 重新绘制刮刮层
            this.setupCanvas(canvas, card);

            // 重置奖品内容样式
            prizeContent.classList.remove('no-prize');
        });

        // 重新生成奖品
        this.setupCards();

        // 清除保存的状态
        localStorage.removeItem('scratchGameState');
    }

    // 移除游戏状态保存和加载方法，一次性体验
}

// 移除CSS动画定义

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new ScratchCard();
});
