<template>
    <view 
        class="card"
        :class="{ playable: canPlay, selected: isSelected }"
        :style="cardStyle"
        @click="onClick"
    >
        <view class="card-header">
            <text class="card-cost">{{ cardData.cost }}</text>
            <text class="card-type">{{ typeIcon }}</text>
        </view>
        
        <view class="card-body">
            <text class="card-icon">{{ cardData.icon }}</text>
            <text class="card-name">{{ cardData.name }}</text>
        </view>
        
        <view class="card-footer">
            <text class="card-desc">{{ cardData.description }}</text>
        </view>
        
        <!-- 效果数值显示 -->
        <view v-if="cardData.damage" class="stat damage">
            <text>⚔️ {{ cardData.damage }}</text>
        </view>
        <view v-if="cardData.block" class="stat block">
            <text>🛡️ {{ cardData.block }}</text>
        </view>
    </view>
</template>

<script>
import { CARDS } from '../static/game-config.js'

export default {
    props: {
        cardId: {
            type: String,
            required: true
        },
        canPlay: {
            type: Boolean,
            default: true
        },
        isSelected: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        cardData() {
            return CARDS[this.cardId] || {}
        },
        typeIcon() {
            const icons = {
                attack: '⚔️',
                skill: '🛡️',
                power: '⚡'
            }
            return icons[this.cardData.type] || '🃏'
        },
        cardStyle() {
            const colors = {
                attack: '#e94560',
                skill: '#16c79a',
                power: '#f9a825'
            }
            return {
                borderColor: colors[this.cardData.type] || '#666'
            }
        }
    },
    methods: {
        onClick() {
            this.$emit('click', this.cardId)
        }
    }
}
</script>

<style scoped>
.card {
    width: 120px;
    height: 180px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 3px solid #666;
    border-radius: 12px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.card.playable {
    cursor: pointer;
}

.card.playable:active {
    transform: scale(0.95);
}

.card.selected {
    transform: translateY(-20px);
    box-shadow: 0 8px 24px rgba(233, 69, 96, 0.4);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    font-size: 16px;
}

.card-type {
    font-size: 20px;
}

.card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.card-icon {
    font-size: 48px;
    margin-bottom: 8px;
}

.card-name {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    text-align: center;
}

.card-footer {
    margin-top: auto;
}

.card-desc {
    font-size: 11px;
    color: #a0a0a0;
    text-align: center;
    line-height: 1.4;
}

.stat {
    position: absolute;
    bottom: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
}

.stat.damage {
    left: 8px;
    background: rgba(233, 69, 96, 0.3);
    color: #e94560;
}

.stat.block {
    right: 8px;
    background: rgba(22, 199, 154, 0.3);
    color: #16c79a;
}
</style>
