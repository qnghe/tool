<template>
    <div class="audio-text">
        <el-upload
            class="upload-demo"
            drag
            action="/api/uploadFile"
            :on-progress="uploading"
            :http-request="uploadReq"
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
function uploading(event, file, fileList) {
  console.log(event);
  console.log(file);
  console.log(fileList);
};
</script>
<script>
import { generateFileMD5 } from '@/utils/gen-md5.js';
export default {
    mounted() {
        // this.$api.get('/api/word').then(res => {
        //     console.log(res);
        // })
    },
    methods: {
        uploadReq(options) {
            console.log(options);
            const file = options.file;
            let start = Date.now()
            const chunks = this.sliceFile(file);
            console.log( chunks );
            generateFileMD5(file).then((fileMD5) => {
                console.log(fileMD5);
                for (let i = 0; i < chunks.length; i++) {
                    const formData = new FormData();
                    formData.append("file", chunks[i]);
                    formData.append("name", file.name);
                    formData.append("id", fileMD5);
                    formData.append("chunks", chunks.length);
                    formData.append("chunk", i);

                    this.$ajax.post(options.action, formData);
                }
                console.log( (Date.now() - start) / 1000 );
            }).catch((error) => {
                console.error(error);
            })
        },
        sliceFile(file, chunkSize = 5 * 1024 * 1024) {
            const fontSize = file.size;
            let start = 0;
            let end = start + chunkSize;
            const chunks = [];
            while(start < fontSize) {
                const blob = file.slice(start, end);
                chunks.push(blob);
                start = end;
                end += chunkSize;
            }
            return chunks;
        }
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
