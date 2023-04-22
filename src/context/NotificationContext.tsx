import { createContext } from "react";

import { notification } from "antd";

type NotificationContextType = {
    success: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
    error: (message: string) => void;
};

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

const NotificationProvider = ({ children }: any): JSX.Element => {
    const [api, contextHolder] = notification.useNotification();

    type NotificationType = "success" | "info" | "warning" | "error";

    const openNotificationWithIcon = (type: NotificationType, title: string, message: string): void => {
        api[type]({
            message: title,
            description: message,
        });
    };

    const success = (message: string): void => openNotificationWithIcon("success", "Success", message);
    const info = (message: string): void => openNotificationWithIcon("info", "Info", message);
    const warning = (message: string): void => openNotificationWithIcon("warning", "Warning", message);
    const error = (message: string): void => openNotificationWithIcon("error", "Error", message);

    return (
        <NotificationContext.Provider
            value={{ success, info, warning, error }}>
            {children} {contextHolder}
        </NotificationContext.Provider>
    )
}

export default NotificationContext;
export { NotificationProvider };
