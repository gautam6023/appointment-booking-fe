import { X } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

interface GuestEmailInputProps {
  value: string;
  error: string;
  onUpdate: (value: string) => void;
  onRemove: () => void;
  onBlur: () => void;
}

export default function GuestEmailInput({ value, error, onUpdate, onRemove, onBlur }: GuestEmailInputProps) {
  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onUpdate(e.target.value)}
          onBlur={onBlur}
          placeholder="guest@example.com"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-destructive hover:text-destructive shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

