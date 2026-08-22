import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Highlight} from 'prism-react-renderer';
import {cwtfPrismDark} from '@site/src/theme/prismTheme';

/**
 * Literate-programming layout for the two long chapters - 04 (412 lines) and
 * 17 (541). Both are really one long walk through one long file, so the file
 * stays pinned on the right and the notes walk down it, lighting the lines
 * each note is about.
 *
 *   import {APPLICATION_CLS} from '@site/src/snippets/application';
 *
 *   <AnnotatedSource file="Application.cls" source={APPLICATION_CLS}>
 *     <SourceNote lines="3-13" label="Unit of Work" title="…">…</SourceNote>
 *   </AnnotatedSource>
 */

export function SourceNote({
  children,
}: {
  lines: string;
  label: string;
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return <>{children}</>;
}
(SourceNote as any).cwRole = 'sourcenote';

function parseRange(spec: string): [number, number] {
  const [a, b] = spec.split('-').map((s) => parseInt(s.trim(), 10));
  return [a, Number.isFinite(b) ? b : a];
}

export default function AnnotatedSource({
  file,
  lang = 'apex',
  source,
  children,
}: {
  file: string;
  lang?: string;
  source: string;
  children: React.ReactNode;
}): JSX.Element {
  const notes = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (c) => React.isValidElement(c) && (c.type as any)?.cwRole === 'sourcenote',
      ) as React.ReactElement[],
    [children],
  );

  const [active, setActive] = useState(0);
  const [dim, setDim] = useState(true);
  const [copied, setCopied] = useState(false);
  const noteRefs = useRef<(HTMLElement | null)[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [from, to] = notes.length
    ? parseRange(notes[active].props.lines)
    : [0, 0];

  /* Which note is the reader on. */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = noteRefs.current.indexOf(e.target as HTMLElement);
            if (i >= 0) setActive(i);
          }
        });
      },
      {rootMargin: '-20% 0px -58% 0px'},
    );
    noteRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [notes.length]);

  /* Bring the lit range into view inside the pinned pane. */
  useEffect(() => {
    const body = bodyRef.current;
    if (!body || window.innerWidth <= 1120) return;
    const first = body.querySelector<HTMLElement>(`[data-n="${from}"]`);
    if (!first) return;
    body.scrollTo({
      top: Math.max(0, first.offsetTop - body.clientHeight * 0.28),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  }, [from]);

  return (
    <div className="cw-anno">
      <div className="cw-anno__notes">
        {notes.map((n, i) => (
          <section
            key={i}
            ref={(el) => {
              noteRefs.current[i] = el;
            }}
            className={`cw-anote${i === active ? ' cw-anote--live' : ''}`}>
            <div className="cw-anote__k">
              <span className="cw-anote__ix">{String(i + 1).padStart(2, '0')}</span>
              <span>{n.props.label}</span>
              <span className="cw-anote__rng">lines {n.props.lines}</span>
            </div>
            <h3>{n.props.title}</h3>
            {n}
          </section>
        ))}
      </div>

      <div className="cw-src">
        <div className="cw-src__frame">
          <div className="cw-src__bar">
            <span className="cw-src__file">{file}</span>
            <span className="cw-src__lang">{lang}</span>
            <span className="cw-src__here">
              {from === to ? `line ${from}` : `lines ${from}–${to}`}
            </span>
          </div>
          <div className="cw-src__body" ref={bodyRef}>
            <Highlight theme={cwtfPrismDark} code={source.trim()} language={lang}>
              {({tokens, getLineProps, getTokenProps}) => (
                <pre>
                  {tokens.map((line, i) => {
                    const n = i + 1;
                    const hot = n >= from && n <= to;
                    return (
                      <span
                        {...getLineProps({line})}
                        key={i}
                        data-n={n}
                        className={`cw-ln${hot ? ' cw-ln--hot' : ''}${
                          dim && !hot ? ' cw-ln--dim' : ''
                        }`}>
                        {line.map((token, k) => (
                          <span {...getTokenProps({token})} key={k} />
                        ))}
                      </span>
                    );
                  })}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
        <div className="cw-src__bar" style={{border: 0, paddingInline: 0}}>
          <button
            type="button"
            className={`cw-copybtn${dim ? ' cw-copybtn--done' : ''}`}
            onClick={() => setDim((d) => !d)}>
            Dim the rest
          </button>
          <button
            type="button"
            className={`cw-copybtn${copied ? ' cw-copybtn--done' : ''}`}
            onClick={() => {
              navigator.clipboard?.writeText(source.trim());
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}>
            {copied ? 'Copied' : 'Copy the file'}
          </button>
        </div>
      </div>
    </div>
  );
}
