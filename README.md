# Form Validator JS

A JavaScript form validation library

# Features

- Customisable form fields validation with a dozen rules.
- Vanilla Javascript, No dependencies.
- Your Own Messages.

# How to use

## Download the form-validator.js file
    
Download the file from github. Use this link: [Form-validator.js](https://raw.githubusercontent.com/AM-77/form-validator.js/master/form-validator.js)

## Import the Form-validator

```javascript
import Form_validator from "./form-validator.js"
let form_validator = new Form_validator()
```

## Use the form_validator Object

```javascript
// the input field.
let input = document.querySelector("#email")

// listen to keyup on the input field. 
//NOTE: this is just a simple way to use the form_validator methods. You can use them how ever you want.
input.addEventListener("keyup", ()=>{ 

    // validate the email filed
    let email_validation = form_validator.validate(input, ["email"], {
        min_lenght: 0,
        max_length: 256
    }, true);
    
    // Create your message based on the email_validation variable.
})
```

## Available Methods

- validate (input, types, option_rules:optional, required:optional)
available options in the option_rules parameter : 
```javascript
available_options = {
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
```
NOTE: all the options in the option_rules parameter are optional.

- validate_email (_email)
- validate_alpha (_alpha)
- validate_alpha_dash (_alpha_dash)
- validate_alpha_numeric (_alpha_numeric)
- validate_alpha_numeric_dash (_alpha_numeric_dash)
- validate_integer (_integer)
- validate_decimal (_decimal)
- validate_url (_url)
- validate_date (_date,
- validate_credit_card (_credit_card)
- validate_password (_password,
- validate_compare (_this,
- validate_length alue, _min_lenght

## Documentation

You can check the docs here : [form-validator.js](https://docs-form-validator.js.medamine.now.sh)

## Contribution

Feel free to raise an [issue](https://github.com/AM-77/form-validator.js/issues) or submit a [pull request](https://github.com/AM-77/form-validator.js/pulls).


## Copyright and license

Code copyright 2019 AM-77. Code released under [the MIT license](https://github.com/AM-77/form-validator.js/blob/master/LICENSE).

