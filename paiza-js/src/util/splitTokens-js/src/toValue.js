/**
 * トークン文字列を値に変換する
 * - 符号付きの整数は Number に変換
 * - それ以外は文字列として返す（小数や指数表現は変換しない）
 *
 * @param {string} s トークン文字列
 * @returns {number|string} 変換後の値
 *
 * @example
 * toValue('42');    // 42
 * toValue('-7');    // -7
 * toValue('12.5');  // '12.5'
 * toValue('apple'); // 'apple'
 */
export default function toValue(s) {
  return /^[-+]?\d*\.?\d+$/.test(s) ? Number(s) : s;
}
