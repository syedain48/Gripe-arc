import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { Chain } from 'viem';

export const arcTestnet: Chain = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'Arcscan', url: 'https://testnet.arcscan.app' },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'Gripe',
  projectId: '9d985672b13d5fbe5754688d4a05f7cf',
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http(),
  },
  ssr: false,
});
