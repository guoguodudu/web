import React from 'react';
import { Form,DatePicker } from 'antd';
import '../../style/table.less';
import moment from 'moment';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class DateTimeCondition extends React.Component {

    state = {
    };
    
    componentWillMount() {
        console.log("---BusiCodeCondition.componentWillMount-----");
    }

    componentDidMount(){
        console.log("-------------BusiCodeCondition.componentDidMount----------------");
        this.props.onRef(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            enableDate: undefined,
            expireDate: undefined,
        });
    }

    handleEnableDate = (value, dateString) => {
        this.setState({ enableDate: value ,enableDateStr: dateString});
    }

    handleExpireDate = (value, dateString) => {
        this.setState({ expireDate: value ,expireDateStr: dateString});
    }
    reset = ()=>{
        this.setState({
            enableDate: undefined,
            expireDate: undefined,
        });
    }

    render() {
        console.log("render----list",this.state.List);
        return (
            <span>
                <FormItem label={'生效日期：'}>
                    <DatePicker style={{width:'210px'}} onChange={this.handleEnableDate} value={this.state.enableDate == null ? undefined : moment(this.state.enableDate, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" />
                </FormItem>
                
                <FormItem label={'失效日期：'}>
                    <DatePicker style={{width:'210px'}} onChange={this.handleExpireDate} value={this.state.expireDate == null ? undefined : moment(this.state.expireDate, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" />
                </FormItem>
                
            </span>            
                    
        );
    }
}

export default DateTimeCondition;