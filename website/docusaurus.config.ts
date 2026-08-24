import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {cwtfPrismDark} from './src/theme/prismTheme';
import {CHAPTERS} from './src/data/chapters';

/**
 * apex-enterprise-patterns.dev
 *
 * Content lives in ../docs so the twenty chapter files keep their git
 * history and stay where they have always been. Only the build changes.
 *
 * routeBasePath is '/' so chapter slugs land at the top level
 * (/domain-layer/, /apex-mocks/implementing/). The homepage is a React page
 * at src/pages/index.tsx; no doc claims the '/' slug, so there is no clash.
 */
const config: Config = {
  title: 'Apex Enterprise Patterns',
  tagline: 'The complete guide to the Apex Common Library',
  favicon: 'img/favicon.svg',

  url: 'https://apex-enterprise-patterns.dev',
  baseUrl: '/',
  trailingSlash: true,

  organizationName: 'Coding-With-The-Force',
  projectName: 'Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library',

  // The 29 rewritten cross-links get validated at build time.
  onBrokenLinks: 'throw',
  onDuplicateRoutes: 'throw',

  i18n: {defaultLocale: 'en', locales: ['en']},

  /**
   * Poppins, at the same three weights the WordPress theme enqueues
   * (wp-content/themes/cwtf/functions.php). Without this the font stack
   * names Poppins and then silently falls back to system-ui, which is the
   * single most visible way this site could drift from
   * codingwiththeforce.com.
   */
  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap',
      },
    },
  ],

  markdown: {
    format: 'detect', // .md stays CommonMark, .mdx gets the full pipeline
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: undefined, // matches edit_uri: "" on the MkDocs site
          showLastUpdateTime: false,
          breadcrumbs: false, // the ruler does this job
        },
        blog: false,
        pages: {},
        theme: {
          customCss: [
            './src/css/tokens.css',
            './src/css/base.css',
            './src/css/shell.css',
            './src/css/components.css',
          ],
        },
        sitemap: {changefreq: 'monthly', priority: 0.5},
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Every legacy MkDocs URL, mapped to its new slug. Derived from the
        // chapter table so a slug can only ever be changed in one place.
        redirects: CHAPTERS.map((c) => ({from: c.legacy, to: c.slug})),
      },
    ],
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        // routeBasePath is '/', so built chapter pages land at the build root
        docsDir: '.',
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'dark', // the MkDocs site defaults dark; CWTF is dark-only
      disableSwitch: false,
      /**
       * False on purpose. With this on, Docusaurus makes the toggle a THREE
       * state cycle - system → light → dark → system - and one of those
       * steps is always a visual no-op, because "system" resolves to
       * whichever of light or dark the OS already asked for. On a machine
       * set to light that meant the first click did nothing and the second
       * one finally moved: the reported "have to click it twice".
       *
       * Off, it is a plain two-value toggle, one click per change, and dark
       * is the brand default regardless of the OS setting - which is what
       * CWTF is anyway.
       */
      respectPrefersColorScheme: false,
    },
    docs: {
      sidebar: {hideable: false, autoCollapseCategories: false},
    },
    navbar: {
      title: 'Apex Enterprise Patterns',
      hideOnScroll: false,
      items: [
        {
          type: 'dropdown',
          label: 'Guide',
          position: 'left',
          /**
           * Deliberately no `to`.
           *
           * DropdownNavbarItem/Mobile decides whether tapping the parent
           * navigates by asking whether `to` was set - `const href =
           * props.to ? undefined : '#'` - and its onClick only calls
           * preventDefault for the '#' case. With a `to`, tapping "Guide"
           * on a phone both expanded the list AND navigated to chapter 01,
           * and the navigation closed the drawer before you could pick
           * anything. Without it, the parent is purely a disclosure and
           * chapter 01 is simply the first item in the list.
           *
           * All twenty are built from the chapter table so the menu can
           * never drift from the ruler, the homepage index or the pager.
           * The number prefix is part of the label rather than a separate
           * column because Infima dropdown items are a single link.
           */
          items: CHAPTERS.map((c) => ({
            label: `${String(c.n).padStart(2, '0')} · ${c.short}`,
            to: c.slug,
          })),
        },
        {to: '/videos/', label: 'Videos', position: 'left'},
        {
          // The library's own org, not this repo. The repo is still linked
          // from the footer under "This site".
          href: 'https://github.com/apex-enterprise-patterns',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.youtube.com/@CodingWithTheForce',
          label: 'YouTube',
          position: 'right',
        },
      ],
    },
    footer: {
      // deliberately not style:'dark' - that Infima variant hardcodes
      // #303846, which is not in the CWTF palette. See src/css/base.css.
      links: [
        {
          title: 'The guide',
          items: [
            {label: 'Start at chapter 01', to: '/separation-of-concerns/'},
            {label: 'All twenty chapters', to: '/'},
            {label: 'The videos', to: '/videos/'},
          ],
        },
        {
          title: 'Coding With The Force',
          items: [
            {label: 'YouTube', href: 'https://www.youtube.com/@CodingWithTheForce'},
            {label: 'Newsletter', href: 'https://codingwiththeforce.com/newsletter/'},
            {label: 'codingwiththeforce.com', href: 'https://codingwiththeforce.com'},
          ],
        },
        {
          title: 'This site',
          items: [
            {
              label: 'Source on GitHub',
              href: 'https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library',
            },
            {
              label: 'Report a mistake',
              href: 'https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/issues',
            },
            {
              label: 'Buy me some Taco Bell 🌮',
              href: 'https://checkout.codingwiththeforce.com/b/5kQ28raL44rQ96vfH54ko03',
            },
          ],
        },
      ],
      copyright: `Free, forever. Made with 🦖 by Coding With The Force.`,
    },
    prism: {
      theme: cwtfPrismDark,
      darkTheme: cwtfPrismDark, // code panels stay dark in both themes
      additionalLanguages: ['apex', 'java', 'sql', 'bash', 'json'],
    },
    tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 3},
  } satisfies Preset.ThemeConfig,
};

export default config;
