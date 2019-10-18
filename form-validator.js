"use strict"

export default class Form_validator {

    /**
     * The main validation method.
     * 
     * @param {HTMLInputElement } input an input field.
     * @param {Array} types an array contains the validation types.
     * @param {Object} option_rules an optional param contains the validation rules.
     * @param {Boolean} required an optional param.
     * 
     * @return {Object} contains the result of the validation of each rule, true if validate & false if not.
     **/
    validate = (input, types, option_rules = {
        min_lenght: 0,
        max_length: 256,
        password: {
            "lowercase": true,
            "uppercase": true,
            "numeric": true,
            "symboles": true
        },
        "date": {
            "format": "yyyy-mm-dd",
            "after": true,
            "before": true
        },
        "compare_with": undefined
    }, required = false) => {

        // Default rules options
        let default_rules = {
            min_lenght: 0,
            max_length: 256,
            password: {
                "lowercase": true,
                "uppercase": true,
                "numeric": true,
                "symboles": true
            },
            "date": {
                "format": "yyyy-mm-dd",
                "after": true,
                "before": true
            },
            "compare_with": undefined
        }

        // Overriding the default rules
        let rules = {}
        rules.password = this.extend_options(default_rules.password, option_rules.password)
        rules.date = this.extend_options(default_rules.date, option_rules.date)
        rules = this.extend_options(default_rules, rules)
        
        // Init vars
        let response = {
                valid: true,
                validated: {}
            },
            value = input.value,
            valid_date = true,
            valid_password = true

        // validating the length
        let valid_length = this.validate_length(value, rules.min_lenght, rules.max_length)
        if (!valid_length) {
            response.validated["length"] = {
                min_lenght: value.length >= rules.min_lenght,
                max_length: value.length <= rules.max_length
            }

            response.valid = response.valid && valid_length
        }

        // validating the matches
        if (rules.compare_with) {
            response.validated["compare_with"] = this.validate_compare(value, rules.compare_with)
            response.valid = response.valid && response.validated["compare_with"]
        }

        // valitating the required inputs
        if (required) {
            response.validated["required"] = value.length > 0
            response.valid = response.valid && response.validated["required"]
        }

        // validating the input's value based on it's type
        types.forEach(type => {

            switch (type) {

                case "email": {
                    if (this.validate_email(value)) {
                        response.validated["email"] = true
                    } else {
                        response.validated["email"] = false
                    }
                    break
                }

                case "alpha": {
                    valid_length
                    if (this.validate_alpha(value)) {
                        response.validated["alpha"] = true
                    } else {
                        response.validated["alpha"] = false
                    }
                    break
                }

                case "alpha_dash": {
                    if (this.validate_alpha_dash(value)) {
                        response.validated["alpha_dash"] = true
                    } else {
                        response.validated["alpha_dash"] = false
                    }
                    break
                }

                case "alpha_numeric": {
                    if (this.validate_alpha_numeric(value)) {
                        response.validated["alpha_numeric"] = true
                    } else {
                        response.validated["alpha_numeric"] = false
                    }
                    break
                }

                case "alpha_numeric_dash": {
                    if (this.validate_alpha_numeric_dash(value)) {
                        response.validated["alpha_numeric_dash"] = true
                    } else {
                        response.validated["alpha_numeric_dash"] = false
                    }
                    break
                }

                case "integer": {
                    if (this.validate_integer(value)) {
                        response.validated["integer"] = true
                    } else {
                        response.validated["integer"] = false
                    }
                    break
                }

                case "decimal": {
                    if (this.validate_decimal(value)) {
                        response.validated["decimal"] = true
                    } else {
                        response.validated["decimal"] = false
                    }
                    break
                }

                case "url": {
                    if (this.validate_url(value)) {
                        response.validated["url"] = true
                    } else {
                        response.validated["url"] = false
                    }
                    break
                }

                case "credit_card": {
                    if (this.validate_credit_card(value)) {
                        response.validated["credit_card"] = true
                    } else {
                        response.validated["credit_card"] = false
                    }
                    break
                }

                case "date": {
                    let res = this.validate_date(value, rules.date)
                    valid_date = ((res.format || res.format == undefined) && (res.after || res.after == undefined) && (res.before || res.before == undefined))
                    response.validated["date"] = res
                    break
                }

                case "password": {
                    let res = this.validate_password(value, rules.password)
                    valid_password = ((res.contains_lowercase || res.contains_lowercase == undefined) && (res.contains_uppercase || res.contains_uppercase == undefined) && (res.contains_numeric || res.contains_numeric == undefined) && (res.contains_symbols || res.contains_symbols == undefined) )
                    response.validated["password"] = res
                    break
                }
            }

        })

        // Getting the final result for the full validations
        response.valid = (response.validated["email"] || response.validated["email"] == undefined) && (response.validated["alpha"] || response.validated["alpha"] == undefined) && (response.validated["alpha_dash"] || response.validated["alpha_dash"] == undefined) && (response.validated["alpha_numeric"] || response.validated["alpha_numeric"] == undefined) && (response.validated["alpha_numeric_dash"] || response.validated["alpha_numeric_dash"] == undefined) && (response.validated["integer"] || response.validated["integer"] == undefined) && (response.validated["decimal"] || response.validated["decimal"] == undefined) && (response.validated["url"] || response.validated["url"] == undefined) && (valid_date || response.validated["date"] == undefined) && (response.validated["credit_card"] || response.validated["credit_card"] == undefined) && (valid_password || response.validated["password"] == undefined)
        return response
    }

    /**
     * The email validation method.
     * 
     * @param {String} _email the email string.
     * 
     * @return {Boolean} ture if valid false if not.
     **/
    validate_email = (_email) => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(_email).toLowerCase())
    }

    /**
     * The alpha validation method.
     * 
     * @param {String} _alpha the input value.
     * 
     * @return {Boolean} true if the _alpha is valid false if not.
     * */
    validate_alpha = (_alpha) => {
        return /^[a-z]+$/i.test(String(_alpha))
    }

    /**
     * The alpha_dash validation method.
     * 
     * @param {String} _alpha_dash the input value.
     * 
     * @return {Boolean} true if the _alpha_dash is valid false if not.
     * */
    validate_alpha_dash = (_alpha_dash) => {
        return /^[a-z]+$/i.test(String(_alpha_dash))
    }

    /**
     * The alpha_numeric validation method.
     * 
     * @param {String} _alpha_numeric the input value.
     * 
     * @return {Boolean} true if the _alpha_numeric is valid false if not.
     * */
    validate_alpha_numeric = (_alpha_numeric) => {
        return /^[a-z0-9]+$/i.test(String(_alpha_numeric))
    }

    /**
     * The alpha_numeric_dash validation method.
     * 
     * @param {String} _alpha_numeric_dash the input value.
     * 
     * @return {Boolean} true if the _alpha_numeric_dash is valid false if not.
     * */
    validate_alpha_numeric_dash = (_alpha_numeric_dash) => {
        return /^[a-z0-9_\-]+$/i.test(String(_alpha_numeric_dash))
    }

    /**
     * The integer validation method.
     * 
     * @param {String} _integer the input value.
     * 
     * @return {Boolean} true if the _integer is valid false if not.
     * */
    validate_integer = (_integer) => {
        return /^\-?[0-9]+$/.test(String(_integer))
    }

    /**
     * The decimal validation method.
     * 
     * @param {String} _decimal the input value.
     * 
     * @return {Boolean} true if the _decimal is valid false if not.
     * */
    validate_decimal = (_decimal) => {
        return /^[0-9](\.[0-9]+)?$/.test(String(_decimal))
    }

    /**
     * The url validation method.
     * 
     * @param {String} _url the input value.
     * 
     * @return {Boolean} true if the _url is valid false if not.
     * */
    validate_url = (_url) => {
        return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(String(_url))
    }

    /**
     * The date validation method.
     * 
     * @param {String} _date the password.
     * @param {Object} _date_rules the validation rules.
     * 
     * @return {Object} contains the result of the validation of each rule, true if validate & false if not.
     * */
    validate_date = (_date, _date_rules) => {
        let valid_after = true,
            valid_before = true,
            valid_format = true,
            response = {}

        if(_date_rules.format){
            if (_date_rules.format === "yyyy-mm-dd")
                valid_format = /\d{4}-\d{2}-\d{2}/.test(_date)
            else
                valid_format = /\d{2}-\d{2}-\d{2}/.test(_date)
            
                response["format"] = valid_format
        }

        if(_date_rules.after){
            valid_after = new Date(_date) > new Date(_date_rules.after)
            response["after"] = valid_after
        }

        if(_date_rules.before){
            valid_before = new Date(_date) < new Date(_date_rules.before)
            response["before"] = valid_before
        }
    
        return response
    }

    /**
     * The credit card validation method.
     * Suported cards: Visa, MasterCard, American Express, Diners Club, Discover, and JCB cards
     * 
     * @param {String} _url the input value.
     * 
     * @return {Boolean} true if the _url is valid false if not.
     * */
    validate_credit_card = (_credit_card) => {
        return /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(String(_credit_card))
    }

    /**
     * The password validation method.
     * 
     * @param {String} _password the password.
     * @param {Object} _password_rules the validation rules.
     * 
     * @return {Object} contains the result of the validation of each rule, true if validate & false if not.
     * */
    validate_password = (_password, _password_rules) => {
        let contains_lowercase = true,
            contains_uppercase = true,
            contains_numeric = true,
            contains_symbols = true,
            response = {}

        if (_password_rules.lowercase) {
            contains_lowercase = /[a-z]/.test(_password)
            response["contains_lowercase"] = contains_lowercase
        }

        if (_password_rules.uppercase) {
            contains_uppercase = /[A-Z]/.test(_password)
            response["contains_uppercase"] = contains_uppercase

        }

        if (_password_rules.numeric) {
            contains_numeric = /[0-9]/.test(_password)
            response["contains_numeric"] = contains_numeric

        }

        if (_password_rules.symboles) {
            contains_symbols = /[~@#$%^&*+=`|{}:;!.?\"()\[\]-]/.test(_password)
            response["contains_symbols"] = contains_symbols

        }

        return response
    }

    /**
     * Compare the value of two strings.
     * 
     * @param {String} _this the first string.
     * @param {String} _with the second string.
     * 
     * @return {Boolean} true if equals & false if not.
     * */
    validate_compare = (_this, _with) => {
        return new String(_this).valueOf() == new String(_with).valueOf()
    }

    /**
     * Compare the length of a strings with the min and max length.
     * 
     * @param {String} _value the string.
     * @param {Integer} _min_lenght the minimum length.
     * @param {Integer} _max_lenght the maximum length.
     * 
     * @return {Boolean} true if the length of the _value is >= the value of _min_length and <= the value of _max_length  & false if not.
     * */
    validate_length(_value, _min_lenght, _max_length) {
        return _value.length >= _min_lenght && _value.length <= _max_length
    }

    /**
     * Compare two objects.
     * 
     * @param {Objcet} _defaults the default options.
     * @param {Objcet} _options the provided options.
     * 
     * @return {Objcet} the new value of _options.
     * */
    extend_options = (_defaults, _options) => {
        let extended = {}
        let prop

        for (prop in _defaults) {
            if (Object.prototype.hasOwnProperty.call(_defaults, prop)) {
                extended[prop] = _defaults[prop]
            }
        }

        for (prop in _options) {
            if (Object.prototype.hasOwnProperty.call(_options, prop)) {
                extended[prop] = _options[prop]
            }
        }

        return extended
    }
}