import React from "react";
import { Select, Form } from "antd";
import axios from "axios";
import "../../../style/table.less";
import { sysErrorInfo, checkEmpty } from "../../../Common.jsx";
import {withRouter} from "react-router-dom";
const FormItem = Form.Item;

class OrgCodeConditionAuth extends React.Component {
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
		if (pOrgType === "FUNDER" && uOrgType === "FUNDER") {
			this.setState({
				funderVisible: "",
				busiVisible: "none"
			});
			this.initFunderCodeByRole();
		} else if (pOrgType === "BUSI" && uOrgType === "BUSI") {
			this.setState({
				funderVisible: "none",
				busiVisible: ""
			});
			this.initGroupCodeByRole();
		} else if (pOrgType === "BUSI" && uOrgType === "FUNDER") {
			this.setState({
				funderVisible: "none",
				busiVisible: ""
			});
			this.initFunderCodeByRole();
			this.initGroupCodeByStock(this.user.orgGroupCode);
		} else if (pOrgType === "FUNDER" &&
			(uOrgType === "FSERVICE" || uOrgType === "TSERVICE")
		) {
			this.setState({
				funderVisible: "",
				busiVisible: "none"
			});
			this.initFunderCode();
		} else if (
			pOrgType === "BUSI" &&
			(uOrgType === "FSERVICE" || uOrgType === "TSERVICE")
		) {
			this.setState({
				funderVisible: "none",
				busiVisible: ""
			});
			this.initBusiGroupCode();
		} else if (pOrgType === "ALL" && uOrgType === "FUNDER") {
			this.setState({
				funderVisible: "",
				busiVisible: ""
			});
			this.initFunderCodeByRole();
			this.initGroupCodeByStock(this.user.orgGroupCode);
		} else if (pOrgType === "ALL" && uOrgType === "BUSI") {
			this.setState({
				funderVisible: "",
				busiVisible: ""
			});
			this.initFunderCodeByStock();
			this.initGroupCodeByRole();
		} else if (
			pOrgType === "ALL" &&
			(uOrgType === "FSERVICE" || uOrgType === "TSERVICE")
		) {
			this.setState({
				funderVisible: "",
				busiVisible: ""
			});
			this.initFunderCode();
			this.initBusiGroupCode();
		}
	}
	initFunderCode() {
		var thi = this;
		var funderCodeList = [];
		axios
			.post(

					localStorage.getItem("IP_PORT_BACKEND") +
					"/confapi/queryOrgProfileList",
				{
					orgType: "FUNDER"
				}
			)
			.then(function(response) {
				if (response.data.STATUS === "200") {
					for (var i = 0; i < response.data.List.length; i++) {
						if (response.data.List[i] != null) {
							funderCodeList.push(
								<Select.Option key={response.data.List[i].code}>
									{response.data.List[i].shortname}
								</Select.Option>
							);
						}
					}
					thi.setState({
						funderCodeList: funderCodeList,
						funderCode: "请选择"
					});
				}
			})
			.catch(function(error) {
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
		axios
			.post(

					localStorage.getItem("IP_PORT_BACKEND") +
					"/orgconapi/queryStockOrgList",
				{
					busiGroupCode: this.user.orgGroupCode,
					busiCompCode: checkEmpty(this.user.orgCompCode)
						? undefined
						: this.user.orgCompCode,
					busiSiteCode: checkEmpty(this.user.orgSiteCode)
						? undefined
						: this.user.orgSiteCode
				}
			)
			.then(function(response) {
				if (response.data.STATUS === "200") {
					for (var i = 0; i < response.data.List.length; i++) {
						if (response.data.List[i] != null) {
							funderCodeList.push(
								<Select.Option
									key={response.data.List[i].funderCode}
								>
									{response.data.List[i].funderSname}
								</Select.Option>
							);
						}
					}
					thi.setState({
						funderCodeList: funderCodeList,
						funderCodeDisa: funderCodeList.length === 0 ? true : false,
						funderCode: funderCodeList.length === 0 ? 'no contract': "请选择",
					});
				}
			})
			.catch(function(error) {
				sysErrorInfo(error);
			});
	}

	initBusiGroupCode() {
		var thi = this;
		var busiGroupCodeList = [];
		axios
			.post(

					localStorage.getItem("IP_PORT_BACKEND") +
					"/confapi/queryOrgProfileList",
				{
					orgType: "BUSI"
				}
			)
			.then(function(response) {
				if (response.data.STATUS === "200") {
					for (var i = 0; i < response.data.List.length; i++) {
						if (response.data.List[i] != null) {
							busiGroupCodeList.push(
								<Select.Option key={response.data.List[i].code}>
									{response.data.List[i].shortname}
								</Select.Option>
							);
						}
					}
					thi.setState({
						busiGroupCodeList: busiGroupCodeList,
						busiGroupDisa:
							busiGroupCodeList.length === 0 ? true : false,
						busiGroupCode: "请选择",
						busiCompCode: "请选择",
						busiSiteCode: "请选择",
						busiCompCodeList: [],
						busiSiteCodeList: [],
						busiCompDisa: true,
						busiSiteDisa: true
					});
				}
			})
			.catch(function(error) {
				sysErrorInfo(error);
			});
	}

	initGroupCodeByRole() {
		console.log("---176--user--", this.user);
		var busiGroupCodeList = [];
		busiGroupCodeList.push(
			<Select.Option key={this.user.orgGroupCode}>
				{this.user.orgGroupSname}
			</Select.Option>
		);
		this.setState({
			busiGroupCodeList: busiGroupCodeList,
			busiGroupDisa: true
		});
		// eslint-disable-next-line
		this.state.busiGroupCode= this.user.orgGroupCode;
		if (!checkEmpty(this.user.orgCompCode)) {
			this.initCompCodeByRole();
			if (!checkEmpty(this.user.orgSiteCode)) {
				this.initSiteCodeByRole();
			} else {
				this.initBusiSiteCode(this.user.orgCompCode);
			}
		} else {
			this.initBusiCompCode(this.user.orgGroupCode);
		}
	}
	//根据合同表里的资金方查存量商户集团
	initGroupCodeByStock(funderCode) {
		console.log("funderCode----", funderCode);
		var thi = this;
		var busiGroupCodeList = [];
		axios
			.post(

					localStorage.getItem("IP_PORT_BACKEND") +
					"/orgconapi/queryStockOrgList",
				{
					funderCode: funderCode
				}
			)
			.then(function(response) {
				if (response.data.STATUS === "200") {
					console.log("--208--response", response);
					for (var i = 0; i < response.data.List.length; i++) {
						if (response.data.List[i] != null) {
							busiGroupCodeList.push(
								<Select.Option
									key={response.data.List[i].busiGroupCode}
								>
									{response.data.List[i].busiGroupSname}
								</Select.Option>
							);
						}
					}
					thi.setState({
						orgStockList: response.data.List,
						busiGroupCodeList: busiGroupCodeList,
						busiGroupDisa:
							busiGroupCodeList.length === 0 ? true : false,
						busiGroupCode: busiGroupCodeList.length === 0 ? 'no contract': "请选择",
						busiCompCode: "请选择",
						busiSiteCode: "请选择",
						busiCompCodeList: [],
						busiSiteCodeList: [],
						busiCompDisa: true,
						busiSiteDisa: true
					});
				}
			})
			.catch(function(error) {
				sysErrorInfo(error);
			});
	}

	handleBusiGroupCode = value => {
		console.log("value====" + value);
		console.log("207--stockList====" + this.state.orgStockList);
		this.setState({
			busiGroupCode: value
		});
		// eslint-disable-next-line
		this.state.busiGroupCode = value;
		var uComp = this.user.orgCompCode;
		var uOrgType = this.user.orgType;
		//user是商户时，集团，公司，网点是查全量
		if (uOrgType === "BUSI") {
			if (checkEmpty(uComp)) {
				this.initBusiCompCode(value);
			} else {
				this.initCompCodeByRole();
			}
		} else if (uOrgType === "FUNDER") {
			//user是资金方时，集团，公司，网点是存量
			this.initCompCodeByStock(value);
		} else {
			this.initBusiCompCode(value);
		}
	};

	initBusiCompCode(value) {
		var thi = this;
		var busiCompCodeList = [];
		axios
			.post(

					localStorage.getItem("IP_PORT_BACKEND") +
					"/confapi/queryOrgProfileList",
				{
					orgType: "BUSI",
					orgGroupCode:
						this.state.busiGroupCode === "请选择"
							? undefined
							: value
				}
			)
			.then(function(response) {
				console.log("-----105", response);
				if (response.data.STATUS === "200") {
					for (var i = 0; i < response.data.List.length; i++) {
						if (response.data.List[i] != null) {
							busiCompCodeList.push(
								<Select.Option key={response.data.List[i].code}>
									{response.data.List[i].shortname}
								</Select.Option>
							);
						}
					}
					thi.setState({
						busiCompCodeList: busiCompCodeList,
						busiCompDisa:
							busiCompCodeList.length === 0 ? true : false,
						busiCompCode: "请选择",
						busiSiteCode: "请选择",
						busiSiteCodeList: [],
						busiSiteDisa: true
					});
				}
			})
			.catch(function(error) {
				sysErrorInfo(error);
			});
	}

	initCompCodeByRole() {
		var compCodeListbyRole = [];
		compCodeListbyRole.push(
			<Select.Option key={this.user.orgCompCode}>
				{this.user.orgCompSname}
			</Select.Option>
		);
		this.setState({
			busiCompCodeList: compCodeListbyRole,
			busiCompCode: this.user.orgCompCode,
			busiCompDisa: true
		});
	}

	initCompCodeByStock(groupCode) {
		var list = this.state.orgStockList;
		var compCodeListbyStock = [];
		var cflag = false;
		for (var key in list) {
			if (list[key].busiGroupCode === groupCode) {
				if (checkEmpty(list[key].busiCompCode)) {
					cflag = true;
					break;
				} else {
					compCodeListbyStock.push(
						<Select.Option key={list[key].busiCompCode}>
							{list[key].busiCompSname}
						</Select.Option>
					);
				}
			}
		}
		if (!cflag) {
			this.setState({
				busiCompCodeList: compCodeListbyStock,
				busiCompDisa: compCodeListbyStock.length === 0 ? true : false,
				busiCompCode: "请选择",
				busiSiteCode: "请选择",
				busiSiteCodeList: [],
				cflag: cflag
			});
		} else {
			this.setState({ cflag: cflag });
			this.initBusiCompCode(groupCode);
		}
	}

	handleBusiCompCode = value => {
		console.log("value====" + value);
		this.setState({
			busiCompCode: value
		});
		// eslint-disable-next-line
		this.state.busiCompCode = value;
		//user是商户时，集团，公司，网点是查全量
		var uOrgType = this.user.orgType;
		if (uOrgType === "BUSI") {
			if (checkEmpty(this.user.orgSiteCode)) {
				this.initBusiSiteCode(value);
			} else {
				this.initSiteCodeByRole();
			}
		} else if (uOrgType === "FUNDER") {
			//user是资金方时，集团，公司，网点是查存量
			this.initSiteCodeByStock(value);
		} else {
			this.initBusiSiteCode(value);
		}
	};

	initBusiSiteCode(value) {
		var thi = this;
		var busiSiteCodeList = [];
		axios
			.post(

					localStorage.getItem("IP_PORT_BACKEND") +
					"/confapi/queryOrgProfileList",
				{
					orgType: "BUSI",
					orgGroupCode:
						this.state.busiGroupCode === "请选择"
							? undefined
							: this.state.busiGroupCode,
					orgCompCode:
						this.state.busiCompCode === "请选择"
							? undefined
							: value
				}
			)
			.then(function(response) {
				if (response.data.STATUS === "200") {
					for (var i = 0; i < response.data.List.length; i++) {
						if (response.data.List[i] != null) {
							busiSiteCodeList.push(
								<Select.Option key={response.data.List[i].code}>
									{response.data.List[i].shortname}
								</Select.Option>
							);
						}
					}
					thi.setState({
						busiSiteCodeList: busiSiteCodeList,
						busiSiteDisa:
							busiSiteCodeList.length === 0 ? true : false,
						busiSiteCode: "请选择"
					});
				}
			})
			.catch(function(error) {
				sysErrorInfo(error);
			});
	}

	initSiteCodeByRole() {
		var siteCodeListbyRole = [];
		siteCodeListbyRole.push(
			<Select.Option key={this.user.orgSiteCode}>
				{this.user.orgSiteSname}
			</Select.Option>
		);
		this.setState({
			busiSiteCodeList: siteCodeListbyRole,
			busiSiteCode: this.user.orgSiteCode,
			busiSiteDisa: true
		});
	}

	initSiteCodeByStock(compCode) {
		var list = this.state.orgStockList;
		var siteCodeListbyStock = [];
		var sflag = false;
		console.log("---276----this.state.cflag", this.state);
		if (this.state.cflag) {
			this.initBusiSiteCode(compCode);
		} else {
			for (var key in list) {
				if (
					list[key].busiGroupCode === this.state.busiGroupCode &&
					list[key].busiCompCode === compCode
				) {
					if (checkEmpty(list[key].busiSiteCode)) {
						sflag = true;
						break;
					} else {
						siteCodeListbyStock.push(
							<Select.Option key={list[key].busiSiteCode}>
								{list[key].busiSiteSname}
							</Select.Option>
						);
					}
				}
			}
			if (!sflag) {
				this.setState({
					busiSiteCodeList: siteCodeListbyStock,
					busiSiteDisa:
						siteCodeListbyStock.length === 0 ? true : false
				});
			} else {
				this.initBusiSiteCode(compCode);
			}
		}
	}

	handleBusiSiteCode = value => {
		console.log("value====" + value);
		this.setState({
			busiSiteCode: value
		});
	};

	handleFunder = value => {
		this.setState({
			funderCode: value
		});
	};

	reset = () => {
		console.log("这个方法============");
		this.comWillMountInit();
	};

	render() {
		return (
			<span>
				<span style={{ display: this.state.funderVisible }}>
					<FormItem label={"资金方："}>
						<Select
							style={{ width: 160 }}
							onChange={this.handleFunder}
							value={this.state.funderCode}
							disabled={this.state.funderCodeDisa}
						>
							{this.state.funderCodeList}
						</Select>
					</FormItem>
				</span>
				<span style={{ display: this.state.busiVisible }}>
					<FormItem label={"商户集团："}>
						<Select
							style={{ width: 160 }}
							onChange={this.handleBusiGroupCode}
							value={this.state.busiGroupCode}
							disabled={this.state.busiGroupDisa}
						>
							{this.state.busiGroupCodeList}
						</Select>
					</FormItem>
					<FormItem label={"商户公司："}>
						<Select
							style={{ width: 160 }}
							onChange={this.handleBusiCompCode}
							value={this.state.busiCompCode}
							disabled={this.state.busiCompDisa}
						>
							{this.state.busiCompCodeList}
						</Select>
					</FormItem>
					<FormItem label={"商户网点："}>
						<Select
							style={{ width: 160 }}
							onChange={this.handleBusiSiteCode}
							value={this.state.busiSiteCode}
							disabled={this.state.busiSiteDisa}
						>
							{this.state.busiSiteCodeList}
						</Select>
					</FormItem>
				</span>
			</span>
		);
	}
}

export default (withRouter(OrgCodeConditionAuth));