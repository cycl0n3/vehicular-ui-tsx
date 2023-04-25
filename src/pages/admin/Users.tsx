import React, {useContext, useEffect} from "react";

import UserContext from "../../context/UserContext";

import {connection} from "../../base/Connection";

import {Avatar, Badge, Skeleton, Table, Tag, Typography} from "antd";

import type {ColumnsType} from "antd/es/table";

import {nanoid} from "nanoid";

import {useQuery} from "@tanstack/react-query";

import {ADMIN_ROLE} from "../_misc/SiteRoutes";

import {UserOutlined} from "@ant-design/icons";

import NotificationContext from "../../context/NotificationContext";

import {UserResponse} from "../../types/UserResponse";

import {DEFAULT_USER_PAGE_RESPONSE} from "../../types/UserPageResponse";

const Users = () => {

    const {user} = useContext(UserContext);

    const notificationContext = useContext(NotificationContext);

    const [page, setPage] = React.useState<number>(0);
    const [size, setSize] = React.useState<number>(5);

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
                return DEFAULT_USER_PAGE_RESPONSE;
            }
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!user,
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
                        ? <Avatar src={`data:image/jpg;base64,${profilePicture}`}/>
                        : <Avatar icon={<UserOutlined/>}/>}
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
            dataIndex: "orderCount",
            key: "orderCount",
            render: (orderCount: number) => {
                return <>
                    <Badge count={orderCount} style={{backgroundColor: 'green'}} showZero={true}/>
                </>
            },
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
            {isLoading && (<>
                <Skeleton active/>
                <Skeleton active/>
                <Skeleton active/>
            </>)}

            {isError && (
                <Typography.Text type="danger">Error fetching users</Typography.Text>
            )}

            {structure && (<>
                <Typography.Title level={4}>Users</Typography.Title>

                <Table columns={columns} dataSource={structure.users} pagination={{
                    defaultPageSize: size,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50", "100"],
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
                }}/>
            </>)}
        </div>
    );
};

export default Users;
