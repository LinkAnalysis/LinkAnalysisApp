import Papa from "papaparse"
import fs from "fs"

export function parseCSV(filename) {
  return new Promise((resolve, reject) => {
    const file = fs.readFileSync(filename, "utf8")
    Papa.parse(file, {
      header: true,
      delimiter: ",",
      complete: results => resolve(results.data),
      error: error => reject(error),
    })
  })
}
