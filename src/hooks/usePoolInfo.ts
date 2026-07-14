import { useReadContract } from 'wagmi';
import { GRIPE_ADDRESS, GRIPE_ABI } from '../config/contract';
import { formatUnits } from 'viem';

export interface PoolInfo {
  totalSuppliedRaw: bigint;
  totalBorrowedRaw: bigint;
  totalCollateralRaw: bigint;
  availableLiquidityRaw: bigint;
  
  totalSupplied: number;
  totalBorrowed: number;
  totalCollateral: number;
  availableLiquidity: number;
  utilizationRate: number;
  supplyApy: number;
  borrowApy: number;
  
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePoolInfo(): PoolInfo {
  const { data, isPending, error, refetch } = useReadContract({
    address: GRIPE_ADDRESS,
    abi: GRIPE_ABI,
    functionName: 'getPoolInfo',
    query: {
      refetchInterval: 15000,
    },
  });

  // Default values
  let totalSuppliedRaw = 0n;
  let totalBorrowedRaw = 0n;
  let totalCollateralRaw = 0n;
  let availableLiquidityRaw = 0n;
  let supplyApy = 5.0; // Prompt specifies 5%
  let borrowApy = 8.0; // Prompt specifies 8%

  if (data && Array.isArray(data)) {
    totalSuppliedRaw = data[0] ?? 0n;
    totalBorrowedRaw = data[1] ?? 0n;
    totalCollateralRaw = data[2] ?? 0n;
    availableLiquidityRaw = data[3] ?? 0n;
    
    // Some contracts might return APYs or we use the specified constants
    // Let's use specified constants but allow contract to override if non-zero
    const parsedSupplyApy = data[4] ? Number(data[4]) / 100 : 5.0;
    const parsedBorrowApy = data[5] ? Number(data[5]) / 100 : 8.0;
    
    if (parsedSupplyApy > 0) supplyApy = parsedSupplyApy;
    if (parsedBorrowApy > 0) borrowApy = parsedBorrowApy;
  }

  // Calculate available liquidity if it's 0 or matches totalSupplied - totalBorrowed
  if (availableLiquidityRaw === 0n && totalSuppliedRaw > totalBorrowedRaw) {
    availableLiquidityRaw = totalSuppliedRaw - totalBorrowedRaw;
  }

  const totalSupplied = Number(formatUnits(totalSuppliedRaw, 6));
  const totalBorrowed = Number(formatUnits(totalBorrowedRaw, 6));
  const totalCollateral = Number(formatUnits(totalCollateralRaw, 6));
  const availableLiquidity = Number(formatUnits(availableLiquidityRaw, 6));

  const utilizationRate = totalSupplied > 0 ? (totalBorrowed / totalSupplied) * 100 : 0;

  return {
    totalSuppliedRaw,
    totalBorrowedRaw,
    totalCollateralRaw,
    availableLiquidityRaw,
    totalSupplied,
    totalBorrowed,
    totalCollateral,
    availableLiquidity,
    utilizationRate,
    supplyApy,
    borrowApy,
    isPending,
    error: error as Error | null,
    refetch,
  };
}
