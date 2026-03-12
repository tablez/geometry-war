<template>
    <view class="container">
        <!-- 顶部信息 -->
        <view class="top-bar">
            <view class="floor-info">
                <text class="floor-number">第 {{ currentFloor }} 层</text>
                <text class="floor-type">{{ floorTypeText }}</text>
            </view>
            <view class="player-stats">
                <text>❤️ {{ player.hp }}/{{ player.maxHp }}</text>
                <text>💰 {{ gold }}</text>
            </view>
        </view>
        
        <!-- 地图可视化 -->
        <view class="map-container">
            <view class="map-path">
                <view 
                    v-for="n in 10" 
                    :key="n"
                    class="map-node"
                    :class="{ 
                        current: n === 1,
                        passed: n < 1,
                        boss: isBossFloor(currentFloor + n - 1)
                    }"
                >
                    <text class="node-icon">{{ getNodeIcon(currentFloor + n - 1) }}</text>
                    <text class="node-floor">{{ currentFloor + n - 1 }}</text>
                </view>
            </view>
        </view>
        
        <!-- 当前层信息 -->
        <view class="floor-detail">
            <view class="enemy-preview" v-if="floorType === 'normal' || floorType === 'elite' || floorType === 'boss'">
                <text class="preview-title">敌人预览</text>
                <view class="enemies-list">
                    <view v-for="(enemy, index) in previewEnemies" :key="index" class="preview-enemy">
                        <text class="enemy-icon">{{ enemy.icon }}</text>
                        <text class="enemy-name">{{ enemy.name }}</text>
                        <text class="enemy-hp">{{ enemy.hp }} HP</text>
                    </view>
                </view>
            </view>
            
            <view class="rest-preview" v-if="floorType === 'rest'">
                <text class="preview-title">休息处</text>
                <text class="rest-desc">可以回复生命或升级卡牌</text>
            </view>
            
            <view class="shop-preview" v-if="floorType === 'shop'">
                <text class="preview-title">商店</text>
                <text class="shop-desc">购买卡牌和遗物</text>
            </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="action-bar">
            <button class="enter-btn" @click="enterFloor">
                {{ getEnterButtonText() }}
            </button>
        </view>
        
        <!-- 卡组信息 -->
        <view class="deck-info">
            <text>卡组: {{ deck.length }} 张</text>
            <view class="deck-cards">
                <text v-for="(card, idx) in deck.slice(0, 5)" :key="idx" class="deck-card">
                    {{ getCardName(card) }}
                </text>
                <text v-if="deck.length > 5">...</text>
            </view>
        </view>
    </view>
</template>

<script>
import { gameState, gameActions } from '../../store/gameStore.js'
import { 
    getFloorType, 
    generateFloorEnemies, 
    calculateEnemyStats,
    TOWER_CONFIG 
} from '../../static/tower-config.js'
import { getCard } from '../../static/cards-complete.js'

export default {
    data() {
        return {
            currentFloor: 1,
            floorType: 'normal',
            previewEnemies: [],
            gold: 0
        }
    },
    computed: {
        player() {
            return gameState.player
        },
        deck() {
            return gameState.deck
        },
        floorTypeText() {
            const texts = {
                normal: '普通战斗',
                elite: '精英战斗',
                boss: 'BOSS战',
                rest: '休息处',
                shop: '商店'
            }
            return texts[this.floorType] || '未知'
        }
    },
    onLoad() {
        // 初始化地图
        this.currentFloor = gameState.currentRun?.floor || 1
        this.gold = gameState.currentRun?.gold || 0
        this.generateFloor()
    },
    methods: {
        // 生成当前楼层
        generateFloor() {
            this.floorType = getFloorType(this.currentFloor)
            
            // 生成敌人预览
            if (this.floorType === 'normal' || this.floorType === 'elite' || this.floorType === 'boss') {
                this.previewEnemies = generateFloorEnemies(this.currentFloor, this.floorType)
            }
        },
        
        // 判断是否是BOSS层
        isBossFloor(floor) {
            return TOWER_CONFIG.bossFloors.includes(floor)
        },
        
        // 获取节点图标
        getNodeIcon(floor) {
            const type = getFloorType(floor)
            const icons = {
                normal: '⚔️',
                elite: '👹',
                boss: '👿',
                rest: '🏕️',
                shop: '🏪'
            }
            return icons[type] || '❓'
        },
        
        // 获取进入按钮文字
        getEnterButtonText() {
            const texts = {
                normal: '进入战斗',
                elite: '挑战精英',
                boss: '挑战BOSS',
                rest: '进入休息',
                shop: '进入商店'
            }
            return texts[this.floorType] || '进入'
        },
        
        // 获取卡牌名称
        getCardName(cardId) {
            const card = getCard(cardId)
            return card ? card.name : cardId
        },
        
        // 进入楼层
        enterFloor() {
            // 保存当前楼层
            gameState.currentRun.floor = this.currentFloor
            
            if (this.floorType === 'rest') {
                // 进入休息处
                uni.navigateTo({ url: '/pages/rest/rest' })
            } else if (this.floorType === 'shop') {
                // 进入商店
                uni.navigateTo({ url: '/pages/shop/shop' })
            } else {
                // 进入战斗
                // 设置敌人
                gameState.enemies = this.previewEnemies.map(e => ({
                    ...e,
                    currentHp: e.hp,
                    block: 0,
                    vulnerable: 0,
                    weak: 0,
                    poison: 0
                }))
                
                uni.navigateTo({ url: '/pages/game/game' })
            }
        }
    }
}
</script>

<style scoped>
.container {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 20px;
}

/* 顶部信息栏 */
.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    margin-bottom: 20px;
}

.floor-info {
    display: flex;
    flex-direction: column;
}

.floor-number {
    font-size: 24px;
    font-weight: bold;
    color: #e94560;
}

.floor-type {
    font-size: 14px;
    color: #a0a0a0;
}

.player-stats {
    display: flex;
    gap: 20px;
    font-size: 16px;
}

/* 地图 */
.map-container {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
}

.map-path {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.map-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    opacity: 0.5;
}

.map-node.current {
    opacity: 1;
    background: rgba(233, 69, 96, 0.3);
    border: 2px solid #e94560;
}

.map-node.passed {
    opacity: 0.3;
}

.map-node.boss {
    background: rgba(156, 39, 176, 0.3);
}

.node-icon {
    font-size: 32px;
    margin-bottom: 5px;
}

.node-floor {
    font-size: 12px;
    color: #a0a0a0;
}

/* 楼层详情 */
.floor-detail {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    min-height: 150px;
}

.preview-title {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 15px;
    display: block;
}

.enemies-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.preview-enemy {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.enemy-icon {
    font-size: 24px;
}

.enemy-name {
    flex: 1;
    font-size: 16px;
    color: #fff;
}

.enemy-hp {
    font-size: 14px;
    color: #e94560;
}

.rest-desc, .shop-desc {
    font-size: 16px;
    color: #a0a0a0;
    text-align: center;
    padding: 20px;
}

/* 操作按钮 */
.action-bar {
    margin-bottom: 20px;
}

.enter-btn {
    width: 100%;
    height: 56px;
    background: linear-gradient(135deg, #e94560 0%, #533483 100%);
    color: #fff;
    border: none;
    border-radius: 28px;
    font-size: 20px;
    font-weight: bold;
}

.enter-btn:active {
    opacity: 0.8;
}

/* 卡组信息 */
.deck-info {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 15px;
}

.deck-info > text {
    font-size: 16px;
    color: #fff;
    margin-bottom: 10px;
    display: block;
}

.deck-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.deck-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    color: #a0a0a0;
}
</style>
