// Hotel Shri Amarnath Lodge — Price API Worker
// Cloudflare Worker + KV

const DEFAULT_PRICES = {
  double: { price:2500, mrp:2500, discount:0, bfst:170, extra:500, gst:5 },
  triple: { price:2999, mrp:2999, discount:0, bfst:170, extra:500, gst:5 },
  four:   { price:3499, mrp:3499, discount:0, bfst:170, extra:500, gst:5 },
  family: { price:3999, mrp:3999, discount:0, bfst:170, extra:500, gst:5 },
  common: { bfst:170, extra:500, gst:5, bookingOpen:true, breakfastVisible:true, couplesWelcome:true }
};

const CORS = {
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type,x-admin-pin',
  'Content-Type':'application/json'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS')
      return new Response(null, { status:204, headers:CORS });

    // GET /prices — website fetch karti hai (public, no PIN needed)
    if (url.pathname === '/prices' && request.method === 'GET') {
      const data = await env.HOTEL_KV.get('prices','json');
      return new Response(JSON.stringify(data || DEFAULT_PRICES), { headers:CORS });
    }

    // POST /verify-pin — admin login verify (PIN Worker se match hoga)
    if (url.pathname === '/verify-pin' && request.method === 'POST') {
      const pin = request.headers.get('x-admin-pin');
      if (!pin || pin !== env.ADMIN_PIN)
        return new Response(JSON.stringify({ok:false, error:'PIN galat hai'}), { status:401, headers:CORS });
      return new Response(JSON.stringify({ok:true}), { headers:CORS });
    }

    // POST /prices — admin panel save karta hai (PIN protected)
    if (url.pathname === '/prices' && request.method === 'POST') {
      const pin = request.headers.get('x-admin-pin');
      if (!pin || pin !== env.ADMIN_PIN)
        return new Response(JSON.stringify({error:'Unauthorized'}), { status:401, headers:CORS });
      const body = await request.json();
      await env.HOTEL_KV.put('prices', JSON.stringify(body));
      return new Response(JSON.stringify({ok:true}), { headers:CORS });
    }

    // GET /health — connection test
    if (url.pathname === '/health')
      return new Response(JSON.stringify({status:'ok',hotel:'Hotel Shri Amarnath Lodge'}), { headers:CORS });

    return new Response(JSON.stringify({error:'Not found'}), { status:404, headers:CORS });
  }
};
