"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
  isOpen: boolean;
}

export function Toast({ message, duration = 1500, onClose, isOpen }: ToastProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    timeoutRef.current = setTimeout(() => {
      onClose();
      timeoutRef.current = null;
    }, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 0, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 0, y: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-[99999]"
        >
          <div
            className="px-4 py-3 rounded-lg font-mono text-sm font-medium flex items-center gap-2"
            style={{
              backgroundColor: "var(--accent)",
              color: "#0A0A0A",
              boxShadow: "0 4px 12px rgba(91, 110, 232, 0.3)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
