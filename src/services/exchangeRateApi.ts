import axios, { AxiosResponse } from 'axios';

const API_KEY = process.env.EXCHANGE_RATE_API_KEY || 'd2fc0a5d12e118e86cf0e4ff';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

interface ExchangeRateResponse {
  conversion_rates: { [key: string]: number };
}

export const getExchangeRate = async (
  baseCurrency: string, 
  targetCurrency: string
): Promise<number | null> => {
  try {
    const response: AxiosResponse<ExchangeRateResponse> = await axios.get(
      `${BASE_URL}/latest/${baseCurrency}`
    );

    if (response.status === 200 && response.data.conversion_rates) {
      const rates = response.data.conversion_rates;
      const rate = rates[targetCurrency];

      if (rate) {
        return rate;
      } else {
        console.warn(`Target currency ${targetCurrency} not found.`);
        return null;
      }
    } else {
      console.error('Unexpected response format:', response.data);
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Network error while fetching exchange rate:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};
