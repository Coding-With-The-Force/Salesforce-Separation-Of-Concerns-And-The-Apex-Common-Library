import MDXComponents from '@theme-original/MDXComponents';

import YouTube from '@site/src/components/YouTube';
import BeforeAfter, {
  Without,
  With,
  CodeFile,
  Takeaway,
} from '@site/src/components/BeforeAfter';
import Steps, {Step, Manifest, MFile, Deploy} from '@site/src/components/Steps';
import PatternCard, {PCell} from '@site/src/components/PatternCard';
import Figure from '@site/src/components/Figure';
import LayerDiagram from '@site/src/components/LayerDiagram';
import AnnotatedSource, {SourceNote} from '@site/src/components/AnnotatedSource';

/**
 * Registered globally so a chapter file never needs an import line.
 * Authors write Markdown, and reach for one of these when the content
 * genuinely calls for it.
 */
export default {
  ...MDXComponents,

  // every chapter
  YouTube,

  // the comparison that justifies the library
  BeforeAfter,
  Without,
  With,
  CodeFile,
  Takeaway,

  // implementation chapters — 08, 11, 14, 17
  Steps,
  Step,
  Manifest,
  MFile,
  Deploy,

  // pattern chapters — 03, 05, 09, 12
  PatternCard,
  PCell,

  // diagrams
  Figure,
  LayerDiagram,

  // the long ones — 04, 17
  AnnotatedSource,
  SourceNote,
};
