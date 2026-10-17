import Image from "next/image";
import Link from "next/link";

export function LogoHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="site-header">
      <div className="header-grid shell">
        <div aria-hidden="true" className="header-spacer" />
        <Link className="brand-link" href="/" aria-label="Samish Digital Wave home">
          <Image
            className="brand-logo brand-logo-wide"
            src="/images/samish-logo-horizontal-dark.png"
            alt="Samish Digital Wave — AI-Powered Digital Marketing"
            width={1920}
            height={640}
            priority
          />
          <Image
            className="brand-logo brand-logo-icon"
            src="/images/samish-icon-512.png"
            alt="Samish Digital Wave"
            width={512}
            height={512}
            priority
          />
        </Link>
        <div className="header-action">
          {!compact && (
            <Link className="button button-small" href="/#consultation">
              Book a Free Consultation <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
