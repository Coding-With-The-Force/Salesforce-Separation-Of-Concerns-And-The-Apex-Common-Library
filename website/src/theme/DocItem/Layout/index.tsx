import React from 'react';
import Link from '@docusaurus/Link';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemContent from '@theme/DocItem/Content';
import ContentVisibility from '@theme/ContentVisibility';
import TOC from '@theme/TOC';
import type {Props} from '@theme/DocItem/Layout';
import {
  CHAPTERS,
  TEMPLATE_LABEL,
  chapterBySlug,
  chapterByNumber,
} from '@site/src/data/chapters';

/**
 * The chapter page: sections on the left rail, content on the right.
 *
 * The masthead (eyebrow, title, standfirst, meta line) is rendered here
 * rather than authored per chapter, so all twenty files stay clean
 * Markdown and the metadata lives in one table.
 */
export default function DocItemLayout({children}: Props): JSX.Element {
  const {metadata, frontMatter, toc} = useDoc();
  const chapter = chapterBySlug(metadata.permalink);

  const prev = chapter ? chapterByNumber(chapter.n - 1) : undefined;
  const next = chapter ? chapterByNumber(chapter.n + 1) : undefined;
  const showToc = !frontMatter.hide_table_of_contents && toc.length > 0;

  return (
    <div className="cw-docpage">
      <aside className="cw-rail">
        {showToc && (
          <>
            <p className="cw-rail__title">On this page</p>
            <TOC toc={toc} minHeadingLevel={2} maxHeadingLevel={3} />
          </>
        )}
        <nav className="cw-railnav" aria-label="Chapter navigation">
          {prev && (
            <Link to={prev.slug}>
              <span className="cw-railnav__d">
                ← Chapter {String(prev.n).padStart(2, '0')}
              </span>
              {prev.short}
            </Link>
          )}
          {next && (
            <Link to={next.slug}>
              <span className="cw-railnav__d">
                Chapter {String(next.n).padStart(2, '0')} →
              </span>
              {next.short}
            </Link>
          )}
          <Link to="/">
            <span className="cw-railnav__d">Contents</span>
            All twenty chapters
          </Link>
        </nav>
      </aside>

      <div className="cw-docmain">
        <ContentVisibility metadata={metadata} />

        <header className="cw-masthead">
          {chapter && (
            <span className="cw-eyebrow">
              Chapter {String(chapter.n).padStart(2, '0')} ·{' '}
              {TEMPLATE_LABEL[chapter.template] === 'Standard'
                ? partTitle(chapter.part)
                : TEMPLATE_LABEL[chapter.template]}
            </span>
          )}
          <h1>{metadata.title}</h1>
          {chapter && <p className="cw-standfirst">{chapter.blurb}</p>}
          {chapter && (
            <div className="cw-metaline">
              <span>{chapter.read} read</span>
              <span className="cw-diamond" aria-hidden="true" />
              <span>Video {chapter.duration}</span>
              <span className="cw-diamond" aria-hidden="true" />
              <span>{TEMPLATE_LABEL[chapter.template]} template</span>
            </div>
          )}
        </header>

        <article>
          <DocItemContent>{children}</DocItemContent>
        </article>

        {(prev || next) && (
          <nav className="cw-pager" aria-label="Chapters">
            {prev && (
              <Link to={prev.slug}>
                <div className="cw-pager__d">
                  ← Chapter {String(prev.n).padStart(2, '0')}
                </div>
                <div className="cw-pager__t">{prev.short}</div>
              </Link>
            )}
            {next && (
              <Link to={next.slug} className="cw-pager--next">
                <div className="cw-pager__d">
                  Chapter {String(next.n).padStart(2, '0')} →
                </div>
                <div className="cw-pager__t">{next.short}</div>
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}

function partTitle(part: string): string {
  const found = CHAPTERS.find((c) => c.part === part);
  return found
    ? {
        intro: 'Introduction',
        application: 'The Application class',
        uow: 'The Unit of Work',
        service: 'The Service layer',
        domain: 'The Domain layer',
        selector: 'The Selector layer',
        mocks: 'The Apex Mocks library',
        di: 'Dependency Injection with Force DI',
      }[part] ?? 'Guide'
    : 'Guide';
}
