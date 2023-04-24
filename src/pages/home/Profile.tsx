import React, {useRef, useState, useContext} from "react";

import {Button, Descriptions, Form, FormInstance, Input, Modal, Tag, Typography,} from "antd";

import {useQuery} from "@tanstack/react-query";

import UserContext from "../../context/UserContext";

import {connection} from "../../base/Connection";

import {ADMIN_ROLE} from "../../base/SiteRoutes";

import Table, {ColumnsType} from "antd/es/table";

import {PlusCircleTwoTone} from "@ant-design/icons";

import {AxiosResponse} from "axios";

import NotificationContext from "../../context/NotificationContext";

const Profile = () => {
    const {user} = useContext(UserContext);

    const notificationContext= useContext(NotificationContext);

    const fetchMeQuery = useQuery({
        queryKey: ["fetchMeQuery:Profile", user],
        queryFn: async (): Promise<any> => {
            try {
                const response = await connection.findMe(user);
                const data = response.data;

                data.orders = data.orders.map((order: any) => {
                    return {
                        ...order,
                        key: order.id,
                    };
                });

                return data;
            } catch (e) {
                return [];
            }
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        onError: (error: any) => {
            notificationContext.error(error.message);
        },
    });

    const {
        isLoading: isProfileLoading,
        isError: isProfileError,
        data: profileData,
    } = fetchMeQuery;

    interface DataType {
        id: string;
        description: string;
        createdAt: string;
    }

    const columns: ColumnsType<DataType> = [
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
        orderDialogForm.current.validateFields().then((values: any): void => {
            connection.createOrder(user, values.description).then(() => {
                // @ts-ignore
                orderDialogForm.current.resetFields();
                fetchMeQuery.refetch();
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
            {isProfileLoading && (
                <Descriptions title="User Info">
                    <Descriptions.Item label="Status">Loading...</Descriptions.Item>
                </Descriptions>
            )}

            {isProfileError && (
                <Descriptions title="User Info">
                    <Descriptions.Item label="Status">Error</Descriptions.Item>
                </Descriptions>
            )}

            {profileData && (
                <Descriptions title="User Info">
                    <Descriptions.Item label="Username">
                        {profileData.username}
                    </Descriptions.Item>
                    <Descriptions.Item label="Name">
                        {profileData.title} {profileData.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Age">
                        {profileData.age}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {profileData.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Role">
                        <Tag
                            color={profileData.role === ADMIN_ROLE ? "red" : "green"}
                            key={profileData.role}
                        >
                            {profileData.role}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>
            )}

            {profileData && (
                <>
                    <Typography.Title level={4} style={{margin: 0}}>
                        Order Info
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

                    <Table columns={columns} dataSource={profileData.orders} />

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
                            // onFinish={onFinish}
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
