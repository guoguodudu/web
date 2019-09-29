import React from "react";
import { Select, Form ,Input } from "antd";
import "../../../style/table.less";
import { sysErrorInfo } from "../../../Common.jsx";
import {withRouter} from "react-router-dom";
import {contractConf,supInfo,funderInfo} from "@/api";
const FormItem = Form.Item;

class SupFunderCodeConditionAuth extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.comWillMountInit = this.comWillMountInit.bind(this);
	}

	componentWillMount() {
	}

	componentDidMount() {
		this.user = JSON.parse(localStorage.getItem("user"));
		console.log(
			"-------------OrgCodeCondition.componentDidMount-------35---------",
			this.props
		);
		this.props.onRef(this);
		if(this.user===null || this.user===undefined){
			const { history } = this.props ;
			console.log(this)
			history.push('/login')
			return false
		}
		this.comWillMountInit();
	}

	componentWillReceiveProps(nextProps) {
		console.log(
			"-------------OrgCodeCondition.componentWillReceiveProps----57------------",
			nextProps
		);
	}
	comWillMountInit() {
		console.log("==============进入========");
		
		//页面控制显示机构条件
		var pOrgType = this.props.parent.state.pOrgType;
		var uOrgType = this.user.orgType;
		//用户权限控制可选的机构
		console.log("-19-pOrgType-", pOrgType);
		console.log("-19-uOrgType-", uOrgType);
		if (pOrgType === "CODE" && uOrgType === "FUNDER") {
			this.setState({
				codeVisible: "",
				conVisible: "none"
			});
			this.initFunderCodeByRole();
			this.initSupCodeByStock();
		} else if (pOrgType === "CODE" && uOrgType === "SUP") {
			this.setState({
				codeVisible: "",
				conVisible: "none"
			});
			this.initSupCodeByRole();
			this.initFunderCodeByStock();
		} else if (pOrgType === "CON") {
			this.setState({
				codeVisible: "none",
				conVisible: ""
			});
		} else if (pOrgType === "CODE" && uOrgType === "TSERVICE"){
			this.setState({
				codeVisible: "",
				conVisible: "none"
			});
			this.initFunderCode();
			this.initSupCode();
		} else if (pOrgType === "ALL" && uOrgType === "FUNDER") {
			this.setState({
				codeVisible: "",
				conVisible: ""
			});
			this.initFunderCodeByRole();
			this.initSupCodeByStock();
		} else if (pOrgType === "ALL" && uOrgType === "SUP") {
			this.setState({
				codeVisible: "",
				conVisible: ""
			});
			this.initSupCodeByRole();
			this.initFunderCodeByStock();
		} else if (pOrgType === "ALL" && uOrgType === "TSERVICE"){
			this.setState({
				codeVisible: "",
				conVisible: ""
			});
			this.initFunderCode();
			this.initSupCode();
		}
		this.setState({
			mainConCode:undefined,
			funderConCode:undefined
		})
	}
	initFunderCode() {
        var thi = this;
        var funderCodeList = [];
        funderInfo.condition({
            orgType:"FUNDER"
        }).then(function (response) {
            for (var i = 0; i < response.length; i++) {
                if(response[i] !== null){
                    funderCodeList.push(<Select.Option key={response[i].orgCode} >{response[i].orgName}</Select.Option>);
                }
            }
            thi.setState({
                funderCodeList: funderCodeList,
            	funderCode: undefined,
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    initSupCode() {
        var thi = this;
        var supCodeList = [];
        supInfo.condition({}).then(function (response) {
			for (var i = 0; i < response.length; i++) {
				if(response[i] !== null){
					supCodeList.push(<Select.Option key={response[i].supCode} >{response[i].supShortName}</Select.Option>);
				}
			}
            thi.setState({
                supCodeList: supCodeList,
                supCode: undefined,
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }


	initFunderCodeByRole() {
		var funderCodeList = [];
		funderCodeList.push(
			<Select.Option key={this.user.orgGroupCode}>
				{this.user.orgGroupSname}
			</Select.Option>
		);
		this.setState({
			funderCodeList: funderCodeList,
			funderCode: this.user.orgGroupCode,
			funderCodeDisa: true
		});
	}

	initFunderCodeByStock() {
		var thi = this;
		var funderCodeList = [];
		contractConf.stock({}).then(function(response) {
			for (var i = 0; i < response.length; i++) {
				if(response[i] !== null){
					funderCodeList.push(
						<Select.Option key={response[i].funderCode} >
							{response[i].funderSname}
						</Select.Option>
					);
				}
			}
			thi.setState({
				funderCodeList: funderCodeList,
				funderCodeDisa: funderCodeList.length === 0 ? true : false,
				funderCode: funderCodeList.length === 0 ? 'no contract': undefined,
			});
		})
		.catch(function(error) {
			sysErrorInfo(error);
		});
	}

	initSupCodeByRole() {
		var supCodeList = [];
		supCodeList.push(
			<Select.Option key={this.user.orgGroupCode}>
				{this.user.orgGroupSname}
			</Select.Option>
		);
		this.setState({
			supCodeList: supCodeList,
			supCodeDisa: true,
			supCode: this.user.orgGroupCode,
		});
	}
	//根据合同配置表里的资金方查存量供应商集团
	initSupCodeByStock() {
		var thi = this;
		var supCodeList = [];
		contractConf.stock({}).then(function(response) {
			
			for (var i = 0; i < response.length; i++) {
				if (response[i] != null) {
					supCodeList.push(
						<Select.Option key={response[i].supCode} >
							{response[i].supSname}
						</Select.Option>
					);
				}
			}
			thi.setState({
				supCodeList: supCodeList,
				supCodeDisa: supCodeList.length === 0 ? true : false,
				supCode: supCodeList.length === 0 ? 'no contract': undefined,
			});
			
		})
		.catch(function(error) {
			sysErrorInfo(error);
		});
	}

	handleSupCode = value => {
		this.setState({
			supCode: value
		});
	};

	handleFunderCode = value => {
		this.setState({
			funderCode: value
		});
	};
	handleMainConCode = (e) => {
        this.setState({
            mainConCode: e.target.value,
        });

    }
    handleFunderConCode = (e) => {
        this.setState({
            funderConCode: e.target.value,
        });

    }

	reset = () => {
		this.comWillMountInit();
	};

	render() {
		return (
			<span>
                <span style={{display : this.state.codeVisible }} >
                <FormItem label={'供应商：'}>
                    <Select style={{ width: 160 }} placeholder="请选择" onChange={this.handleSupCode} value={this.state.supCode} disabled={this.state.supCodeDisa}>
                        {this.state.supCodeList}
                    </Select>
                </FormItem>
                <FormItem label={'资金方：'}>
                    <Select style={{ width: 160 }} placeholder="请选择" onChange={this.handleFunderCode} value={this.state.funderCode} disabled={this.state.funderCodeDisa}>
                        {this.state.funderCodeList}
                    </Select>
                </FormItem>

                </span>
                <span style={{display : this.state.conVisible }} >
                
                <FormItem label={'业务合同编号：'}>
                    <Input style={{ width: 160 }} value={this.state.mainConCode} onChange={this.handleMainConCode} />
                </FormItem>
                <FormItem label={'资金合同编号：'}>
                    <Input style={{ width: 160 }} value={this.state.funderConCode} onChange={this.handleFunderConCode} />
                </FormItem>
                </span>
            </span>

		);
	}
}

export default (withRouter(SupFunderCodeConditionAuth));