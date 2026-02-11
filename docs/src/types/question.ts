// 演習問題のメタデータ型
export interface QuestionMetadata {
  id: string; // "java/basics/variables_and_types#k1"
  title: string;
  type: "KNOW" | "READ" | "WRITE";
  difficulty: "Easy" | "Medium" | "Hard";
  format: QuestionFormat;
  topicId: string;
  category: string;
  // 選択式問題のデータ
  choices?: Choice[];
  answers?: MultipleChoiceAnswer;
  multipleSelect?: boolean;
  // 穴埋め問題のデータ
  fillInBlankAnswers?: FillInBlankAnswer;
  // 自由記述のサンプル解答
  sampleAnswer?: string;
  // 解説（簡潔な文章）
  explanation?: string;
  // ヒント（採点前に表示可能）
  hint?: string;
}

export type QuestionFormat = "fillInBlank" | "multipleChoice" | "freeText";

export interface Choice {
  id: string;
  text: string;
}

export interface MultipleChoiceAnswer {
  correct: string[];
}

// 穴埋め問題の解答（ID → 正解のマッピング）
export interface FillInBlankAnswer {
  [blankId: string]: string | string[]; // 単一正解または複数の正解パターン
}

// 採点結果
export interface QuestionResult {
  isCorrect: boolean;
  userAnswer: UserAnswer;
  correctAnswer?: any;
  // 穴埋め問題の場合、各空欄の正誤を保持
  blankResults?: Record<string, boolean>;
}

export type UserAnswer =
  | { format: "multipleChoice"; selected: string[] }
  | { format: "freeText"; text: string }
  | { format: "fillInBlank"; blanks: Record<string, string> };
