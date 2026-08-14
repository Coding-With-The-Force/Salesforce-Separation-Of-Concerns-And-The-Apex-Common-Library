import React, {createContext, useContext, useMemo, useState} from 'react';

/**
 * The build-along used by the implementation chapters (08, 11, 14, 17).
 *
 * These chapters mirror a video step for step, so the page is shaped like
 * the video: a file manifest up front, then numbered steps you can tick off
 * with a timestamp that jumps to the right moment.
 *
 *   <Steps>
 *     <Step title="Extend fflib_SObjectDomain" time="02:14" file="Cases.cls">
 *       …markdown…
 *     </Step>
 *   </Steps>
 */

interface Ctx {
  done: Set<number>;
  toggle: (i: number) => void;
  video?: string;
}
const StepsCtx = createContext<Ctx | null>(null);

/** Turn "02:14" into the seconds YouTube wants on a ?t= param. */
function toSeconds(time: string): number {
  const parts = time.split(':').map(Number);
  return parts.length === 3
    ? parts[0] * 3600 + parts[1] * 60 + parts[2]
    : parts[0] * 60 + parts[1];
}

export function Step({
  title,
  time,
  file,
  index = 0,
  children,
}: {
  title: string;
  time?: string;
  file?: string;
  index?: number;
  children: React.ReactNode;
}): JSX.Element {
  const ctx = useContext(StepsCtx);
  const done = ctx?.done.has(index) ?? false;
  const n = String(index + 1).padStart(2, '0');

  return (
    <section
      className={`cw-step${done ? ' cw-step--done' : ''}`}
      id={`step-${index + 1}`}>
      <div className="cw-step__h">
        <button
          type="button"
          className="cw-step__tick"
          aria-pressed={done}
          aria-label={`Mark step ${index + 1} done`}
          onClick={() => ctx?.toggle(index)}>
          {n}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m4 12 6 6L20 6" />
          </svg>
        </button>
        <div className="cw-step__t">
          <h3>{title}</h3>
          <div className="cw-step__meta">
            {time && (
              <a
                className="cw-ts"
                href={
                  ctx?.video
                    ? `https://www.youtube.com/watch?v=${ctx.video}&t=${toSeconds(time)}s`
                    : '#'
                }
                target="_blank"
                rel="noopener noreferrer">
                {time}
              </a>
            )}
            {file && <span>{file}</span>}
          </div>
        </div>
      </div>
      <div className="cw-step__b">{children}</div>
    </section>
  );
}
(Step as any).cwRole = 'step';

export default function Steps({
  video,
  children,
}: {
  video?: string;
  children: React.ReactNode;
}): JSX.Element {
  const [done, setDone] = useState<Set<number>>(new Set());

  const steps = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (c) => React.isValidElement(c) && (c.type as any)?.cwRole === 'step',
      ) as React.ReactElement[],
    [children],
  );

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const jump = (i: number) => {
    document
      .getElementById(`step-${i + 1}`)
      ?.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  return (
    <StepsCtx.Provider value={{done, toggle, video}}>
      <div className="cw-stepbar">
        <span className="cw-stepbar__lab">Progress</span>
        <span className="cw-pips">
          {steps.map((_, i) => (
            <button
              type="button"
              key={i}
              className={done.has(i) ? 'cw-pip--done' : undefined}
              aria-label={`Go to step ${i + 1}`}
              onClick={() => jump(i)}
            />
          ))}
        </span>
        <span className="cw-stepbar__cnt">
          {done.size} / {steps.length}
        </span>
        <button
          type="button"
          className="cw-stepbar__reset"
          onClick={() => setDone(new Set())}>
          Reset
        </button>
      </div>
      {steps.map((s, i) => React.cloneElement(s, {index: i, key: i}))}
    </StepsCtx.Provider>
  );
}

/* ── the file manifest ────────────────────────────────────────── */

export function Manifest({
  title = "What you'll end up with",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="cw-manifest cw-tick" style={{border: '1px solid var(--cw-line)'}}>
      <div className="cw-manifest__h">{title}</div>
      {children}
    </div>
  );
}

export function MFile({
  kind = 'new',
  name,
  lines,
}: {
  kind?: 'new' | 'edit';
  name: string;
  lines?: string;
}): JSX.Element {
  return (
    <div className="cw-mfile">
      <span className={`cw-mfile__k cw-mfile__k--${kind}`}>{kind}</span>
      <span className="cw-mfile__f">{name}</span>
      {lines && <span className="cw-mfile__l">{lines}</span>}
    </div>
  );
}

/* ── the deploy strip ─────────────────────────────────────────── */

export function Deploy({command, label = 'Deploy it'}: {command: string; label?: string}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="cw-deploy">
      <span className="cw-deploy__lab">{label}</span>
      <code>{command}</code>
      <button
        type="button"
        className={`cw-copybtn${copied ? ' cw-copybtn--done' : ''}`}
        onClick={() => {
          navigator.clipboard?.writeText(command);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
