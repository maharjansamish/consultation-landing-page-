import type { Metadata } from "next";
import Link from "next/link";
import { LogoHeader } from "@/components/LogoHeader";
import { Icon } from "@/components/Icons";
import { getVimeoEmbedUrl, getWhatsAppUrl, siteConfig } from "@/lib/site-config";
import { isValidSubmissionReceipt } from "@/lib/receipt";

type ThankYouPageProps = { searchParams: Promise<{ receipt?: string }> };

export const metadata: Metadata = {
  title: "Thank You | Samish Digital Wave",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const { receipt } = await searchParams;
  const accepted = isValidSubmissionReceipt(receipt);
  const videoUrl = getVimeoEmbedUrl();
  const whatsappUrl = getWhatsAppUrl();

  return (
    <>
      <LogoHeader compact />
      <main className="thankyou-main shell">
        <div className={`thankyou-card ${accepted ? "is-accepted" : "is-neutral"}`}>
          <div className="thankyou-orb"><div className="thankyou-check"><Icon name={accepted ? "check" : "chat"} /></div></div>
          <span className="section-kicker">{accepted ? "REQUEST ACCEPTED" : "SAMISH DIGITAL WAVE"}</span>
          <h1>{accepted ? "Thank You for Reaching Out!" : "Let’s Talk About Your Project."}</h1>
          <p className="thankyou-message">
            {accepted
              ? "Your consultation request has been received. I'll review your details and follow up using your preferred contact method."
              : "Ready to discuss your project? Submit a consultation request to get started."}
          </p>
          {accepted && videoUrl && (
            <div className="thankyou-video">
              <iframe src={videoUrl} title="Samish Digital Wave consultation video" allow="fullscreen; picture-in-picture" allowFullScreen loading="lazy" />
            </div>
          )}
          <div className="thankyou-actions">
            {accepted && whatsappUrl && <a className="button button-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Message Us on WhatsApp <span aria-hidden="true">↗</span></a>}
            <Link className={`button ${accepted && whatsappUrl ? "button-secondary" : ""}`} href={accepted ? "/" : "/#consultation"}>{accepted ? "Back to Home" : "Request a Consultation"} <span aria-hidden="true">↗</span></Link>
          </div>
          {accepted && <p className="thankyou-brandline">{siteConfig.name} <span>·</span> {siteConfig.tagline}</p>}
        </div>
        <div className="thankyou-footnote"><span className="tiny-spark">✦</span> Thoughtful strategy. Practical action.</div>
      </main>
    </>
  );
}
