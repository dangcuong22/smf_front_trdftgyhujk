import React from "react";
import socketIOClient from "socket.io-client";
import {
    Row, Col,
    Card, CardBody, CardHeader,
    Input, InputGroup, InputGroupAddon,
    Button,
} from "reactstrap";
import "react-sweet-progress/lib/style.css";
import { CustomImg } from "../../components/CustomTag";
import WPlumOn from "../../assets/img/photos/wplum_on.png";
import WPlumOff from "../../assets/img/photos/wplum_off.jpg";
import CurtainOff from "../../assets/img/photos/curtain_off.png";
import CurtainOn from "../../assets/img/photos/curtain_on.png";
import Notification from "../../components/Notification";
import moment from 'moment';
import './ControlStation.css';

const utils = require("../../utils/utils");
const {isEmpty} = require("../../utils/ValidInput");
const config_socket = require("../../config/config").config_socket;
const api = require("./api/api");

let socket;
class Controlstation extends React.Component {
    constructor(props) {
        super(props);
        this.send = this.send.bind(this);
        this.state = {
            endpoint: config_socket.ip,
            data: {
                id: JSON.parse(localStorage.getItem("project")).sub_id,
                status: "O",
            },
            relay_1: {
                value : null,
                battery: null,
                RF_signal: null,
            },
            relay_2: {
                value: null,
                // id: null,
                RF_signal: null,
                battery: null,
            },
            last_update : new Date(),
        };
        this.RSSI = {
            "Perfect": "Tuyệt vời",
            "Good": "Tốt",
            "Medium": "Trung bình",
            "Bad": "Yếu"
        }
        socket = socketIOClient(this.state.endpoint);
    }

    send(name, status) {
        let now = new Date();
        if(Math.abs(now - this.state.last_update) < 2000 ){
            Notification('error',"Không thể thực hiện thao tác quá nhanh","Vui lòng đợi 2 giây và thử lại");
        } else{
            let data = {};
            let relay_1 = {}
            let relay_2 = {}
            data.sub_id = name;
            
            if(status === "00"){
                relay_1.value = "0";
                data.relay_1 = relay_1;
            }
            else if(status === "01"){
                relay_1.value = "1";
                data.relay_1 = relay_1;    
            }
            else if(status === "10"){
                relay_2.value = "0"
                data.relay_2 = relay_2;        
            }
            else if(status === "11"){
                relay_2.value = "1"
                data.relay_2 = relay_2;        
            }
            socket.emit("controller", data);
            this.setState({last_update: new Date()})
        }
    }

    setValueDevice(){
        api.getDataControl((err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
            } else {
                if(!isEmpty(result)){
                    this.setState({
                        "relay_1" : result[0].relay_1,
                        "relay_2" : result[0].relay_2,
                    });
                }
            }
        });
    }

    convertRSSI(inpRSSI){
        if(isEmpty(inpRSSI)) return "NULL";
        try {
            return this.RSSI[inpRSSI];
        } catch (error) {
            return null;
        }
    }

    componentDidMount() {
        const that = this;
        const { endpoint } = this.state;
        const sub_id = utils.getStationInfo().sub_id;
        const socket = socketIOClient(endpoint, {
            query: {
                token: utils.getAuthToken(),
                sub_id: sub_id,
            },
        });
        socket.on("controller_" + sub_id, function(result) {    
            if(!isEmpty(result)){
                if(result.status==='False') return Notification('error',"Đang cập nhật dữ liệu cảm biến","Vui lòng đợi 5 giây và thử lại");
                else{
                    let state = Object.assign({}, this.state);
                    if(!isEmpty(result.relay_1)) state.relay_1 = result.relay_1;
                    if(!isEmpty(result.relay_2)) state.relay_2 = result.relay_2;
                    that.setState(state);
                }
            }   
        });
        socket.on("error", function(err) {});
        this.setValueDevice();
    }

    render() {
        let location = JSON.parse(localStorage.getItem("project")).sub_id;
        console.log(this.state.relay_1, this.state.relay_2,this.state.time);
        return (
            <React.Fragment>
                <Card>
                    <CardHeader>
                        <h1 className='text-center font-weight-bold d-inline mt-4'>
                            Nhà kính {location}
                        </h1>
                        <div className='float-right d-inline '>
                            <h4 className='text-center font-weight-bold'>Thời gian cập nhập:</h4>
                            <h4>
                                {moment().format("DD/MM/YYYY h:mm:ss a")}
                            </h4>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs='12' md='6' sm='12'>
                                <Card body outline color='primary'>
                                    <h2 className='text-center'>Máy bơm</h2>
                                    <CardBody>
                                        <InputGroup className='my-4'>
                                            <InputGroupAddon addonType='prepend'>
                                                <Button color='danger'>
                                                    &ensp;&ensp;Pin&ensp;&ensp;
                                                </Button>
                                            </InputGroupAddon>
                                            <Input
                                                className='font-weight-bold'
                                                value={this.state.relay_1.battery}
                                                disabled
                                            />
                                        </InputGroup>
                                        <InputGroup className='my-4'>
                                            <InputGroupAddon addonType='prepend'>
                                                <Button color='primary'>Tín hiệu</Button>
                                            </InputGroupAddon>
                                            <Input
                                                className='font-weight-bold text-success'
                                                value={this.convertRSSI(this.state.relay_1.RF_signal)}
                                                disabled
                                            />
                                        </InputGroup>

                                        <Row className='mt-5'>
                                            <Col xs='12' md='12' sm='12'>
                                                <center>
                                                <CustomImg
                                                    key={utils.randomString()}
                                                    src={ WPlumOn}
                                                    alt='button'
                                                    className={`m-auto maxWidth-100 ${this.state.relay_1.value === "1" ? null : 'd-none'}`}
                                                />
                                                <CustomImg
                                                    key={utils.randomString()}
                                                    src={WPlumOff}
                                                    alt='button'
                                                    className={`m-auto maxWidth-100 ${this.state.relay_1.value !== "1" ? null : 'd-none'}`}
                                                />
                                                </center>

                                                <div className='d-flex justify-content-center mt-3 d-inline '>
                                                    <h1>
                                                        <Button
                                                            className='mr-3'
                                                            color='danger'
                                                            size="lg"
                                                            onClick={() => {
                                                                this.send(location, "00");
                                                            }}>
                                                        Tắt máy
                                                        </Button>
                                                    </h1>
                                                    <h1>
                                                        <Button
                                                            className=''
                                                            color='success'
                                                            size='lg'
                                                            onClick={() => {
                                                                this.send(location, "01");
                                                            }}>
                                                            Bật máy
                                                        </Button>
                                                    </h1>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xs='12' md='6' sm='12'>
                                <Card body outline color='primary'>
                                    <h2 className='text-center'>Mái che</h2>
                                    <CardBody>
                                        <InputGroup className='my-4'>
                                            <InputGroupAddon addonType='prepend'>
                                                <Button color='danger'>
                                                    &ensp;&ensp;Pin&ensp;&ensp;
                                                </Button>
                                            </InputGroupAddon>
                                            <Input
                                                className='font-weight-bold'
                                                value={this.state.relay_2.battery}
                                                disabled
                                            />
                                        </InputGroup>
                                        <InputGroup className='my-4'>
                                            <InputGroupAddon addonType='prepend'>
                                                <Button color='primary'>Tín hiệu</Button>
                                            </InputGroupAddon>
                                            <Input
                                                className='font-weight-bold text-success'
                                                value={this.convertRSSI(this.state.relay_2.RF_signal)}
                                                disabled
                                            />
                                        </InputGroup>

                                        <Row className='mt-5'>
                                            <Col xs='12' md='12' sm='12'>
                                                <center>
                                                    <CustomImg
                                                        key={utils.randomString()}
                                                        src={CurtainOn}
                                                        alt='button'
                                                        className={`m-auto maxWidth-100 ${this.state.relay_2.value === "1" ? null : 'd-none'}`}
                                                    />                                                   
                                                    <CustomImg
                                                        key={utils.randomString()}
                                                        src={CurtainOff}
                                                        alt='button'
                                                        className={`m-auto maxWidth-100 ${this.state.relay_2.value !== "1" ? null : 'd-none'}`}
                                                    />                                                   
                                                </center> 

                                                <div className='d-flex justify-content-center mt-3 d-inline '>
                                                    <h1>
                                                        <Button
                                                            className='mr-3'
                                                            color='danger'
                                                            size='lg'
                                                            onClick={() => {
                                                                this.send(location, "10");
                                                            }}>
                                                            Kéo rèm                                                  
                                                        </Button>
                                                    </h1>
                                                    <h1>
                                                        <Button
                                                            className=''
                                                            color='success'
                                                            size='lg'
                                                            onClick={() => {
                                                                this.send(location, "11");
                                                            }}>
                                                            Mở rèm                                                    
                                                        </Button>
                                                    </h1>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default Controlstation;