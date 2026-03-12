<template>
    <view class="container">
        <view class="title">🎁 战斗胜利</view>
        
        <view class="reward-summary">
            <view class="reward-item">
                <text class="reward-icon">💰</text>
                <text class="reward-value">+{{ gold }}</text>
                <text class="reward-label">金币</text>
            </view>
            <view class="reward-item" v-if="maxHpReward">
                <text class="reward-icon">❤️</text>
                <text class="reward-value">+{{ maxHpReward }}</text>
                <text class="reward-label">最大生命</text>
            </view>
        </view>
        
        <view class="card-reward">
            <text class="section-title">选择一张卡牌加入卡组</text>
            <text class="subtitle">{{ cardChoices.length }} 选 1</text>
            
            <view class="card-options">
                <view 
                    v-for="(card, index) in cardChoices" 
                    :key="index"
                    class="card-option"
                    :class="{ selected: selectedCard === index }"
                    @click="selectCard(index)"
                >
                    <view class="card-header">
                        <text class="card-cost">{{ card.cost }}</text>
                        <text class="card-type">{{ getTypeIcon(card.type) }}</text>
                    </view>
                    <text class="card-icon">{{ card.icon }}</text>
                    <text class="card-name">{{ card.name }}</text>
                    <text class="card-desc">{{ card.description }}</text>
                </view>
            </view>
        </view>
        
        <view class="skip-option">
            <text class="skip-text" @click="skipReward">跳过奖励 💰+30</text>
        </view>
        
        <button 
            class="confirm-btn" 
            :disabled="selectedCard === -1"
            @click="confirmReward"
        >
            确认选择
        </button>
    </view>
</template>

<script>
import { gameState } from '../store/gameStore.js'
import { WARRIOR_CARDS } from '../static/cards-complete.js'

export default {
    data() {
        return {
            gold: 0,
            maxHpReward: 0,
            cardChoices: [],
            selectedCard: -1
        }
    },
    onLoad(options) {
        // 获取奖励类型
        const type = options.type || 'normal'
        this.generateReward(type)
    },
    methods: {
        // 生成奖励
        generateReward(type) {
            const rewards = {
                normal: { gold: [15, 25], cardCount: 3, maxHp: 0 },
                elite: { gold: [35, 50], cardCount: 4, maxHp: 5 },
                boss: { gold: [60, 80], cardCount: 5, maxHp: 10 }
            }
            
            const config = rewards[type] || rewards.normal
            
            // 金币奖励
            this.gold = Math.floor(Math.random() * (config.gold[1] - config.gold[0]) + config.gold[0])
            
            // 最大生命奖励（BOSS层）
            this.maxHpReward = config.maxHp
            
            // 生成卡牌选择
            this.generateCardChoices(config.cardCount)
        },
        
        // 生成卡牌选择
        generateCardChoices(count) {
            const cardPool = Object.keys(WARRIOR_CARDS)
                .filter(id => !['strike', 'defend'].includes(id))
            
            const selected = []
            for (let i = 0; i < count; i++) {
                const randomIndex = Math.floor(Math.random() * cardPool.length)
                const cardId = cardPool[randomIndex]
                const card = WARRIOR_CARDS[cardId]
                
                selected.push({
                    id: cardId,
                    ...card
                })
                
                // 移除已选卡牌避免重复
                cardPool.splice(randomIndex, 1)
            }
            
            this.cardChoices = selected
        },
        
        // 获取类型图标
        getTypeIcon(type) {
            const icons = {
                attack: '⚔️',
                skill: '🛡️',
                power: '⚡'
            }
            return icons[type] || '🃏'
        },
        
        // 选择卡牌
        selectCard(index) {
            this.selectedCard = index
        },
        
        // 跳过奖励
        skipReward() {
            // 额外金币
            gameState.currentRun.gold += 30
            
            // 进入下一层
            this.nextFloor()
        },
        
        // 确认奖励
        confirmReward() {
            if (this.selectedCard === -1) return
            
            const selectedCard = this.cardChoices[this.selectedCard]
            
            // 添加金币
            gameState.currentRun.gold += this.gold
            
            // 添加最大生命
            if (this.maxHpReward > 0) {
                gameState.player.maxHp += this.maxHpReward
                gameState.player.hp += this.maxHpReward
            }
            
            // 添加卡牌到卡组
            gameState.deck.push(selectedCard.id)
            
            uni.showToast({
                title: `获得: ${selectedCard.name}`,
                icon: 'success'
            })
            
            // 进入下一层
            setTimeout(() => this.nextFloor(), 500)
        },
        
        // 进入下一层
        nextFloor() {
            gameState.currentRun.floor++
            uni.navigateBack({
                delta: 2 // 返回地图页面
            })
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
    color: #16c79a;
    text-align: center;
    margin-bottom: 30px;
}

.reward-summary {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 40px;
}

.reward-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.reward-icon {
    font-size: 40px;
    margin-bottom: 5px;
}

.reward-value {
    font-size: 28px;
    font-weight: bold;
    color: #f9a825;
}

.reward-label {
    font-size: 14px;
    color: #a0a0a0;
}

.card-reward {
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
    text-align: center;
    margin-bottom: 5px;
}

.subtitle {
    display: block;
    font-size: 14px;
    color: #a0a0a0;
    text-align: center;
    margin-bottom: 20px;
}

.card-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.card-option {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid #0f3460;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s;
}

.card-option.selected {
    border-color: #e94560;
    background: rgba(233, 69, 96, 0.1);
}

.card-option:active {
    transform: scale(0.98);
}

.card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.card-cost {
    width: 28px;
    height: 28px;
    background: #0f3460;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
}

.card-type {
    font-size: 20px;
}

.card-icon {
    display: block;
    font-size: 40px;
    text-align: center;
    margin-bottom: 10px;
}

.card-name {
    display: block;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    text-align: center;
    margin-bottom: 5px;
}

.card-desc {
    display: block;
    font-size: 12px;
    color: #a0a0a0;
    text-align: center;
}

.skip-option {
    text-align: center;
    margin-bottom: 20px;
}

.skip-text {
    font-size: 16px;
    color: #a0a0a0;
    text-decoration: underline;
    cursor: pointer;
}

.confirm-btn {
    width: 100%;
    height: 56px;
    background: linear-gradient(135deg, #e94560 0%, #533483 100%);
    color: #fff;
    border: none;
    border-radius: 28px;
    font-size: 20px;
    font-weight: bold;
}

.confirm-btn[disabled] {
    background: #333;
    color: #666;
}
</style>
