// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { stripe } from '../_utils/stripe.ts';
import { createOrRetrieveProfile } from '../_utils/supabase.ts';

serve(async (req: Request) => {
  try {
    const { amount } = await req.json();

    const customer = await createOrRetrieveProfile(req);

    // Create an ephermeralKey so that the Stripe SDK can fetch the customer's stored payment methods.
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: '2020-08-27' }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customer,
    });

    const res = {
      paymentIntent: paymentIntent.client_secret,
      publishableKey: Deno.env.get('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
      customer: customer,
      ephemeralKey: ephemeralKey.secret,
    };

    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

// To invoke:
// curl -i --request POST 'https://gdqimiplyupgztqnszfs.supabase.co/functions/v1/payment-sheet' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcWltaXBseXVwZ3p0cW5zemZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NDM4NDAsImV4cCI6MjA0NTUxOTg0MH0.FB7gM2cCpi7ZotjzZlx8APOF-ePJE3M6Zemi5Q4b7y4' \
//   --header 'Content-Type: application/json' \
//   --data '{"amount":1150}'
