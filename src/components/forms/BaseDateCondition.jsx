import React from 'react';
import { Select,Form, DatePicker } from 'antd';
import { getDateRangeDefault,onChangeRangePicker } from '../../Common';
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;

class BaseDateCondition extends React.Component {
	constructor(props){
		super(props);
		this.state={
			queryDataBase:'1'
		}
		this.onChangeRangePicker = onChangeRangePicker.bind(this)
		this.dateTypeChange = this.dateTypeChange.bind(this)
		this.reset = this.reset.bind(this)
	}

	componentWillMount(){
		console.log(getDateRangeDefault())
		this.setState({
			...getDateRangeDefault()
		})
	}
		
	dateTypeChange(value){
		this.setState({
			queryDataBase: value
		})
	}

	reset(){
		this.setState({
			queryDataBase:'1',
			...getDateRangeDefault()
		})
	}

	render() {
		const { 
			// START_DATETIME,
			// END_DATETIME,
			queryDataBase,
			START_DATETIME_VALUE,
			END_DATETIME_VALUE,
			DATETIME_FORMAT} = this.state
			console.log(this.state)
		return (
			<span>
			<Form.Item label="查询日期基准">
				<Select defaultValue="1" style={{minWidth:"130px"}}
					value={queryDataBase}
					onChange={this.dateTypeChange} name="queryDataBase">
					<Option value="1">无</Option>
					<Option value="2">成案日</Option>
					<Option value="3">收买拨付日期</Option>
					<Option value="4">交易终止日</Option>
				</Select>
			</Form.Item>
			<Form.Item label="日期范围">
				<RangePicker onChange={this.onChangeRangePicker} 
					placeholder={['开始日期', '结束日期']}
					value={
						[!START_DATETIME_VALUE 
						? (undefined)
							: moment(
								START_DATETIME_VALUE,
									DATETIME_FORMAT),
								!END_DATETIME_VALUE
						? undefined
						: moment(
							END_DATETIME_VALUE,
							DATETIME_FORMAT)
						]}
					format={DATETIME_FORMAT}
				/>
			</Form.Item>

			
			</span>
		)
	}
}

export default BaseDateCondition;