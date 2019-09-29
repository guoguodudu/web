import React from "react";
import { Card } from "antd";
import UserListTable from "./UserListTable";
import axios from "axios";
import FilterSearchForm from "./FilterSearchForm";
import {handleQueryListOk,messageError,removeNullValue } from "../../../Common";

class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			List: []
		};
		this.subQuery = this.subQuery.bind(this);
	}

	componentWillMount() {
		this.queryUserList();
	}

	subQuery(params) {
		const vParams = removeNullValue(params);
		this.queryUserList(vParams);
	}
	queryUserList(vParams = {}) {
		var thi = this;
		this.setState({ loading: true });
		axios
			.post(
				localStorage.getItem("IP_PORT_BACKEND") + "/userapi/query",
				vParams
			)
			.then(function(response) {
				if (response.data.STATUS === "200") {
					const {data:{List}} = response
					thi.setState({
						List
					});
					handleQueryListOk(List)
				} else {
					messageError()
				}
			})
			.catch(function(error) {
				messageError()
			})
			.finally(() => {
				this.setState({ loading: false });
			});
	}
	render() {
		console.log("render----list", this.state.List);
		const { loading } = this.state;
		return (
			<div className="gutter-example">
				<Card title="用户列表" bordered={false}>
					<FilterSearchForm subQuery={this.subQuery} />
					<UserListTable
						List={this.state.List}
						parent={this}
						loading={loading}
					/>
				</Card>
			</div>
		);
	}
}

export default UserList;
