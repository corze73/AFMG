import apiClient from '../lib/api';

/**
 * Comprehensive API configuration checker
 * Run this to verify your API setup is correct
 */
export const checkApiSetup = async () => {
  console.log('🔍 Checking API configuration...');
  
  // Check if client exists
  if (!apiClient) {
    console.error('❌ API client not initialized');
    return false;
  }

  try {
    // Test API connection and health
    console.log('📊 Testing API connection...');
    const healthData = await apiClient.healthCheck();
    
    if (!healthData.database) {
      console.error('❌ Database connection failed');
      return false;
    }
    console.log('✅ Database connection successful');

    if (!healthData.auth) {
      console.error('❌ Authentication system check failed');
      return false;
    }
    console.log('✅ Authentication system working');

    console.log('🎉 All API checks passed!');
    return true;

  } catch (error) {
    console.error('❌ API setup check failed:', error);
    return false;
  }
};

// Auto-run check in development
if ((import.meta as any).env.DEV) {
  checkApiSetup();
}