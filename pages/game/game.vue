<template>
    <view class="container">
        <text class="placeholder">游戏页面 - 开发中</text>
    </view>
</template>

<script>
export default {
    data() {
        return {}
    },
    onLoad() {
        const selectedClass = uni.getStorageSync('selectedClass')
        console.log('进入游戏，职业:', selectedClass)
    }
}
</script>

<style scoped>
.container {
    min-height: 100vh;
    background: #16213e;
    display: flex;
    align-items: center;
    justify-content: center;
}

.placeholder {
    color: #a0a0a0;
    font-size: 24px;
}
</style>
