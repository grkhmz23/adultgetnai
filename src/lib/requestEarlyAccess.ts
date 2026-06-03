import { adultgenConfig } from './runtimeConfig';

export function requestEarlyAccess() {
  const form = document.getElementById('early-access');

  if (form) {
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => {
      const input = form.querySelector<HTMLInputElement>('input[name="name"]');
      input?.focus();
    }, 500);
    return;
  }

  window.location.href = adultgenConfig.earlyAccessUrl;
}
