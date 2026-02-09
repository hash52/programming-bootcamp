# DB教材 序章〜第3章の完成情報

## 作成日: 2026-02-08

## 作成したファイル
1. `docs/docs/db/basics/_category_.json` - basicsサブカテゴリ定義
2. `docs/docs/db/basics/00_ai_and_database.mdx` - 序章: AI時代のデータベース学習
3. `docs/docs/db/basics/01_why_database.mdx` - 第1章: データベースの必要性
4. `docs/docs/db/basics/02_table_design.mdx` - 第2章: テーブル設計の基礎
5. `docs/docs/db/basics/03_crud_operations.mdx` - 第3章: データの作成・更新・削除

## 変更したファイル
- `docs/src/components/OneCompilerCodeBlock.tsx` - Language型に `"postgresql"` を追加
- `docs/src/structure.ts` - カテゴリ分割（db → db/basics, db/select, db/design）+ Topic定義追加

## 削除したファイル
- `docs/docs/db/introduction.md`
- `docs/docs/db/select.mdx`

## structure.ts カテゴリ構成
- `"db/basics"` → "データベース - 基礎"
- `"db/select"` → "データベース - SELECT"
- `"db/design"` → "データベース - 設計"

## Topic定義
### 第1章: 01_why_database (5 Questions)
- file_management_issues (KNOW/Easy)
- dbms_functions (KNOW/Easy)
- table_row_column (KNOW/Easy)
- read_sample_db (READ/Easy)
- select_all_from_table (WRITE/Easy)

### 第2章: 02_table_design (8 Questions)
- create_table_basics (WRITE/Easy)
- data_type_selection (KNOW/Easy)
- not_null_role (KNOW/Easy)
- unique_role (KNOW/Easy)
- primary_key_role (KNOW/Easy)
- foreign_key_role (KNOW/Medium)
- check_constraint (WRITE/Medium)
- design_table_from_requirements (WRITE/Medium)

### 第3章: 03_crud_operations (8 Questions)
- insert_data (WRITE/Easy)
- insert_with_fk (WRITE/Medium)
- update_with_where (WRITE/Easy)
- delete_with_where (WRITE/Easy)
- fk_constraint_on_delete (KNOW/Medium)
- transaction_necessity (KNOW/Medium)
- commit_rollback_role (KNOW/Medium)
- safe_multi_table_update (WRITE/Hard)

## 序章について
- structure.tsへのTopic定義は追加しない（設計書に定義なし）
- Step番号構成は使用しない（短い導入のため）

## OneCompilerCodeBlock
- language="postgresql" を使用
- codeId は全て仮値 "TODO" — 後で手動でOneCompilerにコード作成してIDを差し替える

## サンプルDB
departments (dept_id, dept_name, location) と employees (emp_id, emp_name, dept_id, hire_date, salary, email) を使用
