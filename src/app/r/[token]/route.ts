import { NextRequest, NextResponse } from 'next/server';
import { verifyReceiptToken, getTokenFromShortId, getPDFStreamFromS3 } from '@/lib';

interface RouteParams {
  params: Promise<{
    token: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token: shortId } = await params;
    console.log('shortId', shortId);

    // Get JWT token from Redis
    const token = await getTokenFromShortId(shortId);
    if (!token) {
      console.log('Token not found in Redis');
      return NextResponse.redirect(new URL('/receipt-error', request.url));
    }

    // Verify JWT token
    const payload = verifyReceiptToken(token);
    if (!payload) {
      console.log('Invalid JWT token');
      return NextResponse.redirect(new URL('/receipt-error', request.url));
    }

    // Get PDF stream from S3
    const pdfStream = await getPDFStreamFromS3(payload.s3Key);

    // Return PDF stream with proper headers
    return new NextResponse(pdfStream as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="receipt.pdf"',
        'Cache-Control': 'private, max-age=0',
      },
    });

  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.redirect(new URL('/receipt-error', request.url));
  }
}