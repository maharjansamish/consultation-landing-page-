"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/Icons";
import { getWhatsAppUrl } from "@/lib/site-config";

export function FloatingWhatsApp() {
  const [nearImportantContent, setNearImportantContent] = useState(false);
  const href = getWhatsAppUrl();

  useEffect(() => {
    const targets = ["#consultation", ".site-footer"]
      .map((selector) => document.querySelector(selector))
      .filter((element): element is Element => Boolean(element));
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      setNearImportantContent(entries.some((entry) => entry.isIntersecting));
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  if (!href) return null;

  return (
    <a
      className={`whatsapp-float${nearImportantContent ? " is-obscured" : ""}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Samish Digital Wave on WhatsApp"
      title="Chat with us on WhatsApp"
      aria-hidden={nearImportantContent}
      tabIndex={nearImportantContent ? -1 : undefined}
    >
      <WhatsAppIcon />
    </a>
  );
}
