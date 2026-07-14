import { useEffect, useState, useRef } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { GRIPE_ADDRESS, GRIPE_ABI, ERC20_ABI } from '../config/contract';
import { USDC, EURC } from '../config/tokens';
import { formatUnits } from 'viem';

export interface UserPosition {
  isConnected: boolean;
  userAddress: `0x${string}` | undefined;
  
  // Wallet balances
  usdcBalanceRaw: bigint;
  eurcBalanceRaw: bigint;
  usdcBalance: number;
  eurcBalance: number;
  
  // Allowances
  usdcAllowanceRaw: bigint;
  eurcAllowanceRaw: bigint;
  isUsdcApproved: boolean;
  isEurcApproved: boolean;
  
  // Contract position values
  suppliedRaw: bigint;
  collateralRaw: bigint;
  debtRaw: bigint;
  healthFactorRaw: bigint;
  maxBorrowableRaw: bigint;
  
  supplied: number;
  collateral: number;
  debt: number;
  healthFactor: number;
  maxBorrowable: number;
  
  // Live ticking values for continuous accrual UI
  liveSupplied: number;
  liveDebt: number;
  
  isPending: boolean;
  refetchAll: () => void;
}

export function useUserPosition(): UserPosition {
  const { address, isConnected } = useAccount();

  // 1. User Position
  const { data: positionData, isPending: isPositionPending, refetch: refetchPosition } = useReadContract({
    address: GRIPE_ADDRESS,
    abi: GRIPE_ABI,
    functionName: 'getUserPosition',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 15000,
    },
  });

  // 2. USDC Balance
  const { data: usdcBalanceRaw = 0n, isPending: isUsdcBalancePending, refetch: refetchUsdcBalance } = useReadContract({
    address: USDC.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 15000,
    },
  });

  // 3. EURC Balance
  const { data: eurcBalanceRaw = 0n, isPending: isEurcBalancePending, refetch: refetchEurcBalance } = useReadContract({
    address: EURC.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 15000,
    },
  });

  // 4. USDC Allowance
  const { data: usdcAllowanceRaw = 0n, isPending: isUsdcAllowancePending, refetch: refetchUsdcAllowance } = useReadContract({
    address: USDC.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, GRIPE_ADDRESS] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 15000,
    },
  });

  // 5. EURC Allowance
  const { data: eurcAllowanceRaw = 0n, isPending: isEurcAllowancePending, refetch: refetchEurcAllowance } = useReadContract({
    address: EURC.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, GRIPE_ADDRESS] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 15000,
    },
  });

  // Extract position details safely
  let suppliedRaw = 0n;
  let collateralRaw = 0n;
  let debtRaw = 0n;
  let healthFactorRaw = 0n;
  let maxBorrowableRaw = 0n;

  if (positionData && Array.isArray(positionData)) {
    suppliedRaw = positionData[0] ?? 0n;
    collateralRaw = positionData[1] ?? 0n;
    debtRaw = positionData[2] ?? 0n;
    healthFactorRaw = positionData[3] ?? 0n;
    // maxBorrowable is often the 5th parameter or can be computed as LTV * Collateral Value
    maxBorrowableRaw = positionData[4] ?? 0n;
  }

  // Format balances
  const usdcBalance = Number(formatUnits(usdcBalanceRaw, 6));
  const eurcBalance = Number(formatUnits(eurcBalanceRaw, 6));

  const supplied = Number(formatUnits(suppliedRaw, 6));
  const collateral = Number(formatUnits(collateralRaw, 6));
  const debt = Number(formatUnits(debtRaw, 6));
  
  // Health factor: if returned as 1e18, division by 1e18 gives decimal health factor
  // Max uint256 or extremely high values represents no debt (infinite health factor)
  const healthFactorLimit = 100000000000000000000000n; // arbitrary threshold
  const healthFactor = healthFactorRaw > healthFactorLimit 
    ? 999 
    : Number(formatUnits(healthFactorRaw, 18));

  // Compute Max Borrowable if returned 0:
  // EURC is priced roughly 1.08 USD. Max Borrowable = Collateral EURC * 1.08 * 0.70 LTV
  // If the contract returns something, let's use it, otherwise compute it:
  const computedMaxBorrowable = collateral * 1.08 * 0.70;
  const maxBorrowable = maxBorrowableRaw > 0n 
    ? Number(formatUnits(maxBorrowableRaw, 6)) 
    : computedMaxBorrowable;

  // Live Interest Accrual State
  const [liveSupplied, setLiveSupplied] = useState(supplied);
  const [liveDebt, setLiveDebt] = useState(debt);
  const lastUpdatedRef = useRef<number>(Date.now());

  useEffect(() => {
    // Reset to base values whenever base supplied or debt changes
    setLiveSupplied(supplied);
    setLiveDebt(debt);
    lastUpdatedRef.current = Date.now();
  }, [supplied, debt]);

  useEffect(() => {
    if (!isConnected || (supplied === 0 && debt === 0)) {
      return;
    }

    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - lastUpdatedRef.current) / 1000;
      
      // APY rates (per second)
      // 5% Supply APY: 0.05 / 31536000
      // 8% Borrow APY: 0.08 / 31536000
      const supplyIncrement = supplied * (0.05 * elapsedSeconds / 31536000);
      const debtIncrement = debt * (0.08 * elapsedSeconds / 31536000);

      setLiveSupplied(supplied + supplyIncrement);
      setLiveDebt(debt + debtIncrement);
    }, 100);

    return () => clearInterval(interval);
  }, [isConnected, supplied, debt]);

  // Approve checks (allowance > 0)
  // Usually approval is for a high amount, but we check if allowance is > 0.
  // Better yet, we can check if it's greater than some small threshold or amount to be deposited
  const isUsdcApproved = usdcAllowanceRaw > 0n;
  const isEurcApproved = eurcAllowanceRaw > 0n;

  const isPending = isPositionPending || isUsdcBalancePending || isEurcBalancePending || isUsdcAllowancePending || isEurcAllowancePending;

  const refetchAll = () => {
    refetchPosition();
    refetchUsdcBalance();
    refetchEurcBalance();
    refetchUsdcAllowance();
    refetchEurcAllowance();
  };

  return {
    isConnected,
    userAddress: address,
    usdcBalanceRaw,
    eurcBalanceRaw,
    usdcBalance,
    eurcBalance,
    usdcAllowanceRaw,
    eurcAllowanceRaw,
    isUsdcApproved,
    isEurcApproved,
    suppliedRaw,
    collateralRaw,
    debtRaw,
    healthFactorRaw,
    maxBorrowableRaw,
    supplied,
    collateral,
    debt,
    healthFactor,
    maxBorrowable,
    liveSupplied,
    liveDebt,
    isPending,
    refetchAll,
  };
}
