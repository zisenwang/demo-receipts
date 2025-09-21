import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

export const QRCodeDisplay = ({ 
  value, 
  size = 200, 
  title = "Scan QR Code",
  subtitle = "Scan this code to access your receipt",
  onClose
}: QRCodeDisplayProps) => {
  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center shadow-xl opacity-100">
          {/*<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>*/}
          {/*<h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>*/}
          {/*<p className="text-gray-600">Please wait while we process your request...</p>*/}
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4 text-sm">{subtitle}</p>

          <div className="flex justify-center mb-4">
              <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <QRCode
                      value={value}
                      size={size}
                      level="M"
                      // includeMargin={false}
                  />
              </div>
          </div>

          <div className="border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">Or copy the link:</p>
              <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 break-all">
                  {value}
              </div>
              <button
                  onClick={() => navigator.clipboard.writeText(value)}
                  className="mt-2 text-blue-500 hover:text-blue-700 text-xs font-medium"
              >
                  Copy Link
              </button>
          </div>

          <button
              onClick={onClose}
              className="block w-full bg-gray-200 text-gray-700 py-3 px-4 rounded font-semibold hover:bg-gray-300 transition-colors"
          >
              Close
          </button>
      </div>
  </div>

  );
};