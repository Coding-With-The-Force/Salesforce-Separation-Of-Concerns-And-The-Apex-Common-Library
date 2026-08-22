import React from 'react';
import BackToTopButton from '@theme/BackToTopButton';
import ChapterRuler from '@site/src/components/ChapterRuler';
import type {Props} from '@theme/DocRoot/Layout';

/**
 * The doc shell.
 *
 * Docusaurus's sidebar is gone - the ruler replaced it, which is the whole
 * point of the merge. Everything below is our own two-column layout, so the
 * default Main/Sidebar wrappers are not used either.
 */
export default function DocRootLayout({children}: Props): JSX.Element {
  return (
    <>
      <BackToTopButton />
      <ChapterRuler />
      <main className="cw-docroot">{children}</main>
    </>
  );
}
