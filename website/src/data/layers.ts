import type {LayerKey} from '@site/src/components/LayerDiagram';

export interface LayerInfo {
  label: string;
  name: string;
  /** What this layer is responsible for. */
  owns: string;
  ruleHeading: string;
  /** The one thing to remember. */
  rule: string;
  /** Chapter numbers, in reading order. */
  chapters: number[];
}

export const LAYERS: Record<LayerKey, LayerInfo> = {
  trigger: {
    label: 'Entry point',
    name: 'Trigger',
    owns: 'Nothing. It exists only to hand off. Four lines, and it never grows again no matter how many requirements land on the object.',
    ruleHeading: 'The rule',
    rule: 'If your trigger has an if statement in it, the logic is in the wrong file.',
    chapters: [11],
  },
  controller: {
    label: 'Entry point',
    name: 'Controller',
    owns: 'Whatever invoked you — an LWC, a batch job, a queueable, a REST endpoint. It knows about the request. Nothing below it does.',
    ruleHeading: 'The rule',
    rule: 'Controllers call the Service and nothing else. Never the domain, never a selector, never raw SOQL.',
    chapters: [7, 8],
  },
  domain: {
    label: 'Layer',
    name: 'Domain',
    owns: 'Behaviour that is true about one SObject no matter who is asking — validation, defaulting, and calculations. Named for the plural of the object, so it is bulkified by construction.',
    ruleHeading: 'The rule',
    rule: 'The Domain never touches the database. That is exactly why a domain class can be unit tested without a single line of DML or SOQL.',
    chapters: [9, 10, 11],
  },
  service: {
    label: 'Layer',
    name: 'Service',
    owns: 'Business logic that spans more than one object. Stateless, bulkified, and the only layer a controller is allowed to call.',
    ruleHeading: 'The test',
    rule: 'If a method needs to know about a second SObject to make its decision, it has outgrown the domain and belongs here.',
    chapters: [7, 8],
  },
  selector: {
    label: 'Layer',
    name: 'Selector',
    owns: 'Every line of SOQL you own, in one testable, reusable place. Field sets and the query factory live here too.',
    ruleHeading: 'The rule',
    rule: 'One bulk query, called once with a set of ids. A selector called inside a loop is the same bug you started with.',
    chapters: [12, 13, 14],
  },
  uow: {
    label: 'Layer',
    name: 'Unit of Work',
    owns: 'Every insert and update registered rather than executed, then committed together in dependency order with the relationships resolved.',
    ruleHeading: 'The rule',
    rule: 'Nothing reaches the database until commitWork(). All of it lands, or the savepoint rolls the whole thing back.',
    chapters: [5, 6],
  },
};
