// Retired public rating endpoint: no stored feedback is exposed.
export default function handler(_req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(410).json({ error: 'Use the private feedback form on the portfolio.' });
}
