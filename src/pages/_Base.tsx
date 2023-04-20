import React, {useEffect, useState} from "react";

import {UserOutlined} from '@ant-design/icons';
import {Avatar, Layout, Menu, theme} from 'antd';

import {Location, NavigateFunction, Outlet, useLocation, useNavigate} from "react-router-dom";

import {useQuery,} from '@tanstack/react-query';

import {GUEST_ROLE, SiteRoute, siteRoutes} from "../components/SiteRoutes";

import {localUserContext} from "../context/LocalUserContext";
import {connection} from "../components/Connection";

import {AxiosResponse} from "axios";

const {Header, Content, Footer} = Layout;

const Base = (): JSX.Element => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const navigate: NavigateFunction = useNavigate();
    const location: Location = useLocation();

    const currentRoute: SiteRoute = siteRoutes.find((route: SiteRoute): boolean => route.link === location.pathname) || siteRoutes[0];

    const navigateToRoute = (key: string): void => {
        const path: SiteRoute = siteRoutes.find(route => route.key === key) || siteRoutes[0];
        navigate(path.link);
    }

    const [sitesRoutesFiltered, setSitesRoutesFiltered] = useState<SiteRoute[]>([]);

    const {getLocalUser} = localUserContext();

    useEffect(() => {
        setSitesRoutesFiltered(siteRoutes.filter((route: SiteRoute) => {
            return route.roles.includes(GUEST_ROLE);
        }));
    }, []);

    const query = useQuery({
        queryKey: ["me"],
        queryFn: async (): Promise<any> => {
            const response: AxiosResponse<any, any> = await connection.findMe(getLocalUser());
            const data = response.data;
            setSitesRoutesFiltered(siteRoutes.filter((route: SiteRoute) => {
                return route.roles.includes(data.role);
            }));
            return response.data;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });

    return (
        <Layout>
            <Header style={{position: "sticky", top: 0, zIndex: 1, width: "100%"}}>
                <div
                    style={{
                        float: "left",
                        width: 120,
                        height: 50,
                        margin: "0px 10px 10px -50px",
                        background: "#001529",
                    }}
                >
                    <Avatar size="large" icon={<UserOutlined/>}/>
                </div>

                <Menu
                    id="menu"
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[currentRoute.key]}
                    onSelect={
                        ({key}) => {
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

            <Content className="site-layout" style={{padding: "0 50px"}}>
                <div
                    style={{padding: 24, minHeight: 380, background: colorBgContainer}}
                >
                    <Outlet/>
                </div>
            </Content>

            <Footer style={{textAlign: "center"}}>
                Ant Design ©2023 Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default Base;
