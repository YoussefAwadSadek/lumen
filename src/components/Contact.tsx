import type { FormEvent } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useStore } from '../store';
import { Icon } from './Icon';
import styles from './Contact.module.css';

const INFO = [
  { icon: 'schedule', title: 'Studio hours', text: 'Sat – Thu · 10:00 – 20:00' },
  { icon: 'location_on', title: 'The studio', text: 'Home studio · nationwide shipping · pickup by appointment' },
  { icon: 'local_shipping', title: 'Shipping', text: 'Poured, cured and shipped within 5 days. Fragile-wrapped by hand.' },
];

const SOCIALS = ['INSTAGRAM', 'TIKTOK', 'PINTEREST'];

export function Contact() {
  const { toast } = useStore();
  const reveal0 = useReveal(0);
  const reveal60 = useReveal(60);
  const reveal100 = useReveal(100);
  const reveal140 = useReveal(140);
  const reveal180 = useReveal(180);

  // Front-end only, as in the design — connect a form endpoint before launch.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    toast('Message sent. We answer by candlelight.', 'mail');
  };

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div className={styles.main}>
          <div ref={reveal0} className="ak-overline">
            Contact
          </div>
          <h2 ref={reveal60} id="contact-title" className={`section-title ${styles.title}`}>
            Write to us.
          </h2>
          <p ref={reveal100} className={styles.lede}>
            Custom pours, bulk gifting, or a scent you can almost name — we answer by candlelight.
          </p>
          <form ref={reveal140} onSubmit={onSubmit} className={styles.form}>
            <input name="name" required placeholder="Name" aria-label="Name" autoComplete="name" className={`field ${styles.half}`} />
            <input name="phone" type="tel" placeholder="Phone (optional)" aria-label="Phone" autoComplete="tel" className={`field ${styles.half}`} />
            <input name="email" type="email" required placeholder="Email" aria-label="Email" autoComplete="email" className={`field ${styles.full}`} />
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell us what you want to light."
              aria-label="Message"
              className={`field ${styles.full} ${styles.message}`}
            />
            <button type="submit" className={`btn btn-gold ${styles.submit}`}>
              <Icon name="mail" size={19} />
              Send message
            </button>
          </form>
        </div>

        <div ref={reveal180} className={styles.aside}>
          <div className={`surface ${styles.info}`}>
            {INFO.map((row) => (
              <div key={row.title} className={styles.infoRow}>
                <Icon name={row.icon} size={22} className={styles.infoIcon} />
                <div>
                  <div className={styles.infoTitle}>{row.title}</div>
                  <div className={styles.infoText}>{row.text}</div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => toast('WhatsApp ordering connects in the live store.', 'chat')} className={`btn btn-crimson ${styles.whatsapp}`}>
            <Icon name="chat" size={20} />
            Order via WhatsApp
          </button>
          <div className={styles.socials}>
            {SOCIALS.map((name) => (
              <button key={name} type="button" onClick={() => toast('Coming soon.', 'hourglass_empty')} className={styles.social}>
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
