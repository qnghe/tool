<template>
    <div class="audio-text">
        <el-upload
            class="upload"
            drag
            action="#"
            :auto-upload="false"
            :on-change="fileChangeHandler"
            accept="audio/*"
            :show-file-list="false"
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">文件拖来或<em>点击上传</em></div>
            <template #tip>
                <div class="el-upload__tip">只能上传音频文件，小于500MB</div>
            </template>
        </el-upload>
        <transition name="fade">
            <el-card v-if="fileInfo" class="audio-box" shadow="hover" v-loading="isUploading">
                <h4>{{fileInfo.name}}</h4>
                <el-button type="primary" v-if="!isDownloadable" @click="startTranfer">识别</el-button>
                <el-button type="primary" v-else @click="download">下载</el-button>
                <!-- <el-icon class="icon-download"><download /></el-icon> -->
            </el-card>
        </transition>
        <section></section>
    </div>
</template>
<script setup>
import { UploadFilled, Download, Delete  } from "@element-plus/icons-vue";
import { ref } from 'vue';
import { generateFileMD5 } from '@/utils/gen-md5.js';
import { sliceFile } from '@/utils/file.js';
import req from '@/utils/request.js';

const isUploading = ref(false);
const isDownloadable = ref(false);
const fileInfo = ref(null);
function uploading(event, file, fileList) {
  console.log(event);
  console.log(file);
  console.log(fileList);
};

// 上传文件变化时
function fileChangeHandler(uploadFile) {
    fileInfo.value = uploadFile

}
function startTranfer() {
    uploadReq(fileInfo.value.raw);
}
async function convertAudioToText(fileURL) {
    req.post('/api/audioToText', { fileURL }).then(({res}) => {
        console.log(res);
        isUploading.value = false;
        isDownloadable.value = true;
    })
}


async function uploadReq(file) {
    isUploading.value = true;
    const chunks = sliceFile(file);
    // 生成文件MD5
    const fileMD5 = await generateFileMD5(file);
    if (fileMD5 === -1) {
        console.error('MD5生成失败，请重新上传');
        return;
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
        req.post('/api/uploadFile', formData).then(({res}) => {
            if (initSize < chunksLength) {
                createReq(initSize);
                initSize++;
            }
            if (res.code === 2) {
                convertAudioToText(res.data.fileURL);
            }
            return res;
        });
    }
    for (let i = 0; i < initSize; i++) {
        promiseArr.push(createReq(i));
    }
}

function download() {
    
}

</script>
<style lang="scss" scoped>
.audio-text {
  margin-top: 80px;
  text-align: center;
}
.upload {
    margin: 0 auto;
    width: 360px;
}
.audio-box {
    margin: 48px auto 0;
    width: 360px;
    cursor: pointer;
}

.icon-download {
    font-size: 48px;
}
</style>
