const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const env = dotenv.parse(fs.readFileSync(path.resolve('.env.local')));
const body = {
  items: [
    {
      id: 'test-id',
      title: 'Test',
      quantity: 1,
      unit_price: 1000,
      currency_id: 'ARS',
    },
  ],
  back_urls: {
    success: 'http://localhost:3000/pago/exito',
    failure: 'http://localhost:3000/pago/error',
    pending: 'http://localhost:3000/pago/pendiente',
  },
  auto_return: 'approved',
  statement_descriptor: 'TIENDA NBA',
};
(async () => {
  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    console.log('status', response.status);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(err);
  }
})();
