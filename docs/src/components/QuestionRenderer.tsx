import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LightbulbOutlined from "@mui/icons-material/LightbulbOutlined";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { QuestionMetadata, QuestionResult } from "@site/src/types/question";
import { MultipleChoiceInput } from "./question/inputs/MultipleChoiceInput";
import { FreeTextInput } from "./question/inputs/FreeTextInput";
import { GradingFeedback } from "./question/GradingFeedback";
import { AchievementCheckbox } from "./question/AchievementCheckbox";
import { HintLink } from "./question/HintLink";
import { gradeMultipleChoice, gradeFillInBlank } from "@site/src/lib/grading";
import { useStoredProgress } from "@site/src/hooks/useStoredProgress";
import {
  BlankInputProvider,
  useBlankInput,
} from "@site/src/contexts/BlankInputContext";

// @ts-expect-error: Webpackのrequire.contextをTypeScriptが認識しない
const context = require.context("../questions", true, /\.mdx$/);

interface QuestionRendererProps {
  id: string;
  mode?: "embedded" | "dialog" | "dojo";
  showTitle?: boolean;
  showHintLink?: boolean;
}

// 内部コンポーネント（BlankInputContext内で使用）
const QuestionRendererInner: React.FC<
  QuestionRendererProps & {
    Module: any;
    metadata: QuestionMetadata;
    fileNamePart: string;
    id: string;
  }
> = ({ Module, metadata, fileNamePart, id, showTitle, showHintLink }) => {
  // 選択式の状態管理
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  // 自由記述の状態管理
  const [freeText, setFreeText] = useState<string>("");
  // 採点結果
  const [result, setResult] = useState<QuestionResult | null>(null);
  // 解答・解説の表示状態
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  // ヒントの表示状態
  const [showHint, setShowHint] = useState<boolean>(false);

  // 進捗管理フック
  const { progress, updateProgress } = useStoredProgress();

  // 穴埋め問題用のContext
  const { blanks, setBlankCorrectness, resetBlanks } = useBlankInput();

  // 初回アクセス時のスクロール処理
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === fileNamePart) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }
  }, [fileNamePart]);

  const handleGrade = () => {
    if (metadata?.format === "multipleChoice" && metadata.answers) {
      const gradeResult = gradeMultipleChoice(
        selectedChoices,
        metadata.answers
      );
      setResult(gradeResult);

      // 正解なら達成日時を自動更新、不正解ならチェックを外す
      if (gradeResult.isCorrect) {
        updateProgress(id, true);
      } else {
        updateProgress(id, false);
      }

      // 解答・解説を自動表示
      setShowExplanation(true);
    } else if (
      metadata?.format === "fillInBlank" &&
      metadata.fillInBlankAnswers
    ) {
      const gradeResult = gradeFillInBlank(blanks, metadata.fillInBlankAnswers);
      setResult(gradeResult);

      // 各空欄の正誤を反映
      if (gradeResult.blankResults) {
        setBlankCorrectness(gradeResult.blankResults);
      }

      // 正解なら達成日時を自動更新、不正解ならチェックを外す
      if (gradeResult.isCorrect) {
        updateProgress(id, true);
      } else {
        updateProgress(id, false);
      }

      // 解答・解説を自動表示
      setShowExplanation(true);
    }
  };

  const handleShowExplanation = () => {
    // 自由記述問題の「解答を表示する」
    setShowExplanation(true);
  };

  const handleGiveUp = () => {
    // 諦めて解答を表示する
    setShowExplanation(true);
    // 達成済みチェックを外す
    updateProgress(id, false);
  };

  return (
    <Box id={fileNamePart} p={2}>
      {showTitle && (
        <Typography variant="h5" gutterBottom>
          {metadata.title}
        </Typography>
      )}

      {/* MDXコンテンツ */}
      <Module.default />

      {showHintLink && (
        <Box mt={2}>
          <HintLink category={metadata.category} topicId={metadata.topicId} />
        </Box>
      )}

      {/* ヒント表示 */}
      {metadata.hint && (
        <Box mt={2}>
          <Button
            variant="text"
            color="warning"
            startIcon={<LightbulbOutlined />}
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? "ヒントを隠す" : "ヒントを表示"}
          </Button>
          <Collapse in={showHint} timeout={400}>
            <Box
              mt={1}
              p={2}
              sx={{
                backgroundColor: "rgba(255, 167, 38, 0.08)",
                borderRadius: 1,
                borderLeft: "3px solid #ffa726",
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {metadata.hint}
              </ReactMarkdown>
            </Box>
          </Collapse>
        </Box>
      )}

      {/* 出題形式に応じた入力UI */}
      {metadata.format === "multipleChoice" && metadata.choices && (
        <>
          <MultipleChoiceInput
            choices={metadata.choices}
            multipleSelect={metadata.multipleSelect || false}
            value={selectedChoices}
            onChange={setSelectedChoices}
          />
          <Box mt={2} display="flex" gap={2} flexWrap="wrap">
            <Button variant="contained" color="primary" onClick={handleGrade}>
              採点する
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleGiveUp}>
              諦めて解答を表示する
              <Typography variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
                （達成済みステータスを外します）
              </Typography>
            </Button>
          </Box>
        </>
      )}

      {metadata.format === "fillInBlank" && (
        <>
          <Box mt={2} display="flex" gap={2} flexWrap="wrap">
            <Button variant="contained" color="primary" onClick={handleGrade}>
              採点する
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleGiveUp}>
              諦めて解答を表示する
              <Typography variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
                （達成済みステータスを外します）
              </Typography>
            </Button>
          </Box>
        </>
      )}

      {metadata.format === "freeText" && (
        <>
          <FreeTextInput value={freeText} onChange={setFreeText} />
          <Box mt={2} display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              color="primary"
              onClick={handleShowExplanation}
            >
              解答を表示する
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleGiveUp}>
              諦めて解答を表示する
              <Typography variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
                （達成済みステータスを外します）
              </Typography>
            </Button>
          </Box>
        </>
      )}

      {/* 採点結果フィードバック */}
      {result && <GradingFeedback isCorrect={result.isCorrect} />}

      {/* 解答・解説の表示（アニメーション付き） */}
      <Collapse in={showExplanation} timeout={600}>
        <Box mt={3}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">解答・解説を見る</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {metadata.sampleAnswer && (
                <Box mb={2}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    解答例
                  </Typography>
                  <Typography
                    component="div"
                    sx={{
                      "& code": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        fontFamily: "monospace",
                      },
                    }}
                  >
                    {metadata.sampleAnswer}
                  </Typography>
                </Box>
              )}
              {metadata.explanation && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    解説
                  </Typography>
                  <Box
                    sx={{
                      "& p": {
                        marginTop: 0,
                        marginBottom: "1em",
                      },
                      "& code": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontFamily: "monospace",
                        fontSize: "0.9em",
                      },
                      "& pre": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        padding: "1em",
                        borderRadius: "4px",
                        overflow: "auto",
                      },
                      "& pre code": {
                        backgroundColor: "transparent",
                        padding: 0,
                      },
                      "& h3": {
                        marginTop: "1.5em",
                        marginBottom: "0.5em",
                        fontSize: "1.1em",
                        fontWeight: "bold",
                      },
                      "& ul, & ol": {
                        paddingLeft: "1.5em",
                      },
                      "& li": {
                        marginBottom: "0.5em",
                      },
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {metadata.explanation}
                    </ReactMarkdown>
                  </Box>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Collapse>

      {/* 達成チェック */}
      <Box mt={2}>
        <AchievementCheckbox questionId={id} />
      </Box>
    </Box>
  );
};

// 外部コンポーネント（BlankInputProviderでラップ）
export const QuestionRenderer: React.FC<QuestionRendererProps> = (props) => {
  const { id } = props;
  const [dirPath, fileNamePart] = id.split("#");
  const filePath = `./${dirPath}/${fileNamePart}.mdx`;

  const Module = context.keys().includes(filePath) ? context(filePath) : null;

  // MDXのfrontmatterからメタデータを取得
  const metadata: QuestionMetadata | undefined = Module?.frontMatter;

  if (!Module || !metadata) {
    return (
      <p style={{ color: "red" }}>
        ❌ 問題ファイルが見つかりません: {id}
        <br />
        <small>期待されるパス: {filePath}</small>
      </p>
    );
  }

  return (
    <BlankInputProvider>
      <QuestionRendererInner
        {...props}
        Module={Module}
        metadata={metadata}
        fileNamePart={fileNamePart}
        id={id}
      />
    </BlankInputProvider>
  );
};
