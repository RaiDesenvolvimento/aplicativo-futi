const PAYMENT_ORIGIN = 'https://arenalink.com.br/pay';

/** Chave PIX fictícia para demonstração (substitua por integração real). */
export const DEMO_PIX_KEY = '12.345.678/0001-90';

export function buildPaySlug(venueId: string, totalPaid: number): string {
  const raw = `${venueId}-${totalPaid}-${Date.now()}`;
  let h = 0;
  for (let i = 0; i < raw.length; i += 1) {
    h = (h << 5) - h + raw.charCodeAt(i);
    h |= 0;
  }
  const b = Math.abs(h).toString(36).slice(0, 5);
  return b.padEnd(5, '0');
}

export function paymentUrl(slug: string): string {
  return `${PAYMENT_ORIGIN}/${slug}`;
}

export function formatBrl(amount: number): string {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function perPlayerAmount(totalPaid: number, squadCount: number): number {
  if (squadCount <= 0) return totalPaid;
  return Math.round((totalPaid / squadCount) * 100) / 100;
}

export function buildWhatsappInviteText(params: {
  venueName: string;
  dateShort: string;
  timeRange: string;
  perPlayerFormatted: string;
  payUrl: string;
}): string {
  return (
    `Fala time! Quadra agendada na ${params.venueName} para o dia ${params.dateShort} às ${params.timeRange}. ` +
    `O valor por jogador é ${params.perPlayerFormatted}. Favor realizar o pagamento pelo link abaixo para confirmar sua vaga: ${params.payUrl}`
  );
}
