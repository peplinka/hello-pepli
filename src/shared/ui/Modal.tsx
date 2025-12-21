// src/components/Modal.tsx (или путь, где вы его храните, например, src/shared/ui/Modal.tsx)
import React from "react";

// Определяем тип пропсов
interface ModalProps {
  isOpen: boolean; // Открыт ли модал
  onClose: () => void; // Функция для закрытия модала
  children: React.ReactNode; // Содержимое модального окна
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✖️
        </button>
        {children}
      </div>
    </div>
  );
};

// Если вы хотите экспортировать по умолчанию, как в оригинальном файле:
// export default Modal;
