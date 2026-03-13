// 游戏逻辑
const gameState = {
    player: {
        classId: '',
        hp: 80,
        maxHp: 80,
        energy: 3,
        maxEnergy: 3,
        block: 0
    },
    currentFloor: 1,
    deck: [],
    hand: [],
    discard: [],
    gold: 0
};

// 职业配置
const classes = {
    warrior: { hp: 80, energy: 3, icon: '⚔️', name: '战士' },
    mage: { hp: 60, energy: 4, icon: '🔮', name: '法师' },
    assassin: { hp: 65, energy: 4, icon: '🗡️', name: '刺客' },
    priest: { hp: 70, energy: 3, icon: '✨', name: '牧师' }
};

// 选择职业
function selectClass(classId) {
    const cls = classes[classId];
    gameState.player.classId = classId;
    gameState.player.hp = cls.hp;
    gameState.player.maxHp = cls.hp;
    gameState.player.energy = cls.energy;
    gameState.player.maxEnergy = cls.energy;
    
    // 初始化卡组
    gameState.deck = ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend'];
    
    // 切换到地图
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('mapScreen').classList.remove('hidden');
    
    updateUI();
    renderMap();
}

// 更新UI
function updateUI() {
    document.getElementById('hpText').textContent = `${gameState.player.hp}/${gameState.player.maxHp}`;
    document.getElementById('hpFill').style.width = `${(gameState.player.hp / gameState.player.maxHp) * 100}%`;
    document.getElementById('energyText').textContent = `${gameState.player.energy}/${gameState.player.maxEnergy}`;
    document.getElementById('floorNum').textContent = gameState.currentFloor;
}

// 渲染地图
function renderMap() {
    const mapPath = document.getElementById('mapPath');
    mapPath.innerHTML = '';
    
    const icons = {
        normal: '⚔️',
        elite: '👹',
        boss: '👿',
        rest: '🏕️',
        shop: '🏪'
    };
    
    for (let i = 0; i < 5; i++) {
        const floor = gameState.currentFloor + i;
        const type = getFloorType(floor);
        const isCurrent = i === 0;
        
        const node = document.createElement('div');
        node.className = `map-node ${isCurrent ? 'current' : ''}`;
        node.innerHTML = `
            <div class="node-icon">${icons[type]}</div>
            <div class="node-floor">${floor}</div>
        `;
        mapPath.appendChild(node);
    }
}

// 获取楼层类型
function getFloorType(floor) {
    if (floor % 10 === 0) return 'boss';
    if (floor % 5 === 0) return 'elite';
    if (floor % 3 === 0) return 'rest';
    if (floor % 4 === 0) return 'shop';
    return 'normal';
}

// 进入楼层
function enterFloor() {
    const type = getFloorType(gameState.currentFloor);
    
    if (type === 'normal' || type === 'elite') {
        alert(`进入第 ${gameState.currentFloor} 层战斗！`);
        gameState.currentFloor++;
        updateUI();
        renderMap();
    } else if (type === 'rest') {
        alert('进入休息处，回复生命！');
        gameState.player.hp = Math.min(gameState.player.hp + 20, gameState.player.maxHp);
        gameState.currentFloor++;
        updateUI();
        renderMap();
    } else if (type === 'shop') {
        alert('进入商店！');
        gameState.currentFloor++;
        updateUI();
        renderMap();
    }
}
