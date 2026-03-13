<template>
    <view class="container">
        <text class="title">🏕️ 休息处</text>
        <text class="desc">你可以在这里恢复生命或升级卡牌</text>
        
        <view class="options">
            <button class="rest-btn" @click="rest">
                <text>💤 休息</text>
                <text class="btn-desc">回复 30% 生命值</text>
            </button>
            
            <button class="upgrade-btn" @click="upgradeCard">
                <text>✨ 升级卡牌</text>
                <text class="btn-desc">选择一张卡牌升级</text>
            </button>
        </view>
        
        <button class="continue-btn" @click="continueTower">继续爬塔</button>
    </view>
</template>

<script>
import { gameState, gameActions } from '../store/gameStore.js'

export default {
    data() {
        return {
            player: gameState.player
        }
    },
    methods: {
        rest() {
            const healAmount = Math.floor(gameState.player.maxHp * 0.3)
            gameActions.healPlayer(healAmount)
            uni.showToast({ title: `回复 ${healAmount} 生命`, icon: 'success' })
            this.continueTower()
        },
        upgradeCard() {
            uni.navigateTo({ url: '/pages/card-upgrade/card-upgrade' })
        },
        continueTower() {
            gameState.currentRun.floor++
            uni.navigateTo({ url: '/pages/map/map' })
        }
    }
}
</script>

<style scoped>
.container {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    font-size: 32px;
    font-weight: bold;
    color: #16c79a;
    margin-bottom: 10px;
}

.desc {
    font-size: 16px;
    color: #a0a0a0;
    margin-bottom: 40px;
}

.options {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 40px;
}

.rest-btn, .upgrade-btn {
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid #16c79a;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.rest-btn text, .upgrade-btn text {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
}

.btn-desc {
    font-size: 14px;
    color: #a0a0a0;
    margin-top: 5px;
}

.continue-btn {
    background: linear-gradient(135deg, #e94560 0%, #533483 100%);
    color: #fff;
    border: none;
    padding: 15px 40px;
    border-radius: 25px;
    font-size: 18px;
}
</style>
