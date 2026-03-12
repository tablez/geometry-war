<template>
    <view 
        class="card"
        :class="{ 
            playable: canPlay, 
            selected: isSelected,
            unplayable: !canPlay 
        }"
        :style="cardStyle"
        @click="onClick"
    >
        <!-- 费用 -->
        <view class="card-cost" :class="{ unaffordable: !canPlay }">
            <text>{{ displayCost }}</text>
        </view>
        
        <!-- 类型标记 -->
        <view class="card-type-badge" :style="{ backgroundColor: typeColor }">
            <text>{{ typeIcon }}</text>
        </view>
        
        <!-- 主内容 -->
        <view class="card-content">
            <text class="card-icon">{{ cardData.icon }}</text>
            <text class="card-name">{{ cardData.name }}</text>
            
            <!-- 效果预览 -->
            <view class="card-effects">
                <text v-if="cardData.damage" class="effect damage">
                    ⚔️ {{ calculatedDamage }}
                </text>
                <text v-if="cardData.block" class="effect block">
                    🛡️ {{ calculatedBlock }}
                </text>
                <text v-if="cardData.draw" class="effect draw">
                    📥 {{ cardData.draw }}
                </text>
                <text v-if="cardData.heal" class="effect heal">
                    💚 {{ cardData.heal }}
                </text>
            </view>
        </view>
        
        <!-- 描述 -->
        <view class="card-desc">
            <text>{{ cardData.description }}</text>
        </view>
        
        <!-- 升级标记 -->
        <view v-if="cardData.upgraded" class="upgrade-badge">
            <text>+</text>
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
                power: '⚡',
                curse: '💀'
            }
            return icons[this.cardData.type] || '🃏'
        },
        typeColor() {
            const colors = {
                attack: '#e94560',
                skill: '#16c79a',
                power: '#f9a825',
                curse: '#9e9e9e'
            }
            return colors[this.cardData.type] || '#666'
        },
        cardStyle() {
            return {
                borderColor: this.typeColor
            }
        },
        displayCost() {
            // X费显示为 X
            if (this.cardData.cost === 'X') return 'X'
            return this.cardData.cost
        },
        calculatedDamage() {
            let damage = this.cardData.damage || 0
            // 力量加成
            // TODO: 从游戏状态获取力量值
            return damage
        },
        calculatedBlock() {
            let block = this.cardData.block || 0
            // 敏捷加成
            // TODO: 从游戏状态获取敏捷值
            return block
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
    width: 110px;
    height: 160px;
    background: linear-gradient(145deg, #1e1e3a 0%, #151530 100%);
    border: 2px solid #444;
    border-radius: 10px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all 0.15s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.card.playable {
    cursor: pointer;
}

.card.playable:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
}

.card.playable:active {
    transform: scale(0.96) translateY(-2px);
}

.card.selected {
    transform: translateY(-15px) scale(1.05);
    box-shadow: 0 10px 30px rgba(233, 69, 96, 0.5);
    z-index: 10;
}

.card.unplayable {
    opacity: 0.5;
    filter: grayscale(0.5);
}

/* 费用显示 */
.card-cost {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 26px;
    height: 26px;
    background: linear-gradient(135deg, #1a5f9e 0%, #0f3460 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #2980b9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-cost text {
    color: #fff;
    font-weight: bold;
    font-size: 14px;
}

.card-cost.unaffordable {
    background: linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%);
    border-color: #dc2626;
}

/* 类型徽章 */
.card-type-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 主内容 */
.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.card-icon {
    font-size: 40px;
    margin-bottom: 4px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.card-name {
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    text-align: center;
    margin-bottom: 6px;
}

/* 效果预览 */
.card-effects {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
}

.effect {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: bold;
}

.effect.damage {
    background: rgba(233, 69, 96, 0.2);
    color: #e94560;
}

.effect.block {
    background: rgba(22, 199, 154, 0.2);
    color: #16c79a;
}

.effect.draw {
    background: rgba(249, 168, 37, 0.2);
    color: #f9a825;
}

.effect.heal {
    background: rgba(139, 195, 74, 0.2);
    color: #8bc34a;
}

/* 描述 */
.card-desc {
    margin-top: auto;
    padding: 4px;
}

.card-desc text {
    font-size: 9px;
    color: #888;
    text-align: center;
    line-height: 1.3;
    display: block;
}

/* 升级标记 */
.upgrade-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #f9a825 0%, #f57f17 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.upgrade-badge text {
    color: #fff;
    font-weight: bold;
    font-size: 14px;
}
</style>
