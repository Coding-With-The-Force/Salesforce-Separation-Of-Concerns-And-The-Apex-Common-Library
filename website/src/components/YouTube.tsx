import React, {useState} from 'react';

/**
 * Replaces the raw <iframe width="100%" height="400"> the MkDocs site used.
 *
 * Two things it fixes: the 16:9 wrapper means it stops letterboxing on a
 * phone, and it is a click-to-load facade, so seventeen chapters no longer
 * each carry a YouTube player's worth of script on first paint.
 */
export default function YouTube({
  id,
  title,
  duration,
}: {
  id: string;
  title?: string;
  duration?: string;
}): JSX.Element {
  const [live, setLive] = useState(false);

  return (
    <div className="cw-video">
      {live ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title ?? 'Companion video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="cw-video__poster"
          onClick={() => setLive(true)}
          aria-label={`Play: ${title ?? 'companion video'}`}>
          <span className="cw-video__play" aria-hidden="true" />
          <span className="cw-video__lab">
            {title ? `Watch · ${title}` : 'Watch the walkthrough'}
          </span>
          {duration && <span className="cw-video__dur">{duration}</span>}
        </button>
      )}
    </div>
  );
}
