# YAG_Renamer

Misskeyにおけるアカウント名を，任意の文字列からランダムに文字を取得した同じ長さの文字列に設定するツール．

**これいる？**

## 例

### 「やぎれお」の場合

- ぎぎやぎ
- ややれお
- おれやぎ
- おおおお
- etc...

## 使い方

### 環境変数を設定

ローカルで動かす場合は`.env.template`を`.env`にリネームし，以下の内容を設定します．

Deno Deployで動かす場合はダッシュボードから設定できます．

環境変数名 | 内容
-- | --
MISSKEY_HOSTNAME | アカウントがいるMisskeyインスタンスのhostname (例: "submarin.online", "misskey.io")
MISSKEY_TOKEN | プロフィール変更権限を与えたMisskeyのAPIトークン
NAME | 改変するベースとなる文字列
CRON_SCHEDULE | Cronスケジュール (例: "0 \* \* \* \*" (毎時実行))

### 実行

ローカルで動かす場合は以下のコマンドを実行します．

```sh
deno task start
```

Deno Deployではデプロイが完了し次第勝手に実行されます．たぶん．
