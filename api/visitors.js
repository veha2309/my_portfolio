export default function handler(_req, res) {
  return res.status(410).json({ error: 'Visitor tracking has been retired.' });
}
