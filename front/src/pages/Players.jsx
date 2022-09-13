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

const Players = () => {
  const [playerOptions, setPlayerOptions] = useState([]);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [teamOptions, setTeamOptions] = useState([]);
  const [playerDataSource, setPlayerDataSource] = useState([]);
  const [forceReload, setForceReload] = useState(false);

  const playerColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Imię i nazwisko",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Wiek",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Zespół",
      dataIndex: "team",
      key: "team",
    },
    {
      title: "Wynagrodzenie",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "Koniec kontraktu",
      dataIndex: "contractEnds",
      key: "contractEnds",
    },
    ,
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          onClick={() => {
            handleRemovePlayer(record.id);
          }}
        >
          Usuń
        </Button>
      ),
    },
  ];
  const handleRemovePlayer = async (id) => {
    await axios
      .delete("/player", {
        data: {
          id: id,
        },
      })
      .then((res) => {});
    setForceReload(!forceReload);
  };
  const roleOptions = [
    {
      label: "BR",
      value: "BR",
    },
    {
      label: "LO",
      value: "LO",
    },
    {
      label: "PO",
      value: "PO",
    },
    {
      label: "SO",
      value: "SO",
    },
    {
      label: "LP",
      value: "LP",
    },
    {
      label: "PP",
      value: "PP",
    },
    {
      label: "SP",
      value: "SP",
    },
    {
      label: "N",
      value: "N",
    },
  ];

  const handleAddPlayerCancel = () => {
    setShowAddPlayerModal(!showAddPlayerModal);
  };
  const handleEditPlayerCancel = () => {
    setShowEditPlayerModal(!showEditPlayerModal);
  };

  const onAddPlayerFormSubmit = async (value) => {
    await axios.post("/player", value).then((res) => {
      console.log(res);
    });
    setShowAddPlayerModal(!showAddPlayerModal);
  };
  const onEditPlayerFormSubmit = async (value) => {
    await axios.patch("/player", value).then((res) => {
      console.log(res);
    });
    setShowEditPlayerModal(!showEditPlayerModal);
    setForceReload(!forceReload);
  };

  useEffect(() => {
    const getTeamOptions = () => {
      axios
        .get("/team")
        .then((res) => {
          console.log(res.data.arrayToReturns);
          let newOptArray = [];
          for (const x of res.data.arrayToReturn) {
            console.log(x);
            newOptArray.push({ label: x.teamName, value: x.teamName });
          }
          console.log(newOptArray);
          setTeamOptions([...newOptArray]);
        })
        .catch((e) => {
          window.alert(e.message);
        });
    };

    return getTeamOptions();
  }, [showAddPlayerModal, forceReload]);

  useEffect(() => {
    const getPlayerInfo = () => {
      axios
        .get(`/players`)
        .then((res) => {
          console.log(res.data.arrayToReturns);
          let newOptArray = [];
          for (const x of res.data.arrayToReturn) {
            console.log(x);
            newOptArray.push({
              id: x.id,
              name: x.playerName,
              age: x.age,
              team: x.teamName,
              salary: x.salary,
              contractEnds:
                x.endsAt.year + "-" + x.endsAt.month + "-" + x.endsAt.day,
            });
          }
          console.log(newOptArray);
          setPlayerDataSource(newOptArray);
        })
        .catch((e) => {
          window.alert(e.message);
        });
    };

    return getPlayerInfo();
  }, [showAddPlayerModal, forceReload]);

  return (
    <>
      <Table dataSource={playerDataSource} columns={playerColumns} />
      <div className="flex mx-auto">
        <Button
          className="flex mx-auto"
          onClick={() => {
            setShowAddPlayerModal(!showAddPlayerModal);
          }}
        >
          Dodaj zawodnika
        </Button>
        <Button
          className="flex mx-auto"
          onClick={() => {
            setShowEditPlayerModal(!showEditPlayerModal);
          }}
        >
          Zmiana kontraktu zawodnika
        </Button>
      </div>
      {/* DOdaj zawodnika */}
      <Modal
        title="Dodaj zawodnika"
        open={showAddPlayerModal}
        // onOk={handleAddCity}
        onCancel={handleAddPlayerCancel}
        width={600}
        footer={[
          <Button key="back" onClick={handleAddPlayerCancel}>
            Zamknij
          </Button>,
        ]}
      >
        <Form
          name="addPlayer"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          className="bg-dutchwhite p-4"
          onFinish={onAddPlayerFormSubmit}
        >
          <Form.Item
            label="Imię i nazwisko"
            name="playerName"
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Wiek"
            name="age"
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
            defaultValue={18}
          >
            <InputNumber min={16} defaultValue={18} max={100} />
          </Form.Item>
          <Form.Item
            label="Zespół"
            name="teamName"
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
          >
            <Select options={teamOptions} />
          </Form.Item>
          <Form.Item
            label="Pozycja"
            name="role"
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
          >
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item
            label="Wynagrodzenie"
            name="salary"
            rules={[{ required: true, message: "Proszę podać wynagrodznie!" }]}
          >
            <InputNumber min={2400} />
          </Form.Item>
          <Form.Item
            label="Okres trwania"
            name="contractPeriod"
            rules={[
              { required: true, message: "Proszę podać zakres kontraktu!" },
            ]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" className="bg-blue-700" htmlType="submit">
              Dodaj
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Edytuj zawodnika */}
      <Modal
        title="Edytuj zawodnika"
        open={showEditPlayerModal}
        // onOk={handleAddCity}
        onCancel={handleEditPlayerCancel}
        width={600}
        footer={[
          <Button key="back" onClick={handleEditPlayerCancel}>
            Zamknij
          </Button>,
        ]}
      >
        <Form
          name="editPlayer"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          className="bg-dutchwhite p-4"
          onFinish={onEditPlayerFormSubmit}
        >
          <Form.Item
            label="Id zawodnika"
            name="id"
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Zespół"
            name="teamName"
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
          >
            <Select options={teamOptions} />
          </Form.Item>
          <Form.Item
            label="Pozycja"
            name="role"
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
          >
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item
            label="Wynagrodzenie"
            name="salary"
            rules={[{ required: true, message: "Proszę podać wynagrodznie!" }]}
          >
            <InputNumber min={2400} />
          </Form.Item>
          <Form.Item
            label="Okres trwania"
            name="contractPeriod"
            rules={[
              { required: true, message: "Proszę podać zakres kontraktu!" },
            ]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" className="bg-blue-700" htmlType="submit">
              Dodaj
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Players;
