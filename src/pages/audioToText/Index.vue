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
            <el-card v-if="fileInfo" class="audio-box" shadow="hover" v-loading="isUploading" element-loading-text="正在识别...">
                <h4>{{fileInfo.name}}</h4>
                <el-button type="primary" v-if="!isCompleted" @click="startTranfer">识别</el-button>
                <el-button type="primary" disabled v-else>识别完成</el-button>
            </el-card>
        </transition>
        <template v-if="resultArr.length > 0">
            <section v-for="(item, index) in resultArr" class="result-item">
                <div class="operate-box">
                    <el-icon class="copy-icon" @click="copy(item.text)" title="复制"><DocumentCopy /></el-icon>
                    <el-icon class="delete-icon" @click="deleteResult(index)" title="删除"><Delete /></el-icon>
                </div>
                <pre class="text-result">{{item.text}}</pre>
            </section>
        </template>
    </div>
</template>
<script setup>
import { UploadFilled, DocumentCopy, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { generateFileMD5 } from '@/utils/gen-md5.js';
import { sliceFile } from '@/utils/file.js';
import req from '@/utils/request.js';

const isUploading = ref(false);
const isCompleted = ref(false);
const fileInfo = ref(null);
const resultArr = ref([]);
let taskId = null;

// 上传文件变化时
function fileChangeHandler(uploadFile) {
    if (isUploading.value) return false;
    fileInfo.value = uploadFile;
    isCompleted.value = false;
}
function startTranfer() {
    uploadReq(fileInfo.value.raw);
}
// 识别
async function convertAudioToText(fileURL) {
    req.post('/api/audioToText', { fileURL }).then(({res}) => {
        if (res.code === 1) {
            taskId = res.data.id;
            getAudioTextResult();
        } else {
            ElMessage.error(res.error || res.msg);
        }
    })
}
// 获取识别结果
function getAudioTextResult() {
    req.get(`/api/getAudioTextResult/${taskId}`).then(({res}) => {
        if (res.code === 1) {
            if (res.data.Status === 0 || res.data.Status === 1) {
                setTimeout(() => {
                    getAudioTextResult();
                }, 2000);
            } else if (res.data.Status === 2) {
                resultArr.value.push({
                    name: fileInfo.value.name,
                    text: res.data.Result
                });
                isUploading.value = false;
                isCompleted.value = true;
            }
        } else if (res.code === 0) {
            ElMessage.error(res.error || res.msg);
        }
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

function copy(text) {
    navigator.clipboard.writeText(text).then(() => {
        ElMessage.success('复制成功');
    });
}

function deleteResult(index) {
    resultArr.value.splice(index, 1);
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
    margin: 20px auto 0;
    width: 360px;
    cursor: pointer;
}
.result-item {
    position: relative;
    margin: 20px auto 0;
    width: 1000px;
}
.operate-box {
    position: absolute;
    top: 8px;
    right: 12px;
    .el-icon {
        color: #8c8c8d;
        cursor: pointer;
        margin-left: 8px;
        transition: color 0.3s;
    }
    .copy-icon:hover {
        color: #494949;
    }
    .delete-icon:hover {
        color: #f56c6c;
    }
}
.text-result {
    padding: 16px;
    max-height: 400px;
    overflow: auto;
    border: 1px solid #e4e7ed;
    text-align: left;
}
</style>
