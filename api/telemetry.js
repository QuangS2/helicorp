export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'telemetry_online' });
  }

  return res.status(200).json({
    success: true,
    receivedAt: new Date().toISOString(),
  });
}
