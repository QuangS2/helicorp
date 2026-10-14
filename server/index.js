import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust boundary middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// In-memory data stores
const leadsStore = [];
const telemetryEventsStore = [];

/* ==========================================================================
   HEALTH CHECK ENDPOINT
   ========================================================================== */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Helicorp Aerospace Engine API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================================================
   LEAD & FLIGHT TEST BOOKING WEBHOOK API
   ========================================================================== */
app.post('/api/newsletter', (req, res) => {
  const { fullName, email, phone, interestedCategory, flightExperienceDate, notes } = req.body;

  // Server-side validation (Trust Boundary Hard Rule)
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_NAME',
      message: 'Họ và tên bắt buộc và phải có tối thiểu 2 ký tự.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_EMAIL',
      message: 'Địa chỉ email không hợp lệ.',
    });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 9) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_PHONE',
      message: 'Số điện thoại liên lạc không hợp lệ.',
    });
  }

  const trackingId = `HC-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;
  const leadEntry = {
    trackingId,
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    interestedCategory: interestedCategory || 'all',
    flightExperienceDate: flightExperienceDate || null,
    notes: notes ? notes.trim() : '',
    ipAddress: req.ip,
    receivedAt: new Date().toISOString(),
  };

  leadsStore.push(leadEntry);
  console.log(`[Helicorp Backend Webhook] New lead received: ${trackingId} for ${leadEntry.fullName} (${leadEntry.email})`);

  return res.status(201).json({
    success: true,
    trackingId,
    message: 'Yêu cầu của quý khách đã được chuyển tiếp đến Ban Điều hành Bay thành công!',
    lead: {
      trackingId,
      fullName: leadEntry.fullName,
      email: leadEntry.email,
    },
    timestamp: leadEntry.receivedAt,
  });
});

/* ==========================================================================
   TELEMETRY EVENT TRACKING API
   ========================================================================== */
app.post('/api/telemetry', (req, res) => {
  const event = req.body;
  if (event && event.type) {
    telemetryEventsStore.push({
      ...event,
      serverReceivedAt: new Date().toISOString(),
    });
    if (telemetryEventsStore.length > 500) {
      telemetryEventsStore.shift();
    }
  }
  return res.status(200).json({ success: true, storedEventsCount: telemetryEventsStore.length });
});

app.get('/api/telemetry/stats', (req, res) => {
  const stats = {
    totalEvents: telemetryEventsStore.length,
    clicks: telemetryEventsStore.filter((e) => e.type === 'click').length,
    scrolls: telemetryEventsStore.filter((e) => e.type === 'scroll').length,
    formSubmissions: telemetryEventsStore.filter((e) => e.type === 'form_submit').length,
    leadsCount: leadsStore.length,
  };
  res.json(stats);
});

/* ==========================================================================
   AI COPILOT CHATBOT BACKEND ENDPOINT
   ========================================================================== */
app.post('/api/chat', (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  // Knowledge response
  res.json({
    reply: `Helicorp Flight Assistant: Hệ thống đã tiếp nhận câu hỏi của quý khách về "${prompt.substring(0, 50)}". Đội ngũ tư vấn kỹ thuật bay sẵn sàng phục vụ 24/7.`,
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend build in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Helicorp Aerospace Server] Listening on port ${PORT} (http://localhost:${PORT})`);
});
