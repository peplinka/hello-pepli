import React from "react";
import { useTheme } from "../../../shared/ui/providers/theme/hooks/useTheme"; // ✅ Обновленный путь

export const ContactsPage: React.FC = () => {
  const { theme } = useTheme(); // ✅ используем theme

  return (
    <div className={theme === "dark" ? "dark" : "light"}>
      <div className="container">
        <h1>📞 Контакты</h1>
        <h3>
          Адрес: ул. Правды, 13А, посёлок Дербышки, Советский район, Казань
        </h3>
        <h3>Телефон: +7 (495) 123-45-67</h3>
      </div>
    </div>
  );
};
