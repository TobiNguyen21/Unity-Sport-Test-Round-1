import * as fs from 'fs';

function decompressLZW(data: string): string {
  // Initial Distionary
  const dictionary: { [key: number]: string } = {};
  let dictSize = 256;
  for (let i = 0; i < dictSize; i++) {
    dictionary[i] = String.fromCharCode(i);
  }

  const arr = data.split(',').map(Number);
  let result = String.fromCharCode(arr[0]);
  let w = arr[0];
  for (let i = 1; i < arr.length; i++) {
    const k = arr[i];
    let entry = dictionary[k];
    if (!entry) {
      entry = dictionary[w] + dictionary[w][0];
    }
    result += entry;
    dictionary[dictSize++] = dictionary[w] + entry[0];
    w = k;
  }

  return result;
}

(() => {
  try {
    const compressedDataRead = fs.readFileSync('data.lzw', 'utf8');
    const decompressedData = decompressLZW(compressedDataRead);
    fs.writeFileSync('data_decompressed.json', decompressedData);
    console.log("Decompress file successful and written to file 'data_decompressed.json'");
  } catch (error) {
    console.error("File operation error:", error);
  }
})()
