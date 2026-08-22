import type {PrismTheme} from 'prism-react-renderer';

/**
 * The CWTF syntax palette, lifted from assets/css/cwtf-theme.css.
 *
 * Material-Ocean-ish, recoloured so types use the brand teal and annotations
 * use the brand amber. Used as BOTH the light and dark Prism theme, because
 * code panels stay dark in both site themes - inverting this would mean
 * inventing a second syntax theme that isn't in the brand.
 */
export const cwtfPrismDark: PrismTheme = {
  plain: {
    color: '#d8dedc',
    backgroundColor: '#080b0b',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {color: '#8a9b97', fontStyle: 'italic'},
    },
    {types: ['punctuation'], style: {color: 'rgba(216,222,220,0.66)'}},
    {
      types: ['keyword', 'operator', 'boolean', 'null'],
      style: {color: '#c792ea'},
    },
    {types: ['string', 'char', 'attr-value', 'regex'], style: {color: '#ecc48d'}},
    {types: ['number', 'constant'], style: {color: '#f78c6c'}},
    {
      types: ['class-name', 'builtin', 'namespace', 'tag', 'symbol'],
      style: {color: '#81ccc2'},
    },
    {types: ['annotation', 'atrule', 'important'], style: {color: '#e2b04a'}},
    {types: ['function', 'method'], style: {color: '#d8dedc'}},
    {types: ['variable', 'property', 'attr-name'], style: {color: '#d8dedc'}},
    {types: ['deleted'], style: {color: '#ffb4a8'}},
    {types: ['inserted'], style: {color: '#81ccc2'}},
  ],
};
