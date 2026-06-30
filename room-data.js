// ══ SHARED ROOM DATA — used by hotel-latest.html (listing) AND room.html (detail page) ══
const WORKER_URL = 'https://hotel-prices-api.vijayweb2024.workers.dev';

const ROOMS = [
  {
    id:'double', type:'Super Deluxe Double Bed Room', ratingNum:4.7,
    mrp:0, discount:0, price:2500, breakfastPrice:170, extraR:500,
    basePersons:2,
    cap:'2 Adults · King Double Bed · Super Deluxe',
    ams:['❄️ AC','📶 WiFi','📺 Smart TV','🚿 Hot Water','🍳 Breakfast Option','🅿️ Parking'],
    hi:['Super deluxe king double bed','🍳 Breakfast available on request','💑 Couples Welcome — Valid ID required'],
    imgs:['double-1.jpg','double-2.jpg','double-3.jpg','double-4.jpg','double-5.jpg','double-6.jpg','double-7.jpg','double-8.jpg']
  },
  {
    id:'four', type:'Super Deluxe Four Bed Room', ratingNum:4.6,
    mrp:0, discount:0, price:3499, breakfastPrice:170, extraR:500,
    basePersons:4,
    cap:'4 Adults · 4 Beds · Super Deluxe',
    ams:['❄️ AC','📶 WiFi','📺 Smart TV','🚿 Hot Water','🛏️ 4 Beds','🅿️ Parking'],
    hi:['4 beds — ideal for groups & families','Spacious super deluxe room','💑 Couples Welcome — Valid ID required'],
    imgs:['fourbedroom-1.jpg','fourbedroom-2.jpg','fourbedroom-3.jpg','fourbedroom-4.jpg','fourbedroom-5.jpg','fourbedroom-6.jpg','fourbedroom-7.jpg']
  },
  {
    id:'triple', type:'Super Deluxe Triple Bed Room', ratingNum:4.6,
    mrp:0, discount:0, price:2999, breakfastPrice:170, extraR:500,
    basePersons:3,
    cap:'3 Adults · 3 Beds · Super Deluxe',
    ams:['❄️ AC','📶 WiFi','📺 Smart TV','🚿 Hot Water','🛏️ 3 Beds','🅿️ Parking'],
    hi:['3 beds — perfect for family or friends','🍳 Breakfast available on request','💑 Couples Welcome — Valid ID required'],
    imgs:['tripleroom-1.jpg','tripleroom-2.jpg','tripleroom-3.jpg','tripleroom-4.jpg','tripleroom-5.jpg','tripleroom-6.jpg','tripleroom-7.jpg']
  },
  {
    id:'family', type:'Family Suite — 2 Rooms 1 Set', ratingNum:4.8,
    mrp:0, discount:0, price:3999, breakfastPrice:170, extraR:500,
    basePersons:4,
    cap:'4 Adults · 2 Connecting Rooms',
    ams:['❄️ AC','📶 WiFi','📺 2 Smart TVs','🚿 Hot Water','🏠 2 Rooms','🅿️ Parking'],
    hi:['2 connecting rooms as 1 set','🍳 Breakfast available on request','💑 Couples Welcome — Valid ID required'],
    imgs:['familysuite-1.jpg','familysuite-2.jpg','familysuite-3.jpg','familysuite-4.jpg','familysuite-5.jpg','familysuite-6.jpg','familysuite-7.jpg']
  },
];

// Fetches live prices from the Cloudflare Worker and applies them onto ROOMS in place.
// Returns the raw live data (so callers can also check live.common.bookingOpen), or null if offline.
async function fetchLivePrices(){
  try{
    const res = await fetch(WORKER_URL+'/prices');
    if(!res.ok) return null;
    const live = await res.json();
    ROOMS.forEach(room=>{
      const d=live[room.id];
      if(!d) return;
      room.price          = d.price          || room.price;
      room.mrp             = d.mrp            || 0;
      room.discount        = d.discount       || 0;
      room.breakfastPrice  = d.bfst           || room.breakfastPrice;
      room.extraR          = d.extra          || room.extraR;
    });
    return live;
  }catch(e){
    console.log('Price worker offline — default prices active');
    return null;
  }
}
