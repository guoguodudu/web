import React from 'react';
import { Modal,Button,Input,Row,Col,DatePicker,Select,Icon } from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';
import {sysErrorInfo,errorInfo,warningInfo,isRealNum,checkIsNum2,isNumRange1,successInfo,checkNull } from '../../../Common.jsx';

import moment from 'moment';
import axios from 'axios';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class AddOrEditTfeeRateConf extends React.Component {

    state = {

    };


    componentWillMount() {
        console.log("----------AddOrEditRateConfRule.componentWillMount---------------");
        this.setState({
            loading3: false,
            visible3: this.props.visiable,
            groupMap: new Map(),
        })
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------AddOrEditRateConfRule.componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){
            this.setState({
                parent:nextProps.parent,
                visible3: nextProps.visiable,
            });
            var groupMap= new Map();
            if(nextProps.parent.state.type ==='add'){
                groupMap.set("tfeeCalValue",0);

                this.setState({
                    id:undefined,
                    groupMap:groupMap,
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
                    url:'/tfeerateapi/addTfeeRateConf',
                    orgConSnFalg:false,
                    type:'新增富金服费率规则',


                });

            } else if(nextProps.parent.state.type ==='edit'){
                groupMap.set("insTotTerm",nextProps.record.insTotTerm);
                groupMap.set("tfeeCalRule",nextProps.record.tfeeCalRule);
                groupMap.set("tfeeCalValue",nextProps.record.tfeeCalValue);
                groupMap.set("tfeeScale",''+nextProps.record.tfeeScale);
                groupMap.set("tfeeRoundRule",nextProps.record.tfeeRoundRule);
                groupMap.set("tfeeReturnFlag",nextProps.record.tfeeReturnFlag);

                this.setState({

                    id:nextProps.record.tfee_id,
                    groupMap:groupMap,
                    orgConSn:nextProps.record.orgConSn,
                    orgConType:nextProps.record.orgConType,
                    funderCode:nextProps.record.funderCode,
                    busiGroupCode:nextProps.record.busiGroupCode,
                    busiCompCode:nextProps.record.busiCompCode,
                    busiSiteCode:nextProps.record.busiSiteCode,
                    remarks:nextProps.record.remarks,
                    effectiveDatetime:nextProps.record.conf_effectiveDatetime,
                    effectiveDatetimeStr:nextProps.record.conf_effectiveDatetime,
                    expireDatetime:nextProps.record.conf_expireDatetime,
                    expireDatetimeStr:nextProps.record.conf_expireDatetime,
                    status:nextProps.record.tfee_status,
                    createId:undefined,
                    modifyId:localStorage.getItem('userName'),
                    url:'/tfeerateapi/updateTfeeRateConf',
                    orgConSnFalg:true,
                    type:'编辑富金服费率规则',
                    checkConSn1: true,
                    checkConSn2: false
                });
            } else if(nextProps.parent.state.type === 'copy'){

                groupMap.set("insTotTerm",nextProps.record.insTotTerm);
                groupMap.set("tfeeCalRule",nextProps.record.tfeeCalRule);
                groupMap.set("tfeeCalValue",nextProps.record.tfeeCalValue);
                groupMap.set("tfeeScale",''+nextProps.record.tfeeScale);
                groupMap.set("tfeeRoundRule",nextProps.record.tfeeRoundRule);
                groupMap.set("tfeeReturnFlag",nextProps.record.tfeeReturnFlag);

                this.setState({
                    id:undefined,
                    groupMap:groupMap,
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
                    status:"DRAFT",
                    createId:localStorage.getItem('userName'),
                    modifyId:undefined,
                    url:'/tfeerateapi/addTfeeRateConf',
                    orgConSnFalg:false,
                    type:'复制富金服费率规则',
                    checkConSn1: true,
                    checkConSn2: false
                });

            }
        }
        console.log("this.state",this.state);
    }

    handleOk3 = () => {
        console.log("handleOk3---this.state--",this.state);
        var insTotTerm = this.state.groupMap.get('insTotTerm');
        var tfeeCalRule = this.state.groupMap.get('tfeeCalRule');
        var tfeeCalValue = this.state.groupMap.get('tfeeCalValue');
        var tfeeScale = this.state.groupMap.get('tfeeScale');
        var tfeeRoundRule = this.state.groupMap.get('tfeeRoundRule');
        var tfeeReturnFlag = this.state.groupMap.get('tfeeReturnFlag');

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
        if(!checkIsNum2(tfeeCalValue)){
            warningInfo("费率数值,请输入数字！");
            return;
        }

		if(checkNull(tfeeCalRule,'计算规则')){
			return;
		}

        if(tfeeCalRule !== 'F'){
        	// 非【固定费用】才进行下面的校验

			if(checkNull(tfeeScale,'小数位')){
				return;
			}

			if(checkNull(''+tfeeRoundRule,'进位规则')){
				return;
			}
	}

        if(checkNull(tfeeReturnFlag,'退费标识')){
            return;
        }
		var jsonStr;
		if(tfeeCalRule === 'F'){// 固定费用
			jsonStr = { "id":this.state.id,
				"orgConSn":this.state.orgConSn,
				"insTotTerm":insTotTerm,
				"tfeeCalRule":tfeeCalRule,
				"tfeeCalValue":tfeeCalValue,
				"tfeeReturnFlag": tfeeReturnFlag,
				"remarks": this.state.remarks,
				"status":this.state.status,
				"createId": this.state.createId,
				"modifyId": this.state.modifyId,
			};
		}else{// 费率
			jsonStr = { "id":this.state.id,
				"orgConSn":this.state.orgConSn,
				"insTotTerm":insTotTerm,
				"tfeeCalRule":tfeeCalRule,
				"tfeeCalValue":tfeeCalValue,
				"tfeeScale":tfeeScale,
				"tfeeRoundRule":tfeeRoundRule,
				"tfeeReturnFlag": tfeeReturnFlag,
				"remarks": this.state.remarks,
				"status":this.state.status,
				"createId": this.state.createId,
				"modifyId": this.state.modifyId,
			};
		}

		var thi = this;
		console.log("json",jsonStr);
		axios.post(localStorage.getItem('IP_PORT_BACKEND')+this.state.url,
			jsonStr).then(
			function (response) {
				console.log('200--',response)
				if(response.data.STATUS === "200"){
					successInfo("操作成功");
					thi.setState({ visible3: false, loading3: false });
					thi.props.hideAllModal();
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
            groupMap:new Map(),
		});
		this.props.hideAllModal();		
    };

    handleDescription = (e) => {
        console.log(e.target.value);
        this.setState({ remarks: e.target.value});
    }

    checkNumber = (e) => {
        //检查是否是数字，并存储groupMap
        this.state.groupMap.set(e.target.id,e.target.value);
        this.setState({ groupMap: this.state.groupMap});

        if(e.target.value !== '' && e.target.value !== "" && e.target.value !== undefined){
            if(!isRealNum(e.target.value)){
                warningInfo("请输入数字！");
                return;
            }
        }

    }
    checkNumber2 = (e) => {
        //检查数字范围，并存储groupMap
        this.state.groupMap.set(e.target.id,e.target.value);
        this.setState({ groupMap: this.state.groupMap});

        if(e.target.value !== '' && e.target.value !== "" && e.target.value !== undefined){

            if(!checkIsNum2(e.target.value)){
                warningInfo("请输入数字！");
                return;
            }
        }

    }
    checkNumberRange1 = (e) => {
        //检查数字范围，并存储groupMap
        this.state.groupMap.set(e.target.id,e.target.value);
        this.setState({ groupMap: this.state.groupMap});

        if(e.target.value !== '' && e.target.value !== "" && e.target.value !== undefined){
            if(!isNumRange1(e.target.value,0,1)){
                warningInfo("请输入大于等于0，小于等于1的数字！");
                return;
            }
        }

    }

    handleChangeOption = (id,value) => {
        this.state.groupMap.set(id,value);
        this.setState({ groupMap: this.state.groupMap});
    }

    handleOrgConType = (value) => {
        this.setState({
            orgConType: value,
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
        return (
            <div className="gutter-example">
                        <Modal
                        width={'900px'}
                        visible={this.state.visible3}

                        title={this.state.type}
                        onOk={this.handleOk3}
                        onCancel={this.handleCancel3}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel3}>取消</Button>,
                            <Button key="submit" type="primary" size="large" loading={this.state.loading3} onClick={this.handleOk3}>
                                提交
                            </Button>,
                        ]}
                        >
                    <Row>
                        <Col span={10}>
                        <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 机构合同编号： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.orgConSn} onChange={this.handleOrgConSn} onBlur={this.inputBlur} disabled={this.state.orgConSnFalg} placeholder="请输入合同编号" />
                                    <span style={{display:this.state.checkConSn1?'':'none'}}><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /></span>
                                    <span style={{display:this.state.checkConSn2?'':'none'}}><Icon type="close-circle" theme="twoTone" twoToneColor="#52c41a" /></span>
                                </Col>
                            </Row>
                        <br />
                            <Row>
                                <Col span={8}>机构合同类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.orgConType} style={{ width: 200 }} disabled >
                                        {selectUtils('orgConType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>资金方： </Col>
                                <Col span={16}>
                                    <Select value={this.state.funderCode} style={{ width: 200 }} disabled >
                                    {//</Select></Select></Select>this.state.funderCodeList
                                    }
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户集团： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiGroupCode} style={{ width: 200 }} disabled>
                                        {/* {this.state.busiGroupCodeList} */}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户公司： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiCompCode} style={{ width: 200 }} disabled>
                                        {/* {this.state.busiCompCodeList} */}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户网点： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiSiteCode} style={{ width: 200 }} disabled>
                                        {/* {this.state.busiSiteCodeList} */}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> <Col span={8}>生效日期： </Col><Col span={16}><DatePicker style={{width:'150px'}} value={this.state.effectiveDatetime == null ? undefined : moment(this.state.effectiveDatetime, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" disabled /></Col></Row>
                            <br />
                            <Row> <Col span={8}>失效日期： </Col><Col span={16}><DatePicker style={{width:'150px'}} value={this.state.expireDatetime == null ? undefined : moment(this.state.expireDatetime, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" disabled /></Col></Row>


                        </Col>
                        <Col span={2} />
                        <Col span={10}>
                        <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 分期总期数： </Col>
                                <Col span={16}><Input id="insTotTerm" style={{width:'200px'}} size="default" value={this.state.groupMap.get('insTotTerm')} onChange={this.checkNumber} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>计算规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.groupMap.get('tfeeCalRule')} onChange={this.handleChangeOption.bind(this,"tfeeCalRule")} style={{ width: 200 }} >
                                        {selectUtils('calRule')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>费率数值： </Col>
                                <Col span={16}><Input id="tfeeCalValue" style={{width:'200px'}} value={this.state.groupMap.get('tfeeCalValue')} onChange={this.checkNumber2} /></Col>
                            </Row>
							<div style={{ display : this.state.groupMap.get('tfeeCalRule') === 'F' ? 'none' : '' }} >
								<br />
								<Row>
									<Col span={8}>小数位： </Col>
									<Col span={16}>
										<Select value={this.state.groupMap.get('tfeeScale')} onChange={this.handleChangeOption.bind(this,"tfeeScale")} style={{ width: 200 }} >
											{selectUtils('decimalScale')}
										</Select>
									</Col>
								</Row>
								<br />
								<Row>
									<Col span={8}>进位规则： </Col>
									<Col span={16}>
										<Select value={this.state.groupMap.get('tfeeRoundRule')} onChange={this.handleChangeOption.bind(this,"tfeeRoundRule")} style={{ width: 200 }} >
											{selectUtils('roundRule')}
										</Select>
									</Col>
								</Row>
							</div>
                            <br />
                            <Row>
                                <Col span={8}>退费标识： </Col>
                                <Col span={16}>
                                    <Select value={this.state.groupMap.get('tfeeReturnFlag')} onChange={this.handleChangeOption.bind(this,"tfeeReturnFlag")} style={{ width: 200 }} >
                                        {selectUtils('returnFlag')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> <Col span={8}>规则描述： </Col><Col span={16}><Input.TextArea style={{width:'200px'}} onChange={this.handleDescription} value={this.state.remarks} rows="4" /></Col></Row>

                        </Col>


                    </Row>

                    </Modal>
            </div>
        );
    }
}

export default AddOrEditTfeeRateConf;