import { NextRequest, NextResponse } from 'next/server';
import { CartItem } from '@/types/product';
import { generateReceiptPDF, uploadPDFToS3, createReceiptToken } from '@/lib';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items }: { items: CartItem[] } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const orderId = uuidv4();
    const timestamp = new Date();
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Generate PDF
    const pdfBuffer = await generateReceiptPDF({
      items,
      total,
      orderId,
      timestamp
    });

    // Upload to S3
    const s3Key = await uploadPDFToS3(pdfBuffer, orderId, timestamp, total);

    // Create JWT token
    const token = createReceiptToken(orderId, s3Key, timestamp);

    // Create short URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const shortUrl = `${baseUrl}/r/${token}`;

    return NextResponse.json({
      success: true,
      shortUrl,
      orderId,
      total: total.toFixed(2),
      expiresIn: '24 hours'
    });

  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    );
  }
}