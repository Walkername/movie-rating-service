import { Client } from "@stomp/stompjs";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { getAdminSupportChats } from "../../../api/admin-support-chat-api";
import { getMessagesFromChat, sendMessageToChat } from "../../../api/chat-api";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import "./admin-support-chat.css";

export default function AdminSupportChat() {
    const accessToken = localStorage.getItem("accessToken");
    const myId = getClaimFromToken(accessToken, "id");

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getAdminSupportChats().then((data) => {
            setChats(data);
        });
    }, []);

    const getMessages = (chatId) => {
        getMessagesFromChat(chatId).then((data) => {
            setMessages(data);
        });
    };

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        getMessages(chat.id);
    };

    const filteredChats = chats.filter(
        (chat) =>
            chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chat.id.toString().includes(searchTerm) ||
            chat.userId.toString().includes(searchTerm),
    );

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat || isSending) return;

        setIsSending(true);
        const messageToSend = {
            content: newMessage.trim(),
        };

        sendMessageToChat(selectedChat.id, messageToSend)
            .then((sentMessage) => {
                setNewMessage("");

                // Обновляем список чатов, чтобы последний сообщенный чат был сверху
                setChats((prevChats) => {
                    const updatedChats = prevChats.filter(
                        (chat) => chat.id !== selectedChat.id,
                    );
                    return [selectedChat, ...updatedChats];
                });
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    useEffect(() => {
        if (!accessToken || !selectedChat?.id) return;

        const stompClient = new Client({
            brokerURL: process.env.REACT_APP_CONVERSATION_WEBSOCKET_URL,
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            debug: (str) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(str);
                }
            },
            onConnect: (frame) => {
                console.log("✅ WebSocket connected");

                stompClient.subscribe(
                    `/topic/chat/${selectedChat?.id}`,
                    (message) => {
                        try {
                            const receivedMessage = JSON.parse(message.body);
                            setMessages((prev) => [...prev, receivedMessage]);
                        } catch (error) {
                            console.error("Message parse error:", error);
                        }
                    },
                );
            },
            onStompError: (frame) => {
                console.error("❌ STOMP error:", frame.headers["message"]);
            },
            onWebSocketError: (event) => {
                console.error("🌐 WebSocket error:", event);
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
            console.log("🔌 WebSocket disconnected");
        };
    }, [selectedChat?.id, accessToken]);

    return (
        <div className="admin-support-chat">
            <div className="admin-support-chat__container">
                {/* Список чатов */}
                <div className="admin-support-chat__sidebar">
                    <div className="admin-support-chat__sidebar-header">
                        <h2 className="admin-support-chat__title">
                            Support Chats
                        </h2>
                        <button
                            className="admin-support-chat__refresh-btn"
                            // onClick={loadChats}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Refresh"}
                        </button>
                    </div>

                    <div className="admin-support-chat__search">
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-support-chat__search-input"
                        />
                    </div>

                    <div className="admin-support-chat__list">
                        {filteredChats.length === 0 ? (
                            <div className="admin-support-chat__empty">
                                {isLoading
                                    ? "Loading chats..."
                                    : "No chats found"}
                            </div>
                        ) : (
                            filteredChats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`admin-support-chat__item ${
                                        selectedChat?.id === chat.id
                                            ? "admin-support-chat__item--active"
                                            : ""
                                    }`}
                                    onClick={() => handleChatSelect(chat)}
                                >
                                    <div className="admin-support-chat__item-avatar">
                                        {getInitials(chat.name)}
                                    </div>
                                    <div className="admin-support-chat__item-info">
                                        <div className="admin-support-chat__item-name">
                                            {chat.name}
                                        </div>
                                        <div className="admin-support-chat__item-user">
                                            User #{chat.userId}
                                        </div>
                                    </div>
                                    <div className="admin-support-chat__item-meta">
                                        <div className="admin-support-chat__item-date">
                                            {formatDate(chat.createdAt)}
                                        </div>
                                        <div className="admin-support-chat__item-type">
                                            {chat.type}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Область сообщений */}
                <div className="admin-support-chat__main">
                    {selectedChat ? (
                        <>
                            <div className="admin-support-chat__header">
                                <div className="admin-support-chat__header-info">
                                    <div className="admin-support-chat__header-avatar">
                                        {getInitials(selectedChat.name)}
                                    </div>
                                    <div>
                                        <h3 className="admin-support-chat__header-name">
                                            {selectedChat.name}
                                        </h3>
                                        <p className="admin-support-chat__header-user">
                                            User #{selectedChat.userId} •{" "}
                                            {selectedChat.type}
                                        </p>
                                    </div>
                                </div>
                                <div className="admin-support-chat__header-actions">
                                    <button className="admin-support-chat__action-btn">
                                        Close Chat
                                    </button>
                                </div>
                            </div>

                            <div className="admin-support-chat__messages">
                                {messages.length === 0 ? (
                                    <div className="admin-support-chat__no-messages">
                                        No messages yet. Start the conversation!
                                    </div>
                                ) : (
                                    messages.map((message, index) => {
                                        const showDate =
                                            index === 0 ||
                                            formatDate(
                                                messages[index - 1]?.sentAt,
                                            ) !== formatDate(message.sentAt);
                                        const isMyMessage =
                                            myId === message.userId;

                                        return (
                                            <div key={message.id}>
                                                {showDate && (
                                                    <div className="admin-support-chat__date-divider">
                                                        {formatDate(
                                                            message.sentAt,
                                                        )}
                                                    </div>
                                                )}
                                                <div
                                                    className={`admin-support-chat__message admin-support-chat__message--user
                                                        ${isMyMessage ? `admin-support-chat__message--my-message` : `admin-support-chat__message--not-my-message`}`}
                                                >
                                                    <div className="admin-support-chat__message-sender">
                                                        User#{message.userId}
                                                    </div>
                                                    <div className="admin-support-chat__message-content">
                                                        {message.content}
                                                    </div>
                                                    <div className="admin-support-chat__message-time">
                                                        {formatTime(
                                                            message.sentAt,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form
                                className="admin-support-chat__input-form"
                                onSubmit={handleSendMessage}
                            >
                                <div className="admin-support-chat__input-wrapper">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) =>
                                            setNewMessage(e.target.value)
                                        }
                                        placeholder="Type your message here..."
                                        className="admin-support-chat__input"
                                        disabled={isSending}
                                    />
                                    <button
                                        type="submit"
                                        className="admin-support-chat__send-btn"
                                        disabled={
                                            !newMessage.trim() || isSending
                                        }
                                    >
                                        {isSending ? "Sending..." : "Send"}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="admin-support-chat__placeholder">
                            <div className="admin-support-chat__placeholder-icon">
                                💬
                            </div>
                            <h3 className="admin-support-chat__placeholder-title">
                                Select a chat to start messaging
                            </h3>
                            <p className="admin-support-chat__placeholder-text">
                                Choose a conversation from the list to view
                                messages and respond to users.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
