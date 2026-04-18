import * as XLSX from "xlsx-js-style";

/**
 * Reads an uploaded Excel or CSV file and extracts the sheet data into an array of raw objects.
 * Keys of the objects match the column names in the first row.
 */
export const extractExcelData = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        // Convert the sheet into JSON format. `raw: false` ensures all dates and numbers are converted to strings first.
        // console.log("sheet", sheet);
        const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
        // console.log("rawRows", rawRows);
        resolve(rawRows);
      } catch (err) {
        reject(new Error("Unable to parse file. Please upload a valid Excel or CSV."));
      }
    };
    reader.onerror = () => reject(new Error("File read error."));
    reader.readAsArrayBuffer(file);
  });
};
