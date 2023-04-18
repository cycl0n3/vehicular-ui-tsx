import { Layout, Menu, theme } from "antd";

const { Header, Content, Footer } = Layout;

import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { siteRoutes } from "../components/SiteRoutes";

const Base = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  
  const currentRoute = siteRoutes.find(route => route.link === location.pathname) || siteRoutes[0];

  const navigateToRoute = (key: string) => {
    const path = siteRoutes.find(route => route.key === key) || siteRoutes[0];
    navigate(path.link);
  }

  return (
    <Layout>
      <Header style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}>
        <div
          style={{
            float: "left",
            width: 120,
            height: 31,
            margin: "16px 24px 16px 0",
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />

        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[currentRoute.key]}
          onSelect={
            ({ key }) => {
              navigateToRoute(key as string);
            }
          }
          items={siteRoutes.map(route => {
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
