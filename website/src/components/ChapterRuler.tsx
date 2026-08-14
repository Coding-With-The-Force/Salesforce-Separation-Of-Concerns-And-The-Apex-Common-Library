import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {CHAPTERS, chapterBySlug} from '@site/src/data/chapters';

/**
 * Chapter navigation as a measured ruler — seventeen ticks, the most honest
 * blueprint motif available, and the thing that let the sidebar go away.
 *
 * Chapters run horizontally here; sections run vertically on the left rail.
 *
 * The tick label is a readout under the ruler rather than a popup above it.
 * A popup can't work: the track needs overflow-x for narrow viewports, and
 * overflow clips any child that tries to escape it, so titles were being cut
 * off. The readout sits outside the scroller and has the full width to use.
 */
export default function ChapterRuler(): JSX.Element {
  const {pathname} = useLocation();
  const current = chapterBySlug(pathname);
  const [hovered, setHovered] = useState<number | null>(null);

  const shown = hovered != null ? CHAPTERS.find((c) => c.n === hovered) : current;

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
                  title={`${String(c.n).padStart(2, '0')} · ${c.short}`}
                  className={[
                    'cw-tickmark',
                    major && 'cw-tickmark--major',
                    on && 'cw-tickmark--on',
                    done && 'cw-tickmark--done',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={on ? 'page' : undefined}
                  onMouseEnter={() => setHovered(c.n)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(c.n)}
                  onBlur={() => setHovered(null)}>
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
          <span className="cw-rulercap__end">
            <b>01</b> Separation of Concerns
          </span>

          <span
            className={`cw-rulercap__read${hovered != null ? ' cw-rulercap__read--hot' : ''}`}
            aria-live="polite">
            {shown ? (
              <>
                <b>{String(shown.n).padStart(2, '0')}</b> {shown.short}
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
