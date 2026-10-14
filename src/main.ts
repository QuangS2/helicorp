import './styles/tokens.css';
import './styles/critical.css';
import './styles/main.css';

import { initTheme } from './modules/theme';
import { FleetManager } from './modules/fleetManager';
import { initScrollytelling } from './modules/scrollytelling';
import { initTelemetry, logTelemetryEvent } from './modules/telemetry';
import { initChatbot } from './modules/chatbot';
import { validateLeadForm, sanitizeText } from './modules/validator';
import { dispatchLeadWebhook } from './modules/webhook';
import { showToast } from './modules/toast';
import { NewsletterFormData } from './types';

function initNavigation(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');
  const sections = document.querySelectorAll<HTMLElement>('section[id]');

  window.addEventListener(
    'scroll',
    () => {
      const scrollY = window.scrollY + 120;
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            if (link.getAttribute('data-nav-target') === id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { passive: true }
  );
}

function initLeadForm(): void {
  const form = document.getElementById('leadBookingForm') as HTMLFormElement | null;
  if (!form) return;

  const nameInput = document.getElementById('fullNameInput') as HTMLInputElement | null;
  const emailInput = document.getElementById('emailInput') as HTMLInputElement | null;
  const phoneInput = document.getElementById('phoneInput') as HTMLInputElement | null;
  const categorySelect = document.getElementById('categorySelect') as HTMLSelectElement | null;
  const flightDateInput = document.getElementById('flightDateInput') as HTMLInputElement | null;
  const notesInput = document.getElementById('notesInput') as HTMLTextAreaElement | null;

  const nameError = document.getElementById('fullNameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const submitBtn = document.getElementById('formSubmitBtn') as HTMLButtonElement | null;
  const submitSpinner = document.getElementById('submitBtnSpinner');
  const submitText = document.getElementById('submitBtnText');

  function clearErrors(): void {
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (phoneError) phoneError.textContent = '';
    nameInput?.classList.remove('is-invalid');
    emailInput?.classList.remove('is-invalid');
    phoneInput?.classList.remove('is-invalid');
  }

  [nameInput, emailInput, phoneInput].forEach((input) => {
    input?.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      if (input === nameInput && nameError) nameError.textContent = '';
      if (input === emailInput && emailError) emailError.textContent = '';
      if (input === phoneInput && phoneError) phoneError.textContent = '';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const formData: NewsletterFormData = {
      fullName: sanitizeText(nameInput?.value || ''),
      email: sanitizeText(emailInput?.value || ''),
      phone: sanitizeText(phoneInput?.value || ''),
      interestedCategory: (categorySelect?.value || 'all') as NewsletterFormData['interestedCategory'],
      flightExperienceDate: flightDateInput?.value || undefined,
      notes: sanitizeText(notesInput?.value || ''),
    };

    // 1. Validation
    const validation = validateLeadForm(formData);
    if (!validation.isValid) {
      if (validation.errors.fullName && nameError && nameInput) {
        nameError.textContent = validation.errors.fullName;
        nameInput.classList.add('is-invalid');
      }
      if (validation.errors.email && emailError && emailInput) {
        emailError.textContent = validation.errors.email;
        emailInput.classList.add('is-invalid');
      }
      if (validation.errors.phone && phoneError && phoneInput) {
        phoneError.textContent = validation.errors.phone;
        phoneInput.classList.add('is-invalid');
      }
      showToast('Vui lòng kiểm tra lại thông tin biểu mẫu chưa hợp lệ.', 'error');
      return;
    }

    // 2. Submission state
    if (submitBtn) submitBtn.disabled = true;
    if (submitSpinner) submitSpinner.style.display = 'inline-block';
    if (submitText) submitText.textContent = 'Đang mã hóa & gửi webhook...';

    try {
      const response = await dispatchLeadWebhook(formData);

      if (response.success) {
        showToast(
          `${response.message} (Mã tiếp nhận: ${response.trackingId})`,
          'success',
          6000
        );
        logTelemetryEvent('form_submit', 'Lead & Flight Test Booking Form Submitted', {
          trackingId: response.trackingId,
          interestedCategory: formData.interestedCategory,
        });
        form.reset();
      } else {
        showToast(response.message || 'Không thể kết nối đến máy chủ webhook.', 'error');
      }
    } catch (err) {
      console.error('[Form Submit Error]', err);
      showToast('Có lỗi xảy ra khi truyền tin. Vui lòng thử lại sau.', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitSpinner) submitSpinner.style.display = 'none';
      if (submitText) submitText.textContent = 'Gửi Yêu Cầu Thẩm Định & Đặt Lịch Ngay';
    }
  });
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  const fleetManager = new FleetManager();
  fleetManager.init();
  initScrollytelling();
  initTelemetry();
  initChatbot();
  initLeadForm();

  console.log(
    '%c HELICORP AEROSPACE %c Avionics System v1.0.0 Online ',
    'background: #00f0ff; color: #000; font-weight: bold; padding: 2px 4px; border-radius: 2px;',
    'background: #111827; color: #fff; padding: 2px 4px;'
  );
});
