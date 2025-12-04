import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();

  return <div className="space-y-6 m-5">{t("dashboard.placeholder")}</div>;
}
