import { FC, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Mermaid from "@theme/Mermaid";

// ============================================================
// ロードマップ用 Mermaid 図（roadmap.md から転記）
// ============================================================
const ROADMAP_CHART = `
flowchart TD
    subgraph step1 ["Step1: プログラミング基礎"]
        A["プログラムの基本ルール"]:::java --> B["変数と型"]:::java
        B --> C["条件分岐と繰り返し"]:::java
        C --> D["メソッド"]:::java
    end

    subgraph step2 ["Step2: オブジェクト指向"]
        E["クラスとインスタンス"]:::java --> F["継承・インターフェース"]:::java
    end

    subgraph step3 ["Step3: Web開発の土台"]
        G["データベースと SQL"]:::db
        I["HTML / CSS"]:::web
        L["Git バージョン管理"]:::tool
    end

    subgraph step4 ["Step4: Spring Framework"]
        J["Java と DB を連携"]:::spring --> K["Java と画面を連携"]:::spring
    end

    GOAL["Web アプリをチームで開発できる！"]:::goal

    D --> E
    F --> J
    G --> J
    I --> K
    K --> GOAL
    L --> GOAL

    style step1 fill:#fff8f0,stroke:#F57C00,stroke-width:2px,color:#333
    style step2 fill:#fff8f0,stroke:#F57C00,stroke-width:2px,color:#333
    style step3 fill:#f0f8ff,stroke:#1976D2,stroke-width:2px,color:#333
    style step4 fill:#f0fff0,stroke:#388E3C,stroke-width:2px,color:#333

    classDef java fill:#FFF3E0,stroke:#F57C00,stroke-width:1px,color:#333
    classDef db fill:#E3F2FD,stroke:#1976D2,stroke-width:1px,color:#333
    classDef web fill:#F3E5F5,stroke:#7B1FA2,stroke-width:1px,color:#333
    classDef spring fill:#E8F5E9,stroke:#388E3C,stroke-width:1px,color:#333
    classDef tool fill:#F5F5F5,stroke:#616161,stroke-width:1px,color:#333
    classDef goal fill:#FFD54F,stroke:#F57F17,stroke-width:3px,font-weight:bold,color:#333
`;

// ============================================================
// Tab パネルラッパー
// ============================================================
const TabPanel: FC<{ value: number; index: number; children: React.ReactNode }> = ({
  value,
  index,
  children,
}) => (
  <Box hidden={value !== index} role="tabpanel">
    {value === index && <Box>{children}</Box>}
  </Box>
);

// ============================================================
// Tab 1: ロードマップ
// ============================================================
const RoadmapTab: FC = () => (
  <Box>
    <Typography variant="body1" paragraph>
      プログラミングの学習は <strong>積み上げ型</strong> である。
      算数で足し算がわからなければ掛け算ができないように、プログラミングでも基礎の上に応用が成り立つ。
      裏を返せば、 <strong>基礎をしっかり固めれば、その先は着実に理解できる</strong> ということでもある。
    </Typography>
    <Typography variant="body1" paragraph>
      このロードマップは、ゴールまでの道のりを示す <strong>地図</strong> である。
      「今どこにいるのか」「次に何を学ぶのか」が見えていれば、学習はぐっと進めやすくなる。
      迷ったときはいつでもこのページに戻ってこよう。
    </Typography>

    <Divider sx={{ my: 2 }} />

    {/* Mermaid 図 */}
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      学習の全体像
    </Typography>
    <Mermaid value={ROADMAP_CHART} />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
      ※ 矢印は「この知識が次のステップの土台になる」という関係を示している。
      データベース・HTML/CSS・Git は Java の学習と並行して進めることができる。
    </Typography>

    <Divider sx={{ my: 2 }} />

    {/* 各ステップの概要 */}
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      各ステップの概要
    </Typography>

    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
      Step 1 : プログラミングの基礎（Java）
    </Typography>
    <Typography variant="body1" paragraph>
      プログラムの書き方の基本ルールから始め、変数、条件分岐、繰り返し、メソッドといった
      <strong>あらゆるプログラミング言語に共通する考え方</strong>を身につける。
      ここが最も大切な土台となる。焦らず、じっくり取り組もう。
    </Typography>

    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
      Step 2 : オブジェクト指向（Java）
    </Typography>
    <Typography variant="body1" paragraph>
      「クラス」や「継承」など、<strong>現実世界のモノや関係をプログラムで表現する方法</strong>を学ぶ。
      Step 1 の知識があれば、自然とステップアップできる内容である。
    </Typography>

    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
      Step 3 : Web 開発の土台
    </Typography>
    <Typography variant="body1" paragraph>
      Web アプリに欠かせない 3 つの技術を身につける。これらは Java の学習と並行して進められる。
    </Typography>
    <Box component="ul" sx={{ mt: 0, mb: 2, pl: 3 }}>
      <Typography component="li" variant="body1">
        <strong>データベースと SQL</strong> ─ データを保存・検索するための技術
      </Typography>
      <Typography component="li" variant="body1">
        <strong>HTML / CSS</strong> ─ Web ページの見た目を作る技術
      </Typography>
      <Typography component="li" variant="body1">
        <strong>Git</strong> ─ コードの変更履歴を管理し、チームで共同開発するためのツール
      </Typography>
    </Box>

    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
      Step 4 : Web アプリ開発（Spring Framework）
    </Typography>
    <Typography variant="body1" paragraph>
      Step 1〜3 で学んだすべての技術を <strong>Spring Framework</strong> でつなぎ合わせ、
      実際に動く Web アプリケーションを開発する。
      ここまで来れば、学んできたことが一つにつながる達成感を味わえるはずである。
    </Typography>

    <Divider sx={{ my: 2 }} />

    {/* 学習を進めるコツ */}
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      学習を進めるコツ
    </Typography>

    <Typography variant="subtitle1" fontWeight="bold">基礎を飛ばさない</Typography>
    <Typography variant="body1" paragraph>
      「簡単そうだから」と飛ばした基礎が、後の章でつまずく原因になりやすい。
      基礎に時間をかけることは、結果的に最短ルートである。
    </Typography>

    <Typography variant="subtitle1" fontWeight="bold">手を動かす</Typography>
    <Typography variant="body1" paragraph>
      読んで理解した「つもり」と、実際にコードを書けることは別物である。
      教材のサンプルコードは、必ず自分の手で書いて動かしてみよう。
    </Typography>

    <Typography variant="subtitle1" fontWeight="bold">エラーを恐れない</Typography>
    <Typography variant="body1" paragraph>
      プログラミングでエラーが出るのは日常茶飯事である。プロのエンジニアでも毎日エラーと向き合っている。
      エラーメッセージは「ここを直せばいいよ」というヒントだと捉えよう。
    </Typography>

    <Typography variant="subtitle1" fontWeight="bold">わからなくなったら戻る</Typography>
    <Typography variant="body1" paragraph>
      先に進んでいて理解できない部分が出てきたら、このロードマップを見て前提となる章に戻ろう。
      「戻る」ことは後退ではなく、<strong>確実に前に進むための戦略</strong>である。
    </Typography>

  </Box>
);

// ============================================================
// Tab 2: このサイトの使い方
// ============================================================
const UsageGuideTab: FC = () => (
  <Box>
    <Alert severity="info" sx={{ mb: 3 }}>
      このサイトは、「効率よく・確実に力をつける」ための仕組みが詰まっている。
      使い方を知るだけで、学習効果が大きく変わる。
    </Alert>

    {/* セクション1: ダッシュボード */}
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      1. ダッシュボード（このページ）
    </Typography>
    <Typography variant="body1" paragraph>
      ダッシュボードは単なる進捗管理ツールではない。
      各トピックを開くと「〜を説明できる」「〜を実装できる」といった項目が並んでいるが、
      これはこのブートキャンプで<strong>習得すべき内容の一覧</strong>そのものである。
      教材を読む前にチェックリストを確認し、何を身につけるかを意識してから学習に入ろう。
    </Typography>
    <Box component="ol" sx={{ pl: 3, mb: 3 }}>
      {[
        {
          title: "進捗グラフ",
          body: "日ごとの達成率推移を確認できる。グラフが右肩上がりになると自分の成長を実感できる。",
        },
        {
          title: "習得目標の一覧（チェックリスト）",
          body: "トピックを開くと習得すべき内容がリストで並ぶ。理解できたらチェックを入れると日付が自動記録される。",
        },
        {
          title: "達成目標をクリックで演習問題",
          body: "各項目のタイトルをクリックすると演習問題が開く。解いてみることで「わかったつもり」になっていないか確認できる。",
        },
        {
          title: "色で復習タイミングを確認",
          body: null,
          colors: [
            { color: "#43a047", text: "緑：3日以内（記憶が新しい）" },
            { color: "#fb8c00", text: "オレンジ：4〜6日（そろそろ復習するとよい）" },
            { color: "#e53935", text: "赤：7日以上（忘れている可能性大、要復習）" },
          ],
        },
      ].map(({ title, body, colors }, i) => (
        <Box component="li" key={i} sx={{ mb: 1.5 }}>
          <Typography variant="body1" component="span">
            <strong>{title}</strong>
            {body ? ` ─ ${body}` : ""}
          </Typography>
          {colors && (
            <Box sx={{ mt: 0.5, pl: 2 }}>
              {colors.map(({ color, text }) => (
                <Box key={text} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />
                  <Typography variant="body2">{text}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>

    <Divider sx={{ my: 2 }} />

    {/* セクション2: 演習問題道場 */}
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      2. 演習問題道場
    </Typography>
    <Typography variant="body1" paragraph>
      サイドバーの「演習問題道場」から利用できる。
    </Typography>
    <Box component="ul" sx={{ pl: 3, mb: 1 }}>
      {[
        "出題範囲・問題タイプ・難易度を自由に設定できる",
        "「未達成のみ」で弱点集中練習ができる",
        "ランダム出題モードで知識の定着確認ができる",
      ].map((text) => (
        <Typography component="li" variant="body1" key={text} sx={{ mb: 0.5 }}>
          {text}
        </Typography>
      ))}
    </Box>
    <Alert severity="warning" icon={false} sx={{ mb: 3, mt: 1 }}>
      <Typography variant="body2">
        <strong>忘却曲線と「最終チェック日フィルター」</strong>：
        人は学んだことを時間が経つと急速に忘れる（エビングハウスの忘却曲線）。
        道場には「最終チェックからの経過日数」でフィルターをかける機能がある。
        「7日以上前にチェックした問題だけ」を選んで出題し、忘れ始めた知識を効率よく復習できる。
        <strong>復習は義務ではなく、最速で力をつけるための戦略だ。</strong>
        定期的に道場に戻ることを強くすすめる。
      </Typography>
    </Alert>

    <Divider sx={{ my: 2 }} />

    {/* セクション3: ハンズオン演習 */}
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      3. ハンズオン演習
    </Typography>
    <Typography variant="body1" paragraph>
      サイドバーの「ハンズオン演習」から利用できる。
      Step 1〜3 の知識を使って <strong>実際に動く Web アプリ（ECサイト）を一から構築する</strong> 実践演習。
    </Typography>
    <Box component="ul" sx={{ pl: 3, mb: 1 }}>
      {[
        "Spring Framework の全機能（画面・DB連携・ログイン・バリデーション等）を統合的に体験できる",
        "「見ないで最初から作り直す」タイムアタックを繰り返すことで、開発の流れが体に染み込む",
      ].map((text) => (
        <Typography component="li" variant="body1" key={text} sx={{ mb: 0.5 }}>
          {text}
        </Typography>
      ))}
    </Box>
    <Alert severity="success" icon={false} sx={{ mb: 3, mt: 1 }}>
      <Typography variant="body2">
        <strong>一度完走して終わりではない。何度も繰り返すことで本物の力になる。</strong>
      </Typography>
    </Alert>

    <Divider sx={{ my: 2 }} />

    {/* セクション4: 効果的な学習のコツ */}
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      4. 効果的な学習のコツ
    </Typography>
    <Box component="ol" sx={{ pl: 3 }}>
      {[
        {
          title: "手を動かす",
          body: "読んで「わかった気」より、実際にコードを書くほうが10倍定着する",
        },
        {
          title: "エラーを恐れない",
          body: "エラーはヒント。プロも毎日エラーと格闘している",
        },
        {
          title: "詰まったら基礎に戻る",
          body: "前提知識が抜けているだけのことが多い。ロードマップで確認しよう",
        },
        {
          title: "復習サイクルを守る",
          body: "赤くなった項目を優先復習。記憶は繰り返しで定着する",
        },
      ].map(({ title, body }) => (
        <Box component="li" key={title} sx={{ mb: 1 }}>
          <Typography variant="body1">
            <strong>{title}</strong>：{body}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

// ============================================================
// メインコンポーネント: LearningGuideDialog
// ============================================================
interface LearningGuideDialogProps {
  open: boolean;
  onClose: () => void;
}

export const LearningGuideDialog: FC<LearningGuideDialogProps> = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      {/* ヘッダー */}
      <Box sx={{ px: 3, pt: 2, pb: 0 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          学習ガイド
        </Typography>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="ロードマップ" />
          <Tab label="このサイトの使い方" />
        </Tabs>
      </Box>

      {/* コンテンツ */}
      <DialogContent dividers>
        <TabPanel value={tabIndex} index={0}>
          <RoadmapTab />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <UsageGuideTab />
        </TabPanel>
      </DialogContent>

      {/* フッター */}
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};
