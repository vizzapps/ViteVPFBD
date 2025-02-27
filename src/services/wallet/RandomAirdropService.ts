export interface AirdropConfig {
  minAmount: number;
  maxAmount: number;
  walletIds: string[];
}
export class RandomAirdropService {
  async execute(config: AirdropConfig): Promise<void> {
    try {
      if (config.minAmount >= config.maxAmount) {
        throw new Error('Minimum amount must be less than maximum amount');
      }
      if (config.minAmount <= 0 || config.maxAmount <= 0) {
        throw new Error('Amounts must be greater than 0');
      }
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Promise.resolve();
    } catch (error) {
      console.error('RandomAirdropService Error:', error);
      throw error;
    }
  }
}