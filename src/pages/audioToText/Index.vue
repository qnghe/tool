<template>
  <div class="audio-text">
    <div>
        <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            on-progress="uploading"
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                文件拖来或<em>点击上传</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">只能上传音频文件，小于500MB</div>
            </template>
        </el-upload>
    </div>
  </div>
</template>
<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
const uploading = (event, file, fileList) => {
    console.log(event);
}
</script>
<style scoped>
.audio-text {
  margin-top: 80px;
  text-align: center;
}
</style>
