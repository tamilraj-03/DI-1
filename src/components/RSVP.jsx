import React, { useState } from 'react';
import Ornament from './Ornament';
import { MandalaCircle } from './Ornament';
import styles from './RSVP.module.css';

const submitRSVP = async (data) => {
  // ── Wire this to your backend / Firebase / EmailJS ─────────
  // Example with EmailJS:
  // await emailjs.send('service_id', 'template_id', data, 'public_key');
  //
  // For now, we simulate a successful submission
  console.log('RSVP submitted:', data);
  return new Promise(resolve => setTimeout(resolve, 1200));
};

const RSVP = () => {
  const [form, setForm]       = useState({ name: '', guests: '1', attending: '', meal: '', message: '' });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState('idle'); // idle | loading | success | error

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name      = 'Please enter your name';
    if (!form.attending)       e.attending = 'Please confirm attendance';
    if (!form.meal && form.attending === 'yes') e.meal = 'Please select a meal preference';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(err => ({ ...err, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus('loading');
    try {
      await submitRSVP(form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="rsvp" className={`section ${styles.rsvpSection}`} aria-label="RSVP">
      <div className={styles.bgMandala} aria-hidden="true">
        <MandalaCircle size={500} color="#c8a96e" opacity={0.07} />
      </div>

      <div className={styles.inner}>
        {/* Header */}
        <header className={`reveal ${styles.header}`}>
          <span className="section-eyebrow">Your Presence Matters</span>
          <div className="gold-divider" />
          <h2 className="section-title">We Would Love to Celebrate With You</h2>
          <p className="section-subtitle" style={{ marginTop: 12 }}>
            Please let us know if you will be joining us for this special day
          </p>
          <div style={{ marginTop: 20 }}>
            <Ornament size={18} />
          </div>
        </header>

        {/* Form card */}
        <div className={`reveal ${styles.formCard}`} style={{ transitionDelay: '0.1s' }}>
          {status === 'success' ? (
            <div className={styles.successState} aria-live="polite">
              <div className={styles.successHeart} aria-hidden="true">
                <span>❤️</span>
              </div>
              <h3 className={styles.successTitle}>Thank you, {form.name}!</h3>
              <p className={styles.successMsg}>
                We can't wait to celebrate with you ❤️
                <br />
                <em>Your RSVP has been confirmed.</em>
              </p>
              <button className={styles.resetBtn} onClick={() => { setStatus('idle'); setForm({ name:'', guests:'1', attending:'', meal:'', message:'' }); }}>
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className={styles.form}>
              {/* Name */}
              <div className={styles.field}>
                <label htmlFor="rsvp-name" className={styles.label}>Your Full Name *</label>
                <input
                  id="rsvp-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Tamil Raj"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
                  autoComplete="name"
                />
                {errors.name && <span id="rsvp-name-error" className={styles.error} role="alert">{errors.name}</span>}
              </div>

              {/* Guests */}
              <div className={styles.field}>
                <label htmlFor="rsvp-guests" className={styles.label}>Number of Guests</label>
                <select
                  id="rsvp-guests"
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  className={styles.input}
                >
                  {[1,2,3,4,5,6].map(n => (
                    <option key={n} value={String(n)}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {/* Attending */}
              <fieldset className={styles.field}>
                <legend className={styles.label}>Will you be attending? *</legend>
                <div className={styles.radioGroup} role="radiogroup">
                  {[
                    { value: 'yes', label: '✓ Joyfully Accept' },
                    { value: 'no',  label: '✕ Regretfully Decline' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`${styles.radioLabel} ${form.attending === opt.value ? styles.radioSelected : ''}`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={opt.value}
                        checked={form.attending === opt.value}
                        onChange={handleChange}
                        className={styles.radioInput}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {errors.attending && <span className={styles.error} role="alert">{errors.attending}</span>}
              </fieldset>

              {/* Meal */}
              {form.attending === 'yes' && (
                <div className={styles.field}>
                  <label htmlFor="rsvp-meal" className={styles.label}>Meal Preference *</label>
                  <select
                    id="rsvp-meal"
                    name="meal"
                    value={form.meal}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.meal ? styles.inputError : ''}`}
                    aria-describedby={errors.meal ? 'rsvp-meal-error' : undefined}
                  >
                    <option value="">Select preference...</option>
                    <option value="veg">🌿 Vegetarian</option>
                    <option value="nonveg">🍗 Non-Vegetarian</option>
                    <option value="vegan">🥦 Vegan</option>
                    <option value="jain">Jain</option>
                  </select>
                  {errors.meal && <span id="rsvp-meal-error" className={styles.error} role="alert">{errors.meal}</span>}
                </div>
              )}

              {/* Message */}
              <div className={styles.field}>
                <label htmlFor="rsvp-message" className={styles.label}>A Message for the Couple (Optional)</label>
                <textarea
                  id="rsvp-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Share your wishes..."
                  rows={3}
                  className={styles.textarea}
                />
              </div>

              {/* Submit */}
              <button
                id="rsvp-submit-btn"
                type="submit"
                className={styles.submitBtn}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span className={styles.loadingDots}>Confirming<span>.</span><span>.</span><span>.</span></span>
                ) : (
                  'Confirm Attendance ❤️'
                )}
              </button>

              {status === 'error' && (
                <p className={styles.errorMsg} role="alert">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default RSVP;
