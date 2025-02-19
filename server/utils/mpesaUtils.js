// utils/mpesaUtils.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// MPesa API URLs
// MPesa API URLs
const BASE_URL = process.env.MPESA_ENV === 'production' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke';

const AUTH_URL = `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;

const STK_PUSH_URL = `${BASE_URL}/mpesa/stkpush/v1/processrequest`;

// Get OAuth token
export const getAccessToken = async () => {
    try {
      // Ensure credentials are properly set
      if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
        throw new Error('M-Pesa credentials are not properly configured');
      }
  
      // Create Basic Auth token
      const auth = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
      ).toString('base64');
  
      // Make the request with proper error handling
      const response = await axios({
        method: 'GET',
        url: AUTH_URL,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        validateStatus: status => status < 500 // Don't throw on 4xx errors
      });
  
      // Handle potential error responses
      if (response.status !== 200) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }
  
      if (!response.data.access_token) {
        throw new Error('No access token received in response');
      }
  
      return response.data.access_token;
    } catch (error) {
      // Enhanced error logging
      console.error('M-Pesa authentication error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

// Initiate STK Push
export const initiateSTKPush = async (
  phoneNumber, // Format: 254XXXXXXXXX (without the + sign)
  amount,
  accountReference,
  transactionDesc
) => {
  try {
    // Get access token
    const accessToken = await getAccessToken();

    // Format phone number if it includes country code with + sign
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('+')) {
      formattedPhone = phoneNumber.substring(1);
    }
    
    // If number starts with 07 or 01, convert to Safaricom format
    if (phoneNumber.startsWith('07') || phoneNumber.startsWith('01')) {
      formattedPhone = `254${phoneNumber.substring(1)}`;
    }

    // Current timestamp in the format YYYYMMDDHHmmss
    const timestamp = new Date().toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);

    // Calculate password
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    // Request body
    const requestBody = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.MPESA_CALLBACK_URL}/api/mpesa/callback`,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    };

    // Make the request
    const response = await axios.post(STK_PUSH_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error initiating STK push:', error);
    throw error;
  }
};

// Check transaction status
export const checkTransactionStatus = async (checkoutRequestID) => {
  try {
    const accessToken = await getAccessToken();
    
    const timestamp = new Date().toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);
      
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');
    
    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
};