# A Material Design Checkbox Control with Javascript / JQuery

MatD Checkbox control is a small component that can generate a checkbox control following the Material design theme.

### Browser Support

The MatD Checkbox control is intended for "modern" browsers ( Chrome, Safari, Edge, Firefox, etc ) and IE11

### Dependencies

MatD Checkbox control has been tested on jQuery 3.3.1 but should work with jQuery 2.1 and 1.7

### How to use

To get started, place the following lines in your web page or application:

    <link rel="stylesheet" href="js/matd_checkbox/matd_checkbox.css" type="text/css" media="screen" />
	<script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
	<script type="text/javascript" src="s/matd_checkbox/matd_checkbox.min.js"></script>

Then target an existing checkbox like so, passing in any options desired:

$('#test').matd_checkbox({...});

### Option Syntax

## partial

This is a boolean that indicates to not use a 'check' symbol but instead use a dashed line to indicate a 'partial' when clicked.

Example: 

$('#test2').matd_checkbox({ 'partial': true });

## clicked_color

This can be a hex color or an RGB css commnad. By setting this, the color of the 'check' can be controlled.

Exmaple:

$('#test4').matd_checkbox({ 'clicked_color': '#e10050' });

## outline_color

This allows the color of the 'default' or 'off' state of the checkbox to be set.

Example:

$('#test4').matd_checkbox({ 'outline_color': '#e10050' });

### API

## go_check

This API call is to be used after the Matd checkbox control has been initialized for use.

Example:

$('#test3').matd_checkbox('go_check',true);

### License

Copyright (c) 2019 C. B. Ash

Licensed under the MIT License

While this is my own pet project, I always enjoy getting suggestions for improvement here.
