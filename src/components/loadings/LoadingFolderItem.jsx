export default function LoadingFolderItem() {
  return (
    <div className="flex items-center gap-2 p-2 bg-base-200 rounded">
      <div className="flex-1 flex items-center gap-2">
        <div className="skeleton w-4 h-4 rounded"></div>
        <div className="skeleton h-4 w-32"></div>
      </div>
      <div className="skeleton w-8 h-8 rounded-lg"></div>
    </div>
  );
}
