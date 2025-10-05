import { ALL_TOPIC_STRUCTURE } from "@site/src/structure";
import { FC } from "react";
import { QuestionRenderer } from "../QuestionRenderer";

const allTopics = ALL_TOPIC_STRUCTURE;

export const Dashboard: FC = () => {
  return (
    <div>
      <p>Welcome to the Programming Bootcamp!</p>
      {ALL_TOPIC_STRUCTURE.map((topic) => (
        <div key={topic.id}>
          <h2>{topic.label}</h2>
          {topic.questions.map((q) => (
            <>
              <div key={q.id}>
                <a href={`${q.id}`}>{q.title}</a>
              </div>
            </>
          ))}
        </div>
      ))}
    </div>
  );
};
