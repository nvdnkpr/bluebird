//This is the only way to have efficient constants
%constant(FUNCTION_OFFSET, 0);
%constant(RECEIVER_OFFSET, 1);
%constant(ARGUMENT_OFFSET, 2);
%constant(FUNCTION_SIZE, 3);

%constant(CALLBACK_FULFILL_OFFSET, 0);
%constant(CALLBACK_REJECT_OFFSET, 1);
%constant(CALLBACK_UPDATE_OFFSET, 2);
%constant(CALLBACK_PROMISE_OFFSET, 3);
%constant(CALLBACK_RECEIVER_OFFSET, 4);
%constant(CALLBACK_SIZE, 5);

%constant(TYPE_ERROR_INFINITE_CYCLE, "Circular thenable chain");
%constant(TOO_MANY_PARALLEL_HANDLERS, "Too many parallel handlers");

//Layout
//00CF NY-- --LL LLLL LLLL LLLL LLLL LLLL
//C = isCompleted
//F = isFulfilled
//N = isRejected
//Y = isCancellable
//L = Length, 22 bit unsigned
//- = Reserved
//0 = Always 0 (never used)
%constant(IS_COMPLETED, 0x20000000);
%constant(IS_FULFILLED, 0x10000000);
%constant(IS_REJECTED, 0x8000000);
%constant(IS_CANCELLABLE, 0x4000000);
%constant(LENGTH_MASK, 0x3FFFFF);
%constant(LENGTH_CLEAR_MASK, 0x3FC00000);
%constant(MAX_LENGTH, 0x3FFFFF);


var errorObj = {};
var UNRESOLVED = {};
var noop = function(){};

function indexOf( array, value ) {
    for( var i = 0, len = array.length; i < len; ++i ) {
        if( value === array[i] ) {
            return i;
        }
    }
    return -1;
}

var isArray = Array.isArray || function( obj ) {
    //yeah it won't work iframes
    return obj instanceof Array;
};

//Try catch is not supported in optimizing
//compiler, so it is isolated
function tryCatch1( fn, receiver, arg ) {
    try {
        return fn.call( receiver, arg );
    }
    catch( e ) {
        if( Promise.errorHandlingMode ===
            Promise.ErrorHandlingMode.PROMISE_ONLY &&
            !( e instanceof PromiseError ) ) {
            throw e;
        }
        errorObj.e = e;
        return errorObj;
    }
}

function tryCatch2( fn, receiver, arg, arg2 ) {
    try {
        console.log(fn,receiver,arg,arg2);
        return fn.call( receiver, arg, arg2 );
    }
    catch( e ) {
        if( Promise.errorHandlingMode ===
            Promise.ErrorHandlingMode.PROMISE_ONLY &&
            !( e instanceof PromiseError ) ) {
            throw e;
        }
        errorObj.e = e;
        return errorObj;
    }
}

var create = Object.create || function( proto ) {
    function F(){}
    F.prototype = proto;
    return new F();
};
