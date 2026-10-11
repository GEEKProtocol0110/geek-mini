"use client";
import { lessonFor } from "../utils/learningPath";
import { useState } from "react";
import { questionById, type RoundReview as ReviewItem } from "../utils/questionBank";

export function RoundReview({ items }: { items?: ReviewItem[] }) {
  const [missedOnly, setMissedOnly] = useState(false);
  if (!items) return <p className="review-unavailable">Answer review is available for new rounds played with this question bank.</p>;
  return <section className="round-review" aria-labelledby="review-title">
    <span className="eyebrow">Keep the knowledge</span><h2 id="review-title">Review your round.</h2>
    <p>Open a question to revisit your answer, the explanation and its source. Only questions you reached are shown.</p>
    <div className="review-filters" role="group" aria-label="Answer review filter"><button type="button" aria-pressed={!missedOnly} onClick={() => setMissedOnly(false)}>All questions</button><button type="button" aria-pressed={missedOnly} onClick={() => setMissedOnly(true)}>Focus on missed answers</button></div>
    {missedOnly && items.every(item => item.selected === questionById.get(item.questionId)?.answer) && <p role="status">Nothing missed. You can revisit every explanation in All questions.</p>}
    {items.map((item, index) => {
      const question = questionById.get(item.questionId)!;
      const correct = item.selected === question.answer;
      if (missedOnly && correct) return null;
      const status = item.selected === null ? "Not answered" : correct ? "Correct" : "Missed";
      return <details className="review-item" key={item.questionId}>
        <summary><span className="review-number">{String(index + 1).padStart(2, "0")}</span><span>{question.question}</span><span className={`review-status${correct ? " review-correct" : ""}`}>{status}</span></summary>
        <div className="review-body"><dl><div><dt>Your answer</dt><dd>{item.selected === null ? "Time ran out before an answer." : question.choices[item.selected]}</dd></div><div><dt>Correct answer</dt><dd>{question.choices[question.answer]}</dd></div></dl><p>{question.explain}</p><a className="source-link" href={question.source.url} target="_blank" rel="noopener noreferrer">{question.source.label} ↗</a>{lessonFor(question) && <p><a className="source-link" href={lessonFor(question)!.href} target="_blank" rel="noopener noreferrer">Explore this topic with A.C.E. ↗</a></p>}</div>
      </details>;
    })}
  </section>;
}
