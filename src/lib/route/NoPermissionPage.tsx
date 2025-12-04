import { Link } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

const NoPermissionPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 p-4">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
        <ShieldX className="h-12 w-12 text-red-600" />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Go to Home</Link>
      </Button>
    </div>
  );
};

export default NoPermissionPage;
