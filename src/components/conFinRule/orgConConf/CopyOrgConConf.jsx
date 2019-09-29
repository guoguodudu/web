import React from 'react';
import {Modal, Button, Input, Row, Col, DatePicker, Select, Collapse, Checkbox} from 'antd';
import moment from 'moment';
import axios from 'axios';
import {selectUtils} from '../../../SelectUtils.jsx';
import {checkNull, successInfo, warningInfo, isGreaterToday,sysErrorInfo} from '../../../Common.jsx';
import {checkNumNull, isRealNum} from "../../../Common";

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const confirm = Modal.confirm;
const { Panel } = Collapse;
class CopyOrgConConf extends React.Component {

    state = {
        visible: false,
		rateGroupMap: new Map(),
    };



    componentWillMount() {
        console.log("------CopyOrgConConf---18---componentWillMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------CopyOrgConConf---27--nextProps--componentWillReceiveProps---------------",nextProps);
        if(nextProps.visiable){
            //初始化时候只往Select里面加Option,不用关注层级关系
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
                record:nextProps.record,
                parent:nextProps.parent,
                visible:nextProps.visiable,
                orgConTypeSelect: nextProps.record.orgConType,
                orgConSn: nextProps.record.orgConSn,
                assetType: nextProps.record.assetType,
                assetTypeSelect: nextProps.record.assetType,

                effectiveDatetime: nextProps.record.effectiveDatetime,
                effectiveDatetimeStr: nextProps.record.effectiveDatetime,
                expireDatetime: nextProps.record.expireDatetime,
                expireDatetimeStr: nextProps.record.expireDatetime,
                remarks: nextProps.record.remarks,
                orgConTypeDisa: true,
                mainConSnDisa: true,
                funderCodeDisa: true,
                busiGroupCodeDisa: true,
                busiCompCodeDisa: true,
                busiSiteCodeDisa: true,
                assetTypeDisa: true,
				rateGroupMap:rateGroupMap,
            });
            if(nextProps.record.orgConType==='FL'){
                this.setState({
                    mainConSnFlag: true,

                });
                this.queryMainConSn(nextProps.record.orgConSn);
            } else {
                this.setState({
                    mainConSnFlag: false,
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
        var mainConSnList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/conrelapi/queryOrgConRelList',
        {
            "orgConSn": orgConSn
        }).then(function (response) {
            console.log("--121--response",response);
            for (var i = 0; i < response.data.List.length; i++) {
                mainConSnList.push(response.data.List[i]['mainConSn']);
            }
            thi.setState({
                mainConSn: mainConSnList,
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });

    }
    handleOk = () => {
        console.log("------EditRepayDayRule----submit---提交数据到后台---state--------------",this.state);

        if(checkNull(this.state.orgConSn,'机构合同编号')){
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
        var busiGroupCode = this.state.busiGroupCodeSelect;
        var busiCompCode = this.state.busiCompCodeSelect;
        var busiSiteCode = this.state.busiSiteCodeSelect;
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

        if(this.state.orgConSn===this.state.record.orgConSn){
            warningInfo("复制时合同编号需改变！");
            return;
        }
        if(this.state.orgConTypeSelect===this.state.record.orgConType
            && this.state.funderCodeSelect===this.state.record.funderCode
            && busiGroupCode===this.state.record.busiGroupCode
            && busiCompCode===this.state.record.busiCompCode
            && busiSiteCode===this.state.record.busiSiteCode
            && this.state.assetTypeSelect===this.state.record.assetType
            ){
                confirm({
                    title: '提示信息',
                    content: '您确定要复制该规则，自动复制相关的费率，分案数据吗？',
                    okText: '确定',
                    okType: 'primary',
                    cancelText: '取消',
                    onOk() {
                            axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgconapi/copyOrgConConf',
                            {
                                "busiGroupCode": busiGroupCode,
                                "busiCompCode": busiCompCode === "请选择" ? undefined : busiCompCode,
                                "busiSiteCode": busiSiteCode === "请选择" ? undefined : busiSiteCode,
                                "orgConType": thi.state.orgConTypeSelect,
                                "orgConSn": thi.state.orgConSn,
                                "funderCode": thi.state.funderCodeSelect,
                                "assetType": thi.state.assetTypeSelect,
                                "effectiveDatetime": thi.state.effectiveDatetimeStr,
                                "expireDatetime": thi.state.expireDatetimeStr,
                                "remarks": thi.state.remarks,
                                "status": 'DRAFT',
                                "createId":localStorage.getItem('userName'),
                                "oldOrgConSn":thi.state.record.orgConSn,
								"isFirstTran":isFirstTran,
								"firstTranMin":firstTranMin,
								"firstTranScale":firstTranScale,
								"firstTranRule":firstTranRule,
								"isTran":isTran,
								"tranMin":tranMin,
								"tranScale":tranScale,
								"tranRule":tranRule,
								"tranType":tranType,
								"firstTranType":firstTranType,
								"tranValue":tranValue,
								"firstTranValue":firstTranValue,
                            }
                            ).then(
                                function (response) {
                                    console.log('response--',response)
                                    if(response.data.STATUS === "200"){
                                        successInfo("规则复制成功");
										thi.setState({ visible: false });
										thi.props.parent.setState({copyOrgConConfVisiable:false})
                                        thi.state.parent.state.parent.handleFilterSubmit();
                                    } else {
                                        sysErrorInfo();
                                    }
                            }).catch(function (error) {
                                sysErrorInfo(error);
                            });
                    },
                    onCancel() {
                        //取消
                        thi.setState({ visible: false });
                    },
                });
        } else {
            warningInfo("只能执行复制功能");
        }

    }



    handleCancel = () => {
		this.setState({ visible: false });
		this.props.parent.setState({copyOrgConConfVisiable:false})
    };

    handleOrgConSn = (e) => {
        this.setState({orgConSn: e.target.value});
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

	handleAssetType = (value) => {
		this.setState({assetTypeSelect: value});

		if(value === 'CA' ) {
			this.state.rateGroupMap.set('isTran',true);
		}else {
			this.state.rateGroupMap.set('isTran',false);
		}

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
                        width={'800px'}
                        visible={this.state.visible}
                        title="复制机构合同维护规则"
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
                                    <Select value={this.state.orgConTypeSelect} onChange={this.handleOrgConType} style={{width:'160px'}} disabled={this.state.orgConTypeDisa} >
                                        {selectUtils('orgConType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 机构合同编号： </Col>
                                <Col span={16}>
                                    <Input id="orgConSn" style={{width:'160px'}} value={this.state.orgConSn} onChange={this.handleOrgConSn} onBlur={this.blurOrgConSn} />
                                </Col>
                            </Row>
                            <br style={{display:this.state.mainConSnFlag?'':'none'}} />
                            <Row style={{display:this.state.mainConSnFlag?'':'none'}} >
                                <Col span={8} style={{color:'red'}}>* 主合同编号： </Col>
                                <Col span={16}>
                                    <Input.TextArea id="mainConSn" style={{width:'160px'}} value={this.state.mainConSn} onChange={this.handleMainConSn} disabled={this.state.mainConSnDisa} rows="3" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 资金方： </Col>
                                <Col span={16}>
                                    <Select value={this.state.funderCodeSelect} onChange={this.handleFunderCode} style={{ width: '160px' }} disabled={this.state.funderCodeDisa} >
                                        {this.state.funderCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 商户集团： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiGroupCodeSelect} onChange={this.handleBusiGroupCode} style={{width:'160px'}} disabled={this.state.busiGroupCodeDisa} >
                                        {this.state.busiGroupCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户公司： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiCompCodeSelect} onChange={this.handleBusiCompCode} style={{width:'160px'}} disabled={this.state.busiCompCodeDisa} >
                                        {this.state.busiCompCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>商户网点： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiSiteCodeSelect} onChange={this.handleBusiSiteCode} style={{width:'160px'}} disabled={this.state.busiSiteCodeDisa} >
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
                                    <Select value={this.state.assetTypeSelect} onChange={this.handleAssetType} style={{width:'160px'}} disabled={this.state.assetTypeDisa} >
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
                    </Row><br />
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
export default CopyOrgConConf;