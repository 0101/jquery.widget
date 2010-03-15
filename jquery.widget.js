/**
 * Simple widget factory.
 *
 * @param constructor
 *   first parameter should be a function that is used to create the widget
 *   
 * @param arguments
 *   (Optional) further parameters are used as arguments for the constructor
 *   function
 *        
 * @returns modified jQuery object or null if called without a constructor
 * and widget does not exist
 *
 * @requires jQuery 
 * @version 1.0
 */ 
;(function($){
    var DATA_KEY = '__widget__',
        getArgs = function(args) {
            return Array.prototype.slice.call(args, 1);
        },
        getFunctionName = function(fn) {
            var re = /\W*function\s+([\w\$]+)\(/.exec(fn);
            return re ? re[1] : '';
        },
        store = function(element, key) {
            log('\t\tstoring', element, 'to $.data as "', key, '"');
            element.data(key, element);            
            // last created widget will be also accessible via .widget()
            // regardless of if its been created with a named function
            element.data(DATA_KEY, element);
        },
        log = function() {
            if ($.fn.widget.debug && window.console)
                window.console.log.apply(this, arguments);
        }
   
    $.fn.widget = function(){
        log('$.fn.widget called on:', this);        
        var constructor = null;
        var dataKey = DATA_KEY;
        if (arguments.length > 0) {
            constructor = arguments[0];
            dataKey += getFunctionName(constructor);
        }
        
        if (this.length == 0) {
            // element does not exist, constructor should create and return it
            log('\telement didnt exist');
            if (!constructor)
                return null;
            
            var widget = constructor.apply(this, getArgs(arguments));
            log('\tsupplied constructor function returned:\t', widget);
            
            if (!widget)
                // it didn't...
                return null;
            
            store(widget, dataKey);
            
            return widget;
        }
        
        // only works with a single element for now,
        // takes the first one if more were selected
        var element = this.lenght == 1 ? this : this.first();
        
        var widget = element.data(dataKey);
        if (widget) {
            // widget already exists
            log('\tretrieved "', dataKey, '" from $.data');
            return widget;        
        }
        // plain jQuery object -> create widget
        if (!constructor)
            return null;
        
        // 1. modify element with supplied function       
        constructor.apply(element, getArgs(arguments));
        log('\t', constructor, 'applied on', element);
        
        // 2. store modified version
        store(element, dataKey);
                
        return element;
    }    
    $.fn.widget.debug = false;
})(jQuery);