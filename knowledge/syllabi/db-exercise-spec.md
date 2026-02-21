# DB演習問題 AI仕様書

本ドキュメントは、DB章（第1〜9章）の演習問題ファイルを作成するためのAI向け仕様書である。

---

## 1. サンプルDB（全章共通）

### テーブル構成

```sql
-- 部門テーブル
CREATE TABLE departments (
    dept_id   INTEGER      PRIMARY KEY,
    dept_name VARCHAR(50)  NOT NULL,
    location  VARCHAR(50)
);

-- 社員テーブル
CREATE TABLE employees (
    emp_id    INTEGER      PRIMARY KEY,
    emp_name  VARCHAR(50)  NOT NULL,
    dept_id   INTEGER      REFERENCES departments(dept_id),
    hire_date DATE,
    salary    INTEGER      CHECK (salary > 0),
    email     VARCHAR(100) UNIQUE
);

-- プロジェクトテーブル
CREATE TABLE projects (
    project_id   INTEGER     PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    start_date   DATE,
    end_date     DATE
);

-- アサインメントテーブル（多対多の中間テーブル）
CREATE TABLE assignments (
    emp_id     INTEGER REFERENCES employees(emp_id),
    project_id INTEGER REFERENCES projects(project_id),
    role       VARCHAR(50),
    PRIMARY KEY (emp_id, project_id)
);
```

### サンプルデータ

```sql
INSERT INTO departments VALUES (1, '営業部', '東京');
INSERT INTO departments VALUES (2, '開発部', '大阪');
INSERT INTO departments VALUES (3, '人事部', '東京');
INSERT INTO departments VALUES (4, '広報部', '福岡');

INSERT INTO employees VALUES (1, '田中太郎',   1, '2020-04-01', 350000, 'tanaka@example.com');
INSERT INTO employees VALUES (2, '鈴木花子',   2, '2019-10-01', 420000, 'suzuki@example.com');
INSERT INTO employees VALUES (3, '佐藤次郎',   2, '2021-04-01', 310000, 'sato@example.com');
INSERT INTO employees VALUES (4, '渡辺あかり', NULL, '2022-04-01', 280000, 'watanabe@example.com');
INSERT INTO employees VALUES (5, '中村健一',   1, '2018-07-01', 480000, 'nakamura@example.com');

INSERT INTO projects VALUES (1, '新サービス開発', '2024-01-01', '2024-06-30');
INSERT INTO projects VALUES (2, '基幹システム刷新', '2024-04-01', NULL);

INSERT INTO assignments VALUES (2, 1, 'リーダー');
INSERT INTO assignments VALUES (3, 1, 'メンバー');
INSERT INTO assignments VALUES (2, 2, 'メンバー');
```

---

## 2. SQL記述規則

全WRITE型問題の問題文冒頭に以下のAdmonitionを挿入すること。

```mdx
:::note SQL記述の約束
- テーブル名・カラム名は **小文字** で入力する（例: `employees`, `dept_id`）
- SQLキーワードは **大文字** で入力する（例: `SELECT`, `FROM`, `WHERE`）

正しい例: `SELECT emp_name FROM employees WHERE dept_id = 1;`
:::
```

---

## 3. MDXファイルの共通形式

### ファイルパス

```
docs/src/questions/db/{subcategory}/{topicId}/{questionId}.mdx
```

### frontmatter テンプレート（fillInBlank）

```yaml
---
id: "db/{subcategory}/{topicId}#{questionId}"
title: "..."
type: "WRITE"
difficulty: "Easy" | "Medium" | "Hard"
format: "fillInBlank"
topicId: "{topicId}"
category: "db/{subcategory}"
fillInBlankAnswers:
  blank1: ["正解", "正解の別表記"]
  blank2: "正解（単一）"
sampleAnswer: "完成形のSQL文"
explanation: |
  解説文（である調）
---
```

### frontmatter テンプレート（multipleChoice）

```yaml
---
id: "db/{subcategory}/{topicId}#{questionId}"
title: "..."
type: "KNOW" | "READ"
difficulty: "Easy" | "Medium" | "Hard"
format: "multipleChoice"
topicId: "{topicId}"
category: "db/{subcategory}"
multipleSelect: false
choices:
  - id: "A"
    text: "..."
  - id: "B"
    text: "..."
  - id: "C"
    text: "..."
  - id: "D"
    text: "..."
answers:
  correct: ["A"]
explanation: |
  解説文（である調）
---
```

### MDX本文テンプレート（fillInBlank）

```mdx
import { BlankInput } from '@site/src/components/question/inputs/BlankInput';
import { CodeBlock } from '@site/src/components/question/CodeBlock';

:::note SQL記述の約束
- テーブル名・カラム名は **小文字** で入力する（例: `employees`, `dept_id`）
- SQLキーワードは **大文字** で入力する（例: `SELECT`, `FROM`, `WHERE`）

正しい例: `SELECT emp_name FROM employees WHERE dept_id = 1;`
:::

問題文。

<CodeBlock>
<BlankInput id="blank1" />{` rest of SQL`}
</CodeBlock>
```

---

## 4. 全問仕様

### db/basics - 第1章: データベースの必要性（topicId: 01_why_database）

---

#### read_sample_db（READ / multipleChoice / Easy）

**問題文**: 以下のサンプルDBのテーブル構造を見て、正しい説明を選べ。
（employees テーブルの dept_id は NULL を許可し、departments テーブルを参照する外部キーである）

**選択肢**:
- A: `employees.dept_id` は `departments.dept_id` を参照する外部キーであり、NULLも許可される
- B: `employees` テーブルには部門ごとに1人しか所属できない制約がある
- C: `departments.dept_id` はNULLを許可する
- D: `employees.salary` にはどんな値でも入れることができる

**正解**: A

**解説**: `employees.dept_id` は `REFERENCES departments(dept_id)` で外部キーが設定されているが、`NOT NULL` 制約がないためNULLも許可される。部門未所属の社員（渡辺あかり）がその例である。`salary` には `CHECK (salary > 0)` 制約があるため任意の値は入れられない。

---

#### select_all_from_table（WRITE / fillInBlank / Easy）

**問題文**: `employees` テーブルの全データを取得するSQL文の空欄を埋めよ。

**CodeBlock**:
```
[blank1] * [blank2] employees;
```

**正解**:
- blank1: `["SELECT", "select"]`
- blank2: `["FROM", "from"]`

**sampleAnswer**: `SELECT * FROM employees;`

**解説**: `SELECT *` ですべての列を取得し、`FROM テーブル名` でどのテーブルからデータを取得するかを指定する。`*` はすべての列を意味するワイルドカードである。

---

### db/basics - 第2章: テーブル設計の基礎（topicId: 02_table_design）

---

#### create_table_basics（WRITE / fillInBlank / Easy）

**問題文**: 以下のCREATE TABLE文の空欄を埋めて、`departments` テーブルを作成せよ。

**CodeBlock**:
```
[blank1] TABLE departments (
    dept_id  INTEGER      [blank2] KEY,
    dept_name VARCHAR(50) [blank3] NULL
);
```

**正解**:
- blank1: `["CREATE", "create"]`
- blank2: `["PRIMARY", "primary"]`
- blank3: `["NOT", "not"]`

**sampleAnswer**: `CREATE TABLE departments (dept_id INTEGER PRIMARY KEY, dept_name VARCHAR(50) NOT NULL);`

**解説**: `CREATE TABLE` でテーブルを作成する。`PRIMARY KEY` は各行を一意に識別する主キー制約で、`NOT NULL` はNULL値を禁止する制約である。

---

#### data_type_selection（KNOW / multipleChoice / Easy）

**問題文**: 社員の名前を格納する列のデータ型として最も適切なものを選べ。

**選択肢**:
- A: `INTEGER`（整数）
- B: `VARCHAR(50)`（最大50文字の文字列）
- C: `DATE`（日付）
- D: `BOOLEAN`（真偽値）

**正解**: B

**解説**: 文字列を格納するには `VARCHAR(n)` を使用する。`n` は格納できる最大文字数である。`INTEGER` は整数、`DATE` は日付、`BOOLEAN` は真偽値を格納する型である。

---

#### not_null_role（KNOW / multipleChoice / Easy）

**問題文**: `NOT NULL` 制約を設定した列の説明として正しいものを選べ。

**選択肢**:
- A: 値が重複することを禁止する
- B: 値を省略（NULL）することを禁止する
- C: 整数値のみ格納できる
- D: 他のテーブルの主キーを参照する

**正解**: B

**解説**: `NOT NULL` 制約はその列にNULL値（未入力状態）を禁止する制約である。必須項目（名前、IDなど）に設定することでデータの欠落を防げる。値の重複禁止は `UNIQUE` 制約、他テーブルへの参照は外部キー（`REFERENCES`）が担当する。

---

#### unique_role（KNOW / multipleChoice / Easy）

**問題文**: `UNIQUE` 制約の説明として正しいものを選べ。

**選択肢**:
- A: 列にNULLを入れることを禁止する
- B: 列の値を他のテーブルで参照できるようにする
- C: 列の値が重複しないことを保証する
- D: 列の値が0以上であることを保証する

**正解**: C

**解説**: `UNIQUE` 制約はその列に重複した値を入れることを禁止する。メールアドレスや社員番号など、全行で値が一意である必要がある列に設定する。NULLの禁止は `NOT NULL`、他テーブルへの参照は外部キー、値の範囲制限は `CHECK` 制約が担当する。

---

#### primary_key_role（KNOW / multipleChoice / Easy）

**問題文**: 主キー（`PRIMARY KEY`）の説明として正しいものを選べ。

**選択肢**:
- A: テーブル内の各行を一意に識別するためのキー（`NOT NULL` かつ `UNIQUE` が保証される）
- B: 他のテーブルの主キーを参照するためのキー
- C: 列の値が重複しないことのみを保証する制約
- D: NULLを許可する特別な制約

**正解**: A

**解説**: 主キーはテーブル内の各行を一意に識別する列（または列の組み合わせ）である。`NOT NULL` と `UNIQUE` を両方満たすことが保証される。他テーブルの主キーを参照するのは外部キー（`FOREIGN KEY`）である。

---

#### check_constraint（WRITE / fillInBlank / Medium）

**問題文**: `salary` が0より大きい値のみ許可する `CHECK` 制約を含む列定義の空欄を埋めよ。

**CodeBlock**:
```
salary INTEGER [blank1] (salary [blank2] 0)
```

**正解**:
- blank1: `["CHECK", "check"]`
- blank2: `[">"]`

**sampleAnswer**: `salary INTEGER CHECK (salary > 0)`

**解説**: `CHECK` 制約は条件式を指定して、条件を満たさない値の挿入・更新を禁止する。`salary > 0` と記述することで、給与に0以下の値が入らないよう保証できる。

---

#### design_table_from_requirements（WRITE / fillInBlank / Medium）

**問題文**: 以下の要件から `projects` テーブルの `CREATE TABLE` 文を完成させよ。
- `project_id`（整数、主キー）
- `project_name`（最大100文字の文字列、NULL禁止）

**CodeBlock**:
```
[blank1] TABLE projects (
    project_id   INTEGER      [blank2] KEY,
    project_name [blank3](100) NOT NULL
);
```

**正解**:
- blank1: `["CREATE", "create"]`
- blank2: `["PRIMARY", "primary"]`
- blank3: `["VARCHAR", "varchar"]`

**sampleAnswer**: `CREATE TABLE projects (project_id INTEGER PRIMARY KEY, project_name VARCHAR(100) NOT NULL);`

**解説**: 要件を読んでCREATE TABLE文に変換する。整数は `INTEGER`、文字列は `VARCHAR(n)`（nは最大文字数）を使用する。主キーは `PRIMARY KEY`、NULL禁止は `NOT NULL` で指定する。

---

### db/basics - 第3章: データの作成・更新・削除（topicId: 03_crud_operations）

---

#### insert_with_fk（WRITE / fillInBlank / Medium）

**問題文**: `employees` テーブルに、以下のデータを追加するSQL文を完成させよ。
- `emp_id`=10, `emp_name`='新入社員', `dept_id`=1, `hire_date`='2024-04-01', `salary`=250000, `email`='new@example.com'

**CodeBlock**:
```
INSERT [blank1] employees (emp_id, emp_name, dept_id, hire_date, salary, email)
[blank2] (10, '新入社員', 1, '2024-04-01', 250000, 'new@example.com');
```

**正解**:
- blank1: `["INTO", "into"]`
- blank2: `["VALUES", "values"]`

**sampleAnswer**: `INSERT INTO employees (emp_id, emp_name, dept_id, hire_date, salary, email) VALUES (10, '新入社員', 1, '2024-04-01', 250000, 'new@example.com');`

**解説**: `INSERT INTO テーブル名 (列名...) VALUES (値...)` の形式でデータを追加する。外部キー制約があるため、`dept_id` には `departments` テーブルに存在する値（1〜4）のみ指定できる。存在しない値を指定すると外部キー制約エラーが発生する。

---

#### update_with_where（WRITE / fillInBlank / Easy）

**問題文**: `emp_id` が1の社員の `salary` を380000に更新するSQL文を完成させよ。

**CodeBlock**:
```
[blank1] employees
[blank2] salary = 380000
WHERE emp_id = 1;
```

**正解**:
- blank1: `["UPDATE", "update"]`
- blank2: `["SET", "set"]`

**sampleAnswer**: `UPDATE employees SET salary = 380000 WHERE emp_id = 1;`

**解説**: データを更新するには `UPDATE テーブル名 SET 列名 = 値 WHERE 条件` を使用する。`WHERE` 句を省略すると全行が更新されるため、必ず対象を絞り込む条件を指定すること。

---

#### delete_with_where（WRITE / fillInBlank / Easy）

**問題文**: `emp_id` が10の社員データを削除するSQL文を完成させよ。

**CodeBlock**:
```
[blank1] [blank2] employees
WHERE emp_id = 10;
```

**正解**:
- blank1: `["DELETE", "delete"]`
- blank2: `["FROM", "from"]`

**sampleAnswer**: `DELETE FROM employees WHERE emp_id = 10;`

**解説**: データを削除するには `DELETE FROM テーブル名 WHERE 条件` を使用する。`WHERE` 句を省略すると全データが削除されるため、必ず条件を指定すること。

---

#### fk_constraint_on_delete（KNOW / multipleChoice / Medium）

**問題文**: 以下のSQL文を実行したとき、何が起きるか選べ。
（`employees` テーブルに `dept_id=1` の社員が存在する状態で実行）

```sql
DELETE FROM departments WHERE dept_id = 1;
```

**選択肢**:
- A: 正常に削除される
- B: 外部キー制約エラーが発生し、削除できない
- C: `employees` テーブルの該当行も自動的に削除される
- D: `employees` テーブルの `dept_id` が自動的にNULLに更新される

**正解**: B

**解説**: `employees.dept_id` は `departments.dept_id` を参照する外部キーが設定されている。この外部キーを参照している行が存在する場合、参照先（`departments`）のデータは削除できず、外部キー制約エラーが発生する。自動削除（CASCADE）や自動NULL化（SET NULL）はそれぞれ `ON DELETE CASCADE`・`ON DELETE SET NULL` を明示的に設定した場合のみ動作する。

---

#### transaction_necessity（KNOW / multipleChoice / Medium）

**問題文**: トランザクションを使う最大の目的として正しいものを選べ。

**選択肢**:
- A: SQLの実行速度を向上させるため
- B: 複数の操作を「全部成功」か「全部失敗」に一括管理するため
- C: 複数のテーブルに同時にアクセスできるようにするため
- D: データのバックアップを自動的に作成するため

**正解**: B

**解説**: トランザクションは複数のSQL操作をひとまとまりとして扱う仕組みである。「振込元の残高を減らし、振込先の残高を増やす」のような処理で、片方だけ成功してしまうと不整合が生じる。トランザクションを使えば、どちらも成功した場合のみ確定（COMMIT）し、一方が失敗したら両方取り消す（ROLLBACK）ことができる。

---

#### commit_rollback_role（KNOW / multipleChoice / Medium）

**問題文**: `ROLLBACK` を実行したとき、何が起きるか選べ。

**選択肢**:
- A: トランザクション中に行った変更を確定して保存する
- B: トランザクション中に行った変更を取り消して元の状態に戻す
- C: テーブルを削除してデータを初期化する
- D: 次のトランザクションを自動的に開始する

**正解**: B

**解説**: `ROLLBACK` はトランザクション中に行ったすべての変更を取り消し、`BEGIN` する前の状態に戻す命令である。対して `COMMIT` は変更を確定して保存する命令である。失敗したときは `ROLLBACK`、成功したら `COMMIT` という使い分けが基本となる。

---

#### safe_multi_table_update（WRITE / fillInBlank / Hard）

**問題文**: 以下のトランザクション処理の空欄を埋めよ。
`dept_id=1` の全社員の `salary` を10000円増やし、正常に完了したら確定する。

**CodeBlock**:
```
[blank1];
UPDATE employees SET salary = salary + 10000 WHERE dept_id = 1;
[blank2];
```

**正解**:
- blank1: `["BEGIN", "begin"]`
- blank2: `["COMMIT", "commit"]`

**sampleAnswer**: `BEGIN; UPDATE employees SET salary = salary + 10000 WHERE dept_id = 1; COMMIT;`

**解説**: `BEGIN`（または `START TRANSACTION`）でトランザクションを開始し、操作が正常に完了したら `COMMIT` で確定する。エラーが発生した場合は `ROLLBACK` で取り消す。複数テーブルにまたがる更新や重要なデータ操作では、必ずトランザクションを使うことが推奨される。

---

### db/select - 第4章: データの取得（基礎）（topicId: 04_select_basics）

---

#### select_all_data（WRITE / fillInBlank / Easy）

**問題文**: `departments` テーブルの全データを取得するSQL文を完成させよ。

**CodeBlock**:
```
[blank1] *
[blank2] departments;
```

**正解**:
- blank1: `["SELECT", "select"]`
- blank2: `["FROM", "from"]`

**sampleAnswer**: `SELECT * FROM departments;`

**解説**: `SELECT * FROM テーブル名` はテーブルの全列・全行を取得する最も基本的なSQL文である。`*` はすべての列を意味する。

---

#### select_specific_columns（WRITE / fillInBlank / Easy）

**問題文**: `employees` テーブルから `emp_name` と `salary` の列のみを取得するSQL文を完成させよ。

**CodeBlock**:
```
[blank1] emp_name, salary
FROM employees;
```

**正解**:
- blank1: `["SELECT", "select"]`

**sampleAnswer**: `SELECT emp_name, salary FROM employees;`

**解説**: 特定の列だけを取得するには `SELECT 列名1, 列名2, ...` のように列名をカンマ区切りで指定する。`*` の代わりに列名を列挙することで、必要なデータだけを効率的に取得できる。

---

#### column_alias（WRITE / fillInBlank / Easy）

**問題文**: `emp_name` を「社員名」、`salary` を「給与」という別名で取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT emp_name [blank1] 社員名, salary [blank2] 給与
FROM employees;
```

**正解**:
- blank1: `["AS", "as"]`
- blank2: `["AS", "as"]`

**sampleAnswer**: `SELECT emp_name AS 社員名, salary AS 給与 FROM employees;`

**解説**: `AS` キーワードで列に別名（エイリアス）を付けることができる。日本語の別名も使用可能で、結果の列ヘッダーに表示される。レポートや画面表示で分かりやすい名前を付けたいときに使う。

---

#### expression_column（WRITE / fillInBlank / Easy）

**問題文**: 全社員の `salary` を12倍した「年収」を計算して取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT emp_name, salary * [blank1] [blank2] 年収
FROM employees;
```

**正解**:
- blank1: `["12"]`
- blank2: `["AS", "as"]`

**sampleAnswer**: `SELECT emp_name, salary * 12 AS 年収 FROM employees;`

**解説**: `SELECT` 句では列名だけでなく計算式も記述できる。`salary * 12` のように四則演算が使えるため、データベースに保存されている値から動的に計算結果を取得できる。計算式にも `AS` で別名を付けることが推奨される。

---

#### distinct_data（WRITE / fillInBlank / Easy）

**問題文**: `employees` テーブルから `dept_id` の重複を除いた値一覧を取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT [blank1] dept_id
FROM employees;
```

**正解**:
- blank1: `["DISTINCT", "distinct"]`

**sampleAnswer**: `SELECT DISTINCT dept_id FROM employees;`

**解説**: `DISTINCT` キーワードを `SELECT` の直後に指定すると、重複する行を除いて結果を返す。どんな種類の値が存在するかを調べたいときに便利である。

---

#### limit_rows（WRITE / fillInBlank / Easy）

**問題文**: `employees` テーブルから最初の3件だけ取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT *
FROM employees
[blank1] [blank2];
```

**正解**:
- blank1: `["LIMIT", "limit"]`
- blank2: `["3"]`

**sampleAnswer**: `SELECT * FROM employees LIMIT 3;`

**解説**: `LIMIT n` で取得する行数を制限できる。大量のデータが存在する場合に先頭の数件だけ確認したいときや、ランキングの上位N件を取得したいときに使用する。

---

#### read_ai_select（READ / multipleChoice / Medium）

**問題文**: 以下のAIが生成したSQL文を見て、何を取得するSQL文か正しく説明しているものを選べ。

```sql
SELECT emp_name, salary * 12 AS 年収
FROM employees
WHERE dept_id = 2
ORDER BY salary DESC
LIMIT 3;
```

**選択肢**:
- A: 開発部（dept_id=2）の社員を年収の高い順に上位3件取得する
- B: 全社員を給与の低い順に並べて3件取得する
- C: dept_id=2の部門名と年収の合計を取得する
- D: 全部門のデータを3件ずつ取得する

**正解**: A

**解説**: SQL文を分解すると、`WHERE dept_id = 2` で開発部の社員に絞り込み、`salary * 12 AS 年収` で年収を計算し、`ORDER BY salary DESC` で給与の降順（高い順）に並べ、`LIMIT 3` で上位3件に制限している。AIが生成したSQL文も、各句の意味を理解すれば正確に読み解くことができる。

---

#### write_select_requirements（WRITE / fillInBlank / Medium）

**問題文**: 「給与が350000以上の社員の `emp_name` と `salary` を取得せよ」という要件を満たすSQL文を完成させよ。

**CodeBlock**:
```
SELECT emp_name, salary
FROM employees
WHERE salary [blank1] [blank2];
```

**正解**:
- blank1: `[">="]`
- blank2: `["350000"]`

**sampleAnswer**: `SELECT emp_name, salary FROM employees WHERE salary >= 350000;`

**解説**: 「以上」は `>=`（大なりイコール）、「以下」は `<=`、「より大きい」は `>`、「より小さい」は `<` で表現する。要件を読んで適切な比較演算子を選ぶことが重要である。

---

### db/select - 第5章: データの絞り込みと並び替え（topicId: 05_where_and_order）

---

#### where_basic（WRITE / fillInBlank / Easy）

**問題文**: `dept_id=1`（営業部）の社員を全列取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT *
FROM employees
[blank1] dept_id [blank2] 1;
```

**正解**:
- blank1: `["WHERE", "where"]`
- blank2: `["="]`

**sampleAnswer**: `SELECT * FROM employees WHERE dept_id = 1;`

**解説**: `WHERE 条件式` で行の絞り込みができる。`=` は等しいことを判定する比較演算子である。`WHERE` 句を使うことで必要なデータのみを効率的に取得できる。

---

#### where_multiple_conditions（WRITE / fillInBlank / Easy）

**問題文**: 開発部（`dept_id=2`）かつ給与が300000以上の社員を取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT *
FROM employees
WHERE dept_id = 2 [blank1] salary [blank2] 300000;
```

**正解**:
- blank1: `["AND", "and"]`
- blank2: `[">="]`

**sampleAnswer**: `SELECT * FROM employees WHERE dept_id = 2 AND salary >= 300000;`

**解説**: 複数の条件を同時に満たす行を取得するには `AND` で条件を結ぶ。どちらか一方を満たせばよい場合は `OR` を使用する。「かつ」は `AND`、「または」は `OR` と覚えると良い。

---

#### where_between（WRITE / fillInBlank / Easy）

**問題文**: 給与が300000以上400000以下の社員を取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT *
FROM employees
WHERE salary [blank1] 300000 [blank2] 400000;
```

**正解**:
- blank1: `["BETWEEN", "between"]`
- blank2: `["AND", "and"]`

**sampleAnswer**: `SELECT * FROM employees WHERE salary BETWEEN 300000 AND 400000;`

**解説**: `BETWEEN 値1 AND 値2` で指定した範囲（両端を含む）のデータを取得できる。`WHERE salary >= 300000 AND salary <= 400000` と同じ意味だが、`BETWEEN` を使うとより読みやすく記述できる。

---

#### where_in（WRITE / fillInBlank / Easy）

**問題文**: `dept_id` が1または3の社員を取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT *
FROM employees
WHERE dept_id [blank1] (1, 3);
```

**正解**:
- blank1: `["IN", "in"]`

**sampleAnswer**: `SELECT * FROM employees WHERE dept_id IN (1, 3);`

**解説**: `IN (値1, 値2, ...)` で指定したいずれかの値に一致する行を取得できる。`WHERE dept_id = 1 OR dept_id = 3` と同じ意味だが、値が多い場合は `IN` を使う方がシンプルに記述できる。

---

#### where_like（WRITE / fillInBlank / Medium）

**問題文**: `emp_name` に「田」という文字が含まれる社員を取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT *
FROM employees
WHERE emp_name [blank1] '%田%';
```

**正解**:
- blank1: `["LIKE", "like"]`

**sampleAnswer**: `SELECT * FROM employees WHERE emp_name LIKE '%田%';`

**解説**: `LIKE` は部分一致検索（あいまい検索）を行う演算子である。`%` は任意の0文字以上の文字列にマッチするワイルドカードである。`'%田%'` は「田」を含む任意の文字列、`'田%'` は「田」で始まる文字列、`'%田'` は「田」で終わる文字列を表す。

---

#### where_null（WRITE / fillInBlank / Medium）

**問題文**: `dept_id` がNULLの社員（部門未所属）を取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT *
FROM employees
WHERE dept_id [blank1] [blank2];
```

**正解**:
- blank1: `["IS", "is"]`
- blank2: `["NULL", "null"]`

**sampleAnswer**: `SELECT * FROM employees WHERE dept_id IS NULL;`

**解説**: NULLの判定には `IS NULL` を使用する。`= NULL` ではなく `IS NULL` と書くことが重要である。これはNULLが「値が存在しない」ことを表す特殊な状態であり、`=` での比較は常にFALSEになるためである。NULLでないことを確認する場合は `IS NOT NULL` を使う。

---

#### order_by（WRITE / fillInBlank / Easy）

**問題文**: 社員を給与の降順（高い順）に取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT *
FROM employees
[blank1] salary [blank2];
```

**正解**:
- blank1: `["ORDER BY", "order by"]`
- blank2: `["DESC", "desc"]`

**sampleAnswer**: `SELECT * FROM employees ORDER BY salary DESC;`

**解説**: `ORDER BY 列名` でデータを並び替えられる。`ASC`（昇順、小→大）がデフォルトで、`DESC`（降順、大→小）で逆順に並べられる。昇順を明示的に指定するには `ORDER BY salary ASC` と書く。

---

#### complex_conditions（WRITE / fillInBlank / Medium）

**問題文**: 「営業部（`dept_id=1`）または給与が400000以上の社員」の `emp_name` と `salary` を取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT emp_name, salary
FROM employees
WHERE dept_id = 1 [blank1] salary [blank2] 400000;
```

**正解**:
- blank1: `["OR", "or"]`
- blank2: `[">="]`

**sampleAnswer**: `SELECT emp_name, salary FROM employees WHERE dept_id = 1 OR salary >= 400000;`

**解説**: 「または」の条件は `OR` で結ぶ。`AND` は両方の条件を満たす行のみ取得し、`OR` はいずれか一方を満たせば取得する。`AND` と `OR` を組み合わせるときは、`()` でグループ化して優先順位を明確にすることが重要である。

---

### db/select - 第6章: データの集計（topicId: 06_aggregation）

---

#### count_rows（WRITE / fillInBlank / Easy）

**問題文**: `employees` テーブルの全社員数を取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT [blank1](*) AS 社員数
FROM employees;
```

**正解**:
- blank1: `["COUNT", "count"]`

**sampleAnswer**: `SELECT COUNT(*) AS 社員数 FROM employees;`

**解説**: `COUNT(*)` はテーブルの行数（NULLを含む全行）を数える集約関数である。`COUNT(列名)` とすると、その列がNULLでない行の数を返す。件数を調べるときは `COUNT(*)` を使うのが一般的である。

---

#### sum_avg_max_min（WRITE / fillInBlank / Easy）

**問題文**: `salary` の合計・平均・最大・最小を取得するSQL文の空欄を埋めよ。

**CodeBlock**:
```
SELECT SUM(salary) AS 合計, [blank1](salary) AS 平均,
       MAX(salary) AS 最大, [blank2](salary) AS 最小
FROM employees;
```

**正解**:
- blank1: `["AVG", "avg"]`
- blank2: `["MIN", "min"]`

**sampleAnswer**: `SELECT SUM(salary) AS 合計, AVG(salary) AS 平均, MAX(salary) AS 最大, MIN(salary) AS 最小 FROM employees;`

**解説**: 主な集約関数は `SUM`（合計）、`AVG`（平均）、`MAX`（最大値）、`MIN`（最小値）の4つである。これらはNULL値を無視して計算する（NULLは0としてではなく、計算対象から除外される）。

---

#### null_aggregation_impact（KNOW / multipleChoice / Medium）

**問題文**: `salary` にNULLが入っている行が2件あるとき、`AVG(salary)` の結果について正しいものを選べ。

**選択肢**:
- A: NULL行を含めた全行数で割った平均を返す
- B: NULL行を除いた行数で割った平均を返す
- C: NULLが含まれるためエラーが発生する
- D: NULLを0として計算した平均を返す

**正解**: B

**解説**: 集約関数（`AVG`、`SUM`、`MAX`、`MIN`）はNULL値を自動的に無視して計算する。例えば5行のうち2行がNULLなら、NULLでない3行の値で平均を計算する。NULLを0として計算したい場合は `COALESCE(salary, 0)` などで明示的にNULLを置き換える必要がある。

---

#### group_by_basic（WRITE / fillInBlank / Easy）

**問題文**: 部門ごと（`dept_id`）の社員数を集計するSQL文を完成させよ。

**CodeBlock**:
```
SELECT dept_id, COUNT(*) AS 社員数
FROM employees
[blank1] [blank2];
```

**正解**:
- blank1: `["GROUP BY", "group by"]`
- blank2: `["dept_id"]`

**sampleAnswer**: `SELECT dept_id, COUNT(*) AS 社員数 FROM employees GROUP BY dept_id;`

**解説**: `GROUP BY 列名` で指定した列の値ごとにグループに分けて集計できる。`GROUP BY` を使うとき、`SELECT` 句に書ける列は「`GROUP BY` に指定した列」と「集約関数」のみである。

---

#### group_by_multiple（WRITE / fillInBlank / Medium）

**問題文**: 部門ごと（`dept_id`）の平均給与を、`dept_id` でグループ化して取得するSQL文を完成させよ。さらに結果を平均給与の降順に並べよ。

**CodeBlock**:
```
SELECT dept_id, AVG(salary) AS 平均給与
FROM employees
[blank1] dept_id
[blank2] AVG(salary) [blank3];
```

**正解**:
- blank1: `["GROUP BY", "group by"]`
- blank2: `["ORDER BY", "order by"]`
- blank3: `["DESC", "desc"]`

**sampleAnswer**: `SELECT dept_id, AVG(salary) AS 平均給与 FROM employees GROUP BY dept_id ORDER BY AVG(salary) DESC;`

**解説**: `GROUP BY` と `ORDER BY` を組み合わせることで、グループ集計の結果を並び替えることができる。`ORDER BY` では集約関数（`AVG(salary)`）や別名（`平均給与`）を指定できる。

---

#### having_clause（WRITE / fillInBlank / Medium）

**問題文**: 社員数が2人以上の部門のみを表示するSQL文を完成させよ。

**CodeBlock**:
```
SELECT dept_id, COUNT(*) AS 社員数
FROM employees
GROUP BY dept_id
[blank1] COUNT(*) [blank2] 2;
```

**正解**:
- blank1: `["HAVING", "having"]`
- blank2: `[">="]`

**sampleAnswer**: `SELECT dept_id, COUNT(*) AS 社員数 FROM employees GROUP BY dept_id HAVING COUNT(*) >= 2;`

**解説**: `HAVING` は `GROUP BY` でグループ化した後の集計結果に対して条件を絞り込む句である。集約関数を使った条件は `WHERE` ではなく `HAVING` に書く必要がある。`WHERE` は行の絞り込み（グループ化前）、`HAVING` はグループの絞り込み（グループ化後）と覚えると良い。

---

#### where_vs_having（KNOW / multipleChoice / Medium）

**問題文**: `WHERE` 句と `HAVING` 句の違いとして正しいものを選べ。

**選択肢**:
- A: `WHERE` 句はGROUP BYの後に書き、`HAVING` 句はGROUP BYの前に書く
- B: `WHERE` 句はグループ化前の行を絞り込み、`HAVING` 句はグループ化後の集計結果を絞り込む
- C: `WHERE` 句では集約関数が使えるが、`HAVING` 句では使えない
- D: `WHERE` 句と `HAVING` 句は同じ機能であり、どちらに書いても同じ結果になる

**正解**: B

**解説**: `WHERE` はグループ化・集計の前に行を絞り込み、`HAVING` はグループ化・集計の後に絞り込む。そのため、`WHERE` 句では `COUNT(*)` などの集約関数は使えない。`HAVING COUNT(*) >= 2` のように集計結果に条件を付けたい場合は必ず `HAVING` を使う。

---

#### aggregate_requirements（WRITE / fillInBlank / Medium）

**問題文**: 「部門ごとの最高給与と最低給与を取得し、最高給与が350000以上の部門のみ表示せよ」を実装するSQL文を完成させよ。

**CodeBlock**:
```
SELECT dept_id, MAX(salary) AS 最高給与, [blank1](salary) AS 最低給与
FROM employees
GROUP BY dept_id
HAVING [blank2](salary) >= 350000;
```

**正解**:
- blank1: `["MIN", "min"]`
- blank2: `["MAX", "max"]`

**sampleAnswer**: `SELECT dept_id, MAX(salary) AS 最高給与, MIN(salary) AS 最低給与 FROM employees GROUP BY dept_id HAVING MAX(salary) >= 350000;`

**解説**: `GROUP BY` + `HAVING` の応用として、集計関数を組み合わせてより複雑な条件を指定できる。要件を読んで適切な集約関数（`MAX`, `MIN`, `AVG`, `SUM`, `COUNT`）を選ぶことが重要である。

---

### db/design - 第7章: テーブルの分割と正規化（topicId: 07_normalization）

---

#### table_split_necessity（KNOW / multipleChoice / Easy）

**問題文**: テーブルを分割する主な目的として正しいものを選べ。

**選択肢**:
- A: SQLの実行速度を向上させるため
- B: データの重複を排除し、更新時の不整合（異常）を防ぐため
- C: テーブルごとにパスワードを設定できるようにするため
- D: 1つのテーブルに保存できるデータ量を増やすため

**正解**: B

**解説**: テーブルを分割する主な目的はデータの重複排除である。例えば社員と部門情報を1つのテーブルに混在させると、部門名を変更するときに全社員行を更新する必要があり、更新漏れによる不整合が生じる。テーブルを分割して外部キーで参照することでこの問題を防げる。

---

#### update_anomalies（KNOW / multipleChoice / Easy）

**問題文**: 社員と部門情報が1つのテーブルに混在している非正規形テーブルで、「営業部」を「セールス部」に変更するとき、何が起きるリスクがあるか選べ。

**選択肢**:
- A: 変更処理が遅くなる
- B: 一部の行だけ更新され、テーブル内でデータが食い違う（更新異常）
- C: 主キーが重複してエラーになる
- D: 変更できないためエラーが発生する

**正解**: B

**解説**: 非正規形テーブルでは同じ部門名が複数の行に重複して保存されている。更新時に一部の行だけ変更されると、同じ部門が「営業部」と「セールス部」の両方で存在してしまう。これを「更新異常」と呼ぶ。正規化によってテーブルを分割することでこの問題を解消できる。

---

#### first_normal_form（KNOW / multipleChoice / Easy）

**問題文**: 第1正規形（1NF）を満たす条件として正しいものを選べ。

**選択肢**:
- A: すべての列が主キーに完全関数従属している
- B: 推移的関数従属が存在しない
- C: 各セルに値が1つだけ格納されている（繰り返しグループがない）
- D: テーブルに外部キーが設定されている

**正解**: C

**解説**: 第1正規形（1NF）の条件は「各セルに原子的な値（1つの値）のみが格納されていること」である。例えば1つのセルに「スキル: Java, Python, SQL」のように複数の値を詰め込んでいる場合は1NFを満たしていない。繰り返しグループを別テーブルに分離することで1NFを達成できる。

---

#### second_normal_form（KNOW / multipleChoice / Medium）

**問題文**: 第2正規形（2NF）を達成するために排除する問題として正しいものを選べ。

**選択肢**:
- A: 繰り返しグループ（1つのセルに複数の値）を排除する
- B: 主キーの一部にのみ依存する列を別テーブルに分離する（部分関数従属の排除）
- C: 主キー以外の列を経由した依存関係を排除する（推移的関数従属の排除）
- D: NULLが含まれる列をすべて別テーブルに移動する

**正解**: B

**解説**: 第2正規形（2NF）の条件は「第1正規形を満たし、かつ部分関数従属がないこと」である。部分関数従属とは、複合主キーの一部にのみ依存する列が存在することを指す。例えば（社員ID、プロジェクトID）が主キーのテーブルに社員名が含まれていると、社員名は社員IDだけに依存するため部分関数従属となる。

---

#### third_normal_form（KNOW / multipleChoice / Medium）

**問題文**: 第3正規形（3NF）で排除する問題として正しいものを選べ。

**選択肢**:
- A: 繰り返しグループ（1つのセルに複数の値）
- B: 主キーの一部にのみ依存する列（部分関数従属）
- C: 主キー以外の列を経由した依存関係（推移的関数従属）
- D: NULLが含まれる列

**正解**: C

**解説**: 第3正規形（3NF）の条件は「第2正規形を満たし、かつ推移的関数従属がないこと」である。推移的関数従属とは「主キー → 非キー列A → 非キー列B」という連鎖的な依存のことである。例えば社員テーブルに部門名と部門所在地が含まれていると、所在地は社員IDではなく部門名を経由して決まるため推移的関数従属となる。

---

#### normalize_table（WRITE / fillInBlank / Medium）

**問題文**: 以下の非正規形テーブル `employee_skills(emp_id, emp_name, skill1, skill2)` を第1正規形に変換するため、繰り返しグループ（スキル）を別テーブルに分離する。`employee_skills` テーブルのCREATE TABLE文の空欄を埋めよ。

**CodeBlock**:
```
CREATE TABLE employee_skills (
    emp_id     INTEGER [blank1] employees(emp_id),
    skill_name VARCHAR(50) NOT NULL,
    [blank2] KEY (emp_id, skill_name)
);
```

**正解**:
- blank1: `["REFERENCES", "references"]`
- blank2: `["PRIMARY", "primary"]`

**sampleAnswer**: `CREATE TABLE employee_skills (emp_id INTEGER REFERENCES employees(emp_id), skill_name VARCHAR(50) NOT NULL, PRIMARY KEY (emp_id, skill_name));`

**解説**: 繰り返しグループ（skill1, skill2...）は別テーブルに分離し、元テーブルのIDを外部キーとして参照する。複数の列を組み合わせた複合主キーには `PRIMARY KEY (列1, 列2)` と記述する。

---

#### normalization_pros_cons（KNOW / multipleChoice / Medium）

**問題文**: 正規化のデメリットとして正しいものを選べ。

**選択肢**:
- A: データの重複が増えてストレージを圧迫する
- B: テーブルが増えるため、データを取得するときにJOINが必要になりクエリが複雑になる
- C: INSERT・UPDATE・DELETEができなくなる
- D: 主キーを設定できなくなる

**正解**: B

**解説**: 正規化はデータの重複を排除してデータの一貫性を保つメリットがあるが、テーブルが分割されるためデータを結合して取得するときにJOINが必要になる。JOINが多くなるとクエリが複雑になり、場合によってはパフォーマンスへの影響もある。これが正規化のトレードオフである。

---

#### design_normalized_table（WRITE / fillInBlank / Hard）

**問題文**: 以下の要件から2つのテーブルを作成するCREATE TABLE文の空欄を埋めよ。
- `customers(customer_id: 整数・主キー, customer_name: 最大100文字・NULL禁止)`
- `orders(order_id: 整数・主キー, customer_id: customers.customer_idへの外部キー, order_date: 日付)`

**CodeBlock**:
```
CREATE TABLE customers (
    customer_id   INTEGER      [blank1] KEY,
    customer_name VARCHAR(100) [blank2] NULL
);
CREATE TABLE orders (
    order_id    INTEGER PRIMARY KEY,
    customer_id INTEGER [blank3] customers(customer_id),
    order_date  DATE
);
```

**正解**:
- blank1: `["PRIMARY", "primary"]`
- blank2: `["NOT", "not"]`
- blank3: `["REFERENCES", "references"]`

**sampleAnswer**: `CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, customer_name VARCHAR(100) NOT NULL); CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(customer_id), order_date DATE);`

**解説**: 正規化されたテーブル設計では、各エンティティを別テーブルに分離し、外部キーで関係を表現する。`REFERENCES テーブル名(列名)` が外部キー制約の記述方法である。要件を読んで適切な制約（`PRIMARY KEY`, `NOT NULL`, `REFERENCES`）を判断することが重要である。

---

### db/design - 第8章: テーブルの結合（topicId: 08_join）

---

#### join_necessity（KNOW / multipleChoice / Easy）

**問題文**: テーブルの結合（JOIN）が必要な理由として正しいものを選べ。

**選択肢**:
- A: 1つのテーブルのデータを高速に検索するため
- B: 正規化によって分割されたテーブルの関連データをまとめて取得するため
- C: NULL値をデフォルト値に置き換えるため
- D: テーブルのデータを並び替えるため

**正解**: B

**解説**: 正規化によってデータは複数のテーブルに分割されている。例えば社員名と部門名を同時に表示したい場合、`employees` テーブルだけでは部門名が取得できないため、`departments` テーブルとJOINして結合する必要がある。JOINは正規化された設計で複数テーブルのデータをまとめて扱うための重要な操作である。

---

#### inner_join（WRITE / fillInBlank / Easy）

**問題文**: `employees` テーブルと `departments` テーブルを `dept_id` で内部結合し、`emp_name` と `dept_name` を取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT e.emp_name, d.dept_name
FROM employees e
[blank1] [blank2] departments d ON e.dept_id = d.dept_id;
```

**正解**:
- blank1: `["INNER", "inner", "INNER JOIN", "inner join"]`
- blank2: `["JOIN", "join"]`

**sampleAnswer**: `SELECT e.emp_name, d.dept_name FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id;`

**解説**: `INNER JOIN テーブル名 ON 結合条件` で内部結合を行う。内部結合は両テーブルに一致するレコードのみを返す。`ON e.dept_id = d.dept_id` は結合条件で、外部キーと参照先の主キーを等号で結ぶのが基本パターンである。

---

#### table_alias（WRITE / fillInBlank / Easy）

**問題文**: `employees` テーブルに `e` という別名（エイリアス）を付けて、`emp_name` を取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT [blank1].emp_name
FROM employees [blank2];
```

**正解**:
- blank1: `["e"]`
- blank2: `["e"]`

**sampleAnswer**: `SELECT e.emp_name FROM employees e;`

**解説**: テーブルに別名（エイリアス）を付けるには `FROM テーブル名 別名` と記述する。別名を付けると `別名.列名` の形式で列を参照できる。JOIN時に同名の列が複数のテーブルに存在する場合（例：`dept_id`）の区別に使用するため、JOINを使うときはテーブル別名を付けるのが一般的である。

---

#### left_outer_join（WRITE / fillInBlank / Medium）

**問題文**: 部門未所属の社員も含め、全社員の `emp_name` と `dept_name` を取得するSQL文を完成させよ（部門がない場合は `dept_name` がNULLとなる）。

**CodeBlock**:
```
SELECT e.emp_name, d.dept_name
FROM employees e
[blank1] JOIN departments d ON e.dept_id = d.dept_id;
```

**正解**:
- blank1: `["LEFT", "left", "LEFT OUTER", "left outer"]`

**sampleAnswer**: `SELECT e.emp_name, d.dept_name FROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id;`

**解説**: `LEFT JOIN`（または `LEFT OUTER JOIN`）は左テーブル（`FROM` に書いたテーブル）の全行を取得し、右テーブルに一致がない場合はNULLを返す。`INNER JOIN` では一致しない行が除外されるが、`LEFT JOIN` なら `dept_id` がNULLの社員（渡辺あかり）も結果に含まれる。

---

#### inner_vs_left_join（KNOW / multipleChoice / Medium）

**問題文**: `INNER JOIN` と `LEFT JOIN` の違いとして正しいものを選べ。

**選択肢**:
- A: `INNER JOIN` は両テーブルに一致する行のみ取得し、`LEFT JOIN` は左テーブルの全行を取得する（右テーブルに一致がなければNULL）
- B: `INNER JOIN` は左テーブルの全行を取得し、`LEFT JOIN` は右テーブルの全行を取得する
- C: `INNER JOIN` は複数テーブルの結合に使えないが、`LEFT JOIN` は使える
- D: 2つは常に同じ結果を返す

**正解**: A

**解説**: `INNER JOIN` は両テーブルに結合条件を満たす行がある場合のみ結果に含まれる（内部結合）。`LEFT JOIN` は左テーブルの行は必ず含まれ、右テーブルに一致がなければNULLで埋められる（左外部結合）。部門未所属の社員など「片方にしかデータがない行も含めたい」場合に `LEFT JOIN` を使う。

---

#### self_join（WRITE / fillInBlank / Medium）

**問題文**: `employees` テーブルを `e1`、`e2` の2つの別名で自己結合し、同じ部門に所属する社員のペアを取得するSQL文を完成させよ（`e1.emp_id < e2.emp_id` で重複組み合わせを除去）。

**CodeBlock**:
```
SELECT e1.emp_name AS 社員1, e2.emp_name AS 社員2
FROM employees [blank1]
INNER JOIN employees e2 ON e1.dept_id = e2.dept_id AND e1.emp_id < e2.emp_id;
```

**正解**:
- blank1: `["e1"]`

**sampleAnswer**: `SELECT e1.emp_name AS 社員1, e2.emp_name AS 社員2 FROM employees e1 INNER JOIN employees e2 ON e1.dept_id = e2.dept_id AND e1.emp_id < e2.emp_id;`

**解説**: 自己結合は同じテーブルを異なる別名で複数回参照する結合である。組み合わせの重複を避けるために `e1.emp_id < e2.emp_id` という条件を付ける。社員同士の関係や階層構造（上司・部下など）を表現するときに使用する。

---

#### multi_table_join（WRITE / fillInBlank / Medium）

**問題文**: `employees`、`departments`、`assignments` の3テーブルを結合して、社員名・部門名・担当プロジェクトIDを取得するSQL文を完成させよ。

**CodeBlock**:
```
SELECT e.emp_name, d.dept_name, a.project_id
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id
[blank1] assignments a ON [blank2].emp_id = a.emp_id;
```

**正解**:
- blank1: `["INNER JOIN", "inner join", "JOIN", "join"]`
- blank2: `["e"]`

**sampleAnswer**: `SELECT e.emp_name, d.dept_name, a.project_id FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id INNER JOIN assignments a ON e.emp_id = a.emp_id;`

**解説**: 3つ以上のテーブルを結合するには `INNER JOIN ... ON ...` を連続して記述する。各 `JOIN` には適切な結合条件を指定する。`assignments.emp_id` は `employees.emp_id` を外部キーとして参照しているため、`ON e.emp_id = a.emp_id` が結合条件となる。

---

#### join_with_where_group（WRITE / fillInBlank / Medium）

**問題文**: 部門名と部門ごとの社員数を取得するSQL文（JOIN と GROUP BY を組み合わせ）を完成させよ。

**CodeBlock**:
```
SELECT d.dept_name, COUNT(*) AS 社員数
FROM departments d
INNER JOIN employees e ON d.dept_id = e.dept_id
[blank1] d.[blank2];
```

**正解**:
- blank1: `["GROUP BY", "group by"]`
- blank2: `["dept_name"]`

**sampleAnswer**: `SELECT d.dept_name, COUNT(*) AS 社員数 FROM departments d INNER JOIN employees e ON d.dept_id = e.dept_id GROUP BY d.dept_name;`

**解説**: `JOIN` と `GROUP BY` を組み合わせることで、結合後のデータを集計できる。`GROUP BY d.dept_name` で部門ごとにグループ化し、各グループの件数を `COUNT(*)` で数える。`JOIN` → `WHERE`（条件絞り込み）→ `GROUP BY`（グループ化）→ `HAVING`（グループ条件）→ `ORDER BY`（並び替え）の順序で記述する。

---

#### complex_join_query（WRITE / fillInBlank / Hard）

**問題文**: 「開発部（`dept_name='開発部'`）に所属し、かつプロジェクトにアサインされている社員の名前と役割を取得せよ」を実装するSQL文を完成させよ。

**CodeBlock**:
```
SELECT e.emp_name, a.role
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id
[blank1] assignments a ON e.emp_id = a.emp_id
[blank2] d.dept_name = '開発部';
```

**正解**:
- blank1: `["INNER JOIN", "inner join", "JOIN", "join"]`
- blank2: `["WHERE", "where"]`

**sampleAnswer**: `SELECT e.emp_name, a.role FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id INNER JOIN assignments a ON e.emp_id = a.emp_id WHERE d.dept_name = '開発部';`

**解説**: 複数テーブルのJOINと `WHERE` による絞り込みを組み合わせることで複雑な条件のデータを取得できる。`INNER JOIN assignments` で「アサインされている社員のみ」が自動的に絞り込まれる（assignments に存在しない社員は除外される）。さらに `WHERE d.dept_name = '開発部'` で部門を絞り込む。

---

### db/design - 第9章: ER図とデータベース設計（topicId: 09_er_diagram）

---

#### er_diagram_necessity（KNOW / multipleChoice / Easy）

**問題文**: ER図を使う主な目的として正しいものを選べ。

**選択肢**:
- A: SQLのクエリ実行速度を向上させるため
- B: データベースの構造を視覚的に表現し、設計の共通認識を持つため
- C: データをCSV形式でエクスポートするため
- D: トランザクションを自動的に管理するため

**正解**: B

**解説**: ER図（Entity Relationship Diagram：実体関連図）はデータベースのテーブル構造とテーブル間の関係を視覚的に表現する設計図である。設計者・開発者・顧客の間で共通認識を持つためのコミュニケーションツールとして使われる。SQL文を書く前に、まずER図で設計を確認することが推奨される。

---

#### identify_entity（READ / multipleChoice / Easy）

**問題文**: 以下のER図を見て、エンティティ（テーブルに対応する「モノ」）として正しいものを選べ。

```
departments  ||--o{  employees : "所属"
employees    }o--o{  projects  : "アサイン"
```

**選択肢**:
- A: `emp_id`（社員ID）
- B: `employees`（社員テーブル）
- C: `emp_name`（社員名）
- D: `dept_id`（部門ID）

**正解**: B

**解説**: エンティティはER図において長方形（テーブル）で表される「モノ」の概念である。`employees`、`departments`、`projects` などのテーブル名がエンティティである。`emp_id` や `emp_name` などの列はエンティティの「属性」であり、エンティティそのものではない。

---

#### identify_attribute（READ / multipleChoice / Easy）

**問題文**: `employees` エンティティの属性（列に対応する情報）として正しいものを選べ。

**選択肢**:
- A: `departments`（部門テーブル）
- B: `assignments`（アサインメントテーブル）
- C: `emp_name`（社員名）
- D: `employees` と `projects` を結ぶ関係線

**正解**: C

**解説**: 属性はエンティティが持つ情報であり、テーブルの列に対応する。`emp_name`（社員名）は `employees` エンティティの属性である。`departments` や `assignments` は別のエンティティであり、関係線はリレーションシップを表すものであって属性ではない。

---

#### understand_relationship（READ / multipleChoice / Easy）

**問題文**: 以下のER図の記法が表す意味として正しいものを選べ。

```
departments ||--o{ employees : "所属"
```

**選択肢**:
- A: 1人の社員が複数の部門に所属できる（社員が多、部門が1）
- B: 1つの部門に複数の社員が所属できる（部門が1、社員が多）
- C: 部門と社員が1対1の関係
- D: 社員は部門に所属しなくてもよく、1つの部門に複数の社員が所属できる

**正解**: D

**解説**: Mermaid ER図の記法では、`||` が「ちょうど1」、`o{` が「0以上（0または多数）」を表す。したがって `departments ||--o{ employees` は「1つの部門に対して0以上の社員が存在する（社員が部門に所属しない場合もある）」という意味になる。`o` のあるなしが「任意（0）」か「必須（1以上）」かを表す。

---

#### cardinality（KNOW / multipleChoice / Medium）

**問題文**: 「1人の社員は複数のプロジェクトに参加でき、1つのプロジェクトには複数の社員が参加できる」関係のカーディナリティを選べ。

**選択肢**:
- A: 1対1（one-to-one）
- B: 1対多（one-to-many）
- C: 多対多（many-to-many）
- D: 0対1（zero-to-one）

**正解**: C

**解説**: 「1つに対して多数」かつ「逆方向も1つに対して多数」となる関係は多対多（many-to-many）である。社員とプロジェクトの関係（`assignments` テーブルで実現）がその典型例である。1対多は「1人の部門長が複数の部門員を管理する」のような関係である。

---

#### many_to_many_resolution（KNOW / multipleChoice / Medium）

**問題文**: 多対多のリレーションシップをRDBで実装する方法として正しいものを選べ。

**選択肢**:
- A: 一方のテーブルに配列型の列を追加する
- B: 中間テーブル（関連テーブル）を作成し、両テーブルのIDを外部キーとして持たせる
- C: 片方のテーブルを削除して1対多に変換する
- D: 多対多はリレーショナルデータベースでは実装できない

**正解**: B

**解説**: リレーショナルデータベースでは多対多を直接表現できないため、中間テーブルを使って2つの1対多に分解する。`assignments(emp_id, project_id)` はその実例で、`employees` と `projects` をそれぞれ外部キーで参照しつつ、`(emp_id, project_id)` の複合主キーで「同じ組み合わせの重複」を防いでいる。

---

#### er_to_sql（WRITE / fillInBlank / Medium）

**問題文**: 以下のER図から `assignments` テーブルを作成するCREATE TABLE文を完成させよ。
（`emp_id` と `project_id` が複合主キー、それぞれ外部キー）

**CodeBlock**:
```
CREATE TABLE assignments (
    emp_id     INTEGER [blank1] employees(emp_id),
    project_id INTEGER REFERENCES projects(project_id),
    role       VARCHAR(50),
    [blank2] KEY (emp_id, project_id)
);
```

**正解**:
- blank1: `["REFERENCES", "references"]`
- blank2: `["PRIMARY", "primary"]`

**sampleAnswer**: `CREATE TABLE assignments (emp_id INTEGER REFERENCES employees(emp_id), project_id INTEGER REFERENCES projects(project_id), role VARCHAR(50), PRIMARY KEY (emp_id, project_id));`

**解説**: ER図の多対多リレーションシップを中間テーブルで実装するパターンである。`REFERENCES テーブル名(列名)` で外部キー制約を設定し、`PRIMARY KEY (列1, 列2)` で複合主キーを設定する。複合主キーを使うことで同じ社員とプロジェクトの組み合わせが重複して登録されることを防ぐ。

---

#### design_er_from_requirements（WRITE / fillInBlank / Hard）

**問題文**: 「学生（`students`）と授業（`courses`）の多対多関係を管理する中間テーブル（`enrollments`）を設計せよ」という要件で、以下のCREATE TABLE文を完成させよ。

**CodeBlock**:
```
CREATE TABLE enrollments (
    student_id  INTEGER [blank1] students(student_id),
    course_id   INTEGER [blank2] courses(course_id),
    enrolled_at DATE,
    [blank3] KEY (student_id, course_id)
);
```

**正解**:
- blank1: `["REFERENCES", "references"]`
- blank2: `["REFERENCES", "references"]`
- blank3: `["PRIMARY", "primary"]`

**sampleAnswer**: `CREATE TABLE enrollments (student_id INTEGER REFERENCES students(student_id), course_id INTEGER REFERENCES courses(course_id), enrolled_at DATE, PRIMARY KEY (student_id, course_id));`

**解説**: 多対多の中間テーブル設計のパターンを理解していれば応用できる。両エンティティのIDを外部キーで参照し、その2列を複合主キーとして設定する。`enrolled_at`（登録日）のような「関係そのものの属性」も中間テーブルに持たせることができる。

---

## 5. 問題ファイル作成チェックリスト

- [ ] id: `"db/{subcategory}/{topicId}#{questionId}"` の形式
- [ ] topicId・category が structure.ts の定義と一致
- [ ] format が type に対応している（WRITE→fillInBlank, KNOW/READ→multipleChoice）
- [ ] WRITE型問題に SQL記述規則 Admonition を含む
- [ ] fillInBlankAnswers の key が MDX 本文の `BlankInput id=` と一致
- [ ] explanation が「である調」で記述されている
- [ ] 改行前に半角スペース2つ（MDX規則）
- [ ] import文がfrontmatter直後に配置されている
