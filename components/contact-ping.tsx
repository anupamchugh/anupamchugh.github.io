'use client';

import { useState, type FormEvent } from 'react';

const emailAddress = 'anupamchugh@gmail.com';

export default function ContactPing() {
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent('Work with me');
    const body = encodeURIComponent(
      `From: ${from.trim()}\n\n${message.trim()}\n\nSent via anupamchugh.github.io`,
    );

    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
  }

  return (
    <section className="mt-12 border-t border-border pt-8" id="contact">
      <div className="rounded-2xl border border-border bg-secondary/30 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Get in touch
            </span>
            <h2 className="mt-3 text-2xl font-semibold text-primary">Have an app that should exist?</h2>
            <p className="mt-1 text-sm text-secondary">
              Share what you want to build, who it is for, and any constraints.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="contact-form"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-background shadow-sm transition-opacity hover:opacity-90"
          >
            {isOpen ? 'Close' : 'Work with me →'}
          </button>
        </div>

        {isOpen && (
          <form id="contact-form" onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="contact-from" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-secondary">
                Your name and contact
              </label>
              <input
                id="contact-from"
                type="text"
                autoComplete="name"
                required
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                placeholder="Name · email or X handle"
                className="w-full rounded-xl border border-border bg-secondary/20 px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-secondary">
                What should we build?
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell me about the idea, audience, and timeline..."
                className="w-full rounded-xl border border-border bg-secondary/20 px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background shadow-sm transition-opacity hover:opacity-90"
            >
              Open email draft →
            </button>
            <p className="text-center text-xs text-tertiary">
              Your email app opens with a draft; nothing is sent until you choose to send it. If it does not open, email{' '}
              <a className="underline hover:text-primary" href={`mailto:${emailAddress}`}>
                {emailAddress}
              </a>.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
