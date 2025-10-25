import sys, os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../.."))  # src を追加
from util.splitTokens_py.src.splitTokens import splitTokens

# 入力処理
[n, _], *rest = splitTokens(sys.stdin.read())

# データ変換処理（配列→構造体（辞書型））
members = [dict(zip(["nickname", "old", "birth", "state"], row)) for row in rest[:n]]

# データ更新処理（nicknameを更新）
for a, nn in rest[n:]:
    members[a - 1]["nickname"] = nn

# 出力処理
for m in members:
    print(f'{m["nickname"]} {m["old"]} {m["birth"]} {m["state"]}')
