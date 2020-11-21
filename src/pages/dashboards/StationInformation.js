import React from "react";
import { Link } from "react-router-dom";
import {
    Card,
    CardBody,
    Col,
} from "reactstrap";
import { Tabs, Tab } from "react-bootstrap";
import TreeIcon from "../../assets/img/photos/tree_icon.png";
import DateIcon from "../../assets/img/photos/date.png";
import GreenHouse from "../../assets/img/photos/greenhouse.png";
import Clock from "../../assets/img/photos/clock.png";
import UserIcon from "../../assets/img/photos/user.png";
import Temperature from "../../assets/img/photos/temperature.png";
import Light from "../../assets/img/photos/light.png";
import SM from "../../assets/img/photos/sm.png";
import PH from "../../assets/img/photos/p.png";
import Hum from "../../assets/img/photos/h.png";
import { CustomImg } from "../../components/CustomTag";
import moment from 'moment';
import "./Db.css";
import Map from "./Map";
class StationInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "1",
            value: null,
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        const { data } = this.props;   
        console.log(data);
             
        return (
            <React.Fragment>
                <Tabs defaultActiveKey='info'>
                    <Tab eventKey='info' title='Thông tin vườn ươm'>
                        <Card className='flex-fill w-100' style={{ height: 607, width: "100%" }}>
                            <CardBody className='my-0'>
                                <Col className='mb-3 p-0'>
                                    <Map lat="20.905832" long="105.708198" data={data}/>
                                </Col>
                                <h3 className='text-center'>{data.name}</h3>
                                <ul className='list-unstyled mb-0'>
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={Clock}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        Giai đoạn:{" "}
                                        <Link to='#'>
                                            {   
                                                data.stage.name === "germination stage" ? "Cây con" : ""||
                                            
                                                data.stage.name === "development stage" ? "Cây trưởng thành" : ""||
                                            
                                                data.stage.name === "harvest stage" ? "Thu hoạch" : ""  
                                            }
                                        </Link>
                                    </li>       
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={GreenHouse}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        /> Gateway:{" "}
                                        <Link to='#'>{data.sub_id}</Link>
                                    </li>
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={TreeIcon}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                         Hạt giống:{" "}
                                        <Link to='#'>
                                            {
                                            data.seed_name === "tomato" ? "Cà chua" : ""||
                                            data.seed_name === "cucumber" ? "Dưa chuột" : ""||
                                            data.seed_name === "pakchoi" ? "Cải chíp" : ""||
                                            data.seed_name === "brassica" ? "Cải ngọt" : ""||
                                            data.seed_name === "cabbage" ? "Bắp cải" : ""
                                            }
                                        </Link>
                                    </li>
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={DateIcon}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        Ngày gieo hạt:{" "}
                                        <Link to='#'>
                                            { moment(data.started_plant).format('DD-MM-YYYY')}
                                        </Link>
                                    </li>
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={UserIcon}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        Người quản lí: <Link to='#'>{data.manager.full_name}</Link>
                                    </li>        
                                </ul>
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab eventKey='map' title='Trạng thái cây'>
                        <Card className='flex-fill w-100' style={{ height:  607, width: "100%" }}>
                        <CardBody className='my-0'>
                                <ul className='list-unstyled mb-0'>
                                        <h3 className="text-center h3 text-primary mb-4">
                                            {   
                                                data.stage.name === "germination stage" ? "Gieo hạt" : ""||
                                            
                                                data.stage.name === "development 1 stage" ? "Ra hoa" : ""||
                                            
                                                data.stage.name === "development 2 stage" ? "Phát triển" : ""||
                                            
                                                data.stage.name === "harvest stage" ? "Thu hoạch" : ""  
                                            }
                                        </h3>  
                                    <li className='mb-4 h4 d-flex align-items-center'>
                                        <CustomImg  
                                            src={Temperature}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        <div>
                                            <p className='mb-1 d-flex'>Ngưỡng trên: <p className="text-primary pl-1 mb-1">{data.stage.min_temp}℃</p></p>
                                            <p className='mb-1 d-flex'>Ngưỡng dưới: <p className="text-primary pl-1 mb-1">{data.stage.max_temp}℃</p></p>    
                                        </div>
                                        
                                    </li>

                                    <li className='mb-4 h4 d-flex align-items-center'>
                                        <CustomImg  
                                            src={Light}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        <div>
                                            <p className='mb-1 d-flex'>Ngưỡng trên: <p className="text-primary pl-1 mb-1">{data.stage.min_light} Lux</p></p>
                                            <p className='mb-1 d-flex'>Ngưỡng dưới: <p className="text-primary pl-1 mb-1">{data.stage.max_light} Lux</p></p>    
                                        </div>
                                    </li>
                                    <li className='mb-4 h4 d-flex align-items-center'>
                                        <CustomImg  
                                            src={SM}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        <div>
                                            <p className='mb-1 d-flex'>Ngưỡng trên: <p className="text-primary pl-1 mb-1">{data.stage.min_soil_moisture}%</p></p>
                                            <p className='mb-1 d-flex'>Ngưỡng dưới: <p className="text-primary pl-1 mb-1">{data.stage.max_soil_moisture}%</p></p>    
                                        </div>
                                    </li>
                                    <li className='mb-4 h4 d-flex align-items-center'>
                                        <CustomImg  
                                            src={Hum}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        <div>
                                            <p className='mb-1 d-flex'>Ngưỡng trên: <p className="text-primary pl-1 mb-1">{data.stage.min_hum}%</p></p>
                                            <p className='mb-1 d-flex'>Ngưỡng dưới: <p className="text-primary pl-1 mb-1">{data.stage.max_hum}%</p></p>    
                                        </div>
                                    </li>
                                </ul>
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>
            </React.Fragment>
        );
    }
}

export default StationInformation;
