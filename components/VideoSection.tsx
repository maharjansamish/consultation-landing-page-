"use client";

import Image from "next/image";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/Icons";

type VideoSectionProps = {
  embedUrl: string;
  whatsappUrl: string;
};

function autoplayUrl(embedUrl: string) {
  try {
    const url = new URL(embedUrl);
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("controls", "1");
    url.searchParams.set("dnt", "1");
    return url.toString();
  } catch {
    return embedUrl;
  }
}

export function VideoSection({ embedUrl, whatsappUrl }: VideoSectionProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="video-section section-pad" id="video" aria-labelledby="video-heading">
      <div className="shell">
        <div className="section-heading centered-heading video-section-heading">
          <span className="section-kicker">A CLEARER WAY FORWARD</span>
          <h2 id="video-heading">See How We Help Your Business <span>Grow.</span></h2>
          <p>Discover how thoughtful strategy, useful content, and AI-powered digital services can help you make your next marketing move with confidence.</p>
        </div>

        <div className="video-showcase">
          <div className="video-screen" id="samish-intro-video">
            {playing && embedUrl ? (
              <iframe
                src={autoplayUrl(embedUrl)}
                title="Samish Digital Wave — how we help your business grow"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="video-poster">
                <div className="video-poster-glow video-poster-glow-cyan" />
                <div className="video-poster-glow video-poster-glow-purple" />
                <div className="video-poster-grid" aria-hidden="true" />
                <div className="video-poster-brand">
                  <Image src="/images/samish-icon-512.png" alt="" width={138} height={138} sizes="138px" />
                  <span className="video-poster-name">SAMISH DIGITAL WAVE</span>
                  <span className="video-poster-line" aria-hidden="true" />
                  <span className="video-poster-topics">STRATEGY <i /> CONTENT <i /> GROWTH</span>
                </div>
                {embedUrl ? (
                  <button
                    className="video-play-button"
                    type="button"
                    aria-label="Play the Samish Digital Wave introduction video"
                    aria-controls="samish-intro-video"
                    onClick={() => setPlaying(true)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.8c0-.8.9-1.3 1.6-.9l9 5.2a1 1 0 0 1 0 1.8l-9 5.2a1.05 1.05 0 0 1-1.6-.9V5.8Z" /></svg>
                    <span className="sr-only">Play video</span>
                  </button>
                ) : (
                  <span className="video-play-button video-play-button-disabled" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M8 5.8c0-.8.9-1.3 1.6-.9l9 5.2a1 1 0 0 1 0 1.8l-9 5.2a1.05 1.05 0 0 1-1.6-.9V5.8Z" /></svg>
                  </span>
                )}
                <span className="video-poster-caption">A more intentional digital presence starts with a clear plan.</span>
              </div>
            )}
          </div>

          <div className="video-showcase-footer">
            <span className="video-duration"><span aria-hidden="true" /> SAMISH DIGITAL WAVE <i /> INTRODUCTION</span>
            {embedUrl ? <span className="video-player-hint">Select play to watch with Vimeo controls</span> : <span className="video-player-hint">Branded video preview</span>}
          </div>
        </div>

        {!embedUrl && (
          <p className="video-config-note">
            <span aria-hidden="true">✳</span>
            Your video preview is ready. To activate playback, add your Vimeo link as <code>NEXT_PUBLIC_VIMEO_URL</code> in your local environment and Vercel settings.
          </p>
        )}

        {whatsappUrl && (
          <div className="video-contact-cta">
            <span>Want to talk about your business?</span>
            <a className="button button-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /> Chat with us on WhatsApp <span aria-hidden="true">↗</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
