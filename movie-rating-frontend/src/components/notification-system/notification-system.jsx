import { Client } from "@stomp/stompjs";
import React, { useState, useEffect, useRef } from "react";
import { useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "./notification-system.css";

const NotificationSystem = () => {
    const [displayedNotifications, setDisplayedNotifications] = useState([]);
    const maxDisplayed = 3;
    const displayDuration = 20000; // 5 секунд

    // Используем useRef для таймеров и очереди, чтобы избежать замыканий
    const timersRef = useRef([]);
    const queueRef = useRef([]);
    const displayedRef = useRef([]);

    const functionsRef = useRef({});

    const accessToken = localStorage.getItem("accessToken");

    // Функция для удаления уведомления
    const removeNotification = useCallback((id) => {
        // Очищаем таймер
        const timerIndex = timersRef.current.findIndex((t) => t.id === id);
        if (timerIndex !== -1) {
            clearTimeout(timersRef.current[timerIndex].timerId);
            timersRef.current.splice(timerIndex, 1);
        }

        // Удаляем из отображаемых
        displayedRef.current = displayedRef.current.filter((n) => n.id !== id);
        setDisplayedNotifications(displayedRef.current);

        // Обрабатываем очередь после удаления
        setTimeout(functionsRef.current.processQueue, 100);
    }, []);

    // Функция для обработки очереди
    const processQueue = useCallback(() => {
        if (displayedRef.current.length >= maxDisplayed) {
            return; // Все слоты заняты
        }

        // Вычисляем сколько можно добавить
        const availableSlots = maxDisplayed - displayedRef.current.length;
        const toDisplay = queueRef.current.slice(0, availableSlots);

        if (toDisplay.length === 0) return;

        // Добавляем выбранные уведомления в отображаемые
        const newDisplayed = [...displayedRef.current, ...toDisplay];
        displayedRef.current = newDisplayed;
        setDisplayedNotifications(newDisplayed);

        // Удаляем из очереди
        queueRef.current = queueRef.current.slice(toDisplay.length);

        // Устанавливаем таймеры для удаления через 5 секунд
        toDisplay.forEach((notification) => {
            const timerId = setTimeout(() => {
                removeNotification(notification.id);
            }, displayDuration);

            timersRef.current.push({ id: notification.id, timerId });
        });
    }, [removeNotification]);

    // Функция для добавления уведомления в очередь
    const addToQueue = useCallback((notification) => {
        const notificationWithId = {
            ...notification,
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
        };

        queueRef.current = [...queueRef.current, notificationWithId];

        // Пытаемся отобразить, если есть свободные слоты
        functionsRef.current.processQueue();
    }, []);

    // Сохраняем функции в ref после их создания
    useEffect(() => {
        functionsRef.current = {
            processQueue,
            removeNotification,
            addToQueue,
        };
    }, [processQueue, removeNotification, addToQueue]);

    // Функция для ручного закрытия уведомления
    const handleCloseNotification = useCallback(
        (id) => {
            removeNotification(id);
        },
        [removeNotification],
    );

    useEffect(() => {
        if (!accessToken) {
            console.warn("No access token found for WebSocket");
            return;
        }

        const stompClient = new Client({
            brokerURL: "ws://localhost:8087/ws",
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

                stompClient.subscribe("/topic/notifications", (message) => {
                    try {
                        const newNotification = JSON.parse(message.body);
                        console.log(
                            "📨 New notification received:",
                            newNotification,
                        );
                        addToQueue(newNotification);
                    } catch (error) {
                        console.error("❌ Error parsing notification:", error);
                    }
                });
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
            // Очищаем все таймеры при размонтировании
            timersRef.current.forEach((timer) => clearTimeout(timer.timerId));
            timersRef.current = [];
            queueRef.current = [];
            displayedRef.current = [];

            stompClient.deactivate();
        };
    }, [accessToken, addToQueue]); // Только accessToken в зависимостях

    // Отображаем количество в очереди (опционально, для отладки)
    const queueLength = queueRef.current.length;

    return createPortal(
        <div className="notification-system">
            {/* Индикатор очереди (только в development) */}
            {process.env.NODE_ENV === "development" && queueLength > 0 && (
                <div className="queue-indicator">
                    В очереди: {queueLength} уведомлений
                </div>
            )}

            {/* Контейнер для уведомлений */}
            <div className="notifications-container">
                {displayedNotifications.map((notification) => (
                    <NotificationToast
                        key={notification.id}
                        notification={notification}
                        onClose={handleCloseNotification}
                        duration={displayDuration}
                    />
                ))}
            </div>
        </div>,
        document.body,
    );
};

const defineUrlToNavigate = (notification) => {
    const entityType = notification.entityType;
    let urlToNavigate;
    switch (entityType) {
        case "POST":
            urlToNavigate = "/feed";
            break;
        default:
            return;
    }

    return urlToNavigate;
};

// Вынесенный компонент для уведомления с анимацией прогресса
const NotificationToast = ({ notification, onClose, duration }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 100 / (duration / 50); // Обновляем каждые 50мс
            });
        }, 50);

        return () => clearInterval(interval);
    }, [duration]);

    const navigate = useNavigate();

    const handleClose = () => {
        const urlToNavigate = defineUrlToNavigate(notification);
        navigate(urlToNavigate);

        setIsVisible(false);
        setTimeout(() => {
            onClose(notification.id);
        }, 300); // Даем время для анимации исчезновения
    };

    return (
        <div
            className={`notification-toast ${isVisible ? "visible" : "hiding"}`}
            onClick={handleClose}
        >
            <div className="notification-header">
                <div className="notification-title">{notification.title}</div>
                <button
                    className="notification-close"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                    }}
                >
                    &times;
                </button>
            </div>
            <div className="notification-body">
                <p className="notification-message">{notification.message}</p>
                {/* {notification.metadata?.postId && (
                    <div className="notification-metadata">
                        📝 Post ID: {notification.metadata.postId}
                    </div>
                )}*/}
            </div>
            <div className="notification-footer">
                <small>
                    {new Date(notification.deliveredAt).toLocaleTimeString()}
                </small>
                <div
                    className="notification-progress"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default NotificationSystem;
