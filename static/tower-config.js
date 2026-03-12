/**
 * 爬塔系统配置
 * 无限爬塔，难度指数增长
 */

// 楼层配置
export const TOWER_CONFIG = {
    // 难度曲线参数
    difficulty: {
        baseHp: 20,           // 基础敌人血量
        baseDamage: 5,        // 基础敌人伤害
        hpGrowth: 1.08,       // 血量增长系数（每10层+8%）
        damageGrowth: 1.05,   // 伤害增长系数（每10层+5%）
        eliteMultiplier: 1.5, // 精英怪倍率
        bossMultiplier: 2.5   // BOSS倍率
    },
    
    // 楼层类型分布
    floorTypes: {
        normal: { weight: 70, minFloor: 1 },    // 普通战斗
        elite: { weight: 15, minFloor: 6 },     // 精英战斗
        rest: { weight: 10, minFloor: 1 },      // 休息处
        shop: { weight: 5, minFloor: 3 }        // 商店
    },
    
    // BOSS层
    bossFloors: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    
    // 奖励配置
    rewards: {
        normal: {
            gold: { min: 10, max: 20 },
            cardChoices: 3
        },
        elite: {
            gold: { min: 25, max: 45 },
            cardChoices: 5,
            relicChance: 0.3
        },
        boss: {
            gold: { min: 60, max: 100 },
            cardChoices: 5,
            relic: true,
            maxHp: 10
        }
    }
};

// 根据层数计算敌人属性
export function calculateEnemyStats(floor, isElite = false, isBoss = false) {
    const { baseHp, baseDamage, hpGrowth, damageGrowth, eliteMultiplier, bossMultiplier } = TOWER_CONFIG.difficulty;
    
    // 计算增长次数（每10层一个周期）
    const growthCycles = Math.floor((floor - 1) / 10);
    
    // 计算属性
    let hp = Math.floor(baseHp * Math.pow(hpGrowth, growthCycles) * (1 + (floor % 10) * 0.02));
    let damage = Math.floor(baseDamage * Math.pow(damageGrowth, growthCycles) * (1 + (floor % 10) * 0.015));
    
    // 应用倍率
    if (isElite) {
        hp = Math.floor(hp * eliteMultiplier);
        damage = Math.floor(damage * eliteMultiplier);
    }
    if (isBoss) {
        hp = Math.floor(hp * bossMultiplier);
        damage = Math.floor(damage * bossMultiplier);
    }
    
    return { hp, damage };
}

// 获取楼层类型
export function getFloorType(floor) {
    // BOSS层
    if (TOWER_CONFIG.bossFloors.includes(floor)) {
        return 'boss';
    }
    
    // 随机决定
    const types = ['normal', 'elite', 'rest', 'shop'];
    const weights = [
        TOWER_CONFIG.floorTypes.normal.weight,
        floor >= TOWER_CONFIG.floorTypes.elite.minFloor ? TOWER_CONFIG.floorTypes.elite.weight : 0,
        TOWER_CONFIG.floorTypes.rest.weight,
        floor >= TOWER_CONFIG.floorTypes.shop.minFloor ? TOWER_CONFIG.floorTypes.shop.weight : 0
    ];
    
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < types.length; i++) {
        random -= weights[i];
        if (random <= 0) return types[i];
    }
    
    return 'normal';
}

// 生成楼层敌人
export function generateFloorEnemies(floor, type = 'normal') {
    const enemies = [];
    const isElite = type === 'elite';
    const isBoss = type === 'boss';
    
    if (isBoss) {
        // BOSS层：单个强力BOSS
        const boss = generateBoss(floor);
        enemies.push(boss);
    } else if (isElite) {
        // 精英层：1个精英 + 1-2个小怪
        enemies.push(generateElite(floor));
        const extraCount = Math.random() > 0.5 ? 2 : 1;
        for (let i = 0; i < extraCount; i++) {
            enemies.push(generateNormalEnemy(floor));
        }
    } else {
        // 普通层：2-3个小怪
        const count = Math.random() > 0.7 ? 3 : 2;
        for (let i = 0; i < count; i++) {
            enemies.push(generateNormalEnemy(floor));
        }
    }
    
    return enemies;
}

// 生成普通敌人
function generateNormalEnemy(floor) {
    const { hp, damage } = calculateEnemyStats(floor);
    const types = ['slime', 'goblin', 'skeleton', 'bat', 'rat'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
        ...ENEMY_TEMPLATES[type],
        hp,
        maxHp: hp,
        damage,
        block: 0,
        vulnerable: 0,
        weak: 0,
        poison: 0
    };
}

// 生成精英敌人
function generateElite(floor) {
    const { hp, damage } = calculateEnemyStats(floor, true);
    const types = ['elite_slime', 'goblin_champion', 'skeleton_knight'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
        ...ENEMY_TEMPLATES[type],
        hp,
        maxHp: hp,
        damage,
        block: 0,
        vulnerable: 0,
        weak: 0,
        poison: 0
    };
}

// 生成BOSS
function generateBoss(floor) {
    const { hp, damage } = calculateEnemyStats(floor, false, true);
    const bossIndex = Math.floor((floor - 1) / 10) % 10;
    const bossTypes = [
        'slime_king',      // 10层
        'goblin_king',     // 20层
        'skeleton_general',// 30层
        'shadow_assassin', // 40层
        'elemental_mage',  // 50层
        'dragon',          // 60层
        'demon_lord',      // 70层
        'ancient_golem',   // 80层
        'void_walker',     // 90层
        'geometry_demon'   // 100层
    ];
    
    const type = bossTypes[bossIndex];
    
    return {
        ...ENEMY_TEMPLATES[type],
        hp,
        maxHp: hp,
        damage,
        block: 0,
        vulnerable: 0,
        weak: 0,
        poison: 0,
        isBoss: true
    };
}

// 敌人模板
export const ENEMY_TEMPLATES = {
    // 普通敌人
    slime: {
        id: 'slime',
        name: '史莱姆',
        icon: '🟢',
        color: '#4CAF50',
        description: '最基础的敌人',
        special: null
    },
    goblin: {
        id: 'goblin',
        name: '哥布林',
        icon: '👺',
        color: '#8BC34A',
        description: '狡猾的小偷',
        special: 'steal' // 偷金币
    },
    skeleton: {
        id: 'skeleton',
        name: '骷髅兵',
        icon: '💀',
        color: '#9E9E9E',
        description: '不死族的士兵',
        special: 'revive' // 复活一次
    },
    bat: {
        id: 'bat',
        name: '蝙蝠',
        icon: '🦇',
        color: '#607D8B',
        description: '快速但脆弱',
        special: 'evade' // 高闪避
    },
    rat: {
        id: 'rat',
        name: '巨鼠',
        icon: '🐀',
        color: '#795548',
        description: '携带疾病',
        special: 'poison' // 中毒攻击
    },
    
    // 精英敌人
    elite_slime: {
        id: 'elite_slime',
        name: '巨型史莱姆',
        icon: '🟩',
        color: '#2E7D32',
        description: '会分裂的史莱姆',
        special: 'split' // 分裂成2个小史莱姆
    },
    gobllin_champion: {
        id: 'goblin_champion',
        name: '哥布林勇士',
        icon: '👹',
        color: '#558B2F',
        description: '哥布林中的强者',
        special: 'rage' // 低血量时狂暴
    },
    skeleton_knight: {
        id: 'skeleton_knight',
        name: '骷髅骑士',
        icon: '🛡️',
        color: '#616161',
        description: '装备精良的骷髅',
        special: 'armor' // 高护甲
    },
    
    // BOSS
    slime_king: {
        id: 'slime_king',
        name: '史莱姆王',
        icon: '🟫',
        color: '#1B5E20',
        description: '史莱姆的王者，会分裂',
        special: 'split',
        pattern: 'split_at_50' // 50%血量时分裂
    },
    goblin_king: {
        id: 'goblin_king',
        name: '哥布林王',
        icon: '👑',
        color: '#33691E',
        description: '哥布林的首领，会召唤小弟',
        special: 'summon',
        pattern: 'summon_every_3' // 每3回合召唤
    },
    skeleton_general: {
        id: 'skeleton_general',
        name: '骷髅将军',
        icon: '⚔️',
        color: '#424242',
        description: '不死族的将军，会复活',
        special: 'revive',
        pattern: 'revive_once' // 复活一次
    },
    shadow_assassin: {
        id: 'shadow_assassin',
        name: '暗影刺客',
        icon: '🗡️',
        color: '#212121',
        description: '来去无踪的杀手',
        special: 'evade',
        pattern: 'high_evade' // 高闪避
    },
    elemental_mage: {
        id: 'elemental_mage',
        name: '元素法师',
        icon: '🔮',
        color: '#7B1FA2',
        description: '掌握元素之力的法师',
        special: 'elemental',
        pattern: 'rotate_elements' // 轮换元素攻击
    },
    dragon: {
        id: 'dragon',
        name: '幼龙',
        icon: '🐉',
        color: '#D32F2F',
        description: '强大的龙族',
        special: 'fire_breath',
        pattern: 'aoe_every_3' // 每3回合AOE
    },
    demon_lord: {
        id: 'demon_lord',
        name: '恶魔领主',
        icon: '👿',
        color: '#C62828',
        description: '来自地狱的恶魔',
        special: 'curse',
        pattern: 'add_curses' // 添加诅咒牌
    },
    ancient_golem: {
        id: 'ancient_golem',
        name: '远古魔像',
        icon: '🗿',
        color: '#5D4037',
        description: '坚不可摧的守护者',
        special: 'armor',
        pattern: 'high_armor' // 极高护甲
    },
    void_walker: {
        id: 'void_walker',
        name: '虚空行者',
        icon: '👁️',
        color: '#4527A0',
        description: '来自虚空的生物',
        special: 'void',
        pattern: 'steal_cards' // 偷牌
    },
    geometry_demon: {
        id: 'geometry_demon',
        name: '几何魔王',
        icon: '🔷',
        color: '#E94560',
        description: '最终的BOSS，掌握所有几何之力',
        special: 'all',
        pattern: 'phase_shift' // 阶段转换
    }
};

// 获取奖励
export function getRewards(floor, type = 'normal') {
    const reward = TOWER_CONFIG.rewards[type] || TOWER_CONFIG.rewards.normal;
    
    return {
        gold: Math.floor(Math.random() * (reward.gold.max - reward.gold.min) + reward.gold.min),
        cardChoices: reward.cardChoices,
        relic: reward.relic || false,
        relicChance: reward.relicChance || 0,
        maxHp: reward.maxHp || 0
    };
}
