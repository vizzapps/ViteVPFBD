interface ImportedWallet {
  address: string;
  privateKey: string;
}
export class ImportWalletsService {
  async execute(file: File): Promise<ImportedWallet[]> {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
          try {
            const csv = event.target?.result as string;
            const lines = csv.split('\n');
            const wallets: ImportedWallet[] = [];
            // Skip header row and process each line
            for (let i = 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (line) {
                const [address, privateKey] = line.split(',');
                if (address && privateKey) {
                  wallets.push({
                    address: address.trim(),
                    privateKey: privateKey.trim()
                  });
                }
              }
            }
            resolve(wallets);
          } catch (error) {
            reject(new Error('Failed to parse CSV file'));
          }
        };
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        reader.readAsText(file);
      });
    } catch (error) {
      console.error('ImportWalletsService Error:', error);
      throw error;
    }
  }
}