import * as fs from 'fs';

// Using LZW (Lempel–Ziv–Welch) Compression technique
function compressLZW(data: string): string {
  // Initial Distionary
  const dictionary: { [key: string]: number } = {};
  let dictSize = 256;
  for (let i = 0; i < dictSize; i++) {
    dictionary[String.fromCharCode(i)] = i;
  }

  let result = [];
  let w = '';
  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    const wc = w + c;
    if (dictionary[wc]) {
      w = wc;
    } else {
      result.push(dictionary[w]);
      dictionary[wc] = dictSize++;
      w = c;
    }
  }

  if (w) {
    result.push(dictionary[w]);
  }

  return result.map(String).join(',');
}

(() => {
  try {
    const jsonData = fs.readFileSync('data.json', 'utf8');
    const compressedData = compressLZW(jsonData);
    fs.writeFileSync('data.lzw', compressedData);
    console.log("Compress file successful and written to file 'data.lzw'");

    // Calculate file sizes
    const originalSize = Buffer.byteLength(jsonData, 'utf8');
    const compressedSize = Buffer.byteLength(compressedData, 'utf8');

    // Calculate percentage reduction
    const reductionPercent = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    console.log(`Original Size: ${originalSize} bytes`);
    console.log(`Compressed Size: ${compressedSize} bytes`);
    console.log(`Compression Ratio: ${reductionPercent}% size reduction`);
  } catch (error) {
    console.error("File operation error:", error);
  }
})()
