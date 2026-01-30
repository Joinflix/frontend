import {
    createContext,
    useContext,
    useRef,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from "react";
import {
    SSE_EVENT_CONFIG,
    SSE_EVENT_TYPES,
    type SseEventType,
} from "../config/sseEventConfig";

// SSE 알림 타입
export interface SseNotification {
    id: string;
    type: SseEventType | string;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    timestamp: Date;
    isRead: boolean;
}

interface SseContextType {
    isConnected: boolean;
    notifications: SseNotification[];
    unreadCount: number;
    connect: () => void;
    disconnect: () => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

const SseContext = createContext<SseContextType | null>(null);

interface SseProviderProps {
    children: ReactNode;
}

export const SseProvider = ({ children }: SseProviderProps) => {
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<SseNotification[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);

    const MAX_NOTIFICATIONS = 10;

    const addNotification = useCallback(
        (
            type: SseEventType | string,
            title: string,
            message: string,
            data?: Record<string, unknown>,
        ) => {
            const newNotification: SseNotification = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type,
                title,
                message,
                data,
                timestamp: new Date(),
                isRead: false,
            };
            setNotifications((prev) => {
                const updated = [newNotification, ...prev];
                // 최대 개수 초과 시 오래된 알림 삭제
                return updated.slice(0, MAX_NOTIFICATIONS);
            });
        },
        [],
    );

    const connect = useCallback(() => {
        if (eventSourceRef.current) {
            return;
        }

        const es = new EventSource("/api/sse/subscribe", { withCredentials: true });
        eventSourceRef.current = es;

        es.onopen = () => {
            setIsConnected(true);
        };

        es.onerror = () => {
            setIsConnected(false);
        };

        // config 기반 동적 이벤트 리스너 등록
        SSE_EVENT_TYPES.forEach((eventType) => {
            const config = SSE_EVENT_CONFIG[eventType];

            es.addEventListener(eventType, (e: MessageEvent) => {
                try {
                    const payload = JSON.parse(e.data);
                    const data = payload.data as Record<string, unknown>;
                    addNotification(
                        eventType,
                        config.title,
                        config.getMessage(data),
                        data,
                    );
                } catch (error) {
                    console.error(`[SSE] Parse error for ${eventType}:`, error);
                }
            });
        });
    }, [addNotification]);

    const disconnect = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            setIsConnected(false);
        }
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    /**
     * 브라우저 beforeunload 이벤트 핸들러
     *
     * [ beforeunload 란? ]
     * 브라우저에서 다음 상황이 발생하기 "직전"에 실행되는 이벤트:
     * - 페이지 새로고침 (F5, Ctrl+R)
     * - 탭 닫기
     * - 브라우저 종료
     * - 다른 URL로 이동 (외부 링크)
     *
     * [ 왜 필요한가? ]
     * SSE 연결은 장기 연결(Long-Polling)이므로, 브라우저가 페이지를 떠날 때
     * 명시적으로 연결을 종료해주지 않으면:
     * 1. 서버 측에서 연결 종료를 감지하는 데 시간이 걸림
     * 2. 그 사이에 새 연결이 생성되면 중복 연결 발생
     * 3. 각 연결에서 DB 쿼리가 실행되어 커넥션 풀 고갈 가능
     *
     * [ 동작 원리 ]
     * 1. beforeunload 이벤트 발생
     * 2. EventSource.close() 호출 → 서버에 연결 종료 신호 전송
     * 3. 서버의 onCompletion 콜백 즉시 실행
     * 4. 서버 측 리소스 정리 완료
     *
     * [ SPA 내부 이동 시 ]
     * React Router를 통한 SPA 내부 페이지 이동은 beforeunload가 발생하지 않음
     * → SSE 연결 유지됨 (의도한 동작)
     */
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    // 컴포넌트 언마운트 시 연결 해제 (앱 전체 종료 시)
    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    return (
        <SseContext.Provider
            value={{
                isConnected,
                notifications,
                unreadCount,
                connect,
                disconnect,
                markAsRead,
                markAllAsRead,
                clearNotifications,
            }}
        >
            {children}
        </SseContext.Provider>
    );
};

export const useSse = () => {
    const context = useContext(SseContext);
    if (!context) {
        throw new Error("useSse must be used within SseProvider");
    }
    return context;
};
