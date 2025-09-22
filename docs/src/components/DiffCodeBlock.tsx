import React from "react";
import styles from "../css/DiffCodeBlock.module.css";

type DiffCodeBlockProps = {
  code: string; // diff結果をそのまま渡す
  language?: string;
};

/**
 * Diff風に表示するが、コピー時には + / - を含めないコンポーネント
 */
export const DiffCodeBlock: React.FC<DiffCodeBlockProps> = ({
  code,
  language = "java",
}) => {
  const lines = code.replace(/\r\n/g, "\n").split("\n");

  return (
    <pre className={`language-${language}`}>
      <code>
        {lines.map((line, idx) => {
          const firstChar = line[0];
          let type: "added" | "removed" | "context" = "context";
          if (firstChar === "+") type = "added";
          else if (firstChar === "-") type = "removed";

          const text = type === "context" ? line : line.slice(1);

          return (
            <div key={idx} className={`${styles.line} ${styles[type]}`}>
              {/* 擬似的に記号を表示するがコピーされない */}
              <span className={styles.symbol} aria-hidden="true" />
              <span className={styles.code}>{text}</span>
            </div>
          );
        })}
      </code>
    </pre>
  );
};
