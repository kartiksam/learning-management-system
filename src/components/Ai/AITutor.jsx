
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "./AITutor.css";
import { getToken } from "../../utils/auth";

const API_BASE_URL = "http://localhost:8080";
const STORAGE_PREFIX = "smartlearn-ai-chats";

const createChat = (id = crypto.randomUUID()) => ({
  id,
  title: "New chat",
  updatedAt: new Date().toISOString(),
  messages: [
    {
      role: "assistant",
      content:
        "Hi! I'm your SmartLearn Copilot. Ask me anything about this course, and let's learn together.",
    },
  ],
});

function loadChats(courseId) {
  try {
    const saved = localStorage.getItem(
      `${STORAGE_PREFIX}-${courseId}`
    );

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Could not load saved AI chats:", error);
  }

  return [createChat()];
}

export default function AITutor({ courseId, compact = false }) {
  const [initialChats] = useState(() => loadChats(courseId));

  const [chats, setChats] = useState(initialChats);

  const [conversationId, setConversationId] = useState(
    initialChats[0].id
  );

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(!compact);
  const [chatIdInput, setChatIdInput] = useState("");
  const [search, setSearch] = useState("");

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === conversationId),
    [chats, conversationId]
  );

  const messages = activeChat?.messages ?? [];

  // Save chats locally in this browser.
  useEffect(() => {
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}-${courseId}`,
        JSON.stringify(chats)
      );
    } catch (error) {
      console.error("Could not save AI chats:", error);
    }
  }, [chats, courseId]);

  // Restore the saved chat list when switching courses.
  useEffect(() => {
    const nextChats = loadChats(courseId);
    setChats(nextChats);
    setConversationId(nextChats[0].id);
    setInput("");
    setError("");
  }, [courseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const updateActiveChat = (updater) => {
    setChats((previous) =>
      previous.map((chat) =>
        chat.id === conversationId ? updater(chat) : chat
      )
    );
  };

  const startNewChat = () => {
    if (loading) return;

    const newChat = createChat();

    setChats((previous) => [newChat, ...previous]);
    setConversationId(newChat.id);
    setInput("");
    setError("");
  };

  const openChatById = (event) => {
    event.preventDefault();

    const id = chatIdInput.trim();
    if (!id || loading) return;

    const existingChat = chats.find((chat) => chat.id === id);

    if (existingChat) {
      setConversationId(existingChat.id);
    } else {
      // The ID can continue an existing backend conversation if its
      // memory still exists. Previous messages cannot be fetched yet.
      const newChat = createChat(id);
      newChat.title = "Opened conversation";

      setChats((previous) => [newChat, ...previous]);
      setConversationId(id);
    }

    setChatIdInput("");
    setInput("");
    setError("");
  };

  const sendMessage = async (event) => {
    event?.preventDefault();

    const question = input.trim();
    if (!question || loading || !conversationId) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    updateActiveChat((chat) => ({
      ...chat,
      title:
        chat.title === "New chat" ||
        chat.title === "Opened conversation"
          ? question.slice(0, 42)
          : chat.title,
      updatedAt: new Date().toISOString(),
      messages: [...chat.messages, userMessage],
    }));

    setInput("");
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      const response = await axios.post(
        `${API_BASE_URL}/api/ai/courses/${courseId}/chat`,
        {
          conversationId,
          message: question,
        },
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      const answer =
        response.data?.answer ?? "I couldn't generate a response.";
        const action = response.data?.action ?? "NONE";

      updateActiveChat((chat) => ({
        ...chat,
        updatedAt: new Date().toISOString(),
        messages: [
          ...chat.messages,
          {
            role: "assistant",
            content: answer,
            action,
            actionStatus: "PENDING",
          },
        ],
      }));
    } catch (err) {
      console.error("AI Tutor request failed:", err);

      setError(
        err.response?.status === 401
          ? "Your session may have expired. Please log in again."
          : err.response?.data?.message ||
              "Unable to connect to the AI Tutor. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  
const handleCourseAction = async (action, messageIndex) => {
  if (loading) return;

  setLoading(true);
  setError("");

  try {
    const token = getToken();

    if (!token) {
      throw new Error("Please log in to continue.");
    }

    if (action === "FREE_ENROLLMENT_CONFIRMATION") {
      await axios.post(
        `${API_BASE_URL}/api/enrollments/enroll/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      updateActiveChat((chat) => ({
        ...chat,
        messages: chat.messages.map((message, index) =>
          index === messageIndex
            ? { ...message, actionStatus: "COMPLETED" }
            : message
        ),
      }));
    } else if (action === "PAID_PURCHASE_CONFIRMATION") {
      const response = await axios.post(
        `${API_BASE_URL}/api/payment/create-checkout-session/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data?.url) {
        throw new Error("Checkout URL was not returned by the server.");
      }

      window.location.assign(response.data.url);
      return;
    }
  } catch (err) {
    setError(
      err.response?.data?.message ||
        err.message ||
        "Unable to complete the action. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  const deleteChat = (id, event) => {
    event.stopPropagation();
    if (loading) return;

    const remaining = chats.filter((chat) => chat.id !== id);

    if (remaining.length === 0) {
      const newChat = createChat();
      setChats([newChat]);
      setConversationId(newChat.id);
      return;
    }

    setChats(remaining);

    if (conversationId === id) {
      setConversationId(remaining[0].id);
    }
  };

  const filteredChats = chats.filter((chat) =>
    `${chat.title} ${chat.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <section
      className={`ai-workspace${compact ? " ai-workspace--compact" : ""}`}
    >
      {!compact && sidebarOpen && (
        <aside className="ai-sidebar">
          <div className="ai-sidebar-top">
            <div className="ai-brand">
              <div className="ai-brand-icon">✦</div>
              <div>
                <strong>SmartLearn</strong>
                <span>AI Tutor</span>
              </div>
            </div>

            <button
              className="ai-icon-button"
              onClick={() => setSidebarOpen(false)}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              ‹
            </button>
          </div>

          <button className="ai-new-chat" onClick={startNewChat}>
            <span>＋</span> New chat
            <span className="ai-shortcut">⌘ K</span>
          </button>

          <form className="ai-open-id" onSubmit={openChatById}>
            <label htmlFor="open-conversation-id">
              OPEN CHAT BY ID
            </label>
            <input
              id="open-conversation-id"
              value={chatIdInput}
              onChange={(event) => setChatIdInput(event.target.value)}
              placeholder="Paste conversation ID..."
            />
            <button type="submit" disabled={!chatIdInput.trim() || loading}>
              Open conversation
            </button>
          </form>

          <div className="ai-history-heading">
            <span>Recent chats</span>
            <span>{chats.length}</span>
          </div>

          <div className="ai-history-search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations"
              aria-label="Search conversations"
            />
          </div>

          <div className="ai-history-list">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                className={`ai-history-item ${
                  chat.id === conversationId ? "active" : ""
                }`}
                onClick={() => {
                  if (loading) return;
                  setConversationId(chat.id);
                  setError("");
                }}
                title={chat.id}
              >
                <span className="ai-history-icon">◷</span>
                <span className="ai-history-text">
                  <span className="ai-history-title">
                    {chat.title}
                  </span>
                  <span className="ai-history-id">
                    {chat.id}
                  </span>
                </span>
                <span
                  className="ai-delete-chat"
                  role="button"
                  tabIndex={0}
                  title="Remove chat from local history"
                  aria-label="Remove chat from local history"
                  onClick={(event) => deleteChat(chat.id, event)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      deleteChat(chat.id, event);
                    }
                  }}
                >
                  ×
                </span>
              </button>
            ))}

            {filteredChats.length === 0 && (
              <p className="ai-empty-history">No matching conversations.</p>
            )}
          </div>

          <div className="ai-sidebar-footer">
            <div className="ai-user-avatar">S</div>
            <div>
              <strong>Course workspace</strong>
              <span>Course ID: {courseId}</span>
            </div>
            <span className="ai-footer-status">●</span>
          </div>
        </aside>
      )}

      <main className="ai-main">
        <header className="ai-topbar">
          <div className="ai-topbar-left">
            {!compact && !sidebarOpen && (
              <button
                className="ai-icon-button"
                onClick={() => setSidebarOpen(true)}
                title="Open sidebar"
                aria-label="Open sidebar"
              >
                ☰
              </button>
            )}
            {!compact && <div className="ai-mobile-brand">✦</div>}
            <div className="ai-page-heading">
              <strong>{activeChat?.title || "Copilot"}</strong>
              <span>
                {compact ? "SmartLearn Copilot" : `Course ${courseId} · SmartLearn AI`}
              </span>
            </div>
          </div>

          <div className="ai-topbar-actions">
            {compact && (
              <button
                className="ai-id-button"
                title="New chat"
                onClick={startNewChat}
                disabled={loading}
              >
                <span>＋</span>
                <span>New</span>
              </button>
            )}
            <button
              className="ai-id-button"
              title="Copy conversation ID"
              onClick={() => {
                navigator.clipboard
                  .writeText(conversationId)
                  .catch(() =>
                    setError("Could not copy the conversation ID.")
                  );
              }}
            >
              <span className="ai-live-dot" />
              <span>{compact ? "ID" : "Copy chat ID"}</span>
              <span>↗</span>
            </button>
          </div>
        </header>

        <div className="ai-chat-messages">
          {messages.length <= 1 && (
            <div className="ai-welcome">
              <div className="ai-welcome-icon">✦</div>
              <span className="ai-eyebrow">YOUR PERSONAL LEARNING ASSISTANT</span>
              <h1>What are we learning <span>today?</span></h1>
              <p>
                Ask questions, explore concepts, or get help understanding
                your course materials.
              </p>

              <div className="ai-suggestions">
                {[
                  "Explain the key concepts in this course",
                  "Give me a simple Java example",
                  "Help me prepare for an exam",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      textareaRef.current?.focus();
                    }}
                  >
                    <span>✧</span>
                    {suggestion}
                    <span className="ai-suggestion-arrow">↗</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="ai-message-list">
            {messages.map((message, index) => {
              // Keep the initial welcome in the centered welcome screen.
              if (index === 0 && message.role === "assistant") return null;

              return (
                <div
                  key={`${conversationId}-${index}`}
                  className={`ai-message-row ${message.role}`}
                >
                  {message.role === "assistant" && (
                    <div className="ai-message-avatar">✦</div>
                  )}

                  <div className="ai-message-content">
                    <div className="ai-message-label">
                      {message.role === "assistant" ? "SmartLearn AI" : "You"}
                    </div>
                    <div className="ai-message-bubble">
                      {message.content}
                    </div>
                    
{message.role === "assistant" &&
  message.action &&
  message.action !== "NONE" && (
    <div className="ai-action-area">
      {message.actionStatus === "COMPLETED" ? (
        <span>Enrollment successful!</span>
      ) : (
        <button
          type="button"
          className="ai-action-button"
          disabled={loading}
          onClick={() =>
            handleCourseAction(message.action, index)
          }
        >
          {message.action === "FREE_ENROLLMENT_CONFIRMATION"
            ? "Confirm Enrollment"
            : "Continue to Payment"}
        </button>
      )}
    </div>
  )}

                  </div>

                  {message.role === "user" && (
                    <div className="ai-user-message-avatar">You</div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="ai-message-row assistant">
                <div className="ai-message-avatar">✦</div>
                <div className="ai-message-content">
                  <div className="ai-message-label">SmartLearn AI</div>
                  <div className="ai-message-bubble ai-typing">
                    <span />
                    <span />
                    <span />
                    <em>Thinking through your question...</em>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {error && (
          <div className="ai-error" role="alert">
            <span>⚠ {error}</span>
            <button onClick={() => setError("")}>Dismiss ×</button>
          </div>
        )}

        <div className="ai-composer-wrap">
          <form className="ai-composer" onSubmit={sendMessage}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message SmartLearn AI..."
              rows={1}
              aria-label="Message the AI Tutor"
            />
            <div className="ai-composer-bottom">
              <span className="ai-composer-hint">
                <kbd>Enter</kbd> to send · <kbd>Shift + Enter</kbd> for a new line
              </span>
              <button
                type="submit"
                className="ai-send-button"
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                {loading ? "…" : "↑"}
              </button>
            </div>
          </form>
          <p className="ai-disclaimer">
            AI can make mistakes. Verify important course information.
          </p>
        </div>
      </main>
    </section>
  );
}
