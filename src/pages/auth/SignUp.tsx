import React, {useContext, useEffect} from "react";

import {Button, Form, Input, Spin, Typography} from "antd";

import {ValidateErrorEntity} from "rc-field-form/lib/interface";

import {useNavigate} from "react-router-dom";

import LocalUserContext from "../../context/LocalUserContext";

import {ILocalUser} from "../../context/ILocalUser";

import {connection} from "../../base/Connection";
import NotificationContext from "../../context/NotificationContext";

const {Title} = Typography;

const SignUp = (): JSX.Element => {
    const onFinish = (values: any) => {
        const name = values.name;
        const username = values.username;
        const email = values.email;
        const password = values.password;

        setLoading(true);

        connection.register(name, username, email, password)
            .then(response => {
                setLoading(false);

                if (response.status === 201) {
                    const user: ILocalUser = {
                        username: username,
                        accessToken: response.data.accessToken,
                    }

                    setUserLoggedIn(user);
                    navigate("/profile");
                }
            })
            .catch(error => {
                setLoading(false);
                notificationContext.error("Sign Up Failed: " + error.response.data.message);
            });
    };

    const onFinishFailed = (errorInfo: ValidateErrorEntity<any>): void => {
        console.log("Failed:", errorInfo);
    };

    useEffect(() => {
        setUserLoggedOut();
    }, []);

    const navigate = useNavigate();

    const {setUserLoggedIn, setUserLoggedOut} = useContext(LocalUserContext);

    const [loading, setLoading] = React.useState(false);

    const notificationContext= useContext(NotificationContext);

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
                onFinish={(values: any) => onFinish(values)}
                onFinishFailed={(errorInfo: ValidateErrorEntity<any>) =>
                    onFinishFailed(errorInfo)
                }
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!'
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!'
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Please input your E-mail!",
                        },
                        {
                            type: "email",
                            message: "The input is not valid E-mail!",
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

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your password!",
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }

                                if (value.length < 4 || value.length > 16) {
                                    return Promise.reject(
                                        new Error("Password must be between 4 and 16 characters!")
                                    );
                                }

                                return Promise.reject(
                                    new Error("The two passwords that you entered do not match!")
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

export default SignUp;
