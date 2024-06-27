import fs from 'fs';
import colors from './data/colors';
import nouns from './data/nouns';

// Function to generate combinations and write them to a file using streams
function generateCombinationsToFile(
  colors: string[],
  nouns: string[],
  outputFilePath: string,
  randomRange: number[],
): void {
  const outputStream = fs.createWriteStream(outputFilePath, { flags: 'a' }); // 'a' flag for append mode

  colors.forEach((color) => {
    nouns.forEach((noun) => {
      randomRange.forEach((num) => {
        const combination = `${color}${noun}${num}\n`;
        outputStream.write(combination);
      });
    });
  });

  outputStream.end();
}

// Example usage
const outputFilePath = './combinations.txt';
const randomRange: number[] = [1, 2, 3, 4]; // Example range array

generateCombinationsToFile(colors, nouns, outputFilePath, randomRange);

export { generateCombinationsToFile };
