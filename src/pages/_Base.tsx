import React, {useContext, useEffect, useRef, useState} from "react";

import {UserOutlined} from '@ant-design/icons';

import {Avatar, Form, FormInstance, Input, Layout, Menu, Modal, theme} from 'antd';

import {Outlet, useLocation, useNavigate} from "react-router-dom";

import {useQuery,} from '@tanstack/react-query';

import {GUEST_ROLE, SiteRoute, siteRoutes} from "./_misc/SiteRoutes";

import UserContext from "../context/UserContext";

import {connection} from "../base/Connection";

import {AxiosResponse} from "axios";

import NotificationContext from "../context/NotificationContext";

import {DEFAULT_USER_RESPONSE, UserResponse} from "../types/UserResponse";

const {Header, Content, Footer} = Layout;

const Base = () => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const {userAuth} = useContext(UserContext);

    const [user, setUser] = useState<UserResponse>(DEFAULT_USER_RESPONSE);

    const notificationContext = useContext(NotificationContext);

    const navigate = useNavigate();

    const location = useLocation();

    const pageRoute = siteRoutes.find((route: SiteRoute): boolean => route.link === location.pathname) || siteRoutes[0];

    const navigateToRoute = (key: string): void => {
        const path: SiteRoute = siteRoutes.find(route => route.key === key) || siteRoutes[0];
        navigate(path.link);
    }

    const [sitesRoutesFiltered, setSitesRoutesFiltered] = useState<SiteRoute[]>([]);


    useEffect(() => {
        setSitesRoutesFiltered(siteRoutes.filter((route: SiteRoute) => {
            return route.roles.includes(GUEST_ROLE);
        }));
    }, []);

    useEffect(() => {
        if(!userAuth) {
            setSitesRoutesFiltered(siteRoutes.filter((route: SiteRoute) => {
                return route.roles.includes(GUEST_ROLE);
            }));
        }
    }, [userAuth]);

    const fetchMeQuery = useQuery({
        queryKey: ["fetchMeQuery:_Base", userAuth],
        queryFn: async () => {
            try {
                const response = await connection.findMe(userAuth);
                const data = response.data;

                setSitesRoutesFiltered(siteRoutes.filter((route: SiteRoute) => {
                    return route.roles.includes(data.role);
                }));

                setUser(data);

                return response.data;
            } catch (e) {
                return DEFAULT_USER_RESPONSE;
            } finally {
            }
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!userAuth,
    });

    const {data} = fetchMeQuery;

    const [file, setFile] = useState<File>();
    const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
    const [fileUploadDialogConfirmLoading, setFileUploadDialogConfirmLoading] = useState(false);
    const fileUploadDialogForm = useRef({} as FormInstance<any>);

    const fileUploadOK = (): void => {
        if (!file) {
            notificationContext.error("Please select a file to upload.");
            return;
        }

        setFileUploadDialogConfirmLoading(true);

        connection.uploadProfilePicture(userAuth, file).then((response: AxiosResponse<any, any>) => {
            notificationContext.success("Profile picture uploaded successfully.");
            setFileUploadDialogOpen(false);
            fileUploadDialogForm.current.resetFields();
            fetchMeQuery.refetch();
        }).catch(() => {
            setFileUploadDialogOpen(false);
            notificationContext.error("Error uploading profile picture.");
        }).finally(() => {
            setFileUploadDialogConfirmLoading(false);
        });
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
                    {userAuth && (data && data.profilePicture) &&
                        <Avatar size="large"
                                style={{"cursor": "pointer"}}
                                src={`data:image/jpg;base64,${data.profilePicture}`}
                                onClick={
                                    (): void => {
                                        setFileUploadDialogOpen(true);
                                    }
                                }/>}

                    {userAuth && !(data && data.profilePicture) &&
                        <Avatar size="large"
                                style={{"cursor": "pointer"}}
                                icon={<UserOutlined/>}
                                onClick={
                                    (): void => {
                                        setFileUploadDialogOpen(true);
                                    }
                                }/>}

                    {!userAuth &&
                        <Avatar size="large"
                                style={{"cursor": "default"}}
                                icon={<UserOutlined/>}
                        />}
                </div>

                <Menu
                    id="menu"
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[pageRoute.key]}
                    defaultSelectedKeys={[pageRoute.key]}
                    onSelect={
                        ({key}) => {
                            navigateToRoute(key);
                        }
                    }
                    items={sitesRoutesFiltered.map((route: SiteRoute) => {
                        return {
                            key: route.key,
                            label: route.label,
                        };
                    })}
                />
            </Header>

            <Content className="site-layout" style={{padding: "0 50px"}}>
                <div style={{padding: 24, minHeight: 380, background: colorBgContainer}}>
                    <Outlet context={user} />
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
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
                    initialValues={{remember: true}}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Select profile picture"
                        name="profile-picture"
                        rules={[{required: true, message: 'Please choose a profile picture'}]}
                    >
                        <Input type="file" onChange={
                            (e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setFile(e.target.files[0]);
                                }
                            }
                        }/>
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
