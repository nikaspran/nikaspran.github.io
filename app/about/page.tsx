import type { Metadata } from 'next';
import { SocialIcon } from '@/components/SocialIcon';
import { getTalks } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  alternates: {
    canonical: '/about/'
  }
};

const work = [
  ['2020-06', 'Ongoing', 'Undisclosed - Engineering Manager', 'React, Next.js, Sanity.io'],
  ['2017-04', '2020-03', 'Hostmaker.com - Principal Engineer', 'React, Redux, Next.js, Node, AWS, Kubernetes'],
  ['2017-01', '2017-04', 'UK Healthcare industry - React Consulting', 'React, React Native, Redux, GraphQL, Node'],
  ['2015-10', '2016-11', 'Wrap Media - Senior Front End Developer', 'Angular, Node, CoffeeScript, TypeScript'],
  ['2014-02', '2015-10', 'Wix - Front End Developer', 'Angular, JavaScript, Gulp, Grunt, HTML, Sass'],
  ['2013-10', '2014-02', 'Barclays - Gateway Developer', 'Java, Spring, Hibernate'],
  ['2012-01', '2013-09', 'Insoft - Java Developer', 'Java, Spring, Hibernate, Oracle DB, SQL, ZK']
];

const projects = [
  ['YGLF Lithuania 2020', 'https://lithuania.yglfconf.com/', 'organiser'],
  ['YGLF Lithuania 2019', 'https://www.2019-lithuania.yglfconf.com/', 'organiser'],
  ['Suggest subreddit', 'https://nikas.praninskas.com/suggest-subreddit/', 'TypeScript'],
  ['ast-query', 'https://marketplace.visualstudio.com/items?itemName=nikaspran.ast-query', 'TypeScript, VSCode'],
  ['Nunjucks Playground', 'https://nikas.praninskas.com/nunjucks-playground/', 'TypeScript, Nunjucks, Tailwind']
];

const socialLinks = [
  ['Website', 'nikas.praninskas.com', 'https://nikas.praninskas.com', 'website'],
  ['Email', 'nikaspran@gmail.com', 'mailto:nikaspran@gmail.com', 'email'],
  ['Bluesky', '@nikaspran.bsky.social', 'https://bsky.app/profile/nikaspran.bsky.social', 'bluesky'],
  ['GitHub', 'github/nikaspran', 'https://github.com/nikaspran', 'github'],
  ['LinkedIn', 'nikas-p-48b54350', 'https://www.linkedin.com/in/nikas-p-48b54350/', 'linkedin']
] as const;

export default function AboutPage() {
  const talks = getTalks();

  return (
    <main className="shell page-content narrow">
      <section className="page-heading">
        <h1>Hello.</h1>
        <p>
          I am an engineering manager with a technical focus. I build teams, solve difficult problems,
          and keep close enough to the code to make useful technical decisions.
        </p>
      </section>

      <section className="content-section">
        <h2>Social</h2>
        <ul className="social-grid">
          {socialLinks.map(([label, value, href, icon]) => (
            <li key={label}>
              <a href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                <SocialIcon name={icon} />
                <span>
                  <strong>{label}</strong>
                  <em>{value}</em>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="content-section">
        <h2>Work</h2>
        <ol className="timeline">
          {work.map(([start, end, role, stack]) => (
            <li key={`${start}-${role}`}>
              <time>{start} - {end}</time>
              <div>
                <h3>{role}</h3>
                <p>{stack}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="content-section">
        <h2>Side projects</h2>
        <ul className="link-list">
          {projects.map(([name, href, description]) => (
            <li key={name}>
              <a href={href} target="_blank" rel="noreferrer">
                {name}
              </a>{' '}
              - {description}
            </li>
          ))}
          <li>tokenjs.com - React, Node, Feathers, Parity, Bitcoind</li>
          <li>bookhunter.co - React, Redux, Node</li>
        </ul>
      </section>

      <section className="content-section">
        <h2>Talks</h2>
        <ul className="link-list">
          {talks.map((talk) => (
            <li key={talk.url}>
              <a href={talk.url}>{talk.summary}</a>
              {talk.location ? `, given at ${talk.location}` : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="content-section">
        <h2>Education</h2>
        <p>BS, Software Engineering. Vilnius University, 2009-2013.</p>
      </section>
    </main>
  );
}
