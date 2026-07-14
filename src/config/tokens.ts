export interface Token {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
}

export const USDC: Token = {
  address: '0x3600000000000000000000000000000000000000',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  logo: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
};

export const EURC: Token = {
  address: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a',
  symbol: 'EURC',
  name: 'Euro Coin',
  decimals: 6,
  logo: 'https://assets.coingecko.com/coins/images/26045/small/euro-coin.png',
};

export const TOKENS = {
  USDC,
  EURC,
};
