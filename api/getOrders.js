// api/getOrders.js
const fetch = require('node-fetch'); 

module.exports = async (req, res) => {
  const { 
    service_id,
    created_from = Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000),
    limit = "1000",
    offset = "0",
    sort = "date-desc"
  } = req.query; 

  try {
    const url = new URL('https://mothersmm.com/adminapi/v2/orders');
    url.searchParams.append('order_status', 'completed');
    url.searchParams.append('created_from', created_from);
    url.searchParams.append('limit', limit);
    url.searchParams.append('offset', offset);
    url.searchParams.append('sort', sort);

    const apiRes = await fetch(url.toString(), {
      headers: { 'X-Api-Key': process.env.API_KEY }
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      throw new Error(`greatfollows API Error ${apiRes.status}: ${text}`);
    }

    const data = await apiRes.json();
    let list = data.data?.list || [];

    if (service_id) {
      const targetId = String(service_id).trim();
      list = list.filter(order => {
        return String(order.service_id).trim() === targetId;
      });
    }

    const response = {
      ...data,
      data: {
        ...data.data,
        list,
        count: list.length
      }
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(response);
  } catch (err) {
    console.error('[getOrders] Error:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: err.message });
  }
};
