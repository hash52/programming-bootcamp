#!/usr/bin/env node
/**
 * 演習問題（multipleChoice）の正答分布を均等化するスクリプト
 *
 * 現状: A に偏っている正答を A/B/C/D に均等分散させる
 * 方針: 選択肢のテキストをスワップし、answers.correct を更新する
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const BASE_DIR = '/Users/hirochinko/workspace/programming-bootcamp/docs/src/questions';
const PLACEHOLDER = '__SWAP_PLACEHOLDER_FIX_DIST__';

// -------------------------
// ヘルパー関数
// -------------------------

/**
 * choices 内の指定 ID のテキストを取得する
 */
function extractChoiceText(lines, id) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === `  - id: "${id}"`) {
      const next = lines[i + 1];
      if (next && next.startsWith('    text: ')) {
        return next.slice('    text: '.length);
      }
    }
  }
  return null;
}

/**
 * choices 内で id1 と id2 のテキストをスワップする
 */
function swapChoiceTexts(content, id1, id2) {
  const lines = content.split('\n');
  const text1 = extractChoiceText(lines, id1);
  const text2 = extractChoiceText(lines, id2);

  if (!text1 || !text2) {
    console.warn(`  WARNING: Could not find choices "${id1}" or "${id2}"`);
    return content;
  }

  let inChoices = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === 'choices:') {
      inChoices = true;
    } else if (inChoices && lines[i] === 'answers:') {
      break;
    } else if (inChoices && lines[i] === `  - id: "${id1}"`) {
      if (lines[i + 1]?.startsWith('    text: ')) {
        lines[i + 1] = `    text: ${text2}`;
      }
    } else if (inChoices && lines[i] === `  - id: "${id2}"`) {
      if (lines[i + 1]?.startsWith('    text: ')) {
        lines[i + 1] = `    text: ${text1}`;
      }
    }
  }

  return lines.join('\n');
}

/**
 * answers.correct の値を更新する
 */
function updateCorrectAnswer(content, oldId, newId) {
  return content.replace(`correct: ["${oldId}"]`, `correct: ["${newId}"]`);
}

/**
 * explanation 内の選択肢 ID 参照をスワップする
 *
 * 対象パターン:
 *   - Xの、Xは、Xが、Xを、Xも、Xに、Xで、Xと（日本語助詞が直後）
 *   - X：（コロン直後）
 *   - X）（全角閉じカッコ直後）
 *   - X**（bold終了マーカー直後）
 *   前提: X の直前がアルファベット・数字・アンダースコアでないこと
 */
function swapLettersInExplanation(content, id1, id2) {
  // frontmatter を取り出す（ファイルは "---\n" で始まる前提）
  const FM_END_MARKER = '\n---\n';
  const fmEndIdx = content.indexOf(FM_END_MARKER, 4);
  if (fmEndIdx === -1) return content;

  const header = content.slice(0, 4); // "---\n"
  const fm = content.slice(4, fmEndIdx);
  const tail = content.slice(fmEndIdx); // "\n---\n..."

  // explanation セクションを取り出す（常に最後のキー）
  const EXPL_HEADER = 'explanation: |\n';
  const explIdx = fm.indexOf(EXPL_HEADER);
  if (explIdx === -1) return content;

  const beforeExpl = fm.slice(0, explIdx + EXPL_HEADER.length);
  let expl = fm.slice(explIdx + EXPL_HEADER.length);

  // パターン: 直前が非英数字・非アンダースコア、直後が日本語助詞・記号・bold マーカー
  const SUFFIX = '[のはがをもにでとへ：」）]|\\*\\*';
  const makePattern = (id) =>
    new RegExp(`(?<![a-zA-Z0-9_])${id}(?=${SUFFIX})`, 'g');

  // プレースホルダーを使った2ステップ置換
  expl = expl.replace(makePattern(id1), PLACEHOLDER);
  expl = expl.replace(makePattern(id2), id1);
  expl = expl.replace(new RegExp(PLACEHOLDER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), id2);

  return header + beforeExpl + expl + tail;
}

/**
 * ファイルの選択肢をスワップして保存する
 */
function processFile(filePath, targetId) {
  let content = readFileSync(filePath, 'utf-8');
  content = swapChoiceTexts(content, 'A', targetId);
  content = updateCorrectAnswer(content, 'A', targetId);
  content = swapLettersInExplanation(content, 'A', targetId);
  writeFileSync(filePath, content, 'utf-8');
}

// -------------------------
// メイン処理
// -------------------------

// ファイルをパス順（アルファベット順）で取得
const allFiles = execSync(`find "${BASE_DIR}" -name "*.mdx" | sort`)
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean);

// キャッシュ（各ファイルの内容を1度だけ読む）
const cache = new Map();
const getContent = (f) => {
  if (!cache.has(f)) cache.set(f, readFileSync(f, 'utf-8'));
  return cache.get(f);
};

// multipleChoice かつ multipleSelect:false のファイルを抽出
const mcFiles = allFiles.filter((f) => {
  const c = getContent(f);
  return (
    c.includes('format: "multipleChoice"') &&
    c.includes('multipleSelect: false')
  );
});

// 現在の分布をカウント
const counts = { A: 0, B: 0, C: 0, D: 0 };
for (const f of mcFiles) {
  const c = getContent(f);
  for (const letter of ['A', 'B', 'C', 'D']) {
    if (c.includes(`correct: ["${letter}"]`)) {
      counts[letter]++;
      break;
    }
  }
}

console.log('=== 現在の正答分布 ===');
console.log(`A: ${counts.A}, B: ${counts.B}, C: ${counts.C}, D: ${counts.D}`);
console.log(`合計: ${mcFiles.length} 問`);

// 目標分布を計算
const total = mcFiles.length;
const baseTarget = Math.floor(total / 4);
const remainder = total % 4;
// A が余り分を持つ（元々最多なので自然）
const targets = {
  A: baseTarget + remainder,
  B: baseTarget,
  C: baseTarget,
  D: baseTarget,
};

const changeToB = targets.B - counts.B;
const changeToC = targets.C - counts.C;
const changeToD = targets.D - counts.D;

// correct:["A"] のファイル一覧（すでに sort 済み）
const aFiles = mcFiles.filter((f) => getContent(f).includes('correct: ["A"]'));
const keepA = aFiles.length - changeToB - changeToC - changeToD;

console.log('\n=== 変更計画 ===');
console.log(`目標: A=${targets.A}, B=${targets.B}, C=${targets.C}, D=${targets.D}`);
console.log(`A のまま: ${keepA}, →B: ${changeToB}, →C: ${changeToC}, →D: ${changeToD}`);

if (keepA < 0) {
  console.error('ERROR: keepA が負になっています。分布を確認してください。');
  process.exit(1);
}

// 変更を実行
let changedCount = 0;
const changeLog = { B: [], C: [], D: [] };

for (let i = 0; i < aFiles.length; i++) {
  let targetId;
  if (i < keepA) {
    targetId = 'A';
  } else if (i < keepA + changeToB) {
    targetId = 'B';
  } else if (i < keepA + changeToB + changeToC) {
    targetId = 'C';
  } else {
    targetId = 'D';
  }

  if (targetId !== 'A') {
    const name = path.relative(BASE_DIR, aFiles[i]);
    changeLog[targetId].push(name);
    processFile(aFiles[i], targetId);
    changedCount++;
  }
}

// 変更後の分布を確認
const newCounts = { A: 0, B: 0, C: 0, D: 0 };
for (const f of mcFiles) {
  const c = readFileSync(f, 'utf-8'); // キャッシュを使わず再読み込み
  for (const letter of ['A', 'B', 'C', 'D']) {
    if (c.includes(`correct: ["${letter}"]`)) {
      newCounts[letter]++;
      break;
    }
  }
}

console.log('\n=== 変更後の正答分布 ===');
console.log(`A: ${newCounts.A}, B: ${newCounts.B}, C: ${newCounts.C}, D: ${newCounts.D}`);
console.log(`\n変更ファイル数: ${changedCount} 件`);

// 変更ログ詳細
for (const [letter, files] of Object.entries(changeLog)) {
  if (files.length > 0) {
    console.log(`\n→${letter} に変更 (${files.length}件):`);
    files.forEach((f) => console.log(`  ${f}`));
  }
}
