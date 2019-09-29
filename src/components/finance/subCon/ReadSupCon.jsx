import React from 'react';
import { Modal,Button,Input,Row,Col,Select,DatePicker } from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
class ReadSupCon extends React.Component {

    state = {
        visible: false,
    };

    componentWillMount() {
        
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值        

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
                id: nextProps.record.id
            });
        }
    }

    handleCancel = () => {
		this.setState({ visiable: false });
		this.props.parent.setState({readSupConVisiable:false})
    };

    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'800px'}
                        visible={this.state.visiable}
                        title="供应合同信息"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
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
export default ReadSupCon;