import React, { use } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
const RightSideBar = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <aside className="w-72 lg:w-80 p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="space-y-4 lg:space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 lg:p-4">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm lg:text-base">
             {t("overFlowBlog")}
          </h3>
          <ul className="space-y-2 text-xs lg:text-sm">
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">✏️</span>
              <span className="text-gray-700">{t("newEraSO")}</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">✏️</span>
              <span className="text-gray-700">
                {t("movieLanguageChangeTech")}
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded p-3 lg:p-4">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm lg:text-base">
            {t("featuredOnMeta")}
          </h3>
          <ul className="space-y-2 text-xs lg:text-sm">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">💬</span>
              <span className="text-gray-700">
                {t("resultCommunitySprint")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">💬</span>
              <span className="text-gray-700">
                {t("visualIdentity")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">📋</span>
              <span className="text-gray-700">
               {t("policyGenAIban")}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm lg:text-base">
            {t("customFilters")}
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent text-xs lg:text-sm"
          >
            {t("createCustomFilter")}
          </Button>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm lg:text-base">
            {t("watchedTags")}
          </h3>
          <div className="flex items-center justify-center py-6 lg:py-8">
            <div className="text-center">
              <Eye className="w-10 h-10 lg:w-12 lg:h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-xs lg:text-sm text-gray-500 mb-3">
                {t("watchTagsQues")}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent text-xs lg:text-sm"
              >
                👁️ {t("watchTag")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSideBar;
