import React, { Component } from 'react'
import LCalendar from './LCalendar.js'
// 280846835
class DateComponet extends Component {
  componentWillMount() {
    let randomFix = `DateElement${Math.random()}`.replace('0.', '')
    this.setState({
      id: randomFix
    })
  }

  componentDidMount() {
  	if (!this.props.readOnly) {   
      this.SUIInit()
    }
  }

  componentDidUpdate() {
    //  this.SUIInit();
  }
  SUIInit() {
    var calendar = LCalendar()
    calendar = new calendar()
    const dateElementId = this.state.id

    calendar.init({
      trigger: '#' + dateElementId,
      type: 'date',
      onSuccess: (value, e) => {
        this.handleChange(value)
      }
    })
  }

  defocus() {
    document.activeElement.blur()
  }
	inputChange(e){}
  handleChange(e) {
    if (this.props.readOnly) {   
      return false
    }
    if (this.props.action) {
  		let resultObj = {}
  		resultObj['eventType'] = 'click'
  		resultObj['keyName'] = this.props.name
  		resultObj['value'] = e.choiceValue
  		this.props.action ( resultObj )
  	}
  }

  render() {
    const { placeholder, dataExtent, readOnly } = this.props
    let value = this.props.value || ''
//  if(!value){
//  	var s = new Date()
//  	value = s.getFullYear()+'-'+((s.getMonth()+1)>=10?(s.getMonth()+1):('0'+(s.getMonth()+1)))+'-'+(s.getDate()>=10?(s.getDate()):('0'+(s.getDate())))
//  }
    const id = this.state.id

    return (
      <div className="date">
	      {
	      	readOnly?(<span className="date-input read-only">{value||'请选择'}</span>):(
	      		<input
	      		  className="date-input"
		          type="text"
		          placeholder={placeholder||'请选择'}
		          id={id}
		          value={value}
		          data-lcalendar={dataExtent}
		          onClick={() => this.defocus()}
		          onChange={this.inputChange}
		        />
	      	)
	      }
        <div className="common-right-icon" />
      </div>
    )
  }
}

export default DateComponet
