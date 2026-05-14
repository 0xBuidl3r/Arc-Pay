export interface ShareOptions {
  amount: string;
  recipient: string;
  txHash?: string;
  note?: string;
}

export interface CaptionStyle {
  premium: string;
  minimal: string;
  ecosystem: string;
}

function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function generatePremiumCaption(options: ShareOptions): string {
  const { amount, recipient, txHash, note } = options;
  const truncatedRecipient = formatAddress(recipient);
  
  const lines: string[] = [];

  lines.push(`Just paid ${amount} USDC on ARC`);
  lines.push('');

  if (note) {
    lines.push(`For: ${note}`);
    lines.push('');
  }

  lines.push(`to ${truncatedRecipient}`);

  if (txHash) {
    lines.push('');
    lines.push('Verified on ARC Explorer:');
    lines.push(`testnet.arcscan.app/tx/${txHash}`);
  }

  lines.push('');
  lines.push('Built with ARC Pay by @0x_Nomad__');
  lines.push('#ARC #USDC #StablecoinPayments');

  return lines.join('\n');
}

export function generateMinimalCaption(options: ShareOptions): string {
  const { amount, txHash } = options;
  
  const lines: string[] = [];
  lines.push(`Paid ${amount} USDC on ARC ⚡`);

  if (txHash) {
    lines.push(`testnet.arcscan.app/tx/${txHash}`);
  }

  lines.push('#ARC');
  return lines.join('\n');
}

export function generateEcosystemCaption(options: ShareOptions): string {
  const { amount, note, txHash } = options;
  
  const lines: string[] = [];
  lines.push(`Internet-native payments are here`);
  lines.push('');
  lines.push(`Just moved ${amount} USDC on @arccommunity`);
  
  if (note) {
    lines.push(`"${note}"`);
  }
  
  lines.push('');
  lines.push('Stablecoin payments, made simple.');
  
  if (txHash) {
    lines.push(`tx: testnet.arcscan.app/tx/${txHash}`);
  }
  
  lines.push('');
  lines.push('Built with ARC Pay by @0x_Nomad__');
  lines.push('#ARC #USDC #Payments');

  return lines.join('\n');
}

export function generateXIntentUrl(options: ShareOptions, style: 'premium' | 'minimal' | 'ecosystem' = 'premium'): string {
  let caption: string;
  
  switch (style) {
    case 'minimal':
      caption = generateMinimalCaption(options);
      break;
    case 'ecosystem':
      caption = generateEcosystemCaption(options);
      break;
    default:
      caption = generatePremiumCaption(options);
  }
  
  const tweetText = encodeURIComponent(caption);
  return `https://twitter.com/intent/tweet?text=${tweetText}`;
}

export function openXShare(options: ShareOptions, style: 'premium' | 'minimal' | 'ecosystem' = 'premium'): void {
  const url = generateXIntentUrl(options, style);
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
}

export function copyCaptionToClipboard(options: ShareOptions, style: 'premium' | 'minimal' | 'ecosystem' = 'premium'): Promise<boolean> {
  let caption: string;
  
  switch (style) {
    case 'minimal':
      caption = generateMinimalCaption(options);
      break;
    case 'ecosystem':
      caption = generateEcosystemCaption(options);
      break;
    default:
      caption = generatePremiumCaption(options);
  }
  
  return navigator.clipboard.writeText(caption).then(() => true).catch(() => false);
}

export function getExplorerUrl(txHash: string): string {
  return `https://testnet.arcscan.app/tx/${txHash}`;
}

export function getARCPayUrl(paymentId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/pay/${paymentId}`;
  }
  return `https://arcpay.xyz/pay/${paymentId}`;
}