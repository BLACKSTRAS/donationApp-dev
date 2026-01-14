"use client";

import React, { useEffect, useState } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "ยืนยันการทำรายการ",
  message,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  danger = false,
  onConfirm,
  onCancel,
}) => {
  const [visible, setVisible] = useState(open);

  // ให้ animation ปิดเล่นก่อน unmount
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-300 ease-out
        ${open ? "bg-black/60 opacity-100" : "bg-black/0 opacity-0"}
      `}
    >
      <div
        className={`
          w-full max-w-md rounded-xl bg-[#0f172a] shadow-xl p-6
          transform transition-all duration-300 ease-out
          ${
            open
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-95"
          }
        `}
      >
        {/* Title */}
        <div className="text-lg font-bold text-white mb-2">
          {title}
        </div>

        {/* Message */}
        <div className="text-sm text-gray-300 mb-6">
          {message}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-md text-sm font-medium
              bg-gray-700/60 text-white
              hover:bg-gray-600
              active:scale-95
              transition
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`
              px-4 py-2 rounded-md text-sm font-semibold
              transition active:scale-95
              ${
                danger
                  ? "bg-red-600 text-white hover:bg-red-500"
                  : "bg-green-600 text-white hover:bg-green-500"
              }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
