import React, {useContext, useEffect} from "react";

import {useNavigate} from "react-router-dom";

import {Button, Form, Input, Spin, Typography} from "antd";

import UserContext from "../../context/UserContext";

import {UserAuth} from "../../types/UserAuth";

import {connection} from "../../base/Connection";

import NotificationContext from "../../context/NotificationContext";

import {siteRoutes} from "../_misc/SiteRoutes";

const {Title} = Typography;

import * as USER from "../../redux/user";

import {useAppDispatch} from "../../redux/store";

const SignIn = () => {

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const {login, logout} = useContext(UserContext);

    const [loading, setLoading] = React.useState(false);

    const notificationContext= useContext(NotificationContext);

    const onFinish = (values: any): void => {
        setLoading(true);

        const username = values.email;
        const password = values.password;

        connection.authenticate(username, password)
            .then(response => {
                setLoading(false);

                const user: UserAuth = {
                    username: username,
                    accessToken: response.data.accessToken,
                }

                login(user); dispatch(USER.login(user));

                const profileURL = siteRoutes.find(route => route.key === "profile")?.link || "/";

                navigate(profileURL);
            })
            .catch(error => {
                setLoading(false);
                notificationContext.error("Login Failed");
            })
    };

    useEffect(() => {
        logout(); dispatch(USER.logout());
    }, []);

    return (
        <div className="sign-in">
            <Title level={3}>Sign In</Title>

            <Form
                labelAlign="right"
                name="basic"
                disabled={loading}
                labelCol={{span: 8}}
                wrapperCol={{span: 8}}
                style={{maxWidth: "auto"}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[
                        {
                            type: "email",
                            message: "The input is not valid E-mail!",
                        },
                        {
                            required: true,
                            message: "Please input your E-mail!",
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!",
                        },
                        () => ({
                            validator(_, value) {
                                if (!value || (value.length >= 4 && value.length <= 16)) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(
                                    new Error("Password must be between 4 and 16 characters!")
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 8}}>
                    {!loading && <Button type="primary" htmlType="submit">
                        Submit
                    </Button>}
                    {loading && <Spin size="large">
                        <div className="content"/>
                    </Spin>}
                </Form.Item>
            </Form>
        </div>
    );
};

export default SignIn;
