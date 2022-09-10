import {
    Form,
    Input,
    Button,
    Checkbox,
    InputNumber,
    Radio,
    Calendar,
    TimePicker,
    DatePicker,
    CheckboxOptionType,
    Select,
    Table,
    Modal,
  } from "antd";
  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import moment from "moment";
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  
  const Referees = () => {
    const [playerOptions, setPlayerOptions] = useState([]);
    const [showAddRefereeModal, setShowAddRefereeModal] = useState(false);
    const [cityOptions, setCityOptions] = useState([]);
    const [refereeDataSource, setRefereeDataSource] = useState([]);
    const [forceReload, setForceReload] = useState(false);
  
    const refereeColumns = [
      {
        title: "Imię i nazwisko",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Id sędziego",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Wiek",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Liczba sędziowanych meczy",
        dataIndex: "matches",
        key: "matches",
      }
      ,{
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Button onClick={() => {
            handleRemoveReferee(record.id)
          }}>
            Usuń
          </Button>
        ),
      },
    ];
    const handleRemoveReferee = async (id) => {
        await axios.delete("/referee", {data : {
            id: id
        }}).then((res) => {
        });
        setForceReload(!forceReload);
    };
    const handleAddRefereeCancel = () => {
      setShowAddRefereeModal(!showAddRefereeModal);
    };
  
    const onAddRefereeFormSubmit = async (value) => {
      await axios.post("/referee", value).then((res) => {
        console.log(res);
      });
      setShowAddRefereeModal(!showAddRefereeModal);
      setForceReload(!forceReload);
    };
  
    useEffect(() => {
      const getRefereeOptions = () => {
        axios
          .get(`/referee`)
          .then((res) => {
            console.log(res.data.arrayToReturns);
            let newOptArray = [];
            for (const x of res.data.arrayToReturn) {
              console.log(x);
              newOptArray.push({
                name: x.refereeName,
                id: x.refId,
                age: x.age,
                matches: x.matches | "brak danych",
              });
            }
            console.log(newOptArray);
            setRefereeDataSource([...newOptArray]);
          })
          .catch((e) => {
            window.alert(e.message);
          });
      };
  
      return getRefereeOptions();
    }, [forceReload]);

    useEffect(() => {
        console.log('');
    }, [refereeDataSource])
  
    return (
      <>
        <Table dataSource={refereeDataSource} columns={refereeColumns} />
        <Button
          className="flex mx-auto"
          onClick={() => {
            setShowAddRefereeModal(!showAddRefereeModal);
          }}
        >
          Dodaj sędziego
        </Button>
        <Modal
          title="Dodaj sędziego"
          open={showAddRefereeModal}
          // onOk={handleAddCity}
          onCancel={handleAddRefereeCancel}
          width={600}
          footer={[
            <Button key="back" onClick={handleAddRefereeCancel}>
              Zamknij
            </Button>,
          ]}
        >
          <Form
            name="addReferee"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            className="bg-dutchwhite p-4"
            onFinish={onAddRefereeFormSubmit}
          >
            <Form.Item
              label="Imię i nazwisko"
              name="name"
              rules={[{ required: true, message: "Proszę podać nazwę miasta!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Wiek"
              name="age"
              rules={[{ required: true, message: "Proszę podać wiek!" }]}
              defaultValue={18}
            >
              <InputNumber min={16} defaultValue={18} max={100} />
            </Form.Item>
            <Form.Item
              label="Legitymacja"
              name="refId"
              rules={[{ required: true, message: "Proszę podać wiek!" }]}
              defaultValue={18}
            >
              <Input/>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" className="bg-blue-700" htmlType="submit">
                Dodaj
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );  };
  
  export default Referees;
  