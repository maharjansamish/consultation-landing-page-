import { ConsultationForm } from "@/components/ConsultationForm";
import { Icon, WhatsAppIcon } from "@/components/Icons";
import { LogoHeader } from "@/components/LogoHeader";
import { MarketingVisual } from "@/components/MarketingVisual";
import { VideoSection } from "@/components/VideoSection";
import { getVimeoEmbedUrl, getWhatsAppUrl, siteConfig } from "@/lib/site-config";

const processSteps = [
  { number: "01", title: "Share Your Goals", description: "Tell me about your business, target audience, and current marketing challenges.", icon: "chat" as const },
  { number: "02", title: "Discuss Opportunities", description: "Explore suitable marketing approaches and potential improvements.", icon: "target" as const },
  { number: "03", title: "Plan Your Next Step", description: "Identify practical actions and discuss whether further support makes sense.", icon: "route" as const },
];

const serviceItems = [
  { title: "AI-Powered Marketing Strategy", description: "Bring your audience, priorities, and channels into a clearer plan.", icon: "spark" as const },
  { title: "Social Media Marketing", description: "Build a more intentional approach to content and community.", icon: "chat" as const },
  { title: "AI Content Creation", description: "Explore useful content ideas and workflows for your business.", icon: "content" as const },
  { title: "SEO and Marketing Automation", description: "Find practical ways to improve discovery and simplify follow-up.", icon: "search" as const },
];

export function LandingPage() {
  const whatsappUrl = getWhatsAppUrl();
  const videoUrl = getVimeoEmbedUrl();

  return (
    <>
      <LogoHeader />
      <main>
        <section className="hero-section shell">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-mark" /> AI-POWERED DIGITAL MARKETING</div>
            <h1>Turn Your Digital Presence Into a <span>Growth Engine.</span></h1>
            <p className="hero-description">I help businesses explore smarter digital marketing opportunities with AI-powered strategies, engaging content, and practical growth systems.</p>
            <div className="hero-actions">
              <a className="button" href="#consultation">Book a Free Consultation <span aria-hidden="true">↗</span></a>
              {whatsappUrl && <a className="button button-whatsapp hero-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Chat on WhatsApp <span aria-hidden="true">↗</span></a>}
              <a className="text-link" href="#process">See How It Works <span aria-hidden="true">↓</span></a>
            </div>
            <ul className="hero-points" aria-label="Consultation highlights">
              <li><Icon name="spark" /> AI-Powered Strategies</li>
              <li><Icon name="target" /> Practical Marketing Insights</li>
              <li><Icon name="check" /> Growth-Focused Execution</li>
            </ul>
          </div>
          <MarketingVisual />
          <div className="hero-scroll-hint"><span /> A thoughtful first step starts here</div>
        </section>

        <section className="value-section section-pad">
          <div className="shell">
            <div className="section-heading centered-heading">
              <span className="section-kicker">THE CONSULTATION</span>
              <h2>Clarity Before Your<br className="desktop-break" /> <span>Next Marketing Move.</span></h2>
              <p>Start with a focused conversation about where your business is today and what could make sense next.</p>
            </div>
            <div className="value-grid">
              <article className="value-card"><span className="card-index">01</span><div className="value-icon"><Icon name="target" /></div><h3>Your online presence</h3><p>Talk through how your business currently shows up online.</p></article>
              <article className="value-card"><span className="card-index">02</span><div className="value-icon purple-icon"><Icon name="route" /></div><h3>Your goals and challenges</h3><p>Share what you want to achieve and what feels difficult today.</p></article>
              <article className="value-card"><span className="card-index">03</span><div className="value-icon pink-icon"><Icon name="spark" /></div><h3>Relevant opportunities</h3><p>Explore AI-powered marketing ideas that fit your situation.</p></article>
              <article className="value-card"><span className="card-index">04</span><div className="value-icon blue-icon"><Icon name="check" /></div><h3>Practical next steps</h3><p>Leave with clearer actions based on the needs you share.</p></article>
            </div>
            <p className="honesty-note"><span aria-hidden="true">✳</span> An introductory conversation to explore fit and direction. A complete marketing strategy is not automatically included.</p>
          </div>
        </section>

        <section className="process-section section-pad" id="process">
          <div className="shell">
            <div className="section-heading split-heading">
              <div><span className="section-kicker">A SIMPLE PROCESS</span><h2>One conversation.<br /><span>A clearer next step.</span></h2></div>
              <p>Start with your context, then focus the conversation on the things that matter most to your business.</p>
            </div>
            <div className="process-grid">
              {processSteps.map((step, index) => (
                <article className="process-card" key={step.number}>
                  <div className="process-card-top"><span className="step-number">{step.number}</span><span className="process-icon"><Icon name={step.icon} /></span>{index < processSteps.length - 1 && <span className="step-connector" aria-hidden="true" />}</div>
                  <h3>{step.title}</h3><p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="services-section section-pad">
          <div className="shell">
            <div className="section-heading centered-heading">
              <span className="section-kicker">AREAS WE CAN EXPLORE</span>
              <h2>Marketing that works<br className="desktop-break" /> <span>together, with purpose.</span></h2>
              <p>We can discuss the areas that best fit your goals and current priorities.</p>
            </div>
            <div className="services-grid">
              {serviceItems.map((service, index) => (
                <article className="service-card" key={service.title}>
                  <div className={`service-icon service-icon-${index + 1}`}><Icon name={service.icon} /></div>
                  <span className="service-count">0{index + 1}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="#consultation" className="service-arrow" aria-label={`Discuss ${service.title}`}><Icon name="arrow" /></a>
                </article>
              ))}
            </div>
            <div className="cta-band">
              <div className="cta-band-glow" />
              <div><span className="section-kicker">YOUR NEXT MOVE</span><h2>Ready to Explore Your<br />Growth Opportunities?</h2><p>Let’s discuss your goals and identify practical ways to strengthen your digital marketing.</p></div>
              <a className="button button-light" href="#consultation">Book Your Free Consultation <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <VideoSection embedUrl={videoUrl} whatsappUrl={whatsappUrl} />

        <section className="consultation-section section-pad" id="consultation">
          <div className="shell consultation-layout">
            <div className="consultation-intro">
              <span className="section-kicker">LET’S START WITH A CONVERSATION</span>
              <h2>Tell me where<br />you want to <span>grow.</span></h2>
              <p className="consultation-lede">Share a little about your business and what you’d like to improve. I’ll review your request and follow up using your preferred contact method.</p>
              <div className="consultation-promise">
                <span className="promise-icon"><Icon name="chat" /></span>
                <div><b>A focused introduction</b><p>We’ll discuss your current marketing, goals, and relevant opportunities.</p></div>
              </div>
              <div className="consultation-promise">
                <span className="promise-icon promise-icon-purple"><Icon name="spark" /></span>
                <div><b>Thoughtful next steps</b><p>Any recommendations will be grounded in the details you share.</p></div>
              </div>
              {siteConfig.contactEmail && <a className="email-link" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>}
            </div>
            <div className="form-card">
              <div className="form-card-heading"><span className="form-step">CONSULTATION REQUEST <i /></span><h3>Book your introduction</h3><p>Fields marked <em>*</em> are required.</p></div>
              <ConsultationForm />
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <div className="footer-brand"><span className="footer-symbol">S<span>W</span></span><div><b>{siteConfig.name}</b><small>{siteConfig.tagline}</small></div></div>
          <p>Practical digital marketing for your next move.</p>
          <a className="footer-top" href="#top">Back to top ↑</a>
        </div>
        <div className="shell footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.name}</span><span>Thoughtful strategy. Practical action.</span></div>
      </footer>
      <a className="mobile-sticky-cta" href="#consultation">Book a Free Consultation <span aria-hidden="true">↗</span></a>
    </>
  );
}
