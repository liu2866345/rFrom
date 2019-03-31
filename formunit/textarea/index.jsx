import React, { Component } from 'react'
/**
 * 文本域输入组件
 * @author simon
 * @datte 2019-01-01
 */
class Textarea extends Component {
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
    	<div className={"textarea-row "+injectData.required}>
    		{
    			injectData.label?(
    				<div className="textarea-title">{ injectData.label }</div>
    			):(null)
    		}
    		<div className="textarea-row-content" style={{height:injectData.height}}>
    			{
    				injectData.readOnly?(<div className="only-text">{injectData.value}</div>):(
    					<textarea name={injectData.name} onChange = { this.changeHandler } className="textarea" height={injectData.height}  value={injectData.value} placeholder={ injectData.placeholder }></textarea>
    				)
    			}
    		</div>
    		
    	</div>
    )
  }
}

export default Textarea
