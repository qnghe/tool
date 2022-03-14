
<template>
<div class="home">
    <h2 class="title">首页</h2>
    <el-row :gutter="12">
        <el-col :span="8">
            <el-card class="tool-item" shadow="hover" @click="toAudiotext">音频文件转文字</el-card>
        </el-col>
        
    </el-row>
</div>
</template>
<script setup>

</script>
<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        toAudiotext() {
            console.log(this);
            this.$router.push('/audiotext')
        }
    }
}
</script>
<style scoped>

.home {
    margin: 200px auto 0;
    width: 60%;
    text-align: center;
}
.title {
    margin: 48px 0;
}
.tool-item {
    cursor: pointer;
}
</style>
