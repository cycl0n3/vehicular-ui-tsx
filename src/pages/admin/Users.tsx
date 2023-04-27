import React, {useContext, useEffect} from "react";

import UserContext from "../../context/UserContext";

import {connection} from "../../base/Connection";

import {Avatar, Badge, Form, FormInstance, Input, List, Modal, Skeleton, Table, Tag, Typography} from "antd";

import type {ColumnsType} from "antd/es/table";

import {nanoid} from "nanoid";

import {useQuery} from "@tanstack/react-query";

import {ADMIN_ROLE} from "../_misc/SiteRoutes";

import {UserOutlined} from "@ant-design/icons";

import NotificationContext from "../../context/NotificationContext";

import {UserResponse} from "../../types/UserResponse";

import {DEFAULT_USER_PAGE_RESPONSE} from "../../types/UserPageResponse";

import Orders from "../home/profile/Orders";

const Users = () => {

    const {userAuth} = useContext(UserContext);

    const notificationContext = useContext(NotificationContext);

    const [page, setPage] = React.useState<number>(0);
    const [size, setSize] = React.useState<number>(5);

    const [searchQuery, setSearchQuery] = React.useState<string>("");

    const fetchUsersQuery = useQuery({
        queryKey: ["fetchUsersQuery:Users", userAuth, searchQuery, page, size],
        queryFn: async () => {
            try {
                const response = await connection.findAllUsers(userAuth, searchQuery, {page, size});

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
        enabled: !!userAuth,
        onError: (error: any) => {
            if (error.message) {
                notificationContext.error(error.message);
            }
        },
    });

    useEffect(() => {
        setPage(() => 0);
    }, [size, searchQuery]);

    const {isLoading, isError, data: structure, isPreviousData} = fetchUsersQuery;

    const [activeUser, setActiveUser] = React.useState<string>('');

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
            render: (username: string) => (<>
                <a onClick={
                    () => {
                        setActiveUser(username);
                        showModal();
                    }
                }>
                    {username}
                </a>
            </>)
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Orders",
            dataIndex: "orderCounts",
            key: "orderCounts",
            render: (orderCounts: {
                orderCount: number;
                acceptedOrderCount: number;
                rejectedOrderCount: number;
                pendingOrderCount: number;
            }) => {
                return <>
                    <Badge.Ribbon text={`Total: ${orderCounts.orderCount}`}>
                        <List size="default" bordered>
                            <List.Item>
                                <Typography.Text type="success">{orderCounts.acceptedOrderCount} Accepted</Typography.Text>
                            </List.Item>
                            <List.Item>
                                <Typography.Text type="danger">{orderCounts.rejectedOrderCount} Rejected</Typography.Text>
                            </List.Item>
                            <List.Item>
                                <Typography.Text type="warning">{orderCounts.pendingOrderCount} Pending</Typography.Text>
                            </List.Item>
                        </List>
                    </Badge.Ribbon>
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

    const [open, setOpen] = React.useState<boolean>(false);

    const modalForm = React.useRef<FormInstance>(null);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        console.log('Clicked ok button', modalForm)
        setOpen(false);
        fetchUsersQuery.refetch();
    };

    const handleCancel = () => {
        console.log('Clicked cancel button', modalForm)
        setOpen(false);
        fetchUsersQuery.refetch();
    };

    return (
        <div>
            <Form
                layout='vertical'
                style={{ maxWidth: 600 }}
                onFinish={(values) => {
                    setSearchQuery(() => values.searchQuery);
                }}
            >
                <Form.Item label="Search" name="searchQuery">
                    <Input placeholder="Enter search query here" />
                </Form.Item>

            </Form>

            {isLoading && (<>
                <Skeleton active/>
                <Skeleton active/>
                <Skeleton active/>
            </>)}

            {isError && (
                <Typography.Text type="danger">Error fetching users</Typography.Text>
            )}

            {userAuth && <Modal open={open} width={'1024px'} onOk={handleOk} onCancel={handleCancel}>
                <Orders user={userAuth} otherUsername={activeUser} />
            </Modal>}

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
