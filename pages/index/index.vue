<template>
    <view class="container">
        <!-- 动态背景 -->
        <view class="bg-animation">
            <view v-for="n in 5" :key="n" class="floating-shape" :style="shapeStyle(n)"></view>
        </view>
        
        <!-- 标题 -->
        <view class="title-section">
            <text class="game-title">几何战争</text>
            <text class="game-subtitle">Geometry War</text>
        </view>
        
        <!-- 游戏统计 -->
        <view class="stats-section">
            <view class="stat-item">
                <text class="stat-value">{{ gamesPlayed }}</text>
                <text class="stat-label">游戏次数</text>
            </view>
            <view class="stat-item">
                <text class="stat-value">{{ bestScore }}</text>
                <text class="stat-label">最高分数</text>
            </view>
        </view>
        
        <!-- 职业选择 -->
        <view class="class-section">
            <text class="section-title">选择职业</text>
            <view class="class-grid">
                <view 
                    v-for="(cls, index) in classes" 
                    :key="index"
                    class="class-card"
                    :class="{ selected: selectedClass === index }"
                    @click="selectClass(index)"
                >
                    <view class="class-shape" :style="{ backgroundColor: cls.color }">
                        <text class="shape-icon">{{ cls.icon }}</text>
                    </view>
                    <text class="class-name">{{ cls.name }}</text>
                    <text class="class-desc">{{ cls.description }}</text>
                </view>
            </view>
        </view>
        
        <!-- 开始按钮 -->
        <view class="action-section">
            <button 
                class="start-btn" 
                :disabled="selectedClass === -1"
                @click="startGame"
            >
                开始游戏
            </button>
        </view>
    </view>
</template>

<script>
import { CLASSES } from '../static/game-config.js'
import { gameState, gameActions } from '../store/gameStore.js'

export default {
    data() {
        return {
            gamesPlayed: 0,
            bestScore: 0,
            selectedClass: -1,
            classes: Object.values(CLASSES)
        }
    },
    onLoad() {
        // 加载游戏数据
        gameActions.loadGameData()
        this.gamesPlayed = gameState.gamesPlayed
        this.bestScore = gameState.bestScore
    },
    methods: {
        // 动态生成形状样式
        shapeStyle(n) {
            const colors = ['#e94560', '#533483', '#16c79a', '#f9a825', '#0f3460']
            return {
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 80}%`,
                animationDelay: `${n * 0.5}s`,
                color: colors[n - 1],
                fontSize: `${20 + Math.random() * 30}px`
            }
        },
        
        // 选择职业
        selectClass(index) {
            this.selectedClass = index
            console.log('选择职业:', this.classes[index].name)
        },
        
        // 开始游戏
        startGame() {
            if (this.selectedClass === -1) {
                uni.showToast({
                    title: '请选择职业',
                    icon: 'none'
                })
                return
            }
            
            // 获取职业ID（已经是小写）
            const classId = this.classes[this.selectedClass].id
            console.log('选择的职业ID:', classId)
            
            // 初始化游戏
            const success = gameActions.initGame(classId)
            if (!success) {
                uni.showToast({
                    title: '初始化失败: ' + classId,
                    icon: 'none'
                })
                return
            }
            
            // 跳转到地图页面
            uni.navigateTo({
                url: '/pages/map/map',
                success: () => {
                    console.log('跳转成功')
                },
                fail: (err) => {
                    console.error('跳转失败:', err)
                    uni.showToast({
                        title: '跳转失败',
                        icon: 'none'
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
.container {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 20px;
    position: relative;
    overflow: hidden;
}

/* 动态背景 */
.bg-animation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
}

.floating-shape {
    position: absolute;
    opacity: 0.1;
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
}

/* 标题区域 */
.title-section {
    text-align: center;
    margin: 60px 0 40px;
    position: relative;
    z-index: 1;
}

.game-title {
    display: block;
    font-size: 56px;
    font-weight: bold;
    color: #e94560;
    text-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
    margin-bottom: 10px;
}

.game-subtitle {
    display: block;
    font-size: 20px;
    color: #a0a0a0;
    letter-spacing: 4px;
}

/* 统计区域 */
.stats-section {
    display: flex;
    justify-content: center;
    gap: 60px;
    margin: 40px 0;
    position: relative;
    z-index: 1;
}

.stat-item {
    text-align: center;
}

.stat-value {
    display: block;
    font-size: 36px;
    font-weight: bold;
    color: #fff;
}

.stat-label {
    display: block;
    font-size: 14px;
    color: #a0a0a0;
    margin-top: 5px;
}

/* 职业选择 */
.class-section {
    margin: 40px 0;
    position: relative;
    z-index: 1;
}

.section-title {
    display: block;
    text-align: center;
    font-size: 24px;
    color: #fff;
    margin-bottom: 30px;
}

.class-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 0 20px;
}

.class-card {
    background: rgba(26, 26, 46, 0.8);
    border: 2px solid #0f3460;
    border-radius: 12px;
    padding: 25px 15px;
    text-align: center;
    transition: all 0.3s;
}

.class-card.selected {
    border-color: #e94560;
    background: rgba(233, 69, 96, 0.1);
    transform: scale(1.05);
}

.class-card:active {
    transform: scale(0.98);
}

.class-shape {
    width: 80px;
    height: 80px;
    margin: 0 auto 15px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.shape-icon {
    font-size: 40px;
    color: #fff;
}

.class-name {
    display: block;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 8px;
}

.class-desc {
    display: block;
    font-size: 12px;
    color: #a0a0a0;
}

/* 开始按钮 */
.action-section {
    margin-top: 40px;
    padding: 0 40px;
    position: relative;
    z-index: 1;
}

.start-btn {
    width: 100%;
    height: 56px;
    background: linear-gradient(135deg, #e94560 0%, #533483 100%);
    border: none;
    border-radius: 28px;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    transition: all 0.3s;
}

.start-btn[disabled] {
    background: #333;
    color: #666;
}

.start-btn:not([disabled]):active {
    transform: scale(0.98);
    opacity: 0.9;
}
</style>
