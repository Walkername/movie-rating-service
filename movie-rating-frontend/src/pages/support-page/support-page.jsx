import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import { Client } from "@stomp/stompjs";
import { useEffect, useState, useRef } from "react";
import { getMessagesFromChat, sendMessageToChat } from "../../api/chat-api";
import { createSupportChat } from "../../api/support-chat-api";
import validateDate from "../../utils/date-validation/date-validation";
import "./support-page.css";
import getClaimFromToken from "../../utils/token-validation/token-validation";

export default function SupportPage() {
    const accessToken = localStorage.getItem("accessToken");
    const myId = getClaimFromToken(accessToken, "id");

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageForm, setMessageForm] = useState({ content: "" });
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef(null);
    const stompRef = useRef(null);

    // ===== Auto Scroll =====
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ===== Create Chat =====
    useEffect(() => {
        createSupportChat()
            .then(setChat)
            .catch(console.error);
    }, []);

    // ===== Load History =====
    useEffect(() => {
        if (!chat) return;

        getMessagesFromChat(chat.id)
            .then(setMessages)
            .catch(console.error);
    }, [chat]);

    // ===== WebSocket =====
    useEffect(() => {
        if (!accessToken || !chat?.id) return;

        const stompClient = new Client({
            brokerURL: process.env.REACT_APP_CONVERSATION_WEBSOCKET_URL,
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            onConnect: () => {
                console.log("✅ WebSocket connected");

                stompClient.subscribe(`/topic/chat/${chat.id}`, (msg) => {
                    try {
                        const received = JSON.parse(msg.body);
                        setMessages((prev) => [...prev, received]);
                    } catch (e) {
                        console.error("Message parse error:", e);
                    }
                });
            },

            onStompError: (frame) => {
                console.error("❌ STOMP error:", frame.headers["message"]);
            },
        });

        stompClient.activate();
        stompRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, [chat?.id, accessToken]);

    // ===== Input Handlers =====
    const handleChange = (e) => {
        setMessageForm({ content: e.target.value });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = async () => {
        if (!messageForm.content.trim()) return;

        try {
            setIsSending(true);
            await sendMessageToChat(chat.id, messageForm);
            setMessageForm({ content: "" });
        } catch (error) {
            console.error("Send error:", error);
        } finally {
            setIsSending(false);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        handleSend();
    };

    // ===== Render =====
    return (
        <div className="support-page">
            <NavigationBar />

            <div className="support-page__content">
                <div className="support-page__card">
                    {!chat ? (
                        <div className="support-page__loading">
                            <div className="support-page__spinner"></div>
                            <p>Loading support chat...</p>
                        </div>
                    ) : (
                        <>
                            <div className="support-page__header">
                                <h1 className="support-page__title">
                                    Support Chat
                                </h1>
                                <p className="support-page__subtitle">
                                    Our team is here to help you
                                </p>
                            </div>

                            <div className="support-chat">
                                <div className="support-chat__messages">
                                    {messages.map((message) => {
                                        const isOwn =
                                            message.userId === myId;

                                        return (
                                            <div
                                                key={message.id}
                                                className={`support-message ${
                                                    isOwn ? "own" : "support"
                                                }`}
                                            >
                                                <div className="support-message__meta">
                                                    <span className="support-message__user">
                                                        user#{message.userId}
                                                    </span>
                                                    <span className="support-message__date">
                                                        {validateDate(
                                                            message.sentAt
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="support-message__content">
                                                    {message.content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form
                                    className="support-chat__input"
                                    onSubmit={sendMessage}
                                >
                                    <textarea
                                        name="content"
                                        placeholder="Type your message..."
                                        value={messageForm.content}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        disabled={isSending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={
                                            isSending ||
                                            !messageForm.content.trim()
                                        }
                                    >
                                        {isSending ? "Sending..." : "Send"}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
