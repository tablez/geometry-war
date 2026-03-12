<template>
    <view class="animation-container">
        <!-- 伤害数字 -->
        <view 
            v-for="(anim, index) in damageAnimations" 
            :key="index"
            class="damage-number"
            :class="{ critical: anim.isCritical, heal: anim.isHeal }"
            :style="{ 
                left: anim.x + 'px', 
                top: anim.y + 'px',
                animationDelay: anim.delay + 's'
            }"
        >
            {{ anim.value }}
        </view>
        
        <!-- 状态效果 -->
        <view 
            v-for="(anim, index) in statusAnimations" 
            :key="'status-' + index"
            class="status-popup"
            :style="{ 
                left: anim.x + 'px', 
                top: anim.y + 'px'
            }"
        >
            <text class="status-icon">{{ anim.icon }}</text>
            <text class="status-name">{{ anim.name }}</text>
        </view>
        
        <!-- 卡牌打出效果 -->
        <view 
            v-if="cardAnimation"
            class="card-play-effect"
            :style="{ 
                left: cardAnimation.x + 'px', 
                top: cardAnimation.y + 'px',
                backgroundColor: cardAnimation.color
            }"
        >
            <text>{{ cardAnimation.icon }}</text>
        </view>
        
        <!-- 屏幕震动 -->
        <view v-if="screenShake" class="screen-shake"></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            damageAnimations: [],
            statusAnimations: [],
            cardAnimation: null,
            screenShake: false
        }
    },
    methods: {
        // 显示伤害数字
        showDamage(x, y, value, isCritical = false, isHeal = false) {
            const anim = {
                x, y, value, isCritical, isHeal,
                delay: 0
            }
            this.damageAnimations.push(anim)
            
            // 1.5秒后移除
            setTimeout(() => {
                const index = this.damageAnimations.indexOf(anim)
                if (index > -1) {
                    this.damageAnimations.splice(index, 1)
                }
            }, 1500)
        },
        
        // 显示状态效果
        showStatus(x, y, icon, name) {
            const anim = { x, y, icon, name }
            this.statusAnimations.push(anim)
            
            setTimeout(() => {
                const index = this.statusAnimations.indexOf(anim)
                if (index > -1) {
                    this.statusAnimations.splice(index, 1)
                }
            }, 2000)
        },
        
        // 卡牌打出动画
        playCardAnimation(x, y, icon, color) {
            this.cardAnimation = { x, y, icon, color }
            
            setTimeout(() => {
                this.cardAnimation = null
            }, 500)
        },
        
        // 屏幕震动
        shakeScreen() {
            this.screenShake = true
            setTimeout(() => {
                this.screenShake = false
            }, 300)
        }
    }
}
</script>

<style scoped>
.animation-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
}

/* 伤害数字 */
.damage-number {
    position: absolute;
    font-size: 36px;
    font-weight: bold;
    color: #e94560;
    text-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
    animation: damageFloat 1.5s ease-out forwards;
    z-index: 1001;
}

.damage-number.critical {
    font-size: 48px;
    color: #ff1744;
    text-shadow: 0 0 20px rgba(255, 23, 68, 0.8);
}

.damage-number.heal {
    color: #16c79a;
    text-shadow: 0 0 10px rgba(22, 199, 154, 0.5);
}

@keyframes damageFloat {
    0% {
        transform: translateY(0) scale(0.5);
        opacity: 0;
    }
    20% {
        transform: translateY(-20px) scale(1.2);
        opacity: 1;
    }
    100% {
        transform: translateY(-60px) scale(1);
        opacity: 0;
    }
}

/* 状态效果 */
.status-popup {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: statusPop 2s ease-out forwards;
    z-index: 1001;
}

.status-icon {
    font-size: 32px;
    margin-bottom: 5px;
}

.status-name {
    font-size: 14px;
    color: #fff;
    background: rgba(0, 0, 0, 0.7);
    padding: 4px 8px;
    border-radius: 4px;
}

@keyframes statusPop {
    0% {
        transform: scale(0) translateY(20px);
        opacity: 0;
    }
    30% {
        transform: scale(1.2) translateY(-10px);
        opacity: 1;
    }
    70% {
        transform: scale(1) translateY(-30px);
        opacity: 1;
    }
    100% {
        transform: scale(0.8) translateY(-50px);
        opacity: 0;
    }
}

/* 卡牌打出效果 */
.card-play-effect {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    animation: cardPlay 0.5s ease-out forwards;
    z-index: 1002;
}

@keyframes cardPlay {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    50% {
        transform: scale(1.5);
        opacity: 0.8;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

/* 屏幕震动 */
.screen-shake {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: shake 0.3s ease-in-out;
    z-index: 999;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
}
</style>
