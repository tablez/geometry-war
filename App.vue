<script>
export default {
    onLaunch: function() {
        console.log('App Launch')
    },
    onShow: function() {
        console.log('App Show')
    },
    onHide: function() {
        console.log('App Hide')
    }
}
</script>

<style>
/*每个页面公共css */
page {
    background-color: #16213e;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 极简几何风格 */
.geometric-btn {
    border: 2px solid #e94560;
    background: transparent;
    color: #fff;
    padding: 15px 40px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s;
}

.geometric-btn:hover {
    background: #e94560;
}

/* 卡片样式 */
.card {
    background: #1a1a2e;
    border: 2px solid #0f3460;
    border-radius: 8px;
    padding: 20px;
    margin: 10px;
}

/* 文字样式 */
.title {
    font-size: 48px;
    font-weight: bold;
    text-align: center;
    margin: 40px 0;
    color: #e94560;
}

.subtitle {
    font-size: 24px;
    text-align: center;
    color: #a0a0a0;
    margin: 20px 0;
}
</style>
