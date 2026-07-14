import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { GRIPE_ADDRESS, GRIPE_ABI, ERC20_ABI } from '../config/contract';
import { USDC, EURC } from '../config/tokens';
import { parseUnits } from 'viem';

export function useBorrow() {
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<'idle' | 'approving' | 'submitting' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  const { isLoading: isTxPending } = useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      enabled: !!txHash,
    },
  });

  const reset = () => {
    setStatus('idle');
    setTxHash(undefined);
    setErrorMsg(null);
    setCurrentStep('');
  };

  // 1. Add EURC Collateral Flow
  const addCollateral = async (amountStr: string, currentAllowance: bigint) => {
    try {
      reset();
      const amount = parseUnits(amountStr, EURC.decimals);
      
      // Step 1: Approve EURC if needed
      if (currentAllowance < amount) {
        setStatus('approving');
        setCurrentStep('Approving EURC spender...');
        const appTx = await writeContractAsync({
          address: EURC.address,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [GRIPE_ADDRESS, amount * 10n],
        } as any);
        
        setStatus('pending');
        setCurrentStep('Waiting for approval transaction confirmation...');
        setTxHash(appTx);
        // We will prompt the user to proceed with the next step or we can attempt to proceed.
      }
      
      // Step 2: Add Collateral
      setStatus('submitting');
      setCurrentStep('Confirming add collateral transaction in wallet...');
      const colTx = await writeContractAsync({
        address: GRIPE_ADDRESS,
        abi: GRIPE_ABI,
        functionName: 'addCollateral',
        args: [amount],
      } as any);
      
      setStatus('pending');
      setCurrentStep('Waiting for collateral transaction confirmation on Arc Testnet...');
      setTxHash(colTx);
      setStatus('success');
    } catch (err: any) {
      console.error('Add Collateral error:', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Transaction was rejected or failed.');
    }
  };

  // 2. Remove EURC Collateral Flow
  const removeCollateral = async (amountStr: string) => {
    try {
      reset();
      const amount = parseUnits(amountStr, EURC.decimals);
      
      setStatus('submitting');
      setCurrentStep('Confirming remove collateral transaction in wallet...');
      const remTx = await writeContractAsync({
        address: GRIPE_ADDRESS,
        abi: GRIPE_ABI,
        functionName: 'removeCollateral',
        args: [amount],
      } as any);
      
      setStatus('pending');
      setCurrentStep('Waiting for transaction confirmation on Arc Testnet...');
      setTxHash(remTx);
      setStatus('success');
    } catch (err: any) {
      console.error('Remove Collateral error:', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Transaction was rejected or failed.');
    }
  };

  // 3. Borrow USDC Flow
  const borrowUSDC = async (amountStr: string) => {
    try {
      reset();
      const amount = parseUnits(amountStr, USDC.decimals);
      
      setStatus('submitting');
      setCurrentStep('Confirming borrow transaction in wallet...');
      const borTx = await writeContractAsync({
        address: GRIPE_ADDRESS,
        abi: GRIPE_ABI,
        functionName: 'borrow',
        args: [amount],
      } as any);
      
      setStatus('pending');
      setCurrentStep('Waiting for borrow transaction confirmation on Arc Testnet...');
      setTxHash(borTx);
      setStatus('success');
    } catch (err: any) {
      console.error('Borrow error:', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Transaction was rejected or failed.');
    }
  };

  // 4. Repay USDC Flow (Approve USDC first if needed, then Repay)
  const repayUSDC = async (amountStr: string, currentAllowance: bigint) => {
    try {
      reset();
      const amount = parseUnits(amountStr, USDC.decimals);
      
      // Step 1: Approve USDC if needed
      if (currentAllowance < amount) {
        setStatus('approving');
        setCurrentStep('Approving USDC spender...');
        const appTx = await writeContractAsync({
          address: USDC.address,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [GRIPE_ADDRESS, amount * 10n],
        } as any);
        
        setStatus('pending');
        setCurrentStep('Waiting for approval transaction confirmation...');
        setTxHash(appTx);
      }
      
      // Step 2: Repay
      setStatus('submitting');
      setCurrentStep('Confirming repay transaction in wallet...');
      const repTx = await writeContractAsync({
        address: GRIPE_ADDRESS,
        abi: GRIPE_ABI,
        functionName: 'repay',
        args: [amount],
      } as any);
      
      setStatus('pending');
      setCurrentStep('Waiting for repay transaction confirmation on Arc Testnet...');
      setTxHash(repTx);
      setStatus('success');
    } catch (err: any) {
      console.error('Repay error:', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Transaction was rejected or failed.');
    }
  };

  return {
    addCollateral,
    removeCollateral,
    borrowUSDC,
    repayUSDC,
    status,
    setStatus,
    txHash,
    setTxHash,
    errorMsg,
    currentStep,
    reset,
  };
}
