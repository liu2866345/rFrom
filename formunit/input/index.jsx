import React, { Component } from 'react'
/**
 * 文本输入组件
 * @author simon
 * @datte 2019-01-01
 */
class Input extends Component {
  constructor(props, context) {
    super(props, context)
  }
  
  changeHandler = ( element ) => {
  	if (this.props.action) {
  		let resultObj = {}
  		let name = element.target.name
  		let val = element.target.value
  		resultObj['eventType'] = 'change'
  		resultObj['keyName'] = name
  		resultObj['value'] = val
  		this.props.action ( resultObj )
  	}
  }

  render() {
  	let injectData = this.props.injectData || {}
    return (
    	<div className={"input-row "+injectData.required}>
    		<label  className="input-row-label">{ injectData.label }</label>
    		{
    			injectData.readOnly?(
    				<span className="read-only">{injectData.value }</span>
    			):(
    				<input  className="input-row-input"
		    		  name        = { injectData.name }
		    		  value       = { injectData.value } 
		    		  placeholder = { injectData.placeholder } 
		    		  onChange    = { this.changeHandler }
		    		  maxLength   = { injectData.maxLength }
		    		/>
    			)
    		}
    		{
    			injectData.unit?(
    				<span className="unit">{injectData.unit}</span>
    			):(null)
    		}
    	</div>
    )
  }
}

export default Input
