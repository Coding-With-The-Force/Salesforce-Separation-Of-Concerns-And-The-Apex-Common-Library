import React, {useLayoutEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {CHAPTERS, chapterBySlug, type Chapter} from '@site/src/data/chapters';

/**
 * Chapter navigation as a measured ruler — seventeen ticks, the most honest
 * blueprint motif available, and the thing that let the sidebar go away.
 *
 * Chapters run horizontally here; sections run vertically on the left rail.
 *
 * The hover bubble is rendered as a sibling of the scrolling track rather
 * than a child of it. A child gets clipped — the track needs overflow-x for
 * narrow viewports, and overflow clips anything trying to escape, which is
 * what was cutting the titles off. From out here it is only bounded by the
 * shell, and it gets clamped to those edges after measuring so the first and
 * last ticks don't push it off-screen.
 */
export default function ChapterRuler(): JSX.Element {
  const {pathname} = useLocation();
  const current = chapterBySlug(pathname);

  const wrapRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const [tip, setTip] = useState<{chapter: Chapter; x: number} | null>(null);

  /* Clamp after render, once the bubble's real width is known. Layout effect
     so it happens before paint and never flashes at the wrong x. */
  useLayoutEffect(() => {
    const el = tipRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap || !tip) return;
    const half = el.offsetWidth / 2;
    const limit = wrap.clientWidth;
    el.style.left = `${Math.min(Math.max(tip.x, half + 2), limit - half - 2)}px`;
  }, [tip]);

  const point = (chapter: Chapter, el: HTMLElement) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const t = el.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    setTip({chapter, x: t.left + t.width / 2 - w.left});
  };

  /**
   * Delegated, not per-tick.
   *
   * Docusaurus's <Link> spreads your props and then sets its own
   * onMouseEnter for route prefetching, so a handler passed to it is
   * silently dropped — which is why this only used to fire on focus.
   * mouseover bubbles, so catching it on the track sidesteps that
   * entirely and costs one listener instead of seventeen.
   */
  const onOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('.cw-tickmark');
    if (!el) return;
    const chapter = CHAPTERS.find((c) => c.n === Number(el.dataset.n));
    if (chapter) point(chapter, el);
  };

  return (
    <div className="cw-rulerwrap">
      <div className="cw-rulerwrap__in" ref={wrapRef}>
        {tip && (
          <span
            className="cw-ruler__tip"
            ref={tipRef}
            style={{left: tip.x}}
            role="status">
            <b>{String(tip.chapter.n).padStart(2, '0')}</b> {tip.chapter.short}
          </span>
        )}

        <div className="cw-ruler">
          <div
            className="cw-ruler__track"
            onMouseOver={onOver}
            onMouseLeave={() => setTip(null)}>
            {CHAPTERS.map((c) => {
              const major = c.n % 5 === 0 || c.n === 1;
              const on = current?.n === c.n;
              const done = current ? c.n < current.n : false;
              return (
                <Link
                  key={c.n}
                  to={c.slug}
                  data-n={c.n}
                  // aria-label rather than title: the bubble already says
                  // this, and title would stack a native tooltip on top.
                  aria-label={`Chapter ${String(c.n).padStart(2, '0')} — ${c.short}`}
                  className={[
                    'cw-tickmark',
                    major && 'cw-tickmark--major',
                    on && 'cw-tickmark--on',
                    done && 'cw-tickmark--done',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={on ? 'page' : undefined}
                  onFocus={(e) => point(c, e.currentTarget)}
                  onBlur={() => setTip(null)}>
                  <span className="cw-tickmark__lbl">
                    {major ? String(c.n).padStart(2, '0') : ' '}
                  </span>
                  <span className="cw-tickmark__bar" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="cw-rulercap">
          <span className="cw-rulercap__end">
            <b>01</b> Separation of Concerns
          </span>
          <span className="cw-rulercap__read">
            {current ? (
              <>
                Chapter <b>{String(current.n).padStart(2, '0')}</b> of 17
              </>
            ) : (
              <Link to="/">All seventeen chapters</Link>
            )}
          </span>
          <span className="cw-rulercap__end">
            <b>17</b> Apex Mocks
          </span>
        </div>
      </div>
    </div>
  );
}
