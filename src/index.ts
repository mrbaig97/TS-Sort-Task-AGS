import fs from "fs";
import path from "path";
import readline from "readline";

interface Organize {
  sort(order: "asc" | "desc"): void;
}

class FileManager {
  static readInputFile(inputFile: string): string {
    try {
      return fs.readFileSync(path.join(__dirname, inputFile), "utf-8");
    } catch (error) {
      console.error(`An issue occurred while attempting to read the input file: ${error}`);
      process.exit(1);
    }
  }

  static writeOutputFile(outputFile: string, contents: string) {
    try {
      fs.writeFileSync(path.join(__dirname, outputFile), contents);
    } catch (error) {
      console.error(`An issue occurred while attempting to write to the output file: ${error}`);
      process.exit(1);
    }
  }
}

class OrderedList implements Organize {
  private numbers: number[] = [];

  constructor(numbers: number[]) {
    this.numbers = numbers;
  }

  addNumbers(numbers: number[]) {
    this.numbers.push(...numbers);
  }

  sort(order: "asc" | "desc" = "desc"): void {
    this.numbers.sort((a, b) => (order === "asc" ? a - b : b - a));
  }

  toString() {
    return this.numbers.join(", ");
  }
}

async function getUserInput(question: string): Promise<string> {
  return new Promise((resolve) => {
    const readingInput = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readingInput.question(question, (answer) => {
      readingInput.close();
      resolve(answer);
    });
  });
}

async function main() {
  const inputFile = await getUserInput("Please provide the name of the input file: ");
  const delimiter = await getUserInput("Please input the separator utilized within the input file: ");
  const orderChoice = await getUserInput("Please indicate the sorting arrangement (enter 'asc' for ascending, or any other value for descending): ");
  const order = orderChoice === "asc" ? "asc" : "desc";

  const fileContent = FileManager.readInputFile(inputFile);
  const numStrings = fileContent.split(delimiter);
  const numbers = numStrings.map((s) => parseInt(s, 10));
  
  const orderedList = new OrderedList(numbers);
  orderedList.sort(order);
  const result = orderedList.toString();

  const outputFile = await getUserInput("Please input the name of the output file (default: output.txt): ");
  const finalOutputFile = outputFile || "output.txt";

  FileManager.writeOutputFile(finalOutputFile, result);
}

main();
