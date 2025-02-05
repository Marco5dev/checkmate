export default function LoadingAvatar({ size = "md" }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-28 h-28"
  };

  return (
    <div className={`skeleton rounded-full ${sizes[size]}`}></div>
  );
}
