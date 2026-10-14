import { NewsletterFormData, ValidationResult } from '../types';

export function sanitizeText(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

export function isValidEmail(email: string): boolean {
  // RFC 5322 standard simplified email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  // Vietnam phone format: 10 digits starting with 0, or international +84 followed by 9 digits
  const cleanPhone = phone.replace(/[\s.-]/g, '');
  const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  return vnPhoneRegex.test(cleanPhone);
}

export function validateLeadForm(data: NewsletterFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const cleanName = data.fullName.trim();
  if (!cleanName) {
    errors.fullName = 'Vui lòng nhập họ và tên của quý khách.';
  } else if (cleanName.length < 2) {
    errors.fullName = 'Họ và tên phải có tối thiểu 2 ký tự.';
  } else if (cleanName.length > 80) {
    errors.fullName = 'Họ và tên không được vượt quá 80 ký tự.';
  }

  const cleanEmail = data.email.trim();
  if (!cleanEmail) {
    errors.email = 'Vui lòng nhập địa chỉ email liên hệ.';
  } else if (!isValidEmail(cleanEmail)) {
    errors.email = 'Địa chỉ email không đúng định dạng chuẩn (ví dụ: ten@congty.com).';
  }

  const cleanPhone = data.phone.trim();
  if (!cleanPhone) {
    errors.phone = 'Vui lòng cung cấp số điện thoại để chuyên viên liên hệ.';
  } else if (!isValidPhone(cleanPhone)) {
    errors.phone = 'Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
