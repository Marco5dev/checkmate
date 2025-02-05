export default function LoadingTaskCard() {
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="flex items-center gap-4">
        <div className="skeleton w-6 h-6 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4"></div>
          <div className="skeleton h-3 w-1/4"></div>
        </div>
        <div className="flex gap-2">
          <div className="skeleton w-8 h-8 rounded-lg"></div>
          <div className="skeleton w-8 h-8 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
