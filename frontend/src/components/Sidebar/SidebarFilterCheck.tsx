import { Checkbox } from "../ui/checkbox.js";

interface FilterCheckProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean | null) => void;
  collapsed: boolean;
}

export function FilterCheck({ label, name, checked, onChange, collapsed }: FilterCheckProps) {
  const checkboxId = `checkbox-${name}`;

  return (
    <label htmlFor={checkboxId} className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} py-1 cursor-pointer`}>
      <Checkbox id={checkboxId} checked={checked} onCheckedChange={(v: boolean) => onChange(v === true ? true : null)} />
      {!collapsed && <span className="ml-3 text-sm text-gray-700" >{label}</span>}
    </label>
  );
}