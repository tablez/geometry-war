<template>
    <view class="container">
        <view class="title">🏪 商店</view>
        
        <view class="gold-display">
            <text class="gold-icon">💰</text>
            <text class="gold-amount">{{ gold }}</text>
        </view>
        
        <view class="shop-section">
            <text class="section-title">购买卡牌</text>
            <view class="card-list">
                <view 
                    v-for="(card, index) in shopCards" 
                    :key="index"
                    class="shop-card"
                    :class="{ canAfford: gold >= card.cost }"
                    @click="buyCard(card)"
                >
                    <view class="card-info">
                        <text class="card-name">{{ card.name }}</text>
                        <text class="card-desc">{{ card.description }}</text>
                    </view>
                    <text class="card-price">💰 {{ card.cost }}</text>
                </view>
            </view>
        </view>
        
        <view class="shop-section">
            <text class="section-title">删除卡牌</text>
            <text class="remove-desc">花费 75 金币删除一张卡牌</text>
            <button 
                class="remove-btn" 
                :disabled="gold < 75 || deck.length <= 5"
                @click="showRemove = true"
            >
                删除卡牌 (💰75)
            </button>
        </view>
        
        <!-- 删除选择弹窗 -->
        <view class="remove-modal" v-if="showRemove">
            <view class="modal-content">
                <text class="modal-title">选择要删除的卡牌</text>
                <scroll-view class="card-list" scroll-y>
                    <view 
                        v-for="(card, index) in removableCards" 
                        :key="index"
                        class="remove-option"
                        @click="doRemove(card.id)"
                    >
                        <text class="card-name">{{ card.name }}</text>
                        <text class="remove-icon">🗑️</text>
                    </view>
                </scroll-view>
                <button class="cancel-btn" @click="showRemove = false">取消</button>
            </view>
        </view>
        
        <button class="continue-btn" @click="continueJourney">离开商店</button>
    </view>
</template>

<script>
import { gameState, gameActions } from '../store/gameStore.js'
import { WARRIOR_CARDS } from '../static/cards-complete.js'

export default {
    data() {
        return {
            showRemove: false,
            shopCards: []
        }
    },
    computed: {
        gold() {
            return gameState.currentRun?.gold || 0
        },
        deck() {
            return gameState.deck
        },
        removableCards() {
            return gameState.deck.map(cardId => {
                const card = WARRIOR_CARDS[cardId]
                return {
                    id: cardId,
                    name: card?.name || cardId
                }
            })
        }
    },
    onLoad() {
        this.generateShop()
    },
    methods: {
        // 生成商店商品
        generateShop() {
            const cardPool = Object.keys(WARRIOR_CARDS)
                .filter(id => !['strike', 'defend'].includes(id)) // 不出售基础牌
            
            // 随机选择5张卡牌
            const selected = []
            for (let i = 0; i < 5; i++) {
                const randomIndex = Math.floor(Math.random() * cardPool.length)
                const cardId = cardPool[randomIndex]
                const card = WARRIOR_CARDS[cardId]
                
                selected.push({
                    id: cardId,
                    name: card.name,
                    description: card.description,
                    cost: this.getCardCost(card)
                })
            }
            
            this.shopCards = selected
        },
        
        // 计算卡牌价格
        getCardCost(card) {
            const baseCost = {
                attack: 50,
                skill: 50,
                power: 75
            }
            return baseCost[card.type] || 50
        },
        
        // 购买卡牌
        buyCard(card) {
            if (this.gold < card.cost) {
                uni.showToast({
                    title: '金币不足',
                    icon: 'none'
                })
                return
            }
            
            // 扣除金币
            gameState.currentRun.gold -= card.cost
            
            // 添加卡牌到卡组
            gameState.deck.push(card.id)
            
            uni.showToast({
                title: `购买成功: ${card.name}`,
                icon: 'success'
            })
            
            // 从商店移除
            this.shopCards = this.shopCards.filter(c => c.id !== card.id)
        },
        
        // 删除卡牌
        doRemove(cardId) {
            if (this.gold < 75) return
            
            // 扣除金币
            gameState.currentRun.gold -= 75
            
            // 从卡组移除
            const index = gameState.deck.indexOf(cardId)
            if (index > -1) {
                gameState.deck.splice(index, 1)
            }
            
            uni.showToast({
                title: '删除成功',
                icon: 'success'
            })
            
            this.showRemove = false
        },
        
        // 继续旅程
        continueJourney() {
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
}

.title {
    font-size: 36px;
    font-weight: bold;
    color: #f9a825;
    text-align: center;
    margin-bottom: 20px;
}

.gold-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 30px;
}

.gold-icon {
    font-size: 32px;
}

.gold-amount {
    font-size: 28px;
    font-weight: bold;
    color: #f9a825;
}

.shop-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
}

.section-title {
    display: block;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 15px;
}

.card-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.shop-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 2px solid #333;
    opacity: 0.5;
}

.shop-card.canAfford {
    opacity: 1;
    border-color: #0f3460;
    cursor: pointer;
}

.shop-card.canAfford:active {
    background: rgba(255, 255, 255, 0.1);
}

.card-info {
    flex: 1;
}

.card-name {
    display: block;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 5px;
}

.card-desc {
    display: block;
    font-size: 12px;
    color: #a0a0a0;
}

.card-price {
    font-size: 16px;
    color: #f9a825;
}

.remove-desc {
    display: block;
    font-size: 14px;
    color: #a0a0a0;
    margin-bottom: 15px;
}

.remove-btn {
    width: 100%;
    height: 44px;
    background: #e94560;
    color: #fff;
    border: none;
    border-radius: 22px;
}

.remove-btn[disabled] {
    background: #333;
    color: #666;
}

.continue-btn {
    width: 100%;
    height: 50px;
    background: linear-gradient(135deg, #e94560 0%, #533483 100%);
    color: #fff;
    border: none;
    border-radius: 25px;
    font-size: 18px;
    margin-top: 20px;
}

/* 删除弹窗 */
.remove-modal {
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

.remove-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin-bottom: 10px;
}

.remove-icon {
    color: #e94560;
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
