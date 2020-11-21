import React from "react";
import "./Stations.css";
import Notification from "../../components/Notification";
import { Link } from "react-router-dom";

import { Card, CardTitle, Badge, UncontrolledTooltip, Container, Button, Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";
import { CustomImg } from "../../components/CustomTag";
import ca_chua_img from "../../assets/img/items/ca-chua.jpg";
import cai_bap_img from "../../assets/img/items/cai-bap.jpg";
import cai_chip_img from "../../assets/img/items/cai-chip.jpg";
import cai_ngot_img from "../../assets/img/items/cai-ngot.jpg";
import dua_chuot_img from "../../assets/img/items/dua-chuot.jpg";
import moment from 'moment';
const api = require("./api/api");
const apiModifyStation = require("../admin/api/api").modifyStation;
const none = "none";

class TableProject extends React.Component {
    constructor(props) {
        super(props);
        const data = this.props;
        this.state = {
            data: data,
            showPopupHarvest: false,
            showPopupDrills: false,
        };
        this.typeTreeIcon={
            "Cải ngọt": cai_ngot_img,
            "Cải chip": cai_chip_img,
            "Cải bắp": cai_bap_img,
            "Dưa chuột": dua_chuot_img,
            "Cà chua": ca_chua_img,
        }
        this.listStage = {
            "germination stage": "Cây con",
            "development stage": "Cây trưởng thành",
            "harvest stage": "Đang thu hoạch"
        }
    }
    handleSelectProject() {
        if(!this.state.data.statusUse) return Notification("warning", "Cảnh báo", 'Không thể truy cập vì chưa bắt đầu vụ mùa');
        api.getInfoProject(this.state.data.sub_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                localStorage.setItem("project", JSON.stringify(result));
                window.location.replace("/dashboard");
            }
        });
    }
    onHarvest(){
        let dataBody = {
            statusUse: false,
        }
        apiModifyStation(this.state.data.sub_id, dataBody, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + ' ' + err.data._error_message)
            } else {
                Notification("success", "Thay đổi thành công");
                let dataStation = {...this.state.data};
                dataStation.statusUse = result.statusUse;
                this.setState({data: dataStation, showPopupHarvest: false});
            }
        })
    }
    onDrills(){
        let dataBody = {
            statusUse: true,
            started_plant: new Date()
        }
        apiModifyStation(this.state.data.sub_id, dataBody, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + ' ' + err.data._error_message)
            } else {
                Notification("success", "Thay đổi thành công");
                let dataStation = {...this.state.data};
                dataStation.statusUse = result.statusUse;
                dataStation.started_plant = result.started_plant;
                this.setState({data: dataStation, showPopupDrills: false});
            }
        })
    }
    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }
    convertStatus(status, statusUse){
        if(!statusUse) return 'Đã thu hoạch';
        return this.listStage[status];
    }
    render() {
        console.log(this.state.data.started_plant);
        return (
            <div>
                <Modal isOpen={this.state.showPopupHarvest} toggle={this.toggle.bind(this,'showPopupHarvest')}>
                    <ModalHeader>Confirm</ModalHeader>
                    <ModalBody>Bạn có chắc chắn thu hoạch không?</ModalBody>
                    <ModalFooter>
                        <Button className="mt-1" color="secondary" size="lg" onClick={this.toggle.bind(this,'showPopupHarvest')}>Quay lại</Button>
                        <Button className="mt-1"  color="success" size="lg" onClick={this.onHarvest.bind(this)}>Đồng ý</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.showPopupDrills} toggle={this.toggle.bind(this,'showPopupDrills')}>
                    <ModalHeader>Confirm</ModalHeader>
                    <ModalBody>Bạn có chắc chắn gieo hạt mới không?</ModalBody>
                    <ModalFooter>
                        <Button className="mt-1" color="secondary" size="lg" onClick={this.toggle.bind(this,'showPopupDrills')}>Quay lại</Button>
                        <Button className="mt-1"  color="success" size="lg" onClick={this.onDrills.bind(this)}>Đồng ý</Button>
                    </ModalFooter>
                </Modal>
                
                <Container fluid className={`table-project mt-4 ${this.state.data.statusUse?'':'table-project__disabled'}`}>
                    <Card id={"table-project-" + this.state.data._id} className="table-project__card border-bottom-0">
                        <Link
                            to="#"
                            onClick={this.handleSelectProject.bind(this)}
                            className="table-project__card-header mb-0 px-2 py-1 hover-pointer:hover text-decoration-none overflow-hidden position-relative"
                        >
                            <CustomImg className="img--user rounded-circle  mr-2" src={this.typeTreeIcon[this.state.data.name]} alt="avt" />
                            <CardTitle className="align-middle d-inline-block mb-0 font-size-2x font-weight-bold text-color-black mt-0 border-bottom-0 ml-3">
                                <div>
                                    <div className="d-inline-block table-project__name-tree" id={"tooltip-project-" + this.state.data.id}>
                                        {this.state.data.name}
                                    </div>

                                    <div className="d-inline-block ml-1 pt-1 font-size-1x">
                                        <Badge color={this.state.data.i_am_owner ? "info" : "primary"} className="badge-pill px-1 mr-1 mb-1">
                                            {this.state.data.is_admin ? "Admin" : null}
                                        </Badge>
                                    </div>
                                    <h6 className="text-muted table-project__h6 mt-1">Gateway: {this.state.data.sub_id} </h6>
                                    <h6 className="text-muted table-project__h6 mt-1">Trạng thái: {this.convertStatus(this.state.data.stage.name,this.state.data.statusUse)}</h6>
                                    <h6 className="text-muted table-project__h6 mt-1">Diện tích: {this.state.data.acreage}</h6>
                                    <h6 className="text-muted table-project__h6">Ngày bắt đầu gieo trồng: { moment(this.state.data.started_plant).format('DD-MM-YYYY')}                                                                                                                                                                                                             
                                </h6>
                                    <UncontrolledTooltip placement={"bottom"} target={"tooltip-project-" + this.state.data.id}>
                                        Nhấn vào để biết thêm chi tiết
                                    </UncontrolledTooltip>
                                </div>
                            </CardTitle>
                        </Link>
                        <div className="table-project__actions">
                            {this.state.data.statusUse
                            ?
                                <Button className="btn-success" style={{width: '133px'}} onClick={this.toggle.bind(this,'showPopupHarvest')}>
                                    Kết thúc vụ mùa
                                </Button>
                            :
                                <Button style={{width: '133px',backgroundColor:'#4c555d'}} onClick={this.toggle.bind(this,'showPopupDrills')}>
                                    Bắt đầu vụ mới
                                </Button>
                            }
                        </div>
                    </Card>
                </Container>
            </div>
        );
    }
}

export default TableProject;
