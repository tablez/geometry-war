<template>
    <view class="container">
        <text>地图页面 - 测试</text>
        <button @click="goToGame">进入战斗</button>
    </view>
</template>

<script>
export default {
    methods: {
        goToGame() {
            uni.navigateTo({ url: '/pages/game/game' })
        }
    }
}
</script>

<style>
.container {
    padding: 20px;
}
</style>
