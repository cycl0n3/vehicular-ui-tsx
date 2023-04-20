import React, { useEffect, useState } from "react";

import { useNavigate, Location, NavigateFunction } from "react-router-dom";

import { localUserContext } from "../../context/LocalUserContext";
import { connection } from "../../components/Connection";

import { notification, Descriptions } from "antd";
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { nanoid } from 'nanoid';

import {
  useQuery,
  useMutation,
} from '@tanstack/react-query';

import { ADMIN_ROLE } from "../../components/SiteRoutes";

const Users = (): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  
  const { getLocalUser } = localUserContext();
  
  type NotificationType = "success" | "info" | "warning" | "error";
  
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType, error: any): void => {
    api[type]({
      message: "Login Failed",
      description: error.message,
    });
  };

  const query = useQuery({ 
    queryKey: ["users"],
    queryFn: async () => {
      const response = await connection.findAllUsers(getLocalUser())
      return response.data.map((user: any) => {
        return {
          ...user, 
          key: nanoid()
        }
      });
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    onError: (error: any) => {
      if (error.message) {
        openNotificationWithIcon("error", error);
      }
    }
  });

  const { isLoading, isError, data } = query;

  interface DataType {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === ADMIN_ROLE ? 'red' : 'green'} key={role}>
          {role}
        </Tag>
      ),
    }
  ]

  return (
    <div>
      {contextHolder}
      
      <h3>Users List</h3>

      {isLoading && <Descriptions.Item label="Status">Loading...</Descriptions.Item>}
      {isError && <Descriptions.Item label="Status">Error</Descriptions.Item>}

      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Users;
