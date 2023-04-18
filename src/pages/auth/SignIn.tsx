import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Typography } from "antd";
const { Title } = Typography;

import { Button, Form, Input } from "antd";
import { Spin } from 'antd';
import { notification } from 'antd';


import { ValidateErrorEntity } from "rc-field-form/lib/interface";

import { userContext, IUser } from "../../context/UserContext";

import { connection } from "../../components/Connection";


const SignIn = () => {
  const onFinishFailed = (errorInfo: ValidateErrorEntity<any>) => {
    // console.log("Failed:", errorInfo);
  };

  const onFinish = (values: any) => {
    // console.log("Success:", values);

    setLoading(true);

    const username = values.email;
    const password = values.password;

    connection.authenticate(username, password)
      .then(response => {
        // console.log(response);
        setLoading(false);

        const data = response.data;

        const user: IUser = {
          username: username,
          accessToken: data.accessToken,
        }

        setUserLoggedIn(user);

        navigate("/");
        window.location.reload();
      })
      .catch(error => {
        setLoading(false);

        openNotificationWithIcon('error');
      })
  };

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const { setUserLoggedIn } = userContext();

  const [loading, setLoading] = React.useState(false);

  const [api, contextHolder] = notification.useNotification();

  type NotificationType = 'success' | 'info' | 'warning' | 'error';

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: 'Login Failed',
      description: 'Please check your username and password and try again.',
    });
  };

  return (
    <div className="sign-in">
      {contextHolder}

      <Title level={3}>Sign In</Title>

      <Form
        labelAlign="right"
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        style={{ maxWidth: "auto" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
          <Input />
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
          <Input.Password />
        </Form.Item>

        {/* <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 8 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          { !loading && <Button type="primary" htmlType="submit">
            Submit
          </Button> }
          { loading && <Spin size="large">
              <div className="content" />
            </Spin> }
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
