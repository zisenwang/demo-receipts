interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = "Generating receipt..." }: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center shadow-xl opacity-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>
        <p className="text-gray-600">Please wait while we process your request...</p>
      </div>
    </div>
  );
};