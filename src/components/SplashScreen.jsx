import { useEffect, useRef, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [leaving, setLeaving] = useState(false);
  const finishedRef = useRef(false);

  const finishSplash = () => {
    if (finishedRef.current) return;

    finishedRef.current = true;
    setLeaving(true);

    window.setTimeout(() => {
      if (typeof onFinish === "function") {
        onFinish();
      }
    }, 900);
  };

  useEffect(() => {
    /*
     * Video-style timing:
     *
     * 0.0s  background begins
     * 0.4s  logo reveals
     * 1.1s  eyebrow appears
     * 1.4s  title appears
     * 1.9s  subtitle appears
     * 2.2s  progress starts
     * 4.4s  screen fades away
     */

    const timer = window.setTimeout(() => {
      finishSplash();
    }, 4400);

    return () => {
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={
        leaving
          ? "cinematic-splash cinematic-splash-leaving"
          : "cinematic-splash"
      }
      role="dialog"
      aria-label="Ceylon Natural Care introduction"
    >
      {/* ===================================================
          CINEMATIC BACKGROUND
      ==================================================== */}

      <div
        className="cinematic-splash-background"
        aria-hidden="true"
      >
        <div className="cinematic-splash-glow cinematic-glow-left" />

        <div className="cinematic-splash-glow cinematic-glow-center" />

        <div className="cinematic-splash-glow cinematic-glow-right" />

        <div className="cinematic-splash-vignette" />

        <div className="cinematic-splash-grain" />
      </div>

      {/* ===================================================
          TOP MICRO NAV
      ==================================================== */}

      <div className="cinematic-splash-top">
        <span>
          WELCOME
        </span>

        <i />

        <span>
          TO CEYLON
        </span>
      </div>

      {/* ===================================================
          CENTER CONTENT
      ==================================================== */}

      <div className="cinematic-splash-content">
        {/* LOGO */}

        <div className="cinematic-splash-logo-wrap">
          <img
            src="/images/logo.webp"
            alt="Ceylon Natural Care"
            className="cinematic-splash-logo"
          />
        </div>

        {/* EYEBROW */}

        <span className="cinematic-splash-eyebrow">
          HERBAL RITUAL CARE
        </span>

        {/* TITLE */}

        <h1 className="cinematic-splash-title">
          <span>
            Nature&apos;s
          </span>

          <em>
            Blessing.
          </em>
        </h1>

        {/* SUBTITLE */}

        <p className="cinematic-splash-subtitle">
          TRADITION OF CEYLON HERBAL CARE
        </p>

        {/* BOTTOM INTERACTION */}

        <div className="cinematic-splash-actions">
          <div className="cinematic-splash-progress-block">
            <span>
              ENTER EXPERIENCE
            </span>

            <div className="cinematic-splash-progress">
              <i />
            </div>
          </div>

          <button
            type="button"
            className="cinematic-splash-skip"
            onClick={finishSplash}
          >
            SKIP
          </button>
        </div>
      </div>

      {/* ===================================================
          FOOTER
      ==================================================== */}

      <div className="cinematic-splash-footer">
        <span>
          BOTANICAL CARE
        </span>

        <i />

        <span>
          EST. 2016
        </span>

        <i />

        <span>
          CEYLON · SRI LANKA
        </span>
      </div>
    </div>
  );
}