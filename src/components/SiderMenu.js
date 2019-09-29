import React from "react";
import { Menu, Icon } from "antd";
import { Link, Redirect } from "react-router-dom";
import { selectGroupList } from "../SelectUtils.jsx";

const renderMenuItem = (
	item // item.route 菜单单独跳转的路由
) => (
	<Menu.Item key={item.pageCode}>
		<Link to={item.pageCode}>
			{<Icon type="star-o" />}
			<span className="nav-text">{item.pageName}</span>
		</Link>
	</Menu.Item>
);

const renderSubMenu = (key, items) => (
	<Menu.SubMenu
		key={key}
		title={
			<span>
				{<Icon type="menu-fold" />}
				<span className="nav-text">{selectGroupList(key)}</span>
			</span>
		}
	>
		{items.map(item =>
			item.buttCode === null ? renderMenuItem(item) : ""
		)}
	</Menu.SubMenu>
);

export default ({ menus, ...props }) => {
	
	if (menus) {
		return (
			<Menu {...props}>
				 <Menu.Item key="/app/dashboard/index">
					<Link to={"/app/dashboard/index"}>
						<Icon type="home" />
						<span className="nav-text">
							<font size="3" color="white">
								首页
							</font>
						</span>
					</Link>
				 </Menu.Item> 
				{Object.keys(menus).map(key => renderSubMenu(key, menus[key]))}
			</Menu>
		);
	} else {
		return (
			<Redirect
				to={{
					pathname: "/login",
					state: { from: props.location }
				}}
			/>
		);
	}
}
