import React from 'react';
import { supCon } from "@/api";
import { Modal,Button,Input,Row,Col,Select,DatePicker } from 'antd';
import {checkNull,successInfo, initLegalInfo,initSupCode,errorInfo,checkIsNull,checkNumNull,isGreaterToday,warningInfo} from '../../../Common.jsx';
import {selectUtils} from '../../../SelectUtils.jsx';
import moment from 'moment';
import {checkIsNum} from "../../../Common";
const dateFormat = 'YYYY-MM-DD';
class CopySupCon extends React.Component {

    state = {
        visiable: false,
    };

    componentWillMount() {
        console.log("------CopySupCon------componentWillMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------CopySupCon-----nextProps--componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){

            this.setState({
                parent:nextProps.parent,
                visiable:nextProps.visiable,
                legalCode: nextProps.record.legalCode,
                supCode: nextProps.record.supCode,
                supConCode: nextProps.record.supConCode,
                supConStartDate: nextProps.record.supConStartDate,
                supConEndDate: nextProps.record.supConEndDate,
                supConStartDateStr: nextProps.record.supConStartDate,
                supConEndDateStr: nextProps.record.supConEndDate,
                supPayPeriod: nextProps.record.supPayPeriod,
                accName: nextProps.record.accName,
                accBank: nextProps.record.accBank,
                accNo: nextProps.record.accNo,
            });
            let legalInfo = initLegalInfo ();
            let supInfo = initSupCode();

            this.setState({
                legalCodeList: legalInfo,
                subCodeList: supInfo,
            });
        }
    }

    handleOk = async() => {
        console.log("------CopyLegal----submit---提交数据到后台---state--------------",this.state);
        if(checkNull(this.state.legalCode,'主体法人单位简称')){
            return;
        }
        if(checkNull(this.state.supCode,'供应商简称')){
            return;
        }
        if(checkNull(this.state.supConCode,'供应合同编号')){
            return;
        }
        if(checkNull(this.state.supConStartDateStr,'供应合同起始日期')){
            return;
        }
        if(isGreaterToday(this.state.supConEndDateStr,'供应合同终止日期')){
            return;
        }
        if(checkNull(this.state.accName,'户名')){
            return;
        }
        if(checkNull(this.state.accBank,'开户行')){
            return;
        }
        if(checkNull(this.state.accNo,'账号')){
            return;
        }
        if(!checkIsNum(this.state.accNo)){
            warningInfo("【账号】非纯数字格式");
            return;
        }
        if(parseFloat(this.state.accNo) < 0 ){
            warningInfo("【账号】含有非法符号【-】，请删除");
            return;
        }
        if(this.state.supConEndDateStr !== undefined && this.state.supConEndDateStr !== "" &&
           this.state.supConStartDateStr !== undefined && this.state.supConStartDateStr !== ""){
                if(this.state.supConEndDateStr <= this.state.supConStartDateStr){
                    warningInfo("规则【供应合同终止日期】必须大于【供应合同起始日期】！");
                    return;
                }
        }
        if(checkNumNull(this.state.supPayPeriod,'货款账期')){
            return;
        }

        let data = {
			"legalCode": this.state.legalCode,
            "supCode": this.state.supCode,
            "supConCode": this.state.supConCode,
            "supConStartDate": this.state.supConStartDateStr,
            "supConEndDate": this.state.supConEndDateStr,
            "supPayPeriod": this.state.supPayPeriod,
            "accName": this.state.accName,
            "accBank": this.state.accBank,
            "accNo": this.state.accNo,
            "isDelete": '0',
            "status": 'DRAFT',
        };

        let result = await supCon.add(data)
            .catch(function (error) {//防止报错
            console.log(error)
        });

        if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.result === 1){
            successInfo("复制成功");
            this.setState({ loading: false, visiable: false });
            this.state.parent.setState({copySupConVisiable:false})
            this.state.parent.state.parent.handleFilterSubmit();
            // TODO 要把当前页面查询条件清空
        }else{
            errorInfo("复制失败，请联系系统管理员")
        }
    }

    handleCancel = () => {
		this.setState({ visiable: false });
		this.props.parent.setState({copySupConVisiable:false})
    };

    handleLegalCode = (value) => {
        this.setState({legalCode: value});
    }

    handleSubCode = (value) => {
        this.setState({supCode: value});
    }

    handleSupConCode = (e) => {
        this.setState({supConCode: e.target.value});
    }

    handleSupConStartDate = (value, dateString) => {
        this.setState({supConStartDate: value,supConStartDateStr: dateString});
    }

    handleSupConEndDate = (value, dateString) => {
        this.setState({supConEndDate: value,supConEndDateStr: dateString});
    }

    handleSupPayPeriod = (value) => {
        this.setState({supPayPeriod: value});
    }

    handleAccName= (e) => {
        this.setState({accName: e.target.value});
    }

    handleAccBank = (e) => {
        this.setState({accBank: e.target.value});
    }

    handleAccNo= (e) => {
        this.setState({accNo: e.target.value});
    }

    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'800px'}
                        visible={this.state.visiable}
                        title="复制供应合同信息"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                                提交
                            </Button>,
                        ]}
                        >
                    <Row>
                        <Col span={12}>
                        <br />
                            <Row>
                                <Col span={8}>主体法人单位简称： </Col>
                                <Col span={16}>
                                    <Select style={{ width: 160 }} onChange={this.handleLegalCode} value={this.state.legalCode} >
                                        {this.state.legalCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>供应商简称： </Col>
                                <Col span={16}>
                                    <Select style={{ width: 160 }} onChange={this.handleSubCode} value={this.state.supCode} >
                                        {this.state.subCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} >供应合同编号： </Col>
                                <Col span={16}>
                                    <Input id="supConCode" style={{width:'160px'}} value={this.state.supConCode} onChange={this.handleSupConCode} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>货款账期： </Col>
                                <Col span={16}>
                                    <Select value={this.state.supPayPeriod} style={{width:'160px'}} onChange={this.handleSupPayPeriod} >
                                        {selectUtils('supPayPeriod')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>账号： </Col>
                                <Col span={16}>
                                    <Input id="accNo"
                                           style={{ width: '160px' }}
                                           size="default"
                                           value={this.state.accNo}
                                           onChange={this.handleAccNo}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <br />
                            <Row>
                                <Col span={10}>供应合同起始日期： </Col>
                                <Col span={14}>
                                    <DatePicker style={{width:'160px'}} onChange={this.handleSupConStartDate} value={this.state.supConStartDate == null ? undefined : moment(this.state.supConStartDate, dateFormat)} showTime="true" format="YYYY-MM-DD" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>供应合同终止日期： </Col>
                                <Col span={14}>
                                    <DatePicker style={{width:'160px'}} onChange={this.handleSupConEndDate} value={this.state.supConEndDate == null ? undefined : moment(this.state.supConEndDate, dateFormat)} showTime="true" format="YYYY-MM-DD" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>户名： </Col>
                                <Col span={14}>
                                    <Input id="accName"
                                           style={{ width: '200px' }}
                                           size="default"
                                           value={this.state.accName}
                                           onChange={this.handleAccName}
                                    />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>开户行： </Col>
                                <Col span={14}>
                                    <Input id="accBank"
                                           style={{ width: '200px' }}
                                           size="default"
                                           value={this.state.accBank}
                                           onChange={this.handleAccBank}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }

}

export default CopySupCon;