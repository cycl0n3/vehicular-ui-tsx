import React, { useEffect, useState } from "react";

import { notification } from "antd";

import {
  useQuery,
  useMutation,
} from '@tanstack/react-query';

import { localUserContext } from "../../context/LocalUserContext";
import { connection } from "../../components/Connection";

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

      <h1>Profile</h1>

      {isLoading && <div>Loading...</div>}

      {isError && <div>Error Loading</div>}

      {data && <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.username}</td>
            <td>{data.name}</td>
            <td>{data.email}</td>
            <td>{data.role}</td>
          </tr>
        </tbody>
      </table>}
    </div>
  );
};

export default Profile;
