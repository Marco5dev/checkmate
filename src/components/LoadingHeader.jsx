const LoadingHeader = () => {
  return (
    <header className="navbar bg-base-100">
      <div className="flex-1">
        <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="flex-none gap-2">
        <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
      </div>
    </header>
  );
};

export default LoadingHeader;
