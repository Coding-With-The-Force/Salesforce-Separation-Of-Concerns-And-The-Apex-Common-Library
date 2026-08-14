import React from 'react';

/**
 * The catalogue entry at the top of a pattern chapter (03, 05, 09, 12).
 *
 * These really are catalogued design patterns, so the structural device
 * encodes something true — they have an intent, participants and a cost.
 *
 *   <PatternCard>
 *     <PCell title="Intent" big>Fix the order. Vary the steps.</PCell>
 *     <PCell title="Participants">
 *       - **fflib_SObjectDomain** — abstract, owns the sequence
 *     </PCell>
 *   </PatternCard>
 */
export default function PatternCard({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <div className="cw-pcard cw-tick">{children}</div>;
}

export function PCell({
  title,
  big,
  children,
}: {
  title: string;
  big?: boolean;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className={`cw-pcell${big ? ' cw-pcell--big' : ''}`}>
      <h4>{title}</h4>
      <div className={big ? 'cw-pcell__big' : undefined}>{children}</div>
    </div>
  );
}
