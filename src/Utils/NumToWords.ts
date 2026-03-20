const aToWords = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
];
const bToWords = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

export function inWords(num: number) {
    if ((num = num || 0) === 0) return "Zero";
    const n = (`000000000${num}`).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return "";
    let str = "";
    str += (n[1] != "00") ? (aToWords[Number(n[1])] || bToWords[n[1][0] as any] + " " + aToWords[n[1][1] as any]) + "Crore " : "";
    str += (n[2] != "00") ? (aToWords[Number(n[2])] || bToWords[n[2][0] as any] + " " + aToWords[n[2][1] as any]) + "Lakh " : "";
    str += (n[3] != "00") ? (aToWords[Number(n[3])] || bToWords[n[3][0] as any] + " " + aToWords[n[3][1] as any]) + "Thousand " : "";
    str += (n[4] != "0") ? (aToWords[Number(n[4])] || bToWords[n[4][0] as any] + " " + aToWords[n[4][1] as any]) + "Hundred " : "";
    str += (n[5] != "00") ? ((str != "") ? "and " : "") + (aToWords[Number(n[5])] || bToWords[n[5][0] as any] + " " + aToWords[n[5][1] as any]) : "";
    return str.trim();
}
