import { redirect } from 'next/navigation';
import { verifyReceiptToken } from '@/lib/jwt';
import { generatePresignedUrl } from '@/lib/s3';

interface PageProps {
  params: {
    token: string;
  };
}

export default async function ReceiptRedirect({ params }: PageProps) {
  try {
    const { token } = params;

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
    const presignedUrl = await generatePresignedUrl(payload.s3Key);
    
    // Redirect to the presigned URL
    redirect(presignedUrl);

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
  }
}