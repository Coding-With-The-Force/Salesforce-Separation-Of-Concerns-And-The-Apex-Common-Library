import React, {useMemo, useState} from 'react';

/**
 * The comparison that justifies the library.
 *
 * Authored in MDX with real fenced code blocks, so nothing about writing a
 * chapter stops being Markdown:
 *
 *   <BeforeAfter label="Summarise contacts, then flag rating changes">
 *     <Without lines="418" files="1" testable="0%">
 *       <CodeFile name="AccountTrigger.trigger" lines="418">
 *         ```apex … ```
 *       </CodeFile>
 *       <Takeaway bad title="SOQL in a loop">Fails at 200 records.</Takeaway>
 *     </Without>
 *     <With lines="78" files="4" testable="100%"> … </With>
 *   </BeforeAfter>
 */

type Role = 'file' | 'takeaway' | 'side';
type Tagged = React.JSXElementConstructor<any> & {cwRole?: Role; cwSide?: string};

function partition(children: React.ReactNode) {
  const files: React.ReactElement[] = [];
  const takeaways: React.ReactElement[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const role = (child.type as Tagged)?.cwRole;
    if (role === 'file') files.push(child);
    else if (role === 'takeaway') takeaways.push(child);
  });
  return {files, takeaways};
}

function findSide(children: React.ReactNode, side: string) {
  let found: React.ReactElement | null = null;
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const t = child.type as Tagged;
    if (t?.cwRole === 'side' && t?.cwSide === side) found = child;
  });
  return found;
}

/* ── the pieces an author writes ──────────────────────────────── */

export function CodeFile({children}: {name: string; lines?: string; children: React.ReactNode}) {
  return <>{children}</>;
}
(CodeFile as Tagged).cwRole = 'file';

export function Takeaway({
  title,
  children,
  bad,
}: {
  title: string;
  bad?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <b className={bad ? 'cw-mark' : 'cw-good'}>{title}</b>
      {children}
    </div>
  );
}
(Takeaway as Tagged).cwRole = 'takeaway';

export function Without({children}: SideProps) {
  return <>{children}</>;
}
(Without as Tagged).cwRole = 'side';
(Without as Tagged).cwSide = 'before';

export function With({children}: SideProps) {
  return <>{children}</>;
}
(With as Tagged).cwRole = 'side';
(With as Tagged).cwSide = 'after';

interface SideProps {
  /** Lines of code this version costs. */
  lines: string;
  /** How many files it spans. */
  files: string;
  /** Share of it that can be unit tested without DML. */
  testable: string;
  children: React.ReactNode;
}

/* ── the component itself ─────────────────────────────────────── */

export default function BeforeAfter({
  label,
  withoutLabel = 'Without the library',
  withLabel = 'With the library',
  children,
}: {
  label: string;
  withoutLabel?: string;
  withLabel?: string;
  children: React.ReactNode;
}): JSX.Element {
  const [side, setSide] = useState<'before' | 'after'>('before');
  const [tab, setTab] = useState(0);

  const before = findSide(children, 'before');
  const after = findSide(children, 'after');
  const active = side === 'before' ? before : after;

  const {files, takeaways} = useMemo(
    () => partition(active?.props?.children),
    [active],
  );

  if (!before || !after) {
    return (
      <div className="cw-cmp">
        <div className="cw-cmp__head">
          <span className="cw-cmp__lbl">
            BeforeAfter needs both a &lt;Without&gt; and a &lt;With&gt; child
          </span>
        </div>
      </div>
    );
  }

  const stats = active!.props as SideProps;
  const good = side === 'after';
  const statClass = `cw-stat__v ${good ? 'cw-stat__v--good' : 'cw-stat__v--bad'}`;
  const shown = files[Math.min(tab, Math.max(files.length - 1, 0))];

  const swap = (next: 'before' | 'after') => {
    setSide(next);
    setTab(0);
  };

  return (
    <div className="cw-cmp">
      <div className="cw-cmp__head">
        <span className="cw-cmp__lbl">{label}</span>

        <div className="cw-tog" role="tablist" aria-label={label}>
          <button
            type="button"
            role="tab"
            aria-selected={side === 'before'}
            onClick={() => swap('before')}>
            {withoutLabel}
          </button>
          <button
            type="button"
            role="tab"
            className="cw-tog--after"
            aria-selected={side === 'after'}
            onClick={() => swap('after')}>
            {withLabel}
          </button>
        </div>

        <div className="cw-stat">
          <div>
            <div className={statClass}>{stats.lines}</div>
            <div className="cw-stat__k">Lines</div>
          </div>
          <div>
            <div className={statClass}>{stats.files}</div>
            <div className="cw-stat__k">Files</div>
          </div>
          <div>
            <div className={statClass}>{stats.testable}</div>
            <div className="cw-stat__k">Unit testable</div>
          </div>
        </div>
      </div>

      <div className="cw-cmp__body">
        <div className="cw-files">
          <div className="cw-files__h">Files touched</div>
          {files.map((f, i) => (
            <button
              type="button"
              key={`${f.props.name}-${i}`}
              className={`cw-file${side === 'before' ? ' cw-file--bad' : ''}`}
              aria-selected={i === tab}
              onClick={() => setTab(i)}>
              <span className="cw-file__d" aria-hidden="true" />
              {f.props.name}
              {f.props.lines && <span className="cw-file__n">{f.props.lines}</span>}
            </button>
          ))}
        </div>

        <div className="cw-cmp__code">{shown}</div>
      </div>

      {takeaways.length > 0 && <div className="cw-annot">{takeaways}</div>}
    </div>
  );
}
