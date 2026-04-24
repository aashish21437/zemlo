import fs from 'fs';
import path from 'path';

// Parse .env.local
const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
const keyMatch = envContent.match(/GOOGLE_MAPS_API_KEY=(.*)/);
const apiKey = keyMatch[1].trim();

async function test(name, url) {
  try {
    const res = await fetch(url + `&key=${apiKey}`);
    const data = await res.json();
    console.log(`[${name}] Status: ${data.status}, Routes: ${data.routes ? data.routes.length : 0}`);
  } catch(e) {
    console.log(`[${name}] Error:`, e.message);
  }
}

// Tommorow roughly this time (+1 day)
const ts = Math.floor(Date.now()/1000) + 86400;

const u1 = `https://maps.googleapis.com/maps/api/directions/json?origin=Tokyo&destination=Kyoto&mode=transit`;
const u2 = `https://maps.googleapis.com/maps/api/directions/json?origin=Tokyo+Station,+Japan&destination=Kyoto+Station,+Japan&mode=transit`;
const u3 = `https://maps.googleapis.com/maps/api/directions/json?origin=Tokyo+Station&destination=Kyoto+Station&mode=transit&departure_time=${ts}`;

(async () => {
  await test('Basic Tokyo -> Kyoto', u1);
  await test('Tokyo Station -> Kyoto Station', u2);
  await test('With Departure Time', u3);
})();
