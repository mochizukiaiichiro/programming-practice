import re


# 入力文字列を正規化
def normalizeInput(s: str) -> str:
    s = re.sub(r"\r\n?", "\n", s)  # 改行統一
    s = re.sub(
        r"[\t\u3000,]", " ", s
    )  # 空白類（タブ・全角スペース・カンマ）を半角スペースに変換
    return s.strip()


# 文字型を数値型、小数型に変換
def convert_type(value):
    try:
        if "." in value:
            return float(value)
        else:
            return int(value)
    except ValueError:
        return value


# 一行の文字列を一次元配列に変換
def parseSingleLine(s: str):
    return [convert_type(token) for token in s.split()]


# 複数行の文字列を二次元配列に変換
def parseMultiLine(s: str):
    return [parseSingleLine(line) for line in s.splitlines() if line.strip()]


# 変換関数
def splitTokens(input):
    normalized = normalizeInput(input)
    isSingleLine = "\n" not in normalized
    # 単一行か複数行で処理を分岐
    return parseSingleLine(normalized) if isSingleLine else parseMultiLine(normalized)
