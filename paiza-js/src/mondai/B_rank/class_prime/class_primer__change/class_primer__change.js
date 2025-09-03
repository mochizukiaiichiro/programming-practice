import fs from 'fs';
import splitTokens from '../../../../util/splitTokens-js/src/splitTokens.js'

// 入力処理
const input = splitTokens(fs.readFileSync(0, 'utf8')); //const input = splitTokens(require('fs').readFileSync(0, 'utf8'));
const [[n], ...rest] = input;

// データ変換処理（配列→構造体）
const members = rest.slice(0, n).map(([nickname, old, birth, state]) => (
  { nickname, old, birth, state }
));

// データ更新処理（nicknameを更新）
rest.slice(n).forEach(([i, name]) => {
  members[i - 1].nickname = name
});

// 出力処理
members.forEach(({ nickname, old, birth, state }) => {
  console.log(`${nickname} ${old} ${birth} ${state}`)
});