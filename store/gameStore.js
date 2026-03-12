/**
 * 游戏状态管理
 * 使用 Vue3 Composition API 风格
 */

import { reactive, readonly } from 'vue';

// 游戏状态
const state = reactive({
    // 玩家信息
    player: {
        classId: null,
        hp: 0,
        maxHp: 0,
        energy: 0,
        maxEnergy: 0,
        block: 0
    },
    
    // 卡组
    deck: [],
    hand: [],
    discard: [],
    exhaust: [],
    
    // 战斗状态
    inBattle: false,
    turn: 1,
    enemies: [],
    
    // 游戏进度
    gamesPlayed: 0,
    bestScore: 0,
    currentRun: {
        floor: 1,
        gold: 0,
        cards: []
    }
});

// 游戏操作方法
const actions = {
    // 初始化新游戏
    initGame(classId) {
        const { CLASSES } = require('../static/game-config.js');
        const classData = CLASSES[classId.toUpperCase()];
        if (!classData) return false;
        
        // 设置玩家属性
        state.player.classId = classId;
        state.player.hp = classData.baseHp;
        state.player.maxHp = classData.baseHp;
        state.player.energy = classData.baseEnergy;
        state.player.maxEnergy = classData.baseEnergy;
        state.player.block = 0;
        
        // 初始化卡组
        state.deck = [...classData.startingDeck];
        state.hand = [];
        state.discard = [];
        state.exhaust = [];
        
        // 重置战斗状态
        state.inBattle = false;
        state.turn = 1;
        state.enemies = [];
        
        // 重置进度
        state.currentRun = {
            floor: 1,
            gold: 0,
            cards: [...classData.startingDeck]
        };
        
        return true;
    },
    
    // 抽牌
    drawCards(count) {
        const { GAME_CONFIG } = require('../static/game-config.js');
        for (let i = 0; i < count; i++) {
            // 如果手牌满了，停止抽牌
            if (state.hand.length >= GAME_CONFIG.MAX_HAND_SIZE) break;
            
            // 如果卡组空了，洗墓地
            if (state.deck.length === 0) {
                if (state.discard.length === 0) break;
                state.deck = shuffle([...state.discard]);
                state.discard = [];
            }
            
            // 抽一张牌
            const card = state.deck.pop();
            state.hand.push(card);
        }
    },
    
    // 出牌
    playCard(cardIndex, targetIndex = null) {
        const { CARDS } = require('../static/game-config.js');
        const cardId = state.hand[cardIndex];
        const card = CARDS[cardId];
        
        if (!card) return false;
        if (card.cost > state.player.energy) return false;
        
        // 消耗能量
        state.player.energy -= card.cost;
        
        // 执行卡牌效果
        this.executeCardEffect(card, targetIndex);
        
        // 移入手牌到弃牌堆
        state.hand.splice(cardIndex, 1);
        state.discard.push(cardId);
        
        return true;
    },
    
    // 执行卡牌效果
    executeCardEffect(card, targetIndex) {
        // 攻击效果
        if (card.damage) {
            const hits = card.hits || 1;
            for (let i = 0; i < hits; i++) {
                if (targetIndex !== null && state.enemies[targetIndex]) {
                    this.damageEnemy(targetIndex, card.damage);
                }
            }
        }
        
        // 防御效果
        if (card.block) {
            state.player.block += card.block;
        }
        
        // 治疗效果
        if (card.heal) {
            this.healPlayer(card.heal);
        }
        
        // 抽牌效果
        if (card.draw) {
            this.drawCards(card.draw);
        }
    },
    
    // 对敌人造成伤害
    damageEnemy(index, damage) {
        const enemy = state.enemies[index];
        if (!enemy) return;
        
        // 先扣护甲
        if (enemy.block > 0) {
            const blockDamage = Math.min(enemy.block, damage);
            enemy.block -= blockDamage;
            damage -= blockDamage;
        }
        
        // 再扣血
        enemy.hp -= damage;
        
        // 检查死亡
        if (enemy.hp <= 0) {
            state.enemies.splice(index, 1);
        }
    },
    
    // 治疗玩家
    healPlayer(amount) {
        state.player.hp = Math.min(
            state.player.hp + amount,
            state.player.maxHp
        );
    },
    
    // 结束回合
    endTurn() {
        // 弃掉所有手牌
        state.discard.push(...state.hand);
        state.hand = [];
        
        // 敌人行动
        this.enemyActions();
        
        // 开始新回合
        state.turn++;
        state.player.energy = state.player.maxEnergy;
        state.player.block = 0;
        this.drawCards(GAME_CONFIG.STARTING_DRAW);
    },
    
    // 敌人行动
    enemyActions() {
        state.enemies.forEach(enemy => {
            // 简单AI：直接攻击玩家
            const damage = enemy.damage || 5;
            
            // 先扣玩家护甲
            if (state.player.block > 0) {
                const blockDamage = Math.min(state.player.block, damage);
                state.player.block -= blockDamage;
                damage -= blockDamage;
            }
            
            // 再扣玩家血量
            state.player.hp -= damage;
        });
    },
    
    // 保存游戏数据
    saveGameData() {
        const data = {
            gamesPlayed: state.gamesPlayed,
            bestScore: state.bestScore
        };
        uni.setStorageSync('gameData', data);
    },
    
    // 加载游戏数据
    loadGameData() {
        const data = uni.getStorageSync('gameData');
        if (data) {
            state.gamesPlayed = data.gamesPlayed || 0;
            state.bestScore = data.bestScore || 0;
        }
    }
};

// 工具函数：洗牌
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 导出只读状态和操作方法
export const gameState = readonly(state);
export const gameActions = actions;
