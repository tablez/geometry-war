/**
 * 游戏状态管理
 * 使用 Vue3 Composition API 风格
 */

import { reactive, readonly } from 'vue';
import { CLASSES, GAME_CONFIG } from '../static/game-config.js';
import { WARRIOR_CARDS } from '../static/cards-complete.js';

// 游戏状态
const state = reactive({
    // 玩家信息
    player: {
        classId: null,
        hp: 0,
        maxHp: 0,
        energy: 0,
        maxEnergy: 0,
        block: 0,
        // 状态效果
        statusEffects: {
            strength: 0,    // 力量
            dexterity: 0,   // 敏捷
            vulnerable: 0,  // 易伤（回合数）
            weak: 0,        // 虚弱（回合数）
            poison: 0,      // 中毒层数
            regen: 0        // 再生层数
        }
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
        cards: [],
        upgradedCards: [] // 已升级的卡牌
    }
});

// 游戏操作方法
const actions = {
    // 初始化新游戏
    initGame(classId) {
        // 支持大小写
        const upperClassId = classId.toUpperCase();
        const classData = CLASSES[upperClassId];
        
        console.log('初始化游戏:', classId, '找到职业:', !!classData);
        
        if (!classData) {
            console.error('未找到职业:', classId, '可用职业:', Object.keys(CLASSES));
            return false;
        }
        
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
        const cardId = state.hand[cardIndex];
        const card = WARRIOR_CARDS[cardId];
        
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
        // 自我伤害（卖血机制）
        if (card.selfDamage) {
            state.player.hp -= card.selfDamage;
        }
        
        // 获得能量
        if (card.energy) {
            state.player.energy += card.energy;
        }
        
        // 攻击效果
        if (card.damage) {
            const hits = card.hits || 1;
            for (let i = 0; i < hits; i++) {
                if (targetIndex !== null && state.enemies[targetIndex]) {
                    let damage = card.damage;
                    
                    // 力量加成
                    if (state.player.statusEffects.strength > 0) {
                        const multiplier = card.strengthMultiplier || 1;
                        damage += state.player.statusEffects.strength * multiplier;
                    }
                    
                    // 虚弱减伤（玩家虚弱）
                    if (state.player.statusEffects.weak > 0) {
                        damage = Math.floor(damage * 0.75);
                    }
                    
                    this.damageEnemy(targetIndex, damage);
                } else if (card.aoe) {
                    // AOE伤害
                    state.enemies.forEach((enemy, idx) => {
                        let damage = card.damage;
                        if (state.player.statusEffects.strength > 0) {
                            damage += state.player.statusEffects.strength;
                        }
                        this.damageEnemy(idx, damage);
                    });
                }
            }
        }
        
        // 防御效果
        if (card.block) {
            let block = card.block;
            // 敏捷加成
            if (state.player.statusEffects.dexterity > 0) {
                block += state.player.statusEffects.dexterity;
            }
            state.player.block += block;
        }
        
        // 治疗效果
        if (card.heal) {
            this.healPlayer(card.heal);
        }
        
        // 抽牌效果
        if (card.draw) {
            this.drawCards(card.draw);
        }
        
        // 给予敌人易伤
        if (card.vulnerable && targetIndex !== null) {
            state.enemies[targetIndex].vulnerable = card.vulnerable;
        }
        
        // 获得力量
        if (card.strength) {
            state.player.statusEffects.strength += card.strength;
        }
        
        // 获得敏捷
        if (card.dexterity) {
            state.player.statusEffects.dexterity += card.dexterity;
        }
        
        // 消耗效果（移出本场战斗）
        if (card.exhaust) {
            const cardIndex = state.discard.indexOf(card.id);
            if (cardIndex > -1) {
                const exhaustedCard = state.discard.splice(cardIndex, 1)[0];
                state.exhaust.push(exhaustedCard);
            }
        }
        
        // 给予所有敌人虚弱
        if (card.weakAll) {
            state.enemies.forEach(enemy => {
                enemy.weak = (enemy.weak || 0) + card.weakAll;
            });
        }
        
        // 给予所有敌人易伤
        if (card.vulnerableAll) {
            state.enemies.forEach(enemy => {
                enemy.vulnerable = (enemy.vulnerable || 0) + card.vulnerableAll;
            });
        }
        
        // 敌人失去力量
        if (card.strengthDown) {
            state.enemies.forEach(enemy => {
                enemy.strength = Math.max(0, (enemy.strength || 0) - card.strengthDown);
            });
        }
        
        // 护甲翻倍
        if (card.doubleBlock) {
            state.player.block *= 2;
        }
        
        // 力量翻倍
        if (card.doubleStrength) {
            state.player.statusEffects.strength *= 2;
        }
        
        // 虚无效果（回合结束丢弃）
        if (card.ethereal) {
            // 标记为虚无，在 endTurn 中处理
        }
        
        // 固有效果（开局在手牌）
        if (card.innate) {
            // 在抽牌时处理
        }
        
        // 伤口牌（负面）
        if (card.id === 'wound') {
            // 无法打出，直接丢弃
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
        
        // 处理状态效果
        this.processStatusEffects();
        
        // 开始新回合
        state.turn++;
        state.player.energy = state.player.maxEnergy;
        
        // 护甲是否保留（检查壁垒能力）
        // TODO: 检查是否有 barricade 能力
        state.player.block = 0;
        
        // 减少临时状态持续时间
        if (state.player.statusEffects.vulnerable > 0) {
            state.player.statusEffects.vulnerable--;
        }
        if (state.player.statusEffects.weak > 0) {
            state.player.statusEffects.weak--;
        }
        this.drawCards(GAME_CONFIG.STARTING_DRAW);
    },
    
    // 敌人行动
    enemyActions() {
        state.enemies.forEach((enemy, index) => {
            // 敌人中毒伤害
            if (enemy.poison > 0) {
                enemy.hp -= enemy.poison;
                enemy.poison--;
            }
            
            // 检查敌人死亡（中毒）
            if (enemy.hp <= 0) {
                this.handleEnemyDeath(index);
                return;
            }
            
            // 执行敌人特殊能力
            this.executeEnemyAbility(enemy, index);
            
            // 重新检查死亡（能力可能造成伤害）
            if (enemy.hp <= 0) {
                this.handleEnemyDeath(index);
                return;
            }
            
            // 计算伤害
            let damage = enemy.damage || 5;
            
            // 敌人虚弱（造成更少伤害）
            if (enemy.weak > 0) {
                damage = Math.floor(damage * 0.75);
            }
            
            // 更新下回合意图
            enemy.nextAction = `攻击 ⚔️${damage}`;
            
            // 先扣玩家护甲
            if (state.player.block > 0) {
                const blockDamage = Math.min(state.player.block, damage);
                state.player.block -= blockDamage;
                damage -= blockDamage;
            }
            
            // 再扣玩家血量
            if (damage > 0) {
                state.player.hp -= damage;
                
                // 触发玩家受伤效果（如破裂）
                this.onPlayerDamaged();
            }
            
            // 减少敌人状态持续时间
            if (enemy.vulnerable > 0) enemy.vulnerable--;
            if (enemy.weak > 0) enemy.weak--;
        });
    },
    
    // 执行敌人特殊能力
    executeEnemyAbility(enemy, index) {
        if (!enemy.special) return;
        
        switch (enemy.special) {
            case 'split':
                // 史莱姆分裂：血量低于50%时分裂
                if (enemy.hp < enemy.maxHp * 0.5 && !enemy.hasSplit) {
                    enemy.hasSplit = true;
                    // 创建两个小史莱姆
                    const babySlime = {
                        ...enemy,
                        hp: Math.floor(enemy.maxHp * 0.3),
                        maxHp: Math.floor(enemy.maxHp * 0.3),
                        damage: Math.floor(enemy.damage * 0.5),
                        special: null
                    };
                    state.enemies.push(babySlime);
                }
                break;
                
            case 'summon':
                // 哥布林召唤：每3回合召唤一个小怪
                if (state.turn % 3 === 0) {
                    const goblin = {
                        name: '哥布林小弟',
                        icon: '👶',
                        hp: 15,
                        maxHp: 15,
                        damage: 3,
                        color: '#8BC34A'
                    };
                    state.enemies.push(goblin);
                }
                break;
                
            case 'revive':
                // 骷髅复活：死亡时复活一次
                // 在 handleEnemyDeath 中处理
                break;
                
            case 'armor':
                // 高护甲敌人：每回合获得护甲
                enemy.block = (enemy.block || 0) + 5;
                break;
                
            case 'rage':
                // 狂暴：血量低于30%时伤害翻倍
                if (enemy.hp < enemy.maxHp * 0.3) {
                    enemy.damage = Math.floor(enemy.damage * 1.5);
                }
                break;
        }
    },
    
    // 处理敌人死亡
    handleEnemyDeath(index) {
        const enemy = state.enemies[index];
        
        // 检查复活
        if (enemy.special === 'revive' && !enemy.hasRevived) {
            enemy.hasRevived = true;
            enemy.hp = Math.floor(enemy.maxHp * 0.5);
            return; // 不删除，复活
        }
        
        // 删除敌人
        state.enemies.splice(index, 1);
        
        // 触发击杀效果（如吞噬）
        // TODO: 实现击杀效果
    },
    
    // 玩家受伤时触发的效果
    onPlayerDamaged() {
        // 破裂：受伤时获得力量
        // TODO: 检查是否有破裂能力
    },
    
    // 处理状态效果
    processStatusEffects() {
        // 再生回血
        if (state.player.statusEffects.regen > 0) {
            this.healPlayer(state.player.statusEffects.regen);
        }
        
        // 中毒伤害
        if (state.player.statusEffects.poison > 0) {
            state.player.hp -= state.player.statusEffects.poison;
        }
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
