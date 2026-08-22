import React, {useState} from 'react';

/**
 * Replaces the raw <iframe width="100%" height="400"> the MkDocs site used.
 *
 * Three things it fixes: the 16:9 wrapper stops it letterboxing on a phone,
 * it carries the real YouTube thumbnail, and it is a click-to-load facade so
 * twenty chapters no longer each ship a player's worth of script on first
 * paint.
 *
 * maxresdefault only exists for videos uploaded above 720p, so it falls back
 * to hqdefault, which always exists. Both are cropped with object-fit rather
 * than letterboxed.
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
  const [poster, setPoster] = useState(
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  );

  if (live) {
    return (
      <div className="cw-video cw-video--live">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title ?? 'Companion video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="cw-video">
      <button
        type="button"
        className="cw-video__poster"
        onClick={() => setLive(true)}
        aria-label={`Play: ${title ?? 'companion video'}`}>
        <img
          className="cw-video__img"
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={(e) => {
            // A missing maxresdefault is served as a *decodable* 120x90
            // placeholder JPEG on a 404 status, so onError never fires.
            // Real thumbnails are 480px (hqdefault) or wider; anything
            // smaller is the placeholder and means fall back.
            if (
              e.currentTarget.naturalWidth < 320 &&
              !poster.includes('hqdefault')
            ) {
              setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
            }
          }}
          onError={() => {
            if (!poster.includes('hqdefault')) {
              setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
            }
          }}
        />
        <span className="cw-video__scrim" aria-hidden="true" />
        <span className="cw-video__btn" aria-hidden="true">
          <span className="cw-video__play" />
        </span>
        <span className="cw-video__lab">
          {title ? `Watch · ${title}` : 'Watch the walkthrough'}
        </span>
        {duration && <span className="cw-video__dur">{duration}</span>}
      </button>
    </div>
  );
}
