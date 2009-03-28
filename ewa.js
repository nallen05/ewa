//
// http://github.com/nallen05/ewa
//

var Ewa = {

    _hasKey: function(obj, k) {
	for (i in obj) {
	    if (i == k) {
		return true;
	    };
	};
	return false;
    },
    
    _getKeyOwner: function(element,key) {
	if (element&&(element !== document.body)) {
	    return Ewa._hasKey(element, key) ? element : Ewa._getKeyOwner(element.parentNode, key);
	}
    },

    // this method derived from http://www.dustindiaz.com/top-ten-javascript/
    getDescendentsByClassName: function(element,searchClass) {
	var classElements = new Array();
	var els = element.getElementsByTagName('*');
	var elsLen = els.length;
	var pattern = new RegExp('(^|\\\\s)'+searchClass+'(\\\\s|$)');
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
    },

    init: function(element, state, arg1, arg2, arg3, arg4, arg5) {

	element.getInheritedKeyOwner = function(key) {
	    return Ewa._getKeyOwner(this, key);
	};

	element.getInherited = function(key) {
	    var owner = this.getInheritedKeyOwner(key);
	    if (owner) {
		return owner[key];
	    } else {
		throw 'unknown key: getInherited('+key+')';
	    };
	};

	element.setInherited = function(key, val) {
	    var owner = this.getInheritedKeyOwner(key);
	    if (owner) {
		owner[key] = val;
	    } else {
		throw 'unknown key: setInherited('+key+', '+val+')';
	    };
	    return val;
	};

	element._Ewa_historical_state_stack = [];

	element._enterState = function(k, s, a1, a2, a3, a4, a5) {
	    var s = s||{};
	    var old_state = {};
	    for (i in s) {
		old_state[i] = this[i];
	    };
	    this._Ewa_historical_state_stack.push({
		    current_state: s,
		    current_args: [a1, a2, a3, a4, a5],
		    old_state: old_state,
		    k: k
	    });
	    for (i in s) {
		this[i] = s[i];
	    };
	    if (this.init) {
		this.init(a1, a2, a3, a4, a5);
	    };
	};

	element.reinit = function() {
	    var current_args;
	    if (this.init) {
		current_args = this._Ewa_historical_state_stack.last().current_args;
		this.init(current_args[0],
			  current_args[1],
			  current_args[2],
			  current_args[3],
			  current_args[4]);
	    };
	};

	element._exit_state = function() {
	    var popped = this._Ewa_historical_state_stack.pop();
	    var old_state = popped.old_state;
	    for (i in old_state) {
		this[i] = old_state[i];
	    };
	    return popped;
	};
	
	element._maybe_run_exit_method = function() {
	    var current_args;
	    if (this.exit) {
		current_args = this._Ewa_historical_state_stack.last().current_args;
		this.exit(current_args[0],
			  current_args[1],
			  current_args[2],
			  current_args[3],
			  current_args[4]);
	    };
	};

	element.switchState = function(s, a1, a2, a3, a4, a5) {
	    var popped;
	    this._maybe_run_exit_method();
	    popped = this._exit_state();
	    this._enterState(popped.k, s, a1, a2, a3, a4, a5);
	    return this;
	};

	element.launchStateBecause = function(k, s, a1, a2, a3, a4, a5) {
	    var popped = this._exit_state();
	    this._Ewa_historical_state_stack.push(popped);
	    this._enterState(k, s, a1, a2, a3, a4, a5);
	    return this;
	};

	element.launchState = function(s, a1, a2, a3, a4, a5) {
	    element.launchStateBecause(function() { return 0 }, s, a1, a2, a3, a4, a5);
	    return this;
	};

	element.popState = function(a1, a2, a3, a4, a5) {
	    var leaving;
	    var entering;
	    if (this._Ewa_historical_state_stack) {
		this._maybe_run_exit_method();
		leaving = this._exit_state();
		entering = this._Ewa_historical_state_stack.pop();
		this._enterState(entering.k,
				 entering.current_state,
				 entering.current_args[0],
				 entering.current_args[1],
				 entering.current_args[2]);
		leaving.k(a1, a2, a3, a4, a5);
		return this;
	    } else {
		throw 'Reached end of state stack: '+this;
	    };
	};

	element.getDescendentsByClassName = function(selectClass) {
	    Ewa.getDescendentsByClassName(this, selectClass);
	},
	    
	element.initDescendentsByClassName = function(selectClass, s, a1, a2, a3, a4, a5) {
	    Ewa.initDescendentsByClassName(this, selectorClass, s, a1, a2, a3, a4, a5);
	};

	element.reinitDescendentsByClassName = function(selectClass, s, a1, a2, a3, a4, a5) {
	    Ewa.reinitDescendentsByClassName(this, selectorClass, s, a1, a2, a3, a4, a5);
	};

	element._enterState(function(){ return 0; },
			    state,
			    arg1,
			    arg2,
			    arg3,
			    arg4,
			    arg5);

	return element;
    },

    initDescendentsByClassName: function(element, searchClass, state, arg1, arg2, arg3, arg4, arg5) {
	var elements = Ewa.getDescendentsByClassName(element, searchClass);
	for (e in elements) {
	    Ewa.init(elements[e], state, arg1, arg2,arg3, arg4, arg5);
	};
    },

    reinitDescendentsByClassName: function(element,searchClass, state, arg1, arg2, arg3, arg4, arg5) {
	var elements = Ewa.getDescendentsByClassName(element, searchClass);
	for (e in elements) {
	    Ewa.reinit(elements[e], state, arg1, arg2,arg3, arg4, arg5);
	};
    }
}