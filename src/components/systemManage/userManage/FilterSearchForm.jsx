import React from "react";
import { Input, Select, Form, Button } from "antd";
import { selectUtils } from "../../../SelectUtils.jsx";

const FormItem = Form.Item;

class FilterSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}



	handleSearch = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {

			
			const params = {
				...values,
			};
			const { subQuery } = this.props;
			subQuery(params);
		});
	};

	handleReset = () => {
		this.props.form.resetFields();
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="gutter-example">
				<Form layout="inline" className="ant-advanced-search-form">
					<Form.Item label="用户名">
						{getFieldDecorator(`userName`)(
							<Input placeholder="请输入" name="userName" />
						)}
					</Form.Item>
					<FormItem label={"用户中文名"}>
						{getFieldDecorator(`nickName`)(
							<Input placeholder="请输入" name="nickName" />
						)}
					</FormItem>
					<FormItem label={"邮箱"}>
						{getFieldDecorator(`email`)(
							<Input
								placeholder="请输入"
								name="email"
								style={{ width: "260px" }}
							/>
						)}
					</FormItem>
					<FormItem label={"电话"}>
						{getFieldDecorator(`phone`)(
							<Input placeholder="请输入" name="phone" />
						)}
					</FormItem>
					<FormItem label={"状态"}>
						{getFieldDecorator(`status`)(
							<Select style={{ width: 120 }} name="status">
								{selectUtils("ruleStatus")}
							</Select>
						)}
					</FormItem>

					<FormItem>
						<Button type="primary" onClick={this.handleSearch}>
							查询
						</Button>
						<Button onClick={this.handleReset}>重置</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}

const FilterSearchForm = Form.create({ name: "filter_search" })(FilterSearch);

export default FilterSearchForm;
