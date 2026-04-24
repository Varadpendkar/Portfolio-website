import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiExternalLink, FiMessageSquare, FiSend, FiX } from "react-icons/fi";

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const STARTER_PROMPTS = [
  "Which project best showcases MLOps skills?",
  "Summarize AI-MEDPAY in 5 bullet points.",
  "What are Varad's strongest NLP capabilities?",
  "How can I contact Varad for opportunities?",
];

const INITIAL_MESSAGE = {
  id: makeId(),
  role: "assistant",
  content:
    "Hi, I’m Varad AI Copilot ✦ Ask me anything about projects, skills, certifications, or contact details.",
  citations: [],
};

const PortfolioCopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const scrollerRef = useRef(null);

  const canSend = input.trim().length > 0 && !isSending;

  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, isOpen]);

  const chatPayload = useMemo(
    () =>
      messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    [messages],
  );

  const sendQuestion = async (rawText) => {
    const text = rawText.trim();
    if (!text || isSending) return;

    const userMessage = {
      id: makeId(),
      role: "user",
      content: text,
      citations: [],
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...chatPayload, { role: "user", content: text }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
          errorBody?.detail || errorBody?.error || "Unknown chat error",
        );
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content:
            data?.answer || "I couldn't find a reliable answer right now.",
          citations: Array.isArray(data?.citations) ? data.citations : [],
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content:
            "I couldn’t reach the portfolio AI backend right now. Please try again in a moment.",
          citations: [],
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await sendQuestion(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[1100] md:bottom-8 md:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[min(92vw,410px)] overflow-hidden rounded-2xl border border-white/15 bg-[#071426]/95 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="font-heading text-sm tracking-wide text-accent">
                  VARAD AI COPILOT
                </p>
                <p className="text-xs text-white/55">
                  Grounded portfolio Q&A with citations
                </p>
              </div>
              <button
                type="button"
                className="rounded-md border border-white/15 p-1.5 text-white/70 transition hover:text-white"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI copilot"
              >
                <FiX />
              </button>
            </div>

            <div
              ref={scrollerRef}
              className="max-h-[58vh] space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-xl border px-3 py-2 ${
                    message.role === "user"
                      ? "ml-8 border-accent/25 bg-accent/10"
                      : "mr-8 border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className="mb-1 text-[11px] font-heading uppercase tracking-wide text-white/45">
                    {message.role === "user" ? "You" : "Copilot"}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                    {message.content}
                  </p>

                  {message.role === "assistant" &&
                    message.citations?.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        <p className="text-[11px] text-white/45">Sources</p>
                        {message.citations.map((citation) => (
                          <a
                            key={`${message.id}-${citation.label}`}
                            href={citation.url || "#"}
                            target={citation.url ? "_blank" : "_self"}
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-accent/90 hover:text-accent"
                          >
                            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/65">
                              {citation.label}
                            </span>
                            <span className="truncate">{citation.title}</span>
                            {citation.url && (
                              <FiExternalLink className="shrink-0" />
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {isSending && (
                <div className="mr-8 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/70">
                  Thinking about your portfolio question...
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className="border-t border-white/10 px-4 py-3">
                <p className="mb-2 text-[11px] uppercase tracking-wide text-white/45">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendQuestion(prompt)}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 transition hover:border-accent/60 hover:text-accent"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about projects, skills, or experience..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/80 text-[#041320] transition disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Send message"
                >
                  <FiSend size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-accent/45 bg-[#061323] px-4 py-2 text-sm font-medium text-accent shadow-[0_8px_24px_rgba(0,217,255,0.25)]"
      >
        <FiMessageSquare />
        {isOpen ? "Close Copilot" : "Ask AI Copilot"}
      </motion.button>
    </div>
  );
};

export default PortfolioCopilot;
