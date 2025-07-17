import upfetch from "@/api/instance";
import { useRefresh } from "@/hooks/useRefresh";
import ChatImage from "@assets/images/chat.png";
import CodeImage from "@assets/images/code.png";
import ImgImage from "@assets/images/image.png";
import LogoImage from "@assets/images/logo.png";
import { ArrowUp } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./dashboardPage.module.css";
import { useAuth } from "@clerk/clerk-react";

export default function DashboardPage() {
  const refreshuserChats = useRefresh(["user_chats"]);
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const { getToken } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;
    const token = await getToken();

    const result = await upfetch("/chats", {
      method: "POST",
      body: { text },
      onSuccess: (id) => {
        refreshuserChats();
        navigate(`/dashboard/chats/${id}`);
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    setText("");
    console.log(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      textareaRef.current?.form?.requestSubmit(); // trigger form submission
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.texts}>
        <div className={styles.logo}>
          <img src={LogoImage} alt="Logo" />
          <h1>ALIREZA AI</h1>
        </div>
        <div className={styles.options}>
          <div className={styles.option}>
            <img src={ChatImage} alt="Chat" />
            <span>Create a New Chat</span>
          </div>
          <div className={styles.option}>
            <img src={ImgImage} alt="Image" />
            <span>Analyze Images</span>
          </div>
          <div className={styles.option}>
            <img src={CodeImage} alt="Code" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <textarea
            autoFocus
            ref={textareaRef}
            name="text"
            placeholder="Ask me anything..."
            rows={1}
            className={styles.textarea}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button type="submit">
            <ArrowUp size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
