# 旧コードの削除

## Context

voice-collection.md に基づく新アプリへの移行に伴い、旧 transcript-search 関連のドキュメント・実装・サーバーサイドコードを削除する。音声データは R2 に直接置くだけで、サーバーサイド固有の API 処理は不要。フロントエンドの旧コードは既に削除済み（commit 982a9d5）だが、ドキュメントと transcriptor サービスが残っている。

---

## 削除対象

### 1. transcriptor サービス全体を削除

**ディレクトリ:** `services/transcriptor/`

音声データは R2 に直接配置するため、サーバーサイド API 処理は不要。

### 2. 旧ドメインドキュメントを削除

- `docs/domain/transcript-search.md`
- `docs/domain/transcript-search-ui.md`

### 3. `docs/backend/` ディレクトリを整理

`voice-collection-data.md` のみ残す必要あり。それ以外は transcriptor 前提のドキュメント。

**移動:** `docs/backend/voice-collection-data.md` → `docs/data/voice-collection-data.md`

**削除（ディレクトリごと）:**
- `docs/backend/server-architecture.md`
- `docs/backend/api-design.md`
- `docs/backend/domain-modeling.md`
- `docs/backend/function-documentation.md`
- `docs/backend/sql-antipatterns.md`
- `docs/backend/pr-guidelines.md`
- `docs/backend/usecase-rules.md`
- `docs/backend/datetime-handling.md`
- `docs/backend/r2-parquet-duckdb-architecture.md`
- `docs/backend/r2-parquet-duckdb-investigation.md`

### 4. 旧ワイヤーフレームを削除

`services/web/wireframe/` ディレクトリごと削除（中身: `transcript-search.html`）

---

## 更新対象

### 5. `docs/domain/README.md`

transcript-search.md, transcript-search-ui.md への参照を削除。

### 6. `README.md` (ルート)

- 説明文を voice-collection に更新
- transcriptor への参照を削除
- Project Structure から transcriptor を削除

### 7. `services/web/README.md`

TanStack テンプレートのボイラープレート → voice-collection アプリの簡潔な説明に書き換え。

### 8. `CLAUDE.md` (vspo-search/)

- `pnpm --filter @vspo/transcriptor dev` コマンドを削除
- dev コマンドを web 用に更新

### 9. `knip.json`

`services/transcriptor` ワークスペース設定を削除。`@duckdb/duckdb-wasm` の ignoreDependencies も不要であれば削除。

### 10. `.github/workflows/cf-deploy.yml`

- `workflow_dispatch.inputs.service.options` から `transcriptor` を削除
- `paths-filter` の `transcriptor` フィルタを削除
- `matrix.include` から transcriptor の設定を削除
- `all` 選択時の matrix から `transcriptor` を削除

### 11. `scripts/security-scan.sh`

transcriptor の Docker build + Trivy scan 部分を削除。

---

## 実施順序

1. `services/transcriptor/` を削除
2. `docs/domain/transcript-search.md`, `docs/domain/transcript-search-ui.md` を削除
3. `docs/backend/voice-collection-data.md` を `docs/data/voice-collection-data.md` に移動
4. `docs/backend/` を削除
5. `services/web/wireframe/` を削除
6. 以下のファイルを更新:
   - `docs/domain/README.md`
   - `README.md` (root)
   - `services/web/README.md`
   - `CLAUDE.md` (vspo-search/)
   - `knip.json`
   - `.github/workflows/cf-deploy.yml`
   - `scripts/security-scan.sh`
7. `pnpm install` で lockfile を再生成
8. `./scripts/post-edit-check.sh` で検証

---

## 検証

1. `pnpm install` — 依存解決が正常に完了すること
2. `./scripts/post-edit-check.sh` — build + lint + type-check + test がすべて pass
3. `git diff --stat` で想定通りの変更のみであること確認
