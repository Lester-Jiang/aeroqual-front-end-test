import type { ColumnsType } from 'antd/es/table';
import { Input, Modal, InputNumber, Form, Popover, Row, Col, Button, message } from "antd";
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import {getMembers, deleteMembers, postMembers} from '../AxiosAPI'


//antd style
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 }
};

//antd component type
interface DataType {
  id: number;
  name: string;
  age: number;
  key:number;
}

const Home = () => {
  //antd component
  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
  
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popover
        content={
          <div>
            <Button onClick={() => { handleVisible(record); }}>Cancel</Button>
            <Button type="primary" onClick={() => { handleConfirm(record); }}>Confirm</Button>
          </div>
        }
          title="Are you sure to delete?"
          trigger="click"
          visible={keyValue === record.key && visible}
          onVisibleChange={() => { handleVisible(record); }}
        >
          <a>Delete</a>
        </Popover>
      ),
    },
  ];

  const [tableData, setTableData] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [mounted, setMounted] = useState(false);
  const [keyValue, setKeyValue] = useState<number>(-1);
  const [visible, setVisible] = useState<boolean>(false);
  
  //get the members from backend
  const fetchData = async () => {
    const result = await getMembers('/People');
    let data = result.data.map((item:any)=>{
      return{
        ...item,
        key:item.id
      }
    })
    setTableData(data);
  }

  //delete popConfirm will pop up 
  const handleVisible = (record:any) => {
    setKeyValue(record.key);
    if (visible) {
      setVisible(!visible);
      setKeyValue(-1);
    } else {
      setVisible(!visible);
      setKeyValue(record.key);
    }
  };

  //confirm to delete the member
  const handleConfirm = (record: any) => {
    setVisible(!visible);
    setKeyValue(-1);
    deleteMembers('/People?id=', `${record.id}`).then(()=>{
      fetchData();
      success("Successful Delete A Person");
    }).catch(()=>{
      error("Unsuccessful Delete A Person");
    });
  };

  //cancel delete popConfirm
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(()=>{
    fetchData();
    setMounted(true);
  },[])

  //when you successful add or delete a person, the success message will pop up
  const success = (info:string) => {
    message.success(info);
  };

  //when you unsuccessful add or delete a person, the error message will pop up
  const error = (info:string) =>{
    message.error(info);
  }

  //the add members model will pop up
  const showModal = () => {
    setIsModalVisible(true);
  };

  //when users click submit in add members model, this function will be called to submit information to backend 
  //updating web page
  const onCreate = (values:any) => {
    setIsModalVisible(false);
    values = {
      name: values.name,
      age: values.age
    };
    postMembers("/People", values).then(()=>{
      fetchData();
      success('Successful Adds A Person');
    }).catch(()=>{
      error("Only Allows Members With An E Or e In Their Name");
    })
  };

  return (
    mounted &&
    <div>
      <div>
        <Row gutter={16}>
          <Col className="gutter-row" span={3}>
          </Col>
          <Col className="gutter-row" span={18}>
            <Table columns={columns} dataSource={tableData}/>
          </Col>
          <Col className="gutter-row" span={3}>
            <Button type="primary" onClick={showModal}>+ Add</Button>
          </Col>
        </Row>
      </div>
      <div>
          <Modal title="Add E Society's member" forceRender visible={isModalVisible} onCancel={handleCancel} okText={"submit"} cancelText="cancel"
                onOk={() => {
                  form
                    .validateFields()
                    .then(values => {
                      form.resetFields();
                      onCreate(values);
                    })
                    .catch(info => {
                      console.log("Validate Failed:", info);
                    });
                }}
              >
                <Form {...layout} form={form} name="nest-messages">
                  <Form.Item name={"age"} label="Age" rules={[{ required: true }]}>
                    <InputNumber />
                  </Form.Item>
                  <Form.Item name={"name"} label="Name" rules={[{ required: true }]}>
                    <Input/>
                  </Form.Item>
                </Form>
          </Modal>
        </div>
    </div>
  )
}

export default Home
