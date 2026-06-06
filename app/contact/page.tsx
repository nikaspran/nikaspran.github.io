import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Say Hello',
  alternates: {
    canonical: '/contact/'
  }
};

export default function ContactPage() {
  return (
    <main className="shell page-content narrow">
      <section className="page-heading">
        <h1>Say hello.</h1>
        <p>Send a note through the form or email me directly.</p>
      </section>
      <form action={`https://formspree.io/${site.email}`} method="POST" className="contact-form">
        <label>
          Email address
          <input type="email" name="email" placeholder="you@example.com" />
        </label>
        <label>
          Message
          <textarea name="content" rows={6} placeholder="What would you like to say?" />
        </label>
        <div className="form-actions">
          <button type="submit">Say Hello</button>
          <span>
            or email me at <a href={`mailto:${site.email}`}>{site.email}</a>
          </span>
        </div>
      </form>
    </main>
  );
}
