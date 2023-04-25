import React, {useContext, useEffect, useRef, useState} from "react";

import {Button, Form, FormInstance, Input, Modal, Tag, Typography,} from "antd";

import { Skeleton } from 'antd';

import {useQuery} from "@tanstack/react-query";

import UserContext from "../../../context/UserContext";

import {connection} from "../../../base/Connection";

import Table, {ColumnsType} from "antd/es/table";

import {CheckCircleOutlined, CloseCircleOutlined, PlusCircleTwoTone, SyncOutlined} from "@ant-design/icons";

import NotificationContext from "../../../context/NotificationContext";

import {OrderResponse} from "../../../types/OrderResponse";

import {DEFAULT_USER_RESPONSE} from "../../../types/UserResponse";

import {DEFAULT_ORDER_PAGE_RESPONSE} from "../../../types/OrderPageResponse";

import ProfileDescription from "./ProfileDescription";

const Profile = () => {
    const {user} = useContext(UserContext);

    const notificationContext= useContext(NotificationContext);

    const [page, setPage] = React.useState<number>(0);
    const [size, setSize] = React.useState<number>(5);

    useEffect(() => {
        setPage(() => 0);
    }, [size]);

    const fetchMyOrdersQuery = useQuery({
        queryKey: ["fetchMyOrdersQuery:Profile", user, page, size],
        queryFn: async () => {
            try {
                const response = await connection.findMyOrders(user, {page, size});

                response.data.orders = response.data.orders.map((order: any) => {
                    return {
                        ...order,
                        key: order.id,
                    };
                });

                return response.data;
            } catch (e) {
                return DEFAULT_ORDER_PAGE_RESPONSE;
            }
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: user !== null,
        onError: (error: any) => {
            notificationContext.error(error.message);
        },
    });

    const fetchMeQuery = useQuery({
        queryKey: ["fetchMeQuery:Profile", user],
        queryFn: async () => {
            try {
                const response = await connection.findMe(user);
                return response.data;
            } catch (e) {
                return DEFAULT_USER_RESPONSE;
            }
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: user !== null,
        onError: (error: any) => {
            notificationContext.error(error.message);
        },
    });

    const {
        isLoading: isProfileLoading,
        isError: isProfileError,
        data: profileData,
    } = fetchMeQuery;

    const {
        isLoading: isOrdersLoading,
        isError: isOrdersError,
        data: ordersData,
        isPreviousData: isOrdersPreviousData,
    } = fetchMyOrdersQuery;

    const columns: ColumnsType<OrderResponse> = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: number) => {
                let color = "processing";
                let message = "accepted";
                let icon = <SyncOutlined />;

                if (status === -1) {
                    icon = <CloseCircleOutlined />;
                    message = "rejected";
                    color = "error";
                } else if(status === 0) {
                    icon = <SyncOutlined />;
                    message = "processing";
                    color = "processing";
                }
                else if (status === 1) {
                    icon = <CheckCircleOutlined />;
                    message = "accepted";
                    color = "success";
                }
                return (
                    <Tag icon={icon} color={color} key={status}>
                        {message.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
        },
    ];

    const [orderDialogOpen, setOrderDialogOpen] = useState(false);
    const [orderDialogConfirmLoading, setOrderDialogConfirmLoading] = useState(false);
    const orderDialogForm = useRef({} as FormInstance<any>);

    const handleOrderDialogOk = () => {
        setOrderDialogConfirmLoading(true);

        // @ts-ignore
        orderDialogForm.current.validateFields().then((values: any) => {
            connection.createOrder(user, values.description).then(() => {
                // @ts-ignore
                orderDialogForm.current.resetFields();
                fetchMeQuery.refetch(); fetchMyOrdersQuery.refetch();
                setOrderDialogOpen(false);
                notificationContext.success("Order created successfully");
            }).catch((error: any) => {
                notificationContext.error("Order creation failed (" + error.message + ")");
            }).finally(() => {
                setOrderDialogConfirmLoading(false);
            });
        }).catch((error: any) => {
            notificationContext.error("Order creation failed (" + error.message + ")");
        }).finally(() => {
            setOrderDialogConfirmLoading(false);
        });
    };

    const handleOrderDialogCancel = () => {
        // @ts-ignore
        orderDialogForm.current.resetFields();

        setOrderDialogConfirmLoading(false);
        setOrderDialogOpen(false);
    };


    return (
        <div>
            {isProfileLoading && (<>
                    <Skeleton active />
            </>)}

            {isProfileError && (<>
                    <Typography.Text type="danger">Error loading profile.</Typography.Text>
                </>
            )}

            {profileData && (
                <ProfileDescription user={profileData} />
            )}

            <Typography.Title level={4} style={{margin: 0}}>
                Orders
                <Button
                    type="text"
                    shape="circle"
                    icon={<PlusCircleTwoTone size={25}/>}
                    size="large"
                    onClick={() => {
                        setOrderDialogOpen(true);
                    }}
                />
            </Typography.Title>

            {isOrdersLoading && (<>
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
            </>)}

            {ordersData && (
                <>
                    <Table columns={columns} dataSource={ordersData.orders} pagination={{
                        defaultPageSize: size,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20"],
                        pageSize: ordersData.itemsPerPage,
                        total: ordersData.totalItems,
                        current: ordersData.currentPage + 1,
                        defaultCurrent: 1,
                        disabled: isOrdersPreviousData,
                        onChange: (page: number) => {
                            setPage(() => page - 1);
                        },
                        onShowSizeChange: (current: number, size: number) => {
                            setSize(() => size);
                        }
                    }} />

                    <Modal
                        title="Add new order"
                        open={orderDialogOpen}
                        onOk={handleOrderDialogOk}
                        confirmLoading={orderDialogConfirmLoading}
                        onCancel={handleOrderDialogCancel}
                    >
                        <Form
                            ref={orderDialogForm}
                            name="order-form"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Order Description"
                                name="description"
                                rules={[{ required: true, message: 'Please enter order description' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default Profile;
