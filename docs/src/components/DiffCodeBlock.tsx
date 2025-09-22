import React from "react";
import { Highlight, themes } from "prism-react-renderer";

export const DiffCodeBlock = ({ code, language = "java" }) => {
  const lines = code.replace(/\r\n/g, "\n").split("\n");

  const parsed = lines.map((line) => {
    if (line.startsWith("+")) return { type: "added", text: line.slice(1) };
    if (line.startsWith("-")) return { type: "removed", text: line.slice(1) };
    return { type: "context", text: line };
  });

  const pureCode = parsed.map((l) => l.text).join("\n");
  console.log({ pureCode });

  return (
    <Highlight code={pureCode} language={"java"} theme={themes.github}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: "1em" }}>
          {tokens.map((line, i) => {
            const { type } = parsed[i];
            return (
              <div
                key={i}
                {...getLineProps({ line })}
                style={{
                  display: "flex",
                  background:
                    type === "added"
                      ? "rgba(0,255,0,0.08)"
                      : type === "removed"
                      ? "rgba(255,0,0,0.08)"
                      : undefined,
                }}
              >
                <span
                  style={{
                    width: "1em",
                    userSelect: "none",
                    color:
                      type === "added"
                        ? "green"
                        : type === "removed"
                        ? "red"
                        : "transparent",
                  }}
                  aria-hidden="true"
                >
                  {type === "added" ? "+" : type === "removed" ? "-" : " "}
                </span>
                <span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};
