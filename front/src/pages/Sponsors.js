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
  
  const Sponsors = () => {
    const [teamOptions, setTeamOptions] = useState([]);
    const [sponsorOptions, setSponsorOptions] = useState([]);
    const [showAddSponsorModal, setShowAddSponsorModal] = useState(false);
    const [showAddContractModal, setShowAddContractModal] = useState(false);
    const [sponsorsDataSource, setSponsorsDataSource] = useState([]);
    const [contractDataSource, setContractDataSource] = useState([]);
    const [forceReload, setForceReload] = useState(false);
  
    const sponsorsColumns = [
      {
        title: "Nazwa sponsora",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Liczba sponsorowanych klubów",
        dataIndex: "sponsoredClubs",
        key: "sponsoredClubs",
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Button onClick={() => {
            handleRemoveSponsor(record.name)
          }}>
            Usuń
          </Button>
        ),
      },
    ];

    const contractColumns = [
      {
        title: "Nazwa sponsora",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Nazwa klubu",
        dataIndex: "clubName",
        key: "clubName",
      },
      {
        title: "Data zakończenia",
        dataIndex: "endDate",
        key: "endDate",
      },{
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Button onClick={() => {
            handleRemoveSponsor(record.name, record.clubName)
          }}>
            Usuń
          </Button>
        ),
      },
    ];
  
    const handleAddSponsorCancel = () => {
      setShowAddSponsorModal(!showAddSponsorModal);
    };
    const handleRemoveSponsor = async (name, clubName) => {
        await axios.delete("/contract", {data : {
            sponsorName: name, clubName: clubName
        }}).then((res) => {
        });
        setForceReload(!forceReload);
    };
    const handleRemoveContract = async (value) => {
        await axios.delete("/contract/" + value).then((res) => {
        });
        setForceReload(!forceReload);
    };
    const handleAddContractCancel = () => {
        setShowAddContractModal(!showAddContractModal);
    };
  
    const onAddSponsorsFormSubmit = async (value) => {
      await axios.post("/sponsor", value).then((res) => {
      });
      setShowAddSponsorModal(!showAddSponsorModal);
      setForceReload(!forceReload);
    };
    const onAddContractFormSubmit = async (value) => {
      await axios.post("/contract", value).then((res) => {
      });
      setShowAddContractModal(!showAddContractModal);
      setForceReload(!forceReload);
    };
  
    useEffect(() => {
      const getSponsorOptions = () => {
        axios
          .get(`/sponsor`)
          .then((res) => {
            let newOptArray = [];
            let newModalArray = [];
            for (const x of res.data.arrayToReturn) {
              newOptArray.push({
                name: x.sponsorName,
                sponsoredClubs: x.sponsoredClubs
              });
              newModalArray.push(
                {label: x.sponsorName,value: x.sponsorName}
              );
            }
            setSponsorsDataSource([...newOptArray]);
            setSponsorOptions([...newModalArray])
          })
          .catch((e) => {
            window.alert(e.message);
          });
      };
      const getContractOptions = () => {
        axios
          .get(`/contract`)
          .then((res) => {
            console.log(res.data.arrayToReturns);
            let newOptArray = [];
            for (const x of res.data.arrayToReturn) {
              console.log(x);
              newOptArray.push({
                name: x.sponsorName,
                clubName: x.clubName,
                endDate: x.endsAt.year + '-' + x.endsAt.month + '-' + x.endsAt.day
              });
            }
            console.log(newOptArray);
            setContractDataSource([...newOptArray]);
          })
          .catch((e) => {
            window.alert(e.message);
          });
      };

      const getTeamOptions = () => {
        axios.get('/team')
        .then(res => {
            let newOptArray = [];
            for (const x of res.data.arrayToReturn){
                newOptArray.push({label: x.teamName,value: x.teamName})
            }
            setTeamOptions(newOptArray);
        })
        .catch(e => {
          window.alert(e.message);

        }) 
    }
    getTeamOptions();
    getContractOptions();
      return getSponsorOptions();
    }, [forceReload]);

    useEffect(() => {
        console.log('');
    }, [sponsorsDataSource, showAddContractModal])
  
    return (
      <>
        <Table dataSource={sponsorsDataSource} columns={sponsorsColumns} />
        <Button
          className="flex mx-auto"
          onClick={() => {
            setShowAddSponsorModal(!showAddSponsorModal);
          }}
        >
          Dodaj Sponsora
        </Button>
        <Table dataSource={contractDataSource} columns={contractColumns} />
        <Button
          className="flex mx-auto"
          onClick={() => {
            setShowAddContractModal(!showAddContractModal);
          }}
        >
          Dodaj kontrakt
        </Button>
        <Modal
          title="Dodaj sponsora"
          open={showAddSponsorModal}
          // onOk={handleAddCity}
          onCancel={handleAddSponsorCancel}
          width={600}
          footer={[
            <Button key="back" onClick={handleAddSponsorCancel}>
              Zamknij
            </Button>,
          ]}
        >
          <Form
            name="addReferee"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            className="bg-dutchwhite p-4"
            onFinish={onAddSponsorsFormSubmit}
          >
            <Form.Item
              label="Nazwa sponsora"
              name="name"
              rules={[{ required: true, message: "Proszę uzupełnić!" }]}
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
          title="Dodaj kontrakt"
          open={showAddContractModal}
          // onOk={handleAddCity}
          onCancel={handleAddContractCancel}
          width={600}
          footer={[
            <Button key="back" onClick={handleAddContractCancel}>
              Zamknij
            </Button>,
          ]}
        >
          <Form
            name="addReferee"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            className="bg-dutchwhite p-4"
            onFinish={onAddContractFormSubmit}
          >
          <Form.Item
            label="Sponsor"
            name="sponsorName"
            rules={[{ required: true, message: "Proszę wypełnic!" }]}
          >
            <Select options={sponsorOptions} />
          </Form.Item>
          <Form.Item
            label="Klub"
            name="clubName"
            rules={[{ required: true, message: "Proszę wypełnic!" }]}
          >
            <Select options={teamOptions} />
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
    );  };
  
  export default Sponsors;
  