// 文件切片
export function sliceFile(file, chunkSize = 5 * 1024 * 1024) {
  const fontSize = file.size;
  let start = 0;
  let end = start + chunkSize;
  const chunks = [];
  while (start < fontSize) {
    const blob = file.slice(start, end);
    chunks.push(blob);
    start = end;
    end += chunkSize;
  }
  return chunks;
}