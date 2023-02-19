import React, { useEffect } from 'react';
import styled from 'styled-components'; //npm i --save-dev @types/styled-components
import Todo from './Todo';
import { useState } from 'react';
import { Button, Form, Modal, Input, DatePicker, Checkbox } from 'antd';
import { Dayjs } from 'dayjs';
import { useForm } from 'rc-field-form';
// import { task } from './Todo'; //can import interface of other interface

const Page = styled.div`
  // max-width: 500px;
  width: 50%;
  max-height: 50%;
  margin: 30px auto;
  overflow: auto;
  min-height: 300px;
  border: 1px solid steelblue;
  padding: 30px;
  border-radius: 5px;
`;

const formLayout = {
  //ant use 24 col grid so if want full set that the sum is 24
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

interface FormValues {
  name: string;
  date: Dayjs;
  isComplete: boolean;
}
interface task {
  id: number;
  name: string;
  date: Date;
  isComplete: boolean;
}
const TodoList: React.FC = () => {
  const [tasklist, setTasklist] = useState<task[]>([]);
  const [addForm] = Form.useForm();
  const [isAdd, setIsAdd] = useState(false);
  const [id, setId] = useState(0);

  const onEditButton = (id: number, name: string, date: Date) => {
    setTasklist((tasklist) =>
      tasklist.map((task) =>
        task.id == id ? { ...task, name: name, date: date } : task
      )
    );
  };

  const onDeleteButton = (id: number) => {
    setTasklist((tasklist) => tasklist.filter((task) => task.id != id));
  };

  const onCheckButton = (id: number) => {
    setTasklist((tasklist) =>
      tasklist.map((task) =>
        task.id == id ? { ...task, isComplete: !task.isComplete } : task
      )
    );
  };

  const onFinish = (values: FormValues) => {
    console.log(values);
    setIsAdd(false);
    setTasklist([
      ...tasklist,
      {
        id: id,
        name: 'eee',
        date: values.date.toDate(),
        isComplete: values.isComplete,
      },
    ]);
    setId(id + 1);
  };

  useEffect(() => {
    setTasklist([
      { id: 1, name: 'Todo1', date: new Date(), isComplete: true },
      { id: 2, name: 'Todo1', date: new Date(), isComplete: true },
      { id: 3, name: 'Todo1', date: new Date(), isComplete: true },
    ]);
    setId(4);
  }, []);

  useEffect(() => {
    console.log(tasklist);
  }, [tasklist]);

  return (
    <Page>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Task list</h1>
        <Button
          style={{ backgroundColor: 'pink' }}
          onClick={() => {
            setIsAdd(true);
          }}
        >
          Add
        </Button>
        <Modal
          open={isAdd}
          onCancel={() => {
            addForm.resetFields();
            setIsAdd(false);
          }}
          onOk={() => {
            addForm
              .validateFields()
              .then((values) => {
                onFinish(values);
                addForm.resetFields();
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <div style={{ marginBottom: '5%' }}>
            Please enter task information
          </div>
          <Form
            form={addForm}
            {...formLayout}
            initialValues={{ isComplete: false }}
          >
            <Form.Item
              name='taskName'
              label='name'
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name='date' label='date' rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item
              name='isComplete'
              label='isComplete'
              valuePropName='checked'
            >
              <Checkbox></Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      {tasklist.map((task) => (
        <Todo
          key={task.id}
          id={task.id}
          name={task.name}
          date={task.date}
          isComplete={task.isComplete}
          onCheckButton={onCheckButton}
          onEditButton={onEditButton}
          onDeleteButton={onDeleteButton}
        ></Todo>
      ))}
    </Page>
  );
};

export default TodoList;
