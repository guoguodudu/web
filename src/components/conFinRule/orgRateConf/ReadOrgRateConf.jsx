import React from 'react';
import { Modal,Button,Input,Row,Col,DatePicker,Select } from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';

import moment from 'moment';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class ReadOrgRateConf extends React.Component {

    state = {

    };

    componentWillMount() {
        console.log("----------AddOrEditRateConfRule.componentWillMount---------------");
        // eslint-disable-next-line
        this.setState({
            loading3: false,
            visible3: this.props.visiable,
            rateGroupMap: new Map(),
        });
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------AddOrEditRateConfRule.componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){
            this.setState({
                parent:nextProps.parent,
                visible3: nextProps.visiable,
            });
            var rateGroupMap= new Map();

            rateGroupMap.set("insTotTerm",nextProps.record.insTotTerm);
            rateGroupMap.set("serviceRate",nextProps.record.serviceRate);
            rateGroupMap.set("depositRate",nextProps.record.depositRate);
            rateGroupMap.set("boRate",nextProps.record.boRate);
            rateGroupMap.set("amtCalRule",nextProps.record.amtCalRule);
            rateGroupMap.set("adjustRule",nextProps.record.adjustRule);
            rateGroupMap.set("prnRoundRule",''+nextProps.record.prnRoundRule);
            rateGroupMap.set("prnScale",''+nextProps.record.prnScale);
            rateGroupMap.set("depRoundRule",''+nextProps.record.depRoundRule);
            rateGroupMap.set("depScale",''+nextProps.record.depScale);
            rateGroupMap.set("boRoundRule",''+nextProps.record.boRoundRule);
            rateGroupMap.set("boScale",''+nextProps.record.boScale);
            rateGroupMap.set("loanRate",nextProps.record.loanRate);
            rateGroupMap.set("intCalRule",nextProps.record.intCalRule);
            rateGroupMap.set("intCalSdate",nextProps.record.intCalSdate);
            rateGroupMap.set("intCalBase",nextProps.record.intCalBase);
            rateGroupMap.set("dayOfYear",''+nextProps.record.dayOfYear);
            rateGroupMap.set("intRoundRule",''+nextProps.record.intRoundRule);
            rateGroupMap.set("intScale",''+nextProps.record.intScale);
			rateGroupMap.set("serviceScale",nextProps.record.serviceScale);
			rateGroupMap.set("serviceRoundRule",nextProps.record.serviceRoundRule);

            this.setState({

                id:nextProps.record.id,
                rateGroupMap:rateGroupMap,
                orgConSn:nextProps.record.orgConSn,
                orgConType:nextProps.record.orgConType,
                funderCode:nextProps.record.funderCode,
                busiGroupCode:nextProps.record.busiGroupCode,
                busiCompCode:nextProps.record.busiCompCode,
                busiSiteCode:nextProps.record.busiSiteCode,
                remarks:nextProps.record.remarks,
                effectiveDatetime:nextProps.record.effectiveDatetime,
                effectiveDatetimeStr:nextProps.record.effectiveDatetime,
                expireDatetime:nextProps.record.expireDatetime,
                expireDatetimeStr:nextProps.record.expireDatetime,
                status:nextProps.record.status,
                createId:nextProps.record.createId,
                modifyId:localStorage.getItem('userName'),
                type:'编辑机构合同费率规则',
            });
        }
        console.log("this.state",this.state);
    }

    handleCancel3 = () => {
        this.setState({
            visible3: false,
            rateGroupMap:new Map(),
		});
		this.props.parent.setState({readOrgRateVisiable:false})
	};
	handleOk3 =()=>{
		this.props.parent.setState({readOrgRateVisiable:false})
	}

    render() {
        console.log("----------show name----------",this.state.type);
        return (
            <div className="gutter-example">
                        <Modal
                        width={'1300px'}
                        visible={this.state.visible3}
                        title={this.state.type}
                        onOk={this.handleOk3}
                        onCancel={this.handleCancel3}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel3}>取消</Button>,

                        ]}
                        >
                    <Row>
                        <Col span={5}>
                        <br />
                            <Row>
                                <Col span={8}>机构合同编号： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 120 }} value={this.state.orgConSn} />
                                </Col>
                            </Row>
                        <br />
                            <Row>
                                <Col span={8}>机构合同类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.orgConType} style={{ width: 120 }} >
                                        {selectUtils('orgConType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>资金方： </Col>
                                <Col span={16}>
                                    <Select value={this.state.funderCode} style={{ width: 120 }} >
                                    {}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户集团： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiGroupCode} style={{ width: 120 }} >
                                        {}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户公司： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiCompCode} style={{ width: 120 }} >
                                        {}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户网点： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiSiteCode} style={{ width: 120 }} >
                                        {}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>分期总期数： </Col>
                                <Col span={16}><Input id="insTotTerm" style={{width:'120px'}} value={this.state.rateGroupMap.get('insTotTerm')} /></Col>
                            </Row>
							<br />

							<Row>
								<Col span={8}>合作服务费小数位： </Col>
								<Col span={16}>
									<Select value={this.state.rateGroupMap.get('serviceScale')} style={{ width: 120 }} >
										{selectUtils('decimalScale')}
									</Select>
								</Col>
							</Row>
							<br />
							<Row>
								<Col span={8}>合作服务费进位规则： </Col>
								<Col span={16}>
									<Select value={this.state.rateGroupMap.get('serviceRoundRule')} style={{ width: 120 }} >
										{selectUtils('roundRule')}
									</Select>
								</Col>
							</Row>

                        </Col>
                        <Col span={1} />
                        <Col span={5}>
                            <br />
                            <Row>
                                <Col span={8}>合作服务费比率： </Col>
                                <Col span={16}><Input id="serviceRate" style={{width:'120px'}} value={this.state.rateGroupMap.get('serviceRate')} /></Col>
                            </Row>

                            <br />
                            <Row>
                                <Col span={8}>合作备用金比率： </Col>
                                <Col span={16}><Input id="depositRate" style={{width:'120px'}} value={this.state.rateGroupMap.get('depositRate')} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>收买比率： </Col>
                                <Col span={16}><Input id="boRate" style={{width:'120px'}} size="default" value={this.state.rateGroupMap.get('boRate')} onChange={this.checkNumberRange} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>金额计算规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('amtCalRule')} style={{ width: 120 }} >
                                        {selectUtils('amtCalRule')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>金额调整规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('adjustRule')} style={{ width: 120 }} >
                                        {selectUtils('amtAdjustRule')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>本金进位规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('prnRoundRule')} style={{ width: 120 }} >
                                        {selectUtils('roundRule')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>本金小数位： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('prnScale')} style={{ width: 120 }} >
                                        {selectUtils('decimalScale')}
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={1} />
                        <Col span={5}>
                            <br />
                            <Row>
                                <Col span={8}>贷款利率： </Col>
                                <Col span={16}><Input id="loanRate" style={{width:'120px'}} value={this.state.rateGroupMap.get('loanRate')} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>计息规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('intCalRule')} style={{ width: 120 }} >
                                        {selectUtils('intCalRule')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>计息起始日： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('intCalSdate')} style={{ width: 120 }} >
                                        {selectUtils('intCalStartdate')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>计息基数： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('intCalBase')} style={{ width: 120 }} >
                                        {selectUtils('intCalBase')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>全年计息天数： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('dayOfYear')} style={{ width: 120 }} >
                                        {selectUtils('dayOfYear')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>计息进位规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('intRoundRule')} style={{ width: 120 }} >
                                        {selectUtils('roundRule')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>计息小数位数： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('intScale')} style={{ width: 120 }} >
                                        {selectUtils('decimalScale')}
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={1} />
                        <Col span={5}>
                            <Row>
                                <Col span={8}>合作备用金进位规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('depRoundRule')} style={{ width: 120 }} >
                                        {selectUtils('roundRule')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>合作备用金小数位： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('depScale')} style={{ width: 120 }} >
                                        {selectUtils('decimalScale')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>收买金额进位规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('boRoundRule')} style={{ width: 120 }} >
                                        {selectUtils('roundRule')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>收买金额小数位： </Col>
                                <Col span={16}>
                                    <Select value={this.state.rateGroupMap.get('boScale')} style={{ width: 120 }} >
                                        {selectUtils('decimalScale')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> <Col span={8}>生效日期： </Col><Col span={16}><DatePicker style={{width:'150px'}} value={this.state.effectiveDatetime == null ? undefined : moment(this.state.effectiveDatetime, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" /></Col></Row>
                            <br />
                            <Row> <Col span={8}>失效日期： </Col><Col span={16}><DatePicker style={{width:'150px'}} value={this.state.expireDatetime == null ? undefined : moment(this.state.expireDatetime, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" /></Col></Row>
                            <br />
                            <Row> <Col span={8}>规则描述： </Col><Col span={16}><Input.TextArea style={{width:'180px'}} value={this.state.remarks} rows="6" /></Col></Row>
                        </Col>
                    </Row>
                    </Modal>
            </div>
        );
    }
}

export default ReadOrgRateConf;