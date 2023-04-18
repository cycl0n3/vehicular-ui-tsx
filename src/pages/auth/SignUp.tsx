import { Typography } from "antd";
import { Button, Form, Input } from "antd";

import { FormInstance } from "antd/lib/form";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";

const { Title } = Typography;

const onFinish = (form: FormInstance<any>, values: any) => {
  console.log("Success:", values, form);
  form.resetFields();
};

const onFinishFailed = (
  form: FormInstance<any>,
  errorInfo: ValidateErrorEntity<any>
) => {
  console.log("Failed:", errorInfo);
};

const SignUp = () => {
  const [form] = Form.useForm();

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
        onFinish={(values: any) => onFinish(form, values)}
        onFinishFailed={(errorInfo: ValidateErrorEntity<any>) =>
          onFinishFailed(form, errorInfo)
        }
        autoComplete="off"
      >
        <Form.Item
          label="E-mail"
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
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
                if (!value || value.length >= 4 && value.length <= 16) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("Password must be between 4 and 16 characters!")
                );
              }
            })
          ]}
        >
          <Input.Password />
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
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                if(value.length < 4 || value.length > 16) {
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

export default SignUp;
