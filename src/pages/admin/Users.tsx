import React from "react";

import {NavigateFunction, useNavigate} from "react-router-dom";

import {localUserContext} from "../../context/LocalUserContext";
import {connection} from "../../base/Connection";

import {Descriptions, notification, Table, Tag} from "antd";
import type {ColumnsType} from "antd/es/table";

import {nanoid} from "nanoid";

import {useQuery} from "@tanstack/react-query";

import {ADMIN_ROLE} from "../../base/SiteRoutes";

const Users = (): JSX.Element => {
    const navigate: NavigateFunction = useNavigate();

    const {getLocalUser} = localUserContext();

    type NotificationType = "success" | "info" | "warning" | "error";

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (
        type: NotificationType,
        error: any
    ): void => {
        api[type]({
            message: "Login Failed",
            description: error.message,
        });
    };

    const query = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await connection.findAllUsers(getLocalUser());
            return response.data.map((user: any) => {
                return {
                    ...user,
                    key: nanoid(),
                };
            });
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        onError: (error: any) => {
            if (error.message) {
                openNotificationWithIcon("error", error);
            }
        },
    });

    const {isLoading, isError, data} = query;

    interface OrderResponseDataType {
        id: string;
        description: string;
        createdAt: string;
    }

    interface UserResponseDataType {
        id: number;
        name: string;
        username: string;
        email: string;
        role: string;
        orders: OrderResponseDataType[];
    }

    const columns: ColumnsType<UserResponseDataType> = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Orders",
            dataIndex: "orders",
            key: "orders",
            render: (orders: OrderResponseDataType[]) => (
                <>
                    {orders.length > 0 ? `${orders.length} orders` : "No orders"}
                </>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: string) => (
                <Tag color={role === ADMIN_ROLE ? "red" : "green"} key={role}>
                    {role}
                </Tag>
            ),
        },
    ];

    return (
        <div>
            {contextHolder}

            {isLoading && (
                <Descriptions title="User List">
                    <Descriptions.Item label="Status">Loading...</Descriptions.Item>
                </Descriptions>
            )}

            {isError && (
                <Descriptions title="User List">
                    <Descriptions.Item label="Status">Error</Descriptions.Item>
                </Descriptions>
            )}

            {data && (<>
                <Descriptions title="User List">
                </Descriptions>

                <Table columns={columns} dataSource={data}/>
            </>)}
        </div>
    );
};

export default Users;
