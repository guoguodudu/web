import React from 'react';
import {Modal, Button, Input, Row, Col, DatePicker, Select, Icon, Collapse, Checkbox} from 'antd';
import moment from 'moment';
import axios from 'axios';

import {selectUtils} from '../../../SelectUtils.jsx';
import {checkNull, successInfo, isGreaterToday, errorInfo,warningInfo, sysErrorInfo, initGroupCode, initCompCode, initSiteCode} from '../../../Common.jsx';
import {checkNumNull, isRealNum} from "../../../Common";

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Panel } = Collapse;
class AddOrgConConf extends React.Component {

    state = {
        visible: false,
		rateGroupMap: new Map(),
    };


    componentWillMount() {
        console.log("----------AddConConfRule.componentWillMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------AddConConfRule.componentWillReceiveProps---------------",nextProps);
        if(nextProps.visiable){
            this.setState({
                parent:nextProps.parent,
                visible:nextProps.visiable,

                orgConTypeSelect: '请选择',
                busiGroupCodeSelect: '请选择',
                busiCompCodeSelect: '请选择',
                busiSiteCodeSelect: '请选择',
                funderCodeSelect: '请选择',
                orgConSn: null,
                mainConSn: null,
                assetType: null,
                remarks: undefined,
                effectiveDatetime: null,
                expireDatetime: null,
                assetTypeSelect: '请选择',
                mainConSnFlag:false,
                checkConSn1:false,
                checkConSn2:false,


            });
            this.initBusiGroupCodeOption();

        }
    }

    initFunderCodeOption() {

        var funderCodeList = initGroupCode('FUNDER');
        this.setState({
            funderCodeList:funderCodeList,
        });
    }
    initFServiceCodeOption() {

        var funderCodeList = initGroupCode('FSERVICE');
        this.setState({
            funderCodeList:funderCodeList,
        });
    }

    initBusiGroupCodeOption() {

        var busiGroupCodeList = initGroupCode('BUSI');
        this.setState({
            busiGroupCodeList:busiGroupCodeList,
            busiCompCodeList: [],
            busiSiteCodeList: [],
        });
    }

    initBusiCompCodeOption() {
        var busiCompCodeList = initCompCode('BUSI',this.state.busiGroupCodeSelect);
        this.setState({
            busiCompCodeList: busiCompCodeList,
            busiSiteCodeList: [],

        });
    }

    initBusiSiteCodeOption() {
        var busiSiteCodeList = initSiteCode('BUSI',this.state.busiGroupCodeSelect,this.state.busiCompCodeSelect);
        this.setState({
            busiSiteCodeList: busiSiteCodeList,
        });
    }


    handleOk = () => {
        console.log("------AddOrgConConf----submit---125---提交数据到后台---state--------------",this.state);
        if(checkNull(this.state.orgConTypeSelect,'机构合同类型')){
            return;
        }
        if(checkNull(this.state.orgConSn,'机构合同编号')){
            return;
        }

        if(this.state.orgConTypeSelect==='FL'){
            if(checkNull(this.state.mainConSn,'主合同编号')){
                return;
            }
            if(!this.state.checkConSn1|| this.state.checkConSn2){
                warningInfo("主合同编号错误");
                return;
            }
        }
        if(checkNull(this.state.funderCodeSelect,'资金方')){
            return;
        }
        if(checkNull(this.state.busiGroupCodeSelect,'商户集团')){
            return;
        }
        if(checkNull(this.state.assetTypeSelect,'资产类别')){
            return;
        }
        if(checkNull(this.state.effectiveDatetimeStr,'生效日期')){
            return;
        }
        if(isGreaterToday(this.state.expireDatetimeStr,'失效日期')){
            return;
        }
        if(this.state.expireDatetimeStr !== undefined && this.state.expireDatetimeStr !== "" &&
           this.state.effectiveDatetimeStr !== undefined && this.state.effectiveDatetimeStr !== ""){
                if(this.state.expireDatetimeStr <= this.state.effectiveDatetimeStr){
                    warningInfo("规则【失效时间】必须大于【生效时间】！");
                    return;
                }
        }
        if(checkNull(this.state.remarks,'合同说明')){
            return;
        }

        var thi = this;
        var busiSiteCode = this.state.busiSiteCodeSelect
        var busiCompCode = this.state.busiCompCodeSelect
		var isFirstTran = this.state.rateGroupMap.get('isFirstTran');
		var firstTranRete = this.state.rateGroupMap.get('firstTranRete');
		var firstTranMin = this.state.rateGroupMap.get('firstTranMin');
		var firstTranScale = this.state.rateGroupMap.get('firstTranScale');
		var firstTranRule = this.state.rateGroupMap.get('firstTranRule');
		var isTran = this.state.rateGroupMap.get('isTran');
		var tranRete = this.state.rateGroupMap.get('tranRete');
		var tranMin = this.state.rateGroupMap.get('tranMin');
		var tranScale = this.state.rateGroupMap.get('tranScale');
		var tranRule = this.state.rateGroupMap.get('tranRule');
		var tranType = this.state.rateGroupMap.get('tranType');
		var tranAmt = this.state.rateGroupMap.get('tranAmt');
		var firstTranType = this.state.rateGroupMap.get('firstTranType');
		var firstTranAmt = this.state.rateGroupMap.get('firstTranAmt');

		var firstTranValue;
		var tranValue;

		if(firstTranType === "1"){
			if (checkNull(""+firstTranRete, '首付费率不能为空')) {
				return;
			}
			firstTranValue=firstTranRete;
			if (checkNull(""+firstTranMin, '首付手续费不能为空')) {
				return;
			}
			if (checkNull(""+firstTranScale, '首付手续费小数位不能为空')) {
				return;
			}
			if (checkNull(""+firstTranRule, '首付手续费进位规则不能为空')) {
				return;
			}
		}else {
			if (checkNull(""+firstTranAmt, '首付单笔不能为空')) {
				return;
			}
			firstTranValue=firstTranAmt;
		}
		if (checkNumNull(tranType, '分期手续费类型不能为空')) {
			return;
		}
		if(tranType === "1"){
			if (checkNull(""+tranRete, '分期费率不能为空')) {
				return;
			}
			tranValue=tranRete;
			if (checkNull(""+tranMin, '分期最低手续费不能为空')) {
				return;
			}
			if (checkNull(""+tranScale, '分期手续费小数位不能为空')) {
				return;
			}
			if (checkNull(""+tranRule, '分期手续费进位规则不能为空')) {
				return;
			}
		}else {
			if (checkNull(""+tranAmt, '分期单笔不能为空')) {
				return;
			}
			tranValue=tranAmt;
		}


        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgconapi/addOrgConConf',
        {
            "busiGroupCode": this.state.busiGroupCodeSelect=== "请选择" ? undefined : this.state.busiGroupCodeSelect,
            "busiCompCode": busiCompCode === "请选择" ? undefined : busiCompCode,
            "busiSiteCode": busiSiteCode === "请选择" ? undefined : busiSiteCode,
            "orgConType": this.state.orgConTypeSelect,
            "orgConSn": this.state.orgConSn,
            "mainConSn": this.state.mainConSn,
            "funderCode": this.state.funderCodeSelect,
            "assetType": this.state.assetTypeSelect,
            "effectiveDatetime": this.state.effectiveDatetimeStr,
            "expireDatetime": this.state.expireDatetimeStr,
            "remarks": this.state.remarks,
            "status": "DRAFT",
            "createId":localStorage.getItem('userName'),
			"isFirstTran":isFirstTran,
			"firstTranMin":firstTranMin,
			"firstTranScale":firstTranScale,
			"firstTranRule":firstTranRule,
			"isTran":isTran,
			"tranMin":tranMin,
			"tranScale":tranScale,
			"tranRule":tranRule,
			"tranType":tranType,
			"tranValue":tranValue,
			"firstTranType":firstTranType,
			"firstTranValue":firstTranValue,

        }).then(function (response) {
            console.log('response-2',response)
            if(response.data.STATUS === '200'){

                successInfo("合同维护规则新增成功");
                thi.setState({ visible: false });
				thi.state.parent.state.parent.handleFilterSubmit();
				thi.props.parent.setState({addOrgConVisiable:false})
            } else if(response.data.STATUS === "201" || response.data.STATUS === "202"){
                errorInfo(response.data.CONTENT);
                console.log("response.data.CONTENT",response.data.CONTENT);
            } else {
                sysErrorInfo();
                console.log("response.data.CONTENT",response.data.CONTENT);
            }
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    handleCancel = () => {
		this.setState({ visible: false });
		this.props.parent.setState({addOrgConVisiable:false})		
    };

    handleBusiGroupCode = (value) => {
        this.setState({
            busiGroupCodeSelect: value,

            busiCompCodeSelect: '请选择',
            busiSiteCodeSelect: '请选择',
            busiCompCodeList: [],
            busiSiteCodeList: [],
        });
        // eslint-disable-next-line
        this.state.busiGroupCodeSelect = value;//由于setState方法是异步的，这里使用这个方法保证下面肯定能获取到值
        this.initBusiCompCodeOption();
    }

    handleBusiCompCode = (value) => {
        this.setState({
            busiCompCodeSelect: value ,
            busiSiteCodeSelect: '请选择',
            busiSiteCodeList: [],
        });
        // eslint-disable-next-line
        this.state.busiCompCodeSelect = value;//由于setState方法是异步的，这里使用这个方法保证下面肯定能获取到值
        this.initBusiSiteCodeOption();
    }


    handleBusiSiteCode = (value) => {
        this.setState({busiSiteCodeSelect: value});
    }

    handleOrgConType = (value) => {
        this.setState({orgConTypeSelect: value});
        if(value==='FL'){
            this.setState({
                mainConSn:undefined,
                busiGroupCodeSelect:'请选择',
                busiCompCodeSelect:'请选择',
                busiSiteCodeSelect:'请选择',
                busiGroupDisa: true,
                busiCompDisa: true,
                busiSiteDisa: true,
                mainConSnFlag:true,
                funderCodeSelect:undefined
            });
            this.initFunderCodeOption();
        } else {
            this.setState({
                mainConSn:undefined,
                busiGroupDisa: false,
                busiCompDisa: false,
                busiSiteDisa: false,
                checkConSn1:false,
                checkConSn2:false,
                mainConSnFlag:false,
                funderCodeSelect:undefined
            });
            this.initFServiceCodeOption();
        }
    }

    handleOrgConSn = (e) => {
        this.setState({orgConSn: e.target.value});

    }

    handleMainConSn = (e) => {
        this.setState({mainConSn: e.target.value});
    }
    inputBlur = (e) => {
        if(this.state.orgConTypeSelect==='FL'){
            this.queryGCSCode(e.target.value);
        }
    }

    handleFunderCode = (value) => {
        this.setState({funderCodeSelect: value});
    }

    handleAssetType = (value) => {
        this.setState({assetTypeSelect: value});

        if(value === 'CA' ) {
			this.state.rateGroupMap.set('isTran',true);
        }else {
			this.state.rateGroupMap.set('isTran',false);
		}

    }

    handleFunderCode = (value) => {
        this.setState({funderCodeSelect: value});
    }

    handleEffectiveDatetime = (value, dateString) => {
        this.setState({ effectiveDatetime: value ,effectiveDatetimeStr: dateString});
    }

    handleExpireDatetime = (value, dateString) => {
        this.setState({ expireDatetime: value ,expireDatetimeStr: dateString});
    }

    handleRemarks = (e) => {
        this.setState({ remarks: e.target.value});
    }

	handleChangeOption = (id,value) => {
		const {readOrgRateVisiable} = this.props
		if(readOrgRateVisiable){
			return false
		}
		this.state.rateGroupMap.set(id,value);
		this.setState({ rateGroupMap: this.state.rateGroupMap});
	}
    queryGCSCode(value){
        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgconapi/queryCurtimeOrgConConfList',
        {
            "orgConSn": value
        }).then(function (response) {
            console.log('response-2',response)
            if(response.data.STATUS === '200' && response.data.COUNT === 1){
                thi.setState({
                    busiGroupCodeSelect: response.data.List[0].busiGroupCode,
                    busiCompCodeSelect: response.data.List[0].busiCompCode,
                    busiCompCodeList:<Select.Option key={response.data.List[0].busiCompCode}>{response.data.List[0].busiCompSname}</Select.Option>,
                    busiSiteCodeSelect: response.data.List[0].busiSiteCode,
                    busiSiteCodeList:<Select.Option key={response.data.List[0].busiSiteCode}>{response.data.List[0].busiSiteSname}</Select.Option>,
                    checkConSn1:true,
                    checkConSn2:false,
                });


            } else {
                thi.setState({
                    busiGroupCodeSelect: '请选择',
                    busiCompCodeSelect: '请选择',
                    busiSiteCodeSelect: '请选择',
                    checkConSn1:false,
                    checkConSn2:true,
                });
            }
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

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

	onChange1 = (e) => {
		this.state.rateGroupMap.set(e.target.id,e.target.checked);
		this.setState({ rateGroupMap: this.state.rateGroupMap});
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

    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'900px'}
                        visible={this.state.visible}
                        title="新增机构合同维护规则"
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
                        <Col span={11}>
                        <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 机构合同类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.orgConTypeSelect} onChange={this.handleOrgConType} style={{width:'160px'}}>
                                        {selectUtils('orgConType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 机构合同编号： </Col>
                                <Col span={16}>
                                    <Input id="orgConSn" style={{width:'160px'}} value={this.state.orgConSn} onChange={this.handleOrgConSn} />
                                </Col>
                            </Row>
                            <br style={{display:this.state.mainConSnFlag?'':'none'}} />
                            <Row style={{display:this.state.mainConSnFlag?'':'none'}}>
                                <Col span={8} style={{color:'red'}}>* 主合同编号： </Col>
                                <Col span={16}>
                                    <Input id="mainConSn" style={{width:'160px'}} value={this.state.mainConSn} onChange={this.handleMainConSn} onBlur={this.inputBlur} />
                                    <span style={{display:this.state.checkConSn1?'':'none'}}><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /></span>
                                    <span style={{display:this.state.checkConSn2?'':'none'}}><Icon type="close-circle" theme="twoTone" twoToneColor="#52c41a" /></span>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 资金方： </Col>
                                <Col span={16}>
                                    <Select value={this.state.funderCodeSelect} onChange={this.handleFunderCode} style={{ width: '160px' }} >
                                        {this.state.funderCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 商户集团： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiGroupCodeSelect} onChange={this.handleBusiGroupCode} style={{width:'160px'}} disabled={this.state.busiGroupDisa} >
                                        {this.state.busiGroupCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户公司： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiCompCodeSelect} onChange={this.handleBusiCompCode} style={{width:'160px'}} disabled={this.state.busiCompDisa} >
                                        {this.state.busiCompCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户网点： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiSiteCodeSelect} onChange={this.handleBusiSiteCode} style={{width:'160px'}} disabled={this.state.busiSiteDisa} >
                                        {this.state.busiSiteCodeList}
                                    </Select>
                                </Col>
                            </Row>


                        </Col>
                        <Col span={1} />
                        <Col span={12}>
                        <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 资产类别： </Col>
                                <Col span={16}>
                                    <Select value={this.state.assetTypeSelect} onChange={this.handleAssetType} style={{width:'160px'}}>
                                        {selectUtils('assetType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>生效日期： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'180px'}} onChange={this.handleEffectiveDatetime} value={this.state.effectiveDatetime == null ? undefined : moment(this.state.effectiveDatetime, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>失效日期： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'180px'}} onChange={this.handleExpireDatetime} value={this.state.expireDatetime == null ? undefined : moment(this.state.expireDatetime, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>合同说明： </Col>
                                <Col span={16}>
                                    <Input.TextArea style={{width:'180px'}} onChange={this.handleRemarks} value={this.state.remarks} rows="6" />
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

export default AddOrgConConf;