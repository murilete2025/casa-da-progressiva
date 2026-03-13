// src/routes/payment.js
const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago');
const supabase = require('../db');

// POST /api/payment/link -> gera link de pagamento ou devolve URL COD
router.post('/link', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    // Busca itens do carrinho do usuário (JOIN using Supabase)
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select('quantity, products(*)')
      .eq('cart_id', userId); // Assumindo cart_id == userId para simplificar baseado no original

    if (error) throw error;
    if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: 'Cart empty' });

    // Format itens
    const items = cartItems.map(item => ({ ...item.products, quantity: item.quantity }));

    // Verifica se há algum item COD
    const codItem = items.find(i => i.payment_type === 'cod');
    if (codItem) {
      // devolve a URL de agendamento do primeiro item COD encontrado
      return res.json({ type: 'cod', url: codItem.cod_schedule_url || '' });
    }

    // Monta Preference para Mercado Pago
    const preferenceItems = items.map(i => ({
      title: i.name,
      description: i.description || i.name,
      quantity: i.quantity,
      currency_id: 'BRL',
      unit_price: Number(i.price),
    }));

    const preferenceData = {
      items: preferenceItems,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/checkout/success`,
        failure: `${process.env.FRONTEND_URL}/checkout/failure`,
        pending: `${process.env.FRONTEND_URL}/checkout/pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL}/api/webhook/mp`,
    };

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    const response = await preference.create({ body: preferenceData });
    res.json({ type: 'online', url: response.init_point });
  } catch (err) {
    console.error('Payment link error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Webhook para receber notificações de pagamento do Mercado Pago
router.post('/webhook/mp', async (req, res) => {
  const data = req.body;
  console.log('Mercado Pago webhook received:', data);
  res.sendStatus(200);
});

module.exports = router;
