import { Link } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const NoPermissionPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 p-4">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
        <ShieldX className="h-12 w-12 text-red-600" />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("errors.accessDenied")}
        </h1>
        <p className="mt-2 text-gray-600">{t("errors.accessDeniedDesc")}</p>
      </div>
      <Button asChild>
        <Link to="/">{t("common.goHome", "Go to Home")}</Link>
      </Button>
    </div>
  );
};

export default NoPermissionPage;
