import React from 'react';

export type LayerKey =
  | 'trigger'
  | 'controller'
  | 'domain'
  | 'service'
  | 'selector'
  | 'uow';

/** Which edges light up when a given layer is the subject. */
const EDGES: Record<LayerKey, string[]> = {
  trigger: ['trigger-domain'],
  controller: ['ctrl-service'],
  domain: ['trigger-domain', 'service-domain'],
  service: ['ctrl-service', 'service-domain', 'service-selector', 'service-uow'],
  selector: ['service-selector', 'selector-db'],
  uow: ['service-uow', 'uow-db'],
};

interface Props {
  /** The layer being discussed. Its box and its edges are emphasised. */
  highlight?: LayerKey;
  /** Called when a box is clicked — used by the homepage blueprint. */
  onPick?: (key: LayerKey) => void;
  interactive?: boolean;
}

/**
 * The architecture, as one figure.
 *
 * The claim it makes: only the Selector and the Unit of Work reach the
 * database. The Domain never does, which is exactly why a domain class can
 * be unit tested without a line of DML.
 */
export default function LayerDiagram({
  highlight = 'domain',
  onPick,
  interactive = false,
}: Props): JSX.Element {
  const lit = EDGES[highlight] ?? [];
  const edge = (id: string) =>
    `cw-dedge${lit.includes(id) ? ' cw-dedge--hot' : ''}`;
  const elab = (id: string) => `cw-dtxt${lit.includes(id) ? ' cw-dtxt--on' : ''}`;

  const box = (key: LayerKey) =>
    `cw-dbox${highlight === key ? ' cw-dbox--hot' : ''}`;
  const lab = (key: LayerKey) =>
    `cw-dlab${highlight === key ? ' cw-dlab--on' : ''}`;

  const nodeProps = (key: LayerKey) =>
    interactive
      ? {
          role: 'button' as const,
          tabIndex: 0,
          style: {cursor: 'pointer'},
          onClick: () => onPick?.(key),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPick?.(key);
            }
          },
        }
      : {};

  return (
    <svg
      viewBox="0 0 860 350"
      role="img"
      aria-label="A Case insert reaches the database only through the Selector and the Unit of Work. The Trigger delegates to the Domain, controllers call the Service, and the Service invokes domain rules, asks the Selector for records and registers changes with the Unit of Work.">
      <defs>
        <marker
          id="cw-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse">
          <polygon points="0,0 10,5 0,10" fill="currentColor" />
        </marker>
      </defs>

      <line className={edge('trigger-domain')} x1="146" y1="44" x2="218" y2="44" markerEnd="url(#cw-arrow)" />
      <text className={elab('trigger-domain')} x="182" y="36" textAnchor="middle">delegates</text>

      <line className={edge('ctrl-service')} x1="146" y1="194" x2="218" y2="194" markerEnd="url(#cw-arrow)" />
      <text className={elab('ctrl-service')} x="182" y="186" textAnchor="middle">calls</text>

      <line className={edge('service-domain')} x1="292" y1="170" x2="292" y2="76" markerEnd="url(#cw-arrow)" />
      <text className={elab('service-domain')} x="302" y="127">invokes rules</text>

      <line className={edge('service-selector')} x1="358" y1="182" x2="432" y2="126" markerEnd="url(#cw-arrow)" />
      <text className={elab('service-selector')} x="398" y="140" textAnchor="middle">asks for records</text>

      <line className={edge('service-uow')} x1="358" y1="206" x2="432" y2="262" markerEnd="url(#cw-arrow)" />
      <text className={elab('service-uow')} x="398" y="250" textAnchor="middle">registers changes</text>

      <line className={edge('selector-db')} x1="572" y1="120" x2="652" y2="180" markerEnd="url(#cw-arrow)" />
      <text className={elab('selector-db')} x="616" y="136" textAnchor="middle">SOQL</text>

      <line className={edge('uow-db')} x1="572" y1="272" x2="652" y2="212" markerEnd="url(#cw-arrow)" />
      <text className={elab('uow-db')} x="616" y="262" textAnchor="middle">one atomic commit</text>

      <g {...nodeProps('trigger')} aria-label="Trigger">
        <rect className={box('trigger')} x="14" y="20" width="132" height="48" />
        <text className={lab('trigger')} x="80" y="43" textAnchor="middle">Trigger</text>
        <text className="cw-dtxt" x="80" y="58" textAnchor="middle">4 lines, forever</text>
      </g>

      <g {...nodeProps('controller')} aria-label="Controller">
        <rect className={box('controller')} x="14" y="170" width="132" height="48" />
        <text className={lab('controller')} x="80" y="193" textAnchor="middle">Controller</text>
        <text className="cw-dtxt" x="80" y="208" textAnchor="middle">batch · LWC · queueable</text>
      </g>

      <g {...nodeProps('domain')} aria-label="Domain">
        <rect className={box('domain')} x="226" y="20" width="132" height="48" />
        <text className={lab('domain')} x="292" y="43" textAnchor="middle">Domain</text>
        <text className="cw-dtxt" x="292" y="58" textAnchor="middle">ch 09–11</text>
      </g>

      <g {...nodeProps('service')} aria-label="Service">
        <rect className={box('service')} x="226" y="170" width="132" height="48" />
        <text className={lab('service')} x="292" y="193" textAnchor="middle">Service</text>
        <text className="cw-dtxt" x="292" y="208" textAnchor="middle">ch 07–08</text>
      </g>

      <g {...nodeProps('selector')} aria-label="Selector">
        <rect className={box('selector')} x="440" y="92" width="132" height="48" />
        <text className={lab('selector')} x="506" y="115" textAnchor="middle">Selector</text>
        <text className="cw-dtxt" x="506" y="130" textAnchor="middle">ch 12–14</text>
      </g>

      <g {...nodeProps('uow')} aria-label="Unit of Work">
        <rect className={box('uow')} x="440" y="252" width="132" height="48" />
        <text className={lab('uow')} x="506" y="275" textAnchor="middle">Unit of Work</text>
        <text className="cw-dtxt" x="506" y="290" textAnchor="middle">ch 05–06</text>
      </g>

      <g aria-hidden="true">
        <rect className="cw-dbox cw-dbox--db" x="660" y="170" width="140" height="48" />
        <text className="cw-dlab cw-dlab--wm" x="730" y="193" textAnchor="middle">Database</text>
        <text className="cw-dtxt" x="730" y="208" textAnchor="middle">the only side effect</text>
      </g>
    </svg>
  );
}
