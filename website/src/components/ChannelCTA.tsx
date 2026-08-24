import React from 'react';

/**
 * Subscribe / Newsletter, as they appear in the codingwiththeforce.com
 * header (inc/chrome.php - .cwtf-head__sub and .cwtf-head__sub--ghost).
 *
 * No new button styles: .cw-pill and .cw-pill--ghost are already a port of
 * those two, in this site's palette. Subscribe is the primary pill, teal on
 * a hairline border; Newsletter is the ghost, muted until you hover it -
 * present, but not competing with Subscribe. Same order as the source, too:
 * the secondary sits left of the primary.
 *
 * ?sub_confirmation=1 is what makes YouTube open the subscribe dialogue
 * rather than just landing on the channel page.
 */
const CHANNEL_URL = 'https://www.youtube.com/@CodingWithTheForce?sub_confirmation=1';
const NEWSLETTER_URL = 'https://codingwiththeforce.com/newsletter/';

export default function ChannelCTA(): JSX.Element {
  return (
    <div className="cw-cta">
      <a
        className="cw-pill cw-pill--ghost"
        href={NEWSLETTER_URL}
        target="_blank"
        rel="noopener noreferrer">
        Newsletter
      </a>
      <a
        className="cw-pill"
        href={CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer">
        Subscribe
      </a>
    </div>
  );
}
