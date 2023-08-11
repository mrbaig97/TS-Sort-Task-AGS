import fs from "fs";
import path from "path";
import readline from "readline";


//An interface designed for classes that are capable of being organized in a sorted manner.
interface Organize {
  sort(): void
}

//--Error Handling--//
//A class that supplies static functions for the purpose of reading and saving files.

class FileManager {
  // Processes and retrieves the contents stored in an input file.
  static readInputFile(inputFile: string): string {
    try {
      return fs.readFileSync(path.join(__dirname, inputFile), "utf-8");
    } catch (error) {
      //Manages issues that may arise when attempting to read the input file.
      console.error(`An issue occurred while attempting to read the input file: ${error}`);
      process.exit(1);
    }
  }
    //Saves the content into an output file.
    static writeOutputFile(outputFile: string, contents: string) {
    try {
      fs.writeFileSync(path.join(__dirname, outputFile), contents);
    } catch (error) {
    // Manages errors that might occur when attempting to write to the output file.
      console.error(`An issue occurred while attempting to read the output file.: ${error}`);
      process.exit(1);
    }
  }
}
// A class that defines a collection of numbers that is sortable.
class OrderedList implements Organize {
  // The collection of numbers to be arranged in order.
  private numbers: number[] = [];

  // Creates a NumberList instance using data from a file.
  constructor(inputFile: string, delimiter: string) {
  // Retrieve data from the input file and divide it into an array of strings representing numbers.
    const file = fs.readFileSync(path.join(__dirname, inputFile), "utf-8");
    const numStrings = file.split(delimiter);
  // Convert each string into an integer and include it in the numbers array.
    this.numbers = numStrings.map((s) => parseInt(s, 10));
  }

  addNumbers(numbers: number[]) {
    this.numbers.push(...numbers);
  }

  // Arranges the collection of numbers in a default descending order.
  sort(order: "asc" | "desc" = "desc"): void {
    this.numbers.sort((a, b) => (order === "asc" ? a - b : b - a));
  }

// Converts the collection of numbers into a string format.
  toString() {
    return this.numbers.join(", ");
  }
}

// The primary function of the program
function main() {
  const readingInput = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Prompt the user for input file and delimiter
  readingInput.question("Please provide the name of the input file (include the filename along with its extension, such as 'input.txt'): ", function (inputFile) {
    readingInput.question("Please input the separator utilized within the input file: ", function (delimiter) {
      // Create a new OrderedList object from the input file
      const numbers = new OrderedList(inputFile, delimiter);

      // Request the user to specify the sorting sequence.
      readingInput.question("Please indicate the sorting arrangement (enter '1' for ascending, or any other value for descending): ", function (order) {
      // Arrange the numbers according to the indicated order.
        numbers.sort(order === "1" ? "asc" : "desc");

      // Convert the sorted numbers to a string
        const result = numbers.toString();

      // Request the user to provide the name of the output file.
        readingInput.question("Please input the name of the output file (default: output.txt): ", function (outputFile) {
          readingInput.close();
          //If no name is provided, utilize the default name.
          outputFile = outputFile || "output.txt";
          //Save the arranged numbers to the output file.
            FileManager.writeOutputFile(outputFile, result);
        });
      });
    });
  });
}

// function performanceTest() {
//   // Generate an array of 1 million random numbers
//   const numbers = Array.from({ length: 1000000 }, () => Math.floor(Math.random() * 1000000));

//   // Create a new NumberList object and add the numbers to it
//   const numberList = new NumberList("","");
//   numberList.addNumbers(numbers);

//   // Record the start time
//   const startTime = Date.now();

//   // Sort the number list
//   numberList.sort();

//   // Record the end time
//   const endTime = Date.now();

//   // Calculate the duration of the sort in milliseconds
//   const duration = endTime - startTime;

//   console.log(`Sorted 1 million numbers in ${duration} ms`);
// }

main()
// performanceTest()
