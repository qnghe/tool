<template>
    <div class="audio-text">
        <el-upload
            class="upload"
            drag
            action="/api/uploadFile"
            :auto-upload="true"
            :http-request="uploadReq"
            :on-change="changeHandler"
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
import { UploadFilled, Download, Delete  } from "@element-plus/icons-vue";
import { ref } from 'vue';
const disabled = ref(true);
function uploading(event, file, fileList) {
  console.log(event);
  console.log(file);
  console.log(fileList);
};
</script>
<script>
import { generateFileMD5 } from '@/utils/gen-md5.js';
import { sliceFile } from '@/utils/file.js';
export default {

    methods: {
        changeHandler(uploadFile, uploadFiles) {
            console.log(uploadFile, uploadFiles);
        },
        async uploadReq(options) {
            console.log(options);
            const file = options.file;
            const chunks = sliceFile(file);
            // 生成文件MD5
            const fileMD5 = await generateFileMD5(file);
            if (fileMD5 === -1) {
                console.error('MD5生成失败，请重新上传');
            }
            const chunksLength = chunks.length;
            let initSize = Math.min(chunksLength, 10);

            const fileInfo = {
                name: file.name,
                id: fileMD5,
                fileTotalNum: chunksLength
            };

            const promiseArr = [];
            // 创建请求，完成一个请求时，移除此项，添加新的请求
            const createReq = (index) => {
                const formData = new FormData();
                formData.append("name", fileInfo.name);
                formData.append("id", fileInfo.id);
                formData.append("fileTotalNum", fileInfo.fileTotalNum);
                formData.append("file", chunks[index]);
                formData.append("fileIndex", index);
                return this.$ajax.post('/api/uploadFile', formData).then(res => {
                    if (initSize < chunksLength) {
                        promiseArr.push(createReq(initSize));
                        initSize++;
                    }
                    return res;
                });
            }
            
            for (let i = 0; i < initSize; i++) {
                promiseArr.push(createReq(i));
            }
            return Promise.all(promiseArr).then(res => {
                console.log(res);
            });
        },
        
    },
    mounted() {
        // this.$api.get('/api/word').then(res => {
        //     console.log(res);
        // })

        function t(fn, wait) {
            let timeoutId;
            return function() {
                if (timeoutId) return;
                timeoutId = setTimeout(() => {
                    fn();
                    timeoutId = null;
                }, wait);
            }
        }
        
        
    },
}
</script>
<style scoped>
.audio-text {
  margin-top: 80px;
  text-align: center;
}
.upload {
    margin: 0 auto;
    width: 360px;

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
