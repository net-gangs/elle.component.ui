import type { PropsWithChildren } from "react";
import ProtectedRoute from "@/lib/route/ProtectedRoute";

const AxiosInterceptor: React.FC<PropsWithChildren<{ key?: string }>> = ({
  children,
}) => {
  // WIP LTPHO 
  // Interceptor logic is now in api-client.ts
  // This component just wraps children with ProtectedRoute for backward compatibility
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default AxiosInterceptor;
