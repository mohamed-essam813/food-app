import { Alert } from 'react-native';
import { supabase } from './supabase';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';

const fetchPaymentSheetParams = async (amount: number) => {
  const { data, error } = await supabase.functions.invoke('payment-sheet', {
    body: { amount },
    headers: {"Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcWltaXBseXVwZ3p0cW5zemZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NDM4NDAsImV4cCI6MjA0NTUxOTg0MH0.FB7gM2cCpi7ZotjzZlx8APOF-ePJE3M6Zemi5Q4b7y4`}
  });
  if (data) {
    console.log(data);
    return data;
  }
  Alert.alert('Error fetching payment sheet params');
  return {};
};

export const initialisePaymentSheet = async (amount: number) => {
  console.log('Initialising payment sheet, for: ', amount);

  const { paymentIntent, publishableKey, customer, ephemeralKey } =
    await fetchPaymentSheetParams(amount);

  if (!paymentIntent || !publishableKey) return;

  const result = await initPaymentSheet({
    merchantDisplayName: 'notJust.dev',
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
    defaultBillingDetails: {
      name: 'Jane Doe',
    },
  });
  console.log(result);
};

export const openPaymentSheet = async () => {
  const { error } = await presentPaymentSheet();

  if (error) {
    Alert.alert(error.message);
    return false;
  }
  return true;
};
