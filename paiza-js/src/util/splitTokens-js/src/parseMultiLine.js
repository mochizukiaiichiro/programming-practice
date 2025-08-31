import { DELIMITER } from './delimiter.js';
import parseSingleLine from './parseSingleLine.js';
import toValue from './toValue.js';

/**
 * 複数行の文字列を二次元配列に変換する
 * - 空行は無視
 * - 各行は DELIMITER で分割し、空文字を除去
 * - 数値文字列は toValue により整数へ変換
 *
 * @param {string} str 複数行入力
 * @returns {Array<(number|string)[]>} 二次元配列（行ごとのトークン配列）
 *
 * @example
 * parseMultiLine('a b c\nd e f');
 * // => [['a','b','c'],['d','e','f']]
 *
 * parseMultiLine('1 2 3\n4 5 6');
 * // => [[1,2,3],[4,5,6]]
 */
export default function parseMultiLine(str) {
  return str
    .split('\n')
    .filter((s) => s.trim() !== '') // 空文字除去
    .map(parseSingleLine);
}
