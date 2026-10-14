export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body || {};
  return res.status(200).json({
    reply: `Helicorp Flight Assistant: Hệ thống đã tiếp nhận câu hỏi "${prompt ? prompt.substring(0, 40) : ''}". Ban Điều Hành Bay sẵn sàng hỗ trợ 24/7.`,
    timestamp: new Date().toISOString(),
  });
}
