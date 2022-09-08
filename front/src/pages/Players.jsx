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
  const [cityOptions, setCityOptions] = useState([]);
  const [playerDataSource, setPlayerDataSource] = useState([]);

  const playerColumns = [
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
      title: "Liczba bramek",
      dataIndex: "goals",
      key: "goals",
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
  ];
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

  const onAddPlayerFormSubmit = (value) => {
    axios.post("/player", value).then((res) => {
      console.log(res);
    });
    setShowAddPlayerModal(!showAddPlayerModal);
  };

  useEffect(() => {
    const getCityOptions = () => {
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
          setCityOptions(newOptArray);
        })
        .catch((e) => {
          window.alert(e.message);
        });
    };

    if (showAddPlayerModal) {
      return getCityOptions();
    }
  }, [showAddPlayerModal]);

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
              name: x.playerName,
              age: x.age,
              goals: x.goals | "brak danych",
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
  }, []);

  return (
    <>
      <Table dataSource={playerDataSource} columns={playerColumns} />
      <Button
        className="flex mx-auto"
        onClick={() => {
          setShowAddPlayerModal(!showAddPlayerModal);
        }}
      >
        Dodaj zawodnika
      </Button>
      <Modal
        title="Dodaj miasto"
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
            rules={[{ required: true, message: "Proszę podać nazwę miasta!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Wiek"
            name="age"
            rules={[{ required: true, message: "Proszę podać nazwę miasta!" }]}
            defaultValue={18}
          >
            <InputNumber min={16} defaultValue={18} max={100} />
          </Form.Item>
          <Form.Item
            label="Zespół"
            name="teamName"
            rules={[{ required: true, message: "Proszę podać nazwę miasta!" }]}
          >
            <Select options={cityOptions} />
          </Form.Item>
          <Form.Item
            label="Pozycja"
            name="role"
            rules={[{ required: true, message: "Proszę podać nazwę miasta!" }]}
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
