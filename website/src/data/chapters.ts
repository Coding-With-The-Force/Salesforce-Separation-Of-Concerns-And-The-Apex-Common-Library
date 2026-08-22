/**
 * The single source of truth for chapter metadata.
 *
 * Drives the ruler, the homepage index, prev/next, the video hub and the
 * redirect table. If a chapter moves, it moves here and nowhere else.
 */

export type TemplateKey = 'standard' | 'pattern' | 'implementation' | 'annotated';
export type PartKey = 'intro' | 'application' | 'uow' | 'service' | 'domain' | 'selector' | 'mocks' | 'di';

export interface Chapter {
  n: number;
  /** Full title, as it appears as the page h1. */
  title: string;
  /** Short form for the ruler tooltip and prev/next. */
  short: string;
  /** New canonical path. */
  slug: string;
  /** The MkDocs URL this replaces - used to generate the redirect. */
  legacy: string;
  /** Source file in docs/. */
  file: string;
  blurb: string;
  /** YouTube id. */
  video: string;
  duration: string;
  read: string;
  template: TemplateKey;
  part: PartKey;
}

export interface Part {
  key: PartKey;
  title: string;
  /** Which architectural layer this part is about, for the blueprint. */
  layer?: string;
}

export const PARTS: Part[] = [
  {key: 'intro', title: 'Introduction'},
  {key: 'application', title: 'The Application class', layer: 'application'},
  {key: 'uow', title: 'The Unit of Work', layer: 'uow'},
  {key: 'service', title: 'The Service layer', layer: 'service'},
  {key: 'domain', title: 'The Domain layer', layer: 'domain'},
  {key: 'selector', title: 'The Selector layer', layer: 'selector'},
  {key: 'mocks', title: 'The Apex Mocks library'},
  {key: 'di', title: 'Dependency Injection with Force DI'},
];

export const TEMPLATE_LABEL: Record<TemplateKey, string> = {
  standard: 'Standard',
  pattern: 'Pattern',
  implementation: 'Implementation',
  annotated: 'Annotated',
};

export const CHAPTERS: Chapter[] = [
  {
    n: 1,
    title: 'Introduction to the Separation of Concerns Design Principle',
    short: 'The Separation of Concerns Principle',
    slug: '/separation-of-concerns/',
    legacy: '/01-Introduction-to-the-Separation-of-Concerns-Design-Principle',
    file: '01-Introduction-to-the-Separation-of-Concerns-Design-Principle.md',
    blurb:
      'An explanation of the Separation of Concerns Design Principle and why it is valuable to implement in any codebase.',
    video: 'nU4TKRFzdx4',
    duration: '18:42',
    read: '6 min',
    template: 'standard',
    part: 'intro',
  },
  {
    n: 2,
    title: 'Introduction to the Apex Common Library',
    short: 'The Apex Common Library',
    slug: '/apex-common-library/',
    legacy: '/02-Introduction-to-the-Apex-Common-Library',
    file: '02-Introduction-to-the-Apex-Common-Library.md',
    blurb: "An overview of the tools available with the Apex Common Library.",
    video: '3JmWECi77zU',
    duration: '15:20',
    read: '5 min',
    template: 'standard',
    part: 'intro',
  },
  {
    n: 3,
    title: 'The Factory Method Pattern',
    short: 'The Factory Method Pattern',
    slug: '/application/factory-method-pattern/',
    legacy: '/03-The-Factory-Method-Pattern',
    file: '03-The-Factory-Method-Pattern.md',
    blurb: 'Creating an object without naming the concrete class you get back.',
    video: 'TAegJdt_z7c',
    duration: '19:55',
    read: '6 min',
    template: 'pattern',
    part: 'application',
  },
  {
    n: 4,
    title: 'The fflib_Application Class',
    short: 'The fflib_Application Class',
    slug: '/application/fflib-application/',
    legacy: '/04-The-fflib_Application-Class',
    file: '04-The-fflib_Application-Class.md',
    blurb:
      'The abstract factory class that the other layers rely on.',
    video: 'pUvDyNXNFNs',
    duration: '32:15',
    read: '22 min',
    template: 'annotated',
    part: 'application',
  },
  {
    n: 5,
    title: 'The Unit of Work Pattern',
    short: 'The Unit of Work Pattern',
    slug: '/unit-of-work/pattern/',
    legacy: '/05-The-Unit-of-Work-Pattern',
    file: '05-The-Unit-of-Work-Pattern.md',
    blurb: 'Batching DML into one atomic, correctly ordered transaction.',
    video: 'ugr7OCZ3ZOM',
    duration: '16:08',
    read: '4 min',
    template: 'pattern',
    part: 'uow',
  },
  {
    n: 6,
    title: 'The fflib_SObjectUnitOfWork Class',
    short: 'fflib_SObjectUnitOfWork',
    slug: '/unit-of-work/fflib-sobjectunitofwork/',
    legacy: '/06-The-fflib_SObjectUnitOfWork-Class',
    file: '06-The-fflib_SObjectUnitOfWork-Class.md',
    blurb: 'How to utilize the Unit of Work with Apex Common Library.',
    video: 'T14iEOcy_Kg',
    duration: '28:47',
    read: '9 min',
    template: 'standard',
    part: 'uow',
  },
  {
    n: 7,
    title: 'The Service Layer',
    short: 'The Service Layer',
    slug: '/service-layer/',
    legacy: '/07-The-Service-Layer',
    file: '07-The-Service-Layer.md',
    blurb: "The layer where your business logic lives.",
    video: '5tM_MHV1ypY',
    duration: '24:08',
    read: '10 min',
    template: 'standard',
    part: 'service',
  },
  {
    n: 8,
    title: 'Implementing the Service Layer with the Apex Common Library',
    short: 'Implementing the Service Layer',
    slug: '/service-layer/implementing/',
    legacy: '/08-Implementing-the-Service-Layer-with-the-Apex-Common-Library',
    file: '08-Implementing-the-Service-Layer-with-the-Apex-Common-Library.md',
    blurb:
      'How to setup your service classes with the Apex Common Library in mind.',
    video: 'nj9O-qWEeXg',
    duration: '35:22',
    read: '14 min',
    template: 'implementation',
    part: 'service',
  },
  {
    n: 9,
    title: 'The Template Method Pattern',
    short: 'The Template Method Pattern',
    slug: '/domain-layer/template-method-pattern/',
    legacy: '/09-The-Template-Method-Pattern',
    file: '09-The-Template-Method-Pattern.md',
    blurb: 'Define the skeleton up top and let the subclass fill in the steps.',
    video: 'czTH_cGNNvI',
    duration: '14:36',
    read: '4 min',
    template: 'pattern',
    part: 'domain',
  },
  {
    n: 10,
    title: 'The Domain Layer',
    short: 'The Domain Layer',
    slug: '/domain-layer/',
    legacy: '/10-The-Domain-Layer',
    file: '10-The-Domain-Layer.md',
    blurb: 'A representation of an object/database table that incorporates both its behavior and data.',
    video: 'ZUDwBW2PftA',
    duration: '21:04',
    read: '8 min',
    template: 'standard',
    part: 'domain',
  },
  {
    n: 11,
    title: 'Implementing The Domain Layer with the Apex Common Library',
    short: 'Implementing the Domain Layer',
    slug: '/domain-layer/implementing/',
    legacy: '/11-Implementing-The-Domain-Layer-with-the-Apex-Common-Library',
    file: '11-Implementing-The-Domain-Layer-with-the-Apex-Common-Library.md',
    blurb: 'How to implement the Domain Layer with the assistance of the Apex Common Library.',
    video: '9kbUvY1uMIE',
    duration: '38:50',
    read: '13 min',
    template: 'implementation',
    part: 'domain',
  },
  {
    n: 12,
    title: 'The Builder Pattern',
    short: 'The Builder Pattern',
    slug: '/selector-layer/builder-pattern/',
    legacy: '/12-The-Builder-Pattern',
    file: '12-The-Builder-Pattern.md',
    blurb: 'A creational design pattern that allows for the step-by-step construction of complex objects.',
    video: 'frke3NN0F90',
    duration: '17:29',
    read: '9 min',
    template: 'pattern',
    part: 'selector',
  },
  {
    n: 13,
    title: 'The Selector Layer',
    short: 'The Selector Layer',
    slug: '/selector-layer/',
    legacy: '/13-The-Selector-Layer',
    file: '13-The-Selector-Layer.md',
    blurb: 'Your org\'s SOQL queries live here.',
    video: 'cPU6D-TpLvs',
    duration: '27:31',
    read: '7 min',
    template: 'standard',
    part: 'selector',
  },
  {
    n: 14,
    title: 'Implementing the Selector Layer with the Apex Common Library',
    short: 'Implementing the Selector Layer',
    slug: '/selector-layer/implementing/',
    legacy: '/14-Implementing-the-Selector-Layer-with-the-Apex-Common-Library',
    file: '14-Implementing-the-Selector-Layer-with-the-Apex-Common-Library.md',
    blurb: 'How to implement the Selector Layer using the Apex Common Library.',
    video: '-ZZbRA2-Gew',
    duration: '36:14',
    read: '16 min',
    template: 'implementation',
    part: 'selector',
  },
  {
    n: 15,
    title: 'The Difference Between Unit Tests and Integration Tests',
    short: 'Unit vs Integration Tests',
    slug: '/apex-mocks/unit-vs-integration-tests/',
    legacy: '/15-The-Difference-Between-Unit-Tests-and-Integration-Tests',
    file: '15-The-Difference-Between-Unit-Tests-and-Integration-Tests.md',
    blurb:
      'Mocks are fast and isolated. Integration tests are slow and real. You need both.',
    video: 'SSJ1E31F6ek',
    duration: '13:52',
    read: '4 min',
    template: 'standard',
    part: 'mocks',
  },
  {
    n: 16,
    title: 'Unit Test Mocks with Separation of Concerns',
    short: 'Unit Test Mocks with SoC',
    slug: '/apex-mocks/mocks-with-separation-of-concerns/',
    legacy: '/16-Unit-Test-Mocks-with-Separation-of-Concerns',
    file: '16-Unit-Test-Mocks-with-Separation-of-Concerns.md',
    blurb: 'Why SoC is the thing that makes true unit testing possible.',
    video: 'TzRohBbp8dw',
    duration: '26:40',
    read: '11 min',
    template: 'standard',
    part: 'mocks',
  },
  {
    n: 17,
    title: 'Implementing Mock Unit Tests with the Apex Mocks Library',
    short: 'Implementing Mock Unit Tests',
    slug: '/apex-mocks/implementing/',
    legacy: '/17-Implementing-Mock-Unit-Tests-with-the-Apex-Mocks-Library',
    file: '17-Implementing-Mock-Unit-Tests-with-the-Apex-Mocks-Library.md',
    blurb:
      'How to implement unit tests using the Apex Mocks Library',
    video: 'PLSrLc6jjwQ',
    duration: '41:19',
    read: '33 min',
    template: 'implementation',
    part: 'mocks',
  },
  {
    n: 18,
    title: 'Dependency Injection and Inversion of Control',
    short: 'Dependency Injection & IoC',
    slug: '/force-di/pattern/',
    legacy: '/18-Dependency-Injection-and-Inversion-of-Control',
    file: '18-Dependency-Injection-and-Inversion-of-Control.md',
    blurb: 'Ask for the interface, let configuration decide the class.',
    video: 'oce2QO-E_3k',
    duration: '21:07',
    read: '8 min',
    template: 'pattern',
    part: 'di',
  },
  {
    n: 19,
    title: 'Implementing Force DI Bindings, Modules and Providers',
    short: 'Implementing Force DI',
    slug: '/force-di/implementing/',
    legacy: '/19-Implementing-Force-DI-Bindings-Modules-and-Providers',
    file: '19-Implementing-Force-DI-Bindings-Modules-and-Providers.md',
    blurb:
      'Wiring up di_Binding__mdt records, modules and providers to resolve dependencies at runtime.',
    video: 'YzaI5Ddfwkg',
    duration: '64:42',
    read: '15 min',
    template: 'implementation',
    part: 'di',
  },
  {
    n: 20,
    title: 'TDD and Mocking with Force DI',
    short: 'TDD & Mocking with Force DI',
    slug: '/force-di/testing/',
    legacy: '/20-TDD-and-Mocking-with-Force-DI',
    file: '20-TDD-and-Mocking-with-Force-DI.md',
    blurb:
      'True unit tests with Test.createStub and runtime binding overrides.',
    video: '-esf8Q_Vp7U',
    duration: '31:36',
    read: '11 min',
    template: 'implementation',
    part: 'di',
  },
];

/** Chapter by number. */
export const chapterByNumber = (n: number): Chapter | undefined =>
  CHAPTERS.find((c) => c.n === n);

/** Chapter whose slug matches a pathname, tolerating a missing trailing slash. */
export function chapterBySlug(pathname: string): Chapter | undefined {
  const norm = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return CHAPTERS.find((c) => c.slug === norm);
}

/** Chapters grouped into their parts, in reading order. */
export function chaptersByPart(): {part: Part; chapters: Chapter[]}[] {
  return PARTS.map((part) => ({
    part,
    chapters: CHAPTERS.filter((c) => c.part === part.key),
  })).filter((g) => g.chapters.length > 0);
}

/** Total runtime of every companion video, as "9h 12m". */
export function totalVideoTime(): string {
  const mins = CHAPTERS.reduce((sum, c) => {
    const [m, s] = c.duration.split(':').map(Number);
    return sum + m + s / 60;
  }, 0);
  return `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m`;
}
