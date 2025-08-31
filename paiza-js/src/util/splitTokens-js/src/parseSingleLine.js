import { DELIMITER } from './delimiter.js';
import toValue from './toValue.js';

/**
 * 一行の文字列をトークン配列に変換する
 * - 区切り: DELIMITER（半角スペース/カンマの連続）
 * - 空文字トークンは除去
 * - 数値文字列は toValue により整数へ変換
 *
 * @param {string} str 一行入力
 * @returns {(number|string)[]} トークン配列（単一トークンでも配列）
 *
 * @example
 * parseSingleLine('a b c');    // ['a','b','c']
 * parseSingleLine('1,2,3');    // [1,2,3]
 * parseSingleLine('  7  ');    // [7]
 */
export default function parseSingleLine(str) {
  return str
    .split(DELIMITER)
    .filter((s) => s.trim() !== '') // 空文字除去
    .map(toValue);
}
