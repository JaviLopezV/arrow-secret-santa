import type { Messages } from "@/i18n/messages";

export function Faq({ m }: { m: Messages }) {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">{m.faq.title}</h2>
      <p>{m.faq.description}</p>
      {m.faq.items.map(({ question, answer }) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </section>
  );
}
