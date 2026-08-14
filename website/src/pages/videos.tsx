import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
  CHAPTERS,
  PARTS,
  chaptersByPart,
  totalVideoTime,
} from '@site/src/data/chapters';
import styles from './videos.module.css';

/**
 * The seventeen companion videos, collected.
 *
 * On the MkDocs site these were reachable one chapter at a time and nowhere
 * else. Grouping them is a genuinely new thing the site can do.
 */
export default function Videos(): JSX.Element {
  const [watched, setWatched] = useState<Set<number>>(new Set());
  const groups = chaptersByPart();

  const toggle = (n: number) =>
    setWatched((prev) => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });

  const nextUp = CHAPTERS.find((c) => !watched.has(c.n));
  const pct = Math.round((watched.size / CHAPTERS.length) * 100);

  return (
    <Layout
      title="The videos"
      description="All seventeen companion walkthroughs for the Apex Common Library guide, in order.">
      <div className={styles.shell}>
        <div className={styles.mast}>
          <span className="cw-eyebrow">Companion videos</span>
          <h1>The whole guide, on video</h1>
          <p>
            Seventeen walkthroughs in the order the chapters build on each
            other — {totalVideoTime()} in total. Every one is free, and every
            one pairs with a written chapter if you would rather read it.
          </p>
        </div>

        <div className={`${styles.resume} cw-tick`}>
          <div className={styles.resumeBody}>
            <div className={styles.resumeLab}>
              {nextUp ? 'Pick up where you left off' : 'You finished the guide'}
            </div>
            <h2>{nextUp ? nextUp.title : 'All seventeen watched'}</h2>
            <p>
              {nextUp
                ? `Chapter ${String(nextUp.n).padStart(2, '0')} · ${nextUp.duration} · ${watched.size} of 17 watched (${pct}%)`
                : 'Go build something.'}
            </p>
            <div className={styles.bar}>
              <i style={{width: `${pct}%`}} />
            </div>
            <div className={styles.resumeActs}>
              {nextUp && (
                <>
                  <a
                    className="cw-pill"
                    href={`https://www.youtube.com/watch?v=${nextUp.video}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    Watch on YouTube
                  </a>
                  <Link className="cw-pill cw-pill--ghost" to={nextUp.slug}>
                    Read the chapter instead
                  </Link>
                </>
              )}
              {watched.size > 0 && (
                <button
                  type="button"
                  className="cw-pill cw-pill--ghost"
                  onClick={() => setWatched(new Set())}>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {groups.map(({part, chapters}) => (
          <section className={styles.part} key={part.key}>
            <div className={styles.partHead}>
              <i />
              <h3>{part.title}</h3>
              <span>
                {chapters.length} video{chapters.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className={styles.grid}>
              {chapters.map((c) => (
                <article
                  className={`${styles.card}${watched.has(c.n) ? ` ${styles.cardDone}` : ''}`}
                  key={c.n}>
                  <a
                    className={styles.thumb}
                    href={`https://www.youtube.com/watch?v=${c.video}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch ${c.title} on YouTube`}>
                    <img
                      className={styles.thumbImg}
                      src={`https://i.ytimg.com/vi/${c.video}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={styles.scrim} aria-hidden="true" />
                    <span className={styles.big}>
                      {String(c.n).padStart(2, '0')}
                    </span>
                    <span className={styles.btn} aria-hidden="true">
                      <span className={styles.play} />
                    </span>
                    <span className={styles.dur}>{c.duration}</span>
                  </a>
                  <div className={styles.body}>
                    <div className={styles.meta}>
                      Chapter {String(c.n).padStart(2, '0')}
                    </div>
                    <Link className={styles.title} to={c.slug}>
                      {c.title}
                    </Link>
                    <div className={styles.blurb}>{c.blurb}</div>
                    <div className={styles.acts}>
                      <button
                        type="button"
                        className={styles.mark}
                        onClick={() => toggle(c.n)}>
                        <span className={styles.box}>
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m4 12 6 6L20 6" />
                          </svg>
                        </span>
                        {watched.has(c.n) ? 'Watched' : 'Mark watched'}
                      </button>
                      <Link className={styles.read} to={c.slug}>
                        Read →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
}
