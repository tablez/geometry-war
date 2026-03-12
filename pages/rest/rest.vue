<template>
    <view class="container">
        <view class="title">🏕️ 休息处</view>
        
        <view class="player-status">
            <text class="hp">❤️ {{ player.hp }}/{{ player.maxHp }}</text>
            <text class="deck">卡组: {{ deck.length }} 张</text>
        </view>
        
        <view class="actions">
            <view class="action-card" @click="rest">
                <text class="action-icon">😴</text>
                <text class="action-name">休息</text>
                <text class="action-desc">回复 30% 最大生命值</text>
            </view>
            
            <view class="action-card" @click="upgradeCard">
                <text class="action-icon">✨</text>
                <text class="action-name">升级卡牌</text>
                <text class="action-desc">选择一张卡牌升级</text>
            </view>
        </view>
        
        <!-- 升级选择弹窗 -->
        <view class="upgrade-modal" v-if="showUpgrade">
            <view class="modal-content">
                <text class="modal-title">选择要升级的卡牌</text>
                <scroll-view class="card-list" scroll-y>
                    <view 
                        v-for="(card, index) in upgradableCards" 
                        :key="index"
                        class="upgrade-option"
                        @click="doUpgrade(card.id)"
                    >
                        <text class="card-name">{{ card.name }}</text>
                        <text class="upgrade-arrow">➡️</text>
                        <text class="upgraded-name">{{ card.upgradedName }}</text>
                    </view>
                </scroll-view>
                <button class="cancel-btn" @click="showUpgrade = false">取消</button>
            </view>
        </view>
        
        <button class="continue-btn" @click="continueJourney">继续旅程</button>
    </view>
</template>

<script>
import { gameState, gameActions } from '../../store/gameStore.js'
import { WARRIOR_CARDS } from '../../static/cards-complete.js'

export default {
    data() {
        return {
            showUpgrade: false,
            upgradableCards: []
        }
    },
    computed: {
        player() {
            return gameState.player
        },
        deck() {
            return gameState.deck
        }
    },
    methods: {
        // 休息回复生命
        rest() {
            const healAmount = Math.floor(gameState.player.maxHp * 0.3)
            gameActions.healPlayer(healAmount)
            uni.showToast({
                title: `回复 ${healAmount} 生命`,
                icon: 'none'
            })
        },
        
        // 打开升级界面
        upgradeCard() {
            // 获取可升级的卡牌
            this.upgradableCards = gameState.deck
                .filter(cardId => {
                    const card = WARRIOR_CARDS[cardId]
                    return card && card.upgrade && !gameState.currentRun.upgradedCards?.includes(cardId)
                })
                .map(cardId => {
                    const card = WARRIOR_CARDS[cardId]
                    return {
                        id: cardId,
                        name: card.name,
                        upgradedName: card.upgrade.name || card.name + '+'
                    }
                })
            
            if (this.upgradableCards.length === 0) {
                uni.showToast({
                    title: '没有可升级的卡牌',
                    icon: 'none'
                })
                return
            }
            
            this.showUpgrade = true
        },
        
        // 执行升级
        doUpgrade(cardId) {
            // 记录已升级
            if (!gameState.currentRun.upgradedCards) {
                gameState.currentRun.upgradedCards = []
            }
            gameState.currentRun.upgradedCards.push(cardId)
            
            uni.showToast({
                title: '升级成功！',
                icon: 'success'
            })
            this.showUpgrade = false
        },
        
        // 继续旅程
        continueJourney() {
            // 进入下一层
            gameState.currentRun.floor++
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
    font-size: 36px;
    font-weight: bold;
    color: #16c79a;
    margin-bottom: 30px;
}

.player-status {
    display: flex;
    gap: 30px;
    margin-bottom: 40px;
    font-size: 18px;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 400px;
}

.action-card {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid #0f3460;
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
}

.action-card:active {
    transform: scale(0.98);
    background: rgba(255, 255, 255, 0.15);
}

.action-icon {
    font-size: 48px;
    margin-bottom: 10px;
}

.action-name {
    display: block;
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 10px;
}

.action-desc {
    display: block;
    font-size: 14px;
    color: #a0a0a0;
}

.continue-btn {
    margin-top: 40px;
    width: 200px;
    height: 50px;
    background: linear-gradient(135deg, #e94560 0%, #533483 100%);
    color: #fff;
    border: none;
    border-radius: 25px;
    font-size: 18px;
}

/* 升级弹窗 */
.upgrade-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.modal-content {
    background: #1a1a2e;
    border-radius: 12px;
    padding: 30px;
    width: 80%;
    max-width: 400px;
}

.modal-title {
    display: block;
    font-size: 20px;
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
}

.card-list {
    max-height: 300px;
}

.upgrade-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin-bottom: 10px;
}

.card-name {
    color: #a0a0a0;
}

.upgrade-arrow {
    color: #e94560;
}

.upgraded-name {
    color: #16c79a;
    font-weight: bold;
}

.cancel-btn {
    margin-top: 20px;
    width: 100%;
    height: 44px;
    background: transparent;
    border: 1px solid #666;
    color: #fff;
    border-radius: 22px;
}
</style>
