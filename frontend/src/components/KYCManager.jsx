import React, { useState, useEffect } from 'react';
import HederaContractService from '../services/HederaContractService';
import { useHederaWallet } from '../context/HederaWalletContext';
import { Button, Card, Typography, Box, CircularProgress, Alert } from '@mui/material';

const KYCManager = () => {
  const { isConnected } = useHederaWallet();
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const contractService = HederaContractService.instance || new HederaContractService();

  const checkKYCStatus = async () => {
    if (!isConnected) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await contractService.checkKYCStatus();
      setKycStatus(result[1]); // The second value is the boolean status
    } catch (err) {
      console.error("Error checking KYC status:", err);
      setError("Failed to check KYC status");
    } finally {
      setLoading(false);
    }
  };

  const requestKYC = async () => {
    if (!isConnected) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // This would typically be an admin function
      // For testing, we're allowing self-granting
      await contractService.grantKYC(HederaContractService.accountId);
      setSuccess("KYC granted successfully!");
      // Refresh status
      await checkKYCStatus();
    } catch (err) {
      console.error("Error requesting KYC:", err);
      setError("Failed to request KYC. This may require admin privileges.");
    } finally {
      setLoading(false);
    }
  };

  const claimFromFaucet = async () => {
    if (!isConnected) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await contractService.faucet();
      setSuccess("Tokens claimed from faucet successfully!");
    } catch (err) {
      console.error("Error claiming from faucet:", err);
      setError("Failed to claim tokens. You may need KYC approval first.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      checkKYCStatus();
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">KYC & Token Management</Typography>
        <Alert severity="info">Please connect your wallet first</Alert>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>KYC & Token Management</Typography>
      
      {loading && <CircularProgress size={24} sx={{ mb: 2 }} />}
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" gutterBottom>
          KYC Status: {kycStatus === null ? 'Unknown' : kycStatus ? 'Approved' : 'Not Approved'}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={checkKYCStatus} 
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Refresh Status
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={requestKYC} 
          disabled={loading || kycStatus === true}
        >
          Request KYC Approval
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={claimFromFaucet} 
          disabled={loading || kycStatus !== true}
        >
          Claim Tokens from Faucet
        </Button>
      </Box>
    </Card>
  );
};

export default KYCManager;