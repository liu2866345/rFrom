
let validate = {
  /**
    [isEmpty 检查是否为空]
    @params {[number | string]} val [验证的值]
    @return Booleans(true or false)
  **/
  required: function (val) {
    if (!val || val.trim().length <= 0) {
      return false
    }
    return true
  },
  /**
    [isEmail 检查邮箱是否正确]
    @params {[string]} email [邮箱地址]
    @return Booleans
  **/
  email: function (email) {
  	if(!email){
  		return true
  	}
    var reg = new RegExp(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/)
    if (reg.test(email)) {
      return true
    }
    return false
  },
  /**
   * [isEqual 两个值是否相等]
   * @param  {[number],[string]}  val1,val2[验证的值]
   * @return {Boolean}
   */
  isEqual: function (val1, val2) {
    return val1 === val2
  },
  /**
   * [isPhone 验证手机号]
   * @param  {[string]}  phone [手机号]
   * @return {Boolean}
   */
  cellphone: function (phone) {
  	if(!phone){
  		return true
  	}
    var reg = new RegExp(/^1\d{10}$/)
    return reg.test(phone)
  },
  tellphone: function(phone) {
  	if(!phone){
  		return true
  	}
  	var reg = new RegExp(/^(0\d{2,3}-\d{7,8})$/)
  	return reg.test(phone)
  },
  /**
   * [isNum 是否是数字]
   * @param  {[number]}  val [验证的值]
   * @return {Boolean}
   */
  number: function (val) {
  	if(!val){
  		return true
  	}
    var reg = new RegExp(/^[0-9]*.$/)
    return reg.test(val)
  },
  /**
   * [isNum 是否是货币]
   * @param  {[number]}  val [验证的值]
   * @return {Boolean}
   */
  money: function(val){
  	if(!val){
  		return true
  	}
  	var reg = new RegExp(/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/)
  	return reg.test(val)
  },
  /**
   * [isNum 密码]
   * @param  {[string]}  pwd [验证的值:数字和字母,6-16位]
   * @return {Boolean}
   */
  password: function (pwd) {
  	if(!pwd){
  		return true
  	}
    var reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/)
    return reg.test(pwd)
  },
  /**
   * [isName 姓名]
   * @param  {[string]}  name [验证的值:数字和字母,6-20位]
   * @return {Boolean}
   */
  name: function (name) {
  	if(!name){
  		return true
  	}
    var reg = new RegExp(/[\s\S]{2,}$/)
    return reg.test(name)
  }
}
export default validate