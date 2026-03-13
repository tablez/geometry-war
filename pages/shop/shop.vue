<template>
    <view class="container">
        <text class="title">🏪 商店</text>
        <text class="gold">💰 {{ gold }} 金币</text>
        
        <view class="shop-items">
            <view v-for="(item, index) in shopItems" :key="index" class="shop-item" @click="buyItem(item)">
                <text class="item-icon">{{ item.icon }}</text>
                <text class="item-name">{{ item.name }}</text>
                <text class="item-desc">{{ item.description }}</text>
                <text class="item-price">💰 {{ item.price }}</text>
            </view>
        </view>
        
        <button class="continue-btn" @click="continueTower">离开商店</button>
    </view>
</template>

<script>
import { gameState, gameActions } from '../store/gameStore.js'
import { getCard } from '../../static/cards-complete.js'

export default {
    data() {
        return {
            gold: gameState.currentRun.gold || 100,
            shopItems: []
        }
    },
    onLoad() {
        this.generateShop()
    },
    methods: {
        generateShop() {
            // 生成商店物品
            const cards = ['strike', 'defend', 'pommel_strike', 'shrug_it_off']
            this.shopItems = cards.map(cardId => {
                const card = getCard(cardId)
                return {
                    type: 'card',
                    id: cardId,
                    icon: card.icon || '🃏',
                    name: card.name,
                    description: card.description,
                    price: 50 + Math.floor(Math.random() * 50)
                }
            })
        },
        buyItem(item) {
            if (this.gold < item.price) {
                uni.showToast({ title: '金币不足', icon: 'none' })
                return
            }
            
            this.gold -= item.price
            gameState.currentRun.gold = this.gold
            gameState.currentRun.cards.push(item.id)
            
            uni.showToast({ title: `购买 ${item.name}`, icon: 'success' })
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
    color: #f9a825;
    margin-bottom: 10px;
}

.gold {
    font-size: 20px;
    color: #f9a825;
    margin-bottom: 30px;
}

.shop-items {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 40px;
}

.shop-item {
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid #444;
    border-radius: 12px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.item-icon {
    font-size: 40px;
    margin-bottom: 5px;
}

.item-name {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
}

.item-desc {
    font-size: 14px;
    color: #a0a0a0;
    margin: 5px 0;
}

.item-price {
    font-size: 16px;
    color: #f9a825;
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
