import React, {useContext, useEffect, useRef, useState} from "react";

import {UserOutlined} from '@ant-design/icons';
import {Avatar, Form, FormInstance, Input, Layout, Menu, Modal, theme} from 'antd';

import {Location, NavigateFunction, Outlet, useLocation, useNavigate} from "react-router-dom";

import {useQuery,} from '@tanstack/react-query';

import {GUEST_ROLE, SiteRoute, siteRoutes} from "../base/SiteRoutes";

import LocalUserContext from "../context/LocalUserContext";
import {connection} from "../base/Connection";

import {AxiosResponse} from "axios";

const {Header, Content, Footer} = Layout;

const Base = (): JSX.Element => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const [loading, setLoading] = useState<boolean>(true);

    const navigate: NavigateFunction = useNavigate();
    const location: Location = useLocation();

    const currentRoute: SiteRoute = siteRoutes.find((route: SiteRoute): boolean => route.link === location.pathname) || siteRoutes[0];

    const navigateToRoute = (key: string): void => {
        const path: SiteRoute = siteRoutes.find(route => route.key === key) || siteRoutes[0];
        navigate(path.link);
    }

    const [sitesRoutesFiltered, setSitesRoutesFiltered] = useState<SiteRoute[]>([]);

    const {getLocalUser} = useContext(LocalUserContext);

    useEffect(() => {
        setSitesRoutesFiltered(siteRoutes.filter((route: SiteRoute) => {
            return route.roles.includes(GUEST_ROLE);
        }));
    }, []);

    const query = useQuery({
        queryKey: ["me"],
        queryFn: async (): Promise<any> => {
          try {
            const response: AxiosResponse<any, any> = await connection.findMe(getLocalUser());
            const data = response.data;
            setSitesRoutesFiltered(siteRoutes.filter((route: SiteRoute) => {
                return route.roles.includes(data.role);
            }));
            return response.data;
          } catch (e) {
            return { };
          } finally {
            setLoading(false);
          }
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });

    const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
    const [fileUploadDialogConfirmLoading, setFileUploadDialogConfirmLoading] = useState(false);
    const fileUploadDialogForm = useRef({} as FormInstance<any>);

    const fileUploadOK = (): void => {
        setFileUploadDialogConfirmLoading(true);
        setTimeout(() => {
            setFileUploadDialogOpen(false);
            setFileUploadDialogConfirmLoading(false);
        }, 2000);
    }

    const fileUploadCancel = (): void => {
        setFileUploadDialogOpen(false);
    }

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
                    <Avatar size="large" icon={<UserOutlined/>} onClick={
                        () => {
                            setFileUploadDialogOpen(true);
                        }
                    }/>
                </div>

                <Menu
                    id="menu"
                    theme="dark"
                    mode="horizontal"
                    disabled={loading}
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

            <Modal
                title="Upload profile picture"
                open={fileUploadDialogOpen}
                onOk={fileUploadOK}
                confirmLoading={fileUploadDialogConfirmLoading}
                onCancel={fileUploadCancel}
            >
                <Form
                    ref={fileUploadDialogForm}
                    name="profile-pic-form"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Select profile picture"
                        name="profilePicture"
                        rules={[{ required: true, message: 'Please enter order description' }]}
                    >
                        <Input type="file" />
                    </Form.Item>
                </Form>
            </Modal>

            <Footer style={{textAlign: "center"}}>
                Ant Design ©2023 Created by Ant UED
            </Footer>

        </Layout>
    );
};

export default Base;
