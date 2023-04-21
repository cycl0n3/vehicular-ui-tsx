import { createContext, useContext } from "react";
import { notification } from "antd";

type NotificationContextType = {
  displayNotification(type: string, title: string, message: string): void;
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

    const displayNotification = (type: string, title: string, message: string): void => {
        openNotificationWithIcon(type as NotificationType, title, message);
    }

    return (
        <NotificationContext.Provider
            value={{displayNotification}}>
            {children} {contextHolder}
        </NotificationContext.Provider>
    )
}

export default NotificationContext;
export { NotificationProvider };
