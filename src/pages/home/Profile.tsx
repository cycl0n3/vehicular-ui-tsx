import React, { useEffect, useState } from "react";

import {
  notification,
  Descriptions,
  Tag,
  Typography,
  Button,
  Modal,
} from "antd";

import { useQuery, useMutation } from "@tanstack/react-query";

import { localUserContext } from "../../context/LocalUserContext";
import { connection } from "../../components/Connection";

import { ADMIN_ROLE } from "../../components/SiteRoutes";

import Table, { ColumnsType } from "antd/es/table";
import { PlusCircleOutlined, PlusCircleTwoTone } from "@ant-design/icons";

const Profile = () => {
  const { getLocalUser } = localUserContext();

  const [api, contextHolder] = notification.useNotification();

  type NotificationType = "success" | "info" | "warning" | "error";

  const openNotificationWithIcon = (type: NotificationType, error: any) => {
    api[type]({
      message: "Login Failed",
      description: error.message,
    });
  };

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await connection.findMe(getLocalUser());
      const data = response.data;
      data.orders = data.orders.map((order: any) => {
        return {
          ...order,
          key: order.id,
        };
      });
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    onError: (error: any) => {
      if (error.message) {
        openNotificationWithIcon("error", error);
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

  const handleModalOk = () => {
    setConfirmModalLoading(true);
    setTimeout(() => {
      setOpenModal(false);
      setConfirmModalLoading(false);
    }, 2000);
  };

  const handleModalCancel = () => {
    console.log('Clicked cancel button');
    setOpenModal(false);
  };


  return (
    <div>
      {contextHolder}

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
          <Typography.Title level={4} style={{ margin: 0 }}>
            Order Info
            <Button
              type="text"
              shape="circle"
              icon={<PlusCircleTwoTone size={25} />}
              size="large"
              onClick={() => {
                setOpenModal(true);
              }}
            />
          </Typography.Title>

          <Table columns={columns} dataSource={profileData.orders} />

          <Modal
            title="Title"
            open={openModal}
            onOk={handleModalOk}
            confirmLoading={confirmModalLoading}
            onCancel={handleModalCancel}
          >
            <p>Hello Modal</p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Profile;
