export function Button({ children, ...props }) {
  return <button className="bg-yellow-600 text-white px-4 py-2 rounded-xl" {...props}>{children}</button>;
}
