import en_US from "./locales/en-US";
import i18n from "i18next";
import id_ID from "./locales/id-ID";
import { initReactI18next } from "react-i18next";
import th_TH from "./locales/th-TH";
import vi_VN from "./locales/vi-VN";
import zh_CN from "./locales/zh-CN";
import zh_TW from "./locales/zh-TW";

function removeEmptyKeys(obj) {
  // 遍歷所有屬性和子物件
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      // 如果是物件，遞迴調用此函數
      removeEmptyKeys(obj[key]);
    } else {
      // 如果值為空字符串，刪除該屬性
      if (obj[key] === "" || obj[key] === " ") {
        delete obj[key];
      } else if (typeof obj[key] === "string") {
        // 替換字符串中的 '\\n' 為 '\n'
        obj[key] = obj[key].replace(/\\n/g, "\n");
      }
    }
  });

  return obj;
}

export const locales = [
  { name: "bahasa Indonesia", key: "id-ID" },
  { name: "Tiếng Việt", key: "vi-VN" },
  { name: "English", key: "en-US" },
  { name: "簡體中文", key: "zh-CN" },
  { name: "繁體中文", key: "zh-TW" },
  { name: "แบบไทย", key: "th-TH" },
];

const resources = {
  "id-ID": {
    translation: removeEmptyKeys(id_ID),
  },
  "vi-VN": {
    translation: removeEmptyKeys(vi_VN),
  },
  "en-US": {
    translation: removeEmptyKeys(en_US),
  },
  "zh-TW": {
    translation: removeEmptyKeys(zh_TW),
  },
  "zh-CN": {
    translation: removeEmptyKeys(zh_CN),
  },
  "th-TH": {
    translation: removeEmptyKeys(th_TH),
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "zh-TW",
    fallbackLng: "zh-TW",
    saveMissing: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
