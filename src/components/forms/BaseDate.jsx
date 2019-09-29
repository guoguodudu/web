import React from 'react';
import { Form, DatePicker } from 'antd';
import { getDateRangeDefault,onChangeRangePicker } from '../../Common';
import moment from 'moment';
const { RangePicker } = DatePicker;

class BaseDate extends React.Component {
	constructor(props){
		super(props);
		this.state={
		}
		this.onChangeRangePicker = onChangeRangePicker.bind(this)
		this.reset = this.reset.bind(this)
	}

	componentWillMount(){
		const {type} = this.props
		// console.log(getDateRangeDefault())
		this.setState({
			...getDateRangeDefault(type)
		})
	}

	reset(){
		const {type} = this.props

		this.setState({
			...getDateRangeDefault(type)
		})
	}

	render() {
		const { 
			// START_DATETIME,
			// END_DATETIME,
			START_DATETIME_VALUE,
			END_DATETIME_VALUE,
			DATETIME_FORMAT} = this.state
			// console.log(this.state)
		const {labelname,type} = this.props
		return (
			<span>

			<Form.Item label={labelname||'日期范围'}>
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
					showTime={type&&type!=='YMD'}
				/>
			</Form.Item>

			
			</span>
		)
	}
}

export default BaseDate;
