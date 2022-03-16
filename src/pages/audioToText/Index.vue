<template>
    <div class="audio-text">
        <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :on-progress="uploading"
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">文件拖来或<em>点击上传</em></div>
            <template #tip>
                <div class="el-upload__tip">只能上传音频文件，小于500MB</div>
            </template>
        </el-upload>
        <el-card class="download-box" shadow="hover">
            <h4>文本文件</h4>
            <el-icon class="icon-download"><download /></el-icon>
        </el-card>
    </div>
</template>
<script setup>
import { UploadFilled, Download } from "@element-plus/icons-vue";
const uploading = (event, file, fileList) => {
  console.log(event);
};
</script>
<script>
export default {
    mounted() {
        this.$api.get('/api/word').then(res => {
            console.log(res);
        })
    }
}
</script>
<style scoped>
.audio-text {
  margin-top: 80px;
  text-align: center;
}
.download-box {
    margin: 48px auto 0;
    width: 360px;
    cursor: pointer;
}
.download-box:hover {
    color: rgb(70, 170, 252);
}
.icon-download {
    font-size: 48px;
}
</style>
