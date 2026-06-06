import type { Metadata } from 'next';
import { getTalks } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Speaking',
  alternates: {
    canonical: '/speaking/'
  }
};

export default function SpeakingPage() {
  const talks = getTalks();

  return (
    <main className="shell page-content narrow">
      <section className="page-heading">
        <h1>Speaking</h1>
        <p>Conference and meetup talks from the archive.</p>
      </section>
      <ul className="talk-list">
        {talks.map((talk) => (
          <li key={talk.url}>
            <a href={talk.url}>{talk.summary}</a>
            <span>{talk.location}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
