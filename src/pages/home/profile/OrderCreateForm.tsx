import React from 'react';

import {Form, Modal} from 'antd';

import TextArea from "antd/es/input/TextArea";

import {connection} from "../../../base/Connection";

import {UserAuth} from "../../../types/UserAuth";

interface Values {
    description: string;
}

interface OrderCreateFormProps {
    user: UserAuth;
    open: boolean;
    onCreate: (values: Values) => void;
    onError: (error: any) => void;
    onCancel: () => void;
}

const OrderCreateForm = ({ user, open, onCreate, onError, onCancel }: OrderCreateFormProps) => {
    const [form] = Form.useForm();

    const [loading, setLoading] = React.useState(false);

    return (
        <Modal
            open={open}
            title="Create a new Order"
            okText="Create"
            confirmLoading={loading}
            cancelText="Cancel"
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        setLoading(true);

                        connection.createOrder(user, values.description)
                            .then(() => {
                                form.resetFields();
                                onCreate(values);
                            })
                            .catch((error) => {
                                onError(error);
                            })
                            .finally(() => {
                                setLoading(false);
                            });
                    });
            }}
        >
            <Form
                form={form}
                disabled={loading}
                layout="vertical"
                name="order_form_in_modal"
                // initialValues={{modifier: 'public'}}
            >
                <Form.Item name="description" label="Description" rules={[{required: true, message: 'Please provide Description'}]} >
                    <TextArea rows={4} />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default OrderCreateForm;
