"use strict"

export default class Form_validator {
    validate = (input, types, option_rules, compare_with = undefined, required = true) => {

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
                "after": "1900-01-01",
                "before": "2100-01-01"
            }
        }

        let rules = {}
        rules.password = this.extend(default_rules.password, option_rules.password)
        rules.date = this.extend(default_rules.date, option_rules.date)
        rules = this.extend(default_rules, rules)

        let valid_password = true,
            valid_length = true

        let response = {
            valid: true,
            validated: {}
        }

        let value = input.value


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

                    if (this.validate_date(value)) {
                        response.validated["date"] = true
                    } else {
                        response.validated["date"] = false
                    }

                    let res = this.validate_date(value, rules.date)
                    valid_date = ((res.format || res.format == undefined) && (res.after || res.after == undefined) && (res.before || res.before == undefined))
                    
                    if (valid_date) {
                        response.validated["date"] = res
                    } else {
                        response.validated["date"] = res
                    }
                    break
                }

                case "password": {

                    let res = this.validate_password(value, rules.password)
                    valid_password = ((res.contains_lowercase || res.contains_lowercase == undefined) && (res.contains_uppercase || res.contains_uppercase == undefined) && (res.contains_numeric || res.contains_numeric == undefined) && (res.contains_symbols || res.contains_symbols == undefined) )
                    if (valid_password) {
                        response.validated["password"] = res
                    } else {
                        response.validated["password"] = res
                    }

                    break
                }
            }

        });

        response.valid = (response.validated["email"] || response.validated["email"] == undefined) && (response.validated["alpha"] || response.validated["alpha"] == undefined) && (response.validated["alpha_dash"] || response.validated["alpha_dash"] == undefined) && (response.validated["alpha_numeric"] || response.validated["alpha_numeric"] == undefined) && (response.validated["alpha_numeric_dash"] || response.validated["alpha_numeric_dash"] == undefined) && (response.validated["integer"] || response.validated["integer"] == undefined) && (response.validated["decimal"] || response.validated["decimal"] == undefined) && (response.validated["url"] || response.validated["url"] == undefined) && (response.validated["date"] || response.validated["date"] == undefined) && (response.validated["credit_card"] || response.validated["credit_card"] == undefined) && (valid_password || response.validated["password"] == undefined)


        valid_length = this.validate_length(value, rules.min_lenght, rules.max_length)
        if (!valid_length) {
            response.validated["length"] = {
                min_lenght: value.length >= rules.min_lenght,
                max_length: value.length <= rules.max_length
            }

            response.valid = response.valid && valid_length
        }

        if (compare_with) {
            response.validated["compare_with"] = this.validate_compare(value, compare_with)
            response.valid = response.valid && response.validated["compare_with"]
        }

        if (required) {
            response.validated["required"] = value.length > 0
            response.valid = response.valid && response.validated["required"]
        }

        return response
    }


    validate_email = (_email) => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(_email).toLowerCase())
    }

    validate_alpha = (_alpha) => {
        return /^[a-z]+$/i.test(String(_alpha))
    }

    validate_alpha_dash = (_alpha_dash) => {
        return /^[a-z]+$/i.test(String(_alpha_dash))
    }

    validate_alpha_numeric = (_alpha_numeric) => {
        return /^[a-z0-9]+$/i.test(String(_alpha_numeric))
    }

    validate_alpha_numeric_dash = (_alpha_numeric_dash) => {
        return /^[a-z0-9_\-]+$/i.test(String(_alpha_numeric_dash))
    }

    validate_integer = (_integer) => {
        return /^\-?[0-9]+$/.test(String(_integer))
    }

    validate_decimal = (_decimal) => {
        return /^[0-9](\.[0-9]+)?$/.test(String(_decimal))
    }

    validate_url = (_url) => {
        return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(String(_url))
    }

    validate_date = (_date, _date_rules = {
        "format": "yyyy-mm-dd", 
        "after": "1900-01-01",
        "before": "2100-01-01"
    }) => {

        let valid_after = true,
            valid_before = true,
            valid_format = true,
            response = {}

        if(_date_rules.format){
            if (_date_rules.format === "yyyy-mm-dd")
                valid_format = /\d{4}-\d{1,2}-\d{1,2}/.test(_date)
            else
                valid_format = /\d{2}-\d{1,2}-\d{1,2}/.test(_date)
            
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

    // suported cards Visa, MasterCard, American Express, Diners Club, Discover, and JCB cards
    validate_credit_card = (_credit_card) => {
        return /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(String(_credit_card))
    }

    validate_password = (_password, _password_rules = {
        "lowercase": true,
        "uppercase": true,
        "numeric": true,
        "symboles": true
    }) => {

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

    validate_compare = (_this, _with) => {
        return new String(_this).valueOf() == new String(_with).valueOf()
    }

    validate_length(_value, _min_lenght, _max_length) {
        return _value.length >= _min_lenght && _value.length <= _max_length
    }


    extend = function (defaults, options) {
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    }
}