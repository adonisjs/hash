/* eslint-disable capitalized-comments,unicorn/number-literal-case,unicorn/no-abusive-eslint-disable */

/**
 * Bcrypt does not use standard base64 encoding.
 * https://hackernoon.com/the-bcrypt-protocol-is-kind-of-a-mess-4aace5eb31bd
 */

/**
 * bcrypt's own non-standard base64 dictionary.
 **/
const BASE64_CODE = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('')

/* eslint-disable prettier/prettier */
const BASE64_INDEX = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 54,
  55, 56, 57, 58, 59, 60, 61, 62, 63, -1, -1, -1, -1, -1, -1, -1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, -1, -1, -1, -1, -1, -1, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
  -1, -1, -1, -1, -1,
]
/* eslint-enable prettier/prettier */

/**
 * Encodes a Buffer to base64 using the bcrypt's base64 dictionary.
 * @param {Buffer} buff Buffer to encode.
 * @returns {string} The buffer encoded as a string.
 */
function encode(buff) {
  const len = buff.byteLength
  let off = 0
  const stra = []

  while (off < len) {
    let c1 = buff[off++] & 0xff
    stra.push(BASE64_CODE[(c1 >> 2) & 0x3f])
    c1 = (c1 & 0x03) << 4
    if (off >= len) {
      stra.push(BASE64_CODE[c1 & 0x3f])
      break
    }
    let c2 = buff[off++] & 0xff
    c1 |= (c2 >> 4) & 0x0f
    stra.push(BASE64_CODE[c1 & 0x3f])
    c1 = (c2 & 0x0f) << 2
    if (off >= len) {
      stra.push(BASE64_CODE[c1 & 0x3f])
      break
    }
    c2 = buff[off++] & 0xff
    c1 |= (c2 >> 6) & 0x03
    stra.push(BASE64_CODE[c1 & 0x3f])
    stra.push(BASE64_CODE[c2 & 0x3f])
  }
  return stra.join('')
}

/**
 * Decodes a base64 encoded string using the bcrypt's base64 dictionary.
 * @param {string} str String to decode.
 * @returns {Buffer} The string decoded as a Buffer.
 * @inner
 */
function decode(str) {
  let off = 0
  let olen = 0
  const slen = str.length
  const stra = []
  const len = str.length

  while (off < slen - 1 && olen < len) {
    let code = str.charCodeAt(off++)
    const c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1
    code = str.charCodeAt(off++)
    const c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1
    if (c1 === -1 || c2 === -1) break
    let o = (c1 << 2) >>> 0
    o |= (c2 & 0x30) >> 4
    stra.push(String.fromCharCode(o))
    if (++olen >= len || off >= slen) break
    code = str.charCodeAt(off++)
    const c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1
    if (c3 === -1) break
    o = ((c2 & 0x0f) << 4) >>> 0
    o |= (c3 & 0x3c) >> 2
    stra.push(String.fromCharCode(o))
    if (++olen >= len || off >= slen) break
    code = str.charCodeAt(off++)
    const c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1
    o = ((c3 & 0x03) << 6) >>> 0
    o |= c4
    stra.push(String.fromCharCode(o))
    ++olen
  }
  const buffa = []
  for (off = 0; off < olen; off++) buffa.push(stra[off].charCodeAt(0))
  return Buffer.from(buffa)
}

module.exports = {
  encode,
  decode,
}
