import { useUser } from "@clerk/clerk-react";
import { Button, Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useState } from "react";
import { Expenses } from "../api-agent";
import { EXPENSE_CATEGORIES } from "../constants/categories";

const { Option } = Select;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  refetchExpenses: () => void;
};

export default function AddExpenseForm(props: Props) {
  const user = useUser();
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      await Expenses.createExpense({
        spentOn: values.spentOn,
        amount: values.amount,
        category: values.category,
        subCategory: values.subCategory,
        userId: user.user?.id as string,
      });

      messageApi.open({
        type: "success",
        content: "Expense Created!",
      });

      form.resetFields();
      props.onClose();
      props.refetchExpenses();
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: "error",
        content: "Something went wrong!",
      });
    }
  };

  return (
    <>
      <Modal
        title="➕ Add Expense"
        centered
        open={props.isOpen}
        onOk={() => props.onClose()}
        onCancel={() => props.onClose()}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="spentOn"
            label="What did you spend on?"
            rules={[{ required: true }]}
          >
            <Input placeholder="Spent on" />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a category"
              onChange={(e) => {
                setSelectedCategory(e);
                form.setFieldValue("subCategory", undefined);
              }}
            >
              {EXPENSE_CATEGORIES.map((item) => (
                <Option key={item.category} value={item.category}>
                  {item.category}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {selectedCategory && (
            <Form.Item
              name="subCategory"
              label="Sub Category"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select a sub category">
                {EXPENSE_CATEGORIES.find(
                  (item) => item.category === selectedCategory
                )?.subcategories.map((item) => (
                  <Option key={item.name} value={item.name}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" className="w-full" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
}
