import { questionById, type RoundReview as ReviewItem } from "../utils/questionBank";

export function RoundReview({ items }: { items?: ReviewItem[] }) {
  if (!items) return <p className="review-unavailable">Answer review is available for new rounds played with this question bank.</p>;
  return <section className="round-review" aria-labelledby="review-title">
    <span className="eyebrow">Keep the knowledge</span><h2 id="review-title">Review your round.</h2>
    <p>Open a question to revisit your answer, the explanation and its source. Only questions you reached are shown.</p>
    {items.map((item, index) => {
      const question = questionById.get(item.questionId)!;
      const correct = item.selected === question.answer;
      const status = item.selected === null ? "Not answered" : correct ? "Correct" : "Missed";
      return <details className="review-item" key={item.questionId}>
        <summary><span className="review-number">{String(index + 1).padStart(2, "0")}</span><span>{question.question}</span><span className={`review-status${correct ? " review-correct" : ""}`}>{status}</span></summary>
        <div className="review-body"><dl><div><dt>Your answer</dt><dd>{item.selected === null ? "Time ran out before an answer." : question.choices[item.selected]}</dd></div><div><dt>Correct answer</dt><dd>{question.choices[question.answer]}</dd></div></dl><p>{question.explain}</p><a className="source-link" href={question.source.url} target="_blank" rel="noopener noreferrer">{question.source.label} ↗</a></div>
      </details>;
    })}
  </section>;
}
