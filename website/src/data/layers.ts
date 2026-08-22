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
    owns: 'Your triggers now only exist as a hand-off to the Domain layer. Logic now lives in your domains and not in your trigger, making your code easier to test and to reuse.',
    ruleHeading: 'The rule',
    rule: 'If your trigger does anything other than instantiate a domain class, you\'ve done something wrong.',
    chapters: [11],
  },
  controller: {
    label: 'Entry point',
    name: 'Controller',
    owns: 'Controller logic is now separate from your business logic. Your LWCs, batch jobs, queueables and REST endpoints now all delegate business logic to the service layer.',
    ruleHeading: 'The rule',
    rule: 'Controllers call the Service and nothing else.',
    chapters: [7, 8],
  },
  domain: {
    label: 'Layer',
    name: 'Domain',
    owns: 'Represents the behavior of a single SObject. It often houses validations, default values and any other object-specific automations.',
    ruleHeading: 'The rule',
    rule: 'A domain class should only represent the behavior of a single object in your org, not multiple objects. Behavior representative of multiple objects should live in the service layer.',
    chapters: [9, 10, 11],
  },
  service: {
    label: 'Layer',
    name: 'Service',
    owns: 'Business logic that spans more than one object.',
    ruleHeading: 'The test',
    rule: 'If a method needs to know about a second SObject to make its decision, it has outgrown the domain and belongs here.',
    chapters: [7, 8],
  },
  selector: {
    label: 'Layer',
    name: 'Selector',
    owns: 'The layer utilized to query your database. There is often a selector for each object, but depending on the size of your org, it may be broken up by object and application.',
    ruleHeading: 'The rule',
    rule: 'Selector methods should be bulkified (work with sets, maps and lists as opposed to individual records). It gives the methods more potential for reuse within your codebase.',
    chapters: [12, 13, 14],
  },
  uow: {
    label: 'Layer',
    name: 'Unit of Work',
    owns: 'Every DML transaction is collected and registered to be executed, then committed together in dependency order.',
    ruleHeading: 'The rule',
    rule: 'This helps ensure that no partially complete transactions occur (an Account is made, but the 15 contacts for it fail to be inserted). All DML gets committed together and should something fail, savepoints can easily roll the whole thing back.',
    chapters: [5, 6],
  },
};
