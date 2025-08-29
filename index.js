const express = require("express");

const app = express();
app.use(express.json());

const FULL_NAME = process.env.FULL_NAME || "john_doe";
const DOB_DDMMYYYY = process.env.DOB_DDMMYYYY || "17091999";
const EMAIL = process.env.EMAIL || "john@xyz.com";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "ABCD123";

function isNumericString(s) {
  return typeof s === "string" && /^-?\d+$/.test(s.trim());
}
function isAlphaString(s) {
  return typeof s === "string" && /^[A-Za-z]+$/.test(s.trim());
}
function toAltCapsReverse(s) {
  const r = s.split("").reverse();
  return r
    .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

app.post("/bfhl", (req, res) => {
  try {
    const payload = req.body || {};
    const arr = Array.isArray(payload.data) ? payload.data : null;
    if (!arr) return res.status(400).json({ is_success: false });

    const dataStr = arr.map((x) => (typeof x === "string" ? x : String(x)));

    const nums = dataStr.filter(isNumericString);
    const even_numbers = nums.filter(
      (n) => Math.abs(parseInt(n, 10)) % 2 === 0
    );
    const odd_numbers = nums.filter((n) => Math.abs(parseInt(n, 10)) % 2 === 1);

    const alphabetsRaw = dataStr.filter(isAlphaString);
    const alphabets = alphabetsRaw.map((s) => s.toUpperCase());

    const specials = dataStr.filter(
      (s) => !isNumericString(s) && !isAlphaString(s)
    );

    const sum = nums.reduce((a, b) => a + parseInt(b, 10), 0).toString();

    const lettersConcat = alphabetsRaw.join("");
    const concat_string = toAltCapsReverse(lettersConcat);

    res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME.toLowerCase()}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters: specials,
      sum,
      concat_string,
    });
  } catch {
    res.status(500).json({ is_success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
