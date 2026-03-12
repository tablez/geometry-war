/**
 * 音效管理器
 * 管理游戏音效和背景音乐
 */

// 音效配置
const AUDIO_CONFIG = {
    // 攻击音效
    attack: {
        src: '/static/audio/attack.mp3',
        volume: 0.6
    },
    // 防御音效
    defend: {
        src: '/static/audio/defend.mp3',
        volume: 0.5
    },
    // 抽牌音效
    draw: {
        src: '/static/audio/draw.mp3',
        volume: 0.4
    },
    // 出牌音效
    playCard: {
        src: '/static/audio/play_card.mp3',
        volume: 0.5
    },
    // 伤害音效
    damage: {
        src: '/static/audio/damage.mp3',
        volume: 0.7
    },
    // 治疗音效
    heal: {
        src: '/static/audio/heal.mp3',
        volume: 0.5
    },
    // 胜利音效
    victory: {
        src: '/static/audio/victory.mp3',
        volume: 0.8
    },
    // 失败音效
    defeat: {
        src: '/static/audio/defeat.mp3',
        volume: 0.8
    },
    // 金币音效
    gold: {
        src: '/static/audio/gold.mp3',
        volume: 0.6
    },
    // 升级音效
    upgrade: {
        src: '/static/audio/upgrade.mp3',
        volume: 0.7
    },
    // 按钮点击
    click: {
        src: '/static/audio/click.mp3',
        volume: 0.3
    }
};

// 音效管理器
class AudioManager {
    constructor() {
        this.enabled = true;
        this.volume = 1.0;
        this.audioCache = {};
        this.bgm = null;
    }
    
    // 初始化
    init() {
        // 加载用户设置
        const settings = uni.getStorageSync('audioSettings');
        if (settings) {
            this.enabled = settings.enabled !== false;
            this.volume = settings.volume || 1.0;
        }
    }
    
    // 播放音效
    play(soundName) {
        if (!this.enabled) return;
        
        const config = AUDIO_CONFIG[soundName];
        if (!config) {
            console.warn('未找到音效:', soundName);
            return;
        }
        
        // 使用 uni-app 的音频 API
        const innerAudioContext = uni.createInnerAudioContext();
        innerAudioContext.src = config.src;
        innerAudioContext.volume = config.volume * this.volume;
        innerAudioContext.play();
        
        // 播放完成后销毁
        innerAudioContext.onEnded(() => {
            innerAudioContext.destroy();
        });
        
        innerAudioContext.onError((err) => {
            console.error('音效播放失败:', err);
            innerAudioContext.destroy();
        });
    }
    
    // 播放背景音乐
    playBGM(src) {
        if (this.bgm) {
            this.bgm.stop();
            this.bgm.destroy();
        }
        
        this.bgm = uni.createInnerAudioContext();
        this.bgm.src = src;
        this.bgm.loop = true;
        this.bgm.volume = 0.3 * this.volume;
        
        if (this.enabled) {
            this.bgm.play();
        }
    }
    
    // 停止背景音乐
    stopBGM() {
        if (this.bgm) {
            this.bgm.stop();
        }
    }
    
    // 设置音量
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.bgm) {
            this.bgm.volume = 0.3 * this.volume;
        }
        this.saveSettings();
    }
    
    // 开关音效
    toggle() {
        this.enabled = !this.enabled;
        
        if (this.enabled) {
            if (this.bgm) this.bgm.play();
        } else {
            if (this.bgm) this.bgm.pause();
        }
        
        this.saveSettings();
        return this.enabled;
    }
    
    // 保存设置
    saveSettings() {
        uni.setStorageSync('audioSettings', {
            enabled: this.enabled,
            volume: this.volume
        });
    }
}

// 导出单例
export const audioManager = new AudioManager();

// 便捷函数
export const playSound = (name) => audioManager.play(name);
export const playBGM = (src) => audioManager.playBGM(src);
export const stopBGM = () => audioManager.stopBGM();
