import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import LayerDiagram, {type LayerKey} from '@site/src/components/LayerDiagram';
import {LAYERS} from '@site/src/data/layers';
import {
  CHAPTERS,
  PARTS,
  TEMPLATE_LABEL,
  chapterByNumber,
  totalVideoTime,
} from '@site/src/data/chapters';
import styles from './index.module.css';

/**
 * The Blueprint over The Index.
 *
 * No pitch. A developer landing here should know inside one screen what this
 * is, whether it is for them, and where to click. The architecture answers
 * the first two; the contents underneath answer the third.
 */
export default function Home(): JSX.Element {
  const [layer, setLayer] = useState<LayerKey>('domain');
  const [term, setTerm] = useState('');
  const [part, setPart] = useState<string | null>(null);

  const info = LAYERS[layer];
  const q = term.trim().toLowerCase();

  const groups = useMemo(
    () =>
      PARTS.map((p) => ({
        part: p,
        chapters: CHAPTERS.filter(
          (c) =>
            c.part === p.key &&
            (!part || c.part === part) &&
            (!q || `${c.title} ${c.blurb}`.toLowerCase().includes(q)),
        ),
      })).filter((g) => g.chapters.length > 0),
    [q, part],
  );

  const shown = groups.reduce((n, g) => n + g.chapters.length, 0);

  return (
    <Layout
      title="The complete guide to the Apex Common Library"
      description="Seventeen chapters on Separation of Concerns in Salesforce and implementing it with fflib-apex-common. Every chapter has a video. Free, forever.">
      <div className={styles.shell}>
        {/* ── masthead ── */}
        <div className={styles.mast}>
          <span className="cw-eyebrow">
            Separation of Concerns on the Salesforce platform
          </span>
          <h1>The library that will allow your Salesforce org to scale however you need it to.</h1>
          <p>
            Seventeen chapters on how to implement{' '}
            <strong><a href="https://github.com/apex-enterprise-patterns/fflib-apex-common">The Apex Common Library</a></strong> in your Salesforce org. 
            Every chapter has a video.
            Everything here is open source forever. 
          </p>
          <ul className={styles.facts}>
            <li>Written for Apex developers and architects</li>
            <li>{totalVideoTime()} of video</li>
          </ul>
        </div>

        {/* ── the blueprint ── */}
        <div className={`${styles.plan} cw-tick`}>
          <div className={styles.canvas}>
            <div className={styles.canvasHead}>
              <span>How the Separation of Concerns layers work together</span>
              <em>showing {info.name.toLowerCase()}</em>
            </div>
            <div className={styles.figwrap}>
              <LayerDiagram highlight={layer} onPick={setLayer} interactive />
            </div>
          </div>

          <div className={styles.detail}>
            <div className={styles.detailLab}>{info.label}</div>
            <h2>{info.name}</h2>
            <p className={styles.owns}>{info.owns}</p>
            <div className={styles.rule}>
              <b>{info.ruleHeading}</b>
              <p>{info.rule}</p>
            </div>
            <div className={styles.chListHead}>Chapters</div>
            <div className={styles.chList}>
              {info.chapters.map((n) => {
                const c = chapterByNumber(n)!;
                return (
                  <Link key={n} to={c.slug}>
                    <span className={styles.chNum}>
                      {String(c.n).padStart(2, '0')}
                    </span>
                    <span className={styles.chTitle}>{c.short}</span>
                    <span className={styles.chDur}>{c.duration}</span>
                  </Link>
                );
              })}
            </div>
            <div className={styles.detailFoot}>
              <Link
                className="cw-pill"
                to={chapterByNumber(info.chapters[0])!.slug}>
                Start at chapter{' '}
                {String(info.chapters[0]).padStart(2, '0')}
              </Link>
            </div>
          </div>
        </div>

        {/* ── the index ── */}
        <div className={styles.idxHead}>
          <span className="cw-eyebrow">All seventeen chapters</span>
          <h2>Read it in order, or jump to the layer you're interested in.</h2>
          <p>
            Find out exactly what you need to implement the Apex Common Library, fast.
          </p>
        </div>

        <div className={styles.tools}>
          <label className={styles.search}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Filter chapters…"
              aria-label="Filter chapters"
            />
          </label>
          <div className={styles.chips}>
            {PARTS.map((p) => (
              <button
                type="button"
                key={p.key}
                className={`${styles.chip}${part === p.key ? ` ${styles.chipOn}` : ''}`}
                onClick={() => setPart(part === p.key ? null : p.key)}>
                {p.title.replace(/^The /, '')}
              </button>
            ))}
          </div>
          <span className={styles.count}>{shown} of 17 chapters</span>
        </div>

        {groups.map(({part: p, chapters}) => (
          <section className={styles.part} key={p.key}>
            <div className={styles.partHead}>
              <i />
              <h3>{p.title}</h3>
              <span>
                {String(chapters[0].n).padStart(2, '0')}–
                {String(chapters[chapters.length - 1].n).padStart(2, '0')}
              </span>
              <span>
                {chapters.length} chapter{chapters.length > 1 ? 's' : ''}
              </span>
            </div>
            {chapters.map((c) => (
              <Link className={styles.row} key={c.n} to={c.slug}>
                <span className={styles.rowNum}>
                  {String(c.n).padStart(2, '0')}
                </span>
                <span>
                  <span className={styles.rowTitle}>{c.title}</span>
                  <span className={styles.rowBlurb}>{c.blurb}</span>
                </span>
                <span className={styles.rowMeta}>
                  <span>{c.read} read</span>
                  <span>video {c.duration}</span>
                  <span className={styles.rowTpl}>
                    {TEMPLATE_LABEL[c.template]}
                  </span>
                </span>
              </Link>
            ))}
          </section>
        ))}

        {shown === 0 && (
          <div className={styles.empty}>
            <b>No chapter matches that</b>
            <span>
              Try “selector”, “mocks”, “factory” or clear the filter.
            </span>
          </div>
        )}

        {/* ── closing strip ── */}
        <div className={styles.tail}>
          <Link to="/videos/">
            <div className={styles.tailH}>Related</div>
            <div className={styles.tailT}>The videos, as one course</div>
            <div className={styles.tailS}>
              All seventeen walkthroughs in order, {totalVideoTime()} in total.
            </div>
          </Link>
          <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/tree/main/src">
            <div className={styles.tailH}>Related</div>
            <div className={styles.tailT}>Working example org</div>
            <div className={styles.tailS}>
              Every class in this guide, deployable, in the repo's src directory.
            </div>
          </a>
          <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/issues">
            <div className={styles.tailH}>Something wrong?</div>
            <div className={styles.tailT}>Open an issue</div>
            <div className={styles.tailS}>
              Missing detail, unclear section, or an outright mistake — tell me
              and I'll fix it.
            </div>
          </a>
        </div>
      </div>
    </Layout>
  );
}
