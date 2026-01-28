import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
    getNotifications,
    markNotificationAsRead,
    markNotificationsAsBatchRead,
} from "../../../api/notification-api";
import "./notification-panel.css";

export default function NotificationPanel({
    notifications,
    setNotifications,
    maxNotifications = 10,
}) {
    const [isOpen, setIsOpen] = useState(false);
    // const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState("");

    const buttonRef = useRef();
    const panelRef = useRef();
    // const timeRef = useRef();

    useEffect(() => {
        if (isOpen && panelRef.current) {
            const handleWheel = (e) => {
                const panel = panelRef.current;
                const content = panel?.querySelector(
                    ".notification-panel-content",
                );

                if (!content) return;

                const isAtTop = content.scrollTop <= 0;
                const isAtBottom =
                    content.scrollTop + content.clientHeight >=
                    content.scrollHeight;

                // Разрешаем скроллить панель если мы не достигли границ
                if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                    // Если достигли границы и пытаемся скроллить дальше - блокируем
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }

                // В противном случае позволяем скроллить панель
                // и предотвращаем всплытие на страницу
                e.stopPropagation();
            };

            const panel = panelRef.current;
            panel.addEventListener("wheel", handleWheel, { passive: false });

            return () => {
                panel.removeEventListener("wheel", handleWheel);
            };
        }
    }, [isOpen]);

    useEffect(() => {
        const unread = notifications.filter((n) => !n.read).length;
        setUnreadCount(unread);
    }, [notifications]);

    const fetchNotifications = () => {
        getNotifications()
            .then((data) => {
                setNotifications(data.content);
                const unread = data.content.filter((n) => !n.read).length;
                setUnreadCount(unread);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const markAsRead = (id) => {
        markNotificationAsRead(id)
            .then(() => {
                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification.notificationId === id
                            ? {
                                  ...notification,
                                  read: true,
                                  readAt: new Date().toISOString(),
                              }
                            : notification,
                    ),
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const markAllAsRead = () => {
        const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
        
        markNotificationsAsBatchRead(unreadIds)
            .then(() => {
                setNotifications((prev) =>
                    prev.map((notification) =>
                        unreadIds.includes(notification.id)
                            ? {
                                  ...notification,
                                  read: true,
                                  readAt: new Date().toISOString(),
                              }
                            : notification,
                    ),
                );
                setUnreadCount(0);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const minutes = Math.floor(diffInHours * 60);
            return `${minutes} ${getMinutesText(minutes)} ago`;
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            return `${hours} ${getHoursText(hours)} ago`;
        } else {
            return date.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
    };

    const getMinutesText = (minutes) => {
        if (minutes === 1) return "minute";
        return "minutes";
    };

    const getHoursText = (hours) => {
        if (hours === 1) return "hour";
        return "hours";
    };

    const togglePanel = () => {
        setIsOpen(!isOpen);

        // Если открываем, загружаем свежие уведомления
        if (!isOpen) {
            fetchNotifications();
        }
    };

    const displayedNotifications = isOpen
        ? notifications.slice(0, maxNotifications)
        : notifications.filter((n) => !n.read).slice(0, maxNotifications);

    return (
        <>
            {/* Кнопка в углу экрана */}
            <button
                ref={buttonRef}
                className="notification-button"
                onClick={togglePanel}
                aria-label={`Уведомления ${unreadCount > 0 ? `(${unreadCount} новых)` : ""}`}
            >
                <span className="notification-icon">
                    🔔
                    {unreadCount > 0 && (
                        <span className="notification-badge">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </span>
            </button>

            {/* Панель уведомлений */}
            {isOpen && (
                <div className="notification-panel" ref={panelRef}>
                    <div className="notification-panel-header">
                        <h3>Notifications</h3>
                        <div className="notification-panel-actions">
                            {unreadCount > 0 && (
                                <button
                                    className="notification-action-btn"
                                    onClick={markAllAsRead}
                                    title="Пометить все как прочитанные"
                                >
                                    Read all
                                </button>
                            )}
                            <button
                                className="notification-close-btn"
                                onClick={() => setIsOpen(false)}
                                title="Закрыть"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="notification-panel-content">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            <>
                                <div className="notification-list">
                                    {displayedNotifications.map(
                                        (notification, index) => (
                                            <Link
                                                to="/feed"
                                                key={index}
                                                className={`notification-item ${notification.read ? "read" : "unread"}`}
                                                onMouseEnter={() => {
                                                    !notification.read &&
                                                    markAsRead(notification.notificationId)
                                                }
                                                    
                                                }
                                                // onClick={() =>
                                                //     !notification.read &&
                                                //     markAsRead(notification.id)
                                                // }
                                            >
                                                <div className="notification-item-header">
                                                    <span className="notification-item-title">
                                                        {notification.title}
                                                        {!notification.read && (
                                                            <span className="unread-dot" />
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="notification-item-message">
                                                    {notification.message}
                                                </p>
                                                {notification.metadata && (
                                                    <div className="notification-item-metadata">
                                                        {Object.entries(
                                                            notification.metadata,
                                                        ).map(
                                                            ([key, value]) => (
                                                                <span
                                                                    key={key}
                                                                    className="metadata-item"
                                                                >
                                                                    {key}:{" "}
                                                                    {String(
                                                                        value,
                                                                    )}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                                <div className="notification-item-footer">
                                                    <span className="notification-item-time">
                                                        {formatDate(
                                                            notification.deliveredAt,
                                                        )}
                                                    </span>
                                                    <span className="notification-item-type">
                                                        {
                                                            notification.entityType
                                                        }
                                                    </span>
                                                </div>
                                            </Link>
                                        ),
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
