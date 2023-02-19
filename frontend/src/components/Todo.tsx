import { Checkbox, Form, Modal, Input, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import styled from 'styled-components'; //npm i --save-dev @types/styled-components
const TodoBlock = styled.div`
  border: 1px solid black;
  // or can define with 3 props border-radius, border-color and border-style
  //   border-radius: 1px;
  //   border-color: black;
  //   border-style: solid;
  display: flex;
  flex-wrap: nowrap;
  padding: 50px 20px;
  max-height: 20%;
  border-radius: 20px;
  margin: 15px 0px;
`;
const InfoBlock = styled.div``;
const Button = styled.button<{ backgroundColor: string }>`
  margin: 5px 10px;
  background-color: ${(props) => props.backgroundColor};
  border-color: transparent;
  border-radius: 12px;
  color: white;
  width: 30%;
  align-self: stretch;
  //   overflow: hidden;
`;

const StyledCheckBox = styled(Checkbox)`
  .ant-checkbox .ant-checkbox-inner {
    width: 30px !important;
    height: 30px !important;
    border-radius: 12px;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: green !important;
  }
  .ant-checkbox-inner::after {
    width: 6px !important;
    height: 13px !important;
    inset-inline-start: 30% !important;
  }
`;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

interface FormValues {
  taskName: string;
  date: Dayjs; //since our datepicker in antd return dayjs type we just convert it date in onfinish function
}

//add export to export to other file
export interface prop {
  id: number;
  name: string;
  date: Date;
  isComplete: boolean;
  onCheckButton: (id: number) => void;
  onEditButton: (id: number, name: string, date: Date) => void;
  onDeleteButton: (id: number) => void;
}

const Todo: React.FC<prop> = ({
  id,
  name,
  date,
  isComplete,
  onCheckButton,
  onEditButton,
  onDeleteButton,
}) => {
  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [taskFrom] = Form.useForm();

  const onFinish = (values: FormValues) => {
    //return json key is name and value is value in that field
    console.log(values);
    setIsEditModal(false);
    onEditButton(id, values.taskName, values.date.toDate());
  };
  //can use multiple useeffect
  useEffect(() => {}, [isEditModal, isDeleteModal]);
  return (
    <TodoBlock>
      {/* for 2 little info block width = 70%*/}
      <div style={{ width: '70%' }}>
        <InfoBlock>Name: {name}</InfoBlock>
        <InfoBlock>Date: {date.toLocaleDateString('en-GB')}</InfoBlock>
      </div>
      {/* for iscomplete and mark as complete or unmark width = 30% */}
      <div
        style={{
          width: '30%',
          display: 'flex',
          alignItems: 'center',
          //   justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        <div
          style={{
            marginRight: '5px',
            display: 'flex',
            justifyContent: 'center',
            // width: '40%',
          }}
        >
          <StyledCheckBox
            defaultChecked={isComplete}
            onChange={() => {
              onCheckButton(id);
            }}
          ></StyledCheckBox>
        </div>
        <Modal
          open={isEditModal}
          okText='Confirm'
          cancelText='Cancel'
          onCancel={() => {
            setIsEditModal(false);
            taskFrom.resetFields();
          }}
          onOk={() => {
            taskFrom.validateFields().then((values) => {
              taskFrom.resetFields();
              onFinish(values);
            });
          }}
        >
          <div style={{ marginBottom: '5%' }}>
            Please enter task information
          </div>
          <Form
            form={taskFrom}
            // onFinish={onFinish} in the example we do not have submit we call onFinish in the modal confirm button
            // if we want this to work we need to add submit in this form component
            initialValues={{ taskName: name, date: dayjs(date) }}
            {...formLayout}
          >
            <Form.Item
              name='taskName'
              label='Name'
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name='date' label='Date' rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
        <Button
          onClick={() => setIsEditModal(true)}
          backgroundColor='steelblue'
        >
          Edit
        </Button>
        <Modal
          okButtonProps={{ style: { backgroundColor: 'steelblue' } }}
          onOk={() => {
            onDeleteButton(id);
            setIsDeleteModal(false);
          }}
          onCancel={() => {
            setIsDeleteModal(false);
          }}
          open={isDeleteModal}
          title={`Are you sure to delete task ${name} on ${date.toLocaleDateString(
            'en-GB'
          )}?`}
        ></Modal>
        <Button
          onClick={() => {
            setIsDeleteModal(true);
          }}
          backgroundColor='red'
        >
          Delete
        </Button>
      </div>
    </TodoBlock>
  );
};

export default Todo;
