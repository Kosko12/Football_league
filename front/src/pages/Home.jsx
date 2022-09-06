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
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
const { Option } = Select;

const Home = () => {
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [showAddNewCity, setAddNewCity] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [showAddNewStadium, setAddNewStadium] = useState(false);


  const dataSource = [
    {
      key: "1",
      team: "Wisła Płock",
      match: 8,
      points: 17,
      win: 5,
      draw: 2,
      lost: 1,
    },
    {
      key: "2",
      team: "Legia Warszawa",
      match: 8,
      points: 17,
      win: 5,
      draw: 2,
      lost: 1,
    },
  ];
  const columns = [
    {
      title: "Zespół",
      dataIndex: "team",
      key: "team",
    },
    {
      title: "Mecze",
      dataIndex: "match",
      key: "match",
    },
    {
      title: "Punkty",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "Zwycięstwa",
      dataIndex: "win",
      key: "win",
    },
    {
      title: "Remisy",
      dataIndex: "draw",
      key: "draw",
    },
    {
      title: "Przegrane",
      dataIndex: "lost",
      key: "lost",
    },
  ];

  const createTeam = (data) => {
    console.log(data);
    axios.post('/team', data).then(res => {console.log(res)})
  }



  useEffect( () => {  
    const getCityOptions = () => {
        axios.get('/city').then(res => {
            console.log(res.data.arrayToReturns)
            let newOptArray = [];
            for (const x of res.data.arrayToReturn){
                console.log(x);
                newOptArray.push({label: x.clubName,value: x.clubName})
            }
            console.log(newOptArray);
            setCityOptions(newOptArray);
        })
    }
    if(!showAddNewCity){
       return getCityOptions();
    }
    return; 
  }, [showAddNewCity])

  return (
    <>
      <Table dataSource={dataSource} columns={columns} />;
        {
            showAddTeamForm ? 
            <div>
                <Button className="flex mx-auto" onClick={() => {setShowAddTeamForm(!showAddTeamForm)}}>Schowaj formularz</Button>
                <Form
                    name="addTeam"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 8 }}
                    className="bg-dutchwhite p-4"
                    onFinish={createTeam}  
                >
                    <Form.Item
                        label="Nazwa zespołu"
                        name="name"
                        rules={[{ required: true, message: "Please select date!" }]}
                    >
                        <Input/>
                    </Form.Item>
                    <div className="w-full flex flex-col items-center">
                        <Checkbox className="flex mx-auto" checked={showAddNewCity} onChange={() => {setAddNewCity(!showAddNewCity)}}>Dodaj nowe miasto</Checkbox>
                    </div>
                    {
                        showAddNewCity ?
                        <Form.Item
                            label="Nazwa miasta"
                            name="city"
                            rules={[{ required: true, message: "Please select date!" }]}
                        >
                            <Input/>
                        </Form.Item>
                        :
                        <Form.Item
                            label="Nazwa miasta"
                            name="city"
                            rules={[{ required: true, message: "Please select date!" }]}
                        >
                            <Select options={cityOptions}/>
                        </Form.Item>
                    }
                    

                    <Form.Item
                        label="Nazwa stadionu"
                        name="stadium"
                        rules={[{ required: true, message: "Please select date!" }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" className="bg-blue-700" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            :
            <Button className="flex mx-auto" onClick={() => {setShowAddTeamForm(!showAddTeamForm)}}>Dodaj zespół</Button>

        }
    </>
  );
};

export default Home;
