import { FLEET_DATA } from '../data/fleetData';
import { logTelemetryEvent } from './telemetry';

export function getBotReply(userPrompt: string): string {
  const query = userPrompt.toLowerCase().trim();

  // 0. General Fleet inquiries
  if (query.includes('hạm đội') || query.includes('danh sách') || query.includes('mẫu máy bay') || query.includes('có những')) {
    const names = FLEET_DATA.map((a) => a.name).join(', ');
    return `Hiện tại Helicorp đang cung cấp 4 dòng máy bay chủ lực: ${names}. Quý khách quan tâm mẫu trực thăng hoặc eVTOL nào để tôi cung cấp thông số chi tiết?`;
  }

  // 1. HX-9 Stealth Phantom inquiries
  if (query.includes('hx-9') || query.includes('hx9') || query.includes('phantom') || query.includes('hành pháp') || query.includes('vip')) {
    if (query.includes('cọc') || query.includes('giá') || query.includes('deposit') || query.includes('tiền')) {
      return `Trực thăng hành pháp Helicorp HX-9 Stealth Phantom có giá khởi điểm từ $8,500,000 USD. Quý khách có thể đặt cọc giữ suất ưu tiên bàn giao quý 1/2027 với mức cọc $50,000 USD (được hoàn lại 100% trong vòng 30 ngày thẩm định).`;
    }
    return `Helicorp HX-9 Stealth Phantom là trực thăng hybrid đầu bảng: vận tốc tối đa 375 km/h, tầm bay 920 km, chở 8 khách VIP với công nghệ triệt tiêu âm thanh QuietRotor™ (chỉ 64 dBA trong cabin). Quý khách có thể ấn nút "Cấu hình" tại mục Hạm đội để chọn gói nội thất Presidential Sky Lounge.`;
  }

  // 2. VT-4 eVTOL inquiries
  if (query.includes('vt-4') || query.includes('vt4') || query.includes('evtol') || query.includes('xe bay') || query.includes('điện') || query.includes('pin')) {
    if (query.includes('tầm bay') || query.includes('bao xa') || query.includes('range')) {
      return `Máy bay điện thẳng đứng Helicorp Veloce VT-4 Horizon đạt tầm bay 280 km cho mỗi lần sạc đầy pin thể rắn 800V (thời gian sạc siêu nhanh 15 phút tại trạm Vertiport). Vận tốc hành trình 240 km/h, độ ồn chỉ 48 dBA.`;
    }
    return `Veloce VT-4 Horizon là giải pháp Urban Air Mobility không khí thải: 8 động cơ điện nghiêng độc lập, tự chủ bay Cấp độ 4, giá $3,200,000 USD, cọc giữ suất chỉ $25,000 USD.`;
  }

  // 3. H-600 SkyLifter inquiries
  if (query.includes('h-600') || query.includes('h600') || query.includes('tải trọng') || query.includes('cẩu') || query.includes('vận tải') || query.includes('cargo')) {
    return `Helicorp H-600 SkyLifter là dòng trực thăng hạng nặng hai cánh quạt song song: sức cẩu ngoài lên tới 6,500 kg (6.5 tấn), tầm bay 1,150 km, trang bị động cơ đôi GE Aviation T408 công suất 7,500 shp. Mức cọc giữ chỗ là $100,000 USD.`;
  }

  // 4. MedEvac-8 ICU inquiries
  if (query.includes('medevac') || query.includes('y tế') || query.includes('cứu thương') || query.includes('bệnh viện') || query.includes('icu')) {
    return `Helicorp Aura MedEvac-8 là trực thăng ICU cứu thương di động với buồng áp suất dương vô trùng, trần bay 6,500m, trang bị máy thở ECMO chuyên sâu và đường truyền 5G hội chẩn thời gian thực với bệnh viện trung ương.`;
  }

  // 5. Booking / Test flight / Thẩm định
  if (query.includes('bay thử') || query.includes('đặt lịch') || query.includes('test flight') || query.includes('thẩm định')) {
    return `Để đặt lịch bay thẩm định thực địa tại Helipad Vertiport của Helicorp, quý khách vui lòng điền thông tin tại form "Đăng Ký Bay Thử" ở cuối trang hoặc để lại số điện thoại để chuyên viên kíp bay liên hệ trong vòng 15 phút.`;
  }

  // 6. An toàn / Chứng chỉ FAA / EASA
  if (query.includes('an toàn') || query.includes('chứng chỉ') || query.includes('faa') || query.includes('easa')) {
    return `Toàn bộ hạm đội Helicorp đều được thiết kế và kiểm định theo tiêu chuẩn an toàn khắt khe nhất của FAA Part 29 (Transport Category Rotorcraft) và EASA CS-29, tích hợp hệ thống dù cứu hộ toàn thân máy bay và hạ cánh tự động khẩn cấp SafeLand™.`;
  }

  // Default intelligent assistant fallback
  return `Cảm ơn quý khách đã quan tâm đến Helicorp! Hệ thống hỗ trợ quý khách về: 1. So sánh thông số HX-9, H-600, VT-4 eVTOL và MedEvac-8; 2. Quy trình đặt cọc giữ suất bàn giao ưu tiên; 3. Lịch bay thử nghiệm tại Helipad. Quý khách muốn tìm hiểu chi tiết về mẫu máy bay nào?`;
}

export function initChatbot(): void {
  const triggerBtn = document.getElementById('chatTriggerBtn');
  const chatWindow = document.getElementById('chatWidgetWindow');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const sendBtn = document.getElementById('sendChatBtn');
  const inputEl = document.getElementById('chatInput') as HTMLInputElement | null;
  const bodyContainer = document.getElementById('chatBodyContainer');
  const chips = document.querySelectorAll<HTMLButtonElement>('.chat-chip-btn');

  if (!triggerBtn || !chatWindow || !bodyContainer) return;

  function toggleChat(): void {
    const isOpen = chatWindow!.classList.toggle('is-open');
    if (isOpen) {
      logTelemetryEvent('click', 'Opened AI Flight Copilot');
      if (inputEl) inputEl.focus();
    }
  }

  triggerBtn.addEventListener('click', toggleChat);
  if (closeChatBtn) {
    closeChatBtn.addEventListener('click', () => {
      chatWindow!.classList.remove('is-open');
    });
  }

  function appendMessage(text: string, sender: 'user' | 'assistant'): void {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = text;
    bodyContainer!.appendChild(bubble);
    bodyContainer!.scrollTop = bodyContainer!.scrollHeight;
  }

  function handleSend(): void {
    if (!inputEl) return;
    const text = inputEl.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    inputEl.value = '';
    logTelemetryEvent('click', `Chat query: ${text.substring(0, 30)}`);

    // Simulate Co-Pilot thinking indicator
    const thinkingBubble = document.createElement('div');
    thinkingBubble.className = 'chat-bubble assistant';
    thinkingBubble.innerHTML = `<span style="font-family: var(--font-mono); color: var(--accent-cyan); font-size: 0.8125rem;">[AI CO-PILOT COMPUTING...]</span>`;
    bodyContainer!.appendChild(thinkingBubble);
    bodyContainer!.scrollTop = bodyContainer!.scrollHeight;

    setTimeout(() => {
      thinkingBubble.remove();
      const reply = getBotReply(text);
      appendMessage(reply, 'assistant');
    }, 450);
  }

  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }

  // Quick Chips
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query && inputEl) {
        inputEl.value = query;
        handleSend();
      }
    });
  });
}
