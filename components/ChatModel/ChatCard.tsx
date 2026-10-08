"use client";

import { useState } from "react";

import Image from "next/image";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { siteConfig } from "@/lib/site";

import ChatModal from "./ChatModal";

const ChatCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileTap={{ scale: 0.93 }}
        className="border-line hover:bg-surface-subtle bg-surface-panel relative flex size-12 cursor-pointer items-center justify-center rounded-full border-2 shadow-md transition-all duration-200 active:scale-95"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
              transition={{ duration: 0.18 }}
              className="text-content-muted flex items-center justify-center"
            >
              <X size={18} strokeWidth={2} />
            </motion.span>
          ) : (
            <motion.span
              key="logo"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center justify-center"
            >
              <Image
                src={siteConfig.profileImage}
                alt={`Chat with ${siteConfig.name}'s AI`}
                width={28}
                height={28}
                className="rounded-full"
              />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread dot — shown only when modal is closed */}
        {!isOpen && (
          <span className="bg-success ring-surface-panel absolute -top-0.5 -right-0.5 size-2.5 rounded-full shadow-[0_0_6px_var(--success)] ring-2" />
        )}
      </motion.button>
    </>
  );
};

export default ChatCard;
