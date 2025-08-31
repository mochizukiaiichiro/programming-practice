import normalizeInput from './normalizeInput.js';
import parseMultiLine from './parseMultiLine.js';
import parseSingleLine from './parseSingleLine.js';

/**
 * 汎用入力パーサ
 * - 半角/全角スペース, タブ, カンマ, 改行に対応（空白・改行は normalizeInput で正規化）
 * - デフォルトは「単一値でも配列」で返す
 * - オプション primitive: true のときのみ、単一行かつ要素数1の場合に限りプリミティブを返す
 *
 * 返却形式:
 * - 単一行: TokenArray（例: ['a'] / [1,2,3]）
 * - 複数行: TokenMatrix（例: [['a','b'],['c','d']]）
 * - primitive: true かつ単一行・要素数1のときのみ Token（例: 'a' / 1）
 *
 * @param {string} input 入力文字列
 * @param {object} [options] オプション
 * @param {boolean} [options.primitive=false] 単一行・単一要素のとき、配列ではなくプリミティブを返す
 * @returns {Token|TokenArray|TokenMatrix}
 *
 * @example
 * splitTokens('a');                         // ['a']
 * splitTokens('a', { primitive: true });    // 'a'
 * splitTokens('1 2 3');                     // [1,2,3]
 * splitTokens('a b\nc d');                  // [['a','b'],['c','d']]
 */
export default function splitTokens(input, { primitive = false } = {}) {
  const normalized = normalizeInput(input);
  const isSingleLine = !normalized.includes('\n');

  // 単一行か複数行で処理を分岐
  const result = isSingleLine ? parseSingleLine(normalized) : parseMultiLine(normalized);

  // オプションかつ単一値はプリミティブ値に変換
  return primitive && isSingleLine && result.length === 1 ? result[0] : result;
}
