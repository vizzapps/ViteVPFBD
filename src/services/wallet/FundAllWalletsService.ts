export class FundAllWalletsService {
  async execute(walletIds: string[], amount: number): Promise<void> {
    try {
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Promise.resolve();
    } catch (error) {
      console.error('FundAllWalletsService Error:', error);
      throw error;
    }
  }
}