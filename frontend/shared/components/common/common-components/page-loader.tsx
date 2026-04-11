// page-loader.tsx inside common //
import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
