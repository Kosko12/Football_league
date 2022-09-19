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
  const [showEditStadiumModal, setShowEditStadiumModal] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [cityDataSource, setCityDataSource] = useState([]);
  const [stadiumDataSource, setStadiumDataSource] = useState([]);
  const [forceReload, setForceReload] = useState(false);

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
    },{
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => {
          handleRemoveCity(record.city)
        }}>
          Usuń
        </Button>
      ),
    },
  ];
  const handleRemoveCity = async (name) => {
      await axios.delete("/city", {data : {
          name: name
      }}).then((res) => {
      });
      setForceReload(!forceReload);
  };
  const stadiumColumns = [
    {
      title: "Nazwa stadionu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Id stadionu",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Pojemność kibiców gospodarzy",
      dataIndex: "hostCapacity",
      key: "hostCapacity",
    },
    {
      title: "Pojemność kibiców gości",
      dataIndex: "guestCapacity",
      key: "guestCapacity",
    },
    {
      title: "Miasto",
      dataIndex: "cityName",
      key: "cityName",
    },{
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => {
          handleRemoveStadium(record.name)
        }}>
          Usuń
        </Button>
      ),
    },
  ];
  const handleRemoveStadium = async (name) => {
      await axios.delete("/stadium", {data : {
          name: name
      }}).then((res) => {
      });
      setForceReload(!forceReload);
  };

  const handleAddCity = () => {};

  const handleAddCityCancel = () => {
    setShowAddCityModal(!showAddCityModal);
  };

  const handleAddStadiumCancel = () => {
    setShowAddStadiumModal(!showAddStadiumModal);
  };

  const handleEditStadiumCancel = () => {
    setShowEditStadiumModal(!showEditStadiumModal);
  };

  const onAddCityFormSubmit = (value) => {
    axios.post("/city", value).then((res) => {
    });
    setShowAddCityModal(!showAddCityModal);
  };

  const onAddStadiumFormSubmit = (value) => {
    axios.post("/stadium", value).then((res) => {
    });
    setShowAddStadiumModal(!showAddStadiumModal);
    setForceReload(!forceReload);
  };

  const onEditStadiumFormSubmit = (value) => {
    axios.patch("/stadium", value).then((res) => {
    });
    setShowEditStadiumModal(!showEditStadiumModal);
  };

  useEffect(() => {
    const getCityOptions = () => {
      axios
        .get("/city")
        .then((res) => {
          let newOptArray = [];
          for (const x of res.data.arrayToReturn) {
            newOptArray.push({ label: x.clubName, value: x.clubName });
          }
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
          let newOptArray = [];
          for (const x of res.data.arrayToReturn) {
            newOptArray.push({
              city: x.cityName,
              stadiums: x.stadiums,
              teams: x.teams,
            });
          }
          setCityDataSource(newOptArray);
        })
        .catch((e) => {
          window.alert(e.message);
        });
    };
    const getStadiumInfo = () => {
      axios
        .get(`/stadium`)
        .then((res) => {
          console.log(res.data.arrayToReturns);
          let newOptArray = [];
          for (const x of res.data.arrayToReturn) {
            console.log(x);
            newOptArray.push({
              name: x.stadiumName,
              id: x.id,
              hostCapacity: x.hostCapacity,
              guestCapacity: x.guestCapacity,
              cityName: x.cityName
            });
          }
          console.log(newOptArray);
          setStadiumDataSource(newOptArray);
        })
        .catch((e) => {
          window.alert(e.message);
        });
    };
    getStadiumInfo();
    getCitiesInfo();
    return getCityOptions();
  }, [showAddStadiumModal, forceReload]);

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
        <Button
          className="flex mx-auto"
          onClick={() => {
            setShowEditStadiumModal(!showEditStadiumModal);
          }}
        >
          Edytuj stadion
        </Button>
      </div>
      {/* Modals */}
      {/* Add city */}
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
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Kraj"
            name="country"
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
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
      {/* Add Stadium */}
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
        width={900}
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
            label="Liczność sektoru gospodarzy"
            name="hostCapacity"
            rules={[{ required: true, message: "Proszę podać liczbę!" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Liczność sektoru gości"
            name="guestCapacity"
            rules={[{ required: true, message: "Proszę podać liczbę!" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Lokalizacja"
            name="cityName"
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
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
      {/* Edit stadium */}
      <Modal
        title="Edytuj stadion"
        open={showEditStadiumModal}
        // onOk={handleAddCity}
        onCancel={handleEditStadiumCancel}
        footer={[
          <Button key="back" onClick={handleEditStadiumCancel}>
            Zamknij
          </Button>,
        ]}
        width={900}
      >
        <Form
          name="addStadium"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          className="bg-dutchwhite p-4"
          onFinish={onEditStadiumFormSubmit}
        >
          <Form.Item
            label="Id stadionu"
            name="id"
            rules={[
              { required: true, message: "Proszę podać nazwę stadionu!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Liczność sektoru gospodarzy"
            name="hostCapacity"
            rules={[{ required: true, message: "Proszę podać liczbę!" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Liczność sektoru gości"
            name="guestCapacity"
            rules={[{ required: true, message: "Proszę podać liczbę!" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Lokalizacja"
            name="cityName"
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
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
