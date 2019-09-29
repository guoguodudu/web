import React from 'react';
import { Modal,Button,Input,Row,Col,DatePicker,Select,Icon,
	Collapse } from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';
import {sysErrorInfo,errorInfo,warningInfo,isRealNum,isNumRange,isNumRange1,successInfo,checkNull } from '../../../Common.jsx';
import moment from 'moment';
import axios from 'axios';

const { Panel } = Collapse;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class AddOrEditOrgRateConf extends React.Component {

    state = {

    };

    componentWillMount() {
        console.log("----------AddOrEditRateConfRule.componentWillMount---------------");
        this.setState({
            loading3: false,
            visible3: this.props.visiable,
			rateGroupMap: new Map(),
		});
		this.panelCallback = this.panelCallback.bind(this);
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------AddOrEditRateConfRule.componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){
            this.setState({
                parent:nextProps.parent,
                visible3: nextProps.visiable,
            });
            var rateGroupMap= new Map();
            if(nextProps.parent.state.type ==='add'){
                rateGroupMap.set("insTotTerm",0);
                rateGroupMap.set("serviceRate",0);
                rateGroupMap.set("depositRate",0);
                rateGroupMap.set("boRate",0);
                rateGroupMap.set("loanRate",0);

                this.setState({
                    id:undefined,
                    rateGroupMap:rateGroupMap,
                    funderCode:undefined,
                    busiGroupCode:undefined,
                    busiCompCode:undefined,
                    busiSiteCode:undefined,
                    orgConSn:undefined,
                    remarks:'',
                    effectiveDatetime:undefined,
                    expireDatetime:undefined,
                    status:"DRAFT",
                    createId:localStorage.getItem('userName'),
                    modifyId:undefined,
                    url:'/orgrateapi/addOrgRateConf',
                    orgConSnFalg:false,
                    type:'新增机构合同费率规则',
                });
            } else if(nextProps.parent.state.type ==='edit'|| nextProps.readOrgRateVisiable){
                rateGroupMap.set("insTotTerm",nextProps.record.insTotTerm);
                rateGroupMap.set("serviceRate",nextProps.record.serviceRate);
                rateGroupMap.set("depositRate",nextProps.record.depositRate);
                rateGroupMap.set("boRate",nextProps.record.boRate);
                rateGroupMap.set("amtCalRule",nextProps.record.amtCalRule);
                rateGroupMap.set("adjustRule",nextProps.record.adjustRule);
                rateGroupMap.set("prnRoundRule",nextProps.record.prnRoundRule);
                rateGroupMap.set("prnScale",nextProps.record.prnScale);
                rateGroupMap.set("boRoundRule",nextProps.record.boRoundRule);
                rateGroupMap.set("boScale",nextProps.record.boScale);
                rateGroupMap.set("depRoundRule",nextProps.record.depRoundRule);
                rateGroupMap.set("depScale",nextProps.record.depScale);
                rateGroupMap.set("loanRate",nextProps.record.loanRate);
                rateGroupMap.set("intCalRule",nextProps.record.intCalRule);
                rateGroupMap.set("intCalSdate",nextProps.record.intCalSdate);
                rateGroupMap.set("intCalBase",nextProps.record.intCalBase);
                rateGroupMap.set("dayOfYear",nextProps.record.dayOfYear);
                rateGroupMap.set("intRoundRule",nextProps.record.intRoundRule);
                rateGroupMap.set("intScale",nextProps.record.intScale);
				rateGroupMap.set("serviceScale",nextProps.record.serviceScale);
				rateGroupMap.set("serviceRoundRule",nextProps.record.serviceRoundRule);

                this.setState({
                    id:nextProps.record.rate_id,
                    rateGroupMap:rateGroupMap,
                    orgConSn:nextProps.record.orgConSn,
                    orgConType:nextProps.record.orgConType,
                    funderCode:nextProps.record.funderCode,
                    busiGroupCode:nextProps.record.busiGroupCode,
                    busiCompCode:nextProps.record.busiCompCode,
                    busiSiteCode:nextProps.record.busiSiteCode,
                    remarks:nextProps.record.remarks,
                    effectiveDatetime:nextProps.record.conEffectiveDatetime,
                    effectiveDatetimeStr:nextProps.record.conEffectiveDatetime,
                    expireDatetime:nextProps.record.conExpireDatetime,
                    expireDatetimeStr:nextProps.record.conExpireDatetime,
                    status:nextProps.record.rateStatus,
                    createId:undefined,
                    modifyId:localStorage.getItem('userName'),
                    url:'/orgrateapi/updateOrgRateConf',
                    orgConSnFalg:true,
                    type:'编辑机构合同费率规则',
                    checkConSn1: true,
                    checkConSn2: false
                });
            } else if(nextProps.parent.state.type === 'copy'){
                rateGroupMap.set("insTotTerm",nextProps.record.insTotTerm);
                rateGroupMap.set("serviceRate",nextProps.record.serviceRate);
                rateGroupMap.set("depositRate",nextProps.record.depositRate);
                rateGroupMap.set("boRate",nextProps.record.boRate);
                rateGroupMap.set("amtCalRule",nextProps.record.amtCalRule);
                rateGroupMap.set("adjustRule",nextProps.record.adjustRule);
                rateGroupMap.set("prnRoundRule",nextProps.record.prnRoundRule);
                rateGroupMap.set("prnScale",nextProps.record.prnScale);
                rateGroupMap.set("boRoundRule",nextProps.record.boRoundRule);
                rateGroupMap.set("boScale",nextProps.record.boScale);
                rateGroupMap.set("depRoundRule",nextProps.record.depRoundRule);
                rateGroupMap.set("depScale",nextProps.record.depScale);
                rateGroupMap.set("loanRate",nextProps.record.loanRate);
                rateGroupMap.set("intCalRule",nextProps.record.intCalRule);
                rateGroupMap.set("intCalSdate",nextProps.record.intCalSdate);
                rateGroupMap.set("intCalBase",nextProps.record.intCalBase);
                rateGroupMap.set("dayOfYear",nextProps.record.dayOfYear);
                rateGroupMap.set("intRoundRule",nextProps.record.intRoundRule);
                rateGroupMap.set("intScale",nextProps.record.intScale);
				rateGroupMap.set("serviceScale",nextProps.record.serviceScale);
				rateGroupMap.set("serviceRoundRule",nextProps.record.serviceRoundRule);

                this.setState({
                    id:undefined,
                    rateGroupMap:rateGroupMap,
                    orgConSn:nextProps.record.orgConSn,
                    orgConType:nextProps.record.orgConType,
                    funderCode:nextProps.record.funderCode,
                    busiGroupCode:nextProps.record.busiGroupCode,
                    busiCompCode:nextProps.record.busiCompCode,
                    busiSiteCode:nextProps.record.busiSiteCode,
                    remarks:nextProps.record.remarks,
                    effectiveDatetime:nextProps.record.conEffectiveDatetime,
                    effectiveDatetimeStr:nextProps.record.conEffectiveDatetime,
                    expireDatetime:nextProps.record.conExpireDatetime,
                    expireDatetimeStr:nextProps.record.conExpireDatetime,
                    status:"DRAFT",
                    createId:localStorage.getItem('userName'),
                    modifyId:undefined,
                    url:'/orgrateapi/addOrgRateConf',
                    orgConSnFalg:false,
                    type:'复制机构合同费率规则',
                    checkConSn1: true,
                    checkConSn2: false
                });
            }
        }
        console.log("this.state in edit/copy",this.state);
    }

    handleOk3 = () => {
        console.log("handleOk3---this.state--",this.state);
        var insTotTerm = this.state.rateGroupMap.get('insTotTerm');
        var serviceRate = this.state.rateGroupMap.get('serviceRate');
        var depositRate = this.state.rateGroupMap.get('depositRate');
        var depRoundRule = this.state.rateGroupMap.get('depRoundRule');
        var depScale = this.state.rateGroupMap.get('depScale');
        var boRate = this.state.rateGroupMap.get('boRate');
        var boRoundRule = this.state.rateGroupMap.get('boRoundRule');
        var boScale = this.state.rateGroupMap.get('boScale');
        var amtCalRule = this.state.rateGroupMap.get('amtCalRule');
        var adjustRule = this.state.rateGroupMap.get('adjustRule');
        var prnRoundRule = this.state.rateGroupMap.get('prnRoundRule');
        var prnScale = this.state.rateGroupMap.get('prnScale');
        var loanRate = this.state.rateGroupMap.get('loanRate');
        var intCalRule = this.state.rateGroupMap.get('intCalRule');
        var intCalSdate = this.state.rateGroupMap.get('intCalSdate');
        var intCalBase = this.state.rateGroupMap.get('intCalBase');
        var dayOfYear = this.state.rateGroupMap.get('dayOfYear');
        var intRoundRule = this.state.rateGroupMap.get('intRoundRule');
        var intScale = this.state.rateGroupMap.get('intScale');
		var serviceScale = this.state.rateGroupMap.get('serviceScale');
		var serviceRoundRule = this.state.rateGroupMap.get('serviceRoundRule');

        if(checkNull(this.state.orgConSn,'机构合同编号')){
            return;
        }
        if(!this.state.checkConSn1 || this.state.checkConSn2){
            warningInfo("机构合同编号不正确！");
            return;
        }
        if(!isRealNum(insTotTerm)){
            warningInfo("分期总期数,请输入数字！");
            return;
        }
        if(!isNumRange(serviceRate, 0, 1)){
            warningInfo("合作服务费比率,请输入0-1数字！");
            return;
        }
        if(!isNumRange(depositRate, 0, 1)){
            warningInfo("合作备用金比率,请输入0-1数字！");
            return;
        }
        if(!isNumRange1(boRate, 0, 1)){
            warningInfo("收买比率,请输入0-1(可等于1)数字！");
            return;
        }
        if(!isNumRange(loanRate, 0, 1)){
            warningInfo("贷款利率,请输入0-1数字！");
            return;
        }
        if(checkNull(''+amtCalRule,'金额计算规则')){
            return;
        }
        if(checkNull(''+adjustRule,'金额调整规则')){
            return;
        }
        if(checkNull(''+depRoundRule,'合作备用金进位规则')){
            return;
        }
        if(checkNull(''+depScale,'合作备用金小数位')){
            return;
        }
        if(checkNull(''+boRoundRule,'收买金额进位规则')){
            return;
        }
        if(checkNull(''+boScale,'收买金额小数位')){
            return;
        }
        if(checkNull(''+prnRoundRule,'本金进位规则')){
            return;
        }
        if(checkNull(''+prnScale,'本金小数位')){
            return;
        }
        if(checkNull(''+intCalRule,'计息规则')){
            return;
        }
        if(checkNull(''+intCalSdate,'计息起始日')){
            return;
        }
        if(checkNull(''+intCalBase,'计息基数')){
            return;
        }
        if(checkNull(''+dayOfYear,'全年计息天数')){
            return;
        }
        if(checkNull(''+intRoundRule,'计息进位规则')){
            return;
        }
        if(checkNull(''+intScale,'计息小数位数')){
            return;
        }

        var jsonStr = {
            "id":this.state.id,
            "orgConSn":this.state.orgConSn,
            "insTotTerm":insTotTerm,
            "serviceRate":serviceRate,
            "loanRate":loanRate,
            "depositRate":depositRate,
            "boRate":boRate,
            "amtCalRule": amtCalRule,
            "adjustRule": adjustRule,
            "prnRoundRule": prnRoundRule,
            "prnScale": prnScale,
            "boRoundRule": boRoundRule,
            "boScale": boScale,
            "depRoundRule": depRoundRule,
            "depScale": depScale,
            "intCalRule": intCalRule,
            "intCalSdate": intCalSdate,
            "intCalBase": intCalBase,
            "dayOfYear": dayOfYear,
            "intRoundRule": intRoundRule,
            "intScale": intScale,
            "remarks": this.state.remarks,
            "status":this.state.status,
            "createId": this.state.createId,
            "modifyId": this.state.modifyId,
			"serviceScale": serviceScale,
			"serviceRoundRule": serviceRoundRule,
        };
        var thi = this;
        console.log("json",jsonStr);
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+this.state.url,
            jsonStr).then(
            function (response) {
                console.log('200--',response)
                if(response.data.STATUS === "200"){
					successInfo("操作成功");
					thi.props.parent.setState({addOrEditOrgRateVisiable:false,
						readOrgRateVisiable:false
					})
                    thi.setState({ visible3: false, loading3: false });
                    thi.state.parent.state.parent.handleFilterSubmit();
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
    };

    handleCancel3 = () => {
        this.setState({
            visible3: false,
            rateGroupMap:new Map(),
		});
		this.props.parent.setState({addOrEditOrgRateVisiable:false,
			readOrgRateVisiable:false
		})		
    };

    handleDescription = (e) => {
        console.log(e.target.value);
        this.setState({ remarks: e.target.value});
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
	panelCallback(key) {
		console.log(key);
	}
    checkNumberRange = (e) => {
        //检查数字范围，并存储rateGroupMap
        this.state.rateGroupMap.set(e.target.id,e.target.value);
        this.setState({ rateGroupMap: this.state.rateGroupMap});

        if(e.target.value !== '' && e.target.value !== "" && e.target.value !== undefined){
            if(!isNumRange(e.target.value,0,1)){
                warningInfo("请输入大于等于0小于1的数字！");
                return;
            }
        }
    }

    checkNumberRange1 = (e) => {
        //检查数字范围，并存储rateGroupMap
        this.state.rateGroupMap.set(e.target.id,e.target.value);
        this.setState({ rateGroupMap: this.state.rateGroupMap});

        if(e.target.value !== '' && e.target.value !== "" && e.target.value !== undefined){
            if(!isNumRange1(e.target.value,0,1)){
                warningInfo("请输入大于等于0，小于等于1的数字！");
                return;
            }
        }
    }

    handleChangeOption = (id,value) => {
		const {readOrgRateVisiable} = this.props
		if(readOrgRateVisiable){
			return false
		}
		this.state.rateGroupMap.set(id,value);
        this.setState({ rateGroupMap: this.state.rateGroupMap});
    }

    handleOrgConType = (value) => {
        this.setState({
            orgConType: value,
         });
    }

    handleFunderCode = (value) => {
        this.setState({
            funderCode: value,
         });
    }

    initOrgConOption(value) {
        this.setState({
            orgConType: '',
            busiGroupCode: '',
            busiCompCode: '',
            busiSiteCode: '',
            funderCode: '',
            checkConSn1: false,
            checkConSn2: false
        });
        var thi = this;
        console.log("361-----initOrgConOption --this.state---",this.state);
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgconapi/queryCurtimeOrgConConfList',{
            "orgConSn": value,
        }).then(function (response) {
            console.log("---470---response--",response);
            if(response.data.STATUS === '200'){
                if(response.data.COUNT===1){
                    thi.setState({
                        orgConType: response.data.List[0].orgConType,
                        busiGroupCode: response.data.List[0].busiGroupSname,
                        busiCompCode: response.data.List[0].busiCompSname,
                        busiSiteCode: response.data.List[0].busiSiteSname,
                        funderCode: response.data.List[0].funderSname,
                        effectiveDatetime: response.data.List[0].effectiveDatetime,
                        expireDatetime: response.data.List[0].expireDatetime,
                        checkConSn1: true,
                        checkConSn2: false
                    });
                } else {
                    thi.setState({
                        checkConSn1: false,
                        checkConSn2: true
                    });
                }
            } else {
                thi.setState({
                    checkConSn1: false,
                    checkConSn2: true
                });
            }
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    handleOrgConSn = (e) => {
        this.setState({ orgConSn: e.target.value });
    }

    inputBlur = (e) => {
        this.initOrgConOption(e.target.value);
    }

    render() {
		const {readOrgRateVisiable} = this.props
        console.log("AddOrEdit render this.state",this.state);
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
                            <Button style={{display:`${readOrgRateVisiable?'none':''}`}} key="submit" type="primary" size="large" loading={this.state.loading3} onClick={this.handleOk3}>
                                提交
                            </Button>,
                        ]}
                        >
                    <Row gutter={8}>
                        <Col span={24}>
                        <br />
                            <Row className="mb-10">
                                <Col className="flex-cen-bet" span={5} style={{color:'red'}}>* 机构合同编号： 
								<div>
									<Input style={{ width: 120 }} value={this.state.orgConSn} onChange={this.handleOrgConSn} 
									onBlur={this.inputBlur} disabled={this.state.orgConSnFalg} placeholder="请输入合同编号" />
                                    <span style={{display:this.state.checkConSn1?'':'none'}}><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /></span>
                                    <span style={{display:this.state.checkConSn2?'':'none'}}><Icon type="close-circle" theme="twoTone" twoToneColor="#52c41a" /></span>
								</div>

								</Col>
								<Col span={5}>机构合同类型： 
								<Select value={this.state.orgConType} style={{ width: 120 }} disabled >
									{selectUtils('orgConType')}
								</Select>
								</Col>
                                <Col span={4}>资金方： <Select value={this.state.funderCode} style={{ width: 120 }} disabled />
								</Col>
								<Col span={4}>商户集团： <Select value={this.state.busiGroupCode} style={{ width: 120 }} disabled />
								</Col>
								<Col span={4}>商户公司：<Select value={this.state.busiCompCode} style={{ width: 120 }} disabled />
									</Col>
                            </Row>
                            <Row className="mb-10">
                                <Col span={4}>商户网点： <Select value={this.state.busiSiteCode} style={{ width: 120 }} disabled /></Col>
								<Col span={3} style={{color:'red'}}>* 分期总期数： <Input id="insTotTerm" style={{width:'50px'}} size="default" 
									value={this.state.rateGroupMap.get('insTotTerm')} onChange={this.checkNumber} disabled={readOrgRateVisiable} /></Col>


							<Col span={6}>生效日期： <DatePicker style={{width:'150px'}} 
								value={this.state.effectiveDatetime == null ? undefined : moment(this.state.effectiveDatetime, dateFormat)} 
								showTime="true" format="YYYY-MM-DD HH:mm:ss" disabled /></Col>
							<Col span={6}>失效日期： <DatePicker style={{width:'150px'}} 
								value={this.state.expireDatetime == null ? undefined : moment(this.state.expireDatetime, dateFormat)} 
								showTime="true" format="YYYY-MM-DD HH:mm:ss" disabled /></Col>
							<Col className="flex-cen-bet" span={5}>规则描述： <Input.TextArea style={{width:'140px'}} onChange={this.handleDescription} disabled={readOrgRateVisiable} value={this.state.remarks} rows="1" /></Col>
                            </Row>


							<Collapse defaultActiveKey={['1']} onChange={this.panelCallback}>
								<Panel header="本息" key="1">
								<Row justify="space-around" className="mb-10">
									<Col span={6}><span className="same-left-w">金额计算规则：</span><Select value={this.state.rateGroupMap.get('amtCalRule')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"amtCalRule")} style={{ width: 120 }} >
											{selectUtils('amtCalRule')}
										</Select> </Col>
									<Col span={6}><span className="same-left-w">金额调整规则：</span> <Select value={this.state.rateGroupMap.get('adjustRule')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"adjustRule")} style={{ width: 120 }} >
										{selectUtils('amtAdjustRule')}
									</Select></Col>
									<Col span={6}><span className="same-left-w">本金进位规则：</span> <Select value={this.state.rateGroupMap.get('prnRoundRule')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"prnRoundRule")} style={{ width: 120 }} >
										{selectUtils('roundRule')}
									</Select></Col>
									<Col span={6}><span className="same-left-w">本金小数位：</span> <Select value={this.state.rateGroupMap.get('prnScale')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"prnScale")} style={{ width: 120 }} >
										{selectUtils('decimalScale')}
									</Select></Col>
								</Row>
							<Row className="mb-10">
										<Col span={6}><span className="same-left-w">贷款利率：</span> <Input id="loanRate" style={{width:'120px'}} size="default" value={this.state.rateGroupMap.get('loanRate')} disabled={readOrgRateVisiable} onChange={this.checkNumberRange} /></Col>
										<Col span={6}><span className="same-left-w">计息规则：</span> <Select value={this.state.rateGroupMap.get('intCalRule')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"intCalRule")} style={{ width: 120 }} >
														{selectUtils('intCalRule')}
														</Select></Col>
										<Col span={6}><span className="same-left-w">计息起始日：</span><Select value={this.state.rateGroupMap.get('intCalSdate')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"intCalSdate")} style={{ width: 120 }} >
                                        {selectUtils('intCalStartdate')}
                                    </Select></Col>
									<Col span={6}><span className="same-left-w">计息基数：</span> <Select value={this.state.rateGroupMap.get('intCalBase')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"intCalBase")} style={{ width: 120 }} >
                                        {selectUtils('intCalBase')}
                                    </Select></Col>
							</Row>
							<Row className="mb-10">                                
                                <Col span={6}><span className="same-left-w">全年计息天数：</span> <Select value={this.state.rateGroupMap.get('dayOfYear')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"dayOfYear")} style={{ width: 120 }} >
                                        {selectUtils('dayOfYear')}
                                    </Select></Col>                                
								<Col span={6}><span className="same-left-w">计息进位规则：</span> <Select value={this.state.rateGroupMap.get('intRoundRule')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"intRoundRule")} style={{ width: 120 }} >
                                        {selectUtils('roundRule')}
                                    </Select></Col>                                
								<Col span={6}><span className="same-left-w">计息小数位数：</span> <Select value={this.state.rateGroupMap.get('intScale')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"intScale")} style={{ width: 120 }} >
									{selectUtils('decimalScale')}
								</Select></Col>
                            </Row>
							</Panel>
						<Panel header="合作与收买" key="2">
							<Row className="mb-10">
								<Col span={6}><span className="same-left-w">服务费小数位：</span> <Select value={this.state.rateGroupMap.get('serviceScale')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"serviceScale")} style={{ width: 120 }} >
										{selectUtils('decimalScale')}
									</Select></Col>
								<Col span={6}><span className="same-left-w">服务费进位规则：</span> <Select value={this.state.rateGroupMap.get('serviceRoundRule')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"serviceRoundRule")} style={{ width: 120 }} >
									{selectUtils('roundRule')}
								</Select></Col>
                                <Col span={6}><span className="same-left-w">服务费比率：</span> <Input id="serviceRate" style={{width:'120px'}} size="default" value={this.state.rateGroupMap.get('serviceRate')} disabled={readOrgRateVisiable} onChange={this.checkNumberRange} /></Col>
							</Row>

							<Row className="mb-10">
								<Col span={6}><span className="same-left-w">备用金比率：</span> <Input id="depositRate" style={{width:'120px'}} size="default" value={this.state.rateGroupMap.get('depositRate')} disabled={readOrgRateVisiable} onChange={this.checkNumberRange} /></Col>
								<Col span={6}><span className="same-left-w">备用金进位规则：</span> <Select value={this.state.rateGroupMap.get('depRoundRule')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"depRoundRule")} style={{ width: 120 }} >
                                        {selectUtils('roundRule')}
                                    </Select></Col>
									<Col span={6}><span className="same-left-w">备用金小数位：</span> <Select value={this.state.rateGroupMap.get('depScale')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"depScale")} style={{ width: 120 }} >
                                        {selectUtils('decimalScale')}
                                    </Select></Col>
							</Row>

                            <Row className="mb-10">
                                
								<Col span={6}><span className="same-left-w">收买比率：</span> <Input id="boRate" style={{width:'120px'}} size="default" value={this.state.rateGroupMap.get('boRate')} disabled={readOrgRateVisiable} onChange={this.checkNumberRange1} /></Col>
								<Col span={6}><span className="same-left-w">收买金额进位规则：</span> <Select value={this.state.rateGroupMap.get('boRoundRule')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"boRoundRule")} style={{ width: 120 }} >
                                        {selectUtils('roundRule')}
                                    </Select></Col>
									<Col span={6}><span className="same-left-w">收买金额小数位：</span> <Select value={this.state.rateGroupMap.get('boScale')} disabled={readOrgRateVisiable} onChange={this.handleChangeOption.bind(this,"boScale")} style={{ width: 120 }} >
                                        {selectUtils('decimalScale')}
                                    </Select></Col>
                            </Row>
                        
							</Panel>
							</Collapse>
						</Col>
                    </Row>	
                    </Modal>
            </div>
        );
    }
}

export default AddOrEditOrgRateConf;