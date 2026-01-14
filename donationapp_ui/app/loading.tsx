export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>

        {/* Text */}
        <p className="text-white text-sm">กำลังโหลด...</p>
      </div>
    </div>
  );
}
