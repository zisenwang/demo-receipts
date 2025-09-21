import { renderToBuffer } from '@react-pdf/renderer';
import { ReceiptPDF } from '@/components/pdf/ReceiptPDF';
import { CartItem } from '@/types/product';

export interface ReceiptData {
  items: CartItem[];
  total: number;
  orderId: string;
  timestamp: Date;
}

export async function generateReceiptPDF(data: ReceiptData): Promise<Buffer> {
  const pdfBuffer = await renderToBuffer(
    ReceiptPDF(data)
  );
  return pdfBuffer;
}