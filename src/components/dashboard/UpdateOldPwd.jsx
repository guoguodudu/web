/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Form, Icon, Input, Button,message } from 'antd';
import axios from 'axios';
import {sysErrorInfo,errorInfo,ContentErrorInfo,checkPwd } from '../../Common.jsx';

const FormItem = Form.Item;

class UpdateOldPwd extends React.Component {
    constructor(props){
		super(props);
		this.state = {
		}
	}
    
	componentDidMount(){
		
	}

	componentWillReceiveProps(nextProps) {
	}
    handleSubmit = (e) => {
		e.preventDefault();
		const userName = localStorage.getItem('userName');
		if(!userName){
			const { history } = this.props ;
			
			history.push('/login')
			return false
		}else{}
		const thi = this;
		this.props.form.validateFields((err, values) => {
			if (!err) {

				if(values.password===values.oldPassword){
					ContentErrorInfo("原密码和新密码一致，请更改新密码");
					return;
				}
				//密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
				if(checkPwd(values.password)){
					return;
				}
				if(values.password===values.confirmPwd){
					
					axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/userapi/updateOldPwd',{
						"userName": userName,
						"oldPassword":values.oldPassword,
						"password": values.password
					}).then(
						function (response) {
							if(response.data.STATUS === 200){
								message.success('修改成功，请重新登录', 1.5);
								const { history } = thi.props 
								history.push('/login')
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
		  
        
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
                <div className="gutter-example" >
                    <br /><br />
                    <center style={{ fontSize: 16 }}><b>修改密码</b></center>
                    <br />
					<center>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
						<FormItem>
                            {getFieldDecorator('oldPassword', {
                                rules: [{ required: true, message: '请输入原密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="原密码" />
                            )}
                        </FormItem>
						<FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入新密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="新密码" />
                            )}
                        </FormItem>
						<FormItem>
                            {getFieldDecorator('confirmPwd', {
                                rules: [{ required: true, message: '请确认新密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="确认新密码" />
                            )}
                        </FormItem>

                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
								提交
                            </Button>
							
                        </FormItem>
                    </Form>
					</center>
                </div>
        );
    }
}

export default Form.create()(UpdateOldPwd);