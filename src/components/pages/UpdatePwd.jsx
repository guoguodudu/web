/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Form, Icon, Input, Button,message } from 'antd';
import {sysErrorInfo,errorInfo,checkPwd } from '../../Common.jsx';
import { connectAlita } from 'redux-alita';
import { updatePwd } from '../../api/';

const FormItem = Form.Item;

class UpdatePwd extends React.Component {
    
    handleSubmit = (e) => {
		const thi = this
		e.preventDefault();
		const query = this.props.location.search;
		console.log("query",query);
		if(query){
			const userName = query.substr(6,query.length);
			this.props.form.validateFields((err, values) => {
				if (!err) {
					//密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
					if(checkPwd(values.password)){
						return;
					}
					console.log('Received values of form: ', values);
					if(values.password===values.confirmPwd){
						updatePwd({
							"userName": userName,
							"password": values.password
						}).then(
							function (response) {
								console.log('200--',response)
								if(response.data.STATUS === 200){
									message.success('修改成功', 1.5)
									const { history } = thi.props 
									history.push('/login')
									
									// window.location.href=localStorage.getItem('ip_port_frontend')+'/';
								}else{
									errorInfo(response.data.CONTENT);
								}
	
						}).catch(function (error) {
							sysErrorInfo(error);
						});
					} else {
						errorInfo("两次密码输入不一致");
					}
					
				}
			});
		  }
        
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>富金服科技股份有限公司</span>
                    </div>
                    <center style={{ fontSize: 16 }}><b>消金系统</b></center>
                    <br />
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
						<FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
						<FormItem>
                            {getFieldDecorator('confirmPwd', {
                                rules: [{ required: true, message: '请确认密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="确认密码" />
                            )}
                        </FormItem>

                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                修改密码
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connectAlita(['auth'])(Form.create()(UpdatePwd));