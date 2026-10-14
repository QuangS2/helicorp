export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fullName, email, phone, interestedCategory, flightExperienceDate, notes } = req.body || {};

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

  return res.status(201).json({
    success: true,
    trackingId,
    message: 'Yêu cầu của quý khách đã được chuyển tiếp đến Ban Điều hành Bay thành công!',
    submittedAt: new Date().toISOString(),
  });
}
