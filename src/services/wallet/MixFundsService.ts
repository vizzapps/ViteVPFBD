export class MixFundsService {
  async execute(rounds: number): Promise<void> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, rounds * 500));
      return Promise.resolve();
    } catch (error) {
      console.error('MixFundsService Error:', error);
      throw error;
    }
  }
}