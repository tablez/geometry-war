<template>
    <view class="game-container">
        <!-- 顶部信息栏 -->
        <view class="top-bar">
            <view class="player-info">
                <text class="hp">❤️ {{ player.hp }}/{{ player.maxHp }}</text>
                <text class="energy">⚡ {{ player.energy }}/{{ player.maxEnergy }}</text>
                <text class="block" v-if="player.block > 0">🛡️ {{ player.block }}</text>
            </view>
            <view class="turn-info">
                <text>回合 {{ turn }}</text>
            </view>
        </view>
        
        <!-- 敌人区域 -->
        <view class="enemy-area">
            <view 
                v-for="(enemy, index) in enemies" 
                :key="index"
                class="enemy"
                :class="{ target: selectedTarget === index }"
                @click="selectTarget(index)"
            >
                <view class="enemy-icon" :style="{ backgroundColor: enemy.color }">
                    <text>{{ enemy.icon }}</text>
                </view>
                <view class="enemy-hp-bar">
                    <view class="hp-fill" :style="{ width: (enemy.hp / enemy.maxHp * 100) + '%' }"></view>
                </view>
                <text class="enemy-name">{{ enemy.name }}</text>
                <text class="enemy-intent">{{ enemy.nextAction }}</text>
            </view>
        </view>
        
        <!-- 手牌区域 -->
        <view class="hand-area">
            <view class="hand-label">手牌 ({{ hand.length }}/10)</view>
            <scroll-view class="hand-scroll" scroll-x>
                <view class="hand-cards">
                    <Card 
                        v-for="(cardId, index) in hand" 
                        :key="index"
                        :card-id="cardId"
                        :can-play="canPlayCard(cardId)"
                        :is-selected="selectedCard === index"
                        @click="onCardClick(index)"
                    />
                </view>
            </scroll-view>
        </view>
        
        <!-- 底部操作栏 -->
        <view class="action-bar">
            <view class="deck-info">
                <text>牌库: {{ deck.length }}</text>
                <text>弃牌: {{ discard.length }}</text>
            </view>
            <button class="end-turn-btn" @click="endTurn">结束回合</button>
        </view>
        
        <!-- 战斗日志 -->
        <view class="battle-log" v-if="logMessages.length > 0">
            <view v-for="(msg, index) in logMessages.slice(-3)" :key="index" class="log-msg">
                {{ msg }}
            </view>
        </view>
    </view>
</template>

<script>
import Card from '../../components/Card.vue'
import { gameState, gameActions } from '../../store/gameStore.js'
import { ENEMIES } from '../../static/game-config.js'

export default {
    components: { Card },
    data() {
        return {
            selectedCard: -1,
            selectedTarget: -1,
            logMessages: []
        }
    },
    computed: {
        player() {
            return gameState.player
        },
        hand() {
            return gameState.hand
        },
        deck() {
            return gameState.deck
        },
        discard() {
            return gameState.discard
        },
        enemies() {
            return gameState.enemies
        },
        turn() {
            return gameState.turn
        }
    },
    onLoad() {
        // 初始化战斗
        this.initBattle()
    },
    methods: {
        // 初始化战斗
        initBattle() {
            // 生成敌人
            const enemyTypes = ['slime', 'goblin', 'slime']
            gameState.enemies = enemyTypes.map(type => {
                const template = ENEMIES[type]
                return {
                    ...template,
                    maxHp: template.hp,
                    block: 0,
                    nextAction: '攻击'
                }
            })
            
            // 开始第一回合
            gameActions.drawCards(5)
            this.addLog('战斗开始！')
        },
        
        // 检查能否出牌
        canPlayCard(cardId) {
            const card = this.getCardData(cardId)
            return card && card.cost <= this.player.energy
        },
        
        // 获取卡牌数据
        getCardData(cardId) {
            const { CARDS } = require('../../static/game-config.js')
            return CARDS[cardId]
        },
        
        // 点击卡牌
        onCardClick(index) {
            const cardId = this.hand[index]
            const card = this.getCardData(cardId)
            
            if (!this.canPlayCard(cardId)) {
                uni.showToast({ title: '能量不足', icon: 'none' })
                return
            }
            
            // 攻击牌需要选择目标
            if (card.type === 'attack') {
                if (this.selectedCard === index) {
                    // 已经选中，检查是否选了目标
                    if (this.selectedTarget >= 0) {
                        this.playCard(index, this.selectedTarget)
                    } else {
                        uni.showToast({ title: '请选择目标', icon: 'none' })
                    }
                } else {
                    this.selectedCard = index
                    this.selectedTarget = -1
                }
            } else {
                // 非攻击牌直接打出
                this.playCard(index)
            }
        },
        
        // 选择目标
        selectTarget(index) {
            if (this.selectedCard >= 0) {
                this.selectedTarget = index
                this.playCard(this.selectedCard, index)
            }
        },
        
        // 出牌
        playCard(cardIndex, targetIndex = null) {
            const cardId = this.hand[cardIndex]
            const card = this.getCardData(cardId)
            
            // 执行出牌
            const success = gameActions.playCard(cardIndex, targetIndex)
            
            if (success) {
                this.addLog(`使用了 ${card.name}`)
                
                // 重置选择
                this.selectedCard = -1
                this.selectedTarget = -1
                
                // 检查战斗结束
                this.checkBattleEnd()
            }
        },
        
        // 结束回合
        endTurn() {
            this.addLog('结束回合')
            gameActions.endTurn()
            
            // 检查玩家死亡
            if (this.player.hp <= 0) {
                this.gameOver(false)
            }
        },
        
        // 检查战斗结束
        checkBattleEnd() {
            if (this.enemies.length === 0) {
                this.gameOver(true)
            }
        },
        
        // 游戏结束
        gameOver(victory) {
            if (victory) {
                // 判断战斗类型
                const floorType = this.getBattleType()
                
                uni.showToast({
                    title: '战斗胜利！',
                    icon: 'success',
                    duration: 1000
                })
                
                // 延迟后跳转到奖励页面
                setTimeout(() => {
                    uni.navigateTo({
                        url: `/pages/reward/reward?type=${floorType}`
                    })
                }, 1000)
            } else {
                // 游戏结束，返回首页
                uni.showModal({
                    title: '游戏结束',
                    content: `你到达了第 ${gameState.currentRun.floor} 层`,
                    showCancel: false,
                    success: () => {
                        // 更新最佳记录
                        if (gameState.currentRun.floor > gameState.bestScore) {
                            gameState.bestScore = gameState.currentRun.floor
                        }
                        gameState.gamesPlayed++
                        gameActions.saveGameData()
                        
                        // 返回首页
                        uni.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                })
            }
        },
        
        // 获取战斗类型
        getBattleType() {
            const floor = gameState.currentRun.floor
            if (floor % 10 === 0) return 'boss'
            // 简单判断：精英敌人血量>50视为精英战
            const hasElite = gameState.enemies.some(e => e.maxHp > 50)
            return hasElite ? 'elite' : 'normal'
        },
        
        // 添加战斗日志
        addLog(msg) {
            this.logMessages.push(msg)
            if (this.logMessages.length > 10) {
                this.logMessages.shift()
            }
        }
    }
}
</script>

<style scoped>
.game-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    display: flex;
    flex-direction: column;
    padding: 10px;
}

/* 顶部信息栏 */
.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    margin-bottom: 10px;
}

.player-info {
    display: flex;
    gap: 15px;
}

.player-info text {
    font-size: 16px;
    font-weight: bold;
}

.turn-info {
    font-size: 18px;
    color: #e94560;
}

/* 敌人区域 */
.enemy-area {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    padding: 20px;
}

.enemy {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    border: 2px solid transparent;
    transition: all 0.2s;
}

.enemy.target {
    border-color: #e94560;
    transform: scale(1.1);
}

.enemy-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    margin-bottom: 10px;
}

.enemy-hp-bar {
    width: 100px;
    height: 8px;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 5px;
}

.hp-fill {
    height: 100%;
    background: #e94560;
    transition: width 0.3s;
}

.enemy-name {
    font-size: 14px;
    color: #fff;
    margin-bottom: 5px;
}

.enemy-intent {
    font-size: 12px;
    color: #f9a825;
}

/* 手牌区域 */
.hand-area {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 10px;
}

.hand-label {
    font-size: 14px;
    color: #a0a0a0;
    margin-bottom: 10px;
}

.hand-scroll {
    white-space: nowrap;
}

.hand-cards {
    display: flex;
    gap: 10px;
    padding: 10px 0;
}

/* 底部操作栏 */
.action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
}

.deck-info {
    display: flex;
    gap: 15px;
    font-size: 14px;
    color: #a0a0a0;
}

.end-turn-btn {
    background: linear-gradient(135deg, #e94560 0%, #533483 100%);
    color: #fff;
    border: none;
    padding: 12px 30px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: bold;
}

.end-turn-btn:active {
    opacity: 0.8;
}

/* 战斗日志 */
.battle-log {
    position: fixed;
    top: 100px;
    left: 10px;
    right: 10px;
    pointer-events: none;
}

.log-msg {
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 8px 15px;
    border-radius: 4px;
    margin-bottom: 5px;
    font-size: 14px;
    text-align: center;
    animation: fadeIn 0.3s;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
