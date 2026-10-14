import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhone, sanitizeText, validateLeadForm } from '../src/modules/validator';

describe('Validator Module (Security & Trust Boundary)', () => {
  it('should sanitize dangerous HTML tags and script injections', () => {
    const dirty = '<script>alert("xss")</script> & <b>bold</b>';
    const clean = sanitizeText(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('&lt;script&gt;');
    expect(clean).toContain('&amp;');
  });

  it('should validate valid RFC 5322 emails', () => {
    expect(isValidEmail('ceo@helicorp.aero')).toBe(true);
    expect(isValidEmail('pilot.lead@airline.com.vn')).toBe(true);
    expect(isValidEmail('user123+tag@domain.co')).toBe(true);
  });

  it('should reject malformed emails', () => {
    expect(isValidEmail('plainaddress')).toBe(false);
    expect(isValidEmail('@missingusername.com')).toBe(false);
    expect(isValidEmail('username@.com')).toBe(false);
    expect(isValidEmail('username@domain..com')).toBe(false);
  });

  it('should validate Vietnamese mobile numbers', () => {
    expect(isValidPhone('0912345678')).toBe(true);
    expect(isValidPhone('0987654321')).toBe(true);
    expect(isValidPhone('+84912345678')).toBe(true);
    expect(isValidPhone('0398765432')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone('0912345678999')).toBe(false);
    expect(isValidPhone('0112345678')).toBe(false); // invalid prefix
    expect(isValidPhone('abcdefghij')).toBe(false);
  });

  it('should correctly validate complete lead form data', () => {
    const validData = {
      fullName: 'Nguyễn Hải Đăng',
      email: 'dang.nguyen@enterprise.vn',
      phone: '0988123456',
      interestedCategory: 'executive' as const,
    };
    const result = validateLeadForm(validData);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('should return errors for incomplete or invalid lead form data', () => {
    const invalidData = {
      fullName: 'A', // too short (<2 chars)
      email: 'not-an-email',
      phone: '000',
      interestedCategory: 'all' as const,
    };
    const result = validateLeadForm(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors.fullName).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.phone).toBeDefined();
  });
});
