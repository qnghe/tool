import SparkMD5 from 'spark-md5';
import { to } from './promise'

// 小文件生成MD5
function generateSmallFileMD5(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(file);
        fileReader.onload = e => {
            const md5 = SparkMD5.hashBinary(e.target.result);
            resolve(md5);
        };
        fileReader.onerror = e => {
            reject(e);
        };
    });
}

// 大文件生成MD5
function generateLargeFileMD5(file, chunkSize) {
    return new Promise((resolve, reject) => {
        let start = 0;
        let end = start + chunkSize;
    
        const fileReader = new FileReader();
        const md5 = new SparkMD5();
    
        const loadFile = () => {
            const chunk = file.slice(start, end);
            fileReader.readAsBinaryString(chunk);
        }
        fileReader.onload = e => {
            md5.appendBinary(e.target.result);
            if (end < file.size) {
                start = end;
                end += chunkSize;
                loadFile();
            } else {
                resolve(md5.end());
            }
        };
        fileReader.onerror = e => {
            reject(e);
        };
        loadFile();
    });
}

export async function generateFileMD5(file, chunkSize = 5 * 1024 *1024) {
    if (!file) return Promise.reject('文件为空！');
    let res = '';
    let err = null;
    if (file.size > 50 * 1024 * 1024) {
        [err, res] = await to(generateLargeFileMD5(file, chunkSize));
    } else {
        [err, res] = await to(generateSmallFileMD5(file));
    }
    if (err) {
        console.error(err);
        res = -1;
    }
    return res;
}
