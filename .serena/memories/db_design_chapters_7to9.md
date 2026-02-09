# DB教材 第7〜9章（db/design）作成記録

## 作成日: 2026-02-08

## 作成ファイル
- `docs/docs/db/design/_category_.json` - position: 3
- `docs/docs/db/design/07_normalization.mdx` - テーブルの分割と正規化
- `docs/docs/db/design/08_join.mdx` - テーブルの結合
- `docs/docs/db/design/09_er_diagram.mdx` - ER図とデータベース設計

## 変更ファイル
- `docs/src/structure.ts` - db/design カテゴリに3つのTopic定義追加

## 各章のTopic定義
### 07_normalization (8 questions)
- table_split_necessity (KNOW/Easy), update_anomalies (KNOW/Easy), first_normal_form (KNOW/Easy)
- second_normal_form (KNOW/Medium), third_normal_form (KNOW/Medium)
- normalize_table (WRITE/Medium), normalization_pros_cons (KNOW/Medium)
- design_normalized_table (WRITE/Hard)

### 08_join (9 questions)
- join_necessity (KNOW/Easy), inner_join (WRITE/Easy), table_alias (WRITE/Easy)
- left_outer_join (WRITE/Medium), inner_vs_left_join (KNOW/Medium)
- self_join (WRITE/Medium), multi_table_join (WRITE/Medium)
- join_with_where_group (WRITE/Medium), complex_join_query (WRITE/Hard)

### 09_er_diagram (8 questions)
- er_diagram_necessity (KNOW/Easy), identify_entity (READ/Easy)
- identify_attribute (READ/Easy), understand_relationship (READ/Easy)
- cardinality (KNOW/Medium), many_to_many_resolution (KNOW/Medium)
- er_to_sql (WRITE/Medium), design_er_from_requirements (WRITE/Hard)

## Mermaid ER図の活用
- 第7章: 正規化後のテーブル関係（departments-employees）、受注管理の正規化結果
- 第8章: テーブル結合の関係図、assignments中間テーブルの関係
- 第9章: 全面的にMermaid ER図を活用（エンティティ、属性、カーディナリティ、ECサイト設計）

## サンプルDB
- 引き続き departments + employees を基本に使用
- 第7章: 注文管理システム（正規化演習）も追加
- 第8章: projects + assignments テーブルを追加（多対多の中間テーブル）
- 第9章: ECサイト設計（customers, orders, order_details, products, categories, product_categories）

## codeIdは全て "TODO" で仮置き
