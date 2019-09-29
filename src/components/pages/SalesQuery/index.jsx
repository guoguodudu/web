/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from "react";
import {
	Divider,
	Col,
	List,
	Typography,
	Form,
	Row,
	Input,
	Button,
	message
} from "antd";
import { removeNullValue, sysErrorInfo, errorInfo } from "../../../Common.jsx";
import { connectAlita } from "redux-alita";
import "./index.sass";
import { IP_PORT_BACKEND } from "../../../api/path";
import { K_N_MAP, HIDE_FIELD } from "./CONF";
import { salesQueryApi } from "../../../api";

const { Title } = Typography;
function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class SalesQuery extends React.Component {
	constructor(props) {
		super(props);
		this.state = { canAjax: true };
		this.renewImg = this.renewImg.bind(this);
		this.query = this.query.bind(this);
	}
	componentWillMount() {}

	componentDidMount() {
		this.renewImg();
		this.setState({
			imgUrl: IP_PORT_BACKEND + "/captcha/chinese"
		});
		// const { form } = this.props;
		// const { setFieldsValue } = form;
		// setFieldsValue({ caseSn: "" });		
	}

	componentWillReceiveProps(nextProps) {}

	renewImg() {
		this.setState({
			imageHash: Date.now()
		});
		const { form } = this.props;
		const { resetFields } = form;
		resetFields(["captcha"]);
	}
	handleSubmit = e => {
		e.preventDefault();
		const { canAjax } = this.state;
		if (canAjax) {
			this.setState({
				canAjax: false
			});
			setTimeout(() => {
				this.setState({
					canAjax: true
				});
			}, 2000);
		} else {
			message.info("请休息一下");
			return false;
		}

		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.query(removeNullValue(values));
			}
		});
	};

	handleReset = () => {
		this.props.form.resetFields();
	};

	query(vals) {
		const hideLoading = message.loading("正在查询，请稍候...", 0);
		salesQueryApi(vals)
			.then(response => {
				const { status, content, data } = response.data;
				if (status === "200") {
					message.success("查询成功");
					this.setState({
						data,
						dataArr: Object.keys(data)
							.map(k => {
								if (HIDE_FIELD.includes(k)) {
									return undefined;
								}
								// 后端处理脱敏了
								// if (HIDE_NAME.includes(k)){
								// 	return { name: k, text: data[k].slice(0,1)+ '**' + (data[k].length>2?data[k].slice(-1):'')};
								// }
								return { name: k, text: data[k] };
							})
							.filter(i => i)
					});
				}
				if (status === "201") {
					errorInfo(content);
				}
			})
			.catch(function(error) {
				sysErrorInfo(error);
			})
			.finally(() => {
				this.renewImg();
				hideLoading();
			});
	}
	render() {
		const { getFieldDecorator, getFieldsError } = this.props.form;

		const { data, imgUrl, imageHash, dataArr } = this.state;
		const formItemLayout = {
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16, offset: 4 },
				md: { span: 8, offset: 8 },
				lg: { span: 8, offset: 8 }
			}
		};
		return (
			<div className="sales-query">
				<Form
					{...formItemLayout}
					className="form"
					onSubmit={this.handleSubmit}
				>
					<Form.Item>
						{getFieldDecorator("caseSn", {
							rules: [
								{
									required: true,
									message: "请输入案件号"
								}
							]
						})(<Input placeholder="请输入案件号" allowClear />)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator("captcha", {
							rules: [
								{
									required: true,
									message: "输入验证结果"
								}
							]
						})(<Input placeholder="输入验证结果" allowClear />)}
					</Form.Item>
					<img
						src={`${imgUrl}?${imageHash}`}
						alt="验证码"
						className="img-c"
						onClick={this.renewImg}
					/>
					<Row type="flex" justify="center">
						<Button className="btn" onClick={this.handleReset}>
							重置
						</Button>
						<Button
							className="btn"
							type="primary"
							htmlType="submit"
							disabled={hasErrors(getFieldsError())}
						>
							查询
						</Button>
					</Row>
				</Form>

				{false && (
					<div className="main">
						<div className="mobile">
							<List
								header={<div>查询结果</div>}
								bordered
								className="list"
								dataSource={dataArr}
								renderItem={item => (
									<List.Item key={item.name}>
										<Typography.Text className="b">
											{K_N_MAP[item.name]}：
										</Typography.Text>{" "}
										<Typography.Text>
											{item.text}
										</Typography.Text>
									</List.Item>
								)}
							/>
						</div>
						<div className="pc">
							<Row>
								{dataArr &&
									dataArr.map(d => {
										return (
											<Col
												key={d.name}
												className="i"
												span={6}
												xs={12}
												sm={8}
												md={6}
												xl={4}
											>
												<Typography.Text className="b">
													{K_N_MAP[d.name]}：
												</Typography.Text>{" "}
												<Typography.Text>
													{d.text}
												</Typography.Text>
											</Col>
										);
									})}
							</Row>
						</div>
					</div>
				)}
				{true && data && (
					<div className="main">
						<div className="mobile">
							<List
								header={<div>查询结果</div>}
								bordered
								className="list"
							>
								<List.Item key="section-1">
									<div className="t4">---- 案件信息 ----</div>
								</List.Item>
								<List.Item key="efh_sn">
									<Typography.Text className="b">
										{K_N_MAP["efh_sn"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["efh_sn"]}
									</Typography.Text>
								</List.Item>
								<List.Item key="ca_orderid">
									<Typography.Text className="b">
										{K_N_MAP["ca_orderid"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["ca_orderid"]}
									</Typography.Text>
								</List.Item>
								<List.Item key="apply_dt">
									<Typography.Text className="b">
										{K_N_MAP["apply_dt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["apply_dt"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="insTotAmt">
									<Typography.Text className="b">
										{K_N_MAP["insTotAmt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["insTotAmt"]}
									</Typography.Text>
								</List.Item>
								<List.Item key="ins_noi">
									<Typography.Text className="b">
										{K_N_MAP["ins_noi"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["ins_noi"]}
									</Typography.Text>
								</List.Item>
								<List.Item key="termamt">
									<Typography.Text className="b">
										{K_N_MAP["termamt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["termamt"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="cust_name">
									<Typography.Text className="b">
										{K_N_MAP["cust_name"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["cust_name"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="retc_dt">
									<Typography.Text className="b">
										{K_N_MAP["retc_dt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["retc_dt"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="salesid">
									<Typography.Text className="b">
										{K_N_MAP["salesid"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["salesid"]}
									</Typography.Text>
								</List.Item>
								<List.Item key="section-2">
									<div className="t4">
										---- 付款人信息 ----
									</div>
								</List.Item>

								<List.Item key="usr_name">
									<Typography.Text className="b">
										{K_N_MAP["usr_name"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["usr_name"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="deductMobile">
									<Typography.Text className="b">
										{K_N_MAP["deductMobile"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["deductMobile"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="ob_name">
									<Typography.Text className="b">
										{K_N_MAP["ob_name"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["ob_name"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="ca_cardno">
									<Typography.Text className="b">
										{K_N_MAP["ca_cardno"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["ca_cardno"]}
									</Typography.Text>
								</List.Item>
								<List.Item key="section-3">
									<div className="t4">---- 缴款信息 ----</div>
								</List.Item>

								<List.Item key="stat_msg">
									<Typography.Text className="b">
										{K_N_MAP["stat_msg"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["stat_msg"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="pdo_day">
									<Typography.Text className="b">
										{K_N_MAP["pdo_day"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["pdo_day"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="pdo_cnt">
									<Typography.Text className="b">
										{K_N_MAP["pdo_cnt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["pdo_cnt"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="over_amt">
									<Typography.Text className="b">
										{K_N_MAP["over_amt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["over_amt"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="pdh_cnt">
									<Typography.Text className="b">
										{K_N_MAP["pdh_cnt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["pdh_cnt"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="pdh_amt">
									<Typography.Text className="b">
										{K_N_MAP["pdh_amt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["pdh_amt"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="pdo_amt">
									<Typography.Text className="b">
										{K_N_MAP["pdo_amt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["pdo_amt"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="deductDate">
									<Typography.Text className="b">
										{K_N_MAP["deductDate"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["deductDate"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="deductResponseMsg">
									<Typography.Text className="b">
										{K_N_MAP["deductResponseMsg"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["deductResponseMsg"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="due_dt">
									<Typography.Text className="b">
										{K_N_MAP["due_dt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["due_dt"]}
									</Typography.Text>
								</List.Item>

								<List.Item key="last_due_dt">
									<Typography.Text className="b">
										{K_N_MAP["last_due_dt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["last_due_dt"]}
									</Typography.Text>
								</List.Item>
							</List>
						</div>
						<div className="pc">
							<Row>
								<Title level={4}>---- 案件信息 ----</Title>
								<Col
									key="efh_sn"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["efh_sn"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["efh_sn"]}
									</Typography.Text>
								</Col>

								<Col
									key="ca_orderid"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["ca_orderid"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["ca_orderid"]}
									</Typography.Text>
								</Col>
								<Col
									key="apply_dt"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["apply_dt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["apply_dt"]}
									</Typography.Text>
								</Col>
								<Col
									key="insTotAmt"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["insTotAmt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["insTotAmt"]}
									</Typography.Text>
								</Col>
								<Col
									key="ins_noi"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["ins_noi"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["ins_noi"]}
									</Typography.Text>
								</Col>
								<Col
									key="termamt"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["termamt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["termamt"]}
									</Typography.Text>
								</Col>

								<Col
									key="cust_name"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["cust_name"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["cust_name"]}
									</Typography.Text>
								</Col>

								<Col
									key="retc_dt"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["retc_dt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["retc_dt"]}
									</Typography.Text>
								</Col>

								<Col
									key="salesid"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["salesid"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["salesid"]}
									</Typography.Text>
								</Col>
							</Row>
							<Divider />
							<Row>
								<Title level={4}>---- 付款人信息 ----</Title>
								<Col
									key="usr_name"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["usr_name"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["usr_name"]}
									</Typography.Text>
								</Col>
								<Col
									key="deductMobile"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["deductMobile"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["deductMobile"]}
									</Typography.Text>
								</Col>
								<Col
									key="ob_name"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["ob_name"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["ob_name"]}
									</Typography.Text>
								</Col>
								<Col
									key="ca_cardno"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["ca_cardno"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["ca_cardno"]}
									</Typography.Text>
								</Col>
							</Row>
							<Divider />
							<Row>
								<Title level={4}>---- 缴款信息 ----</Title>
								<Col
									key="stat_msg"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["stat_msg"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["stat_msg"]}
									</Typography.Text>
								</Col>

								<Col
									key="pdo_day"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["pdo_day"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["pdo_day"]}
									</Typography.Text>
								</Col>
								<Col
									key="pdo_cnt"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["pdo_cnt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["pdo_cnt"]}
									</Typography.Text>
								</Col>
								<Col
									key="over_amt"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["over_amt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["over_amt"]}
									</Typography.Text>
								</Col>
								<Col
									key="pdh_cnt"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["pdh_cnt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["pdh_cnt"]}
									</Typography.Text>
								</Col>
								<Col
									key="pdh_amt"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["pdh_amt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["pdh_amt"]}
									</Typography.Text>
								</Col>
								<Col
									key="pdo_amt"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["pdo_amt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["pdo_amt"]}
									</Typography.Text>
								</Col>
								
								<Col
									key="deductDate"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["deductDate"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["deductDate"]}
									</Typography.Text>
								</Col>
								<Col
									key="deductResponseMsg"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["deductResponseMsg"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["deductResponseMsg"]}
									</Typography.Text>
								</Col>

								<Col
									key="due_dt"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["due_dt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["due_dt"]}
									</Typography.Text>
								</Col>

								<Col
									key="last_due_dt"
									className="i"
									span={6}
									xs={12}
									sm={8}
									md={6}
									xl={4}
								>
									<Typography.Text className="b">
										{K_N_MAP["last_due_dt"]}：
									</Typography.Text>{" "}
									<Typography.Text>
										{data["last_due_dt"]}
									</Typography.Text>
								</Col>
							</Row>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default connectAlita(["auth"])(
	Form.create({ name: "salesquery" })(SalesQuery)
);
