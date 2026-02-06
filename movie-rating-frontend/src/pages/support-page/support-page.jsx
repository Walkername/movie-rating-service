import { useEffect } from "react";
import { useState } from "react";
import { getMessagesFromChat, sendMessageToChat } from "../../api/chat-api";
import { createSupportChat, getSupportChat } from "../../api/support-chat-api";
import validateDate from "../../utils/date-validation/date-validation";

export default function SupportPage() {
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);

    const [messageForm, setMessageForm] = useState({
        content: "",
    });

    useEffect(() => {
        if (chat == null) {
            getSupportChat()
                .then((data) => {
                    setChat(data);
                })
                .catch((error) => {
                    console.log(error);
                    createSupportChat().then((data) => {
                        setChat(chat);
                    });
                });
        }
    }, [chat]);

    useEffect(() => {
        if (chat !== null) {
            getMessagesFromChat(chat.id).then((data) => {
                setMessages(data);
            });
        }
    }, [chat]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...messageForm, [name]: value };
        setMessageForm(newFormData);
    };

    const sendMessage = (e) => {
        e.preventDefault();

        console.log(messageForm);
        sendMessageToChat(chat.id, messageForm).then((data) => {
            setMessages((prevMessages) => [...messages, data]);
        });
    };

    return (
        <div>
            <h1>Support Page</h1>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "10px",
                    gap: "5px",
                }}
            >
                {messages.map((message, index) => {
                    return (
                        <div
                            style={{
                                border: "1px solid black",
                            }}
                            key={index}
                        >
                            <div style={{ display: "flex" }}>
                                <span>user#{message.userId}</span>

                                <span
                                    style={{
                                        fontSize: "10px",
                                        marginLeft: "auto",
                                        marginRight: "5px",
                                    }}
                                >
                                    {validateDate(message.sentAt)}
                                </span>
                            </div>
                            <div>{message.content}</div>
                        </div>
                    );
                })}
            </div>

            <form method="POST" onSubmit={sendMessage}>
                <label htmlFor="content">Message:</label>
                <br></br>
                <textarea
                    id="content"
                    type="text"
                    name="content"
                    value={messageForm.content}
                    onChange={handleChange}
                />
                <br></br>
                <input type="submit" value="Send" />
            </form>
        </div>
    );
}
