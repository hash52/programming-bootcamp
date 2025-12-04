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
  // 自由記述のサンプル解答
  sampleAnswer?: string;
  // 解説（簡潔な文章）
  explanation?: string;
}

export type QuestionFormat = "fillInBlank" | "multipleChoice" | "freeText";

export interface Choice {
  id: string;
  text: string;
}

export interface MultipleChoiceAnswer {
  correct: string[];
}

// 採点結果
export interface QuestionResult {
  isCorrect: boolean;
  userAnswer: UserAnswer;
  correctAnswer?: any;
}

export type UserAnswer =
  | { format: "multipleChoice"; selected: string[] }
  | { format: "freeText"; text: string };
