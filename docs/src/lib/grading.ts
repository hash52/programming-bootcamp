import {
  QuestionResult,
  MultipleChoiceAnswer,
  FillInBlankAnswer,
} from "../types/question";

/**
 * 選択式問題の採点
 */
export function gradeMultipleChoice(
  userAnswer: string[],
  correctAnswer: MultipleChoiceAnswer
): QuestionResult {
  const userSet = new Set(userAnswer);
  const correctSet = new Set(correctAnswer.correct);

  const isCorrect =
    userSet.size === correctSet.size &&
    [...userSet].every((id) => correctSet.has(id));

  return {
    isCorrect,
    userAnswer: { format: "multipleChoice", selected: userAnswer },
    correctAnswer,
  };
}

/**
 * 穴埋め問題の採点
 * @param userBlanks ユーザーが入力した各空欄の値（ID → 入力値）
 * @param correctAnswers 正解データ（ID → 正解値 or 正解値の配列）
 * @returns 採点結果（全体の正誤と各空欄の正誤）
 */
export function gradeFillInBlank(
  userBlanks: Record<string, string>,
  correctAnswers: FillInBlankAnswer
): QuestionResult {
  const blankResults: Record<string, boolean> = {};
  let allCorrect = true;

  // 各空欄を採点
  for (const blankId in correctAnswers) {
    const userInput = userBlanks[blankId]?.trim() || "";
    const correctAnswer = correctAnswers[blankId];

    let isBlankCorrect = false;

    if (Array.isArray(correctAnswer)) {
      // 複数の正解パターンがある場合
      isBlankCorrect = correctAnswer.some(
        (answer) => userInput.toLowerCase() === answer.toLowerCase()
      );
    } else {
      // 単一の正解パターン
      isBlankCorrect = userInput.toLowerCase() === correctAnswer.toLowerCase();
    }

    blankResults[blankId] = isBlankCorrect;
    if (!isBlankCorrect) {
      allCorrect = false;
    }
  }

  return {
    isCorrect: allCorrect,
    userAnswer: { format: "fillInBlank", blanks: userBlanks },
    correctAnswer: correctAnswers,
    blankResults,
  };
}
