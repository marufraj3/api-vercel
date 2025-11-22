// api/getOrderDetail.js
const fetch = require('node-fetch'); 

module.exports = async (req, res) => {
  const { id } = req.query; 

  if (!id) {
    return res.status(400).json({ error: 'Missing order ID' });
  }

  try {
    const apiRes = await fetch(`https://mothersmm.com/adminapi/v2/orders/${id}`, {
      headers: { 'X-Api-Key': process.env.API_KEY }
    });

    if (!apiRes.ok) {
      throw new Error(`Detail API Error: ${apiRes.status}`);
    }

    const data = await apiRes.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);
  } catch (err) {
    console.error('[getOrderDetail] Error:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: err.message });
  }
};
