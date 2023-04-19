import React, { useEffect, useState } from "react";

import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

import { Layout, Menu, theme } from "antd";
const { Header, Content, Footer } = Layout;

import { Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  useQuery,
  useMutation,
} from '@tanstack/react-query';

import { SiteRoute, siteRoutes, GUEST_ROLE } from "../components/SiteRoutes";

import { localUserContext } from "../context/LocalUserContext";
import { connection } from "../components/Connection";

const Base = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const currentRoute: SiteRoute = siteRoutes.find(route => route.link === location.pathname) || siteRoutes[0];

  const navigateToRoute = (key: string) => {  
    const path = siteRoutes.find(route => route.key === key) || siteRoutes[0];
    navigate(path.link);
  }

  const [sitesRoutesFiltered, setSitesRoutesFiltered] = useState<SiteRoute[]>([]);

  const { getLocalUser } = localUserContext();
  
  useEffect(() => {
    setSitesRoutesFiltered(siteRoutes.filter(route => {
      return route.roles.includes(GUEST_ROLE);
    }));
  }, []);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await connection.findMe(getLocalUser());
      const data = response.data;
      setSitesRoutesFiltered(siteRoutes.filter(route => {
        return route.roles.includes(data.role);
      }));
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  return (
    <Layout>
      <Header style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}>
        <div
          style={{
            float: "left",
            width: 120,
            height: 50,
            margin: "0px 10px 10px -50px",
            background: "#001529",
          }}
        >
          <Avatar size="large" icon={<UserOutlined />} />
        </div>


        <Menu
          id="menu"
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[currentRoute.key]}
          onSelect={
            ({ key }) => {
              navigateToRoute(key as string);
            }
          }
          items={sitesRoutesFiltered.map(route => {
            return {
              key: route.key,
              label: route.label,     
            };
          })}
        />
      </Header>

      <Content className="site-layout" style={{ padding: "0 50px" }}>
        <div
          style={{ padding: 24, minHeight: 380, background: colorBgContainer }}
        >
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default Base;
