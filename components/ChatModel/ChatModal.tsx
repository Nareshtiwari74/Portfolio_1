"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { ArrowUp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { API_BASE_URL, siteConfig } from "@/lib/site";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTER_QUESTIONS = [
  "What is Naresh working on?",
  "What's his tech stack?",
  "How can I contact him?",
  "What are his best projects?",
];

const TYPE_INTERVAL_MS = 14;

/** Reveals `text` one character at a time, with a blinking caret while it runs. */
function Typewriter({
  text,
  onTick,
  onDone,
}: {
  text: string;
  onTick?: () => void;
  onDone?: () => void;
}) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRevealed((n) => {
        const next = n + 1;
        onTick?.();
        if (next >= text.length) {
          clearInterval(id);
          onDone?.();
        }
        return next;
      });
    }, TYPE_INTERVAL_MS);

    return () => clearInterval(id);
    // The callbacks are re-created every render; re-subscribing on them would
    // restart the interval and stall the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <>
      {text.slice(0, revealed)}
      {revealed < text.length && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[1px] animate-pulse rounded-sm bg-current opacity-70" />
      )}
    </>
  );
}

/**
 * A message body. Only the reply that just arrived types itself out; every
 * other message is settled text, so it renders directly with no timers.
 */
const MessageBody = ({
  text,
  animate,
  onTick,
  onDone,
}: {
  text: string;
  animate: boolean;
  onTick?: () => void;
  onDone?: () => void;
}) =>
  animate ? (
    <Typewriter text={text} onTick={onTick} onDone={onDone} />
  ) : (
    <>{text}</>
  );

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  // Tracks the id of the latest assistant message being typewritten
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    // A reply that was still typing when the panel closed should be settled
    // text on reopen rather than replaying from the first character.
    if (!isOpen) setAnimatingId(null);
  }

  useEffect(() => {
    if (!isOpen) return;
    const focusId = setTimeout(() => inputRef.current?.focus(), 300);
    const scrollId = setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "instant" }),
      50,
    );
    return () => {
      clearTimeout(focusId);
      clearTimeout(scrollId);
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!API_BASE_URL || !trimmed || isTyping || animatingId) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
    ]);
    setInput("");
    setIsTyping(true);
    setHasStarted(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/rag/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = await res.json();
      const answer =
        data?.answer ||
        data?.response ||
        "Sorry, I couldn't find an answer to that.";

      const newId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: newId, role: "assistant", content: answer },
      ]);
      setAnimatingId(newId);
    } catch {
      const newId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        {
          id: newId,
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
      setAnimatingId(newId);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!animatingId) sendMessage(input);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 16 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          style={{ transformOrigin: "bottom right" }}
          className="panel fixed right-5 bottom-20 z-50 flex h-[520px] max-h-[calc(100svh-6rem)] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl"
        >
          {/* Header */}
          <div className="border-line bg-surface-subtle flex shrink-0 items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative size-7 overflow-hidden rounded-full">
                <Image
                  src={siteConfig.profileImage}
                  alt={`${siteConfig.name} avatar`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-content text-sm leading-none font-semibold">
                  Ask Naresh
                </p>
                <p className="text-content-subtle mt-0.5 text-[11px] leading-none">
                  {API_BASE_URL
                    ? "AI · ask about my work"
                    : "AI · currently unavailable"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-content-subtle hover:bg-surface-raised hover:text-content-secondary flex size-7 items-center justify-center rounded-full transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {/* Welcome + chips */}
            {!hasStarted && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="bg-surface-strong text-content-secondary flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                    AI
                  </div>
                  <div className="border-line bg-surface-raised text-content-secondary rounded-2xl rounded-tl-sm border px-3.5 py-2.5 text-sm leading-relaxed">
                    {API_BASE_URL
                      ? "Ask me about the portfolio owner's work, projects, or background."
                      : "The portfolio assistant is currently unavailable. You can reach me by email."}
                  </div>
                </div>

                <div className="ml-8 flex flex-wrap gap-2">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      disabled={!API_BASE_URL}
                      onClick={() => sendMessage(q)}
                      className="border-line bg-surface-subtle text-content-muted hover:border-line-strong hover:bg-surface-raised hover:text-content-secondary rounded-full border px-3 py-1.5 text-xs transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Message list */}
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-2.5 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="bg-surface-strong text-content-secondary flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-surface-inverted text-content-inverted rounded-tr-sm"
                      : "border-line bg-surface-raised text-content-secondary rounded-tl-sm border"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <MessageBody
                      text={msg.content}
                      animate={msg.id === animatingId}
                      onTick={() =>
                        messagesEndRef.current?.scrollIntoView({
                          behavior: "smooth",
                        })
                      }
                      onDone={() => setAnimatingId(null)}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5"
              >
                <div className="bg-surface-strong text-content-secondary flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                  A
                </div>
                <div className="border-line bg-surface-raised flex items-center gap-1 rounded-2xl rounded-tl-sm border px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="bg-surface-strong block size-1.5 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        delay: i * 0.18,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-line bg-surface-subtle/80 shrink-0 border-t p-3">
            <div className="border-line focus-within:border-line-strong bg-surface-float flex items-end gap-2 rounded-xl border py-2 pr-2 pl-4 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask something…"
                disabled={!API_BASE_URL}
                rows={1}
                className="text-content placeholder:text-content-subtle flex-1 resize-none bg-transparent pb-1 text-sm leading-relaxed focus:outline-none"
                style={{
                  maxHeight: "96px",
                  overflowY: input.split("\n").length > 3 ? "auto" : "hidden",
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 96) + "px";
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={
                  !API_BASE_URL || !input.trim() || isTyping || !!animatingId
                }
                className="bg-surface-inverted shadow-chunky-sm hover:shadow-chunky-xs text-content-inverted flex size-7 shrink-0 items-center justify-center rounded-lg transition-all hover:translate-y-[1px] active:translate-y-[2px] active:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-25 disabled:shadow-none"
              >
                <ArrowUp size={14} strokeWidth={2.5} />
              </button>
            </div>
            <p className="text-content-subtle mt-2 text-center text-[10px]">
              AI can make mistakes · www.nareshdev.space
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
