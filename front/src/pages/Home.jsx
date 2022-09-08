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
  const [stadiumOptions, setStadiumOptions] = useState([]);
  const [showAddNewStadium, setAddNewStadium] = useState(false);
  const [currentCityOption, setCurrentCityOption] = useState(null);

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

  const handleCityCheckbox = () => {
    if(showAddNewCity){
      setCityOptions([]);
    }
    setAddNewCity(!showAddNewCity);
  }
  const handleStadiumCheckbox = () => {
    if(showAddNewStadium){
      setStadiumOptions([]);
    }
    setAddNewStadium(!showAddNewStadium);
  }

  useEffect( () => {  
    const getCityOptions = () => {
        axios.get('/city')
        .then(res => {
            console.log(res.data.arrayToReturns)
            let newOptArray = [];
            for (const x of res.data.arrayToReturn){
                console.log(x);
                newOptArray.push({label: x.clubName,value: x.clubName})
            }
            console.log(newOptArray);
            setCityOptions(newOptArray);
        })
        .catch(e => {
          window.alert(e.message);

        }) 
    }
    const getStadiumOptions = () => {
      console.log(currentCityOption);
      if(currentCityOption !== null){
        axios.get(`/stadium/${currentCityOption}`)
        .then(res => {
          console.log(res.data.arrayToReturns)
          let newOptArray = [];
          for (const x of res.data.arrayToReturn){
              console.log(x);
              newOptArray.push({label: x.stadiumName,value: x.stadiumName})
          }
          console.log(newOptArray);
          setStadiumOptions(newOptArray);
      })
      .catch(e => {
        window.alert(e.message);
      }) 
      }
      
  }
    if(!showAddNewCity){
      if(!showAddNewStadium){
        console.log('here');
        getStadiumOptions();
      }
       return getCityOptions();
    }
    return; 
  }, [showAddNewCity, showAddNewStadium, currentCityOption])

  

  return (
    <>
      <Table dataSource={dataSource} columns={columns} />;
        {
            showAddTeamForm ? 
            <div>
                <Button className="flex mx-auto my-2" onClick={() => {setShowAddTeamForm(!showAddTeamForm)}}>Schowaj formularz</Button>
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
                        rules={[{ required: true, message: "Proszę podać nazwę klubu!" }]}
                    >
                        <Input/>
                    </Form.Item>
                    <div className="w-full flex flex-col items-center">
                        <Checkbox className="flex mx-auto py-2" checked={showAddNewCity} onChange={handleCityCheckbox}>Dodaj nowe miasto</Checkbox>
                    </div>
                    {
                        showAddNewCity ?
                        <Form.Item
                            label="Nazwa miasta"
                            name="city"
                            rules={[{ required: true, message: "Proszę podać nazwę miasta!" }]}
                        >
                            <Input/>
                        </Form.Item>
                        :
                        <Form.Item
                            label="Nazwa miasta"
                            name="city"
                            rules={[{ required: true, message: "Proszę podać nazwę miasta!" }]}
                            
                        >
                            <Select onChange={(val) => {setCurrentCityOption(val);}} options={cityOptions}/>
                        </Form.Item>
                    }
                    <div className="w-full flex flex-col items-center">
                        <Checkbox className="flex mx-auto py-2" checked={showAddNewStadium} onChange={handleStadiumCheckbox}>Dodaj nowy stadion</Checkbox>
                    </div>
                    {
                      showAddNewStadium ?
                      <Form.Item
                        label="Nazwa stadionu"
                        name="stadium"
                        rules={[{ required: true, message: "Proszę podać nazwę stadionu!" }]}
                    >
                        <Input/>
                    </Form.Item>
                    :
                    <Form.Item
                        label="Nazwa stadionu"
                        name="stadium"
                        rules={[{ required: true, message: "Proszę podać nazwę stadionu!" }]}
                    >
                        <Select options={stadiumOptions}/>
                    </Form.Item>
                    }
                    
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
