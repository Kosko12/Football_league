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

const Matches = () => {
  const [currentHost, setCurrentHost] = useState(null);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [hostOptions, setHostOptions] = useState([]);
  const [guestOptions, setGuestOptions] = useState([]);
  const [matchDataSource, setMatchDataSource] = useState([]);
  const [forceReload, setForceReload] = useState(false);

  const matchColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Gospodarz",
      dataIndex: "host",
      key: "host",
    },
    {
      title: "Gość",
      dataIndex: "guest",
      key: "guest",
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Stadion",
      dataIndex: "stadium",
      key: "stadium",
    },{
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => {
          handleRemoveMatch(record.id)
        }}>
          Usuń
        </Button>
      ),
    },
  ];
  const handleRemoveMatch = async (id) => {
    await axios.delete("/match", {data : {
      id: id,
    }}).then((res) => {
    });
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

  const handleAddMatchCancel = () => {
    setShowAddMatchModal(!showAddMatchModal);
  };

  const onAddMatchFormSubmit = async (value) => {
    await axios.post("/match", value).then((res) => {
      console.log(res);
    });
    setShowAddMatchModal(!showAddMatchModal);
  };

  const getGuestOptions = (value) => {
    axios
      .get("/team/guest/" + value)
      .then((res) => {
        console.log(res.data.arrayToReturn);
        let newOptArray = [];
        for (const x of res.data.arrayToReturn) {
          console.log(x);
          newOptArray.push({ label: x.teamName, value: x.teamName });
        }
        console.log(newOptArray);
        setGuestOptions([...newOptArray]);
      })
      .catch((e) => {
        window.alert(e.message);
      });
  };

  useEffect(() => {
    const getMatches = () => {
      axios
        .get("/match")
        .then((res) => {
          console.log(res.data.arrayToReturns);
          let newOptArray = [];
          for (const x of res.data.arrayToReturn) {
            console.log(x);
            newOptArray.push({ 
              id: x.id, 
              host: x.host, 
              guest: x.guest,
              date: x.endsAt.year + "-" + x.endsAt.month + "-" + x.endsAt.day              ,
              stadium: x.stadium,            
            });
          }
          console.log(newOptArray);
          setMatchDataSource([...newOptArray]);
        })
        .catch((e) => {
          window.alert(e.message);
        });
    }

    const getHostOptions = () => {
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
          setHostOptions([...newOptArray]);
        })
        .catch((e) => {
          window.alert(e.message);
        });
    };

    getMatches();
    if (showAddMatchModal) {
      return getHostOptions();
    }
  }, [showAddMatchModal, forceReload]);

  useEffect(() => {
    return;
  }, [guestOptions]);

  return (
    <>
      <Table dataSource={matchDataSource} columns={matchColumns} />
      <Button
        className="flex mx-auto"
        onClick={() => {
          setShowAddMatchModal(!showAddMatchModal);
        }}
      >
        Dodaj mecz
      </Button>
      <Modal
        title="Dodaj mecz"
        open={showAddMatchModal}
        // onOk={handleAddCity}
        onCancel={handleAddMatchCancel}
        width={600}
        footer={[
          <Button key="back" onClick={handleAddMatchCancel}>
            Zamknij
          </Button>,
        ]}
      >
        <Form
          name="addPlayer"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          className="bg-dutchwhite p-4"
          onFinish={onAddMatchFormSubmit}
        >
          <Form.Item
            label="Gospodarz"
            name="hostName"
            rules={[{ required: true, message: "Proszę wypełnić!" }]}
          >
            <Select
              onChange={(value) => {
                getGuestOptions(value);
              }}
              options={hostOptions}
            />
          </Form.Item>
          <Form.Item
            label="Gość"
            name="guestName"
            rules={[{ required: true, message: "Proszę podać!" }]}
          >
            <Select
              onChange={(value) => {
                getGuestOptions(value);
              }}
              options={guestOptions}
            />
          </Form.Item>
          <Form.Item
            label="Data"
            name="date"
            rules={[{ required: true, message: "Proszę podać !" }]}
          >
            <DatePicker />
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

export default Matches;
