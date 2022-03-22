import SparkMD5 from 'spark-md5';

// 小文件生成MD5
function generateSmallFileMD5(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(file);
        fileReader.onload = e => {
            const md5 = SparkMD5.hashBinary(e.target.result);
            resolve(md5);
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
        loadFile();
    });
}

export function generateFileMD5(file, chunkSize = 5 * 1024 *1024) {
    if (!file) return Promise.reject('文件为空！');
    if (file.size > 50 * 1024 * 1024) {
        return generateLargeFileMD5(file, chunkSize);
    } else {
        return generateSmallFileMD5(file);
    }
}
