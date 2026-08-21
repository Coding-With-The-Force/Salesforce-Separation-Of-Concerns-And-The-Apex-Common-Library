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

/** Every box, as [title, sub-label]. Shared by both layouts. */
const NODE_TEXT: Record<LayerKey, [string, string]> = {
  trigger: ['Trigger', '4 lines, forever'],
  controller: ['Controller', 'LWC · batch · API'],
  domain: ['Domain', 'ch 09–11'],
  service: ['Service', 'ch 07–08'],
  selector: ['Selector', 'ch 12–14'],
  uow: ['Unit of Work', 'ch 05–06'],
};

const ARIA =
  'A Case insert reaches the database only through the Selector and the Unit ' +
  'of Work. The Trigger delegates to the Domain, controllers call the ' +
  'Service, and the Service invokes domain rules, queries through the ' +
  'Selector and registers changes with the Unit of Work.';

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
 *
 * Two layouts, not one. A single wide drawing scaled down to a phone renders
 * its labels at about 4px, and no amount of repositioning fixes that — so
 * there is a 760-unit landscape version and a 460-unit stacked version, and
 * a CONTAINER query picks between them. Container, not viewport: this figure
 * sits in the article column on a chapter page and in a much narrower
 * blueprint panel on the homepage, so the viewport says nothing useful about
 * how much room it actually has.
 *
 * Every label is sized against the box or the gap it sits in, assuming the
 * widest plausible monospace advance. Labels are one or two words for the
 * same reason — the nuance belongs in the caption, not in the drawing.
 */
export default function LayerDiagram({
  highlight = 'domain',
  onPick,
  interactive = false,
}: Props): JSX.Element {
  const lit = EDGES[highlight] ?? [];

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

  /**
   * A layer box. Baselines are derived from the height, so the two layouts
   * can use different box sizes and still centre their text identically.
   */
  const Node = ({
    k,
    x,
    y,
    w,
    h,
  }: {
    k: LayerKey;
    x: number;
    y: number;
    w: number;
    h: number;
  }) => {
    const [title, sub] = NODE_TEXT[k];
    const on = highlight === k;
    return (
      <g {...nodeProps(k)} aria-label={title}>
        <rect
          className={`cw-dbox${on ? ' cw-dbox--hot' : ''}`}
          x={x}
          y={y}
          width={w}
          height={h}
        />
        <text
          className={`cw-dlab${on ? ' cw-dlab--on' : ''}`}
          x={x + w / 2}
          y={y + Math.round(h * 0.44)}
          textAnchor="middle">
          {title}
        </text>
        <text
          className="cw-dsub"
          x={x + w / 2}
          y={y + h - 12}
          textAnchor="middle">
          {sub}
        </text>
      </g>
    );
  };

  const Db = ({x, y, w, h}: {x: number; y: number; w: number; h: number}) => (
    <g aria-hidden="true">
      <rect className="cw-dbox cw-dbox--db" x={x} y={y} width={w} height={h} />
      <text
        className="cw-dlab cw-dlab--wm"
        x={x + w / 2}
        y={y + Math.round(h * 0.44)}
        textAnchor="middle">
        Database
      </text>
      <text className="cw-dsub" x={x + w / 2} y={y + h - 12} textAnchor="middle">
        objects and records
      </text>
    </g>
  );

  /**
   * An arrow and its label. `anchor` lets a label hug a vertical run.
   *
   * `uid` scopes the marker reference to one of the two SVGs. Both are in
   * the document at once and marker ids are document-global, so without it
   * the stacked drawing would silently point at the landscape one's defs.
   */
  const Edge = ({
    id,
    uid,
    x1,
    y1,
    x2,
    y2,
    label,
    lx,
    ly,
    anchor = 'middle',
  }: {
    id: string;
    uid: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    label: string;
    lx: number;
    ly: number;
    anchor?: 'middle' | 'start';
  }) => {
    const hot = lit.includes(id);
    return (
      <g>
        <line
          className={`cw-dedge${hot ? ' cw-dedge--hot' : ''}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          markerEnd={`url(#${uid}-${hot ? 'hot' : 'arrow'})`}
        />
        <text
          className={`cw-dtxt${hot ? ' cw-dtxt--on' : ''}`}
          x={lx}
          y={ly}
          textAnchor={anchor}>
          {label}
        </text>
      </g>
    );
  };

  const Defs = ({uid}: {uid: string}) => (
    <defs>
      <marker
        id={`${uid}-arrow`}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse">
        <polygon points="0,0 10,5 0,10" className="cw-dhead" />
      </marker>
      <marker
        id={`${uid}-hot`}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse">
        <polygon points="0,0 10,5 0,10" className="cw-dhead cw-dhead--hot" />
      </marker>
    </defs>
  );

  return (
    <div className="cw-diagram">
      {/* ── landscape: four columns, left to right ─────────────── */}
      <svg
        className="cw-diagram__wide"
        viewBox="0 0 760 312"
        role="img"
        aria-label={ARIA}>
        <Defs uid="cwdw" />

        <Edge uid="cwdw" id="trigger-domain" x1={140} y1={44} x2={216} y2={44}
              label="delegates" lx={178} ly={36} />
        <Edge uid="cwdw" id="ctrl-service" x1={140} y1={204} x2={216} y2={204}
              label="calls" lx={178} ly={196} />
        <Edge uid="cwdw" id="service-domain" x1={284} y1={176} x2={284} y2={72}
              label="invokes" lx={292} ly={128} anchor="start" />
        <Edge uid="cwdw" id="service-selector" x1={350} y1={192} x2={428} y2={148}
              label="queries" lx={390} ly={156} />
        <Edge uid="cwdw" id="service-uow" x1={350} y1={216} x2={428} y2={254}
              label="registers" lx={390} ly={252} />
        <Edge uid="cwdw" id="selector-db" x1={562} y1={130} x2={614} y2={166}
              label="SOQL" lx={588} ly={128} />
        <Edge uid="cwdw" id="uow-db" x1={562} y1={270} x2={614} y2={204}
              label="commit" lx={588} ly={268} />

        <Node k="trigger" x={8} y={18} w={132} h={52} />
        <Node k="controller" x={8} y={178} w={132} h={52} />
        <Node k="domain" x={218} y={18} w={132} h={52} />
        <Node k="service" x={218} y={178} w={132} h={52} />
        <Node k="selector" x={430} y={100} w={132} h={52} />
        <Node k="uow" x={430} y={248} w={132} h={52} />
        <Db x={616} y={148} w={136} h={52} />
      </svg>

      {/* ── stacked: the same graph, two columns, top to bottom ── */}
      <svg
        className="cw-diagram__stack"
        viewBox="0 0 460 440"
        role="img"
        aria-label={ARIA}>
        <Defs uid="cwds" />

        <Edge uid="cwds" id="trigger-domain" x1={103} y1={68} x2={103} y2={106}
              label="delegates" lx={111} ly={93} anchor="start" />
        <Edge uid="cwds" id="ctrl-service" x1={357} y1={68} x2={357} y2={106}
              label="calls" lx={365} ly={93} anchor="start" />
        <Edge uid="cwds" id="service-domain" x1={260} y1={136} x2={200} y2={136}
              label="invokes" lx={230} ly={127} />
        <Edge uid="cwds" id="service-selector" x1={357} y1={166} x2={107} y2={248}
              label="queries" lx={230} ly={196} />
        <Edge uid="cwds" id="service-uow" x1={357} y1={166} x2={357} y2={248}
              label="registers" lx={365} ly={212} anchor="start" />
        <Edge uid="cwds" id="selector-db" x1={103} y1={308} x2={178} y2={370}
              label="SOQL" lx={120} ly={348} />
        <Edge uid="cwds" id="uow-db" x1={357} y1={308} x2={282} y2={370}
              label="commit" lx={340} ly={348} />

        <Node k="trigger" x={8} y={10} w={190} h={56} />
        <Node k="controller" x={262} y={10} w={190} h={56} />
        <Node k="domain" x={8} y={108} w={190} h={56} />
        <Node k="service" x={262} y={108} w={190} h={56} />
        <Node k="selector" x={8} y={250} w={190} h={56} />
        <Node k="uow" x={262} y={250} w={190} h={56} />
        <Db x={135} y={372} w={190} h={56} />
      </svg>
    </div>
  );
}
