import React, { useEffect, useState } from "react";

import { notification, Descriptions, Tag } from "antd";

import {
  useQuery,
  useMutation,
} from '@tanstack/react-query';

import { localUserContext } from "../../context/LocalUserContext";
import { connection } from "../../components/Connection";

import { ADMIN_ROLE } from "../../components/SiteRoutes";

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

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await connection.findMe(getLocalUser());
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    onError: (error: any) => {
      if (error.message) {
        openNotificationWithIcon("error", error);
      }
    },
  });

  const { isLoading, isError, data } = query;

  return (
    <div>
      {contextHolder}

      {data && <Descriptions title="User Info">
        {isLoading && <Descriptions.Item label="Status">Loading...</Descriptions.Item>}
        {isError && <Descriptions.Item label="Status">Error</Descriptions.Item>}
        <Descriptions.Item label="Username">{data.username}</Descriptions.Item>
        <Descriptions.Item label="Name">{data.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
        <Descriptions.Item label="Role">
          <Tag color={data.role === ADMIN_ROLE ? 'red' : 'green'} key={data.role}>
            {data.role}
          </Tag>
        </Descriptions.Item>
      </Descriptions>}
    </div>
  );
};

export default Profile;
