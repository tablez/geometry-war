/**
 * 游戏配置文件
 * 包含所有卡牌、职业、敌人的数据
 */

// 职业配置
export const CLASSES = {
    WARRIOR: {
        id: 'warrior',
        name: '战士',
        icon: '■',
        color: '#e94560',
        description: '高生命值，强力攻击',
        baseHp: 80,
        baseEnergy: 3,
        startingDeck: ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'pommel_strike', 'shrug_it_off']
    },
    MAGE: {
        id: 'mage',
        name: '法师',
        icon: '▲',
        color: '#533483',
        description: '强大法术，群体伤害',
        baseHp: 60,
        baseEnergy: 4,
        startingDeck: ['magic_missile', 'magic_missile', 'arcane_defense', 'fireball']
    },
    PRIEST: {
        id: 'priest',
        name: '牧师',
        icon: '●',
        color: '#16c79a',
        description: '治疗回复，辅助增益',
        baseHp: 70,
        baseEnergy: 3,
        startingDeck: ['holy_light', 'heal', 'shield', 'smite']
    },
    ASSASSIN: {
        id: 'assassin',
        name: '刺客',
        icon: '◆',
        color: '#f9a825',
        description: '高暴击，快速连击',
        baseHp: 65,
        baseEnergy: 4,
        startingDeck: ['dagger', 'dagger', 'dagger', 'backstab', 'evade']
    }
};

// 卡牌配置
export const CARDS = {
    // 基础攻击牌
    strike: {
        id: 'strike',
        name: '打击',
        type: 'attack',
        cost: 1,
        damage: 6,
        description: '造成6点伤害',
        icon: '⚔️'
    },
    defend: {
        id: 'defend',
        name: '防御',
        type: 'skill',
        cost: 1,
        block: 5,
        description: '获得5点护甲',
        icon: '🛡️'
    },
    
    // 法师牌
    magic_missile: {
        id: 'magic_missile',
        name: '魔法飞弹',
        type: 'attack',
        cost: 1,
        damage: 4,
        hits: 2,
        description: '造成4点伤害2次',
        icon: '✨'
    },
    arcane_defense: {
        id: 'arcane_defense',
        name: '奥术防御',
        type: 'skill',
        cost: 1,
        block: 8,
        description: '获得8点护甲',
        icon: '🔮'
    },
    fireball: {
        id: 'fireball',
        name: '火球术',
        type: 'attack',
        cost: 2,
        damage: 12,
        description: '造成12点伤害',
        icon: '🔥'
    },
    
    // 牧师牌
    holy_light: {
        id: 'holy_light',
        name: '圣光',
        type: 'attack',
        cost: 1,
        damage: 5,
        heal: 3,
        description: '造成5点伤害，回复3点生命',
        icon: '✝️'
    },
    heal: {
        id: 'heal',
        name: '治疗',
        type: 'skill',
        cost: 1,
        heal: 8,
        description: '回复8点生命',
        icon: '💚'
    },
    shield: {
        id: 'shield',
        name: '护盾',
        type: 'skill',
        cost: 1,
        block: 10,
        description: '获得10点护甲',
        icon: '⭕'
    },
    smite: {
        id: 'smite',
        name: '惩戒',
        type: 'attack',
        cost: 2,
        damage: 10,
        description: '造成10点伤害',
        icon: '⚡'
    },
    
    // 刺客牌
    dagger: {
        id: 'dagger',
        name: '匕首',
        type: 'attack',
        cost: 0,
        damage: 3,
        description: '造成3点伤害',
        icon: '🗡️'
    },
    backstab: {
        id: 'backstab',
        name: '背刺',
        type: 'attack',
        cost: 2,
        damage: 15,
        description: '造成15点伤害',
        icon: '💀'
    },
    evade: {
        id: 'evade',
        name: '闪避',
        type: 'skill',
        cost: 1,
        block: 4,
        draw: 1,
        description: '获得4点护甲，抽1张牌',
        icon: '💨'
    }
};

// 敌人配置
export const ENEMIES = {
    slime: {
        id: 'slime',
        name: '史莱姆',
        hp: 20,
        damage: 5,
        icon: '🟢',
        color: '#4CAF50'
    },
    goblin: {
        id: 'goblin',
        name: '哥布林',
        hp: 30,
        damage: 8,
        icon: '👺',
        color: '#8BC34A'
    },
    skeleton: {
        id: 'skeleton',
        name: '骷髅兵',
        hp: 40,
        damage: 10,
        icon: '💀',
        color: '#9E9E9E'
    },
    boss: {
        id: 'boss',
        name: '几何魔王',
        hp: 100,
        damage: 15,
        icon: '👿',
        color: '#F44336'
    }
};

// 游戏常量
export const GAME_CONFIG = {
    MAX_HAND_SIZE: 10,
    STARTING_DRAW: 5,
    MAX_ENERGY: 10
};
