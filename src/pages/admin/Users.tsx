import React, {useContext, useEffect} from "react";

import {NavigateFunction, useNavigate} from "react-router-dom";

import LocalUserContext from "../../context/LocalUserContext";
import {connection} from "../../base/Connection";

import {Avatar, Descriptions, notification, Pagination, Table, Tag} from "antd";
import type {ColumnsType} from "antd/es/table";

import {nanoid} from "nanoid";

import {useQuery} from "@tanstack/react-query";

import {ADMIN_ROLE} from "../../base/SiteRoutes";
import {UserOutlined} from "@ant-design/icons";

import NotificationContext from "../../context/NotificationContext";

import {PageRequestType} from "./PageRequestType";

const Users = (): JSX.Element => {
    const navigate: NavigateFunction = useNavigate();

    const {localUser} = useContext(LocalUserContext);

    const notificationContext = useContext(NotificationContext);

    const [page, setPage] = React.useState<number>(0);
    const [size, setSize] = React.useState<number>(15);

    const query = useQuery({
        queryKey: ["users", localUser, page, size],
        queryFn: async () => {
            try {
                console.log("queryFn", localUser, page, size);
                const response = await connection.findAllUsers(localUser, {page, size});

                response.data.users = response.data.users.map((user: any) => {
                    return {
                        ...user,
                        name: `${user.title} ${user.name}`,
                        key: nanoid(),
                    };
                });

                return response.data;
            } catch (e) {
                return {
                    users: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    itemsPerPage: 0,
                };
            }
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        onError: (error: any) => {
            if (error.message) {
                notificationContext.error(error.message);
            }
        },
    });

    useEffect(() => {
        setPage(() => 0);
    }, [size]);

    const {isLoading, isError, data: structure} = query;

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
        profilePicture: string;
        orders: OrderResponseDataType[];
    }

    const columns: ColumnsType<UserResponseDataType> = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Profile Picture",
            dataIndex: "profilePicture",
            key: "profilePicture",
            render: (profilePicture: string) => (
                <>
                    {profilePicture
                        ? <Avatar src={`data:image/jpg;base64,${profilePicture}`} />
                        : <Avatar icon={<UserOutlined/>} /> }
                </>
            )
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
                    {orders.length > 0
                        ? (<Tag color="gold" key="many-orders">{orders.length} Orders</Tag>)
                        : (<Tag color="lightgray" key="no-orders">{orders.length} Orders</Tag> )}
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

            {structure && (<>
                <Descriptions title="User List">
                </Descriptions>

                <Table columns={columns} dataSource={structure.users} pagination={{
                    defaultPageSize: size,
                    showSizeChanger: true,
                    pageSize: structure.itemsPerPage,
                    total: structure.totalItems,
                    current: structure.currentPage + 1,
                    defaultCurrent: 1,
                    onChange: (page: number) => {
                        setPage(() => page - 1);
                    },
                    onShowSizeChange: (current: number, size: number) => {
                        setSize(() => size);
                    }
                }} />
            </>)}
        </div>
    );
};

export default Users;
