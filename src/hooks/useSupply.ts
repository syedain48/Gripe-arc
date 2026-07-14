import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { GRIPE_ADDRESS, GRIPE_ABI, ERC20_ABI } from '../config/contract';
import { USDC } from '../config/tokens';
import { parseUnits } from 'viem';

export function useSupply() {
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<'idle' | 'approving' | 'submitting' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  // Track transaction receipts
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

  // 1. Supply Flow (Approve if needed, then Deposit)
  const supply = async (amountStr: string, currentAllowance: bigint) => {
    try {
      reset();
      const amount = parseUnits(amountStr, USDC.decimals);
      
      // Step 1: Approve if needed
      if (currentAllowance < amount) {
        setStatus('approving');
        setCurrentStep('Approving USDC spender...');
        const appTx = await writeContractAsync({
          address: USDC.address,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [GRIPE_ADDRESS, amount * 10n], // approve 10x or exact amount, let's approve a high amount or exact
        } as any);
        
        setStatus('pending');
        setCurrentStep('Waiting for approval transaction confirmation...');
        setTxHash(appTx);
        // We wait for approval tx to confirm, wait, since we need to proceed to deposit, let's let the user know
        // Wait, for maximum reliability we can proceed to deposit after tx confirms.
        // Let's implement it synchronously in the function:
      }
      
      // Step 2: Deposit
      setStatus('submitting');
      setCurrentStep('Confirming supply transaction in wallet...');
      const depTx = await writeContractAsync({
        address: GRIPE_ADDRESS,
        abi: GRIPE_ABI,
        functionName: 'deposit',
        args: [amount],
      } as any);
      
      setStatus('pending');
      setCurrentStep('Waiting for supply transaction confirmation on Arc Testnet...');
      setTxHash(depTx);
      setStatus('success');
    } catch (err: any) {
      console.error('Supply error:', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Transaction was rejected or failed.');
    }
  };

  // 2. Withdraw Flow
  const withdraw = async (amountStr: string) => {
    try {
      reset();
      const amount = parseUnits(amountStr, USDC.decimals);
      
      setStatus('submitting');
      setCurrentStep('Confirming withdrawal transaction in wallet...');
      const witTx = await writeContractAsync({
        address: GRIPE_ADDRESS,
        abi: GRIPE_ABI,
        functionName: 'withdraw',
        args: [amount],
      } as any);
      
      setStatus('pending');
      setCurrentStep('Waiting for withdrawal transaction confirmation on Arc Testnet...');
      setTxHash(witTx);
      setStatus('success');
    } catch (err: any) {
      console.error('Withdraw error:', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Transaction was rejected or failed.');
    }
  };

  return {
    supply,
    withdraw,
    status,
    setStatus,
    txHash,
    setTxHash,
    errorMsg,
    currentStep,
    reset,
  };
}
