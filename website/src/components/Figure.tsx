import React from 'react';

/**
 * Wraps a diagram with the caption that states what it shows.
 * One figure, one claim.
 */
export default function Figure({
  caption,
  children,
}: {
  caption?: React.ReactNode;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <figure className="cw-figure">
      {children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
