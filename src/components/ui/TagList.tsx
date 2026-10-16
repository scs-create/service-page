type TagListProps = {
  items: string[];
};

// Flat, simple tag list (Module 9: Industries Served).
// Deliberately no card styling, no icons — content doesn't warrant it.
export default function TagList({ items }: TagListProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="text-sm text-text bg-surface border border-border rounded-sm px-3 py-1.5"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
