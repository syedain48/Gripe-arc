import { parseAbi } from 'viem';

export const GRIPE_ADDRESS = '0x7F427188f241C0972819994F041782213FE2E89d' as const;

export const GRIPE_ABI = parseAbi([
  'function deposit(uint256 amount) external',
  'function withdraw(uint256 amount) external',
  'function getSupplyBalance(address user) external view returns (uint256)',
  'function addCollateral(uint256 amount) external',
  'function removeCollateral(uint256 amount) external',
  'function borrow(uint256 amount) external',
  'function repay(uint256 amount) external',
  'function getDebt(address user) external view returns (uint256)',
  'function getHealthFactor(address user) external view returns (uint256)',
  'function getPoolInfo() external view returns (uint256, uint256, uint256, uint256, uint256, uint256)',
  'function getUserPosition(address user) external view returns (uint256, uint256, uint256, uint256, uint256)',
  'function eurcCollateral(address) external view returns (uint256)',
  'function usdcDeposits(address) external view returns (uint256)',
]);

export const ERC20_ABI = parseAbi([
  'function balanceOf(address owner) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
]);
