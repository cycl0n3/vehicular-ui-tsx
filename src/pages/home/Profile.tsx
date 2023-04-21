import React, {useRef, useState, useContext} from "react";

import {Button, Descriptions, Form, FormInstance, Input, Modal, Tag, Typography,} from "antd";

import {useQuery} from "@tanstack/react-query";

import LocalUserContext from "../../context/LocalUserContext";
import {connection} from "../../base/Connection";

import {ADMIN_ROLE} from "../../base/SiteRoutes";

import Table, {ColumnsType} from "antd/es/table";
import {PlusCircleTwoTone} from "@ant-design/icons";

import {AxiosResponse} from "axios";

import NotificationContext from "../../context/NotificationContext";

const Profile = () => {
    const {getLocalUser} = useContext(LocalUserContext);

    const notificationContext= useContext(NotificationContext);

    const profileQuery = useQuery({
        queryKey: ["profile"],
        queryFn: async (): Promise<any> => {
            try {
                const response: AxiosResponse<any, any> = await connection.findMe(getLocalUser());
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
            if (error.message) {
                notificationContext.displayNotification("error", "Login Failed", error.message);
            }
        },
    });

    const {
        isLoading: isProfileLoading,
        isError: isProfileError,
        data: profileData,
        refetch: refetchProfile,
    } = profileQuery;

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

    const [openModal, setOpenModal] = useState(false);
    const [confirmModalLoading, setConfirmModalLoading] = useState(false);

    const modalForm = useRef({} as FormInstance<any>);

    const handleModalOk = () => {
        setConfirmModalLoading(true);

        // @ts-ignore
        modalForm.current.validateFields().then((values: any): void => {
            connection.createOrder(getLocalUser(), values.description).then(() => {
                // @ts-ignore
                modalForm.current.resetFields();

                refetchProfile();

                setOpenModal(false);
                setConfirmModalLoading(false);
                notificationContext.displayNotification("success", "Order Success", "Order created successfully");
            }).catch((error: any) => {
                notificationContext.displayNotification("error", "Order Error", error.message);
                setConfirmModalLoading(false);
            })
        }).catch((error: any) => {
            setConfirmModalLoading(false);
            notificationContext.displayNotification("error", "Order Error", error.message);
        });
    };

    const handleModalCancel = () => {
        // @ts-ignore
        modalForm.current.resetFields();

        setConfirmModalLoading(false);
        setOpenModal(false);
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
                    <Descriptions.Item label="Name">{profileData.name}</Descriptions.Item>
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
                                setOpenModal(true);
                            }}
                        />
                    </Typography.Title>

                    <Table columns={columns} dataSource={profileData.orders}/>

                    <Modal
                        title="Add new order"
                        open={openModal}
                        onOk={handleModalOk}
                        confirmLoading={confirmModalLoading}
                        onCancel={handleModalCancel}
                    >
                        <Form
                            ref={modalForm}
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
