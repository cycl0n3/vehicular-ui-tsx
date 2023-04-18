import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Typography } from "antd";
import { Button, Form, Input } from "antd";

import { ValidateErrorEntity } from "rc-field-form/lib/interface";

import { userContext, ICurrentUser } from "../../context/UserContext";

const { Title } = Typography;

const SignIn = () => {
  const onFinishFailed = (errorInfo: ValidateErrorEntity<any>) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);

    const user: ICurrentUser = {
      id: 1,
      username: values.email,
    };

    setUserLoggedIn(user);
    
    navigate("/");
    window.location.reload();
  };

  const [form] = Form.useForm();

  const navigate = useNavigate();
  const location = useLocation();

  const { setUserLoggedIn } = userContext();

  return (
    <div className="sign-in">
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
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
