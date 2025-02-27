export interface WalletExportData {
  address: string;
  privateKey: string;
}
export class ExportWalletsService {
  async execute(wallets: WalletExportData[]): Promise<void> {
    try {
      if (wallets.length === 0) {
        throw new Error('No wallets selected for export');
      }
      // Create CSV content
      const csvContent = [
      // Header
      'PublicKey,PrivateKey',
      // Data rows
      ...wallets.map(wallet => `${wallet.address},${wallet.privateKey}`)].join('\n');
      // Create blob and download
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `wallets_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('ExportWalletsService Error:', error);
      throw error;
    }
  }
}