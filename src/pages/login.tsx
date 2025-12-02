import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">{t("login.title")}</h1>
        <Link to="/" className="bg-[#5b4c9c] text-white px-4 py-2 rounded">
          {t("login.submit")}
        </Link>
      </div>
    </div>
  );
}
