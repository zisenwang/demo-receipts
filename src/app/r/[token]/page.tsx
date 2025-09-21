import { redirect } from 'next/navigation';
import { verifyReceiptToken, generatePresignedUrl, getTokenFromShortId } from '@/lib';

interface PageProps {
  params: {
    token: string;
  };
}

export default async function ReceiptRedirect({ params }: PageProps) {
  let presignedUrl = '/receipt-error';
  try {
    const { token: shortId } = await params;
    console.log('shortId', shortId);

    // Get JWT token from Redis
    const token = await getTokenFromShortId(shortId);
    if (!token) {
      // Token not found in Redis (expired or invalid)
      console.log('Token not found in Redis');
      return;
    }

    // Verify JWT token
    const payload = verifyReceiptToken(token);
    
    if (!payload) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Receipt</h1>
            <p className="text-gray-600">This receipt link is invalid or has expired.</p>
          </div>
        </div>
      );
    }

    // Generate presigned URL for S3 access
    presignedUrl = await generatePresignedUrl(payload.s3Key);

    console.log('presignedUrl', presignedUrl);

  } catch (error) {
    console.error('Error accessing receipt:', error);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Unable to access receipt. Please try again later.</p>
        </div>
      </div>
    );
  } finally {
    redirect(presignedUrl)
  }
}