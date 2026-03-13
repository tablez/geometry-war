<template>
    <view class="container">
        <text class="title">✨ 升级卡牌</text>
        <text class="desc">选择一张卡牌进行升级</text>
        
        <view class="cards">
            <view v-for="(cardId, index) in deck" :key="index" class="card" @click="upgrade(cardId)">
                <text class="card-name">{{ getCardName(cardId) }}</text>
                <text v-if="isUpgraded(cardId)" class="upgraded">+ 已升级</text>
            </view>
        </view>
        
        <button class="back-btn" @click="goBack">返回</button>
    </view>
</template>

<script>
import { gameState } from '../store/gameStore.js'
import { getCard } from '../../static/cards-complete.js'

export default {
    data() {
        return {
            deck: gameState.currentRun.cards || []
        }
    },
    methods: {
        getCardName(cardId) {
            const card = getCard(cardId)
            return card ? card.name : cardId
        },
        isUpgraded(cardId) {
            return gameState.currentRun.upgradedCards?.includes(cardId)
        },
        upgrade(cardId) {
            if (this.isUpgraded(cardId)) {
                uni.showToast({ title: '已经升级过了', icon: 'none' })
                return
            }
            
            if (!gameState.currentRun.upgradedCards) {
                gameState.currentRun.upgradedCards = []
            }
            gameState.currentRun.upgradedCards.push(cardId)
            
            uni.showToast({ title: '升级成功', icon: 'success' })
            this.goBack()
        },
        goBack() {
            uni.navigateBack()
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
    color: #f9a825;
    margin-bottom: 10px;
}

.desc {
    font-size: 16px;
    color: #a0a0a0;
    margin-bottom: 30px;
}

.cards {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 40px;
}

.card {
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid #444;
    border-radius: 8px;
    padding: 15px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 100px;
}

.card-name {
    font-size: 16px;
    color: #fff;
}

.upgraded {
    font-size: 12px;
    color: #f9a825;
    margin-top: 5px;
}

.back-btn {
    background: linear-gradient(135deg, #e94560 0%, #533483 100%);
    color: #fff;
    border: none;
    padding: 15px 40px;
    border-radius: 25px;
    font-size: 18px;
}
</style>
