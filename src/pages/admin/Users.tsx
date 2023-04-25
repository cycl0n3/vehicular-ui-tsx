import React, {useContext, useEffect} from "react";

import {useNavigate} from "react-router-dom";

import UserContext from "../../context/UserContext";

import {connection} from "../../base/Connection";

import {Avatar, Descriptions, Table, Tag} from "antd";

import type {ColumnsType} from "antd/es/table";

import {nanoid} from "nanoid";

import {useQuery} from "@tanstack/react-query";

import {ADMIN_ROLE} from "../../base/SiteRoutes";

import {UserOutlined} from "@ant-design/icons";

import NotificationContext from "../../context/NotificationContext";

import {UserResponse} from "../../types/UserResponse";

import {OrderResponse} from "../../types/OrderResponse";

const Users = () => {
    const navigate = useNavigate();

    const {user} = useContext(UserContext);

    const notificationContext = useContext(NotificationContext);

    const [page, setPage] = React.useState<number>(0);
    const [size, setSize] = React.useState<number>(15);

    const fetchUsersQuery = useQuery({
        queryKey: ["fetchUsersQuery:Users", user, page, size],
        queryFn: async () => {
            try {
                const response = await connection.findAllUsers(user, {page, size});

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
        keepPreviousData: true,
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

    const {isLoading, isError, data: structure, isPreviousData} = fetchUsersQuery;

    const columns: ColumnsType<UserResponse> = [
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
            render: (orders: OrderResponse[]) => (
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
                    pageSizeOptions: ["15", "30", "45", "60"],
                    pageSize: structure.itemsPerPage,
                    total: structure.totalItems,
                    current: structure.currentPage + 1,
                    defaultCurrent: 1,
                    disabled: isPreviousData,
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
