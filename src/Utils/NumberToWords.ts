export const NumberToWords = (num: number): string => {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const convertBelowThousand = (n: number): string => {
    let str = "";

    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }

    if (n > 0) {
      str += ones[n] + " ";
    }

    return str.trim();
  };

  if (num === 0) return "Zero";

  let result = "";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const hundred = num;

  if (crore) result += convertBelowThousand(crore) + " Crore ";
  if (lakh) result += convertBelowThousand(lakh) + " Lakh ";
  if (thousand) result += convertBelowThousand(thousand) + " Thousand ";
  if (hundred) result += convertBelowThousand(hundred);

  return result.trim();
};
