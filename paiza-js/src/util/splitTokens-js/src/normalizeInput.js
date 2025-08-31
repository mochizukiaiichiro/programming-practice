/**
 * 入力文字列をパース前に正規化する
 * - 改行コードをLFに統一（CRLF/CR → LF）
 * - タブ/全角スペース/カンマを半角スペースに変換
 * - 先頭末尾の空白を除去
 *
 * @param {string} str 入力文字列
 * @returns {string} 正規化後の文字列
 *
 * @example
 * normalizeInput(' a\tb\u3000c\r\n');
 * // => 'a b c'
 */
export default function normalizeInput(str) {
  return str
    .replace(/\r\n?/g, '\n') // 改行統一
    .replace(/\t/g, ' ') // タブ → 半角スペース
    .replace(/\u3000/g, ' ') // 全角スペース → 半角
    .replace(/,/g, ' ') // カンマ → 半角スペース
    .trim(); // 前後空白除去
}
