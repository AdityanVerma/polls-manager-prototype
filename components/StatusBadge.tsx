import Badge from "@/components/Badge";
import type { Poll } from "@/types/poll";

interface StatusBadgeProps {
  status: Poll["status"];
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge color={status === "published" ? "emerald" : "zinc"} dot>
      {status === "published" ? "Published" : "Draft"}
    </Badge>
  );
}
