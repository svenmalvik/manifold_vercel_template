---
name: form-design
description: Use when building forms, handling user input, adding validation, creating multi-step wizards, or when the user asks for a form that feels polished and accessible
---

# Form Design

## Overview

Build forms that feel responsive, forgiving, and clear -- without pulling in a form library. Use native HTML validation attributes, controlled React state, and focused CSS to handle every common pattern.

## Validation Strategy: Validate on Blur, Confirm on Change

Never validate while the user is still typing. Validate on blur (when they leave the field), then clear the error as soon as the input becomes valid. This "reward early, punish late" pattern avoids premature red text and feels responsive.

```tsx
// src/hooks/useForm.ts
import { useState, useCallback, type ChangeEvent, type FocusEvent } from 'react';

type Validator<T> = Partial<Record<keyof T, (value: string) => string | null>>;

export function useForm<T extends Record<string, string>>(
  initial: T,
  validators: Validator<T>
) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string | null>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error as soon as field becomes valid (reward early)
    if (touched[name as keyof T]) {
      const validate = validators[name as keyof T];
      if (validate && !validate(value)) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  }, [validators, touched]);

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const validate = validators[name as keyof T];
    if (validate) {
      setErrors(prev => ({ ...prev, [name]: validate(value) }));
    }
  }, [validators]);

  const validateAll = useCallback(() => {
    const next: Partial<Record<keyof T, string | null>> = {};
    let valid = true;
    for (const key in validators) {
      const msg = validators[key]!(values[key]);
      next[key] = msg;
      if (msg) valid = false;
    }
    setErrors(next);
    setTouched(Object.keys(validators).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    return valid;
  }, [validators, values]);

  return { values, errors, touched, handleChange, handleBlur, validateAll };
}
```

## Accessible Error Messaging

Every error needs three things: `aria-invalid`, `aria-describedby` linking to the message, and `aria-live="polite"` on the message container so screen readers announce it without interrupting.

```tsx
// src/components/FormField.tsx
import type { ReactNode, InputHTMLAttributes } from 'react';
import styles from './FormField.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  hint?: string;
  children?: ReactNode; // for custom inputs (select, checkbox group)
}

export function FormField({ label, error, hint, children, id, ...inputProps }: Props) {
  const fieldId = id || inputProps.name || '';
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  return (
    <div className={styles.field}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
        {inputProps.required && <span className={styles.required} aria-hidden="true">*</span>}
      </label>
      {hint && <p id={hintId} className={styles.hint}>{hint}</p>}
      {children || (
        <input
          id={fieldId}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          aria-invalid={!!error}
          aria-describedby={[error ? errorId : '', hint ? hintId : ''].filter(Boolean).join(' ') || undefined}
          {...inputProps}
        />
      )}
      <div id={errorId} className={styles.error} aria-live="polite" role="alert">
        {error || ''}
      </div>
    </div>
  );
}
```

```css
/* src/components/FormField.module.css */
/* Uses spacing/color tokens from beautiful-web-design */

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.required {
  color: var(--color-error);
  margin-left: var(--space-xs);
}

.hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}

.input {
  padding: var(--space-sm) var(--space-md);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  font-family: var(--font-body);
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-light);
}

.inputError {
  border-color: var(--color-error);
}

.inputError:focus {
  box-shadow: 0 0 0 3px rgba(196, 61, 46, 0.12);
}

.error {
  font-size: var(--text-xs);
  color: var(--color-error);
  min-height: 1.25em; /* prevent layout shift */
}
```

## Multi-Step Forms

Show a progress indicator, validate only the current step on "Next", and keep all state in the parent. Group related fields per step and put the easiest questions first.

```tsx
// src/components/StepForm.tsx
import { useState, type FormEvent, type ReactNode } from 'react';
import styles from './StepForm.module.css';

interface StepFormProps {
  steps: { label: string; content: ReactNode; validate?: () => boolean }[];
  onSubmit: () => void;
}

export function StepForm({ steps, onSubmit }: StepFormProps) {
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const next = () => {
    const step = steps[current];
    if (step.validate && !step.validate()) return;
    if (current < steps.length - 1) setCurrent(c => c + 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const step = steps[current];
    if (step.validate && !step.validate()) return;
    setStatus('submitting');
    try {
      await onSubmit();
      setStatus('success');
    } catch {
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return <div className={styles.success} role="status">Submitted successfully.</div>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Progress bar */}
      <nav className={styles.progress} aria-label="Form progress">
        {steps.map((s, i) => (
          <div
            key={s.label}
            className={`${styles.step} ${i <= current ? styles.stepActive : ''}`}
            aria-current={i === current ? 'step' : undefined}
          >
            <span className={styles.stepNumber}>{i + 1}</span>
            <span className={styles.stepLabel}>{s.label}</span>
          </div>
        ))}
      </nav>

      {/* Current step content */}
      <div className={styles.body}>{steps[current].content}</div>

      {/* Navigation */}
      <div className={styles.actions}>
        {current > 0 && (
          <button type="button" className={styles.back} onClick={() => setCurrent(c => c - 1)}>
            Back
          </button>
        )}
        {current < steps.length - 1 ? (
          <button type="button" className={styles.next} onClick={next}>Next</button>
        ) : (
          <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </form>
  );
}
```

```css
/* src/components/StepForm.module.css */

.progress {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.step {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  opacity: 0.4;
  transition: opacity 0.2s ease;
}

.stepActive { opacity: 1; }

.stepNumber {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-border);
  display: grid;
  place-items: center;
  font-size: var(--text-xs);
  font-weight: 700;
}

.stepActive .stepNumber {
  background: var(--color-accent);
  color: var(--color-surface);
}

.stepLabel {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-xl);
}

.back, .next, .submit {
  padding: var(--space-sm) var(--space-lg);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
}

.back {
  background: transparent;
  color: var(--color-text-muted);
}

.next, .submit {
  background: var(--color-accent);
  color: var(--color-surface);
}

.next:hover, .submit:hover {
  background: var(--color-accent-hover);
}

.next:active, .submit:active {
  transform: scale(0.98);
}

.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  text-align: center;
  padding: var(--space-3xl) var(--space-lg);
  font-size: var(--text-lg);
  color: var(--color-success);
  font-weight: 600;
}
```

## Loading and Success States

Disable the submit button and show a spinner or text change during submission. On success, replace the form with a confirmation message -- never leave users guessing.

```css
/* Inline spinner for buttons */
.btnLoading {
  position: relative;
  color: transparent;
  pointer-events: none;
}
.btnLoading::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-surface);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## Quick Reference: Input Patterns

| Element | HTML | Key attributes |
|---------|------|---------------|
| Text / email | `<input type="email">` | `required`, `pattern`, `maxLength` |
| Password | `<input type="password">` | `minLength`, `autoComplete="new-password"` |
| Select | `<select>` | First `<option>` disabled as placeholder |
| Checkbox | `<input type="checkbox">` | Wrap in `<label>`, no `for` needed |
| Radio group | `<fieldset>` + `<input type="radio">` | Same `name`, wrap group in `<fieldset>` + `<legend>` |
| Date | `<input type="date">` | `min`, `max` for range constraints |
| Textarea | `<textarea>` | `rows`, `maxLength`, use `resize: vertical` |
| File | `<input type="file">` | `accept` for MIME types, style via label overlay |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Validating on every keystroke | Validate on blur, clear error on change |
| Color-only error indication | Always pair red border with a text message |
| Missing `aria-invalid` / `aria-describedby` | Add both to every field with an error |
| Disabling submit before first attempt | Let users click submit, then show errors |
| Generic "Invalid input" messages | Be specific: "Email must include @" |
| No `min-height` on error container | Reserve space to prevent layout shift |
| Same-page multi-step with no progress bar | Always show step count and current position |
| No loading state on submit button | Disable + spinner prevents double submission |
| Skipping `noValidate` on `<form>` | Add it to use custom validation, not browser popups |
| Using `placeholder` as label | Placeholders vanish on focus -- always use `<label>` |
