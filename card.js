export function Card({ children, className }) {
  return <div className={`bg-white shadow-lg ${className}`}>{children}</div>;
}
