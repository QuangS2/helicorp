import { describe, it, expect } from 'vitest';
import { getBotReply } from '../src/modules/chatbot';

describe('AI Flight Assistant Chatbot Knowledge Engine', () => {
  it('should answer inquiries about HX-9 pricing and deposit', () => {
    const reply = getBotReply('Giá cọc máy bay trực thăng HX-9 là bao nhiêu?');
    expect(reply).toContain('HX-9');
    expect(reply).toContain('$50,000 USD');
  });

  it('should answer inquiries about VT-4 eVTOL range', () => {
    const reply = getBotReply('Máy bay eVTOL VT-4 có tầm bay bao xa?');
    expect(reply).toContain('VT-4');
    expect(reply).toContain('280 km');
  });

  it('should answer inquiries about H-600 heavy cargo capacity', () => {
    const reply = getBotReply('Khả năng cẩu của H-600 là mấy tấn?');
    expect(reply).toContain('H-600');
    expect(reply).toContain('6,500 kg');
  });

  it('should answer safety certification inquiries', () => {
    const reply = getBotReply('Trực thăng có đạt chứng chỉ an toàn FAA không?');
    expect(reply).toContain('FAA');
    expect(reply).toContain('EASA');
  });

  it('should return courteous fallback for generic greeting', () => {
    const reply = getBotReply('Xin chào trực thăng');
    expect(reply).toContain('Helicorp');
  });
});
