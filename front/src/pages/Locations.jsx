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

const Locations = () => {
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [showAddStadiumModal, setShowAddStadiumModal] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [cityDataSource, setCityDataSource] = useState([]);
  const [stadiumDataSource, setStadiumDataSource] = useState([]);

  const cityColumns = [
    {
      title: "Miasto",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Stadiony",
      dataIndex: "stadiums",
      key: "stadiums",
    },
    {
      title: "Zespoły",
      dataIndex: "teams",
      key: "teams",
    },
  ];
  const stadiumColumns = [
    {
      title: "Miasto",
      dataIndex: "team",
      key: "team",
    },
    {
      title: "Stadiony",
      dataIndex: "stadiums",
      key: "stadiums",
    },
    {
      title: "Zespoły",
      dataIndex: "teams",
      key: "teams",
    },
  ];

  const handleAddCity = () => {};

  const handleAddCityCancel = () => {
    setShowAddCityModal(!showAddCityModal);
  };

  const handleAddStadiumCancel = () => {
    setShowAddStadiumModal(!showAddStadiumModal);
  };

  const onAddCityFormSubmit = (value) => {
    axios.post("/city", value).then((res) => {
      console.log(res);
    });
    setShowAddCityModal(!showAddCityModal);
  };

  const onAddStadiumFormSubmit = (value) => {
    axios.post("/stadium", value).then((res) => {
      console.log(res);
    });
    setShowAddStadiumModal(!showAddStadiumModal);
  };

  useEffect(() => {
    const getCityOptions = () => {
      axios
        .get("/city")
        .then((res) => {
          console.log(res.data.arrayToReturns);
          let newOptArray = [];
          for (const x of res.data.arrayToReturn) {
            console.log(x);
            newOptArray.push({ label: x.clubName, value: x.clubName });
          }
          console.log(newOptArray);
          setCityOptions(newOptArray);
        })
        .catch((e) => {
          window.alert(e.message);
        });
    };

    const getCitiesInfo = () => {
      axios
        .get(`/city-add-info`)
        .then((res) => {
          console.log(res.data.arrayToReturns);
          let newOptArray = [];
          for (const x of res.data.arrayToReturn) {
            console.log(x);
            newOptArray.push({
              city: x.cityName,
              stadiums: x.stadiums,
              teams: x.teams,
            });
          }
          console.log(newOptArray);
          setCityDataSource(newOptArray);
        })
        .catch((e) => {
          window.alert(e.message);
        });
    };

    getCitiesInfo();
    if (showAddStadiumModal) {
      return getCityOptions();
    }
  }, [showAddStadiumModal]);

  return (
    <>
      <div className="flex flex-col gap-2 py-3">
        <h1 className="flex mx-auto font-bold text-xl">Miasta</h1>
        <Table dataSource={cityDataSource} columns={cityColumns} />;
        <Button
          className="flex mx-auto"
          onClick={() => {
            setShowAddCityModal(!showAddCityModal);
          }}
        >
          Dodaj miasto
        </Button>
        <h1 className="flex mx-auto font-bold text-xl">Stadiony</h1>
        <Table dataSource={stadiumDataSource} columns={stadiumColumns} />;
        <Button
          className="flex mx-auto"
          onClick={() => {
            setShowAddStadiumModal(!showAddStadiumModal);
          }}
        >
          Dodaj stadion
        </Button>
      </div>
      {/* Modals */}
      <Modal
        title="Dodaj miasto"
        open={showAddCityModal}
        // onOk={handleAddCity}
        onCancel={handleAddCityCancel}
        footer={[
          <Button key="back" onClick={handleAddCityCancel}>
            Zamknij
          </Button>,
        ]}
      >
        <Form
          name="addTeam"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          className="bg-dutchwhite p-4"
          onFinish={onAddCityFormSubmit}
        >
          <Form.Item
            label="Nazwa miasta"
            name="name"
            rules={[{ required: true, message: "Proszę podać nazwę miasta!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" className="bg-blue-700" htmlType="submit">
              Dodaj
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Dodaj stadion"
        open={showAddStadiumModal}
        // onOk={handleAddCity}
        onCancel={handleAddStadiumCancel}
        footer={[
          <Button key="back" onClick={handleAddStadiumCancel}>
            Zamknij
          </Button>,
        ]}
      >
        <Form
          name="addStadium"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          className="bg-dutchwhite p-4"
          onFinish={onAddStadiumFormSubmit}
        >
          <Form.Item
            label="Nazwa stadonu"
            name="name"
            rules={[
              { required: true, message: "Proszę podać nazwę stadionu!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Lokalizacja"
            name="cityName"
            rules={[{ required: true, message: "Proszę podać nazwę miasta!" }]}
          >
            <Select options={cityOptions} />
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

export default Locations;
