"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { contactMethods, serviceOptions } from "@/lib/site-config";
import { validateConsultation, type ConsultationInput, type FieldErrors } from "@/lib/validation";

const initialValues: ConsultationInput = {
  fullName: "",
  businessEmail: "",
  company: "",
  website: "",
  whatsappNumber: "",
  country: "",
  service: "",
  challenge: "",
  contactMethod: "Email",
  consent: false,
};

const fields: Array<{ name: keyof ConsultationInput; label: string; placeholder?: string; type?: string; required?: boolean }> = [
  { name: "fullName", label: "Full name", placeholder: "Your name", required: true },
  { name: "businessEmail", label: "Business email", placeholder: "you@business.com", type: "email", required: true },
  { name: "company", label: "Company or brand name", placeholder: "Your business", required: false },
  { name: "website", label: "Website or social media URL", placeholder: "https://", type: "url", required: false },
  { name: "whatsappNumber", label: "WhatsApp number", placeholder: "+1 555 123 4567", type: "tel", required: false },
  { name: "country", label: "Country", placeholder: "Where is your business based?", required: true },
];

export function ConsultationForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const submissionKey = useRef<string | null>(null);

  function update(name: keyof ConsultationInput, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({
      ...current,
      [name]: undefined,
      ...(name === "contactMethod" ? { whatsappNumber: undefined } : {}),
    }));
    submissionKey.current = null;
    if (message) setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    const websiteUrl = new FormData(event.currentTarget).get("websiteUrl");

    const nextErrors = validateConsultation(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setMessage("Please check the highlighted fields and try again.");
      return;
    }

    setStatus("loading");
    setMessage("");
    submissionKey.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": submissionKey.current },
        body: JSON.stringify({ ...values, websiteUrl }),
      });
      const result = (await response.json()) as { receipt?: string; error?: string; errors?: FieldErrors };
      if (!response.ok || !result.receipt) {
        setErrors(result.errors ?? {});
        setMessage(result.error ?? "Your request could not be sent. Please try again in a moment.");
        setStatus("error");
        return;
      }

      router.push(`/thank-you?receipt=${encodeURIComponent(result.receipt)}`);
    } catch {
      setMessage("We couldn’t reach the submission service. Please try again when your connection is available.");
      setStatus("error");
    }
  }

  return (
    <form className="consultation-form" onSubmit={handleSubmit} noValidate>
      <div className="form-fields">
        {fields.map((field) => (
          <label className="field" key={field.name}>
            <span>{field.label}{(field.required || (field.name === "whatsappNumber" && values.contactMethod === "WhatsApp")) && <em aria-hidden="true">*</em>}</span>
            <input
              autoComplete={field.name === "fullName" ? "name" : field.name === "businessEmail" ? "email" : field.name === "company" ? "organization" : field.name === "whatsappNumber" ? "tel" : "off"}
              name={field.name}
              type={field.type ?? "text"}
              value={String(values[field.name] ?? "")}
              placeholder={field.placeholder}
              required={field.required || (field.name === "whatsappNumber" && values.contactMethod === "WhatsApp")}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              onChange={(event) => update(field.name, event.target.value)}
              onBlur={() => {
                const current = validateConsultation(values);
                if (current[field.name]) setErrors((existing) => ({ ...existing, [field.name]: current[field.name] }));
              }}
            />
            {errors[field.name] && <small className="field-error" id={`${field.name}-error`}>{errors[field.name]}</small>}
          </label>
        ))}

        <label className="field">
          <span>Service of interest<em aria-hidden="true">*</em></span>
          <select
            name="service"
            value={values.service}
            required
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? "service-error" : undefined}
            onChange={(event) => update("service", event.target.value)}
            onBlur={() => {
              const current = validateConsultation(values);
              if (current.service) setErrors((existing) => ({ ...existing, service: current.service }));
            }}
          >
            <option value="" disabled>Select a service area</option>
            {serviceOptions.map((service) => <option key={service} value={service}>{service}</option>)}
          </select>
          {errors.service && <small className="field-error" id="service-error">{errors.service}</small>}
        </label>

        <label className="field field-wide">
          <span>Main marketing challenge<em aria-hidden="true">*</em></span>
          <textarea
            name="challenge"
            value={values.challenge}
            placeholder="What would you like to improve in your marketing?"
            rows={4}
            maxLength={3000}
            required
            aria-invalid={Boolean(errors.challenge)}
            aria-describedby={errors.challenge ? "challenge-error" : undefined}
            onChange={(event) => update("challenge", event.target.value)}
            onBlur={() => {
              const current = validateConsultation(values);
              if (current.challenge) setErrors((existing) => ({ ...existing, challenge: current.challenge }));
            }}
          />
          {errors.challenge && <small className="field-error" id="challenge-error">{errors.challenge}</small>}
        </label>

        <fieldset className="field field-wide contact-choice">
          <legend>Preferred contact method</legend>
          <div className="choice-row">
            {contactMethods.map((method) => (
              <label className={`choice-option ${values.contactMethod === method ? "is-selected" : ""}`} key={method}>
                <input
                  type="radio"
                  name="contactMethod"
                  value={method}
                  checked={values.contactMethod === method}
                  onChange={(event) => update("contactMethod", event.target.value)}
                />
                <span className="radio-mark" aria-hidden="true" />{method}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <label className="consent-row">
        <input
          type="checkbox"
          checked={values.consent}
          onChange={(event) => update("consent", event.target.checked)}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "consent-error" : undefined}
        />
        <span className="checkbox-mark" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="m3 8 3 3 7-7" /></svg></span>
        <span>I agree to be contacted about this consultation request.</span>
      </label>
      {errors.consent && <small className="field-error consent-error" id="consent-error">{errors.consent}</small>}

      <div className="honeypot" aria-hidden="true">
        <label>Leave this field empty<input tabIndex={-1} autoComplete="off" name="websiteUrl" /></label>
      </div>

      <button className="button button-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? <><span className="button-spinner" /> Sending your request…</> : <>Request My Free Consultation <span aria-hidden="true">↗</span></>}
      </button>
      <p className="form-privacy"><span aria-hidden="true">◇</span> Your details are used only to respond to this request.</p>
      <div className={`form-message ${status === "error" || Object.keys(errors).length ? "is-error" : ""}`} role="status" aria-live="polite">
        {message}
      </div>
    </form>
  );
}
