/**
 * 完整卡牌数据库 - 几何尖塔
 * 包含所有职业的卡牌
 */

// 战士卡牌 - 卖血流派 + 护甲流派 + 腐化流
export const WARRIOR_CARDS = {
    // ========== 基础牌 ==========
    strike: {
        id: 'strike',
        name: '打击',
        type: 'attack',
        cost: 1,
        damage: 6,
        description: '造成6点伤害',
        upgrade: { damage: 9, description: '造成9点伤害' }
    },
    
    defend: {
        id: 'defend',
        name: '防御',
        type: 'skill',
        cost: 1,
        block: 5,
        description: '获得5点护甲',
        upgrade: { block: 8, description: '获得8点护甲' }
    },
    
    // ========== 卖血流派 ==========
    bloodletting: {
        id: 'bloodletting',
        name: '放血',
        type: 'skill',
        cost: 0,
        selfDamage: 3,
        energy: 2,
        description: '失去3点生命，获得2点能量',
        upgrade: { selfDamage: 2, description: '失去2点生命，获得2点能量' }
    },
    
    blood_for_blood: {
        id: 'blood_for_blood',
        name: '血债血偿',
        type: 'attack',
        cost: 4,
        damage: 18,
        costReductionPerDamage: 1,
        description: '造成18点伤害，本回合每受到一次伤害费用-1',
        upgrade: { damage: 22, description: '造成22点伤害，本回合每受到一次伤害费用-1' }
    },
    
    rage: {
        id: 'rage',
        name: '狂怒',
        type: 'skill',
        cost: 0,
        draw: 3,
        selfDamage: 2,
        description: '失去2点生命，抽3张牌',
        upgrade: { draw: 4, description: '失去2点生命，抽4张牌' }
    },
    
    brutality: {
        id: 'brutality',
        name: '残暴',
        type: 'power',
        cost: 0,
        selfDamagePerTurn: 1,
        drawPerTurn: 1,
        description: '能力：每回合开始时失去1点生命，抽1张牌',
        upgrade: { drawPerTurn: 2, description: '能力：每回合开始时失去1点生命，抽2张牌' }
    },
    
    // ========== 回复核心 ==========
    feed: {
        id: 'feed',
        name: '吞噬',
        type: 'attack',
        cost: 1,
        damage: 8,
        healOnKill: 3,
        maxHpOnKill: 1,
        description: '造成8点伤害，击杀敌人时回复3生命并永久+1最大生命',
        upgrade: { damage: 10, healOnKill: 4, maxHpOnKill: 2, description: '造成10点伤害，击杀时回复4生命并+2最大生命' }
    },
    
    reaper: {
        id: 'reaper',
        name: '收割',
        type: 'attack',
        cost: 2,
        damage: 4,
        aoe: true,
        lifesteal: true,
        description: '对所有敌人造成4点伤害，回复等同于伤害的生命',
        upgrade: { damage: 5, description: '对所有敌人造成5点伤害，回复等同于伤害的生命' }
    },
    
    // ========== 护甲流派 ==========
    body_slam: {
        id: 'body_slam',
        name: '全身撞击',
        type: 'attack',
        cost: 1,
        damage: 0,
        damageEqualsBlock: true,
        description: '造成等同于当前护甲的伤害',
        upgrade: { cost: 0, description: '造成等同于当前护甲的伤害（0费）' }
    },
    
    barricade: {
        id: 'barricade',
        name: '壁垒',
        type: 'power',
        cost: 3,
        retainBlock: true,
        description: '能力：护甲不再在回合开始时消失',
        upgrade: { cost: 2, description: '能力：护甲不再在回合开始时消失（2费）' }
    },
    
    metalize: {
        id: 'metalize',
        name: '金属化',
        type: 'power',
        cost: 1,
        blockPerTurn: 3,
        description: '能力：每回合开始时获得3点护甲',
        upgrade: { blockPerTurn: 4, description: '能力：每回合开始时获得4点护甲' }
    },
    
    entrench: {
        id: 'entrench',
        name: '固守',
        type: 'skill',
        cost: 2,
        doubleBlock: true,
        description: '护甲翻倍',
        upgrade: { cost: 1, description: '护甲翻倍（1费）' }
    },
    
    // ========== 力量流派 ==========
    flex: {
        id: 'flex',
        name: '肌肉膨胀',
        type: 'skill',
        cost: 0,
        strength: 2,
        strengthDown: 2,
        description: '获得2点力量，回合结束时失去2点力量',
        upgrade: { strength: 4, strengthDown: 4, description: '获得4点力量，回合结束时失去4点力量' }
    },
    
    limit_break: {
        id: 'limit_break',
        name: '突破极限',
        type: 'skill',
        cost: 1,
        doubleStrength: true,
        exhaust: true,
        description: '力量翻倍，消耗',
        upgrade: { cost: 0, description: '力量翻倍，消耗（0费）' }
    },
    
    heavy_blade: {
        id: 'heavy_blade',
        name: '重刃',
        type: 'attack',
        cost: 2,
        damage: 14,
        strengthMultiplier: 3,
        description: '造成14点伤害，力量加成x3',
        upgrade: { damage: 18, strengthMultiplier: 5, description: '造成18点伤害，力量加成x5' }
    },
    
    // ========== 腐化流 ==========
    corruption: {
        id: 'corruption',
        name: '腐化',
        type: 'power',
        cost: 3,
        exhaustSkills: true,
        energyOnExhaust: 1,
        description: '能力：所有技能牌被消耗，每消耗一张获得1点能量',
        upgrade: { cost: 2, description: '能力：所有技能牌被消耗，每消耗一张获得1点能量（2费）' }
    },
    
    dark_embrace: {
        id: 'dark_embrace',
        name: '黑暗之拥',
        type: 'power',
        cost: 2,
        drawOnExhaust: 1,
        description: '能力：每当你消耗一张牌，抽1张牌',
        upgrade: { cost: 1, description: '能力：每当你消耗一张牌，抽1张牌（1费）' }
    },
    
    feel_no_pain: {
        id: 'feel_no_pain',
        name: '麻木',
        type: 'power',
        cost: 1,
        blockOnExhaust: 3,
        description: '能力：每当你消耗一张牌，获得3点护甲',
        upgrade: { blockOnExhaust: 4, description: '能力：每当你消耗一张牌，获得4点护甲' }
    },
    
    // ========== 通用 ==========
    shrug_it_off: {
        id: 'shrug_it_off',
        name: '耸肩无视',
        type: 'skill',
        cost: 1,
        block: 8,
        draw: 1,
        description: '获得8点护甲，抽1张牌',
        upgrade: { block: 11, description: '获得11点护甲，抽1张牌' }
    },
    
    pommel_strike: {
        id: 'pommel_strike',
        name: '剑柄打击',
        type: 'attack',
        cost: 1,
        damage: 9,
        draw: 1,
        description: '造成9点伤害，抽1张牌',
        upgrade: { damage: 10, draw: 2, description: '造成10点伤害，抽2张牌' }
    },
    
    whirlwind: {
        id: 'whirlwind',
        name: '旋风斩',
        type: 'attack',
        cost: 'X',
        damage: 5,
        aoe: true,
        repeatX: true,
        description: 'X费：对所有敌人造成5点伤害X次',
        upgrade: { damage: 8, description: 'X费：对所有敌人造成8点伤害X次' }
    },
    
    thunderclap: {
        id: 'thunderclap',
        name: '雷霆一击',
        type: 'attack',
        cost: 1,
        damage: 4,
        aoe: true,
        vulnerable: 1,
        description: '对所有敌人造成4点伤害，给予1层易伤',
        upgrade: { damage: 7, description: '对所有敌人造成7点伤害，给予1层易伤' }
    },
    
    clash: {
        id: 'clash',
        name: '冲突',
        type: 'attack',
        cost: 0,
        damage: 14,
        requireNoSkill: true,
        description: '手牌中没有技能牌时可以打出，造成14点伤害',
        upgrade: { damage: 18, description: '手牌中没有技能牌时可以打出，造成18点伤害' }
    },
    
    // ========== 新增卡牌 ==========
    // 更多攻击牌
    sword_boomerang: {
        id: 'sword_boomerang',
        name: '飞剑回旋',
        type: 'attack',
        cost: 1,
        damage: 3,
        hits: 3,
        randomTargets: true,
        description: '随机对敌人造成3点伤害3次',
        upgrade: { damage: 4, description: '随机对敌人造成4点伤害3次' }
    },
    
    twin_strike: {
        id: 'twin_strike',
        name: '双重打击',
        type: 'attack',
        cost: 1,
        damage: 5,
        hits: 2,
        description: '造成5点伤害2次',
        upgrade: { damage: 7, description: '造成7点伤害2次' }
    },
    
    wild_strike: {
        id: 'wild_strike',
        name: '狂野打击',
        type: 'attack',
        cost: 1,
        damage: 12,
        shuffleWound: true,
        description: '造成12点伤害，将一张伤口洗入牌库',
        upgrade: { damage: 17, description: '造成17点伤害，将一张伤口洗入牌库' }
    },
    
    // 更多防御牌
    ghostly_armor: {
        id: 'ghostly_armor',
        name: '幽灵护甲',
        type: 'skill',
        cost: 1,
        block: 10,
        ethereal: true,
        description: '获得10点护甲，虚无',
        upgrade: { block: 13, description: '获得13点护甲，虚无' }
    },
    
    flame_barrier: {
        id: 'flame_barrier',
        name: '火焰屏障',
        type: 'skill',
        cost: 2,
        block: 12,
        thorns: 4,
        description: '获得12点护甲，受到攻击时造成4点伤害',
        upgrade: { block: 16, thorns: 6, description: '获得16点护甲，受到攻击时造成6点伤害' }
    },
    
    // 更多能力牌
    combust: {
        id: 'combust',
        name: '燃烧',
        type: 'power',
        cost: 1,
        selfDamagePerTurn: 1,
        aoeDamagePerTurn: 5,
        description: '能力：每回合开始时失去1点生命，对所有敌人造成5点伤害',
        upgrade: { aoeDamagePerTurn: 7, description: '能力：每回合开始时失去1点生命，对所有敌人造成7点伤害' }
    },
    
    rupture: {
        id: 'rupture',
        name: '破裂',
        type: 'power',
        cost: 1,
        strengthOnSelfDamage: 1,
        description: '能力：每当你失去生命，获得1点力量',
        upgrade: { strengthOnSelfDamage: 2, description: '能力：每当你失去生命，获得2点力量' }
    },
    
    // 特殊牌
    havoc: {
        id: 'havoc',
        name: '浩劫',
        type: 'skill',
        cost: 1,
        playTopCard: true,
        exhaust: true,
        description: '打出牌库顶部的牌，消耗',
        upgrade: { cost: 0, description: '打出牌库顶部的牌，消耗（0费）' }
    },
    
    intimidate: {
        id: 'intimidate',
        name: '威吓',
        type: 'skill',
        cost: 0,
        weakAll: 1,
        exhaust: true,
        description: '给予所有敌人1层虚弱，消耗',
        upgrade: { weakAll: 2, description: '给予所有敌人2层虚弱，消耗' }
    },
    
    shockwave: {
        id: 'shockwave',
        name: '震荡波',
        type: 'skill',
        cost: 2,
        vulnerableAll: 3,
        weakAll: 3,
        exhaust: true,
        description: '给予所有敌人3层易伤和3层虚弱，消耗',
        upgrade: { cost: 1, description: '给予所有敌人3层易伤和3层虚弱，消耗（1费）' }
    },
    
    disarm: {
        id: 'disarm',
        name: '缴械',
        type: 'skill',
        cost: 1,
        strengthDown: 2,
        exhaust: true,
        description: '敌人失去2点力量，消耗',
        upgrade: { strengthDown: 3, description: '敌人失去3点力量，消耗' }
    },
    
    // 诅咒牌（负面）
    wound: {
        id: 'wound',
        name: '伤口',
        type: 'curse',
        cost: null,
        unplayable: true,
        description: '无法打出',
        upgrade: null
    }
};

// 状态效果定义
export const STATUS_EFFECTS = {
    vulnerable: {
        id: 'vulnerable',
        name: '易伤',
        icon: '💔',
        color: '#e94560',
        duration: 2,
        description: '受到攻击伤害+50%',
        effect: (damage) => Math.floor(damage * 1.5)
    },
    weak: {
        id: 'weak',
        name: '虚弱',
        icon: '💫',
        color: '#9e9e9e',
        duration: 2,
        description: '造成伤害-25%',
        effect: (damage) => Math.floor(damage * 0.75)
    },
    strength: {
        id: 'strength',
        name: '力量',
        icon: '💪',
        color: '#f9a825',
        duration: -1, // 永久
        description: '攻击伤害+X',
        effect: (damage, amount) => damage + amount
    },
    dexterity: {
        id: 'dexterity',
        name: '敏捷',
        icon: '⚡',
        color: '#16c79a',
        duration: -1,
        description: '获得护甲+X',
        effect: (block, amount) => block + amount
    },
    poison: {
        id: 'poison',
        name: '中毒',
        icon: '☠️',
        color: '#4caf50',
        duration: -1,
        description: '回合结束时-X生命',
        effect: (amount) => amount
    },
    regen: {
        id: 'regen',
        name: '再生',
        icon: '💚',
        color: '#8bc34a',
        duration: -1,
        description: '回合结束时+X生命',
        effect: (amount) => amount
    }
};

// 获取卡牌（支持升级版本）
export function getCard(cardId, upgraded = false) {
    const card = WARRIOR_CARDS[cardId];
    if (!card) return null;
    
    if (upgraded && card.upgrade) {
        return { ...card, ...card.upgrade, upgraded: true };
    }
    return card;
}

// 获取职业初始卡组
export function getStartingDeck(classType) {
    const decks = {
        warrior: ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'bloodletting', 'shrug_it_off']
    };
    return decks[classType] || decks.warrior;
}
