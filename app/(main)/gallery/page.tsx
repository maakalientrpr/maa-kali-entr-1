export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-4">
          🚧 Under Development
        </h1>

        <p className="text-gray-700 text-lg mb-6">
          We’re working hard to build something amazing for you.  
          This page will be available soon!
        </p>

        <div className="animate-pulse">
          <div className="w-24 h-24 border-8 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto" />
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Thank you for your patience 🙏
        </p>
      </div>
    </div>
  );
}
