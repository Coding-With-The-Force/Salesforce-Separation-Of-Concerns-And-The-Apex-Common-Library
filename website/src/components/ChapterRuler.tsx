import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {CHAPTERS, chapterBySlug} from '@site/src/data/chapters';

/**
 * Chapter navigation as a measured ruler — seventeen ticks, the most honest
 * blueprint motif available, and the thing that let the sidebar go away.
 *
 * Chapters run horizontally here; sections run vertically on the left rail.
 * Two axes, no overlap.
 */
export default function ChapterRuler(): JSX.Element | null {
  const {pathname} = useLocation();
  const current = chapterBySlug(pathname);

  return (
    <div className="cw-rulerwrap">
      <div className="cw-rulerwrap__in">
        <div className="cw-ruler">
          <div className="cw-ruler__track">
            {CHAPTERS.map((c) => {
              const major = c.n % 5 === 0 || c.n === 1;
              const on = current?.n === c.n;
              const done = current ? c.n < current.n : false;
              return (
                <Link
                  key={c.n}
                  to={c.slug}
                  className={[
                    'cw-tickmark',
                    major && 'cw-tickmark--major',
                    on && 'cw-tickmark--on',
                    done && 'cw-tickmark--done',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={on ? 'page' : undefined}>
                  <span className="cw-tickmark__tip">
                    {String(c.n).padStart(2, '0')} · {c.short}
                  </span>
                  <span className="cw-tickmark__lbl">
                    {major ? String(c.n).padStart(2, '0') : ' '}
                  </span>
                  <span className="cw-tickmark__bar" />
                </Link>
              );
            })}
          </div>
        </div>
        <div className="cw-rulercap">
          <span>
            <b>01</b> Separation of Concerns
          </span>
          <span>
            {current ? (
              <>
                Chapter <b>{String(current.n).padStart(2, '0')}</b> of 17
              </>
            ) : (
              <Link to="/">All seventeen chapters</Link>
            )}
          </span>
          <span>
            <b>17</b> Apex Mocks
          </span>
        </div>
      </div>
    </div>
  );
}
