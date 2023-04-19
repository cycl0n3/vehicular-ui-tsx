import React, { useEffect, useState } from "react";

import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

import { Layout, Menu, theme } from "antd";
const { Header, Content, Footer } = Layout;

import { Outlet, useLocation, useNavigate } from "react-router-dom";

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
    connection.findMe(getLocalUser())
      .then((response) => {
        const data = response.data;
        setSitesRoutesFiltered(siteRoutes.filter(route => {
          return route.roles.includes(data.role);
        }));
      })
      .catch((error) => {
        setSitesRoutesFiltered(siteRoutes.filter(route => {
          return route.roles.includes(GUEST_ROLE);
        }));
      });
  }, []);

  return (
    <Layout>
      <Header style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}>
        <div
          style={{
            float: "left",
            width: 120,
            height: 50,
            margin: "10px 10px 10px 10px",
            background: "rgba(255, 255, 255, 0.2)",
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
