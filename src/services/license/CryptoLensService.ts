interface CryptoLensResponse {
  success: boolean;
  message: string;
  data?: {
    isValid: boolean;
    expiresAt: string;
    plan: string;
    features: string[];
  };
}
export class CryptoLensService {
  private readonly API_URL = 'https://api.cryptolens.io/api/key/';
  private readonly API_KEY = 'YOUR_CRYPTOLENS_API_KEY'; // Replace with your API key
  private readonly PRODUCT_ID = 'YOUR_PRODUCT_ID'; // Replace with your product ID
  async validateLicense(key: string): Promise<CryptoLensResponse> {
    try {
      const response = await fetch(`${this.API_URL}activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key,
          ProductId: this.PRODUCT_ID,
          Sign: true,
          SignMethod: 1,
          token: this.API_KEY
        })
      });
      if (!response.ok) {
        throw new Error('Failed to validate license');
      }
      const data = await response.json();
      // Parse CryptoLens response
      if (data.result === 0) {
        return {
          success: true,
          message: 'License validated successfully',
          data: {
            isValid: true,
            expiresAt: data.licenseKey?.expires || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            plan: data.licenseKey?.f1 || 'Premium',
            features: ['Unlimited Wallets', 'Priority Support', 'Advanced Tools']
          }
        };
      } else {
        return {
          success: false,
          message: data.message || 'Invalid license key'
        };
      }
    } catch (error) {
      console.error('CryptoLensService Error:', error);
      return {
        success: false,
        message: 'Failed to validate license'
      };
    }
  }
}