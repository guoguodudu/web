import React from 'react';
import {Modal, Button, Input, Row, Col, DatePicker, Select, Collapse, Checkbox} from 'antd';
import moment from 'moment';
import {selectUtils} from '../../../SelectUtils.jsx';
import {dateFormat, sysErrorInfo} from '../../../Common.jsx';
import axios from 'axios';
import {isRealNum, warningInfo} from "../../../Common";

const dateFormats = 'YYYY-MM-DD HH:mm:ss';
const { Panel } = Collapse;
class ReadOrgConConf extends React.Component {

    state = {
		rateGroupMap: new Map(),
    };


    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值

        console.log("------read--componentWillReceiveProps---------------",nextProps);
        if(nextProps.visiable){
            this.initEditOption(nextProps.record);

			var rateGroupMap= new Map();

			rateGroupMap.set("isFirstTran",nextProps.record.isFirstTran);
			rateGroupMap.set("isFirstTran",nextProps.record.isFirstTran);
			rateGroupMap.set("firstTranMin",nextProps.record.firstTranMin);
			rateGroupMap.set("firstTranScale",nextProps.record.firstTranScale+"");
			rateGroupMap.set("firstTranRule",nextProps.record.firstTranRule+"");
			rateGroupMap.set("isTran",nextProps.record.isTran);
			rateGroupMap.set("tranMin",nextProps.record.tranMin);
			rateGroupMap.set("tranScale",nextProps.record.tranScale+"");
			rateGroupMap.set("tranRule",nextProps.record.tranRule+"");
			rateGroupMap.set("tranType",nextProps.record.tranType+"");
			rateGroupMap.set("firstTranType",nextProps.record.firstTranType+"");

			if(nextProps.record.firstTranType+"" === "1"){
				rateGroupMap.set("firstTranRete",nextProps.record.firstTranValue);
			}else {
				rateGroupMap.set("firstTranAmt",nextProps.record.firstTranValue);
			}
			if(nextProps.record.tranType+"" === "1"){
				rateGroupMap.set("tranRete",nextProps.record.tranValue);
			}else {
				rateGroupMap.set("tranAmt",nextProps.record.tranValue);
			}
            this.setState({
                parent:nextProps.parent,
                visible:nextProps.visiable,
                orgConTypeSelect: nextProps.record.orgConType,
                orgConSn: nextProps.record.orgConSn,
                assetTypeSelect: nextProps.record.assetType,

                effectiveDatetime: nextProps.record.effectiveDatetime,
                effectiveDatetimeStr: dateFormat(nextProps.record.effectiveDatetime),
                expireDatetime: nextProps.record.expireDatetime,
                expireDatetimeStr: dateFormat(nextProps.record.expireDatetime),
                remarks: nextProps.record.remarks,
                status: nextProps.record.status,
                id: nextProps.record.id,
				rateGroupMap:rateGroupMap,
            });
            if(nextProps.record.orgConType==='FL'){
                this.setState({
                    mainConSnFlag:true
                });
                this.queryMainConSn(nextProps.record.orgConSn);
            } else {
                this.setState({
                    mainConSnFlag:false
                });
            }
        }
    }

    initEditOption(record) {

        var funderCode = record.funderCode;
        var busiGroupCode = record.busiGroupCode;
        var busiCompCode = record.busiCompCode;
        var busiSiteCode = record.busiSiteCode;
        var funderCodeList = [];
        funderCodeList.push(<Select.Option key={record.funderCode}>{record.funderSname}</Select.Option>);
        this.setState({
            funderCodeList: funderCodeList,
            funderCodeSelect:funderCode
        });
        var busiGroupCodeList = [];
        busiGroupCodeList.push(<Select.Option key={record.busiGroupCode}>{record.busiGroupSname}</Select.Option>);
        this.setState({
            busiGroupCodeList: busiGroupCodeList,
            busiGroupCodeSelect:busiGroupCode
        });

        var busiCompCodeList = [];
        busiCompCodeList.push(<Select.Option key={record.busiCompCode}>{record.busiCompSname}</Select.Option>);
        this.setState({
            busiCompCodeList: busiCompCodeList,
            busiCompCodeSelect:busiCompCode,
        });


        var busiSiteCodeList = [];
        busiSiteCodeList.push(<Select.Option key={record.busiSiteCode}>{record.busiSiteSname}</Select.Option>);
        this.setState({
            busiSiteCodeList: busiSiteCodeList,
            busiSiteCodeSelect:busiSiteCode
        });
    }

    queryMainConSn(orgConSn){
        var thi = this;
        var mainConSnList = "";
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/conrelapi/queryOrgConRelList',
        {
            "orgConSn": orgConSn
        }).then(function (response) {
            console.log("--121--response",response);
            for (var i = 0; i < response.data.List.length; i++) {
                mainConSnList = mainConSnList+response.data.List[i]['mainConSn']+"\n";

            }
            thi.setState({
                mainConSn: mainConSnList,
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });

    }

    handleCancel = () => {
		this.setState({ visible: false });
		this.props.parent.setState({ReadOrgConConfVisiable:false})
    };
	checkNumber = (e) => {
		//检查是否是数字，并存储rateGroupMap

		this.state.rateGroupMap.set(e.target.id,e.target.value);
		this.setState({ rateGroupMap: this.state.rateGroupMap});

		if(e.target.value !== '' && e.target.value !== "" && e.target.value !== undefined){
			if(!isRealNum(e.target.value)){
				warningInfo("请输入数字！");
				return;
			}
		}

	}
	disableFirstTran = (e) => {
		if(this.state.rateGroupMap.get('isFirstTran') && this.state.rateGroupMap.get('firstTranType')==="2")
		{
			return false;
		}
		return true;
	}

	disableFirstTran2 = (e) => {
		if(this.state.rateGroupMap.get('isFirstTran') && this.state.rateGroupMap.get('firstTranType')==="1")
			return false;
		return true;
	}

	disableTran = (e) => {
		if( this.state.rateGroupMap.get('tranType')==="2"){
			return false;
		}
		return true;
	}

	disableTran2 = (e) => {
		if(this.state.rateGroupMap.get('tranType')==="1")
			return false;
		return true;
	}
	onChange1 = (e) => {
		this.state.rateGroupMap.set(e.target.id,e.target.checked);
		this.setState({ rateGroupMap: this.state.rateGroupMap});
	}
	handleChangeOption = (id,value) => {
		const {readOrgRateVisiable} = this.props
		if(readOrgRateVisiable){
			return false
		}
		this.state.rateGroupMap.set(id,value);
		this.setState({ rateGroupMap: this.state.rateGroupMap});
	}
    render(){
		return (
                <div className="gutter-example">
                <Modal
                width="900px"
                visible={this.state.visible}
                title="合同维护规则"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                ]}
                >
                    <Row>
                        <Col span={11}>
                        <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>机构合同类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.orgConTypeSelect} style={{width:'160px'}}>
                                        {selectUtils('orgConType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>机构合同编号： </Col>
                                <Col span={16}>
                                    <Input id="orgConSn" style={{width:'160px'}} value={this.state.orgConSn} />
                                </Col>
                            </Row>
                            <br style={{display:this.state.mainConSnFlag?'':'none'}} />
                            <Row style={{display:this.state.mainConSnFlag?'':'none'}} >
                                <Col span={8} style={{color:'red'}}>* 主合同编号： </Col>
                                <Col span={16}>
                                    <Input.TextArea id="mainConSn" style={{width:'160px'}} value={this.state.mainConSn} disabled={this.state.mainConSnDisa} rows="3" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>资金方： </Col>
                                <Col span={16}>
                                    <Select value={this.state.funderCodeSelect} style={{ width: '160px' }} >
                                        {this.state.funderCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>商户集团： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiGroupCodeSelect} style={{width:'160px'}}>
                                        {this.state.busiGroupCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户公司： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiCompCodeSelect} style={{width:'160px'}}>
                                        {this.state.busiCompCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户网点： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiSiteCodeSelect} style={{width:'160px'}}>
                                        {this.state.busiSiteCodeList}
                                    </Select>
                                </Col>
                            </Row>



                        </Col>
                        <Col span={1} />
                        <Col span={12}>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>资产类别： </Col>
                                <Col span={16}>
                                    <Select value={this.state.assetTypeSelect} style={{width:'160px'}}>
                                        {selectUtils('assetType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>生效日期： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'180px'}} value={this.state.effectiveDatetime == null ? undefined : moment(this.state.effectiveDatetime, dateFormats)} showTime="true" format="YYYY-MM-DD HH:mm:ss" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>失效日期： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'180px'}} value={this.state.expireDatetime == null ? undefined : moment(this.state.expireDatetime, dateFormats)} showTime="true" format="YYYY-MM-DD HH:mm:ss" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>合同说明： </Col>
                                <Col span={16}>
                                    <Input.TextArea style={{width:'180px'}} value={this.state.remarks} rows="6" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
					<br />
					<Row>
						<Collapse defaultActiveKey={['1']} onChange={this.panelCallback}>
							<Panel header="代收转付手续费设定" key="1">
								{/*<Col span={1} />*/}
								<Row>
									<Col span={8}>设定首付结转手续费：<Checkbox id="isFirstTran" checked={this.state.rateGroupMap.get('isFirstTran')} onChange={this.onChange1} />
									</Col>
									<Col span={8}>首付手续费类型：<Select value={this.state.rateGroupMap.get('firstTranType')} onChange={this.handleChangeOption.bind(this,"firstTranType")} style={{ width: 120 }} disabled={!this.state.rateGroupMap.get('isFirstTran')} >
										{selectUtils('tranType')}
									</Select>
									</Col>
									<Col span={8}>单笔：
										<Input id="firstTranAmt" style={{width:'120px'}} size="default" value={this.state.rateGroupMap.get('firstTranAmt')} onChange={this.checkNumber} disabled={this.disableFirstTran()} />
									</Col>
								</Row>
								<br />
								<Row>
									<Col span={8}>费率：
										<Input id="firstTranRete" style={{width:'120px'}} size="default" value={this.state.rateGroupMap.get('firstTranRete')} onChange={this.checkNumber} disabled={this.disableFirstTran2()} />
									</Col>
									<Col span={8}>最低手续费:
										<Input id="firstTranMin" style={{width:'120px'}} size="default" value={this.state.rateGroupMap.get('firstTranMin')} onChange={this.checkNumber} disabled={this.disableFirstTran2()} />
									</Col>
									<Col span={8}>手续费小数位：<Select value={this.state.rateGroupMap.get('firstTranScale')} onChange={this.handleChangeOption.bind(this,"firstTranScale")} style={{ width: 120 }} disabled={this.disableFirstTran2()} >
										{selectUtils('decimalScale')}
									</Select>
									</Col>

								</Row>
								<br />
								<Row>
									<Col span={8}>进位规则：
										<Select value={this.state.rateGroupMap.get('firstTranRule')} onChange={this.handleChangeOption.bind(this,"firstTranRule")} style={{ width: 120 }} disabled={this.disableFirstTran2()} >
											{selectUtils('roundRule')}
										</Select>
									</Col>
								</Row>
								<br />
								<Row>
									<Col span={8}>设定分期结转手续费：<Checkbox id="isTran" checked={this.state.rateGroupMap.get('isTran')} onChange={this.onChange1} disabled />
									</Col>
									<Col span={8}>分期手续费类型：<Select value={this.state.rateGroupMap.get('tranType')} onChange={this.handleChangeOption.bind(this,"tranType")} style={{ width: 120 }} >
										{selectUtils('tranType')}
									</Select>
									</Col>
									<Col span={8}>单笔：
										<Input id="tranAmt" style={{width:'120px'}} size="default" value={this.state.rateGroupMap.get('tranAmt')} onChange={this.checkNumber} disabled={this.disableTran()} />
									</Col>

								</Row>
								<br />
								<Row>
									<Col span={8}>费率：
										<Input id="tranRete" style={{width:'120px'}} size="default" value={this.state.rateGroupMap.get('tranRete')} onChange={this.checkNumber} disabled={this.disableTran2()} />
									</Col>
									<Col span={8}>最低手续费:
										<Input id="tranMin" style={{width:'120px'}} size="default" value={this.state.rateGroupMap.get('tranMin')} onChange={this.checkNumber} disabled={this.disableTran2()} />
									</Col>
									<Col span={8}>手续费小数位：<Select value={this.state.rateGroupMap.get('tranScale')} onChange={this.handleChangeOption.bind(this,"tranScale")} style={{ width: 120 }} disabled={this.disableTran2()} >
										{selectUtils('decimalScale')}
									</Select>
									</Col>
								</Row>
								<br />
								<Row>
									<Col span={8}>进位规则：
										<Select value={this.state.rateGroupMap.get('tranRule')} onChange={this.handleChangeOption.bind(this,"tranRule")} style={{ width: 120 }} disabled={this.disableTran2()} >
											{selectUtils('roundRule')}
										</Select>
									</Col>
								</Row>
							</Panel>
						</Collapse>
					</Row>
                    </Modal>
            </div>
        );
    }
}

export default ReadOrgConConf;