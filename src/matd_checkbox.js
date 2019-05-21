/*
matd checkbox

Javascript / jQuery plugin to create a Material Design checkbox

Created: 5/21/2019
Author: Chris Ash
License: MIT License

*/
;(function($) {

	$.matd_checkbox = {
        id: '',
		placeholder: '',
		event: false,
		orig_input: [],
        existing_id: '',
        checked: false,
        partial: false,
        clicked_color: '',
        outline_color: '',
        templateString: '<span class="matd_cb_container"><span class="flex-base matd_cb_inner" data-checked="${checked}" data-indeterminate="${partial}"><svg class="matd_cb_svg" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path class="matd_cb_off" style="${style_out_color}" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path><path class="matd_cb_on" style="${style_color}" d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path><path class="matd_cb_part" style="${style_color}" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"></path></svg><input id="mtdcb_${id}" ${placeholder} class="matd_cb_input" type="checkbox" value="chk_val"></span></span>',
        style_color: '',
        style_out_color: ''
    };

	  // default values to reset globals between each run. This is in case of multiple uses on a single page.
    var _def = {
        id: '',
		placeholder: '',
		event: false,
		orig_input: [],
        existing_id: '',
        checked: false,
        partial: false,
        clicked_color: '',
        outline_color: '',
        templateString: '<span class="matd_cb_container"><span class="flex-base matd_cb_inner" data-checked="${checked}" data-indeterminate="${partial}"><svg class="matd_cb_svg" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path class="matd_cb_off" style="${style_out_color}" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path><path class="matd_cb_on" style="${style_color}" d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path><path class="matd_cb_part" style="${style_color}" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"></path></svg><input id="mtdcb_${id}" ${placeholder} class="matd_cb_input" type="checkbox" value="chk_val"></span></span>',
        style_color: '',
        style_out_color: ''
    }

		$.extend($.fn, {
		matd_checkbox: function() {
			var _param = arguments[0],
				_args = [].slice.call(arguments).slice(1);

			// API check first
			if ( API[_param] ) {
				var _fn = API[_param];
				return _fn.apply(this, _args);
			} else {
                // reset to default
                var _out = methods.checkAPI($.matd_checkbox, _def, API);
				$.matd_checkbox = _out.local;
				API = _out.API;

                // don't do anything if no params are set
				if ( _param ) {
					_out = methods.checkAPI($.matd_checkbox, _param, API);
					$.matd_checkbox = _out.local;
					API = _out.API;
				}

				// check for blank id.
				if ( $.matd_checkbox.id == '' ) {
					if ( $(this).attr('id') != '' ) {
						$.matd_checkbox.id = $(this).attr('id');
					} else {
						methods.counter++;
						var _rand = 'matd' + (new Date().getTime()) + 'cb' + methods.counter;
						$.matd_checkbox.id = _rand;
						$(this).attr('id',_rand);
					}
				}

				// kick off launch
				methods.startup.apply(this);

			}
		}
	});

	var API = {
		debug: function() {
			console.log('[debug]',$.matd_checkbox);
        },
        go_check: function(_state) {
            var _this = $(this);
            var _checked = _this.prop('checked',_state);
            _this.parents('.matd_cb_inner').attr('data-checked',_state);            
        }
	};

	var methods = {
        counter: 1,
		types: ['checkbox'],
		startup: function() {
            if ($.matd_checkbox.templateString != '' ) {
                if ( $('#'+$.matd_checkbox.id+'.matd_cb_input').length == 0 ) {
                        // see if we're absorbing an existing input tag
                        methods.check_target_type();

                        // fire init event
                        methods.trigger_evt($.matd_checkbox.id,'init','');

                        methods.place_ctrl( methods.make_html() );

                        methods.assign_event();

                        // fire done event
                        methods.trigger_evt($.matd_checkbox.id,'started','');
                } else {
                    console.log('[matd_checkbox] id: mtdcb_'+$.matd_checkbox.id+' is already in place in the DOM. Control not added.');
                }
            } else {
                console.log('[matd_checkbox] Control Template may not be blank');
            }
		},
		check_target_type: function() {
			var _elem = $('#'+$.matd_checkbox.id);
			if ( _elem[0].nodeName.toLowerCase() == 'input') {
				$.matd_checkbox.preserve_input = true;
				$.matd_checkbox.existing_id = ''+$.matd_checkbox.id;

				// gather what attribs the tag has for later.
				for ( var i=0; i < _elem[0].attributes.length; i++ ) {
					var _param = _elem[0].attributes[i];
					$.matd_checkbox.orig_input.push(_param);
				}

				// move the mark of the target up to parent.
				var _prt = _elem.parent();
				if ( ( _prt.attr('id') != '' ) && ( _prt.attr('id') ) ) {
					$.matd_checkbox.id = _prt.attr('id');
				} else {
					methods.counter++;
					// parent has no id, generate one then use it.
					 var _rand = 'r' + (new Date().getTime()) + 'r' + methods.counter
					 _prt.attr('id',_rand);
					 $.matd_checkbox.id = _rand;
				}
			}
        },
        add_hash_hex: function(_val) {
            var _missing_hash = ( /^[a-f\d]{2}[a-f\d]{2}[a-f\d]{2}$/i.exec(_val) || /^[a-f\d]{3}$/i.exec(_val) ) == null ? false : true;
            if ( _missing_hash ) {
              _val = '#' + _val;
            }
            return _val;
        },  
        prep_color: function(_what,_out_param) {
            if ( $.matd_checkbox[_what].toLowerCase().indexOf('rgb') == -1 ) {
                $.matd_checkbox[_what] = methods.add_hash_hex( $.matd_checkbox[_what]);
            }
            if ( $.matd_checkbox[_what] != '' ) $.matd_checkbox[_out_param] = 'fill:' + $.matd_checkbox[_what] + ';';
        },  
        make_html: function() {
            // do some default checks

            // make sure color style has a leading # if a hex
            methods.prep_color('clicked_color','style_color');
            methods.prep_color('outline_color','style_out_color');

            // this covers the base swaps
            var _html = methods.prp_ct($.matd_checkbox.templateString, $.matd_checkbox);

            return _html;
        },
        place_ctrl: function(_html) {
            if ( $('#mtdcb_'+$.matd_checkbox.id).length == 0 ) {
                        if ( $.matd_checkbox.existing_id != '' ) {
                            $('#'+$.matd_checkbox.id).prepend(_html);
                            var _class = $('#mtdcb_'+$.matd_checkbox.id).attr('class');
                            $('#'+$.matd_checkbox.existing_id).clone(true, true).attr('id', $.matd_checkbox.existing_id+'new').addClass(_class).attr('tabIndex','0').insertBefore('#mtdcb_'+$.matd_checkbox.id);
                            $('#'+$.matd_checkbox.existing_id).remove();
                            $('#mtdcb_'+$.matd_checkbox.id).remove();
                            $('#'+$.matd_checkbox.existing_id+'new').attr('id',$.matd_checkbox.existing_id);
                        } else {
                            $('#'+$.matd_checkbox.id).html(_html);
                        }
            } else {
                console.log('[matd_checkbox] id: mtdcb_'+$.matd_checkbox.id+' is already in place in the DOM. Control not added.');
            }
        },
        assign_event: function() {
            var _what = $('#mtdcb_'+$.matd_checkbox.id);
            if ( $.matd_checkbox.existing_id != '' ) {
                _what = $('#'+$.matd_checkbox.existing_id);
            }

            var _loc_what = $(_what);
            _loc_what.on('click',function(evt) {
                var _this = $(this);
                var _checked = _this.prop('checked');
                _this.parents('.matd_cb_inner').attr('data-checked',_checked);
            });
        },
        trigger_evt: function(_who,_trigger, evt) {
            $('#'+_who).trigger(_trigger,evt);
        },
        checkAPI: function(_local, _param, API) {
            var _loc_out = {};

            for (var _idx in _local) {
                // absorb overrides
                _loc_out[_idx] = _local[_idx];

                if( _param.hasOwnProperty(_idx) ) {
                    // check if where we're putting the new data is an object / array
                    if ( typeof _loc_out[_idx] == "object" ) {

                        // checking inbound data is object/array. If so, replace like with like
                        if ( Array.isArray(_loc_out[_idx]) && Array.isArray(_param[_idx]) ) {
                            _loc_out[_idx] = [];
                            var _inner_from = _param[_idx],
                                _inner_to = _loc_out[_idx];

                            for ( var itm=0; itm < _param[_idx].length; itm++ ) {
                                var _row = _inner_from[itm];
                                _inner_to.push( _row );
                            }
                        } else if ( ( typeof _param[_idx] == "string" ) && ( Array.isArray(_loc_out[_idx]) ) ) {
                            _loc_out[_idx].push( _param[_idx] );
                        } else {
                            _loc_out[_idx] = _param[_idx];
                        }

                    } else {
                        _loc_out[_idx] = _param[_idx];
                    }
                }
            }
            // check API for overrides. This should be rare
            methods.each( API, function(_idx, _val) {
                // absorb overrides
                if ( _param[_idx] != null ) {
                    API[_idx] = _param[_idx];
                }
            });
            return { "local": _loc_out, "API": API };
        },
        prp_ct: function(_template, _data_obj, _alt_obj) {
            var _nmeObj = /\${([^\}]+)}/i;

            var _loop = true,
                _fallback_counter = 0;

            if ( _alt_obj ) {
                _data_obj = _alt_obj;
            }
            try {
                do {
                    var reNme = _nmeObj.exec(_template);
                    if (reNme != null && reNme.length > 1) {
                        var _tag = reNme[1];

                        var _fnc = new Function("_tmpl","_newval","return _tmpl.replace(/\\${"+_tag+"}/ig, _newval);");
                        _template = _fnc(_template, _data_obj[_tag]);
                        _fallback_counter++;                    
                    } else {
                        _fallback_counter = 10;
                    }
                } while (  _fallback_counter < 10 );
            } catch (e) {
                console.log('[prp_ct] error processing template = '+e);
            }
            return _template;
        },    
        each: function( obj, callback ) {
            var length, i = 0;

            if ( methods.isArrayLike( obj ) ) {
                length = obj.length;
                for ( ; i < length; i++ ) {
                    if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }
            } else {
                for ( i in obj ) {
                    if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }
            }

            return obj;
        },
        type: function( obj ) {
            if ( obj == null ) {
                return obj + "";
            }

            // Support: Android<4.0, iOS<6 (functionish RegExp) because you don't know who has what out there
            return typeof obj === "object" || typeof obj === "function" ?
                methods.class2type[ methods.class2type.toString.call( obj ) ] || "object" :
                typeof obj;
        },
        class2type: {},
        isWindow: function( obj ) {
            return obj != null && obj === obj.window;
        },
        isArrayLike: function( obj ) {
            // from jQuery 2.2.5

            // Support: iOS 8.2 (not reproducible in simulator)
            // `in` check used to prevent JIT error (gh-2145)
            var length = !!obj && "length" in obj && obj.length,
                type = methods.type( obj );

            if ( type === "function" || methods.isWindow( obj ) ) {
                return false;
            }

            return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && ( length - 1 ) in obj;
        }        
    }

    // populate class2type
    var _names = "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " );
    var _nmMax = _names.length;
    for ( var i=0; i < _nmMax; i++ ){
        var _entry = _names[i];
        methods.class2type[ "[object " + _entry + "]" ] = _entry.toLowerCase();
    }    
})(jQuery);
