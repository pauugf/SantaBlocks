import {readPacket as $5N4O3$readPacket} from "osc";

var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequirede3a"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequirede3a"] = parcelRequire;
}
parcelRequire.register("jsHlH", function(module, exports) {
/*******************************************************************************
 * Copyright (c) 2013 IBM Corp.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Eclipse Distribution License v1.0 which accompany this distribution.
 *
 * The Eclipse Public License is available at
 *    http://www.eclipse.org/legal/epl-v10.html
 * and the Eclipse Distribution License is available at
 *   http://www.eclipse.org/org/documents/edl-v10.php.
 *
 * Contributors:
 *    Andrew Banks - initial API and implementation and initial documentation
 *******************************************************************************/ // Only expose a single object name in the global namespace.
// Everything must go through this module. Global Paho module
// only has a single public function, client, which returns
// a Paho client object given connection details.
/**
 * Send and receive messages using web browsers.
 * <p>
 * This programming interface lets a JavaScript client application use the MQTT V3.1 or
 * V3.1.1 protocol to connect to an MQTT-supporting messaging server.
 *
 * The function supported includes:
 * <ol>
 * <li>Connecting to and disconnecting from a server. The server is identified by its host name and port number.
 * <li>Specifying options that relate to the communications link with the server,
 * for example the frequency of keep-alive heartbeats, and whether SSL/TLS is required.
 * <li>Subscribing to and receiving messages from MQTT Topics.
 * <li>Publishing messages to MQTT Topics.
 * </ol>
 * <p>
 * The API consists of two main objects:
 * <dl>
 * <dt><b>{@link Paho.Client}</b></dt>
 * <dd>This contains methods that provide the functionality of the API,
 * including provision of callbacks that notify the application when a message
 * arrives from or is delivered to the messaging server,
 * or when the status of its connection to the messaging server changes.</dd>
 * <dt><b>{@link Paho.Message}</b></dt>
 * <dd>This encapsulates the payload of the message along with various attributes
 * associated with its delivery, in particular the destination to which it has
 * been (or is about to be) sent.</dd>
 * </dl>
 * <p>
 * The programming interface validates parameters passed to it, and will throw
 * an Error containing an error message intended for developer use, if it detects
 * an error with any parameter.
 * <p>
 * Example:
 *
 * <code><pre>
var client = new Paho.MQTT.Client(location.hostname, Number(location.port), "clientId");
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({onSuccess:onConnect});

function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("/World");
  var message = new Paho.MQTT.Message("Hello");
  message.destinationName = "/World";
  client.send(message);
};
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0)
	console.log("onConnectionLost:"+responseObject.errorMessage);
};
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
  client.disconnect();
};
 * </pre></code>
 * @namespace Paho
 */ /* jshint shadow:true */ (function ExportLibrary(root, factory) {
    if (typeof exports === "object" && "object" === "object") module.exports = factory();
    else if (typeof define === "function" && define.amd) define(factory);
    else if (typeof exports === "object") exports = factory();
    else //if (typeof root.Paho === "undefined"){
    //	root.Paho = {};
    //}
    root.Paho = factory();
})(this, function LibraryFactory() {
    var PahoMQTT = function(global) {
        // Private variables below, these are only visible inside the function closure
        // which is used to define the module.
        var version = "@VERSION@-@BUILDLEVEL@";
        /**
	 * @private
	 */ var localStorage = global.localStorage || function() {
            var data = {
            };
            return {
                setItem: function(key, item) {
                    data[key] = item;
                },
                getItem: function(key) {
                    return data[key];
                },
                removeItem: function(key) {
                    delete data[key];
                }
            };
        }();
        /**
	 * Unique message type identifiers, with associated
	 * associated integer values.
	 * @private
	 */ var MESSAGE_TYPE = {
            CONNECT: 1,
            CONNACK: 2,
            PUBLISH: 3,
            PUBACK: 4,
            PUBREC: 5,
            PUBREL: 6,
            PUBCOMP: 7,
            SUBSCRIBE: 8,
            SUBACK: 9,
            UNSUBSCRIBE: 10,
            UNSUBACK: 11,
            PINGREQ: 12,
            PINGRESP: 13,
            DISCONNECT: 14
        };
        // Collection of utility methods used to simplify module code
        // and promote the DRY pattern.
        /**
	 * Validate an object's parameter names to ensure they
	 * match a list of expected variables name for this option
	 * type. Used to ensure option object passed into the API don't
	 * contain erroneous parameters.
	 * @param {Object} obj - User options object
	 * @param {Object} keys - valid keys and types that may exist in obj.
	 * @throws {Error} Invalid option parameter found.
	 * @private
	 */ var validate = function(obj, keys) {
            for(var key in obj)if (obj.hasOwnProperty(key)) {
                if (keys.hasOwnProperty(key)) {
                    if (typeof obj[key] !== keys[key]) throw new Error(format(ERROR.INVALID_TYPE, [
                        typeof obj[key],
                        key
                    ]));
                } else {
                    var errorStr = "Unknown property, " + key + ". Valid properties are:";
                    for(var validKey in keys)if (keys.hasOwnProperty(validKey)) errorStr = errorStr + " " + validKey;
                    throw new Error(errorStr);
                }
            }
        };
        /**
	 * Return a new function which runs the user function bound
	 * to a fixed scope.
	 * @param {function} User function
	 * @param {object} Function scope
	 * @return {function} User function bound to another scope
	 * @private
	 */ var scope1 = function(f, scope) {
            return function() {
                return f.apply(scope, arguments);
            };
        };
        /**
	 * Unique message type identifiers, with associated
	 * associated integer values.
	 * @private
	 */ var ERROR = {
            OK: {
                code: 0,
                text: "AMQJSC0000I OK."
            },
            CONNECT_TIMEOUT: {
                code: 1,
                text: "AMQJSC0001E Connect timed out."
            },
            SUBSCRIBE_TIMEOUT: {
                code: 2,
                text: "AMQJS0002E Subscribe timed out."
            },
            UNSUBSCRIBE_TIMEOUT: {
                code: 3,
                text: "AMQJS0003E Unsubscribe timed out."
            },
            PING_TIMEOUT: {
                code: 4,
                text: "AMQJS0004E Ping timed out."
            },
            INTERNAL_ERROR: {
                code: 5,
                text: "AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}"
            },
            CONNACK_RETURNCODE: {
                code: 6,
                text: "AMQJS0006E Bad Connack return code:{0} {1}."
            },
            SOCKET_ERROR: {
                code: 7,
                text: "AMQJS0007E Socket error:{0}."
            },
            SOCKET_CLOSE: {
                code: 8,
                text: "AMQJS0008I Socket closed."
            },
            MALFORMED_UTF: {
                code: 9,
                text: "AMQJS0009E Malformed UTF data:{0} {1} {2}."
            },
            UNSUPPORTED: {
                code: 10,
                text: "AMQJS0010E {0} is not supported by this browser."
            },
            INVALID_STATE: {
                code: 11,
                text: "AMQJS0011E Invalid state {0}."
            },
            INVALID_TYPE: {
                code: 12,
                text: "AMQJS0012E Invalid type {0} for {1}."
            },
            INVALID_ARGUMENT: {
                code: 13,
                text: "AMQJS0013E Invalid argument {0} for {1}."
            },
            UNSUPPORTED_OPERATION: {
                code: 14,
                text: "AMQJS0014E Unsupported operation."
            },
            INVALID_STORED_DATA: {
                code: 15,
                text: "AMQJS0015E Invalid data in local storage key={0} value={1}."
            },
            INVALID_MQTT_MESSAGE_TYPE: {
                code: 16,
                text: "AMQJS0016E Invalid MQTT message type {0}."
            },
            MALFORMED_UNICODE: {
                code: 17,
                text: "AMQJS0017E Malformed Unicode string:{0} {1}."
            },
            BUFFER_FULL: {
                code: 18,
                text: "AMQJS0018E Message buffer is full, maximum buffer size: {0}."
            }
        };
        /** CONNACK RC Meaning. */ var CONNACK_RC = {
            0: "Connection Accepted",
            1: "Connection Refused: unacceptable protocol version",
            2: "Connection Refused: identifier rejected",
            3: "Connection Refused: server unavailable",
            4: "Connection Refused: bad user name or password",
            5: "Connection Refused: not authorized"
        };
        /**
	 * Format an error message text.
	 * @private
	 * @param {error} ERROR value above.
	 * @param {substitutions} [array] substituted into the text.
	 * @return the text with the substitutions made.
	 */ var format = function(error, substitutions) {
            var text = error.text;
            if (substitutions) {
                var field, start;
                for(var i = 0; i < substitutions.length; i++){
                    field = "{" + i + "}";
                    start = text.indexOf(field);
                    if (start > 0) {
                        var part1 = text.substring(0, start);
                        var part2 = text.substring(start + field.length);
                        text = part1 + substitutions[i] + part2;
                    }
                }
            }
            return text;
        };
        //MQTT protocol and version          6    M    Q    I    s    d    p    3
        var MqttProtoIdentifierv3 = [
            0,
            6,
            77,
            81,
            73,
            115,
            100,
            112,
            3
        ];
        //MQTT proto/version for 311         4    M    Q    T    T    4
        var MqttProtoIdentifierv4 = [
            0,
            4,
            77,
            81,
            84,
            84,
            4
        ];
        /**
	 * Construct an MQTT wire protocol message.
	 * @param type MQTT packet type.
	 * @param options optional wire message attributes.
	 *
	 * Optional properties
	 *
	 * messageIdentifier: message ID in the range [0..65535]
	 * payloadMessage:	Application Message - PUBLISH only
	 * connectStrings:	array of 0 or more Strings to be put into the CONNECT payload
	 * topics:			array of strings (SUBSCRIBE, UNSUBSCRIBE)
	 * requestQoS:		array of QoS values [0..2]
	 *
	 * "Flag" properties
	 * cleanSession:	true if present / false if absent (CONNECT)
	 * willMessage:  	true if present / false if absent (CONNECT)
	 * isRetained:		true if present / false if absent (CONNECT)
	 * userName:		true if present / false if absent (CONNECT)
	 * password:		true if present / false if absent (CONNECT)
	 * keepAliveInterval:	integer [0..65535]  (CONNECT)
	 *
	 * @private
	 * @ignore
	 */ var WireMessage = function(type, options) {
            this.type = type;
            for(var name in options)if (options.hasOwnProperty(name)) this[name] = options[name];
        };
        WireMessage.prototype.encode = function() {
            // Compute the first byte of the fixed header
            var first = (this.type & 15) << 4;
            /*
		 * Now calculate the length of the variable header + payload by adding up the lengths
		 * of all the component parts
		 */ var remLength = 0;
            var topicStrLength = [];
            var destinationNameLength = 0;
            var willMessagePayloadBytes;
            // if the message contains a messageIdentifier then we need two bytes for that
            if (this.messageIdentifier !== undefined) remLength += 2;
            switch(this.type){
                // If this a Connect then we need to include 12 bytes for its header
                case MESSAGE_TYPE.CONNECT:
                    switch(this.mqttVersion){
                        case 3:
                            remLength += MqttProtoIdentifierv3.length + 3;
                            break;
                        case 4:
                            remLength += MqttProtoIdentifierv4.length + 3;
                            break;
                    }
                    remLength += UTF8Length(this.clientId) + 2;
                    if (this.willMessage !== undefined) {
                        remLength += UTF8Length(this.willMessage.destinationName) + 2;
                        // Will message is always a string, sent as UTF-8 characters with a preceding length.
                        willMessagePayloadBytes = this.willMessage.payloadBytes;
                        if (!(willMessagePayloadBytes instanceof Uint8Array)) willMessagePayloadBytes = new Uint8Array(payloadBytes);
                        remLength += willMessagePayloadBytes.byteLength + 2;
                    }
                    if (this.userName !== undefined) remLength += UTF8Length(this.userName) + 2;
                    if (this.password !== undefined) remLength += UTF8Length(this.password) + 2;
                    break;
                // Subscribe, Unsubscribe can both contain topic strings
                case MESSAGE_TYPE.SUBSCRIBE:
                    first |= 2; // Qos = 1;
                    for(var i = 0; i < this.topics.length; i++){
                        topicStrLength[i] = UTF8Length(this.topics[i]);
                        remLength += topicStrLength[i] + 2;
                    }
                    remLength += this.requestedQos.length; // 1 byte for each topic's Qos
                    break;
                case MESSAGE_TYPE.UNSUBSCRIBE:
                    first |= 2; // Qos = 1;
                    for(var i = 0; i < this.topics.length; i++){
                        topicStrLength[i] = UTF8Length(this.topics[i]);
                        remLength += topicStrLength[i] + 2;
                    }
                    break;
                case MESSAGE_TYPE.PUBREL:
                    first |= 2; // Qos = 1;
                    break;
                case MESSAGE_TYPE.PUBLISH:
                    if (this.payloadMessage.duplicate) first |= 8;
                    first = first |= this.payloadMessage.qos << 1;
                    if (this.payloadMessage.retained) first |= 1;
                    destinationNameLength = UTF8Length(this.payloadMessage.destinationName);
                    remLength += destinationNameLength + 2;
                    var payloadBytes = this.payloadMessage.payloadBytes;
                    remLength += payloadBytes.byteLength;
                    if (payloadBytes instanceof ArrayBuffer) payloadBytes = new Uint8Array(payloadBytes);
                    else if (!(payloadBytes instanceof Uint8Array)) payloadBytes = new Uint8Array(payloadBytes.buffer);
                    break;
                case MESSAGE_TYPE.DISCONNECT:
                    break;
                default:
                    break;
            }
            // Now we can allocate a buffer for the message
            var mbi = encodeMBI(remLength); // Convert the length to MQTT MBI format
            var pos = mbi.length + 1; // Offset of start of variable header
            var buffer = new ArrayBuffer(remLength + pos);
            var byteStream = new Uint8Array(buffer); // view it as a sequence of bytes
            //Write the fixed header into the buffer
            byteStream[0] = first;
            byteStream.set(mbi, 1);
            // If this is a PUBLISH then the variable header starts with a topic
            if (this.type == MESSAGE_TYPE.PUBLISH) pos = writeString(this.payloadMessage.destinationName, destinationNameLength, byteStream, pos);
            else if (this.type == MESSAGE_TYPE.CONNECT) {
                switch(this.mqttVersion){
                    case 3:
                        byteStream.set(MqttProtoIdentifierv3, pos);
                        pos += MqttProtoIdentifierv3.length;
                        break;
                    case 4:
                        byteStream.set(MqttProtoIdentifierv4, pos);
                        pos += MqttProtoIdentifierv4.length;
                        break;
                }
                var connectFlags = 0;
                if (this.cleanSession) connectFlags = 2;
                if (this.willMessage !== undefined) {
                    connectFlags |= 4;
                    connectFlags |= this.willMessage.qos << 3;
                    if (this.willMessage.retained) connectFlags |= 32;
                }
                if (this.userName !== undefined) connectFlags |= 128;
                if (this.password !== undefined) connectFlags |= 64;
                byteStream[pos++] = connectFlags;
                pos = writeUint16(this.keepAliveInterval, byteStream, pos);
            }
            // Output the messageIdentifier - if there is one
            if (this.messageIdentifier !== undefined) pos = writeUint16(this.messageIdentifier, byteStream, pos);
            switch(this.type){
                case MESSAGE_TYPE.CONNECT:
                    pos = writeString(this.clientId, UTF8Length(this.clientId), byteStream, pos);
                    if (this.willMessage !== undefined) {
                        pos = writeString(this.willMessage.destinationName, UTF8Length(this.willMessage.destinationName), byteStream, pos);
                        pos = writeUint16(willMessagePayloadBytes.byteLength, byteStream, pos);
                        byteStream.set(willMessagePayloadBytes, pos);
                        pos += willMessagePayloadBytes.byteLength;
                    }
                    if (this.userName !== undefined) pos = writeString(this.userName, UTF8Length(this.userName), byteStream, pos);
                    if (this.password !== undefined) pos = writeString(this.password, UTF8Length(this.password), byteStream, pos);
                    break;
                case MESSAGE_TYPE.PUBLISH:
                    // PUBLISH has a text or binary payload, if text do not add a 2 byte length field, just the UTF characters.
                    byteStream.set(payloadBytes, pos);
                    break;
                //    	    case MESSAGE_TYPE.PUBREC:
                //    	    case MESSAGE_TYPE.PUBREL:
                //    	    case MESSAGE_TYPE.PUBCOMP:
                //    	    	break;
                case MESSAGE_TYPE.SUBSCRIBE:
                    // SUBSCRIBE has a list of topic strings and request QoS
                    for(var i = 0; i < this.topics.length; i++){
                        pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
                        byteStream[pos++] = this.requestedQos[i];
                    }
                    break;
                case MESSAGE_TYPE.UNSUBSCRIBE:
                    // UNSUBSCRIBE has a list of topic strings
                    for(var i = 0; i < this.topics.length; i++)pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
                    break;
                default:
            }
            return buffer;
        };
        function decodeMessage(input, pos) {
            var startingPos = pos;
            var first = input[pos];
            var type = first >> 4;
            var messageInfo = first &= 15;
            pos += 1;
            // Decode the remaining length (MBI format)
            var digit;
            var remLength = 0;
            var multiplier = 1;
            do {
                if (pos == input.length) return [
                    null,
                    startingPos
                ];
                digit = input[pos++];
                remLength += (digit & 127) * multiplier;
                multiplier *= 128;
            }while ((digit & 128) !== 0)
            var endPos = pos + remLength;
            if (endPos > input.length) return [
                null,
                startingPos
            ];
            var wireMessage = new WireMessage(type);
            switch(type){
                case MESSAGE_TYPE.CONNACK:
                    var connectAcknowledgeFlags = input[pos++];
                    if (connectAcknowledgeFlags & 1) wireMessage.sessionPresent = true;
                    wireMessage.returnCode = input[pos++];
                    break;
                case MESSAGE_TYPE.PUBLISH:
                    var qos = messageInfo >> 1 & 3;
                    var len = readUint16(input, pos);
                    pos += 2;
                    var topicName = parseUTF8(input, pos, len);
                    pos += len;
                    // If QoS 1 or 2 there will be a messageIdentifier
                    if (qos > 0) {
                        wireMessage.messageIdentifier = readUint16(input, pos);
                        pos += 2;
                    }
                    var message = new Message(input.subarray(pos, endPos));
                    if ((messageInfo & 1) == 1) message.retained = true;
                    if ((messageInfo & 8) == 8) message.duplicate = true;
                    message.qos = qos;
                    message.destinationName = topicName;
                    wireMessage.payloadMessage = message;
                    break;
                case MESSAGE_TYPE.PUBACK:
                case MESSAGE_TYPE.PUBREC:
                case MESSAGE_TYPE.PUBREL:
                case MESSAGE_TYPE.PUBCOMP:
                case MESSAGE_TYPE.UNSUBACK:
                    wireMessage.messageIdentifier = readUint16(input, pos);
                    break;
                case MESSAGE_TYPE.SUBACK:
                    wireMessage.messageIdentifier = readUint16(input, pos);
                    pos += 2;
                    wireMessage.returnCode = input.subarray(pos, endPos);
                    break;
                default:
                    break;
            }
            return [
                wireMessage,
                endPos
            ];
        }
        function writeUint16(input, buffer, offset) {
            buffer[offset++] = input >> 8; //MSB
            buffer[offset++] = input % 256; //LSB
            return offset;
        }
        function writeString(input, utf8Length, buffer, offset) {
            offset = writeUint16(utf8Length, buffer, offset);
            stringToUTF8(input, buffer, offset);
            return offset + utf8Length;
        }
        function readUint16(buffer, offset) {
            return 256 * buffer[offset] + buffer[offset + 1];
        }
        /**
	 * Encodes an MQTT Multi-Byte Integer
	 * @private
	 */ function encodeMBI(number) {
            var output = new Array(1);
            var numBytes = 0;
            do {
                var digit = number % 128;
                number = number >> 7;
                if (number > 0) digit |= 128;
                output[numBytes++] = digit;
            }while (number > 0 && numBytes < 4)
            return output;
        }
        /**
	 * Takes a String and calculates its length in bytes when encoded in UTF8.
	 * @private
	 */ function UTF8Length(input) {
            var output = 0;
            for(var i = 0; i < input.length; i++){
                var charCode = input.charCodeAt(i);
                if (charCode > 2047) {
                    // Surrogate pair means its a 4 byte character
                    if (55296 <= charCode && charCode <= 56319) {
                        i++;
                        output++;
                    }
                    output += 3;
                } else if (charCode > 127) output += 2;
                else output++;
            }
            return output;
        }
        /**
	 * Takes a String and writes it into an array as UTF8 encoded bytes.
	 * @private
	 */ function stringToUTF8(input, output, start) {
            var pos = start;
            for(var i = 0; i < input.length; i++){
                var charCode = input.charCodeAt(i);
                // Check for a surrogate pair.
                if (55296 <= charCode && charCode <= 56319) {
                    var lowCharCode = input.charCodeAt(++i);
                    if (isNaN(lowCharCode)) throw new Error(format(ERROR.MALFORMED_UNICODE, [
                        charCode,
                        lowCharCode
                    ]));
                    charCode = (charCode - 55296 << 10) + (lowCharCode - 56320) + 65536;
                }
                if (charCode <= 127) output[pos++] = charCode;
                else if (charCode <= 2047) {
                    output[pos++] = charCode >> 6 & 31 | 192;
                    output[pos++] = charCode & 63 | 128;
                } else if (charCode <= 65535) {
                    output[pos++] = charCode >> 12 & 15 | 224;
                    output[pos++] = charCode >> 6 & 63 | 128;
                    output[pos++] = charCode & 63 | 128;
                } else {
                    output[pos++] = charCode >> 18 & 7 | 240;
                    output[pos++] = charCode >> 12 & 63 | 128;
                    output[pos++] = charCode >> 6 & 63 | 128;
                    output[pos++] = charCode & 63 | 128;
                }
            }
            return output;
        }
        function parseUTF8(input, offset, length) {
            var output = "";
            var utf16;
            var pos = offset;
            while(pos < offset + length){
                var byte1 = input[pos++];
                if (byte1 < 128) utf16 = byte1;
                else {
                    var byte2 = input[pos++] - 128;
                    if (byte2 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [
                        byte1.toString(16),
                        byte2.toString(16),
                        ""
                    ]));
                    if (byte1 < 224) utf16 = 64 * (byte1 - 192) + byte2;
                    else {
                        var byte3 = input[pos++] - 128;
                        if (byte3 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [
                            byte1.toString(16),
                            byte2.toString(16),
                            byte3.toString(16)
                        ]));
                        if (byte1 < 240) utf16 = 4096 * (byte1 - 224) + 64 * byte2 + byte3;
                        else {
                            var byte4 = input[pos++] - 128;
                            if (byte4 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [
                                byte1.toString(16),
                                byte2.toString(16),
                                byte3.toString(16),
                                byte4.toString(16)
                            ]));
                            if (byte1 < 248) utf16 = 262144 * (byte1 - 240) + 4096 * byte2 + 64 * byte3 + byte4;
                            else throw new Error(format(ERROR.MALFORMED_UTF, [
                                byte1.toString(16),
                                byte2.toString(16),
                                byte3.toString(16),
                                byte4.toString(16)
                            ]));
                        }
                    }
                }
                if (utf16 > 65535) {
                    utf16 -= 65536;
                    output += String.fromCharCode(55296 + (utf16 >> 10)); // lead character
                    utf16 = 56320 + (utf16 & 1023); // trail character
                }
                output += String.fromCharCode(utf16);
            }
            return output;
        }
        /**
	 * Repeat keepalive requests, monitor responses.
	 * @ignore
	 */ var Pinger = function(client, keepAliveInterval) {
            this._client = client;
            this._keepAliveInterval = keepAliveInterval * 1000;
            this.isReset = false;
            var pingReq = new WireMessage(MESSAGE_TYPE.PINGREQ).encode();
            var doTimeout = function(pinger) {
                return function() {
                    return doPing.apply(pinger);
                };
            };
            /** @ignore */ var doPing = function() {
                if (!this.isReset) {
                    this._client._trace("Pinger.doPing", "Timed out");
                    this._client._disconnected(ERROR.PING_TIMEOUT.code, format(ERROR.PING_TIMEOUT));
                } else {
                    this.isReset = false;
                    this._client._trace("Pinger.doPing", "send PINGREQ");
                    this._client.socket.send(pingReq);
                    this.timeout = setTimeout(doTimeout(this), this._keepAliveInterval);
                }
            };
            this.reset = function() {
                this.isReset = true;
                clearTimeout(this.timeout);
                if (this._keepAliveInterval > 0) this.timeout = setTimeout(doTimeout(this), this._keepAliveInterval);
            };
            this.cancel = function() {
                clearTimeout(this.timeout);
            };
        };
        /**
	 * Monitor request completion.
	 * @ignore
	 */ var Timeout = function(client1, timeoutSeconds, action1, args1) {
            if (!timeoutSeconds) timeoutSeconds = 30;
            var doTimeout = function(action, client, args) {
                return function() {
                    return action.apply(client, args);
                };
            };
            this.timeout = setTimeout(doTimeout(action1, client1, args1), timeoutSeconds * 1000);
            this.cancel = function() {
                clearTimeout(this.timeout);
            };
        };
        /**
	 * Internal implementation of the Websockets MQTT V3.1 client.
	 *
	 * @name Paho.ClientImpl @constructor
	 * @param {String} host the DNS nameof the webSocket host.
	 * @param {Number} port the port number for that host.
	 * @param {String} clientId the MQ client identifier.
	 */ var ClientImpl = function(uri, host, port, path, clientId) {
            // Check dependencies are satisfied in this browser.
            if (!("WebSocket" in global && global.WebSocket !== null)) throw new Error(format(ERROR.UNSUPPORTED, [
                "WebSocket"
            ]));
            if (!("ArrayBuffer" in global && global.ArrayBuffer !== null)) throw new Error(format(ERROR.UNSUPPORTED, [
                "ArrayBuffer"
            ]));
            this._trace("Paho.Client", uri, host, port, path, clientId);
            this.host = host;
            this.port = port;
            this.path = path;
            this.uri = uri;
            this.clientId = clientId;
            this._wsuri = null;
            // Local storagekeys are qualified with the following string.
            // The conditional inclusion of path in the key is for backward
            // compatibility to when the path was not configurable and assumed to
            // be /mqtt
            this._localKey = host + ":" + port + (path != "/mqtt" ? ":" + path : "") + ":" + clientId + ":";
            // Create private instance-only message queue
            // Internal queue of messages to be sent, in sending order.
            this._msg_queue = [];
            this._buffered_msg_queue = [];
            // Messages we have sent and are expecting a response for, indexed by their respective message ids.
            this._sentMessages = {
            };
            // Messages we have received and acknowleged and are expecting a confirm message for
            // indexed by their respective message ids.
            this._receivedMessages = {
            };
            // Internal list of callbacks to be executed when messages
            // have been successfully sent over web socket, e.g. disconnect
            // when it doesn't have to wait for ACK, just message is dispatched.
            this._notify_msg_sent = {
            };
            // Unique identifier for SEND messages, incrementing
            // counter as messages are sent.
            this._message_identifier = 1;
            // Used to determine the transmission sequence of stored sent messages.
            this._sequence = 0;
            // Load the local state, if any, from the saved version, only restore state relevant to this client.
            for(var key in localStorage)if (key.indexOf("Sent:" + this._localKey) === 0 || key.indexOf("Received:" + this._localKey) === 0) this.restore(key);
        };
        // Messaging Client public instance members.
        ClientImpl.prototype.host = null;
        ClientImpl.prototype.port = null;
        ClientImpl.prototype.path = null;
        ClientImpl.prototype.uri = null;
        ClientImpl.prototype.clientId = null;
        // Messaging Client private instance members.
        ClientImpl.prototype.socket = null;
        /* true once we have received an acknowledgement to a CONNECT packet. */ ClientImpl.prototype.connected = false;
        /* The largest message identifier allowed, may not be larger than 2**16 but
		 * if set smaller reduces the maximum number of outbound messages allowed.
		 */ ClientImpl.prototype.maxMessageIdentifier = 65536;
        ClientImpl.prototype.connectOptions = null;
        ClientImpl.prototype.hostIndex = null;
        ClientImpl.prototype.onConnected = null;
        ClientImpl.prototype.onConnectionLost = null;
        ClientImpl.prototype.onMessageDelivered = null;
        ClientImpl.prototype.onMessageArrived = null;
        ClientImpl.prototype.traceFunction = null;
        ClientImpl.prototype._msg_queue = null;
        ClientImpl.prototype._buffered_msg_queue = null;
        ClientImpl.prototype._connectTimeout = null;
        /* The sendPinger monitors how long we allow before we send data to prove to the server that we are alive. */ ClientImpl.prototype.sendPinger = null;
        /* The receivePinger monitors how long we allow before we require evidence that the server is alive. */ ClientImpl.prototype.receivePinger = null;
        ClientImpl.prototype._reconnectInterval = 1; // Reconnect Delay, starts at 1 second
        ClientImpl.prototype._reconnecting = false;
        ClientImpl.prototype._reconnectTimeout = null;
        ClientImpl.prototype.disconnectedPublishing = false;
        ClientImpl.prototype.disconnectedBufferSize = 5000;
        ClientImpl.prototype.receiveBuffer = null;
        ClientImpl.prototype._traceBuffer = null;
        ClientImpl.prototype._MAX_TRACE_ENTRIES = 100;
        ClientImpl.prototype.connect = function(connectOptions) {
            var connectOptionsMasked = this._traceMask(connectOptions, "password");
            this._trace("Client.connect", connectOptionsMasked, this.socket, this.connected);
            if (this.connected) throw new Error(format(ERROR.INVALID_STATE, [
                "already connected"
            ]));
            if (this.socket) throw new Error(format(ERROR.INVALID_STATE, [
                "already connected"
            ]));
            if (this._reconnecting) {
                // connect() function is called while reconnect is in progress.
                // Terminate the auto reconnect process to use new connect options.
                this._reconnectTimeout.cancel();
                this._reconnectTimeout = null;
                this._reconnecting = false;
            }
            this.connectOptions = connectOptions;
            this._reconnectInterval = 1;
            this._reconnecting = false;
            if (connectOptions.uris) {
                this.hostIndex = 0;
                this._doConnect(connectOptions.uris[0]);
            } else this._doConnect(this.uri);
        };
        ClientImpl.prototype.subscribe = function(filter, subscribeOptions) {
            this._trace("Client.subscribe", filter, subscribeOptions);
            if (!this.connected) throw new Error(format(ERROR.INVALID_STATE, [
                "not connected"
            ]));
            var wireMessage = new WireMessage(MESSAGE_TYPE.SUBSCRIBE);
            wireMessage.topics = filter.constructor === Array ? filter : [
                filter
            ];
            if (subscribeOptions.qos === undefined) subscribeOptions.qos = 0;
            wireMessage.requestedQos = [];
            for(var i = 0; i < wireMessage.topics.length; i++)wireMessage.requestedQos[i] = subscribeOptions.qos;
            if (subscribeOptions.onSuccess) wireMessage.onSuccess = function(grantedQos) {
                subscribeOptions.onSuccess({
                    invocationContext: subscribeOptions.invocationContext,
                    grantedQos: grantedQos
                });
            };
            if (subscribeOptions.onFailure) wireMessage.onFailure = function(errorCode) {
                subscribeOptions.onFailure({
                    invocationContext: subscribeOptions.invocationContext,
                    errorCode: errorCode,
                    errorMessage: format(errorCode)
                });
            };
            if (subscribeOptions.timeout) wireMessage.timeOut = new Timeout(this, subscribeOptions.timeout, subscribeOptions.onFailure, [
                {
                    invocationContext: subscribeOptions.invocationContext,
                    errorCode: ERROR.SUBSCRIBE_TIMEOUT.code,
                    errorMessage: format(ERROR.SUBSCRIBE_TIMEOUT)
                }
            ]);
            // All subscriptions return a SUBACK.
            this._requires_ack(wireMessage);
            this._schedule_message(wireMessage);
        };
        /** @ignore */ ClientImpl.prototype.unsubscribe = function(filter, unsubscribeOptions) {
            this._trace("Client.unsubscribe", filter, unsubscribeOptions);
            if (!this.connected) throw new Error(format(ERROR.INVALID_STATE, [
                "not connected"
            ]));
            var wireMessage = new WireMessage(MESSAGE_TYPE.UNSUBSCRIBE);
            wireMessage.topics = filter.constructor === Array ? filter : [
                filter
            ];
            if (unsubscribeOptions.onSuccess) wireMessage.callback = function() {
                unsubscribeOptions.onSuccess({
                    invocationContext: unsubscribeOptions.invocationContext
                });
            };
            if (unsubscribeOptions.timeout) wireMessage.timeOut = new Timeout(this, unsubscribeOptions.timeout, unsubscribeOptions.onFailure, [
                {
                    invocationContext: unsubscribeOptions.invocationContext,
                    errorCode: ERROR.UNSUBSCRIBE_TIMEOUT.code,
                    errorMessage: format(ERROR.UNSUBSCRIBE_TIMEOUT)
                }
            ]);
            // All unsubscribes return a SUBACK.
            this._requires_ack(wireMessage);
            this._schedule_message(wireMessage);
        };
        ClientImpl.prototype.send = function(message) {
            this._trace("Client.send", message);
            var wireMessage = new WireMessage(MESSAGE_TYPE.PUBLISH);
            wireMessage.payloadMessage = message;
            if (this.connected) {
                // Mark qos 1 & 2 message as "ACK required"
                // For qos 0 message, invoke onMessageDelivered callback if there is one.
                // Then schedule the message.
                if (message.qos > 0) this._requires_ack(wireMessage);
                else if (this.onMessageDelivered) this._notify_msg_sent[wireMessage] = this.onMessageDelivered(wireMessage.payloadMessage);
                this._schedule_message(wireMessage);
            } else {
                // Currently disconnected, will not schedule this message
                // Check if reconnecting is in progress and disconnected publish is enabled.
                if (this._reconnecting && this.disconnectedPublishing) {
                    // Check the limit which include the "required ACK" messages
                    var messageCount = Object.keys(this._sentMessages).length + this._buffered_msg_queue.length;
                    if (messageCount > this.disconnectedBufferSize) throw new Error(format(ERROR.BUFFER_FULL, [
                        this.disconnectedBufferSize
                    ]));
                    else if (message.qos > 0) // Mark this message as "ACK required"
                    this._requires_ack(wireMessage);
                    else {
                        wireMessage.sequence = ++this._sequence;
                        // Add messages in fifo order to array, by adding to start
                        this._buffered_msg_queue.unshift(wireMessage);
                    }
                } else throw new Error(format(ERROR.INVALID_STATE, [
                    "not connected"
                ]));
            }
        };
        ClientImpl.prototype.disconnect = function() {
            this._trace("Client.disconnect");
            if (this._reconnecting) {
                // disconnect() function is called while reconnect is in progress.
                // Terminate the auto reconnect process.
                this._reconnectTimeout.cancel();
                this._reconnectTimeout = null;
                this._reconnecting = false;
            }
            if (!this.socket) throw new Error(format(ERROR.INVALID_STATE, [
                "not connecting or connected"
            ]));
            var wireMessage = new WireMessage(MESSAGE_TYPE.DISCONNECT);
            // Run the disconnected call back as soon as the message has been sent,
            // in case of a failure later on in the disconnect processing.
            // as a consequence, the _disconected call back may be run several times.
            this._notify_msg_sent[wireMessage] = scope1(this._disconnected, this);
            this._schedule_message(wireMessage);
        };
        ClientImpl.prototype.getTraceLog = function() {
            if (this._traceBuffer !== null) {
                this._trace("Client.getTraceLog", new Date());
                this._trace("Client.getTraceLog in flight messages", this._sentMessages.length);
                for(var key in this._sentMessages)this._trace("_sentMessages ", key, this._sentMessages[key]);
                for(var key in this._receivedMessages)this._trace("_receivedMessages ", key, this._receivedMessages[key]);
                return this._traceBuffer;
            }
        };
        ClientImpl.prototype.startTrace = function() {
            if (this._traceBuffer === null) this._traceBuffer = [];
            this._trace("Client.startTrace", new Date(), version);
        };
        ClientImpl.prototype.stopTrace = function() {
            delete this._traceBuffer;
        };
        ClientImpl.prototype._doConnect = function(wsurl) {
            // When the socket is open, this client will send the CONNECT WireMessage using the saved parameters.
            if (this.connectOptions.useSSL) {
                var uriParts = wsurl.split(":");
                uriParts[0] = "wss";
                wsurl = uriParts.join(":");
            }
            this._wsuri = wsurl;
            this.connected = false;
            if (this.connectOptions.mqttVersion < 4) this.socket = new WebSocket(wsurl, [
                "mqttv3.1"
            ]);
            else this.socket = new WebSocket(wsurl, [
                "mqtt"
            ]);
            this.socket.binaryType = "arraybuffer";
            this.socket.onopen = scope1(this._on_socket_open, this);
            this.socket.onmessage = scope1(this._on_socket_message, this);
            this.socket.onerror = scope1(this._on_socket_error, this);
            this.socket.onclose = scope1(this._on_socket_close, this);
            this.sendPinger = new Pinger(this, this.connectOptions.keepAliveInterval);
            this.receivePinger = new Pinger(this, this.connectOptions.keepAliveInterval);
            if (this._connectTimeout) {
                this._connectTimeout.cancel();
                this._connectTimeout = null;
            }
            this._connectTimeout = new Timeout(this, this.connectOptions.timeout, this._disconnected, [
                ERROR.CONNECT_TIMEOUT.code,
                format(ERROR.CONNECT_TIMEOUT)
            ]);
        };
        // Schedule a new message to be sent over the WebSockets
        // connection. CONNECT messages cause WebSocket connection
        // to be started. All other messages are queued internally
        // until this has happened. When WS connection starts, process
        // all outstanding messages.
        ClientImpl.prototype._schedule_message = function(message) {
            // Add messages in fifo order to array, by adding to start
            this._msg_queue.unshift(message);
            // Process outstanding messages in the queue if we have an  open socket, and have received CONNACK.
            if (this.connected) this._process_queue();
        };
        ClientImpl.prototype.store = function(prefix, wireMessage) {
            var storedMessage = {
                type: wireMessage.type,
                messageIdentifier: wireMessage.messageIdentifier,
                version: 1
            };
            switch(wireMessage.type){
                case MESSAGE_TYPE.PUBLISH:
                    if (wireMessage.pubRecReceived) storedMessage.pubRecReceived = true;
                    // Convert the payload to a hex string.
                    storedMessage.payloadMessage = {
                    };
                    var hex = "";
                    var messageBytes = wireMessage.payloadMessage.payloadBytes;
                    for(var i = 0; i < messageBytes.length; i++)if (messageBytes[i] <= 15) hex = hex + "0" + messageBytes[i].toString(16);
                    else hex = hex + messageBytes[i].toString(16);
                    storedMessage.payloadMessage.payloadHex = hex;
                    storedMessage.payloadMessage.qos = wireMessage.payloadMessage.qos;
                    storedMessage.payloadMessage.destinationName = wireMessage.payloadMessage.destinationName;
                    if (wireMessage.payloadMessage.duplicate) storedMessage.payloadMessage.duplicate = true;
                    if (wireMessage.payloadMessage.retained) storedMessage.payloadMessage.retained = true;
                    // Add a sequence number to sent messages.
                    if (prefix.indexOf("Sent:") === 0) {
                        if (wireMessage.sequence === undefined) wireMessage.sequence = ++this._sequence;
                        storedMessage.sequence = wireMessage.sequence;
                    }
                    break;
                default:
                    throw Error(format(ERROR.INVALID_STORED_DATA, [
                        prefix + this._localKey + wireMessage.messageIdentifier,
                        storedMessage
                    ]));
            }
            localStorage.setItem(prefix + this._localKey + wireMessage.messageIdentifier, JSON.stringify(storedMessage));
        };
        ClientImpl.prototype.restore = function(key) {
            var value = localStorage.getItem(key);
            var storedMessage = JSON.parse(value);
            var wireMessage = new WireMessage(storedMessage.type, storedMessage);
            switch(storedMessage.type){
                case MESSAGE_TYPE.PUBLISH:
                    // Replace the payload message with a Message object.
                    var hex = storedMessage.payloadMessage.payloadHex;
                    var buffer = new ArrayBuffer(hex.length / 2);
                    var byteStream = new Uint8Array(buffer);
                    var i = 0;
                    while(hex.length >= 2){
                        var x = parseInt(hex.substring(0, 2), 16);
                        hex = hex.substring(2, hex.length);
                        byteStream[i++] = x;
                    }
                    var payloadMessage = new Message(byteStream);
                    payloadMessage.qos = storedMessage.payloadMessage.qos;
                    payloadMessage.destinationName = storedMessage.payloadMessage.destinationName;
                    if (storedMessage.payloadMessage.duplicate) payloadMessage.duplicate = true;
                    if (storedMessage.payloadMessage.retained) payloadMessage.retained = true;
                    wireMessage.payloadMessage = payloadMessage;
                    break;
                default:
                    throw Error(format(ERROR.INVALID_STORED_DATA, [
                        key,
                        value
                    ]));
            }
            if (key.indexOf("Sent:" + this._localKey) === 0) {
                wireMessage.payloadMessage.duplicate = true;
                this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
            } else if (key.indexOf("Received:" + this._localKey) === 0) this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
        };
        ClientImpl.prototype._process_queue = function() {
            var message = null;
            // Send all queued messages down socket connection
            while(message = this._msg_queue.pop()){
                this._socket_send(message);
                // Notify listeners that message was successfully sent
                if (this._notify_msg_sent[message]) {
                    this._notify_msg_sent[message]();
                    delete this._notify_msg_sent[message];
                }
            }
        };
        /**
	 * Expect an ACK response for this message. Add message to the set of in progress
	 * messages and set an unused identifier in this message.
	 * @ignore
	 */ ClientImpl.prototype._requires_ack = function(wireMessage) {
            var messageCount = Object.keys(this._sentMessages).length;
            if (messageCount > this.maxMessageIdentifier) throw Error("Too many messages:" + messageCount);
            while(this._sentMessages[this._message_identifier] !== undefined)this._message_identifier++;
            wireMessage.messageIdentifier = this._message_identifier;
            this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
            if (wireMessage.type === MESSAGE_TYPE.PUBLISH) this.store("Sent:", wireMessage);
            if (this._message_identifier === this.maxMessageIdentifier) this._message_identifier = 1;
        };
        /**
	 * Called when the underlying websocket has been opened.
	 * @ignore
	 */ ClientImpl.prototype._on_socket_open = function() {
            // Create the CONNECT message object.
            var wireMessage = new WireMessage(MESSAGE_TYPE.CONNECT, this.connectOptions);
            wireMessage.clientId = this.clientId;
            this._socket_send(wireMessage);
        };
        /**
	 * Called when the underlying websocket has received a complete packet.
	 * @ignore
	 */ ClientImpl.prototype._on_socket_message = function(event) {
            this._trace("Client._on_socket_message", event.data);
            var messages = this._deframeMessages(event.data);
            for(var i = 0; i < messages.length; i += 1)this._handleMessage(messages[i]);
        };
        ClientImpl.prototype._deframeMessages = function(data) {
            var byteArray = new Uint8Array(data);
            var messages = [];
            if (this.receiveBuffer) {
                var newData = new Uint8Array(this.receiveBuffer.length + byteArray.length);
                newData.set(this.receiveBuffer);
                newData.set(byteArray, this.receiveBuffer.length);
                byteArray = newData;
                delete this.receiveBuffer;
            }
            try {
                var offset = 0;
                while(offset < byteArray.length){
                    var result = decodeMessage(byteArray, offset);
                    var wireMessage = result[0];
                    offset = result[1];
                    if (wireMessage !== null) messages.push(wireMessage);
                    else break;
                }
                if (offset < byteArray.length) this.receiveBuffer = byteArray.subarray(offset);
            } catch (error) {
                var errorStack = error.hasOwnProperty("stack") == "undefined" ? error.stack.toString() : "No Error Stack Available";
                this._disconnected(ERROR.INTERNAL_ERROR.code, format(ERROR.INTERNAL_ERROR, [
                    error.message,
                    errorStack
                ]));
                return;
            }
            return messages;
        };
        ClientImpl.prototype._handleMessage = function(wireMessage) {
            this._trace("Client._handleMessage", wireMessage);
            try {
                switch(wireMessage.type){
                    case MESSAGE_TYPE.CONNACK:
                        this._connectTimeout.cancel();
                        if (this._reconnectTimeout) this._reconnectTimeout.cancel();
                        // If we have started using clean session then clear up the local state.
                        if (this.connectOptions.cleanSession) {
                            for(var key in this._sentMessages){
                                var sentMessage = this._sentMessages[key];
                                localStorage.removeItem("Sent:" + this._localKey + sentMessage.messageIdentifier);
                            }
                            this._sentMessages = {
                            };
                            for(var key in this._receivedMessages){
                                var receivedMessage = this._receivedMessages[key];
                                localStorage.removeItem("Received:" + this._localKey + receivedMessage.messageIdentifier);
                            }
                            this._receivedMessages = {
                            };
                        }
                        // Client connected and ready for business.
                        if (wireMessage.returnCode === 0) {
                            this.connected = true;
                            // Jump to the end of the list of uris and stop looking for a good host.
                            if (this.connectOptions.uris) this.hostIndex = this.connectOptions.uris.length;
                        } else {
                            this._disconnected(ERROR.CONNACK_RETURNCODE.code, format(ERROR.CONNACK_RETURNCODE, [
                                wireMessage.returnCode,
                                CONNACK_RC[wireMessage.returnCode]
                            ]));
                            break;
                        }
                        // Resend messages.
                        var sequencedMessages = [];
                        for(var msgId in this._sentMessages)if (this._sentMessages.hasOwnProperty(msgId)) sequencedMessages.push(this._sentMessages[msgId]);
                        // Also schedule qos 0 buffered messages if any
                        if (this._buffered_msg_queue.length > 0) {
                            var msg = null;
                            while(msg = this._buffered_msg_queue.pop()){
                                sequencedMessages.push(msg);
                                if (this.onMessageDelivered) this._notify_msg_sent[msg] = this.onMessageDelivered(msg.payloadMessage);
                            }
                        }
                        // Sort sentMessages into the original sent order.
                        var sequencedMessages = sequencedMessages.sort(function(a, b) {
                            return a.sequence - b.sequence;
                        });
                        for(var i = 0, len = sequencedMessages.length; i < len; i++){
                            var sentMessage = sequencedMessages[i];
                            if (sentMessage.type == MESSAGE_TYPE.PUBLISH && sentMessage.pubRecReceived) {
                                var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, {
                                    messageIdentifier: sentMessage.messageIdentifier
                                });
                                this._schedule_message(pubRelMessage);
                            } else this._schedule_message(sentMessage);
                        }
                        // Execute the connectOptions.onSuccess callback if there is one.
                        // Will also now return if this connection was the result of an automatic
                        // reconnect and which URI was successfully connected to.
                        if (this.connectOptions.onSuccess) this.connectOptions.onSuccess({
                            invocationContext: this.connectOptions.invocationContext
                        });
                        var reconnected = false;
                        if (this._reconnecting) {
                            reconnected = true;
                            this._reconnectInterval = 1;
                            this._reconnecting = false;
                        }
                        // Execute the onConnected callback if there is one.
                        this._connected(reconnected, this._wsuri);
                        // Process all queued messages now that the connection is established.
                        this._process_queue();
                        break;
                    case MESSAGE_TYPE.PUBLISH:
                        this._receivePublish(wireMessage);
                        break;
                    case MESSAGE_TYPE.PUBACK:
                        var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
                        // If this is a re flow of a PUBACK after we have restarted receivedMessage will not exist.
                        if (sentMessage) {
                            delete this._sentMessages[wireMessage.messageIdentifier];
                            localStorage.removeItem("Sent:" + this._localKey + wireMessage.messageIdentifier);
                            if (this.onMessageDelivered) this.onMessageDelivered(sentMessage.payloadMessage);
                        }
                        break;
                    case MESSAGE_TYPE.PUBREC:
                        var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
                        // If this is a re flow of a PUBREC after we have restarted receivedMessage will not exist.
                        if (sentMessage) {
                            sentMessage.pubRecReceived = true;
                            var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, {
                                messageIdentifier: wireMessage.messageIdentifier
                            });
                            this.store("Sent:", sentMessage);
                            this._schedule_message(pubRelMessage);
                        }
                        break;
                    case MESSAGE_TYPE.PUBREL:
                        var receivedMessage = this._receivedMessages[wireMessage.messageIdentifier];
                        localStorage.removeItem("Received:" + this._localKey + wireMessage.messageIdentifier);
                        // If this is a re flow of a PUBREL after we have restarted receivedMessage will not exist.
                        if (receivedMessage) {
                            this._receiveMessage(receivedMessage);
                            delete this._receivedMessages[wireMessage.messageIdentifier];
                        }
                        // Always flow PubComp, we may have previously flowed PubComp but the server lost it and restarted.
                        var pubCompMessage = new WireMessage(MESSAGE_TYPE.PUBCOMP, {
                            messageIdentifier: wireMessage.messageIdentifier
                        });
                        this._schedule_message(pubCompMessage);
                        break;
                    case MESSAGE_TYPE.PUBCOMP:
                        var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
                        delete this._sentMessages[wireMessage.messageIdentifier];
                        localStorage.removeItem("Sent:" + this._localKey + wireMessage.messageIdentifier);
                        if (this.onMessageDelivered) this.onMessageDelivered(sentMessage.payloadMessage);
                        break;
                    case MESSAGE_TYPE.SUBACK:
                        var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
                        if (sentMessage) {
                            if (sentMessage.timeOut) sentMessage.timeOut.cancel();
                            // This will need to be fixed when we add multiple topic support
                            if (wireMessage.returnCode[0] === 128) {
                                if (sentMessage.onFailure) sentMessage.onFailure(wireMessage.returnCode);
                            } else if (sentMessage.onSuccess) sentMessage.onSuccess(wireMessage.returnCode);
                            delete this._sentMessages[wireMessage.messageIdentifier];
                        }
                        break;
                    case MESSAGE_TYPE.UNSUBACK:
                        var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
                        if (sentMessage) {
                            if (sentMessage.timeOut) sentMessage.timeOut.cancel();
                            if (sentMessage.callback) sentMessage.callback();
                            delete this._sentMessages[wireMessage.messageIdentifier];
                        }
                        break;
                    case MESSAGE_TYPE.PINGRESP:
                        /* The sendPinger or receivePinger may have sent a ping, the receivePinger has already been reset. */ this.sendPinger.reset();
                        break;
                    case MESSAGE_TYPE.DISCONNECT:
                        // Clients do not expect to receive disconnect packets.
                        this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code, format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [
                            wireMessage.type
                        ]));
                        break;
                    default:
                        this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code, format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [
                            wireMessage.type
                        ]));
                }
            } catch (error) {
                var errorStack = error.hasOwnProperty("stack") == "undefined" ? error.stack.toString() : "No Error Stack Available";
                this._disconnected(ERROR.INTERNAL_ERROR.code, format(ERROR.INTERNAL_ERROR, [
                    error.message,
                    errorStack
                ]));
                return;
            }
        };
        /** @ignore */ ClientImpl.prototype._on_socket_error = function(error) {
            if (!this._reconnecting) this._disconnected(ERROR.SOCKET_ERROR.code, format(ERROR.SOCKET_ERROR, [
                error.data
            ]));
        };
        /** @ignore */ ClientImpl.prototype._on_socket_close = function() {
            if (!this._reconnecting) this._disconnected(ERROR.SOCKET_CLOSE.code, format(ERROR.SOCKET_CLOSE));
        };
        /** @ignore */ ClientImpl.prototype._socket_send = function(wireMessage) {
            if (wireMessage.type == 1) {
                var wireMessageMasked = this._traceMask(wireMessage, "password");
                this._trace("Client._socket_send", wireMessageMasked);
            } else this._trace("Client._socket_send", wireMessage);
            this.socket.send(wireMessage.encode());
            /* We have proved to the server we are alive. */ this.sendPinger.reset();
        };
        /** @ignore */ ClientImpl.prototype._receivePublish = function(wireMessage) {
            switch(wireMessage.payloadMessage.qos){
                case "undefined":
                case 0:
                    this._receiveMessage(wireMessage);
                    break;
                case 1:
                    var pubAckMessage = new WireMessage(MESSAGE_TYPE.PUBACK, {
                        messageIdentifier: wireMessage.messageIdentifier
                    });
                    this._schedule_message(pubAckMessage);
                    this._receiveMessage(wireMessage);
                    break;
                case 2:
                    this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
                    this.store("Received:", wireMessage);
                    var pubRecMessage = new WireMessage(MESSAGE_TYPE.PUBREC, {
                        messageIdentifier: wireMessage.messageIdentifier
                    });
                    this._schedule_message(pubRecMessage);
                    break;
                default:
                    throw Error("Invaild qos=" + wireMessage.payloadMessage.qos);
            }
        };
        /** @ignore */ ClientImpl.prototype._receiveMessage = function(wireMessage) {
            if (this.onMessageArrived) this.onMessageArrived(wireMessage.payloadMessage);
        };
        /**
	 * Client has connected.
	 * @param {reconnect} [boolean] indicate if this was a result of reconnect operation.
	 * @param {uri} [string] fully qualified WebSocket URI of the server.
	 */ ClientImpl.prototype._connected = function(reconnect, uri) {
            // Execute the onConnected callback if there is one.
            if (this.onConnected) this.onConnected(reconnect, uri);
        };
        /**
	 * Attempts to reconnect the client to the server.
   * For each reconnect attempt, will double the reconnect interval
   * up to 128 seconds.
	 */ ClientImpl.prototype._reconnect = function() {
            this._trace("Client._reconnect");
            if (!this.connected) {
                this._reconnecting = true;
                this.sendPinger.cancel();
                this.receivePinger.cancel();
                if (this._reconnectInterval < 128) this._reconnectInterval = this._reconnectInterval * 2;
                if (this.connectOptions.uris) {
                    this.hostIndex = 0;
                    this._doConnect(this.connectOptions.uris[0]);
                } else this._doConnect(this.uri);
            }
        };
        /**
	 * Client has disconnected either at its own request or because the server
	 * or network disconnected it. Remove all non-durable state.
	 * @param {errorCode} [number] the error number.
	 * @param {errorText} [string] the error text.
	 * @ignore
	 */ ClientImpl.prototype._disconnected = function(errorCode, errorText) {
            this._trace("Client._disconnected", errorCode, errorText);
            if (errorCode !== undefined && this._reconnecting) {
                //Continue automatic reconnect process
                this._reconnectTimeout = new Timeout(this, this._reconnectInterval, this._reconnect);
                return;
            }
            this.sendPinger.cancel();
            this.receivePinger.cancel();
            if (this._connectTimeout) {
                this._connectTimeout.cancel();
                this._connectTimeout = null;
            }
            // Clear message buffers.
            this._msg_queue = [];
            this._buffered_msg_queue = [];
            this._notify_msg_sent = {
            };
            if (this.socket) {
                // Cancel all socket callbacks so that they cannot be driven again by this socket.
                this.socket.onopen = null;
                this.socket.onmessage = null;
                this.socket.onerror = null;
                this.socket.onclose = null;
                if (this.socket.readyState === 1) this.socket.close();
                delete this.socket;
            }
            if (this.connectOptions.uris && this.hostIndex < this.connectOptions.uris.length - 1) {
                // Try the next host.
                this.hostIndex++;
                this._doConnect(this.connectOptions.uris[this.hostIndex]);
            } else {
                if (errorCode === undefined) {
                    errorCode = ERROR.OK.code;
                    errorText = format(ERROR.OK);
                }
                // Run any application callbacks last as they may attempt to reconnect and hence create a new socket.
                if (this.connected) {
                    this.connected = false;
                    // Execute the connectionLostCallback if there is one, and we were connected.
                    if (this.onConnectionLost) this.onConnectionLost({
                        errorCode: errorCode,
                        errorMessage: errorText,
                        reconnect: this.connectOptions.reconnect,
                        uri: this._wsuri
                    });
                    if (errorCode !== ERROR.OK.code && this.connectOptions.reconnect) {
                        // Start automatic reconnect process for the very first time since last successful connect.
                        this._reconnectInterval = 1;
                        this._reconnect();
                        return;
                    }
                } else {
                    // Otherwise we never had a connection, so indicate that the connect has failed.
                    if (this.connectOptions.mqttVersion === 4 && this.connectOptions.mqttVersionExplicit === false) {
                        this._trace("Failed to connect V4, dropping back to V3");
                        this.connectOptions.mqttVersion = 3;
                        if (this.connectOptions.uris) {
                            this.hostIndex = 0;
                            this._doConnect(this.connectOptions.uris[0]);
                        } else this._doConnect(this.uri);
                    } else if (this.connectOptions.onFailure) this.connectOptions.onFailure({
                        invocationContext: this.connectOptions.invocationContext,
                        errorCode: errorCode,
                        errorMessage: errorText
                    });
                }
            }
        };
        /** @ignore */ ClientImpl.prototype._trace = function() {
            // Pass trace message back to client's callback function
            if (this.traceFunction) {
                var args = Array.prototype.slice.call(arguments);
                for(var i in args)if (typeof args[i] !== "undefined") args.splice(i, 1, JSON.stringify(args[i]));
                var record = args.join("");
                this.traceFunction({
                    severity: "Debug",
                    message: record
                });
            }
            //buffer style trace
            if (this._traceBuffer !== null) for(var i = 0, max = arguments.length; i < max; i++){
                if (this._traceBuffer.length == this._MAX_TRACE_ENTRIES) this._traceBuffer.shift();
                if (i === 0) this._traceBuffer.push(arguments[i]);
                else if (typeof arguments[i] === "undefined") this._traceBuffer.push(arguments[i]);
                else this._traceBuffer.push("  " + JSON.stringify(arguments[i]));
            }
        };
        /** @ignore */ ClientImpl.prototype._traceMask = function(traceObject, masked) {
            var traceObjectMasked = {
            };
            for(var attr in traceObject)if (traceObject.hasOwnProperty(attr)) {
                if (attr == masked) traceObjectMasked[attr] = "******";
                else traceObjectMasked[attr] = traceObject[attr];
            }
            return traceObjectMasked;
        };
        // ------------------------------------------------------------------------
        // Public Programming interface.
        // ------------------------------------------------------------------------
        /**
	 * The JavaScript application communicates to the server using a {@link Paho.Client} object.
	 * <p>
	 * Most applications will create just one Client object and then call its connect() method,
	 * however applications can create more than one Client object if they wish.
	 * In this case the combination of host, port and clientId attributes must be different for each Client object.
	 * <p>
	 * The send, subscribe and unsubscribe methods are implemented as asynchronous JavaScript methods
	 * (even though the underlying protocol exchange might be synchronous in nature).
	 * This means they signal their completion by calling back to the application,
	 * via Success or Failure callback functions provided by the application on the method in question.
	 * Such callbacks are called at most once per method invocation and do not persist beyond the lifetime
	 * of the script that made the invocation.
	 * <p>
	 * In contrast there are some callback functions, most notably <i>onMessageArrived</i>,
	 * that are defined on the {@link Paho.Client} object.
	 * These may get called multiple times, and aren't directly related to specific method invocations made by the client.
	 *
	 * @name Paho.Client
	 *
	 * @constructor
	 *
	 * @param {string} host - the address of the messaging server, as a fully qualified WebSocket URI, as a DNS name or dotted decimal IP address.
	 * @param {number} port - the port number to connect to - only required if host is not a URI
	 * @param {string} path - the path on the host to connect to - only used if host is not a URI. Default: '/mqtt'.
	 * @param {string} clientId - the Messaging client identifier, between 1 and 23 characters in length.
	 *
	 * @property {string} host - <i>read only</i> the server's DNS hostname or dotted decimal IP address.
	 * @property {number} port - <i>read only</i> the server's port.
	 * @property {string} path - <i>read only</i> the server's path.
	 * @property {string} clientId - <i>read only</i> used when connecting to the server.
	 * @property {function} onConnectionLost - called when a connection has been lost.
	 *                            after a connect() method has succeeded.
	 *                            Establish the call back used when a connection has been lost. The connection may be
	 *                            lost because the client initiates a disconnect or because the server or network
	 *                            cause the client to be disconnected. The disconnect call back may be called without
	 *                            the connectionComplete call back being invoked if, for example the client fails to
	 *                            connect.
	 *                            A single response object parameter is passed to the onConnectionLost callback containing the following fields:
	 *                            <ol>
	 *                            <li>errorCode
	 *                            <li>errorMessage
	 *                            </ol>
	 * @property {function} onMessageDelivered - called when a message has been delivered.
	 *                            All processing that this Client will ever do has been completed. So, for example,
	 *                            in the case of a Qos=2 message sent by this client, the PubComp flow has been received from the server
	 *                            and the message has been removed from persistent storage before this callback is invoked.
	 *                            Parameters passed to the onMessageDelivered callback are:
	 *                            <ol>
	 *                            <li>{@link Paho.Message} that was delivered.
	 *                            </ol>
	 * @property {function} onMessageArrived - called when a message has arrived in this Paho.client.
	 *                            Parameters passed to the onMessageArrived callback are:
	 *                            <ol>
	 *                            <li>{@link Paho.Message} that has arrived.
	 *                            </ol>
	 * @property {function} onConnected - called when a connection is successfully made to the server.
	 *                                  after a connect() method.
	 *                                  Parameters passed to the onConnected callback are:
	 *                                  <ol>
	 *                                  <li>reconnect (boolean) - If true, the connection was the result of a reconnect.</li>
	 *                                  <li>URI (string) - The URI used to connect to the server.</li>
	 *                                  </ol>
	 * @property {boolean} disconnectedPublishing - if set, will enable disconnected publishing in
	 *                                            in the event that the connection to the server is lost.
	 * @property {number} disconnectedBufferSize - Used to set the maximum number of messages that the disconnected
	 *                                             buffer will hold before rejecting new messages. Default size: 5000 messages
	 * @property {function} trace - called whenever trace is called. TODO
	 */ var Client = function(host1, port1, path, clientId) {
            var uri;
            if (typeof host1 !== "string") throw new Error(format(ERROR.INVALID_TYPE, [
                typeof host1,
                "host"
            ]));
            if (arguments.length == 2) {
                // host: must be full ws:// uri
                // port: clientId
                clientId = port1;
                uri = host1;
                var match = uri.match(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/);
                if (match) {
                    host1 = match[4] || match[2];
                    port1 = parseInt(match[7]);
                    path = match[8];
                } else throw new Error(format(ERROR.INVALID_ARGUMENT, [
                    host1,
                    "host"
                ]));
            } else {
                if (arguments.length == 3) {
                    clientId = path;
                    path = "/mqtt";
                }
                if (typeof port1 !== "number" || port1 < 0) throw new Error(format(ERROR.INVALID_TYPE, [
                    typeof port1,
                    "port"
                ]));
                if (typeof path !== "string") throw new Error(format(ERROR.INVALID_TYPE, [
                    typeof path,
                    "path"
                ]));
                var ipv6AddSBracket = host1.indexOf(":") !== -1 && host1.slice(0, 1) !== "[" && host1.slice(-1) !== "]";
                uri = "ws://" + (ipv6AddSBracket ? "[" + host1 + "]" : host1) + ":" + port1 + path;
            }
            var clientIdLength = 0;
            for(var i1 = 0; i1 < clientId.length; i1++){
                var charCode = clientId.charCodeAt(i1);
                if (55296 <= charCode && charCode <= 56319) i1++; // Surrogate pair.
                clientIdLength++;
            }
            if (typeof clientId !== "string" || clientIdLength > 65535) throw new Error(format(ERROR.INVALID_ARGUMENT, [
                clientId,
                "clientId"
            ]));
            var client = new ClientImpl(uri, host1, port1, path, clientId);
            //Public Properties
            Object.defineProperties(this, {
                "host": {
                    get: function() {
                        return host1;
                    },
                    set: function() {
                        throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
                    }
                },
                "port": {
                    get: function() {
                        return port1;
                    },
                    set: function() {
                        throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
                    }
                },
                "path": {
                    get: function() {
                        return path;
                    },
                    set: function() {
                        throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
                    }
                },
                "uri": {
                    get: function() {
                        return uri;
                    },
                    set: function() {
                        throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
                    }
                },
                "clientId": {
                    get: function() {
                        return client.clientId;
                    },
                    set: function() {
                        throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
                    }
                },
                "onConnected": {
                    get: function() {
                        return client.onConnected;
                    },
                    set: function(newOnConnected) {
                        if (typeof newOnConnected === "function") client.onConnected = newOnConnected;
                        else throw new Error(format(ERROR.INVALID_TYPE, [
                            typeof newOnConnected,
                            "onConnected"
                        ]));
                    }
                },
                "disconnectedPublishing": {
                    get: function() {
                        return client.disconnectedPublishing;
                    },
                    set: function(newDisconnectedPublishing) {
                        client.disconnectedPublishing = newDisconnectedPublishing;
                    }
                },
                "disconnectedBufferSize": {
                    get: function() {
                        return client.disconnectedBufferSize;
                    },
                    set: function(newDisconnectedBufferSize) {
                        client.disconnectedBufferSize = newDisconnectedBufferSize;
                    }
                },
                "onConnectionLost": {
                    get: function() {
                        return client.onConnectionLost;
                    },
                    set: function(newOnConnectionLost) {
                        if (typeof newOnConnectionLost === "function") client.onConnectionLost = newOnConnectionLost;
                        else throw new Error(format(ERROR.INVALID_TYPE, [
                            typeof newOnConnectionLost,
                            "onConnectionLost"
                        ]));
                    }
                },
                "onMessageDelivered": {
                    get: function() {
                        return client.onMessageDelivered;
                    },
                    set: function(newOnMessageDelivered) {
                        if (typeof newOnMessageDelivered === "function") client.onMessageDelivered = newOnMessageDelivered;
                        else throw new Error(format(ERROR.INVALID_TYPE, [
                            typeof newOnMessageDelivered,
                            "onMessageDelivered"
                        ]));
                    }
                },
                "onMessageArrived": {
                    get: function() {
                        return client.onMessageArrived;
                    },
                    set: function(newOnMessageArrived) {
                        if (typeof newOnMessageArrived === "function") client.onMessageArrived = newOnMessageArrived;
                        else throw new Error(format(ERROR.INVALID_TYPE, [
                            typeof newOnMessageArrived,
                            "onMessageArrived"
                        ]));
                    }
                },
                "trace": {
                    get: function() {
                        return client.traceFunction;
                    },
                    set: function(trace) {
                        if (typeof trace === "function") client.traceFunction = trace;
                        else throw new Error(format(ERROR.INVALID_TYPE, [
                            typeof trace,
                            "onTrace"
                        ]));
                    }
                }
            });
            /**
		 * Connect this Messaging client to its server.
		 *
		 * @name Paho.Client#connect
		 * @function
		 * @param {object} connectOptions - Attributes used with the connection.
		 * @param {number} connectOptions.timeout - If the connect has not succeeded within this
		 *                    number of seconds, it is deemed to have failed.
		 *                    The default is 30 seconds.
		 * @param {string} connectOptions.userName - Authentication username for this connection.
		 * @param {string} connectOptions.password - Authentication password for this connection.
		 * @param {Paho.Message} connectOptions.willMessage - sent by the server when the client
		 *                    disconnects abnormally.
		 * @param {number} connectOptions.keepAliveInterval - the server disconnects this client if
		 *                    there is no activity for this number of seconds.
		 *                    The default value of 60 seconds is assumed if not set.
		 * @param {boolean} connectOptions.cleanSession - if true(default) the client and server
		 *                    persistent state is deleted on successful connect.
		 * @param {boolean} connectOptions.useSSL - if present and true, use an SSL Websocket connection.
		 * @param {object} connectOptions.invocationContext - passed to the onSuccess callback or onFailure callback.
		 * @param {function} connectOptions.onSuccess - called when the connect acknowledgement
		 *                    has been received from the server.
		 * A single response object parameter is passed to the onSuccess callback containing the following fields:
		 * <ol>
		 * <li>invocationContext as passed in to the onSuccess method in the connectOptions.
		 * </ol>
	 * @param {function} connectOptions.onFailure - called when the connect request has failed or timed out.
		 * A single response object parameter is passed to the onFailure callback containing the following fields:
		 * <ol>
		 * <li>invocationContext as passed in to the onFailure method in the connectOptions.
		 * <li>errorCode a number indicating the nature of the error.
		 * <li>errorMessage text describing the error.
		 * </ol>
	 * @param {array} connectOptions.hosts - If present this contains either a set of hostnames or fully qualified
		 * WebSocket URIs (ws://iot.eclipse.org:80/ws), that are tried in order in place
		 * of the host and port paramater on the construtor. The hosts are tried one at at time in order until
		 * one of then succeeds.
	 * @param {array} connectOptions.ports - If present the set of ports matching the hosts. If hosts contains URIs, this property
		 * is not used.
	 * @param {boolean} connectOptions.reconnect - Sets whether the client will automatically attempt to reconnect
	 * to the server if the connection is lost.
	 *<ul>
	 *<li>If set to false, the client will not attempt to automatically reconnect to the server in the event that the
	 * connection is lost.</li>
	 *<li>If set to true, in the event that the connection is lost, the client will attempt to reconnect to the server.
	 * It will initially wait 1 second before it attempts to reconnect, for every failed reconnect attempt, the delay
	 * will double until it is at 2 minutes at which point the delay will stay at 2 minutes.</li>
	 *</ul>
	 * @param {number} connectOptions.mqttVersion - The version of MQTT to use to connect to the MQTT Broker.
	 *<ul>
	 *<li>3 - MQTT V3.1</li>
	 *<li>4 - MQTT V3.1.1</li>
	 *</ul>
	 * @param {boolean} connectOptions.mqttVersionExplicit - If set to true, will force the connection to use the
	 * selected MQTT Version or will fail to connect.
	 * @param {array} connectOptions.uris - If present, should contain a list of fully qualified WebSocket uris
	 * (e.g. ws://iot.eclipse.org:80/ws), that are tried in order in place of the host and port parameter of the construtor.
	 * The uris are tried one at a time in order until one of them succeeds. Do not use this in conjunction with hosts as
	 * the hosts array will be converted to uris and will overwrite this property.
		 * @throws {InvalidState} If the client is not in disconnected state. The client must have received connectionLost
		 * or disconnected before calling connect for a second or subsequent time.
		 */ this.connect = function(connectOptions) {
                connectOptions = connectOptions || {
                };
                validate(connectOptions, {
                    timeout: "number",
                    userName: "string",
                    password: "string",
                    willMessage: "object",
                    keepAliveInterval: "number",
                    cleanSession: "boolean",
                    useSSL: "boolean",
                    invocationContext: "object",
                    onSuccess: "function",
                    onFailure: "function",
                    hosts: "object",
                    ports: "object",
                    reconnect: "boolean",
                    mqttVersion: "number",
                    mqttVersionExplicit: "boolean",
                    uris: "object"
                });
                // If no keep alive interval is set, assume 60 seconds.
                if (connectOptions.keepAliveInterval === undefined) connectOptions.keepAliveInterval = 60;
                if (connectOptions.mqttVersion > 4 || connectOptions.mqttVersion < 3) throw new Error(format(ERROR.INVALID_ARGUMENT, [
                    connectOptions.mqttVersion,
                    "connectOptions.mqttVersion"
                ]));
                if (connectOptions.mqttVersion === undefined) {
                    connectOptions.mqttVersionExplicit = false;
                    connectOptions.mqttVersion = 4;
                } else connectOptions.mqttVersionExplicit = true;
                //Check that if password is set, so is username
                if (connectOptions.password !== undefined && connectOptions.userName === undefined) throw new Error(format(ERROR.INVALID_ARGUMENT, [
                    connectOptions.password,
                    "connectOptions.password"
                ]));
                if (connectOptions.willMessage) {
                    if (!(connectOptions.willMessage instanceof Message)) throw new Error(format(ERROR.INVALID_TYPE, [
                        connectOptions.willMessage,
                        "connectOptions.willMessage"
                    ]));
                    // The will message must have a payload that can be represented as a string.
                    // Cause the willMessage to throw an exception if this is not the case.
                    connectOptions.willMessage.stringPayload = null;
                    if (typeof connectOptions.willMessage.destinationName === "undefined") throw new Error(format(ERROR.INVALID_TYPE, [
                        typeof connectOptions.willMessage.destinationName,
                        "connectOptions.willMessage.destinationName"
                    ]));
                }
                if (typeof connectOptions.cleanSession === "undefined") connectOptions.cleanSession = true;
                if (connectOptions.hosts) {
                    if (!(connectOptions.hosts instanceof Array)) throw new Error(format(ERROR.INVALID_ARGUMENT, [
                        connectOptions.hosts,
                        "connectOptions.hosts"
                    ]));
                    if (connectOptions.hosts.length < 1) throw new Error(format(ERROR.INVALID_ARGUMENT, [
                        connectOptions.hosts,
                        "connectOptions.hosts"
                    ]));
                    var usingURIs = false;
                    for(var i = 0; i < connectOptions.hosts.length; i++){
                        if (typeof connectOptions.hosts[i] !== "string") throw new Error(format(ERROR.INVALID_TYPE, [
                            typeof connectOptions.hosts[i],
                            "connectOptions.hosts[" + i + "]"
                        ]));
                        if (/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test(connectOptions.hosts[i])) {
                            if (i === 0) usingURIs = true;
                            else if (!usingURIs) throw new Error(format(ERROR.INVALID_ARGUMENT, [
                                connectOptions.hosts[i],
                                "connectOptions.hosts[" + i + "]"
                            ]));
                        } else if (usingURIs) throw new Error(format(ERROR.INVALID_ARGUMENT, [
                            connectOptions.hosts[i],
                            "connectOptions.hosts[" + i + "]"
                        ]));
                    }
                    if (!usingURIs) {
                        if (!connectOptions.ports) throw new Error(format(ERROR.INVALID_ARGUMENT, [
                            connectOptions.ports,
                            "connectOptions.ports"
                        ]));
                        if (!(connectOptions.ports instanceof Array)) throw new Error(format(ERROR.INVALID_ARGUMENT, [
                            connectOptions.ports,
                            "connectOptions.ports"
                        ]));
                        if (connectOptions.hosts.length !== connectOptions.ports.length) throw new Error(format(ERROR.INVALID_ARGUMENT, [
                            connectOptions.ports,
                            "connectOptions.ports"
                        ]));
                        connectOptions.uris = [];
                        for(var i = 0; i < connectOptions.hosts.length; i++){
                            if (typeof connectOptions.ports[i] !== "number" || connectOptions.ports[i] < 0) throw new Error(format(ERROR.INVALID_TYPE, [
                                typeof connectOptions.ports[i],
                                "connectOptions.ports[" + i + "]"
                            ]));
                            var host = connectOptions.hosts[i];
                            var port = connectOptions.ports[i];
                            var ipv6 = host.indexOf(":") !== -1;
                            uri = "ws://" + (ipv6 ? "[" + host + "]" : host) + ":" + port + path;
                            connectOptions.uris.push(uri);
                        }
                    } else connectOptions.uris = connectOptions.hosts;
                }
                client.connect(connectOptions);
            };
            /**
		 * Subscribe for messages, request receipt of a copy of messages sent to the destinations described by the filter.
		 *
		 * @name Paho.Client#subscribe
		 * @function
		 * @param {string} filter describing the destinations to receive messages from.
		 * <br>
		 * @param {object} subscribeOptions - used to control the subscription
		 *
		 * @param {number} subscribeOptions.qos - the maximum qos of any publications sent
		 *                                  as a result of making this subscription.
		 * @param {object} subscribeOptions.invocationContext - passed to the onSuccess callback
		 *                                  or onFailure callback.
		 * @param {function} subscribeOptions.onSuccess - called when the subscribe acknowledgement
		 *                                  has been received from the server.
		 *                                  A single response object parameter is passed to the onSuccess callback containing the following fields:
		 *                                  <ol>
		 *                                  <li>invocationContext if set in the subscribeOptions.
		 *                                  </ol>
		 * @param {function} subscribeOptions.onFailure - called when the subscribe request has failed or timed out.
		 *                                  A single response object parameter is passed to the onFailure callback containing the following fields:
		 *                                  <ol>
		 *                                  <li>invocationContext - if set in the subscribeOptions.
		 *                                  <li>errorCode - a number indicating the nature of the error.
		 *                                  <li>errorMessage - text describing the error.
		 *                                  </ol>
		 * @param {number} subscribeOptions.timeout - which, if present, determines the number of
		 *                                  seconds after which the onFailure calback is called.
		 *                                  The presence of a timeout does not prevent the onSuccess
		 *                                  callback from being called when the subscribe completes.
		 * @throws {InvalidState} if the client is not in connected state.
		 */ this.subscribe = function(filter, subscribeOptions) {
                if (typeof filter !== "string" && filter.constructor !== Array) throw new Error("Invalid argument:" + filter);
                subscribeOptions = subscribeOptions || {
                };
                validate(subscribeOptions, {
                    qos: "number",
                    invocationContext: "object",
                    onSuccess: "function",
                    onFailure: "function",
                    timeout: "number"
                });
                if (subscribeOptions.timeout && !subscribeOptions.onFailure) throw new Error("subscribeOptions.timeout specified with no onFailure callback.");
                if (typeof subscribeOptions.qos !== "undefined" && !(subscribeOptions.qos === 0 || subscribeOptions.qos === 1 || subscribeOptions.qos === 2)) throw new Error(format(ERROR.INVALID_ARGUMENT, [
                    subscribeOptions.qos,
                    "subscribeOptions.qos"
                ]));
                client.subscribe(filter, subscribeOptions);
            };
            /**
		 * Unsubscribe for messages, stop receiving messages sent to destinations described by the filter.
		 *
		 * @name Paho.Client#unsubscribe
		 * @function
		 * @param {string} filter - describing the destinations to receive messages from.
		 * @param {object} unsubscribeOptions - used to control the subscription
		 * @param {object} unsubscribeOptions.invocationContext - passed to the onSuccess callback
											  or onFailure callback.
		 * @param {function} unsubscribeOptions.onSuccess - called when the unsubscribe acknowledgement has been received from the server.
		 *                                    A single response object parameter is passed to the
		 *                                    onSuccess callback containing the following fields:
		 *                                    <ol>
		 *                                    <li>invocationContext - if set in the unsubscribeOptions.
		 *                                    </ol>
		 * @param {function} unsubscribeOptions.onFailure called when the unsubscribe request has failed or timed out.
		 *                                    A single response object parameter is passed to the onFailure callback containing the following fields:
		 *                                    <ol>
		 *                                    <li>invocationContext - if set in the unsubscribeOptions.
		 *                                    <li>errorCode - a number indicating the nature of the error.
		 *                                    <li>errorMessage - text describing the error.
		 *                                    </ol>
		 * @param {number} unsubscribeOptions.timeout - which, if present, determines the number of seconds
		 *                                    after which the onFailure callback is called. The presence of
		 *                                    a timeout does not prevent the onSuccess callback from being
		 *                                    called when the unsubscribe completes
		 * @throws {InvalidState} if the client is not in connected state.
		 */ this.unsubscribe = function(filter, unsubscribeOptions) {
                if (typeof filter !== "string" && filter.constructor !== Array) throw new Error("Invalid argument:" + filter);
                unsubscribeOptions = unsubscribeOptions || {
                };
                validate(unsubscribeOptions, {
                    invocationContext: "object",
                    onSuccess: "function",
                    onFailure: "function",
                    timeout: "number"
                });
                if (unsubscribeOptions.timeout && !unsubscribeOptions.onFailure) throw new Error("unsubscribeOptions.timeout specified with no onFailure callback.");
                client.unsubscribe(filter, unsubscribeOptions);
            };
            /**
		 * Send a message to the consumers of the destination in the Message.
		 *
		 * @name Paho.Client#send
		 * @function
		 * @param {string|Paho.Message} topic - <b>mandatory</b> The name of the destination to which the message is to be sent.
		 * 					   - If it is the only parameter, used as Paho.Message object.
		 * @param {String|ArrayBuffer} payload - The message data to be sent.
		 * @param {number} qos The Quality of Service used to deliver the message.
		 * 		<dl>
		 * 			<dt>0 Best effort (default).
		 *     			<dt>1 At least once.
		 *     			<dt>2 Exactly once.
		 * 		</dl>
		 * @param {Boolean} retained If true, the message is to be retained by the server and delivered
		 *                     to both current and future subscriptions.
		 *                     If false the server only delivers the message to current subscribers, this is the default for new Messages.
		 *                     A received message has the retained boolean set to true if the message was published
		 *                     with the retained boolean set to true
		 *                     and the subscrption was made after the message has been published.
		 * @throws {InvalidState} if the client is not connected.
		 */ this.send = function(topic, payload, qos, retained) {
                var message;
                if (arguments.length === 0) throw new Error("Invalid argument.length");
                else if (arguments.length == 1) {
                    if (!(topic instanceof Message) && typeof topic !== "string") throw new Error("Invalid argument:" + typeof topic);
                    message = topic;
                    if (typeof message.destinationName === "undefined") throw new Error(format(ERROR.INVALID_ARGUMENT, [
                        message.destinationName,
                        "Message.destinationName"
                    ]));
                    client.send(message);
                } else {
                    //parameter checking in Message object
                    message = new Message(payload);
                    message.destinationName = topic;
                    if (arguments.length >= 3) message.qos = qos;
                    if (arguments.length >= 4) message.retained = retained;
                    client.send(message);
                }
            };
            /**
		 * Publish a message to the consumers of the destination in the Message.
		 * Synonym for Paho.Mqtt.Client#send
		 *
		 * @name Paho.Client#publish
		 * @function
		 * @param {string|Paho.Message} topic - <b>mandatory</b> The name of the topic to which the message is to be published.
		 * 					   - If it is the only parameter, used as Paho.Message object.
		 * @param {String|ArrayBuffer} payload - The message data to be published.
		 * @param {number} qos The Quality of Service used to deliver the message.
		 * 		<dl>
		 * 			<dt>0 Best effort (default).
		 *     			<dt>1 At least once.
		 *     			<dt>2 Exactly once.
		 * 		</dl>
		 * @param {Boolean} retained If true, the message is to be retained by the server and delivered
		 *                     to both current and future subscriptions.
		 *                     If false the server only delivers the message to current subscribers, this is the default for new Messages.
		 *                     A received message has the retained boolean set to true if the message was published
		 *                     with the retained boolean set to true
		 *                     and the subscrption was made after the message has been published.
		 * @throws {InvalidState} if the client is not connected.
		 */ this.publish = function(topic, payload, qos, retained) {
                var message;
                if (arguments.length === 0) throw new Error("Invalid argument.length");
                else if (arguments.length == 1) {
                    if (!(topic instanceof Message) && typeof topic !== "string") throw new Error("Invalid argument:" + typeof topic);
                    message = topic;
                    if (typeof message.destinationName === "undefined") throw new Error(format(ERROR.INVALID_ARGUMENT, [
                        message.destinationName,
                        "Message.destinationName"
                    ]));
                    client.send(message);
                } else {
                    //parameter checking in Message object
                    message = new Message(payload);
                    message.destinationName = topic;
                    if (arguments.length >= 3) message.qos = qos;
                    if (arguments.length >= 4) message.retained = retained;
                    client.send(message);
                }
            };
            /**
		 * Normal disconnect of this Messaging client from its server.
		 *
		 * @name Paho.Client#disconnect
		 * @function
		 * @throws {InvalidState} if the client is already disconnected.
		 */ this.disconnect = function() {
                client.disconnect();
            };
            /**
		 * Get the contents of the trace log.
		 *
		 * @name Paho.Client#getTraceLog
		 * @function
		 * @return {Object[]} tracebuffer containing the time ordered trace records.
		 */ this.getTraceLog = function() {
                return client.getTraceLog();
            };
            /**
		 * Start tracing.
		 *
		 * @name Paho.Client#startTrace
		 * @function
		 */ this.startTrace = function() {
                client.startTrace();
            };
            /**
		 * Stop tracing.
		 *
		 * @name Paho.Client#stopTrace
		 * @function
		 */ this.stopTrace = function() {
                client.stopTrace();
            };
            this.isConnected = function() {
                return client.connected;
            };
        };
        /**
	 * An application message, sent or received.
	 * <p>
	 * All attributes may be null, which implies the default values.
	 *
	 * @name Paho.Message
	 * @constructor
	 * @param {String|ArrayBuffer} payload The message data to be sent.
	 * <p>
	 * @property {string} payloadString <i>read only</i> The payload as a string if the payload consists of valid UTF-8 characters.
	 * @property {ArrayBuffer} payloadBytes <i>read only</i> The payload as an ArrayBuffer.
	 * <p>
	 * @property {string} destinationName <b>mandatory</b> The name of the destination to which the message is to be sent
	 *                    (for messages about to be sent) or the name of the destination from which the message has been received.
	 *                    (for messages received by the onMessage function).
	 * <p>
	 * @property {number} qos The Quality of Service used to deliver the message.
	 * <dl>
	 *     <dt>0 Best effort (default).
	 *     <dt>1 At least once.
	 *     <dt>2 Exactly once.
	 * </dl>
	 * <p>
	 * @property {Boolean} retained If true, the message is to be retained by the server and delivered
	 *                     to both current and future subscriptions.
	 *                     If false the server only delivers the message to current subscribers, this is the default for new Messages.
	 *                     A received message has the retained boolean set to true if the message was published
	 *                     with the retained boolean set to true
	 *                     and the subscrption was made after the message has been published.
	 * <p>
	 * @property {Boolean} duplicate <i>read only</i> If true, this message might be a duplicate of one which has already been received.
	 *                     This is only set on messages received from the server.
	 *
	 */ var Message = function(newPayload) {
            var payload;
            if (typeof newPayload === "string" || newPayload instanceof ArrayBuffer || ArrayBuffer.isView(newPayload) && !(newPayload instanceof DataView)) payload = newPayload;
            else throw format(ERROR.INVALID_ARGUMENT, [
                newPayload,
                "newPayload"
            ]);
            var destinationName;
            var qos = 0;
            var retained = false;
            var duplicate = false;
            Object.defineProperties(this, {
                "payloadString": {
                    enumerable: true,
                    get: function() {
                        if (typeof payload === "string") return payload;
                        else return parseUTF8(payload, 0, payload.length);
                    }
                },
                "payloadBytes": {
                    enumerable: true,
                    get: function() {
                        if (typeof payload === "string") {
                            var buffer = new ArrayBuffer(UTF8Length(payload));
                            var byteStream = new Uint8Array(buffer);
                            stringToUTF8(payload, byteStream, 0);
                            return byteStream;
                        } else return payload;
                    }
                },
                "destinationName": {
                    enumerable: true,
                    get: function() {
                        return destinationName;
                    },
                    set: function(newDestinationName) {
                        if (typeof newDestinationName === "string") destinationName = newDestinationName;
                        else throw new Error(format(ERROR.INVALID_ARGUMENT, [
                            newDestinationName,
                            "newDestinationName"
                        ]));
                    }
                },
                "qos": {
                    enumerable: true,
                    get: function() {
                        return qos;
                    },
                    set: function(newQos) {
                        if (newQos === 0 || newQos === 1 || newQos === 2) qos = newQos;
                        else throw new Error("Invalid argument:" + newQos);
                    }
                },
                "retained": {
                    enumerable: true,
                    get: function() {
                        return retained;
                    },
                    set: function(newRetained) {
                        if (typeof newRetained === "boolean") retained = newRetained;
                        else throw new Error(format(ERROR.INVALID_ARGUMENT, [
                            newRetained,
                            "newRetained"
                        ]));
                    }
                },
                "topic": {
                    enumerable: true,
                    get: function() {
                        return destinationName;
                    },
                    set: function(newTopic) {
                        destinationName = newTopic;
                    }
                },
                "duplicate": {
                    enumerable: true,
                    get: function() {
                        return duplicate;
                    },
                    set: function(newDuplicate) {
                        duplicate = newDuplicate;
                    }
                }
            });
        };
        // Module contents.
        return {
            Client: Client,
            Message: Message
        };
    // eslint-disable-next-line no-nested-ternary
    }(typeof $parcel$global !== "undefined" ? $parcel$global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {
    });
    return PahoMQTT;
});

});

var $7290a84254f9152a$exports = {};
"use strict";
var $7290a84254f9152a$var$removeHash = function removeHash(hex) {
    return hex.charAt(0) === '#' ? hex.slice(1) : hex;
};
var $7290a84254f9152a$var$parseHex = function parseHex(nakedHex) {
    var isShort = nakedHex.length === 3 || nakedHex.length === 4;
    var twoDigitHexR = isShort ? "".concat(nakedHex.slice(0, 1)).concat(nakedHex.slice(0, 1)) : nakedHex.slice(0, 2);
    var twoDigitHexG = isShort ? "".concat(nakedHex.slice(1, 2)).concat(nakedHex.slice(1, 2)) : nakedHex.slice(2, 4);
    var twoDigitHexB = isShort ? "".concat(nakedHex.slice(2, 3)).concat(nakedHex.slice(2, 3)) : nakedHex.slice(4, 6);
    var twoDigitHexA = (isShort ? "".concat(nakedHex.slice(3, 4)).concat(nakedHex.slice(3, 4)) : nakedHex.slice(6, 8)) || 'ff'; // const numericA = +((parseInt(a, 16) / 255).toFixed(2));
    return {
        r: twoDigitHexR,
        g: twoDigitHexG,
        b: twoDigitHexB,
        a: twoDigitHexA
    };
};
var $7290a84254f9152a$var$hexToDecimal = function hexToDecimal(hex) {
    return parseInt(hex, 16);
};
var $7290a84254f9152a$var$hexesToDecimals = function hexesToDecimals(_ref) {
    var r = _ref.r, g = _ref.g, b = _ref.b, a = _ref.a;
    return {
        r: $7290a84254f9152a$var$hexToDecimal(r),
        g: $7290a84254f9152a$var$hexToDecimal(g),
        b: $7290a84254f9152a$var$hexToDecimal(b),
        a: +($7290a84254f9152a$var$hexToDecimal(a) / 255).toFixed(2)
    };
};
var $7290a84254f9152a$var$isNumeric = function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}; // eslint-disable-line no-restricted-globals, max-len
var $7290a84254f9152a$var$formatRgb = function formatRgb(decimalObject, parameterA) {
    var r = decimalObject.r, g = decimalObject.g, b = decimalObject.b, parsedA = decimalObject.a;
    var a = $7290a84254f9152a$var$isNumeric(parameterA) ? parameterA : parsedA;
    return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")");
};
/**
 * Turns an old-fashioned css hex color value into a rgb color value.
 *
 * If you specify an alpha value, you'll get a rgba() value instead.
 *
 * @param The hex value to convert. ('123456'. '#123456', ''123', '#123')
 * @param An alpha value to apply. (optional) ('0.5', '0.25')
 * @return An rgb or rgba value. ('rgb(11, 22, 33)'. 'rgba(11, 22, 33, 0.5)')
 */ var $7290a84254f9152a$var$hexToRgba = function hexToRgba(hex, a) {
    var hashlessHex = $7290a84254f9152a$var$removeHash(hex);
    var hexObject = $7290a84254f9152a$var$parseHex(hashlessHex);
    var decimalObject = $7290a84254f9152a$var$hexesToDecimals(hexObject);
    return $7290a84254f9152a$var$formatRgb(decimalObject, a);
};
$7290a84254f9152a$exports = $7290a84254f9152a$var$hexToRgba;


class $b361dac4ff58c895$export$8f31e4c4a37b8e9c {
    /**
   * Initializes a new instance of the Skeleton class.
   * @param id Skeleton id.
   */ constructor(id){
        this.id = id;
        this.timestamp = Date.now();
        this.body = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        this.leftHand = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        this.rightHand = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
    }
    /**
   * Sets a body.
   * @param body Body rectangle.
   */ setBody(body) {
        this.body = body;
    }
    /**
   * Sets the left hand.
   * @param hand Hand rectangle.
   */ setLeftHand(hand) {
        this.leftHand = hand;
    }
    /**
   * Sets the right hand.
   * @param hand Hand rectangle.
   */ setRightHand(hand) {
        this.rightHand = hand;
    }
    /**
   * Sets the timestamp.
   * @param timestamp Timestamp.
   */ setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }
    /**
   * Gets the body.
   * @returns The body rectangle.
   */ getBody() {
        return this.body;
    }
    /**
   * Gets the left hand.
   * @returns The hand rectangle.
   */ getLeftHand() {
        return this.leftHand;
    }
    /**
   * Gets the right hand.
   * @returns The hand rectangle.
   */ getRightHand() {
        return this.rightHand;
    }
    /**
   * Gets the timestamp.
   * @returns The timestamp.
   */ getTimestamp() {
        return this.timestamp;
    }
}


var $2c73cfb2b22824f7$exports = {};
/*! Tweakpane 3.1.4 (c) 2016 cocopon, licensed under the MIT license. */ (function(global, factory) {
    typeof $2c73cfb2b22824f7$exports === 'object' && "object" !== 'undefined' ? factory($2c73cfb2b22824f7$exports) : typeof define === 'function' && define.amd ? define([
        'exports'
    ], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Tweakpane = {
    }));
})($2c73cfb2b22824f7$exports, function(exports) {
    'use strict';
    /***
     * A simple semantic versioning perser.
     */ class Semver {
        /**
         * @hidden
         */ constructor(text){
            const [core, prerelease] = text.split('-');
            const coreComps = core.split('.');
            this.major = parseInt(coreComps[0], 10);
            this.minor = parseInt(coreComps[1], 10);
            this.patch = parseInt(coreComps[2], 10);
            this.prerelease = prerelease !== null && prerelease !== void 0 ? prerelease : null;
        }
        toString() {
            const core = [
                this.major,
                this.minor,
                this.patch
            ].join('.');
            return this.prerelease !== null ? [
                core,
                this.prerelease
            ].join('-') : core;
        }
    }
    class BladeApi {
        constructor(controller){
            this.controller_ = controller;
        }
        get element() {
            return this.controller_.view.element;
        }
        get disabled() {
            return this.controller_.viewProps.get('disabled');
        }
        set disabled(disabled) {
            this.controller_.viewProps.set('disabled', disabled);
        }
        get hidden() {
            return this.controller_.viewProps.get('hidden');
        }
        set hidden(hidden) {
            this.controller_.viewProps.set('hidden', hidden);
        }
        dispose() {
            this.controller_.viewProps.set('disposed', true);
        }
    }
    class TpEvent {
        constructor(target){
            this.target = target;
        }
    }
    class TpChangeEvent extends TpEvent {
        constructor(target, value, presetKey, last){
            super(target);
            this.value = value;
            this.presetKey = presetKey;
            this.last = last !== null && last !== void 0 ? last : true;
        }
    }
    class TpUpdateEvent extends TpEvent {
        constructor(target, value, presetKey){
            super(target);
            this.value = value;
            this.presetKey = presetKey;
        }
    }
    class TpFoldEvent extends TpEvent {
        constructor(target, expanded){
            super(target);
            this.expanded = expanded;
        }
    }
    class TpTabSelectEvent extends TpEvent {
        constructor(target, index){
            super(target);
            this.index = index;
        }
    }
    function forceCast(v) {
        return v;
    }
    function isEmpty(value) {
        return value === null || value === undefined;
    }
    function deepEqualsArray(a1, a2) {
        if (a1.length !== a2.length) return false;
        for(let i = 0; i < a1.length; i++){
            if (a1[i] !== a2[i]) return false;
        }
        return true;
    }
    function isPropertyWritable(obj, key) {
        let target = obj;
        do {
            const d = Object.getOwnPropertyDescriptor(target, key);
            if (d && (d.set !== undefined || d.writable === true)) return true;
            target = Object.getPrototypeOf(target);
        }while (target !== null)
        return false;
    }
    const CREATE_MESSAGE_MAP = {
        alreadydisposed: ()=>'View has been already disposed'
        ,
        invalidparams: (context)=>`Invalid parameters for '${context.name}'`
        ,
        nomatchingcontroller: (context)=>`No matching controller for '${context.key}'`
        ,
        nomatchingview: (context)=>`No matching view for '${JSON.stringify(context.params)}'`
        ,
        notbindable: ()=>`Value is not bindable`
        ,
        propertynotfound: (context)=>`Property '${context.name}' not found`
        ,
        shouldneverhappen: ()=>'This error should never happen'
    };
    class TpError {
        constructor(config){
            var _a;
            this.message = (_a = CREATE_MESSAGE_MAP[config.type](forceCast(config.context))) !== null && _a !== void 0 ? _a : 'Unexpected error';
            this.name = this.constructor.name;
            this.stack = new Error(this.message).stack;
            this.type = config.type;
        }
        static alreadyDisposed() {
            return new TpError({
                type: 'alreadydisposed'
            });
        }
        static notBindable() {
            return new TpError({
                type: 'notbindable'
            });
        }
        static propertyNotFound(name) {
            return new TpError({
                type: 'propertynotfound',
                context: {
                    name: name
                }
            });
        }
        static shouldNeverHappen() {
            return new TpError({
                type: 'shouldneverhappen'
            });
        }
    }
    class BindingTarget {
        constructor(obj, key, opt_id){
            this.obj_ = obj;
            this.key_ = key;
            this.presetKey_ = opt_id !== null && opt_id !== void 0 ? opt_id : key;
        }
        static isBindable(obj) {
            if (obj === null) return false;
            if (typeof obj !== 'object') return false;
            return true;
        }
        get key() {
            return this.key_;
        }
        get presetKey() {
            return this.presetKey_;
        }
        read() {
            return this.obj_[this.key_];
        }
        write(value) {
            this.obj_[this.key_] = value;
        }
        writeProperty(name, value) {
            const valueObj = this.read();
            if (!BindingTarget.isBindable(valueObj)) throw TpError.notBindable();
            if (!(name in valueObj)) throw TpError.propertyNotFound(name);
            valueObj[name] = value;
        }
    }
    class ButtonApi extends BladeApi {
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        get title() {
            var _a;
            return (_a = this.controller_.valueController.props.get('title')) !== null && _a !== void 0 ? _a : '';
        }
        set title(title) {
            this.controller_.valueController.props.set('title', title);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            const emitter = this.controller_.valueController.emitter;
            emitter.on(eventName, ()=>{
                bh(new TpEvent(this));
            });
            return this;
        }
    }
    class Emitter {
        constructor(){
            this.observers_ = {
            };
        }
        on(eventName, handler) {
            let observers = this.observers_[eventName];
            if (!observers) observers = this.observers_[eventName] = [];
            observers.push({
                handler: handler
            });
            return this;
        }
        off(eventName, handler) {
            const observers = this.observers_[eventName];
            if (observers) this.observers_[eventName] = observers.filter((observer)=>{
                return observer.handler !== handler;
            });
            return this;
        }
        emit(eventName, event) {
            const observers = this.observers_[eventName];
            if (!observers) return;
            observers.forEach((observer)=>{
                observer.handler(event);
            });
        }
    }
    const PREFIX = 'tp';
    function ClassName(viewName) {
        const fn = (opt_elementName, opt_modifier)=>{
            return [
                PREFIX,
                '-',
                viewName,
                'v',
                opt_elementName ? `_${opt_elementName}` : '',
                opt_modifier ? `-${opt_modifier}` : '', 
            ].join('');
        };
        return fn;
    }
    function compose(h1, h2) {
        return (input)=>h2(h1(input))
        ;
    }
    function extractValue(ev) {
        return ev.rawValue;
    }
    function bindValue(value, applyValue) {
        value.emitter.on('change', compose(extractValue, applyValue));
        applyValue(value.rawValue);
    }
    function bindValueMap(valueMap, key, applyValue) {
        bindValue(valueMap.value(key), applyValue);
    }
    function applyClass(elem, className, active) {
        if (active) elem.classList.add(className);
        else elem.classList.remove(className);
    }
    function valueToClassName(elem, className) {
        return (value)=>{
            applyClass(elem, className, value);
        };
    }
    function bindValueToTextContent(value, elem) {
        bindValue(value, (text)=>{
            elem.textContent = text !== null && text !== void 0 ? text : '';
        });
    }
    const className$q = ClassName('btn');
    class ButtonView {
        constructor(doc, config){
            this.element = doc.createElement('div');
            this.element.classList.add(className$q());
            config.viewProps.bindClassModifiers(this.element);
            const buttonElem = doc.createElement('button');
            buttonElem.classList.add(className$q('b'));
            config.viewProps.bindDisabled(buttonElem);
            this.element.appendChild(buttonElem);
            this.buttonElement = buttonElem;
            const titleElem = doc.createElement('div');
            titleElem.classList.add(className$q('t'));
            bindValueToTextContent(config.props.value('title'), titleElem);
            this.buttonElement.appendChild(titleElem);
        }
    }
    class ButtonController {
        constructor(doc, config){
            this.emitter = new Emitter();
            this.onClick_ = this.onClick_.bind(this);
            this.props = config.props;
            this.viewProps = config.viewProps;
            this.view = new ButtonView(doc, {
                props: this.props,
                viewProps: this.viewProps
            });
            this.view.buttonElement.addEventListener('click', this.onClick_);
        }
        onClick_() {
            this.emitter.emit('click', {
                sender: this
            });
        }
    }
    class BoundValue {
        constructor(initialValue, config){
            var _a;
            this.constraint_ = config === null || config === void 0 ? void 0 : config.constraint;
            this.equals_ = (_a = config === null || config === void 0 ? void 0 : config.equals) !== null && _a !== void 0 ? _a : (v1, v2)=>v1 === v2
            ;
            this.emitter = new Emitter();
            this.rawValue_ = initialValue;
        }
        get constraint() {
            return this.constraint_;
        }
        get rawValue() {
            return this.rawValue_;
        }
        set rawValue(rawValue) {
            this.setRawValue(rawValue, {
                forceEmit: false,
                last: true
            });
        }
        setRawValue(rawValue, options) {
            const opts = options !== null && options !== void 0 ? options : {
                forceEmit: false,
                last: true
            };
            const constrainedValue = this.constraint_ ? this.constraint_.constrain(rawValue) : rawValue;
            const prevValue = this.rawValue_;
            const changed = !this.equals_(prevValue, constrainedValue);
            if (!changed && !opts.forceEmit) return;
            this.emitter.emit('beforechange', {
                sender: this
            });
            this.rawValue_ = constrainedValue;
            this.emitter.emit('change', {
                options: opts,
                previousRawValue: prevValue,
                rawValue: constrainedValue,
                sender: this
            });
        }
    }
    class PrimitiveValue {
        constructor(initialValue){
            this.emitter = new Emitter();
            this.value_ = initialValue;
        }
        get rawValue() {
            return this.value_;
        }
        set rawValue(value) {
            this.setRawValue(value, {
                forceEmit: false,
                last: true
            });
        }
        setRawValue(value, options) {
            const opts = options !== null && options !== void 0 ? options : {
                forceEmit: false,
                last: true
            };
            const prevValue = this.value_;
            if (prevValue === value && !opts.forceEmit) return;
            this.emitter.emit('beforechange', {
                sender: this
            });
            this.value_ = value;
            this.emitter.emit('change', {
                options: opts,
                previousRawValue: prevValue,
                rawValue: this.value_,
                sender: this
            });
        }
    }
    function createValue(initialValue, config) {
        const constraint = config === null || config === void 0 ? void 0 : config.constraint;
        const equals = config === null || config === void 0 ? void 0 : config.equals;
        if (!constraint && !equals) return new PrimitiveValue(initialValue);
        return new BoundValue(initialValue, config);
    }
    class ValueMap {
        constructor(valueMap){
            this.emitter = new Emitter();
            this.valMap_ = valueMap;
            for(const key in this.valMap_){
                const v = this.valMap_[key];
                v.emitter.on('change', ()=>{
                    this.emitter.emit('change', {
                        key: key,
                        sender: this
                    });
                });
            }
        }
        static createCore(initialValue) {
            const keys = Object.keys(initialValue);
            return keys.reduce((o, key)=>{
                return Object.assign(o, {
                    [key]: createValue(initialValue[key])
                });
            }, {
            });
        }
        static fromObject(initialValue) {
            const core = this.createCore(initialValue);
            return new ValueMap(core);
        }
        get(key) {
            return this.valMap_[key].rawValue;
        }
        set(key, value) {
            this.valMap_[key].rawValue = value;
        }
        value(key) {
            return this.valMap_[key];
        }
    }
    function parseObject(value, keyToParserMap) {
        const keys = Object.keys(keyToParserMap);
        const result1 = keys.reduce((tmp, key)=>{
            if (tmp === undefined) return undefined;
            const parser = keyToParserMap[key];
            const result = parser(value[key]);
            return result.succeeded ? Object.assign(Object.assign({
            }, tmp), {
                [key]: result.value
            }) : undefined;
        }, {
        });
        return forceCast(result1);
    }
    function parseArray(value, parseItem) {
        return value.reduce((tmp, item)=>{
            if (tmp === undefined) return undefined;
            const result = parseItem(item);
            if (!result.succeeded || result.value === undefined) return undefined;
            return [
                ...tmp,
                result.value
            ];
        }, []);
    }
    function isObject(value) {
        if (value === null) return false;
        return typeof value === 'object';
    }
    function createParamsParserBuilder(parse) {
        return (optional)=>(v)=>{
                if (!optional && v === undefined) return {
                    succeeded: false,
                    value: undefined
                };
                if (optional && v === undefined) return {
                    succeeded: true,
                    value: undefined
                };
                const result = parse(v);
                return result !== undefined ? {
                    succeeded: true,
                    value: result
                } : {
                    succeeded: false,
                    value: undefined
                };
            }
        ;
    }
    function createParamsParserBuilders(optional) {
        return {
            custom: (parse)=>createParamsParserBuilder(parse)(optional)
            ,
            boolean: createParamsParserBuilder((v)=>typeof v === 'boolean' ? v : undefined
            )(optional),
            number: createParamsParserBuilder((v)=>typeof v === 'number' ? v : undefined
            )(optional),
            string: createParamsParserBuilder((v)=>typeof v === 'string' ? v : undefined
            )(optional),
            function: createParamsParserBuilder((v)=>typeof v === 'function' ? v : undefined
            )(optional),
            constant: (value)=>createParamsParserBuilder((v)=>v === value ? value : undefined
                )(optional)
            ,
            raw: createParamsParserBuilder((v)=>v
            )(optional),
            object: (keyToParserMap)=>createParamsParserBuilder((v)=>{
                    if (!isObject(v)) return undefined;
                    return parseObject(v, keyToParserMap);
                })(optional)
            ,
            array: (itemParser)=>createParamsParserBuilder((v)=>{
                    if (!Array.isArray(v)) return undefined;
                    return parseArray(v, itemParser);
                })(optional)
        };
    }
    const ParamsParsers = {
        optional: createParamsParserBuilders(true),
        required: createParamsParserBuilders(false)
    };
    function parseParams(value, keyToParserMap) {
        const result = ParamsParsers.required.object(keyToParserMap)(value);
        return result.succeeded ? result.value : undefined;
    }
    function warnMissing(info) {
        console.warn([
            `Missing '${info.key}' of ${info.target} in ${info.place}.`,
            'Please rebuild plugins with the latest core package.', 
        ].join(' '));
    }
    function disposeElement(elem) {
        if (elem && elem.parentElement) elem.parentElement.removeChild(elem);
        return null;
    }
    class ReadonlyValue {
        constructor(value){
            this.value_ = value;
        }
        static create(value) {
            return [
                new ReadonlyValue(value),
                (rawValue, options)=>{
                    value.setRawValue(rawValue, options);
                }, 
            ];
        }
        get emitter() {
            return this.value_.emitter;
        }
        get rawValue() {
            return this.value_.rawValue;
        }
    }
    const className$p = ClassName('');
    function valueToModifier(elem, modifier) {
        return valueToClassName(elem, className$p(undefined, modifier));
    }
    class ViewProps extends ValueMap {
        constructor(valueMap){
            var _a;
            super(valueMap);
            this.onDisabledChange_ = this.onDisabledChange_.bind(this);
            this.onParentChange_ = this.onParentChange_.bind(this);
            this.onParentGlobalDisabledChange_ = this.onParentGlobalDisabledChange_.bind(this);
            [this.globalDisabled_, this.setGlobalDisabled_] = ReadonlyValue.create(createValue(this.getGlobalDisabled_()));
            this.value('disabled').emitter.on('change', this.onDisabledChange_);
            this.value('parent').emitter.on('change', this.onParentChange_);
            (_a = this.get('parent')) === null || _a === void 0 || _a.globalDisabled.emitter.on('change', this.onParentGlobalDisabledChange_);
        }
        static create(opt_initialValue) {
            var _a, _b, _c;
            const initialValue = opt_initialValue !== null && opt_initialValue !== void 0 ? opt_initialValue : {
            };
            return new ViewProps(ValueMap.createCore({
                disabled: (_a = initialValue.disabled) !== null && _a !== void 0 ? _a : false,
                disposed: false,
                hidden: (_b = initialValue.hidden) !== null && _b !== void 0 ? _b : false,
                parent: (_c = initialValue.parent) !== null && _c !== void 0 ? _c : null
            }));
        }
        get globalDisabled() {
            return this.globalDisabled_;
        }
        bindClassModifiers(elem) {
            bindValue(this.globalDisabled_, valueToModifier(elem, 'disabled'));
            bindValueMap(this, 'hidden', valueToModifier(elem, 'hidden'));
        }
        bindDisabled(target) {
            bindValue(this.globalDisabled_, (disabled)=>{
                target.disabled = disabled;
            });
        }
        bindTabIndex(elem) {
            bindValue(this.globalDisabled_, (disabled)=>{
                elem.tabIndex = disabled ? -1 : 0;
            });
        }
        handleDispose(callback) {
            this.value('disposed').emitter.on('change', (disposed)=>{
                if (disposed) callback();
            });
        }
        getGlobalDisabled_() {
            const parent = this.get('parent');
            const parentDisabled = parent ? parent.globalDisabled.rawValue : false;
            return parentDisabled || this.get('disabled');
        }
        updateGlobalDisabled_() {
            this.setGlobalDisabled_(this.getGlobalDisabled_());
        }
        onDisabledChange_() {
            this.updateGlobalDisabled_();
        }
        onParentGlobalDisabledChange_() {
            this.updateGlobalDisabled_();
        }
        onParentChange_(ev) {
            var _a;
            const prevParent = ev.previousRawValue;
            prevParent === null || prevParent === void 0 || prevParent.globalDisabled.emitter.off('change', this.onParentGlobalDisabledChange_);
            (_a = this.get('parent')) === null || _a === void 0 || _a.globalDisabled.emitter.on('change', this.onParentGlobalDisabledChange_);
            this.updateGlobalDisabled_();
        }
    }
    function getAllBladePositions() {
        return [
            'veryfirst',
            'first',
            'last',
            'verylast'
        ];
    }
    const className$o = ClassName('');
    const POS_TO_CLASS_NAME_MAP = {
        veryfirst: 'vfst',
        first: 'fst',
        last: 'lst',
        verylast: 'vlst'
    };
    class BladeController {
        constructor(config){
            this.parent_ = null;
            this.blade = config.blade;
            this.view = config.view;
            this.viewProps = config.viewProps;
            const elem = this.view.element;
            this.blade.value('positions').emitter.on('change', ()=>{
                getAllBladePositions().forEach((pos)=>{
                    elem.classList.remove(className$o(undefined, POS_TO_CLASS_NAME_MAP[pos]));
                });
                this.blade.get('positions').forEach((pos)=>{
                    elem.classList.add(className$o(undefined, POS_TO_CLASS_NAME_MAP[pos]));
                });
            });
            this.viewProps.handleDispose(()=>{
                disposeElement(elem);
            });
        }
        get parent() {
            return this.parent_;
        }
        set parent(parent) {
            this.parent_ = parent;
            if (!('parent' in this.viewProps.valMap_)) {
                warnMissing({
                    key: 'parent',
                    target: ViewProps.name,
                    place: 'BladeController.parent'
                });
                return;
            }
            this.viewProps.set('parent', this.parent_ ? this.parent_.viewProps : null);
        }
    }
    const SVG_NS = 'http://www.w3.org/2000/svg';
    function forceReflow(element) {
        element.offsetHeight;
    }
    function disableTransitionTemporarily(element, callback) {
        const t = element.style.transition;
        element.style.transition = 'none';
        callback();
        element.style.transition = t;
    }
    function supportsTouch(doc) {
        return doc.ontouchstart !== undefined;
    }
    function getGlobalObject() {
        return globalThis;
    }
    function getWindowDocument() {
        const globalObj = forceCast(getGlobalObject());
        return globalObj.document;
    }
    function getCanvasContext(canvasElement) {
        const win = canvasElement.ownerDocument.defaultView;
        if (!win) return null;
        const isBrowser = 'document' in win;
        return isBrowser ? canvasElement.getContext('2d', {
            willReadFrequently: true
        }) : null;
    }
    const ICON_ID_TO_INNER_HTML_MAP = {
        check: '<path d="M2 8l4 4l8 -8"/>',
        dropdown: '<path d="M5 7h6l-3 3 z"/>',
        p2dpad: '<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>'
    };
    function createSvgIconElement(document, iconId) {
        const elem = document.createElementNS(SVG_NS, 'svg');
        elem.innerHTML = ICON_ID_TO_INNER_HTML_MAP[iconId];
        return elem;
    }
    function insertElementAt(parentElement, element, index) {
        parentElement.insertBefore(element, parentElement.children[index]);
    }
    function removeElement(element) {
        if (element.parentElement) element.parentElement.removeChild(element);
    }
    function removeChildElements(element) {
        while(element.children.length > 0)element.removeChild(element.children[0]);
    }
    function removeChildNodes(element) {
        while(element.childNodes.length > 0)element.removeChild(element.childNodes[0]);
    }
    function findNextTarget(ev) {
        if (ev.relatedTarget) return forceCast(ev.relatedTarget);
        if ('explicitOriginalTarget' in ev) return ev.explicitOriginalTarget;
        return null;
    }
    const className$n = ClassName('lbl');
    function createLabelNode(doc, label) {
        const frag = doc.createDocumentFragment();
        const lineNodes = label.split('\n').map((line)=>{
            return doc.createTextNode(line);
        });
        lineNodes.forEach((lineNode, index)=>{
            if (index > 0) frag.appendChild(doc.createElement('br'));
            frag.appendChild(lineNode);
        });
        return frag;
    }
    class LabelView {
        constructor(doc, config){
            this.element = doc.createElement('div');
            this.element.classList.add(className$n());
            config.viewProps.bindClassModifiers(this.element);
            const labelElem = doc.createElement('div');
            labelElem.classList.add(className$n('l'));
            bindValueMap(config.props, 'label', (value)=>{
                if (isEmpty(value)) this.element.classList.add(className$n(undefined, 'nol'));
                else {
                    this.element.classList.remove(className$n(undefined, 'nol'));
                    removeChildNodes(labelElem);
                    labelElem.appendChild(createLabelNode(doc, value));
                }
            });
            this.element.appendChild(labelElem);
            this.labelElement = labelElem;
            const valueElem = doc.createElement('div');
            valueElem.classList.add(className$n('v'));
            this.element.appendChild(valueElem);
            this.valueElement = valueElem;
        }
    }
    class LabelController extends BladeController {
        constructor(doc, config){
            const viewProps = config.valueController.viewProps;
            super(Object.assign(Object.assign({
            }, config), {
                view: new LabelView(doc, {
                    props: config.props,
                    viewProps: viewProps
                }),
                viewProps: viewProps
            }));
            this.props = config.props;
            this.valueController = config.valueController;
            this.view.valueElement.appendChild(this.valueController.view.element);
        }
    }
    const ButtonBladePlugin = {
        id: 'button',
        type: 'blade',
        accept (params) {
            const p = ParamsParsers;
            const result = parseParams(params, {
                title: p.required.string,
                view: p.required.constant('button'),
                label: p.optional.string
            });
            return result ? {
                params: result
            } : null;
        },
        controller (args) {
            return new LabelController(args.document, {
                blade: args.blade,
                props: ValueMap.fromObject({
                    label: args.params.label
                }),
                valueController: new ButtonController(args.document, {
                    props: ValueMap.fromObject({
                        title: args.params.title
                    }),
                    viewProps: args.viewProps
                })
            });
        },
        api (args) {
            if (!(args.controller instanceof LabelController)) return null;
            if (!(args.controller.valueController instanceof ButtonController)) return null;
            return new ButtonApi(args.controller);
        }
    };
    class ValueBladeController extends BladeController {
        constructor(config){
            super(config);
            this.value = config.value;
        }
    }
    function createBlade() {
        return new ValueMap({
            positions: createValue([], {
                equals: deepEqualsArray
            })
        });
    }
    class Foldable extends ValueMap {
        constructor(valueMap){
            super(valueMap);
        }
        static create(expanded) {
            const coreObj = {
                completed: true,
                expanded: expanded,
                expandedHeight: null,
                shouldFixHeight: false,
                temporaryExpanded: null
            };
            const core = ValueMap.createCore(coreObj);
            return new Foldable(core);
        }
        get styleExpanded() {
            var _a;
            return (_a = this.get('temporaryExpanded')) !== null && _a !== void 0 ? _a : this.get('expanded');
        }
        get styleHeight() {
            if (!this.styleExpanded) return '0';
            const exHeight = this.get('expandedHeight');
            if (this.get('shouldFixHeight') && !isEmpty(exHeight)) return `${exHeight}px`;
            return 'auto';
        }
        bindExpandedClass(elem, expandedClassName) {
            const onExpand = ()=>{
                const expanded = this.styleExpanded;
                if (expanded) elem.classList.add(expandedClassName);
                else elem.classList.remove(expandedClassName);
            };
            bindValueMap(this, 'expanded', onExpand);
            bindValueMap(this, 'temporaryExpanded', onExpand);
        }
        cleanUpTransition() {
            this.set('shouldFixHeight', false);
            this.set('expandedHeight', null);
            this.set('completed', true);
        }
    }
    function computeExpandedFolderHeight(folder, containerElement) {
        let height = 0;
        disableTransitionTemporarily(containerElement, ()=>{
            folder.set('expandedHeight', null);
            folder.set('temporaryExpanded', true);
            forceReflow(containerElement);
            height = containerElement.clientHeight;
            folder.set('temporaryExpanded', null);
            forceReflow(containerElement);
        });
        return height;
    }
    function applyHeight(foldable, elem) {
        elem.style.height = foldable.styleHeight;
    }
    function bindFoldable(foldable, elem) {
        foldable.value('expanded').emitter.on('beforechange', ()=>{
            foldable.set('completed', false);
            if (isEmpty(foldable.get('expandedHeight'))) foldable.set('expandedHeight', computeExpandedFolderHeight(foldable, elem));
            foldable.set('shouldFixHeight', true);
            forceReflow(elem);
        });
        foldable.emitter.on('change', ()=>{
            applyHeight(foldable, elem);
        });
        applyHeight(foldable, elem);
        elem.addEventListener('transitionend', (ev)=>{
            if (ev.propertyName !== 'height') return;
            foldable.cleanUpTransition();
        });
    }
    class RackLikeApi extends BladeApi {
        constructor(controller, rackApi){
            super(controller);
            this.rackApi_ = rackApi;
        }
    }
    function addButtonAsBlade(api, params) {
        return api.addBlade(Object.assign(Object.assign({
        }, params), {
            view: 'button'
        }));
    }
    function addFolderAsBlade(api, params) {
        return api.addBlade(Object.assign(Object.assign({
        }, params), {
            view: 'folder'
        }));
    }
    function addSeparatorAsBlade(api, opt_params) {
        const params = opt_params !== null && opt_params !== void 0 ? opt_params : {
        };
        return api.addBlade(Object.assign(Object.assign({
        }, params), {
            view: 'separator'
        }));
    }
    function addTabAsBlade(api, params) {
        return api.addBlade(Object.assign(Object.assign({
        }, params), {
            view: 'tab'
        }));
    }
    class NestedOrderedSet {
        constructor(extract){
            this.emitter = new Emitter();
            this.items_ = [];
            this.cache_ = new Set();
            this.onSubListAdd_ = this.onSubListAdd_.bind(this);
            this.onSubListRemove_ = this.onSubListRemove_.bind(this);
            this.extract_ = extract;
        }
        get items() {
            return this.items_;
        }
        allItems() {
            return Array.from(this.cache_);
        }
        find(callback) {
            for (const item of this.allItems()){
                if (callback(item)) return item;
            }
            return null;
        }
        includes(item) {
            return this.cache_.has(item);
        }
        add(item1, opt_index) {
            if (this.includes(item1)) throw TpError.shouldNeverHappen();
            const index = opt_index !== undefined ? opt_index : this.items_.length;
            this.items_.splice(index, 0, item1);
            this.cache_.add(item1);
            const subList = this.extract_(item1);
            if (subList) {
                subList.emitter.on('add', this.onSubListAdd_);
                subList.emitter.on('remove', this.onSubListRemove_);
                subList.allItems().forEach((item)=>{
                    this.cache_.add(item);
                });
            }
            this.emitter.emit('add', {
                index: index,
                item: item1,
                root: this,
                target: this
            });
        }
        remove(item) {
            const index = this.items_.indexOf(item);
            if (index < 0) return;
            this.items_.splice(index, 1);
            this.cache_.delete(item);
            const subList = this.extract_(item);
            if (subList) {
                subList.emitter.off('add', this.onSubListAdd_);
                subList.emitter.off('remove', this.onSubListRemove_);
            }
            this.emitter.emit('remove', {
                index: index,
                item: item,
                root: this,
                target: this
            });
        }
        onSubListAdd_(ev) {
            this.cache_.add(ev.item);
            this.emitter.emit('add', {
                index: ev.index,
                item: ev.item,
                root: this,
                target: ev.target
            });
        }
        onSubListRemove_(ev) {
            this.cache_.delete(ev.item);
            this.emitter.emit('remove', {
                index: ev.index,
                item: ev.item,
                root: this,
                target: ev.target
            });
        }
    }
    class InputBindingApi extends BladeApi {
        constructor(controller){
            super(controller);
            this.onBindingChange_ = this.onBindingChange_.bind(this);
            this.emitter_ = new Emitter();
            this.controller_.binding.emitter.on('change', this.onBindingChange_);
        }
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev)=>{
                bh(ev.event);
            });
            return this;
        }
        refresh() {
            this.controller_.binding.read();
        }
        onBindingChange_(ev) {
            const value = ev.sender.target.read();
            this.emitter_.emit('change', {
                event: new TpChangeEvent(this, forceCast(value), this.controller_.binding.target.presetKey, ev.options.last)
            });
        }
    }
    class InputBindingController extends LabelController {
        constructor(doc, config){
            super(doc, config);
            this.binding = config.binding;
        }
    }
    class MonitorBindingApi extends BladeApi {
        constructor(controller){
            super(controller);
            this.onBindingUpdate_ = this.onBindingUpdate_.bind(this);
            this.emitter_ = new Emitter();
            this.controller_.binding.emitter.on('update', this.onBindingUpdate_);
        }
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev)=>{
                bh(ev.event);
            });
            return this;
        }
        refresh() {
            this.controller_.binding.read();
        }
        onBindingUpdate_(ev) {
            const value = ev.sender.target.read();
            this.emitter_.emit('update', {
                event: new TpUpdateEvent(this, forceCast(value), this.controller_.binding.target.presetKey)
            });
        }
    }
    class MonitorBindingController extends LabelController {
        constructor(doc, config){
            super(doc, config);
            this.binding = config.binding;
            this.viewProps.bindDisabled(this.binding.ticker);
            this.viewProps.handleDispose(()=>{
                this.binding.dispose();
            });
        }
    }
    function findSubBladeApiSet(api) {
        if (api instanceof RackApi) return api['apiSet_'];
        if (api instanceof RackLikeApi) return api['rackApi_']['apiSet_'];
        return null;
    }
    function getApiByController(apiSet, controller) {
        const api1 = apiSet.find((api)=>api.controller_ === controller
        );
        if (!api1) throw TpError.shouldNeverHappen();
        return api1;
    }
    function createBindingTarget(obj, key, opt_id) {
        if (!BindingTarget.isBindable(obj)) throw TpError.notBindable();
        return new BindingTarget(obj, key, opt_id);
    }
    class RackApi extends BladeApi {
        constructor(controller, pool){
            super(controller);
            this.onRackAdd_ = this.onRackAdd_.bind(this);
            this.onRackRemove_ = this.onRackRemove_.bind(this);
            this.onRackInputChange_ = this.onRackInputChange_.bind(this);
            this.onRackMonitorUpdate_ = this.onRackMonitorUpdate_.bind(this);
            this.emitter_ = new Emitter();
            this.apiSet_ = new NestedOrderedSet(findSubBladeApiSet);
            this.pool_ = pool;
            const rack = this.controller_.rack;
            rack.emitter.on('add', this.onRackAdd_);
            rack.emitter.on('remove', this.onRackRemove_);
            rack.emitter.on('inputchange', this.onRackInputChange_);
            rack.emitter.on('monitorupdate', this.onRackMonitorUpdate_);
            rack.children.forEach((bc)=>{
                this.setUpApi_(bc);
            });
        }
        get children() {
            return this.controller_.rack.children.map((bc)=>getApiByController(this.apiSet_, bc)
            );
        }
        addInput(object, key, opt_params) {
            const params = opt_params !== null && opt_params !== void 0 ? opt_params : {
            };
            const doc = this.controller_.view.element.ownerDocument;
            const bc = this.pool_.createInput(doc, createBindingTarget(object, key, params.presetKey), params);
            const api = new InputBindingApi(bc);
            return this.add(api, params.index);
        }
        addMonitor(object, key, opt_params) {
            const params = opt_params !== null && opt_params !== void 0 ? opt_params : {
            };
            const doc = this.controller_.view.element.ownerDocument;
            const bc = this.pool_.createMonitor(doc, createBindingTarget(object, key), params);
            const api = new MonitorBindingApi(bc);
            return forceCast(this.add(api, params.index));
        }
        addFolder(params) {
            return addFolderAsBlade(this, params);
        }
        addButton(params) {
            return addButtonAsBlade(this, params);
        }
        addSeparator(opt_params) {
            return addSeparatorAsBlade(this, opt_params);
        }
        addTab(params) {
            return addTabAsBlade(this, params);
        }
        add(api, opt_index) {
            this.controller_.rack.add(api.controller_, opt_index);
            const gapi = this.apiSet_.find((a)=>a.controller_ === api.controller_
            );
            if (gapi) this.apiSet_.remove(gapi);
            this.apiSet_.add(api);
            return api;
        }
        remove(api) {
            this.controller_.rack.remove(api.controller_);
        }
        addBlade(params) {
            const doc = this.controller_.view.element.ownerDocument;
            const bc = this.pool_.createBlade(doc, params);
            const api = this.pool_.createBladeApi(bc);
            return this.add(api, params.index);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev)=>{
                bh(ev.event);
            });
            return this;
        }
        setUpApi_(bc) {
            const api2 = this.apiSet_.find((api)=>api.controller_ === bc
            );
            if (!api2) this.apiSet_.add(this.pool_.createBladeApi(bc));
        }
        onRackAdd_(ev) {
            this.setUpApi_(ev.bladeController);
        }
        onRackRemove_(ev) {
            if (ev.isRoot) {
                const api = getApiByController(this.apiSet_, ev.bladeController);
                this.apiSet_.remove(api);
            }
        }
        onRackInputChange_(ev) {
            const bc = ev.bladeController;
            if (bc instanceof InputBindingController) {
                const api = getApiByController(this.apiSet_, bc);
                const binding = bc.binding;
                this.emitter_.emit('change', {
                    event: new TpChangeEvent(api, forceCast(binding.target.read()), binding.target.presetKey, ev.options.last)
                });
            } else if (bc instanceof ValueBladeController) {
                const api = getApiByController(this.apiSet_, bc);
                this.emitter_.emit('change', {
                    event: new TpChangeEvent(api, bc.value.rawValue, undefined, ev.options.last)
                });
            }
        }
        onRackMonitorUpdate_(ev) {
            if (!(ev.bladeController instanceof MonitorBindingController)) throw TpError.shouldNeverHappen();
            const api = getApiByController(this.apiSet_, ev.bladeController);
            const binding = ev.bladeController.binding;
            this.emitter_.emit('update', {
                event: new TpUpdateEvent(api, forceCast(binding.target.read()), binding.target.presetKey)
            });
        }
    }
    class FolderApi extends RackLikeApi {
        constructor(controller, pool){
            super(controller, new RackApi(controller.rackController, pool));
            this.emitter_ = new Emitter();
            this.controller_.foldable.value('expanded').emitter.on('change', (ev)=>{
                this.emitter_.emit('fold', {
                    event: new TpFoldEvent(this, ev.sender.rawValue)
                });
            });
            this.rackApi_.on('change', (ev)=>{
                this.emitter_.emit('change', {
                    event: ev
                });
            });
            this.rackApi_.on('update', (ev)=>{
                this.emitter_.emit('update', {
                    event: ev
                });
            });
        }
        get expanded() {
            return this.controller_.foldable.get('expanded');
        }
        set expanded(expanded) {
            this.controller_.foldable.set('expanded', expanded);
        }
        get title() {
            return this.controller_.props.get('title');
        }
        set title(title) {
            this.controller_.props.set('title', title);
        }
        get children() {
            return this.rackApi_.children;
        }
        addInput(object, key, opt_params) {
            return this.rackApi_.addInput(object, key, opt_params);
        }
        addMonitor(object, key, opt_params) {
            return this.rackApi_.addMonitor(object, key, opt_params);
        }
        addFolder(params) {
            return this.rackApi_.addFolder(params);
        }
        addButton(params) {
            return this.rackApi_.addButton(params);
        }
        addSeparator(opt_params) {
            return this.rackApi_.addSeparator(opt_params);
        }
        addTab(params) {
            return this.rackApi_.addTab(params);
        }
        add(api, opt_index) {
            return this.rackApi_.add(api, opt_index);
        }
        remove(api) {
            this.rackApi_.remove(api);
        }
        addBlade(params) {
            return this.rackApi_.addBlade(params);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev)=>{
                bh(ev.event);
            });
            return this;
        }
    }
    class RackLikeController extends BladeController {
        constructor(config){
            super({
                blade: config.blade,
                view: config.view,
                viewProps: config.rackController.viewProps
            });
            this.rackController = config.rackController;
        }
    }
    class PlainView {
        constructor(doc, config){
            const className = ClassName(config.viewName);
            this.element = doc.createElement('div');
            this.element.classList.add(className());
            config.viewProps.bindClassModifiers(this.element);
        }
    }
    function findInputBindingController(bcs, b) {
        for(let i = 0; i < bcs.length; i++){
            const bc = bcs[i];
            if (bc instanceof InputBindingController && bc.binding === b) return bc;
        }
        return null;
    }
    function findMonitorBindingController(bcs, b) {
        for(let i = 0; i < bcs.length; i++){
            const bc = bcs[i];
            if (bc instanceof MonitorBindingController && bc.binding === b) return bc;
        }
        return null;
    }
    function findValueBladeController(bcs, v) {
        for(let i = 0; i < bcs.length; i++){
            const bc = bcs[i];
            if (bc instanceof ValueBladeController && bc.value === v) return bc;
        }
        return null;
    }
    function findSubRack(bc) {
        if (bc instanceof RackController) return bc.rack;
        if (bc instanceof RackLikeController) return bc.rackController.rack;
        return null;
    }
    function findSubBladeControllerSet(bc) {
        const rack = findSubRack(bc);
        return rack ? rack['bcSet_'] : null;
    }
    class BladeRack {
        constructor(config){
            var _a, _b;
            this.onBladePositionsChange_ = this.onBladePositionsChange_.bind(this);
            this.onSetAdd_ = this.onSetAdd_.bind(this);
            this.onSetRemove_ = this.onSetRemove_.bind(this);
            this.onChildDispose_ = this.onChildDispose_.bind(this);
            this.onChildPositionsChange_ = this.onChildPositionsChange_.bind(this);
            this.onChildInputChange_ = this.onChildInputChange_.bind(this);
            this.onChildMonitorUpdate_ = this.onChildMonitorUpdate_.bind(this);
            this.onChildValueChange_ = this.onChildValueChange_.bind(this);
            this.onChildViewPropsChange_ = this.onChildViewPropsChange_.bind(this);
            this.onDescendantLayout_ = this.onDescendantLayout_.bind(this);
            this.onDescendantInputChange_ = this.onDescendantInputChange_.bind(this);
            this.onDescendantMonitorUpdate_ = this.onDescendantMonitorUpdate_.bind(this);
            this.emitter = new Emitter();
            this.blade_ = (_a = config.blade) !== null && _a !== void 0 ? _a : null;
            (_b = this.blade_) === null || _b === void 0 || _b.value('positions').emitter.on('change', this.onBladePositionsChange_);
            this.viewProps = config.viewProps;
            this.bcSet_ = new NestedOrderedSet(findSubBladeControllerSet);
            this.bcSet_.emitter.on('add', this.onSetAdd_);
            this.bcSet_.emitter.on('remove', this.onSetRemove_);
        }
        get children() {
            return this.bcSet_.items;
        }
        add(bc, opt_index) {
            var _a;
            (_a = bc.parent) === null || _a === void 0 || _a.remove(bc);
            if (isPropertyWritable(bc, 'parent')) bc.parent = this;
            else {
                bc['parent_'] = this;
                warnMissing({
                    key: 'parent',
                    target: 'BladeController',
                    place: 'BladeRack.add'
                });
            }
            this.bcSet_.add(bc, opt_index);
        }
        remove(bc) {
            if (isPropertyWritable(bc, 'parent')) bc.parent = null;
            else {
                bc['parent_'] = null;
                warnMissing({
                    key: 'parent',
                    target: 'BladeController',
                    place: 'BladeRack.remove'
                });
            }
            this.bcSet_.remove(bc);
        }
        find(controllerClass) {
            return forceCast(this.bcSet_.allItems().filter((bc)=>{
                return bc instanceof controllerClass;
            }));
        }
        onSetAdd_(ev) {
            this.updatePositions_();
            const isRoot = ev.target === ev.root;
            this.emitter.emit('add', {
                bladeController: ev.item,
                index: ev.index,
                isRoot: isRoot,
                sender: this
            });
            if (!isRoot) return;
            const bc = ev.item;
            bc.viewProps.emitter.on('change', this.onChildViewPropsChange_);
            bc.blade.value('positions').emitter.on('change', this.onChildPositionsChange_);
            bc.viewProps.handleDispose(this.onChildDispose_);
            if (bc instanceof InputBindingController) bc.binding.emitter.on('change', this.onChildInputChange_);
            else if (bc instanceof MonitorBindingController) bc.binding.emitter.on('update', this.onChildMonitorUpdate_);
            else if (bc instanceof ValueBladeController) bc.value.emitter.on('change', this.onChildValueChange_);
            else {
                const rack = findSubRack(bc);
                if (rack) {
                    const emitter = rack.emitter;
                    emitter.on('layout', this.onDescendantLayout_);
                    emitter.on('inputchange', this.onDescendantInputChange_);
                    emitter.on('monitorupdate', this.onDescendantMonitorUpdate_);
                }
            }
        }
        onSetRemove_(ev) {
            this.updatePositions_();
            const isRoot = ev.target === ev.root;
            this.emitter.emit('remove', {
                bladeController: ev.item,
                isRoot: isRoot,
                sender: this
            });
            if (!isRoot) return;
            const bc = ev.item;
            if (bc instanceof InputBindingController) bc.binding.emitter.off('change', this.onChildInputChange_);
            else if (bc instanceof MonitorBindingController) bc.binding.emitter.off('update', this.onChildMonitorUpdate_);
            else if (bc instanceof ValueBladeController) bc.value.emitter.off('change', this.onChildValueChange_);
            else {
                const rack = findSubRack(bc);
                if (rack) {
                    const emitter = rack.emitter;
                    emitter.off('layout', this.onDescendantLayout_);
                    emitter.off('inputchange', this.onDescendantInputChange_);
                    emitter.off('monitorupdate', this.onDescendantMonitorUpdate_);
                }
            }
        }
        updatePositions_() {
            const visibleItems = this.bcSet_.items.filter((bc)=>!bc.viewProps.get('hidden')
            );
            const firstVisibleItem = visibleItems[0];
            const lastVisibleItem = visibleItems[visibleItems.length - 1];
            this.bcSet_.items.forEach((bc)=>{
                const ps = [];
                if (bc === firstVisibleItem) {
                    ps.push('first');
                    if (!this.blade_ || this.blade_.get('positions').includes('veryfirst')) ps.push('veryfirst');
                }
                if (bc === lastVisibleItem) {
                    ps.push('last');
                    if (!this.blade_ || this.blade_.get('positions').includes('verylast')) ps.push('verylast');
                }
                bc.blade.set('positions', ps);
            });
        }
        onChildPositionsChange_() {
            this.updatePositions_();
            this.emitter.emit('layout', {
                sender: this
            });
        }
        onChildViewPropsChange_(_ev) {
            this.updatePositions_();
            this.emitter.emit('layout', {
                sender: this
            });
        }
        onChildDispose_() {
            const disposedUcs = this.bcSet_.items.filter((bc)=>{
                return bc.viewProps.get('disposed');
            });
            disposedUcs.forEach((bc)=>{
                this.bcSet_.remove(bc);
            });
        }
        onChildInputChange_(ev) {
            const bc = findInputBindingController(this.find(InputBindingController), ev.sender);
            if (!bc) throw TpError.alreadyDisposed();
            this.emitter.emit('inputchange', {
                bladeController: bc,
                options: ev.options,
                sender: this
            });
        }
        onChildMonitorUpdate_(ev) {
            const bc = findMonitorBindingController(this.find(MonitorBindingController), ev.sender);
            if (!bc) throw TpError.alreadyDisposed();
            this.emitter.emit('monitorupdate', {
                bladeController: bc,
                sender: this
            });
        }
        onChildValueChange_(ev) {
            const bc = findValueBladeController(this.find(ValueBladeController), ev.sender);
            if (!bc) throw TpError.alreadyDisposed();
            this.emitter.emit('inputchange', {
                bladeController: bc,
                options: ev.options,
                sender: this
            });
        }
        onDescendantLayout_(_) {
            this.updatePositions_();
            this.emitter.emit('layout', {
                sender: this
            });
        }
        onDescendantInputChange_(ev) {
            this.emitter.emit('inputchange', {
                bladeController: ev.bladeController,
                options: ev.options,
                sender: this
            });
        }
        onDescendantMonitorUpdate_(ev) {
            this.emitter.emit('monitorupdate', {
                bladeController: ev.bladeController,
                sender: this
            });
        }
        onBladePositionsChange_() {
            this.updatePositions_();
        }
    }
    class RackController extends BladeController {
        constructor(doc, config){
            super(Object.assign(Object.assign({
            }, config), {
                view: new PlainView(doc, {
                    viewName: 'brk',
                    viewProps: config.viewProps
                })
            }));
            this.onRackAdd_ = this.onRackAdd_.bind(this);
            this.onRackRemove_ = this.onRackRemove_.bind(this);
            const rack = new BladeRack({
                blade: config.root ? undefined : config.blade,
                viewProps: config.viewProps
            });
            rack.emitter.on('add', this.onRackAdd_);
            rack.emitter.on('remove', this.onRackRemove_);
            this.rack = rack;
            this.viewProps.handleDispose(()=>{
                for(let i = this.rack.children.length - 1; i >= 0; i--){
                    const bc = this.rack.children[i];
                    bc.viewProps.set('disposed', true);
                }
            });
        }
        onRackAdd_(ev) {
            if (!ev.isRoot) return;
            insertElementAt(this.view.element, ev.bladeController.view.element, ev.index);
        }
        onRackRemove_(ev) {
            if (!ev.isRoot) return;
            removeElement(ev.bladeController.view.element);
        }
    }
    const bladeContainerClassName = ClassName('cnt');
    class FolderView {
        constructor(doc, config){
            var _a;
            this.className_ = ClassName((_a = config.viewName) !== null && _a !== void 0 ? _a : 'fld');
            this.element = doc.createElement('div');
            this.element.classList.add(this.className_(), bladeContainerClassName());
            config.viewProps.bindClassModifiers(this.element);
            this.foldable_ = config.foldable;
            this.foldable_.bindExpandedClass(this.element, this.className_(undefined, 'expanded'));
            bindValueMap(this.foldable_, 'completed', valueToClassName(this.element, this.className_(undefined, 'cpl')));
            const buttonElem = doc.createElement('button');
            buttonElem.classList.add(this.className_('b'));
            bindValueMap(config.props, 'title', (title)=>{
                if (isEmpty(title)) this.element.classList.add(this.className_(undefined, 'not'));
                else this.element.classList.remove(this.className_(undefined, 'not'));
            });
            config.viewProps.bindDisabled(buttonElem);
            this.element.appendChild(buttonElem);
            this.buttonElement = buttonElem;
            const indentElem = doc.createElement('div');
            indentElem.classList.add(this.className_('i'));
            this.element.appendChild(indentElem);
            const titleElem = doc.createElement('div');
            titleElem.classList.add(this.className_('t'));
            bindValueToTextContent(config.props.value('title'), titleElem);
            this.buttonElement.appendChild(titleElem);
            this.titleElement = titleElem;
            const markElem = doc.createElement('div');
            markElem.classList.add(this.className_('m'));
            this.buttonElement.appendChild(markElem);
            const containerElem = config.containerElement;
            containerElem.classList.add(this.className_('c'));
            this.element.appendChild(containerElem);
            this.containerElement = containerElem;
        }
    }
    class FolderController extends RackLikeController {
        constructor(doc, config){
            var _a;
            const foldable = Foldable.create((_a = config.expanded) !== null && _a !== void 0 ? _a : true);
            const rc = new RackController(doc, {
                blade: config.blade,
                root: config.root,
                viewProps: config.viewProps
            });
            super(Object.assign(Object.assign({
            }, config), {
                rackController: rc,
                view: new FolderView(doc, {
                    containerElement: rc.view.element,
                    foldable: foldable,
                    props: config.props,
                    viewName: config.root ? 'rot' : undefined,
                    viewProps: config.viewProps
                })
            }));
            this.onTitleClick_ = this.onTitleClick_.bind(this);
            this.props = config.props;
            this.foldable = foldable;
            bindFoldable(this.foldable, this.view.containerElement);
            this.rackController.rack.emitter.on('add', ()=>{
                this.foldable.cleanUpTransition();
            });
            this.rackController.rack.emitter.on('remove', ()=>{
                this.foldable.cleanUpTransition();
            });
            this.view.buttonElement.addEventListener('click', this.onTitleClick_);
        }
        get document() {
            return this.view.element.ownerDocument;
        }
        onTitleClick_() {
            this.foldable.set('expanded', !this.foldable.get('expanded'));
        }
    }
    const FolderBladePlugin = {
        id: 'folder',
        type: 'blade',
        accept (params) {
            const p = ParamsParsers;
            const result = parseParams(params, {
                title: p.required.string,
                view: p.required.constant('folder'),
                expanded: p.optional.boolean
            });
            return result ? {
                params: result
            } : null;
        },
        controller (args) {
            return new FolderController(args.document, {
                blade: args.blade,
                expanded: args.params.expanded,
                props: ValueMap.fromObject({
                    title: args.params.title
                }),
                viewProps: args.viewProps
            });
        },
        api (args) {
            if (!(args.controller instanceof FolderController)) return null;
            return new FolderApi(args.controller, args.pool);
        }
    };
    class LabeledValueController extends ValueBladeController {
        constructor(doc, config){
            const viewProps = config.valueController.viewProps;
            super(Object.assign(Object.assign({
            }, config), {
                value: config.valueController.value,
                view: new LabelView(doc, {
                    props: config.props,
                    viewProps: viewProps
                }),
                viewProps: viewProps
            }));
            this.props = config.props;
            this.valueController = config.valueController;
            this.view.valueElement.appendChild(this.valueController.view.element);
        }
    }
    class SeparatorApi extends BladeApi {
    }
    const className$m = ClassName('spr');
    class SeparatorView {
        constructor(doc, config){
            this.element = doc.createElement('div');
            this.element.classList.add(className$m());
            config.viewProps.bindClassModifiers(this.element);
            const hrElem = doc.createElement('hr');
            hrElem.classList.add(className$m('r'));
            this.element.appendChild(hrElem);
        }
    }
    class SeparatorController extends BladeController {
        constructor(doc, config){
            super(Object.assign(Object.assign({
            }, config), {
                view: new SeparatorView(doc, {
                    viewProps: config.viewProps
                })
            }));
        }
    }
    const SeparatorBladePlugin = {
        id: 'separator',
        type: 'blade',
        accept (params) {
            const p = ParamsParsers;
            const result = parseParams(params, {
                view: p.required.constant('separator')
            });
            return result ? {
                params: result
            } : null;
        },
        controller (args) {
            return new SeparatorController(args.document, {
                blade: args.blade,
                viewProps: args.viewProps
            });
        },
        api (args) {
            if (!(args.controller instanceof SeparatorController)) return null;
            return new SeparatorApi(args.controller);
        }
    };
    const className$l = ClassName('tbi');
    class TabItemView {
        constructor(doc, config){
            this.element = doc.createElement('div');
            this.element.classList.add(className$l());
            config.viewProps.bindClassModifiers(this.element);
            bindValueMap(config.props, 'selected', (selected)=>{
                if (selected) this.element.classList.add(className$l(undefined, 'sel'));
                else this.element.classList.remove(className$l(undefined, 'sel'));
            });
            const buttonElem = doc.createElement('button');
            buttonElem.classList.add(className$l('b'));
            config.viewProps.bindDisabled(buttonElem);
            this.element.appendChild(buttonElem);
            this.buttonElement = buttonElem;
            const titleElem = doc.createElement('div');
            titleElem.classList.add(className$l('t'));
            bindValueToTextContent(config.props.value('title'), titleElem);
            this.buttonElement.appendChild(titleElem);
            this.titleElement = titleElem;
        }
    }
    class TabItemController {
        constructor(doc, config){
            this.emitter = new Emitter();
            this.onClick_ = this.onClick_.bind(this);
            this.props = config.props;
            this.viewProps = config.viewProps;
            this.view = new TabItemView(doc, {
                props: config.props,
                viewProps: config.viewProps
            });
            this.view.buttonElement.addEventListener('click', this.onClick_);
        }
        onClick_() {
            this.emitter.emit('click', {
                sender: this
            });
        }
    }
    class TabPageController {
        constructor(doc, config){
            this.onItemClick_ = this.onItemClick_.bind(this);
            this.ic_ = new TabItemController(doc, {
                props: config.itemProps,
                viewProps: ViewProps.create()
            });
            this.ic_.emitter.on('click', this.onItemClick_);
            this.cc_ = new RackController(doc, {
                blade: createBlade(),
                viewProps: ViewProps.create()
            });
            this.props = config.props;
            bindValueMap(this.props, 'selected', (selected)=>{
                this.itemController.props.set('selected', selected);
                this.contentController.viewProps.set('hidden', !selected);
            });
        }
        get itemController() {
            return this.ic_;
        }
        get contentController() {
            return this.cc_;
        }
        onItemClick_() {
            this.props.set('selected', true);
        }
    }
    class TabPageApi {
        constructor(controller, contentRackApi){
            this.controller_ = controller;
            this.rackApi_ = contentRackApi;
        }
        get title() {
            var _a;
            return (_a = this.controller_.itemController.props.get('title')) !== null && _a !== void 0 ? _a : '';
        }
        set title(title) {
            this.controller_.itemController.props.set('title', title);
        }
        get selected() {
            return this.controller_.props.get('selected');
        }
        set selected(selected) {
            this.controller_.props.set('selected', selected);
        }
        get children() {
            return this.rackApi_.children;
        }
        addButton(params) {
            return this.rackApi_.addButton(params);
        }
        addFolder(params) {
            return this.rackApi_.addFolder(params);
        }
        addSeparator(opt_params) {
            return this.rackApi_.addSeparator(opt_params);
        }
        addTab(params) {
            return this.rackApi_.addTab(params);
        }
        add(api, opt_index) {
            this.rackApi_.add(api, opt_index);
        }
        remove(api) {
            this.rackApi_.remove(api);
        }
        addInput(object, key, opt_params) {
            return this.rackApi_.addInput(object, key, opt_params);
        }
        addMonitor(object, key, opt_params) {
            return this.rackApi_.addMonitor(object, key, opt_params);
        }
        addBlade(params) {
            return this.rackApi_.addBlade(params);
        }
    }
    class TabApi extends RackLikeApi {
        constructor(controller, pool){
            super(controller, new RackApi(controller.rackController, pool));
            this.onPageAdd_ = this.onPageAdd_.bind(this);
            this.onPageRemove_ = this.onPageRemove_.bind(this);
            this.onSelect_ = this.onSelect_.bind(this);
            this.emitter_ = new Emitter();
            this.pageApiMap_ = new Map();
            this.rackApi_.on('change', (ev)=>{
                this.emitter_.emit('change', {
                    event: ev
                });
            });
            this.rackApi_.on('update', (ev)=>{
                this.emitter_.emit('update', {
                    event: ev
                });
            });
            this.controller_.tab.selectedIndex.emitter.on('change', this.onSelect_);
            this.controller_.pageSet.emitter.on('add', this.onPageAdd_);
            this.controller_.pageSet.emitter.on('remove', this.onPageRemove_);
            this.controller_.pageSet.items.forEach((pc)=>{
                this.setUpPageApi_(pc);
            });
        }
        get pages() {
            return this.controller_.pageSet.items.map((pc)=>{
                const api = this.pageApiMap_.get(pc);
                if (!api) throw TpError.shouldNeverHappen();
                return api;
            });
        }
        addPage(params) {
            const doc = this.controller_.view.element.ownerDocument;
            const pc = new TabPageController(doc, {
                itemProps: ValueMap.fromObject({
                    selected: false,
                    title: params.title
                }),
                props: ValueMap.fromObject({
                    selected: false
                })
            });
            this.controller_.add(pc, params.index);
            const api = this.pageApiMap_.get(pc);
            if (!api) throw TpError.shouldNeverHappen();
            return api;
        }
        removePage(index) {
            this.controller_.remove(index);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev)=>{
                bh(ev.event);
            });
            return this;
        }
        setUpPageApi_(pc) {
            const rackApi = this.rackApi_['apiSet_'].find((api)=>api.controller_ === pc.contentController
            );
            if (!rackApi) throw TpError.shouldNeverHappen();
            const api3 = new TabPageApi(pc, rackApi);
            this.pageApiMap_.set(pc, api3);
        }
        onPageAdd_(ev) {
            this.setUpPageApi_(ev.item);
        }
        onPageRemove_(ev) {
            const api = this.pageApiMap_.get(ev.item);
            if (!api) throw TpError.shouldNeverHappen();
            this.pageApiMap_.delete(ev.item);
        }
        onSelect_(ev) {
            this.emitter_.emit('select', {
                event: new TpTabSelectEvent(this, ev.rawValue)
            });
        }
    }
    const INDEX_NOT_SELECTED = -1;
    class Tab {
        constructor(){
            this.onItemSelectedChange_ = this.onItemSelectedChange_.bind(this);
            this.empty = createValue(true);
            this.selectedIndex = createValue(INDEX_NOT_SELECTED);
            this.items_ = [];
        }
        add(item, opt_index) {
            const index = opt_index !== null && opt_index !== void 0 ? opt_index : this.items_.length;
            this.items_.splice(index, 0, item);
            item.emitter.on('change', this.onItemSelectedChange_);
            this.keepSelection_();
        }
        remove(item) {
            const index = this.items_.indexOf(item);
            if (index < 0) return;
            this.items_.splice(index, 1);
            item.emitter.off('change', this.onItemSelectedChange_);
            this.keepSelection_();
        }
        keepSelection_() {
            if (this.items_.length === 0) {
                this.selectedIndex.rawValue = INDEX_NOT_SELECTED;
                this.empty.rawValue = true;
                return;
            }
            const firstSelIndex = this.items_.findIndex((s)=>s.rawValue
            );
            if (firstSelIndex < 0) {
                this.items_.forEach((s, i)=>{
                    s.rawValue = i === 0;
                });
                this.selectedIndex.rawValue = 0;
            } else {
                this.items_.forEach((s, i)=>{
                    s.rawValue = i === firstSelIndex;
                });
                this.selectedIndex.rawValue = firstSelIndex;
            }
            this.empty.rawValue = false;
        }
        onItemSelectedChange_(ev) {
            if (ev.rawValue) {
                const index = this.items_.findIndex((s)=>s === ev.sender
                );
                this.items_.forEach((s, i)=>{
                    s.rawValue = i === index;
                });
                this.selectedIndex.rawValue = index;
            } else this.keepSelection_();
        }
    }
    const className$k = ClassName('tab');
    class TabView {
        constructor(doc, config){
            this.element = doc.createElement('div');
            this.element.classList.add(className$k(), bladeContainerClassName());
            config.viewProps.bindClassModifiers(this.element);
            bindValue(config.empty, valueToClassName(this.element, className$k(undefined, 'nop')));
            const titleElem = doc.createElement('div');
            titleElem.classList.add(className$k('t'));
            this.element.appendChild(titleElem);
            this.itemsElement = titleElem;
            const indentElem = doc.createElement('div');
            indentElem.classList.add(className$k('i'));
            this.element.appendChild(indentElem);
            const contentsElem = config.contentsElement;
            contentsElem.classList.add(className$k('c'));
            this.element.appendChild(contentsElem);
            this.contentsElement = contentsElem;
        }
    }
    class TabController extends RackLikeController {
        constructor(doc, config){
            const cr = new RackController(doc, {
                blade: config.blade,
                viewProps: config.viewProps
            });
            const tab = new Tab();
            super({
                blade: config.blade,
                rackController: cr,
                view: new TabView(doc, {
                    contentsElement: cr.view.element,
                    empty: tab.empty,
                    viewProps: config.viewProps
                })
            });
            this.onPageAdd_ = this.onPageAdd_.bind(this);
            this.onPageRemove_ = this.onPageRemove_.bind(this);
            this.pageSet_ = new NestedOrderedSet(()=>null
            );
            this.pageSet_.emitter.on('add', this.onPageAdd_);
            this.pageSet_.emitter.on('remove', this.onPageRemove_);
            this.tab = tab;
        }
        get pageSet() {
            return this.pageSet_;
        }
        add(pc, opt_index) {
            this.pageSet_.add(pc, opt_index);
        }
        remove(index) {
            this.pageSet_.remove(this.pageSet_.items[index]);
        }
        onPageAdd_(ev) {
            const pc = ev.item;
            insertElementAt(this.view.itemsElement, pc.itemController.view.element, ev.index);
            pc.itemController.viewProps.set('parent', this.viewProps);
            this.rackController.rack.add(pc.contentController, ev.index);
            this.tab.add(pc.props.value('selected'));
        }
        onPageRemove_(ev) {
            const pc = ev.item;
            removeElement(pc.itemController.view.element);
            pc.itemController.viewProps.set('parent', null);
            this.rackController.rack.remove(pc.contentController);
            this.tab.remove(pc.props.value('selected'));
        }
    }
    const TabBladePlugin = {
        id: 'tab',
        type: 'blade',
        accept (params) {
            const p = ParamsParsers;
            const result = parseParams(params, {
                pages: p.required.array(p.required.object({
                    title: p.required.string
                })),
                view: p.required.constant('tab')
            });
            if (!result || result.pages.length === 0) return null;
            return {
                params: result
            };
        },
        controller (args) {
            const c = new TabController(args.document, {
                blade: args.blade,
                viewProps: args.viewProps
            });
            args.params.pages.forEach((p)=>{
                const pc = new TabPageController(args.document, {
                    itemProps: ValueMap.fromObject({
                        selected: false,
                        title: p.title
                    }),
                    props: ValueMap.fromObject({
                        selected: false
                    })
                });
                c.add(pc);
            });
            return c;
        },
        api (args) {
            if (!(args.controller instanceof TabController)) return null;
            return new TabApi(args.controller, args.pool);
        }
    };
    function createBladeController(plugin, args) {
        const ac = plugin.accept(args.params);
        if (!ac) return null;
        const disabled = ParamsParsers.optional.boolean(args.params['disabled']).value;
        const hidden = ParamsParsers.optional.boolean(args.params['hidden']).value;
        return plugin.controller({
            blade: createBlade(),
            document: args.document,
            params: forceCast(Object.assign(Object.assign({
            }, ac.params), {
                disabled: disabled,
                hidden: hidden
            })),
            viewProps: ViewProps.create({
                disabled: disabled,
                hidden: hidden
            })
        });
    }
    class ManualTicker {
        constructor(){
            this.disabled = false;
            this.emitter = new Emitter();
        }
        dispose() {
        }
        tick() {
            if (this.disabled) return;
            this.emitter.emit('tick', {
                sender: this
            });
        }
    }
    class IntervalTicker {
        constructor(doc, interval){
            this.disabled_ = false;
            this.timerId_ = null;
            this.onTick_ = this.onTick_.bind(this);
            this.doc_ = doc;
            this.emitter = new Emitter();
            this.interval_ = interval;
            this.setTimer_();
        }
        get disabled() {
            return this.disabled_;
        }
        set disabled(inactive) {
            this.disabled_ = inactive;
            if (this.disabled_) this.clearTimer_();
            else this.setTimer_();
        }
        dispose() {
            this.clearTimer_();
        }
        clearTimer_() {
            if (this.timerId_ === null) return;
            const win = this.doc_.defaultView;
            if (win) win.clearInterval(this.timerId_);
            this.timerId_ = null;
        }
        setTimer_() {
            this.clearTimer_();
            if (this.interval_ <= 0) return;
            const win = this.doc_.defaultView;
            if (win) this.timerId_ = win.setInterval(this.onTick_, this.interval_);
        }
        onTick_() {
            if (this.disabled_) return;
            this.emitter.emit('tick', {
                sender: this
            });
        }
    }
    class CompositeConstraint {
        constructor(constraints){
            this.constraints = constraints;
        }
        constrain(value) {
            return this.constraints.reduce((result, c)=>{
                return c.constrain(result);
            }, value);
        }
    }
    function findConstraint(c, constraintClass) {
        if (c instanceof constraintClass) return c;
        if (c instanceof CompositeConstraint) {
            const result = c.constraints.reduce((tmpResult, sc)=>{
                if (tmpResult) return tmpResult;
                return sc instanceof constraintClass ? sc : null;
            }, null);
            if (result) return result;
        }
        return null;
    }
    class DefiniteRangeConstraint {
        constructor(config){
            this.values = ValueMap.fromObject({
                max: config.max,
                min: config.min
            });
        }
        constrain(value) {
            const max = this.values.get('max');
            const min = this.values.get('min');
            return Math.min(Math.max(value, min), max);
        }
    }
    class ListConstraint {
        constructor(options){
            this.values = ValueMap.fromObject({
                options: options
            });
        }
        get options() {
            return this.values.get('options');
        }
        constrain(value) {
            const opts = this.values.get('options');
            if (opts.length === 0) return value;
            const matched = opts.filter((item)=>{
                return item.value === value;
            }).length > 0;
            return matched ? value : opts[0].value;
        }
    }
    class RangeConstraint {
        constructor(config){
            this.values = ValueMap.fromObject({
                max: config.max,
                min: config.min
            });
        }
        get maxValue() {
            return this.values.get('max');
        }
        get minValue() {
            return this.values.get('min');
        }
        constrain(value) {
            const max = this.values.get('max');
            const min = this.values.get('min');
            let result = value;
            if (!isEmpty(min)) result = Math.max(result, min);
            if (!isEmpty(max)) result = Math.min(result, max);
            return result;
        }
    }
    class StepConstraint {
        constructor(step, origin = 0){
            this.step = step;
            this.origin = origin;
        }
        constrain(value) {
            const o = this.origin % this.step;
            const r = Math.round((value - o) / this.step);
            return o + r * this.step;
        }
    }
    const className$j = ClassName('lst');
    class ListView {
        constructor(doc, config){
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.props_ = config.props;
            this.element = doc.createElement('div');
            this.element.classList.add(className$j());
            config.viewProps.bindClassModifiers(this.element);
            const selectElem = doc.createElement('select');
            selectElem.classList.add(className$j('s'));
            bindValueMap(this.props_, 'options', (opts)=>{
                removeChildElements(selectElem);
                opts.forEach((item, index)=>{
                    const optionElem = doc.createElement('option');
                    optionElem.dataset.index = String(index);
                    optionElem.textContent = item.text;
                    optionElem.value = String(item.value);
                    selectElem.appendChild(optionElem);
                });
            });
            config.viewProps.bindDisabled(selectElem);
            this.element.appendChild(selectElem);
            this.selectElement = selectElem;
            const markElem = doc.createElement('div');
            markElem.classList.add(className$j('m'));
            markElem.appendChild(createSvgIconElement(doc, 'dropdown'));
            this.element.appendChild(markElem);
            config.value.emitter.on('change', this.onValueChange_);
            this.value_ = config.value;
            this.update_();
        }
        update_() {
            this.selectElement.value = String(this.value_.rawValue);
        }
        onValueChange_() {
            this.update_();
        }
    }
    class ListController {
        constructor(doc, config){
            this.onSelectChange_ = this.onSelectChange_.bind(this);
            this.props = config.props;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new ListView(doc, {
                props: this.props,
                value: this.value,
                viewProps: this.viewProps
            });
            this.view.selectElement.addEventListener('change', this.onSelectChange_);
        }
        onSelectChange_(e) {
            const selectElem = forceCast(e.currentTarget);
            const optElem = selectElem.selectedOptions.item(0);
            if (!optElem) return;
            const itemIndex = Number(optElem.dataset.index);
            this.value.rawValue = this.props.get('options')[itemIndex].value;
        }
    }
    const className$i = ClassName('pop');
    class PopupView {
        constructor(doc, config){
            this.element = doc.createElement('div');
            this.element.classList.add(className$i());
            config.viewProps.bindClassModifiers(this.element);
            bindValue(config.shows, valueToClassName(this.element, className$i(undefined, 'v')));
        }
    }
    class PopupController {
        constructor(doc, config){
            this.shows = createValue(false);
            this.viewProps = config.viewProps;
            this.view = new PopupView(doc, {
                shows: this.shows,
                viewProps: this.viewProps
            });
        }
    }
    const className$h = ClassName('txt');
    class TextView {
        constructor(doc, config){
            this.onChange_ = this.onChange_.bind(this);
            this.element = doc.createElement('div');
            this.element.classList.add(className$h());
            config.viewProps.bindClassModifiers(this.element);
            this.props_ = config.props;
            this.props_.emitter.on('change', this.onChange_);
            const inputElem = doc.createElement('input');
            inputElem.classList.add(className$h('i'));
            inputElem.type = 'text';
            config.viewProps.bindDisabled(inputElem);
            this.element.appendChild(inputElem);
            this.inputElement = inputElem;
            config.value.emitter.on('change', this.onChange_);
            this.value_ = config.value;
            this.refresh();
        }
        refresh() {
            const formatter = this.props_.get('formatter');
            this.inputElement.value = formatter(this.value_.rawValue);
        }
        onChange_() {
            this.refresh();
        }
    }
    class TextController {
        constructor(doc, config){
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.parser_ = config.parser;
            this.props = config.props;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new TextView(doc, {
                props: config.props,
                value: this.value,
                viewProps: this.viewProps
            });
            this.view.inputElement.addEventListener('change', this.onInputChange_);
        }
        onInputChange_(e) {
            const inputElem = forceCast(e.currentTarget);
            const value = inputElem.value;
            const parsedValue = this.parser_(value);
            if (!isEmpty(parsedValue)) this.value.rawValue = parsedValue;
            this.view.refresh();
        }
    }
    function boolToString(value) {
        return String(value);
    }
    function boolFromUnknown(value) {
        if (value === 'false') return false;
        return !!value;
    }
    function BooleanFormatter(value) {
        return boolToString(value);
    }
    class NumberLiteralNode {
        constructor(text){
            this.text = text;
        }
        evaluate() {
            return Number(this.text);
        }
        toString() {
            return this.text;
        }
    }
    const BINARY_OPERATION_MAP = {
        '**': (v1, v2)=>Math.pow(v1, v2)
        ,
        '*': (v1, v2)=>v1 * v2
        ,
        '/': (v1, v2)=>v1 / v2
        ,
        '%': (v1, v2)=>v1 % v2
        ,
        '+': (v1, v2)=>v1 + v2
        ,
        '-': (v1, v2)=>v1 - v2
        ,
        '<<': (v1, v2)=>v1 << v2
        ,
        '>>': (v1, v2)=>v1 >> v2
        ,
        '>>>': (v1, v2)=>v1 >>> v2
        ,
        '&': (v1, v2)=>v1 & v2
        ,
        '^': (v1, v2)=>v1 ^ v2
        ,
        '|': (v1, v2)=>v1 | v2
    };
    class BinaryOperationNode {
        constructor(operator, left, right){
            this.left = left;
            this.operator = operator;
            this.right = right;
        }
        evaluate() {
            const op = BINARY_OPERATION_MAP[this.operator];
            if (!op) throw new Error(`unexpected binary operator: '${this.operator}`);
            return op(this.left.evaluate(), this.right.evaluate());
        }
        toString() {
            return [
                'b(',
                this.left.toString(),
                this.operator,
                this.right.toString(),
                ')', 
            ].join(' ');
        }
    }
    const UNARY_OPERATION_MAP = {
        '+': (v)=>v
        ,
        '-': (v)=>-v
        ,
        '~': (v)=>~v
    };
    class UnaryOperationNode {
        constructor(operator, expr){
            this.operator = operator;
            this.expression = expr;
        }
        evaluate() {
            const op = UNARY_OPERATION_MAP[this.operator];
            if (!op) throw new Error(`unexpected unary operator: '${this.operator}`);
            return op(this.expression.evaluate());
        }
        toString() {
            return [
                'u(',
                this.operator,
                this.expression.toString(),
                ')'
            ].join(' ');
        }
    }
    function combineReader(parsers) {
        return (text, cursor)=>{
            for(let i = 0; i < parsers.length; i++){
                const result = parsers[i](text, cursor);
                if (result !== '') return result;
            }
            return '';
        };
    }
    function readWhitespace(text, cursor) {
        var _a;
        const m = text.substr(cursor).match(/^\s+/);
        return (_a = m && m[0]) !== null && _a !== void 0 ? _a : '';
    }
    function readNonZeroDigit(text, cursor) {
        const ch = text.substr(cursor, 1);
        return ch.match(/^[1-9]$/) ? ch : '';
    }
    function readDecimalDigits(text, cursor) {
        var _a;
        const m = text.substr(cursor).match(/^[0-9]+/);
        return (_a = m && m[0]) !== null && _a !== void 0 ? _a : '';
    }
    function readSignedInteger(text, cursor) {
        const ds = readDecimalDigits(text, cursor);
        if (ds !== '') return ds;
        const sign = text.substr(cursor, 1);
        cursor += 1;
        if (sign !== '-' && sign !== '+') return '';
        const sds = readDecimalDigits(text, cursor);
        if (sds === '') return '';
        return sign + sds;
    }
    function readExponentPart(text, cursor) {
        const e = text.substr(cursor, 1);
        cursor += 1;
        if (e.toLowerCase() !== 'e') return '';
        const si = readSignedInteger(text, cursor);
        if (si === '') return '';
        return e + si;
    }
    function readDecimalIntegerLiteral(text, cursor) {
        const ch = text.substr(cursor, 1);
        if (ch === '0') return ch;
        const nzd = readNonZeroDigit(text, cursor);
        cursor += nzd.length;
        if (nzd === '') return '';
        return nzd + readDecimalDigits(text, cursor);
    }
    function readDecimalLiteral1(text, cursor) {
        const dil = readDecimalIntegerLiteral(text, cursor);
        cursor += dil.length;
        if (dil === '') return '';
        const dot = text.substr(cursor, 1);
        cursor += dot.length;
        if (dot !== '.') return '';
        const dds = readDecimalDigits(text, cursor);
        cursor += dds.length;
        return dil + dot + dds + readExponentPart(text, cursor);
    }
    function readDecimalLiteral2(text, cursor) {
        const dot = text.substr(cursor, 1);
        cursor += dot.length;
        if (dot !== '.') return '';
        const dds = readDecimalDigits(text, cursor);
        cursor += dds.length;
        if (dds === '') return '';
        return dot + dds + readExponentPart(text, cursor);
    }
    function readDecimalLiteral3(text, cursor) {
        const dil = readDecimalIntegerLiteral(text, cursor);
        cursor += dil.length;
        if (dil === '') return '';
        return dil + readExponentPart(text, cursor);
    }
    const readDecimalLiteral = combineReader([
        readDecimalLiteral1,
        readDecimalLiteral2,
        readDecimalLiteral3, 
    ]);
    function parseBinaryDigits(text, cursor) {
        var _a;
        const m = text.substr(cursor).match(/^[01]+/);
        return (_a = m && m[0]) !== null && _a !== void 0 ? _a : '';
    }
    function readBinaryIntegerLiteral(text, cursor) {
        const prefix = text.substr(cursor, 2);
        cursor += prefix.length;
        if (prefix.toLowerCase() !== '0b') return '';
        const bds = parseBinaryDigits(text, cursor);
        if (bds === '') return '';
        return prefix + bds;
    }
    function readOctalDigits(text, cursor) {
        var _a;
        const m = text.substr(cursor).match(/^[0-7]+/);
        return (_a = m && m[0]) !== null && _a !== void 0 ? _a : '';
    }
    function readOctalIntegerLiteral(text, cursor) {
        const prefix = text.substr(cursor, 2);
        cursor += prefix.length;
        if (prefix.toLowerCase() !== '0o') return '';
        const ods = readOctalDigits(text, cursor);
        if (ods === '') return '';
        return prefix + ods;
    }
    function readHexDigits(text, cursor) {
        var _a;
        const m = text.substr(cursor).match(/^[0-9a-f]+/i);
        return (_a = m && m[0]) !== null && _a !== void 0 ? _a : '';
    }
    function readHexIntegerLiteral(text, cursor) {
        const prefix = text.substr(cursor, 2);
        cursor += prefix.length;
        if (prefix.toLowerCase() !== '0x') return '';
        const hds = readHexDigits(text, cursor);
        if (hds === '') return '';
        return prefix + hds;
    }
    const readNonDecimalIntegerLiteral = combineReader([
        readBinaryIntegerLiteral,
        readOctalIntegerLiteral,
        readHexIntegerLiteral, 
    ]);
    const readNumericLiteral = combineReader([
        readNonDecimalIntegerLiteral,
        readDecimalLiteral, 
    ]);
    function parseLiteral(text, cursor) {
        const num = readNumericLiteral(text, cursor);
        cursor += num.length;
        if (num === '') return null;
        return {
            evaluable: new NumberLiteralNode(num),
            cursor: cursor
        };
    }
    function parseParenthesizedExpression(text, cursor) {
        const op = text.substr(cursor, 1);
        cursor += op.length;
        if (op !== '(') return null;
        const expr = parseExpression(text, cursor);
        if (!expr) return null;
        cursor = expr.cursor;
        cursor += readWhitespace(text, cursor).length;
        const cl = text.substr(cursor, 1);
        cursor += cl.length;
        if (cl !== ')') return null;
        return {
            evaluable: expr.evaluable,
            cursor: cursor
        };
    }
    function parsePrimaryExpression(text, cursor) {
        var _a;
        return (_a = parseLiteral(text, cursor)) !== null && _a !== void 0 ? _a : parseParenthesizedExpression(text, cursor);
    }
    function parseUnaryExpression(text, cursor) {
        const expr = parsePrimaryExpression(text, cursor);
        if (expr) return expr;
        const op = text.substr(cursor, 1);
        cursor += op.length;
        if (op !== '+' && op !== '-' && op !== '~') return null;
        const num = parseUnaryExpression(text, cursor);
        if (!num) return null;
        cursor = num.cursor;
        return {
            cursor: cursor,
            evaluable: new UnaryOperationNode(op, num.evaluable)
        };
    }
    function readBinaryOperator(ops, text, cursor) {
        cursor += readWhitespace(text, cursor).length;
        const op1 = ops.filter((op)=>text.startsWith(op, cursor)
        )[0];
        if (!op1) return null;
        cursor += op1.length;
        cursor += readWhitespace(text, cursor).length;
        return {
            cursor: cursor,
            operator: op1
        };
    }
    function createBinaryOperationExpressionParser(exprParser, ops) {
        return (text, cursor)=>{
            const firstExpr = exprParser(text, cursor);
            if (!firstExpr) return null;
            cursor = firstExpr.cursor;
            let expr = firstExpr.evaluable;
            for(;;){
                const op = readBinaryOperator(ops, text, cursor);
                if (!op) break;
                cursor = op.cursor;
                const nextExpr = exprParser(text, cursor);
                if (!nextExpr) return null;
                cursor = nextExpr.cursor;
                expr = new BinaryOperationNode(op.operator, expr, nextExpr.evaluable);
            }
            return expr ? {
                cursor: cursor,
                evaluable: expr
            } : null;
        };
    }
    const parseBinaryOperationExpression = [
        [
            '**'
        ],
        [
            '*',
            '/',
            '%'
        ],
        [
            '+',
            '-'
        ],
        [
            '<<',
            '>>>',
            '>>'
        ],
        [
            '&'
        ],
        [
            '^'
        ],
        [
            '|'
        ], 
    ].reduce((parser, ops)=>{
        return createBinaryOperationExpressionParser(parser, ops);
    }, parseUnaryExpression);
    function parseExpression(text, cursor) {
        cursor += readWhitespace(text, cursor).length;
        return parseBinaryOperationExpression(text, cursor);
    }
    function parseEcmaNumberExpression(text) {
        const expr = parseExpression(text, 0);
        if (!expr) return null;
        const cursor = expr.cursor + readWhitespace(text, expr.cursor).length;
        if (cursor !== text.length) return null;
        return expr.evaluable;
    }
    function parseNumber(text) {
        var _a;
        const r = parseEcmaNumberExpression(text);
        return (_a = r === null || r === void 0 ? void 0 : r.evaluate()) !== null && _a !== void 0 ? _a : null;
    }
    function numberFromUnknown(value) {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const pv = parseNumber(value);
            if (!isEmpty(pv)) return pv;
        }
        return 0;
    }
    function numberToString(value) {
        return String(value);
    }
    function createNumberFormatter(digits) {
        return (value)=>{
            return value.toFixed(Math.max(Math.min(digits, 20), 0));
        };
    }
    const innerFormatter = createNumberFormatter(0);
    function formatPercentage(value) {
        return innerFormatter(value) + '%';
    }
    function stringFromUnknown(value) {
        return String(value);
    }
    function formatString(value) {
        return value;
    }
    function fillBuffer(buffer, bufferSize) {
        while(buffer.length < bufferSize)buffer.push(undefined);
    }
    function initializeBuffer(bufferSize) {
        const buffer = [];
        fillBuffer(buffer, bufferSize);
        return createValue(buffer);
    }
    function createTrimmedBuffer(buffer) {
        const index = buffer.indexOf(undefined);
        return forceCast(index < 0 ? buffer : buffer.slice(0, index));
    }
    function createPushedBuffer(buffer, newValue) {
        const newBuffer = [
            ...createTrimmedBuffer(buffer),
            newValue
        ];
        if (newBuffer.length > buffer.length) newBuffer.splice(0, newBuffer.length - buffer.length);
        else fillBuffer(newBuffer, buffer.length);
        return newBuffer;
    }
    function connectValues({ primary: primary , secondary: secondary , forward: forward , backward: backward ,  }) {
        let changing = false;
        function preventFeedback(callback) {
            if (changing) return;
            changing = true;
            callback();
            changing = false;
        }
        primary.emitter.on('change', (ev)=>{
            preventFeedback(()=>{
                secondary.setRawValue(forward(primary, secondary), ev.options);
            });
        });
        secondary.emitter.on('change', (ev)=>{
            preventFeedback(()=>{
                primary.setRawValue(backward(primary, secondary), ev.options);
            });
            preventFeedback(()=>{
                secondary.setRawValue(forward(primary, secondary), ev.options);
            });
        });
        preventFeedback(()=>{
            secondary.setRawValue(forward(primary, secondary), {
                forceEmit: false,
                last: true
            });
        });
    }
    function getStepForKey(baseStep, keys) {
        const step = baseStep * (keys.altKey ? 0.1 : 1) * (keys.shiftKey ? 10 : 1);
        if (keys.upKey) return +step;
        else if (keys.downKey) return -step;
        return 0;
    }
    function getVerticalStepKeys(ev) {
        return {
            altKey: ev.altKey,
            downKey: ev.key === 'ArrowDown',
            shiftKey: ev.shiftKey,
            upKey: ev.key === 'ArrowUp'
        };
    }
    function getHorizontalStepKeys(ev) {
        return {
            altKey: ev.altKey,
            downKey: ev.key === 'ArrowLeft',
            shiftKey: ev.shiftKey,
            upKey: ev.key === 'ArrowRight'
        };
    }
    function isVerticalArrowKey(key) {
        return key === 'ArrowUp' || key === 'ArrowDown';
    }
    function isArrowKey(key) {
        return isVerticalArrowKey(key) || key === 'ArrowLeft' || key === 'ArrowRight';
    }
    function computeOffset$1(ev, elem) {
        var _a, _b;
        const win = elem.ownerDocument.defaultView;
        const rect = elem.getBoundingClientRect();
        return {
            x: ev.pageX - (((_a = win && win.scrollX) !== null && _a !== void 0 ? _a : 0) + rect.left),
            y: ev.pageY - (((_b = win && win.scrollY) !== null && _b !== void 0 ? _b : 0) + rect.top)
        };
    }
    class PointerHandler {
        constructor(element){
            this.lastTouch_ = null;
            this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
            this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
            this.onMouseDown_ = this.onMouseDown_.bind(this);
            this.onTouchEnd_ = this.onTouchEnd_.bind(this);
            this.onTouchMove_ = this.onTouchMove_.bind(this);
            this.onTouchStart_ = this.onTouchStart_.bind(this);
            this.elem_ = element;
            this.emitter = new Emitter();
            element.addEventListener('touchstart', this.onTouchStart_, {
                passive: false
            });
            element.addEventListener('touchmove', this.onTouchMove_, {
                passive: true
            });
            element.addEventListener('touchend', this.onTouchEnd_);
            element.addEventListener('mousedown', this.onMouseDown_);
        }
        computePosition_(offset) {
            const rect = this.elem_.getBoundingClientRect();
            return {
                bounds: {
                    width: rect.width,
                    height: rect.height
                },
                point: offset ? {
                    x: offset.x,
                    y: offset.y
                } : null
            };
        }
        onMouseDown_(ev) {
            var _a;
            ev.preventDefault();
            (_a = ev.currentTarget) === null || _a === void 0 || _a.focus();
            const doc = this.elem_.ownerDocument;
            doc.addEventListener('mousemove', this.onDocumentMouseMove_);
            doc.addEventListener('mouseup', this.onDocumentMouseUp_);
            this.emitter.emit('down', {
                altKey: ev.altKey,
                data: this.computePosition_(computeOffset$1(ev, this.elem_)),
                sender: this,
                shiftKey: ev.shiftKey
            });
        }
        onDocumentMouseMove_(ev) {
            this.emitter.emit('move', {
                altKey: ev.altKey,
                data: this.computePosition_(computeOffset$1(ev, this.elem_)),
                sender: this,
                shiftKey: ev.shiftKey
            });
        }
        onDocumentMouseUp_(ev) {
            const doc = this.elem_.ownerDocument;
            doc.removeEventListener('mousemove', this.onDocumentMouseMove_);
            doc.removeEventListener('mouseup', this.onDocumentMouseUp_);
            this.emitter.emit('up', {
                altKey: ev.altKey,
                data: this.computePosition_(computeOffset$1(ev, this.elem_)),
                sender: this,
                shiftKey: ev.shiftKey
            });
        }
        onTouchStart_(ev) {
            ev.preventDefault();
            const touch = ev.targetTouches.item(0);
            const rect = this.elem_.getBoundingClientRect();
            this.emitter.emit('down', {
                altKey: ev.altKey,
                data: this.computePosition_(touch ? {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top
                } : undefined),
                sender: this,
                shiftKey: ev.shiftKey
            });
            this.lastTouch_ = touch;
        }
        onTouchMove_(ev) {
            const touch = ev.targetTouches.item(0);
            const rect = this.elem_.getBoundingClientRect();
            this.emitter.emit('move', {
                altKey: ev.altKey,
                data: this.computePosition_(touch ? {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top
                } : undefined),
                sender: this,
                shiftKey: ev.shiftKey
            });
            this.lastTouch_ = touch;
        }
        onTouchEnd_(ev) {
            var _a;
            const touch = (_a = ev.targetTouches.item(0)) !== null && _a !== void 0 ? _a : this.lastTouch_;
            const rect = this.elem_.getBoundingClientRect();
            this.emitter.emit('up', {
                altKey: ev.altKey,
                data: this.computePosition_(touch ? {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top
                } : undefined),
                sender: this,
                shiftKey: ev.shiftKey
            });
        }
    }
    function mapRange(value, start1, end1, start2, end2) {
        const p = (value - start1) / (end1 - start1);
        return start2 + p * (end2 - start2);
    }
    function getDecimalDigits(value) {
        const text = String(value.toFixed(10));
        const frac = text.split('.')[1];
        return frac.replace(/0+$/, '').length;
    }
    function constrainRange(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    function loopRange(value, max) {
        return (value % max + max) % max;
    }
    const className$g = ClassName('txt');
    class NumberTextView {
        constructor(doc, config){
            this.onChange_ = this.onChange_.bind(this);
            this.props_ = config.props;
            this.props_.emitter.on('change', this.onChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$g(), className$g(undefined, 'num'));
            if (config.arrayPosition) this.element.classList.add(className$g(undefined, config.arrayPosition));
            config.viewProps.bindClassModifiers(this.element);
            const inputElem = doc.createElement('input');
            inputElem.classList.add(className$g('i'));
            inputElem.type = 'text';
            config.viewProps.bindDisabled(inputElem);
            this.element.appendChild(inputElem);
            this.inputElement = inputElem;
            this.onDraggingChange_ = this.onDraggingChange_.bind(this);
            this.dragging_ = config.dragging;
            this.dragging_.emitter.on('change', this.onDraggingChange_);
            this.element.classList.add(className$g());
            this.inputElement.classList.add(className$g('i'));
            const knobElem = doc.createElement('div');
            knobElem.classList.add(className$g('k'));
            this.element.appendChild(knobElem);
            this.knobElement = knobElem;
            const guideElem = doc.createElementNS(SVG_NS, 'svg');
            guideElem.classList.add(className$g('g'));
            this.knobElement.appendChild(guideElem);
            const bodyElem = doc.createElementNS(SVG_NS, 'path');
            bodyElem.classList.add(className$g('gb'));
            guideElem.appendChild(bodyElem);
            this.guideBodyElem_ = bodyElem;
            const headElem = doc.createElementNS(SVG_NS, 'path');
            headElem.classList.add(className$g('gh'));
            guideElem.appendChild(headElem);
            this.guideHeadElem_ = headElem;
            const tooltipElem = doc.createElement('div');
            tooltipElem.classList.add(ClassName('tt')());
            this.knobElement.appendChild(tooltipElem);
            this.tooltipElem_ = tooltipElem;
            config.value.emitter.on('change', this.onChange_);
            this.value = config.value;
            this.refresh();
        }
        onDraggingChange_(ev) {
            if (ev.rawValue === null) {
                this.element.classList.remove(className$g(undefined, 'drg'));
                return;
            }
            this.element.classList.add(className$g(undefined, 'drg'));
            const x = ev.rawValue / this.props_.get('draggingScale');
            const aox = x + (x > 0 ? -1 : x < 0 ? 1 : 0);
            const adx = constrainRange(-aox, -4, 4);
            this.guideHeadElem_.setAttributeNS(null, 'd', [
                `M ${aox + adx},0 L${aox},4 L${aox + adx},8`,
                `M ${x},-1 L${x},9`
            ].join(' '));
            this.guideBodyElem_.setAttributeNS(null, 'd', `M 0,4 L${x},4`);
            const formatter = this.props_.get('formatter');
            this.tooltipElem_.textContent = formatter(this.value.rawValue);
            this.tooltipElem_.style.left = `${x}px`;
        }
        refresh() {
            const formatter = this.props_.get('formatter');
            this.inputElement.value = formatter(this.value.rawValue);
        }
        onChange_() {
            this.refresh();
        }
    }
    class NumberTextController {
        constructor(doc, config){
            var _a;
            this.originRawValue_ = 0;
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
            this.onInputKeyUp_ = this.onInputKeyUp_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.baseStep_ = config.baseStep;
            this.parser_ = config.parser;
            this.props = config.props;
            this.sliderProps_ = (_a = config.sliderProps) !== null && _a !== void 0 ? _a : null;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.dragging_ = createValue(null);
            this.view = new NumberTextView(doc, {
                arrayPosition: config.arrayPosition,
                dragging: this.dragging_,
                props: this.props,
                value: this.value,
                viewProps: this.viewProps
            });
            this.view.inputElement.addEventListener('change', this.onInputChange_);
            this.view.inputElement.addEventListener('keydown', this.onInputKeyDown_);
            this.view.inputElement.addEventListener('keyup', this.onInputKeyUp_);
            const ph = new PointerHandler(this.view.knobElement);
            ph.emitter.on('down', this.onPointerDown_);
            ph.emitter.on('move', this.onPointerMove_);
            ph.emitter.on('up', this.onPointerUp_);
        }
        constrainValue_(value) {
            var _a, _b;
            const min = (_a = this.sliderProps_) === null || _a === void 0 ? void 0 : _a.get('minValue');
            const max = (_b = this.sliderProps_) === null || _b === void 0 ? void 0 : _b.get('maxValue');
            let v = value;
            if (min !== undefined) v = Math.max(v, min);
            if (max !== undefined) v = Math.min(v, max);
            return v;
        }
        onInputChange_(e) {
            const inputElem = forceCast(e.currentTarget);
            const value = inputElem.value;
            const parsedValue = this.parser_(value);
            if (!isEmpty(parsedValue)) this.value.rawValue = this.constrainValue_(parsedValue);
            this.view.refresh();
        }
        onInputKeyDown_(ev) {
            const step = getStepForKey(this.baseStep_, getVerticalStepKeys(ev));
            if (step === 0) return;
            this.value.setRawValue(this.constrainValue_(this.value.rawValue + step), {
                forceEmit: false,
                last: false
            });
        }
        onInputKeyUp_(ev) {
            const step = getStepForKey(this.baseStep_, getVerticalStepKeys(ev));
            if (step === 0) return;
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true
            });
        }
        onPointerDown_() {
            this.originRawValue_ = this.value.rawValue;
            this.dragging_.rawValue = 0;
        }
        computeDraggingValue_(data) {
            if (!data.point) return null;
            const dx = data.point.x - data.bounds.width / 2;
            return this.constrainValue_(this.originRawValue_ + dx * this.props.get('draggingScale'));
        }
        onPointerMove_(ev) {
            const v = this.computeDraggingValue_(ev.data);
            if (v === null) return;
            this.value.setRawValue(v, {
                forceEmit: false,
                last: false
            });
            this.dragging_.rawValue = this.value.rawValue - this.originRawValue_;
        }
        onPointerUp_(ev) {
            const v = this.computeDraggingValue_(ev.data);
            if (v === null) return;
            this.value.setRawValue(v, {
                forceEmit: true,
                last: true
            });
            this.dragging_.rawValue = null;
        }
    }
    const className$f = ClassName('sld');
    class SliderView {
        constructor(doc, config){
            this.onChange_ = this.onChange_.bind(this);
            this.props_ = config.props;
            this.props_.emitter.on('change', this.onChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$f());
            config.viewProps.bindClassModifiers(this.element);
            const trackElem = doc.createElement('div');
            trackElem.classList.add(className$f('t'));
            config.viewProps.bindTabIndex(trackElem);
            this.element.appendChild(trackElem);
            this.trackElement = trackElem;
            const knobElem = doc.createElement('div');
            knobElem.classList.add(className$f('k'));
            this.trackElement.appendChild(knobElem);
            this.knobElement = knobElem;
            config.value.emitter.on('change', this.onChange_);
            this.value = config.value;
            this.update_();
        }
        update_() {
            const p = constrainRange(mapRange(this.value.rawValue, this.props_.get('minValue'), this.props_.get('maxValue'), 0, 100), 0, 100);
            this.knobElement.style.width = `${p}%`;
        }
        onChange_() {
            this.update_();
        }
    }
    class SliderController {
        constructor(doc, config){
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onKeyUp_ = this.onKeyUp_.bind(this);
            this.onPointerDownOrMove_ = this.onPointerDownOrMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.baseStep_ = config.baseStep;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.props = config.props;
            this.view = new SliderView(doc, {
                props: this.props,
                value: this.value,
                viewProps: this.viewProps
            });
            this.ptHandler_ = new PointerHandler(this.view.trackElement);
            this.ptHandler_.emitter.on('down', this.onPointerDownOrMove_);
            this.ptHandler_.emitter.on('move', this.onPointerDownOrMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.trackElement.addEventListener('keydown', this.onKeyDown_);
            this.view.trackElement.addEventListener('keyup', this.onKeyUp_);
        }
        handlePointerEvent_(d, opts) {
            if (!d.point) return;
            this.value.setRawValue(mapRange(constrainRange(d.point.x, 0, d.bounds.width), 0, d.bounds.width, this.props.get('minValue'), this.props.get('maxValue')), opts);
        }
        onPointerDownOrMove_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false
            });
        }
        onPointerUp_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: true,
                last: true
            });
        }
        onKeyDown_(ev) {
            const step = getStepForKey(this.baseStep_, getHorizontalStepKeys(ev));
            if (step === 0) return;
            this.value.setRawValue(this.value.rawValue + step, {
                forceEmit: false,
                last: false
            });
        }
        onKeyUp_(ev) {
            const step = getStepForKey(this.baseStep_, getHorizontalStepKeys(ev));
            if (step === 0) return;
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true
            });
        }
    }
    const className$e = ClassName('sldtxt');
    class SliderTextView {
        constructor(doc, config){
            this.element = doc.createElement('div');
            this.element.classList.add(className$e());
            const sliderElem = doc.createElement('div');
            sliderElem.classList.add(className$e('s'));
            this.sliderView_ = config.sliderView;
            sliderElem.appendChild(this.sliderView_.element);
            this.element.appendChild(sliderElem);
            const textElem = doc.createElement('div');
            textElem.classList.add(className$e('t'));
            this.textView_ = config.textView;
            textElem.appendChild(this.textView_.element);
            this.element.appendChild(textElem);
        }
    }
    class SliderTextController {
        constructor(doc, config){
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.sliderC_ = new SliderController(doc, {
                baseStep: config.baseStep,
                props: config.sliderProps,
                value: config.value,
                viewProps: this.viewProps
            });
            this.textC_ = new NumberTextController(doc, {
                baseStep: config.baseStep,
                parser: config.parser,
                props: config.textProps,
                sliderProps: config.sliderProps,
                value: config.value,
                viewProps: config.viewProps
            });
            this.view = new SliderTextView(doc, {
                sliderView: this.sliderC_.view,
                textView: this.textC_.view
            });
        }
        get sliderController() {
            return this.sliderC_;
        }
        get textController() {
            return this.textC_;
        }
    }
    function writePrimitive(target, value) {
        target.write(value);
    }
    function parseListOptions(value) {
        const p = ParamsParsers;
        if (Array.isArray(value)) return p.required.array(p.required.object({
            text: p.required.string,
            value: p.required.raw
        }))(value).value;
        if (typeof value === 'object') return p.required.raw(value).value;
        return undefined;
    }
    function parsePickerLayout(value) {
        if (value === 'inline' || value === 'popup') return value;
        return undefined;
    }
    function parsePointDimensionParams(value) {
        const p = ParamsParsers;
        return p.required.object({
            max: p.optional.number,
            min: p.optional.number,
            step: p.optional.number
        })(value).value;
    }
    function normalizeListOptions(options) {
        if (Array.isArray(options)) return options;
        const items = [];
        Object.keys(options).forEach((text)=>{
            items.push({
                text: text,
                value: options[text]
            });
        });
        return items;
    }
    function createListConstraint(options) {
        return !isEmpty(options) ? new ListConstraint(normalizeListOptions(forceCast(options))) : null;
    }
    function findStep(constraint) {
        const c = constraint ? findConstraint(constraint, StepConstraint) : null;
        if (!c) return null;
        return c.step;
    }
    function getSuitableDecimalDigits(constraint, rawValue) {
        const sc = constraint && findConstraint(constraint, StepConstraint);
        if (sc) return getDecimalDigits(sc.step);
        return Math.max(getDecimalDigits(rawValue), 2);
    }
    function getBaseStep(constraint) {
        const step = findStep(constraint);
        return step !== null && step !== void 0 ? step : 1;
    }
    function getSuitableDraggingScale(constraint, rawValue) {
        var _a;
        const sc = constraint && findConstraint(constraint, StepConstraint);
        const base = Math.abs((_a = sc === null || sc === void 0 ? void 0 : sc.step) !== null && _a !== void 0 ? _a : rawValue);
        return base === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(base)) - 1);
    }
    const className$d = ClassName('ckb');
    class CheckboxView {
        constructor(doc, config){
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.element = doc.createElement('div');
            this.element.classList.add(className$d());
            config.viewProps.bindClassModifiers(this.element);
            const labelElem = doc.createElement('label');
            labelElem.classList.add(className$d('l'));
            this.element.appendChild(labelElem);
            const inputElem = doc.createElement('input');
            inputElem.classList.add(className$d('i'));
            inputElem.type = 'checkbox';
            labelElem.appendChild(inputElem);
            this.inputElement = inputElem;
            config.viewProps.bindDisabled(this.inputElement);
            const wrapperElem = doc.createElement('div');
            wrapperElem.classList.add(className$d('w'));
            labelElem.appendChild(wrapperElem);
            const markElem = createSvgIconElement(doc, 'check');
            wrapperElem.appendChild(markElem);
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.update_();
        }
        update_() {
            this.inputElement.checked = this.value.rawValue;
        }
        onValueChange_() {
            this.update_();
        }
    }
    class CheckboxController {
        constructor(doc, config){
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new CheckboxView(doc, {
                value: this.value,
                viewProps: this.viewProps
            });
            this.view.inputElement.addEventListener('change', this.onInputChange_);
        }
        onInputChange_(e) {
            const inputElem = forceCast(e.currentTarget);
            this.value.rawValue = inputElem.checked;
        }
    }
    function createConstraint$6(params) {
        const constraints = [];
        const lc = createListConstraint(params.options);
        if (lc) constraints.push(lc);
        return new CompositeConstraint(constraints);
    }
    const BooleanInputPlugin = {
        id: 'input-bool',
        type: 'input',
        accept: (value, params)=>{
            if (typeof value !== 'boolean') return null;
            const p = ParamsParsers;
            const result = parseParams(params, {
                options: p.optional.custom(parseListOptions)
            });
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            reader: (_args)=>boolFromUnknown
            ,
            constraint: (args)=>createConstraint$6(args.params)
            ,
            writer: (_args)=>writePrimitive
        },
        controller: (args)=>{
            const doc = args.document;
            const value = args.value;
            const c = args.constraint;
            const lc = c && findConstraint(c, ListConstraint);
            if (lc) return new ListController(doc, {
                props: new ValueMap({
                    options: lc.values.value('options')
                }),
                value: value,
                viewProps: args.viewProps
            });
            return new CheckboxController(doc, {
                value: value,
                viewProps: args.viewProps
            });
        }
    };
    const className$c = ClassName('col');
    class ColorView {
        constructor(doc, config){
            this.element = doc.createElement('div');
            this.element.classList.add(className$c());
            config.foldable.bindExpandedClass(this.element, className$c(undefined, 'expanded'));
            bindValueMap(config.foldable, 'completed', valueToClassName(this.element, className$c(undefined, 'cpl')));
            const headElem = doc.createElement('div');
            headElem.classList.add(className$c('h'));
            this.element.appendChild(headElem);
            const swatchElem = doc.createElement('div');
            swatchElem.classList.add(className$c('s'));
            headElem.appendChild(swatchElem);
            this.swatchElement = swatchElem;
            const textElem = doc.createElement('div');
            textElem.classList.add(className$c('t'));
            headElem.appendChild(textElem);
            this.textElement = textElem;
            if (config.pickerLayout === 'inline') {
                const pickerElem = doc.createElement('div');
                pickerElem.classList.add(className$c('p'));
                this.element.appendChild(pickerElem);
                this.pickerElement = pickerElem;
            } else this.pickerElement = null;
        }
    }
    function rgbToHslInt(r, g, b) {
        const rp = constrainRange(r / 255, 0, 1);
        const gp = constrainRange(g / 255, 0, 1);
        const bp = constrainRange(b / 255, 0, 1);
        const cmax = Math.max(rp, gp, bp);
        const cmin = Math.min(rp, gp, bp);
        const c = cmax - cmin;
        let h = 0;
        let s = 0;
        const l = (cmin + cmax) / 2;
        if (c !== 0) {
            s = c / (1 - Math.abs(cmax + cmin - 1));
            if (rp === cmax) h = (gp - bp) / c;
            else if (gp === cmax) h = 2 + (bp - rp) / c;
            else h = 4 + (rp - gp) / c;
            h = h / 6 + (h < 0 ? 1 : 0);
        }
        return [
            h * 360,
            s * 100,
            l * 100
        ];
    }
    function hslToRgbInt(h, s, l) {
        const hp = (h % 360 + 360) % 360;
        const sp = constrainRange(s / 100, 0, 1);
        const lp = constrainRange(l / 100, 0, 1);
        const c = (1 - Math.abs(2 * lp - 1)) * sp;
        const x = c * (1 - Math.abs(hp / 60 % 2 - 1));
        const m = lp - c / 2;
        let rp, gp, bp;
        if (hp >= 0 && hp < 60) [rp, gp, bp] = [
            c,
            x,
            0
        ];
        else if (hp >= 60 && hp < 120) [rp, gp, bp] = [
            x,
            c,
            0
        ];
        else if (hp >= 120 && hp < 180) [rp, gp, bp] = [
            0,
            c,
            x
        ];
        else if (hp >= 180 && hp < 240) [rp, gp, bp] = [
            0,
            x,
            c
        ];
        else if (hp >= 240 && hp < 300) [rp, gp, bp] = [
            x,
            0,
            c
        ];
        else [rp, gp, bp] = [
            c,
            0,
            x
        ];
        return [
            (rp + m) * 255,
            (gp + m) * 255,
            (bp + m) * 255
        ];
    }
    function rgbToHsvInt(r, g, b) {
        const rp = constrainRange(r / 255, 0, 1);
        const gp = constrainRange(g / 255, 0, 1);
        const bp = constrainRange(b / 255, 0, 1);
        const cmax = Math.max(rp, gp, bp);
        const cmin = Math.min(rp, gp, bp);
        const d = cmax - cmin;
        let h;
        if (d === 0) h = 0;
        else if (cmax === rp) h = 60 * (((gp - bp) / d % 6 + 6) % 6);
        else if (cmax === gp) h = 60 * ((bp - rp) / d + 2);
        else h = 60 * ((rp - gp) / d + 4);
        const s = cmax === 0 ? 0 : d / cmax;
        const v = cmax;
        return [
            h,
            s * 100,
            v * 100
        ];
    }
    function hsvToRgbInt(h, s, v) {
        const hp = loopRange(h, 360);
        const sp = constrainRange(s / 100, 0, 1);
        const vp = constrainRange(v / 100, 0, 1);
        const c = vp * sp;
        const x = c * (1 - Math.abs(hp / 60 % 2 - 1));
        const m = vp - c;
        let rp, gp, bp;
        if (hp >= 0 && hp < 60) [rp, gp, bp] = [
            c,
            x,
            0
        ];
        else if (hp >= 60 && hp < 120) [rp, gp, bp] = [
            x,
            c,
            0
        ];
        else if (hp >= 120 && hp < 180) [rp, gp, bp] = [
            0,
            c,
            x
        ];
        else if (hp >= 180 && hp < 240) [rp, gp, bp] = [
            0,
            x,
            c
        ];
        else if (hp >= 240 && hp < 300) [rp, gp, bp] = [
            x,
            0,
            c
        ];
        else [rp, gp, bp] = [
            c,
            0,
            x
        ];
        return [
            (rp + m) * 255,
            (gp + m) * 255,
            (bp + m) * 255
        ];
    }
    function hslToHsvInt(h, s, l) {
        const sd = l + s * (100 - Math.abs(2 * l - 100)) / 200;
        return [
            h,
            sd !== 0 ? s * (100 - Math.abs(2 * l - 100)) / sd : 0,
            l + s * (100 - Math.abs(2 * l - 100)) / 200, 
        ];
    }
    function hsvToHslInt(h, s, v) {
        const sd = 100 - Math.abs(v * (200 - s) / 100 - 100);
        return [
            h,
            sd !== 0 ? s * v / sd : 0,
            v * (200 - s) / 200
        ];
    }
    function removeAlphaComponent(comps) {
        return [
            comps[0],
            comps[1],
            comps[2]
        ];
    }
    function appendAlphaComponent(comps, alpha) {
        return [
            comps[0],
            comps[1],
            comps[2],
            alpha
        ];
    }
    const MODE_CONVERTER_MAP = {
        hsl: {
            hsl: (h, s, l)=>[
                    h,
                    s,
                    l
                ]
            ,
            hsv: hslToHsvInt,
            rgb: hslToRgbInt
        },
        hsv: {
            hsl: hsvToHslInt,
            hsv: (h, s, v)=>[
                    h,
                    s,
                    v
                ]
            ,
            rgb: hsvToRgbInt
        },
        rgb: {
            hsl: rgbToHslInt,
            hsv: rgbToHsvInt,
            rgb: (r, g, b)=>[
                    r,
                    g,
                    b
                ]
        }
    };
    function getColorMaxComponents(mode, type) {
        return [
            type === 'float' ? 1 : mode === 'rgb' ? 255 : 360,
            type === 'float' ? 1 : mode === 'rgb' ? 255 : 100,
            type === 'float' ? 1 : mode === 'rgb' ? 255 : 100, 
        ];
    }
    function loopHueRange(hue, max) {
        return hue === max ? max : loopRange(hue, max);
    }
    function constrainColorComponents(components, mode, type) {
        var _a;
        const ms = getColorMaxComponents(mode, type);
        return [
            mode === 'rgb' ? constrainRange(components[0], 0, ms[0]) : loopHueRange(components[0], ms[0]),
            constrainRange(components[1], 0, ms[1]),
            constrainRange(components[2], 0, ms[2]),
            constrainRange((_a = components[3]) !== null && _a !== void 0 ? _a : 1, 0, 1), 
        ];
    }
    function convertColorType(comps, mode, from, to) {
        const fms = getColorMaxComponents(mode, from);
        const tms = getColorMaxComponents(mode, to);
        return comps.map((c, index)=>c / fms[index] * tms[index]
        );
    }
    function convertColor(components, from, to) {
        const intComps = convertColorType(components, from.mode, from.type, 'int');
        const result = MODE_CONVERTER_MAP[from.mode][to.mode](...intComps);
        return convertColorType(result, to.mode, 'int', to.type);
    }
    function isRgbColorComponent(obj, key) {
        if (typeof obj !== 'object' || isEmpty(obj)) return false;
        return key in obj && typeof obj[key] === 'number';
    }
    class Color {
        constructor(comps, mode, type = 'int'){
            this.mode = mode;
            this.type = type;
            this.comps_ = constrainColorComponents(comps, mode, type);
        }
        static black(type = 'int') {
            return new Color([
                0,
                0,
                0
            ], 'rgb', type);
        }
        static fromObject(obj, type = 'int') {
            const comps = 'a' in obj ? [
                obj.r,
                obj.g,
                obj.b,
                obj.a
            ] : [
                obj.r,
                obj.g,
                obj.b
            ];
            return new Color(comps, 'rgb', type);
        }
        static toRgbaObject(color, type = 'int') {
            return color.toRgbaObject(type);
        }
        static isRgbColorObject(obj) {
            return isRgbColorComponent(obj, 'r') && isRgbColorComponent(obj, 'g') && isRgbColorComponent(obj, 'b');
        }
        static isRgbaColorObject(obj) {
            return this.isRgbColorObject(obj) && isRgbColorComponent(obj, 'a');
        }
        static isColorObject(obj) {
            return this.isRgbColorObject(obj);
        }
        static equals(v1, v2) {
            if (v1.mode !== v2.mode) return false;
            const comps1 = v1.comps_;
            const comps2 = v2.comps_;
            for(let i = 0; i < comps1.length; i++){
                if (comps1[i] !== comps2[i]) return false;
            }
            return true;
        }
        getComponents(opt_mode, type = 'int') {
            return appendAlphaComponent(convertColor(removeAlphaComponent(this.comps_), {
                mode: this.mode,
                type: this.type
            }, {
                mode: opt_mode !== null && opt_mode !== void 0 ? opt_mode : this.mode,
                type: type
            }), this.comps_[3]);
        }
        toRgbaObject(type = 'int') {
            const rgbComps = this.getComponents('rgb', type);
            return {
                r: rgbComps[0],
                g: rgbComps[1],
                b: rgbComps[2],
                a: rgbComps[3]
            };
        }
    }
    const className$b = ClassName('colp');
    class ColorPickerView {
        constructor(doc, config){
            this.alphaViews_ = null;
            this.element = doc.createElement('div');
            this.element.classList.add(className$b());
            config.viewProps.bindClassModifiers(this.element);
            const hsvElem = doc.createElement('div');
            hsvElem.classList.add(className$b('hsv'));
            const svElem = doc.createElement('div');
            svElem.classList.add(className$b('sv'));
            this.svPaletteView_ = config.svPaletteView;
            svElem.appendChild(this.svPaletteView_.element);
            hsvElem.appendChild(svElem);
            const hElem = doc.createElement('div');
            hElem.classList.add(className$b('h'));
            this.hPaletteView_ = config.hPaletteView;
            hElem.appendChild(this.hPaletteView_.element);
            hsvElem.appendChild(hElem);
            this.element.appendChild(hsvElem);
            const rgbElem = doc.createElement('div');
            rgbElem.classList.add(className$b('rgb'));
            this.textView_ = config.textView;
            rgbElem.appendChild(this.textView_.element);
            this.element.appendChild(rgbElem);
            if (config.alphaViews) {
                this.alphaViews_ = {
                    palette: config.alphaViews.palette,
                    text: config.alphaViews.text
                };
                const aElem = doc.createElement('div');
                aElem.classList.add(className$b('a'));
                const apElem = doc.createElement('div');
                apElem.classList.add(className$b('ap'));
                apElem.appendChild(this.alphaViews_.palette.element);
                aElem.appendChild(apElem);
                const atElem = doc.createElement('div');
                atElem.classList.add(className$b('at'));
                atElem.appendChild(this.alphaViews_.text.element);
                aElem.appendChild(atElem);
                this.element.appendChild(aElem);
            }
        }
        get allFocusableElements() {
            const elems = [
                this.svPaletteView_.element,
                this.hPaletteView_.element,
                this.textView_.modeSelectElement,
                ...this.textView_.textViews.map((v)=>v.inputElement
                ), 
            ];
            if (this.alphaViews_) elems.push(this.alphaViews_.palette.element, this.alphaViews_.text.inputElement);
            return elems;
        }
    }
    function parseColorType(value) {
        return value === 'int' ? 'int' : value === 'float' ? 'float' : undefined;
    }
    function parseColorInputParams(params) {
        const p = ParamsParsers;
        return parseParams(params, {
            alpha: p.optional.boolean,
            color: p.optional.object({
                alpha: p.optional.boolean,
                type: p.optional.custom(parseColorType)
            }),
            expanded: p.optional.boolean,
            picker: p.optional.custom(parsePickerLayout)
        });
    }
    function getBaseStepForColor(forAlpha) {
        return forAlpha ? 0.1 : 1;
    }
    function extractColorType(params) {
        var _a;
        return (_a = params.color) === null || _a === void 0 ? void 0 : _a.type;
    }
    function equalsStringColorFormat(f1, f2) {
        return f1.alpha === f2.alpha && f1.mode === f2.mode && f1.notation === f2.notation && f1.type === f2.type;
    }
    function parseCssNumberOrPercentage(text, maxValue) {
        const m = text.match(/^(.+)%$/);
        if (!m) return Math.min(parseFloat(text), maxValue);
        return Math.min(parseFloat(m[1]) * 0.01 * maxValue, maxValue);
    }
    const ANGLE_TO_DEG_MAP = {
        deg: (angle)=>angle
        ,
        grad: (angle)=>angle * 360 / 400
        ,
        rad: (angle)=>angle * 360 / (2 * Math.PI)
        ,
        turn: (angle)=>angle * 360
    };
    function parseCssNumberOrAngle(text) {
        const m = text.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);
        if (!m) return parseFloat(text);
        const angle = parseFloat(m[1]);
        const unit = m[2];
        return ANGLE_TO_DEG_MAP[unit](angle);
    }
    function parseFunctionalRgbColorComponents(text) {
        const m = text.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
        if (!m) return null;
        const comps = [
            parseCssNumberOrPercentage(m[1], 255),
            parseCssNumberOrPercentage(m[2], 255),
            parseCssNumberOrPercentage(m[3], 255), 
        ];
        if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) return null;
        return comps;
    }
    function createFunctionalRgbColorParser(type) {
        return (text)=>{
            const comps = parseFunctionalRgbColorComponents(text);
            return comps ? new Color(comps, 'rgb', type) : null;
        };
    }
    function parseFunctionalRgbaColorComponents(text) {
        const m = text.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
        if (!m) return null;
        const comps = [
            parseCssNumberOrPercentage(m[1], 255),
            parseCssNumberOrPercentage(m[2], 255),
            parseCssNumberOrPercentage(m[3], 255),
            parseCssNumberOrPercentage(m[4], 1), 
        ];
        if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) return null;
        return comps;
    }
    function createFunctionalRgbaColorParser(type) {
        return (text)=>{
            const comps = parseFunctionalRgbaColorComponents(text);
            return comps ? new Color(comps, 'rgb', type) : null;
        };
    }
    function parseHslColorComponents(text) {
        const m = text.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
        if (!m) return null;
        const comps = [
            parseCssNumberOrAngle(m[1]),
            parseCssNumberOrPercentage(m[2], 100),
            parseCssNumberOrPercentage(m[3], 100), 
        ];
        if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) return null;
        return comps;
    }
    function createHslColorParser(type) {
        return (text)=>{
            const comps = parseHslColorComponents(text);
            return comps ? new Color(comps, 'hsl', type) : null;
        };
    }
    function parseHslaColorComponents(text) {
        const m = text.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
        if (!m) return null;
        const comps = [
            parseCssNumberOrAngle(m[1]),
            parseCssNumberOrPercentage(m[2], 100),
            parseCssNumberOrPercentage(m[3], 100),
            parseCssNumberOrPercentage(m[4], 1), 
        ];
        if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) return null;
        return comps;
    }
    function createHslaColorParser(type) {
        return (text)=>{
            const comps = parseHslaColorComponents(text);
            return comps ? new Color(comps, 'hsl', type) : null;
        };
    }
    function parseHexRgbColorComponents(text) {
        const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
        if (mRgb) return [
            parseInt(mRgb[1] + mRgb[1], 16),
            parseInt(mRgb[2] + mRgb[2], 16),
            parseInt(mRgb[3] + mRgb[3], 16), 
        ];
        const mRrggbb = text.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
        if (mRrggbb) return [
            parseInt(mRrggbb[1], 16),
            parseInt(mRrggbb[2], 16),
            parseInt(mRrggbb[3], 16), 
        ];
        return null;
    }
    function parseHexRgbColor(text) {
        const comps = parseHexRgbColorComponents(text);
        return comps ? new Color(comps, 'rgb', 'int') : null;
    }
    function parseHexRgbaColorComponents(text) {
        const mRgb = text.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
        if (mRgb) return [
            parseInt(mRgb[1] + mRgb[1], 16),
            parseInt(mRgb[2] + mRgb[2], 16),
            parseInt(mRgb[3] + mRgb[3], 16),
            mapRange(parseInt(mRgb[4] + mRgb[4], 16), 0, 255, 0, 1), 
        ];
        const mRrggbb = text.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
        if (mRrggbb) return [
            parseInt(mRrggbb[1], 16),
            parseInt(mRrggbb[2], 16),
            parseInt(mRrggbb[3], 16),
            mapRange(parseInt(mRrggbb[4], 16), 0, 255, 0, 1), 
        ];
        return null;
    }
    function parseHexRgbaColor(text) {
        const comps = parseHexRgbaColorComponents(text);
        return comps ? new Color(comps, 'rgb', 'int') : null;
    }
    function parseObjectRgbColorComponents(text) {
        const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
        if (!m) return null;
        const comps = [
            parseFloat(m[1]),
            parseFloat(m[2]),
            parseFloat(m[3]), 
        ];
        if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) return null;
        return comps;
    }
    function createObjectRgbColorParser(type) {
        return (text)=>{
            const comps = parseObjectRgbColorComponents(text);
            return comps ? new Color(comps, 'rgb', type) : null;
        };
    }
    function parseObjectRgbaColorComponents(text) {
        const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
        if (!m) return null;
        const comps = [
            parseFloat(m[1]),
            parseFloat(m[2]),
            parseFloat(m[3]),
            parseFloat(m[4]), 
        ];
        if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) return null;
        return comps;
    }
    function createObjectRgbaColorParser(type) {
        return (text)=>{
            const comps = parseObjectRgbaColorComponents(text);
            return comps ? new Color(comps, 'rgb', type) : null;
        };
    }
    const PARSER_AND_RESULT = [
        {
            parser: parseHexRgbColorComponents,
            result: {
                alpha: false,
                mode: 'rgb',
                notation: 'hex'
            }
        },
        {
            parser: parseHexRgbaColorComponents,
            result: {
                alpha: true,
                mode: 'rgb',
                notation: 'hex'
            }
        },
        {
            parser: parseFunctionalRgbColorComponents,
            result: {
                alpha: false,
                mode: 'rgb',
                notation: 'func'
            }
        },
        {
            parser: parseFunctionalRgbaColorComponents,
            result: {
                alpha: true,
                mode: 'rgb',
                notation: 'func'
            }
        },
        {
            parser: parseHslColorComponents,
            result: {
                alpha: false,
                mode: 'hsl',
                notation: 'func'
            }
        },
        {
            parser: parseHslaColorComponents,
            result: {
                alpha: true,
                mode: 'hsl',
                notation: 'func'
            }
        },
        {
            parser: parseObjectRgbColorComponents,
            result: {
                alpha: false,
                mode: 'rgb',
                notation: 'object'
            }
        },
        {
            parser: parseObjectRgbaColorComponents,
            result: {
                alpha: true,
                mode: 'rgb',
                notation: 'object'
            }
        }, 
    ];
    function detectStringColor(text) {
        return PARSER_AND_RESULT.reduce((prev, { parser: parser , result: detection  })=>{
            if (prev) return prev;
            return parser(text) ? detection : null;
        }, null);
    }
    function detectStringColorFormat(text, type = 'int') {
        const r = detectStringColor(text);
        if (!r) return null;
        if (r.notation === 'hex' && type !== 'float') return Object.assign(Object.assign({
        }, r), {
            type: 'int'
        });
        if (r.notation === 'func') return Object.assign(Object.assign({
        }, r), {
            type: type
        });
        return null;
    }
    const TYPE_TO_PARSERS = {
        int: [
            parseHexRgbColor,
            parseHexRgbaColor,
            createFunctionalRgbColorParser('int'),
            createFunctionalRgbaColorParser('int'),
            createHslColorParser('int'),
            createHslaColorParser('int'),
            createObjectRgbColorParser('int'),
            createObjectRgbaColorParser('int'), 
        ],
        float: [
            createFunctionalRgbColorParser('float'),
            createFunctionalRgbaColorParser('float'),
            createHslColorParser('float'),
            createHslaColorParser('float'),
            createObjectRgbColorParser('float'),
            createObjectRgbaColorParser('float'), 
        ]
    };
    function createColorStringBindingReader(type) {
        const parsers = TYPE_TO_PARSERS[type];
        return (value)=>{
            if (typeof value !== 'string') return Color.black(type);
            const result = parsers.reduce((prev, parser)=>{
                if (prev) return prev;
                return parser(value);
            }, null);
            return result !== null && result !== void 0 ? result : Color.black(type);
        };
    }
    function createColorStringParser(type) {
        const parsers = TYPE_TO_PARSERS[type];
        return (value)=>{
            return parsers.reduce((prev, parser)=>{
                if (prev) return prev;
                return parser(value);
            }, null);
        };
    }
    function zerofill(comp) {
        const hex = constrainRange(Math.floor(comp), 0, 255).toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    }
    function colorToHexRgbString(value, prefix = '#') {
        const hexes = removeAlphaComponent(value.getComponents('rgb')).map(zerofill).join('');
        return `${prefix}${hexes}`;
    }
    function colorToHexRgbaString(value, prefix = '#') {
        const rgbaComps = value.getComponents('rgb');
        const hexes = [
            rgbaComps[0],
            rgbaComps[1],
            rgbaComps[2],
            rgbaComps[3] * 255
        ].map(zerofill).join('');
        return `${prefix}${hexes}`;
    }
    function colorToFunctionalRgbString(value, opt_type) {
        const formatter = createNumberFormatter(opt_type === 'float' ? 2 : 0);
        const comps = removeAlphaComponent(value.getComponents('rgb', opt_type)).map((comp)=>formatter(comp)
        );
        return `rgb(${comps.join(', ')})`;
    }
    function createFunctionalRgbColorFormatter(type) {
        return (value)=>{
            return colorToFunctionalRgbString(value, type);
        };
    }
    function colorToFunctionalRgbaString(value, opt_type) {
        const aFormatter = createNumberFormatter(2);
        const rgbFormatter = createNumberFormatter(opt_type === 'float' ? 2 : 0);
        const comps = value.getComponents('rgb', opt_type).map((comp, index)=>{
            const formatter = index === 3 ? aFormatter : rgbFormatter;
            return formatter(comp);
        });
        return `rgba(${comps.join(', ')})`;
    }
    function createFunctionalRgbaColorFormatter(type) {
        return (value)=>{
            return colorToFunctionalRgbaString(value, type);
        };
    }
    function colorToFunctionalHslString(value) {
        const formatters = [
            createNumberFormatter(0),
            formatPercentage,
            formatPercentage, 
        ];
        const comps = removeAlphaComponent(value.getComponents('hsl')).map((comp, index)=>formatters[index](comp)
        );
        return `hsl(${comps.join(', ')})`;
    }
    function colorToFunctionalHslaString(value) {
        const formatters = [
            createNumberFormatter(0),
            formatPercentage,
            formatPercentage,
            createNumberFormatter(2), 
        ];
        const comps = value.getComponents('hsl').map((comp, index)=>formatters[index](comp)
        );
        return `hsla(${comps.join(', ')})`;
    }
    function colorToObjectRgbString(value, type) {
        const formatter = createNumberFormatter(type === 'float' ? 2 : 0);
        const names = [
            'r',
            'g',
            'b'
        ];
        const comps = removeAlphaComponent(value.getComponents('rgb', type)).map((comp, index)=>`${names[index]}: ${formatter(comp)}`
        );
        return `{${comps.join(', ')}}`;
    }
    function createObjectRgbColorFormatter(type) {
        return (value)=>colorToObjectRgbString(value, type)
        ;
    }
    function colorToObjectRgbaString(value, type) {
        const aFormatter = createNumberFormatter(2);
        const rgbFormatter = createNumberFormatter(type === 'float' ? 2 : 0);
        const names = [
            'r',
            'g',
            'b',
            'a'
        ];
        const comps = value.getComponents('rgb', type).map((comp, index)=>{
            const formatter = index === 3 ? aFormatter : rgbFormatter;
            return `${names[index]}: ${formatter(comp)}`;
        });
        return `{${comps.join(', ')}}`;
    }
    function createObjectRgbaColorFormatter(type) {
        return (value)=>colorToObjectRgbaString(value, type)
        ;
    }
    const FORMAT_AND_STRINGIFIERS = [
        {
            format: {
                alpha: false,
                mode: 'rgb',
                notation: 'hex',
                type: 'int'
            },
            stringifier: colorToHexRgbString
        },
        {
            format: {
                alpha: true,
                mode: 'rgb',
                notation: 'hex',
                type: 'int'
            },
            stringifier: colorToHexRgbaString
        },
        {
            format: {
                alpha: false,
                mode: 'hsl',
                notation: 'func',
                type: 'int'
            },
            stringifier: colorToFunctionalHslString
        },
        {
            format: {
                alpha: true,
                mode: 'hsl',
                notation: 'func',
                type: 'int'
            },
            stringifier: colorToFunctionalHslaString
        },
        ...[
            'int',
            'float'
        ].reduce((prev, type)=>{
            return [
                ...prev,
                {
                    format: {
                        alpha: false,
                        mode: 'rgb',
                        notation: 'func',
                        type: type
                    },
                    stringifier: createFunctionalRgbColorFormatter(type)
                },
                {
                    format: {
                        alpha: true,
                        mode: 'rgb',
                        notation: 'func',
                        type: type
                    },
                    stringifier: createFunctionalRgbaColorFormatter(type)
                },
                {
                    format: {
                        alpha: false,
                        mode: 'rgb',
                        notation: 'object',
                        type: type
                    },
                    stringifier: createObjectRgbColorFormatter(type)
                },
                {
                    format: {
                        alpha: true,
                        mode: 'rgb',
                        notation: 'object',
                        type: type
                    },
                    stringifier: createObjectRgbaColorFormatter(type)
                }, 
            ];
        }, []), 
    ];
    function findColorStringifier(format) {
        return FORMAT_AND_STRINGIFIERS.reduce((prev, fas)=>{
            if (prev) return prev;
            return equalsStringColorFormat(fas.format, format) ? fas.stringifier : null;
        }, null);
    }
    const className$a = ClassName('apl');
    class APaletteView {
        constructor(doc, config){
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$a());
            config.viewProps.bindClassModifiers(this.element);
            config.viewProps.bindTabIndex(this.element);
            const barElem = doc.createElement('div');
            barElem.classList.add(className$a('b'));
            this.element.appendChild(barElem);
            const colorElem = doc.createElement('div');
            colorElem.classList.add(className$a('c'));
            barElem.appendChild(colorElem);
            this.colorElem_ = colorElem;
            const markerElem = doc.createElement('div');
            markerElem.classList.add(className$a('m'));
            this.element.appendChild(markerElem);
            this.markerElem_ = markerElem;
            const previewElem = doc.createElement('div');
            previewElem.classList.add(className$a('p'));
            this.markerElem_.appendChild(previewElem);
            this.previewElem_ = previewElem;
            this.update_();
        }
        update_() {
            const c = this.value.rawValue;
            const rgbaComps = c.getComponents('rgb');
            const leftColor = new Color([
                rgbaComps[0],
                rgbaComps[1],
                rgbaComps[2],
                0
            ], 'rgb');
            const rightColor = new Color([
                rgbaComps[0],
                rgbaComps[1],
                rgbaComps[2],
                255
            ], 'rgb');
            const gradientComps = [
                'to right',
                colorToFunctionalRgbaString(leftColor),
                colorToFunctionalRgbaString(rightColor), 
            ];
            this.colorElem_.style.background = `linear-gradient(${gradientComps.join(',')})`;
            this.previewElem_.style.backgroundColor = colorToFunctionalRgbaString(c);
            const left = mapRange(rgbaComps[3], 0, 1, 0, 100);
            this.markerElem_.style.left = `${left}%`;
        }
        onValueChange_() {
            this.update_();
        }
    }
    class APaletteController {
        constructor(doc, config){
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onKeyUp_ = this.onKeyUp_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new APaletteView(doc, {
                value: this.value,
                viewProps: this.viewProps
            });
            this.ptHandler_ = new PointerHandler(this.view.element);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.element.addEventListener('keydown', this.onKeyDown_);
            this.view.element.addEventListener('keyup', this.onKeyUp_);
        }
        handlePointerEvent_(d, opts) {
            if (!d.point) return;
            const alpha = d.point.x / d.bounds.width;
            const c = this.value.rawValue;
            const [h, s, v] = c.getComponents('hsv');
            this.value.setRawValue(new Color([
                h,
                s,
                v,
                alpha
            ], 'hsv'), opts);
        }
        onPointerDown_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false
            });
        }
        onPointerMove_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false
            });
        }
        onPointerUp_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: true,
                last: true
            });
        }
        onKeyDown_(ev) {
            const step = getStepForKey(getBaseStepForColor(true), getHorizontalStepKeys(ev));
            if (step === 0) return;
            const c = this.value.rawValue;
            const [h, s, v, a] = c.getComponents('hsv');
            this.value.setRawValue(new Color([
                h,
                s,
                v,
                a + step
            ], 'hsv'), {
                forceEmit: false,
                last: false
            });
        }
        onKeyUp_(ev) {
            const step = getStepForKey(getBaseStepForColor(true), getHorizontalStepKeys(ev));
            if (step === 0) return;
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true
            });
        }
    }
    const className$9 = ClassName('coltxt');
    function createModeSelectElement(doc) {
        const selectElem = doc.createElement('select');
        const items = [
            {
                text: 'RGB',
                value: 'rgb'
            },
            {
                text: 'HSL',
                value: 'hsl'
            },
            {
                text: 'HSV',
                value: 'hsv'
            }, 
        ];
        selectElem.appendChild(items.reduce((frag, item)=>{
            const optElem = doc.createElement('option');
            optElem.textContent = item.text;
            optElem.value = item.value;
            frag.appendChild(optElem);
            return frag;
        }, doc.createDocumentFragment()));
        return selectElem;
    }
    class ColorTextView {
        constructor(doc, config){
            this.element = doc.createElement('div');
            this.element.classList.add(className$9());
            config.viewProps.bindClassModifiers(this.element);
            const modeElem = doc.createElement('div');
            modeElem.classList.add(className$9('m'));
            this.modeElem_ = createModeSelectElement(doc);
            this.modeElem_.classList.add(className$9('ms'));
            modeElem.appendChild(this.modeSelectElement);
            config.viewProps.bindDisabled(this.modeElem_);
            const modeMarkerElem = doc.createElement('div');
            modeMarkerElem.classList.add(className$9('mm'));
            modeMarkerElem.appendChild(createSvgIconElement(doc, 'dropdown'));
            modeElem.appendChild(modeMarkerElem);
            this.element.appendChild(modeElem);
            const textsElem = doc.createElement('div');
            textsElem.classList.add(className$9('w'));
            this.element.appendChild(textsElem);
            this.textsElem_ = textsElem;
            this.textViews_ = config.textViews;
            this.applyTextViews_();
            bindValue(config.colorMode, (mode)=>{
                this.modeElem_.value = mode;
            });
        }
        get modeSelectElement() {
            return this.modeElem_;
        }
        get textViews() {
            return this.textViews_;
        }
        set textViews(textViews) {
            this.textViews_ = textViews;
            this.applyTextViews_();
        }
        applyTextViews_() {
            removeChildElements(this.textsElem_);
            const doc = this.element.ownerDocument;
            this.textViews_.forEach((v)=>{
                const compElem = doc.createElement('div');
                compElem.classList.add(className$9('c'));
                compElem.appendChild(v.element);
                this.textsElem_.appendChild(compElem);
            });
        }
    }
    function createFormatter$2(type) {
        return createNumberFormatter(type === 'float' ? 2 : 0);
    }
    function createConstraint$5(mode, type, index) {
        const max = getColorMaxComponents(mode, type)[index];
        return new DefiniteRangeConstraint({
            min: 0,
            max: max
        });
    }
    function createComponentController(doc, config, index) {
        return new NumberTextController(doc, {
            arrayPosition: index === 0 ? 'fst' : index === 2 ? 'lst' : 'mid',
            baseStep: getBaseStepForColor(false),
            parser: config.parser,
            props: ValueMap.fromObject({
                draggingScale: config.colorType === 'float' ? 0.01 : 1,
                formatter: createFormatter$2(config.colorType)
            }),
            value: createValue(0, {
                constraint: createConstraint$5(config.colorMode, config.colorType, index)
            }),
            viewProps: config.viewProps
        });
    }
    class ColorTextController {
        constructor(doc, config){
            this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);
            this.colorType_ = config.colorType;
            this.parser_ = config.parser;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.colorMode = createValue(this.value.rawValue.mode);
            this.ccs_ = this.createComponentControllers_(doc);
            this.view = new ColorTextView(doc, {
                colorMode: this.colorMode,
                textViews: [
                    this.ccs_[0].view,
                    this.ccs_[1].view,
                    this.ccs_[2].view
                ],
                viewProps: this.viewProps
            });
            this.view.modeSelectElement.addEventListener('change', this.onModeSelectChange_);
        }
        createComponentControllers_(doc) {
            const cc = {
                colorMode: this.colorMode.rawValue,
                colorType: this.colorType_,
                parser: this.parser_,
                viewProps: this.viewProps
            };
            const ccs = [
                createComponentController(doc, cc, 0),
                createComponentController(doc, cc, 1),
                createComponentController(doc, cc, 2), 
            ];
            ccs.forEach((cs, index)=>{
                connectValues({
                    primary: this.value,
                    secondary: cs.value,
                    forward: (p)=>{
                        return p.rawValue.getComponents(this.colorMode.rawValue, this.colorType_)[index];
                    },
                    backward: (p, s)=>{
                        const pickedMode = this.colorMode.rawValue;
                        const comps = p.rawValue.getComponents(pickedMode, this.colorType_);
                        comps[index] = s.rawValue;
                        return new Color(appendAlphaComponent(removeAlphaComponent(comps), comps[3]), pickedMode, this.colorType_);
                    }
                });
            });
            return ccs;
        }
        onModeSelectChange_(ev) {
            const selectElem = ev.currentTarget;
            this.colorMode.rawValue = selectElem.value;
            this.ccs_ = this.createComponentControllers_(this.view.element.ownerDocument);
            this.view.textViews = [
                this.ccs_[0].view,
                this.ccs_[1].view,
                this.ccs_[2].view, 
            ];
        }
    }
    const className$8 = ClassName('hpl');
    class HPaletteView {
        constructor(doc, config){
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$8());
            config.viewProps.bindClassModifiers(this.element);
            config.viewProps.bindTabIndex(this.element);
            const colorElem = doc.createElement('div');
            colorElem.classList.add(className$8('c'));
            this.element.appendChild(colorElem);
            const markerElem = doc.createElement('div');
            markerElem.classList.add(className$8('m'));
            this.element.appendChild(markerElem);
            this.markerElem_ = markerElem;
            this.update_();
        }
        update_() {
            const c = this.value.rawValue;
            const [h] = c.getComponents('hsv');
            this.markerElem_.style.backgroundColor = colorToFunctionalRgbString(new Color([
                h,
                100,
                100
            ], 'hsv'));
            const left = mapRange(h, 0, 360, 0, 100);
            this.markerElem_.style.left = `${left}%`;
        }
        onValueChange_() {
            this.update_();
        }
    }
    class HPaletteController {
        constructor(doc, config){
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onKeyUp_ = this.onKeyUp_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new HPaletteView(doc, {
                value: this.value,
                viewProps: this.viewProps
            });
            this.ptHandler_ = new PointerHandler(this.view.element);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.element.addEventListener('keydown', this.onKeyDown_);
            this.view.element.addEventListener('keyup', this.onKeyUp_);
        }
        handlePointerEvent_(d, opts) {
            if (!d.point) return;
            const hue = mapRange(constrainRange(d.point.x, 0, d.bounds.width), 0, d.bounds.width, 0, 360);
            const c = this.value.rawValue;
            const [, s, v, a] = c.getComponents('hsv');
            this.value.setRawValue(new Color([
                hue,
                s,
                v,
                a
            ], 'hsv'), opts);
        }
        onPointerDown_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false
            });
        }
        onPointerMove_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false
            });
        }
        onPointerUp_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: true,
                last: true
            });
        }
        onKeyDown_(ev) {
            const step = getStepForKey(getBaseStepForColor(false), getHorizontalStepKeys(ev));
            if (step === 0) return;
            const c = this.value.rawValue;
            const [h, s, v, a] = c.getComponents('hsv');
            this.value.setRawValue(new Color([
                h + step,
                s,
                v,
                a
            ], 'hsv'), {
                forceEmit: false,
                last: false
            });
        }
        onKeyUp_(ev) {
            const step = getStepForKey(getBaseStepForColor(false), getHorizontalStepKeys(ev));
            if (step === 0) return;
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true
            });
        }
    }
    const className$7 = ClassName('svp');
    const CANVAS_RESOL = 64;
    class SvPaletteView {
        constructor(doc, config){
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$7());
            config.viewProps.bindClassModifiers(this.element);
            config.viewProps.bindTabIndex(this.element);
            const canvasElem = doc.createElement('canvas');
            canvasElem.height = CANVAS_RESOL;
            canvasElem.width = CANVAS_RESOL;
            canvasElem.classList.add(className$7('c'));
            this.element.appendChild(canvasElem);
            this.canvasElement = canvasElem;
            const markerElem = doc.createElement('div');
            markerElem.classList.add(className$7('m'));
            this.element.appendChild(markerElem);
            this.markerElem_ = markerElem;
            this.update_();
        }
        update_() {
            const ctx = getCanvasContext(this.canvasElement);
            if (!ctx) return;
            const c = this.value.rawValue;
            const hsvComps = c.getComponents('hsv');
            const width = this.canvasElement.width;
            const height = this.canvasElement.height;
            const imgData = ctx.getImageData(0, 0, width, height);
            const data = imgData.data;
            for(let iy = 0; iy < height; iy++)for(let ix = 0; ix < width; ix++){
                const s = mapRange(ix, 0, width, 0, 100);
                const v = mapRange(iy, 0, height, 100, 0);
                const rgbComps = hsvToRgbInt(hsvComps[0], s, v);
                const i = (iy * width + ix) * 4;
                data[i] = rgbComps[0];
                data[i + 1] = rgbComps[1];
                data[i + 2] = rgbComps[2];
                data[i + 3] = 255;
            }
            ctx.putImageData(imgData, 0, 0);
            const left = mapRange(hsvComps[1], 0, 100, 0, 100);
            this.markerElem_.style.left = `${left}%`;
            const top = mapRange(hsvComps[2], 0, 100, 100, 0);
            this.markerElem_.style.top = `${top}%`;
        }
        onValueChange_() {
            this.update_();
        }
    }
    class SvPaletteController {
        constructor(doc, config){
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onKeyUp_ = this.onKeyUp_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new SvPaletteView(doc, {
                value: this.value,
                viewProps: this.viewProps
            });
            this.ptHandler_ = new PointerHandler(this.view.element);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.element.addEventListener('keydown', this.onKeyDown_);
            this.view.element.addEventListener('keyup', this.onKeyUp_);
        }
        handlePointerEvent_(d, opts) {
            if (!d.point) return;
            const saturation = mapRange(d.point.x, 0, d.bounds.width, 0, 100);
            const value = mapRange(d.point.y, 0, d.bounds.height, 100, 0);
            const [h, , , a] = this.value.rawValue.getComponents('hsv');
            this.value.setRawValue(new Color([
                h,
                saturation,
                value,
                a
            ], 'hsv'), opts);
        }
        onPointerDown_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false
            });
        }
        onPointerMove_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false
            });
        }
        onPointerUp_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: true,
                last: true
            });
        }
        onKeyDown_(ev) {
            if (isArrowKey(ev.key)) ev.preventDefault();
            const [h, s, v, a] = this.value.rawValue.getComponents('hsv');
            const baseStep = getBaseStepForColor(false);
            const ds = getStepForKey(baseStep, getHorizontalStepKeys(ev));
            const dv = getStepForKey(baseStep, getVerticalStepKeys(ev));
            if (ds === 0 && dv === 0) return;
            this.value.setRawValue(new Color([
                h,
                s + ds,
                v + dv,
                a
            ], 'hsv'), {
                forceEmit: false,
                last: false
            });
        }
        onKeyUp_(ev) {
            const baseStep = getBaseStepForColor(false);
            const ds = getStepForKey(baseStep, getHorizontalStepKeys(ev));
            const dv = getStepForKey(baseStep, getVerticalStepKeys(ev));
            if (ds === 0 && dv === 0) return;
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true
            });
        }
    }
    class ColorPickerController {
        constructor(doc, config){
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.hPaletteC_ = new HPaletteController(doc, {
                value: this.value,
                viewProps: this.viewProps
            });
            this.svPaletteC_ = new SvPaletteController(doc, {
                value: this.value,
                viewProps: this.viewProps
            });
            this.alphaIcs_ = config.supportsAlpha ? {
                palette: new APaletteController(doc, {
                    value: this.value,
                    viewProps: this.viewProps
                }),
                text: new NumberTextController(doc, {
                    parser: parseNumber,
                    baseStep: 0.1,
                    props: ValueMap.fromObject({
                        draggingScale: 0.01,
                        formatter: createNumberFormatter(2)
                    }),
                    value: createValue(0, {
                        constraint: new DefiniteRangeConstraint({
                            min: 0,
                            max: 1
                        })
                    }),
                    viewProps: this.viewProps
                })
            } : null;
            if (this.alphaIcs_) connectValues({
                primary: this.value,
                secondary: this.alphaIcs_.text.value,
                forward: (p)=>{
                    return p.rawValue.getComponents()[3];
                },
                backward: (p, s)=>{
                    const comps = p.rawValue.getComponents();
                    comps[3] = s.rawValue;
                    return new Color(comps, p.rawValue.mode);
                }
            });
            this.textC_ = new ColorTextController(doc, {
                colorType: config.colorType,
                parser: parseNumber,
                value: this.value,
                viewProps: this.viewProps
            });
            this.view = new ColorPickerView(doc, {
                alphaViews: this.alphaIcs_ ? {
                    palette: this.alphaIcs_.palette.view,
                    text: this.alphaIcs_.text.view
                } : null,
                hPaletteView: this.hPaletteC_.view,
                supportsAlpha: config.supportsAlpha,
                svPaletteView: this.svPaletteC_.view,
                textView: this.textC_.view,
                viewProps: this.viewProps
            });
        }
        get textController() {
            return this.textC_;
        }
    }
    const className$6 = ClassName('colsw');
    class ColorSwatchView {
        constructor(doc, config){
            this.onValueChange_ = this.onValueChange_.bind(this);
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.element = doc.createElement('div');
            this.element.classList.add(className$6());
            config.viewProps.bindClassModifiers(this.element);
            const swatchElem = doc.createElement('div');
            swatchElem.classList.add(className$6('sw'));
            this.element.appendChild(swatchElem);
            this.swatchElem_ = swatchElem;
            const buttonElem = doc.createElement('button');
            buttonElem.classList.add(className$6('b'));
            config.viewProps.bindDisabled(buttonElem);
            this.element.appendChild(buttonElem);
            this.buttonElement = buttonElem;
            this.update_();
        }
        update_() {
            const value = this.value.rawValue;
            this.swatchElem_.style.backgroundColor = colorToHexRgbaString(value);
        }
        onValueChange_() {
            this.update_();
        }
    }
    class ColorSwatchController {
        constructor(doc, config){
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new ColorSwatchView(doc, {
                value: this.value,
                viewProps: this.viewProps
            });
        }
    }
    class ColorController {
        constructor(doc, config){
            this.onButtonBlur_ = this.onButtonBlur_.bind(this);
            this.onButtonClick_ = this.onButtonClick_.bind(this);
            this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
            this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.foldable_ = Foldable.create(config.expanded);
            this.swatchC_ = new ColorSwatchController(doc, {
                value: this.value,
                viewProps: this.viewProps
            });
            const buttonElem = this.swatchC_.view.buttonElement;
            buttonElem.addEventListener('blur', this.onButtonBlur_);
            buttonElem.addEventListener('click', this.onButtonClick_);
            this.textC_ = new TextController(doc, {
                parser: config.parser,
                props: ValueMap.fromObject({
                    formatter: config.formatter
                }),
                value: this.value,
                viewProps: this.viewProps
            });
            this.view = new ColorView(doc, {
                foldable: this.foldable_,
                pickerLayout: config.pickerLayout
            });
            this.view.swatchElement.appendChild(this.swatchC_.view.element);
            this.view.textElement.appendChild(this.textC_.view.element);
            this.popC_ = config.pickerLayout === 'popup' ? new PopupController(doc, {
                viewProps: this.viewProps
            }) : null;
            const pickerC = new ColorPickerController(doc, {
                colorType: config.colorType,
                supportsAlpha: config.supportsAlpha,
                value: this.value,
                viewProps: this.viewProps
            });
            pickerC.view.allFocusableElements.forEach((elem)=>{
                elem.addEventListener('blur', this.onPopupChildBlur_);
                elem.addEventListener('keydown', this.onPopupChildKeydown_);
            });
            this.pickerC_ = pickerC;
            if (this.popC_) {
                this.view.element.appendChild(this.popC_.view.element);
                this.popC_.view.element.appendChild(pickerC.view.element);
                connectValues({
                    primary: this.foldable_.value('expanded'),
                    secondary: this.popC_.shows,
                    forward: (p)=>p.rawValue
                    ,
                    backward: (_, s)=>s.rawValue
                });
            } else if (this.view.pickerElement) {
                this.view.pickerElement.appendChild(this.pickerC_.view.element);
                bindFoldable(this.foldable_, this.view.pickerElement);
            }
        }
        get textController() {
            return this.textC_;
        }
        onButtonBlur_(e) {
            if (!this.popC_) return;
            const elem = this.view.element;
            const nextTarget = forceCast(e.relatedTarget);
            if (!nextTarget || !elem.contains(nextTarget)) this.popC_.shows.rawValue = false;
        }
        onButtonClick_() {
            this.foldable_.set('expanded', !this.foldable_.get('expanded'));
            if (this.foldable_.get('expanded')) this.pickerC_.view.allFocusableElements[0].focus();
        }
        onPopupChildBlur_(ev) {
            if (!this.popC_) return;
            const elem = this.popC_.view.element;
            const nextTarget = findNextTarget(ev);
            if (nextTarget && elem.contains(nextTarget)) return;
            if (nextTarget && nextTarget === this.swatchC_.view.buttonElement && !supportsTouch(elem.ownerDocument)) return;
            this.popC_.shows.rawValue = false;
        }
        onPopupChildKeydown_(ev) {
            if (this.popC_) {
                if (ev.key === 'Escape') this.popC_.shows.rawValue = false;
            } else if (this.view.pickerElement) {
                if (ev.key === 'Escape') this.swatchC_.view.buttonElement.focus();
            }
        }
    }
    function colorFromObject(value, opt_type) {
        if (Color.isColorObject(value)) return Color.fromObject(value, opt_type);
        return Color.black(opt_type);
    }
    function colorToRgbNumber(value) {
        return removeAlphaComponent(value.getComponents('rgb')).reduce((result, comp)=>{
            return result << 8 | Math.floor(comp) & 255;
        }, 0);
    }
    function colorToRgbaNumber(value) {
        return value.getComponents('rgb').reduce((result, comp, index)=>{
            const hex = Math.floor(index === 3 ? comp * 255 : comp) & 255;
            return result << 8 | hex;
        }, 0) >>> 0;
    }
    function numberToRgbColor(num) {
        return new Color([
            num >> 16 & 255,
            num >> 8 & 255,
            num & 255
        ], 'rgb');
    }
    function numberToRgbaColor(num) {
        return new Color([
            num >> 24 & 255,
            num >> 16 & 255,
            num >> 8 & 255,
            mapRange(num & 255, 0, 255, 0, 1), 
        ], 'rgb');
    }
    function colorFromRgbNumber(value) {
        if (typeof value !== 'number') return Color.black();
        return numberToRgbColor(value);
    }
    function colorFromRgbaNumber(value) {
        if (typeof value !== 'number') return Color.black();
        return numberToRgbaColor(value);
    }
    function createColorStringWriter(format) {
        const stringify = findColorStringifier(format);
        return stringify ? (target, value)=>{
            writePrimitive(target, stringify(value));
        } : null;
    }
    function createColorNumberWriter(supportsAlpha) {
        const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
        return (target, value)=>{
            writePrimitive(target, colorToNumber(value));
        };
    }
    function writeRgbaColorObject(target, value, opt_type) {
        const obj = value.toRgbaObject(opt_type);
        target.writeProperty('r', obj.r);
        target.writeProperty('g', obj.g);
        target.writeProperty('b', obj.b);
        target.writeProperty('a', obj.a);
    }
    function writeRgbColorObject(target, value, opt_type) {
        const obj = value.toRgbaObject(opt_type);
        target.writeProperty('r', obj.r);
        target.writeProperty('g', obj.g);
        target.writeProperty('b', obj.b);
    }
    function createColorObjectWriter(supportsAlpha, opt_type) {
        return (target, inValue)=>{
            if (supportsAlpha) writeRgbaColorObject(target, inValue, opt_type);
            else writeRgbColorObject(target, inValue, opt_type);
        };
    }
    function shouldSupportAlpha$1(inputParams) {
        var _a;
        if ((inputParams === null || inputParams === void 0 ? void 0 : inputParams.alpha) || ((_a = inputParams === null || inputParams === void 0 ? void 0 : inputParams.color) === null || _a === void 0 ? void 0 : _a.alpha)) return true;
        return false;
    }
    function createFormatter$1(supportsAlpha) {
        return supportsAlpha ? (v)=>colorToHexRgbaString(v, '0x')
         : (v)=>colorToHexRgbString(v, '0x')
        ;
    }
    function isForColor(params) {
        if ('color' in params) return true;
        if ('view' in params && params.view === 'color') return true;
        return false;
    }
    const NumberColorInputPlugin = {
        id: 'input-color-number',
        type: 'input',
        accept: (value, params)=>{
            if (typeof value !== 'number') return null;
            if (!isForColor(params)) return null;
            const result = parseColorInputParams(params);
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            reader: (args)=>{
                return shouldSupportAlpha$1(args.params) ? colorFromRgbaNumber : colorFromRgbNumber;
            },
            equals: Color.equals,
            writer: (args)=>{
                return createColorNumberWriter(shouldSupportAlpha$1(args.params));
            }
        },
        controller: (args)=>{
            const supportsAlpha = shouldSupportAlpha$1(args.params);
            const expanded = 'expanded' in args.params ? args.params.expanded : undefined;
            const picker = 'picker' in args.params ? args.params.picker : undefined;
            return new ColorController(args.document, {
                colorType: 'int',
                expanded: expanded !== null && expanded !== void 0 ? expanded : false,
                formatter: createFormatter$1(supportsAlpha),
                parser: createColorStringParser('int'),
                pickerLayout: picker !== null && picker !== void 0 ? picker : 'popup',
                supportsAlpha: supportsAlpha,
                value: args.value,
                viewProps: args.viewProps
            });
        }
    };
    function shouldSupportAlpha(initialValue) {
        return Color.isRgbaColorObject(initialValue);
    }
    function createColorObjectReader(opt_type) {
        return (value)=>{
            return colorFromObject(value, opt_type);
        };
    }
    function createColorObjectFormatter(supportsAlpha, type) {
        return (value)=>{
            if (supportsAlpha) return colorToObjectRgbaString(value, type);
            return colorToObjectRgbString(value, type);
        };
    }
    const ObjectColorInputPlugin = {
        id: 'input-color-object',
        type: 'input',
        accept: (value, params)=>{
            if (!Color.isColorObject(value)) return null;
            const result = parseColorInputParams(params);
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            reader: (args)=>createColorObjectReader(extractColorType(args.params))
            ,
            equals: Color.equals,
            writer: (args)=>createColorObjectWriter(shouldSupportAlpha(args.initialValue), extractColorType(args.params))
        },
        controller: (args)=>{
            var _a;
            const supportsAlpha = Color.isRgbaColorObject(args.initialValue);
            const expanded = 'expanded' in args.params ? args.params.expanded : undefined;
            const picker = 'picker' in args.params ? args.params.picker : undefined;
            const type = (_a = extractColorType(args.params)) !== null && _a !== void 0 ? _a : 'int';
            return new ColorController(args.document, {
                colorType: type,
                expanded: expanded !== null && expanded !== void 0 ? expanded : false,
                formatter: createColorObjectFormatter(supportsAlpha, type),
                parser: createColorStringParser(type),
                pickerLayout: picker !== null && picker !== void 0 ? picker : 'popup',
                supportsAlpha: supportsAlpha,
                value: args.value,
                viewProps: args.viewProps
            });
        }
    };
    const StringColorInputPlugin = {
        id: 'input-color-string',
        type: 'input',
        accept: (value, params)=>{
            if (typeof value !== 'string') return null;
            if ('view' in params && params.view === 'text') return null;
            const format = detectStringColorFormat(value, extractColorType(params));
            if (!format) return null;
            const stringifier = findColorStringifier(format);
            if (!stringifier) return null;
            const result = parseColorInputParams(params);
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            reader: (args)=>{
                var _a;
                return createColorStringBindingReader((_a = extractColorType(args.params)) !== null && _a !== void 0 ? _a : 'int');
            },
            equals: Color.equals,
            writer: (args)=>{
                const format = detectStringColorFormat(args.initialValue, extractColorType(args.params));
                if (!format) throw TpError.shouldNeverHappen();
                const writer = createColorStringWriter(format);
                if (!writer) throw TpError.notBindable();
                return writer;
            }
        },
        controller: (args)=>{
            const format = detectStringColorFormat(args.initialValue, extractColorType(args.params));
            if (!format) throw TpError.shouldNeverHappen();
            const stringifier = findColorStringifier(format);
            if (!stringifier) throw TpError.shouldNeverHappen();
            const expanded = 'expanded' in args.params ? args.params.expanded : undefined;
            const picker = 'picker' in args.params ? args.params.picker : undefined;
            return new ColorController(args.document, {
                colorType: format.type,
                expanded: expanded !== null && expanded !== void 0 ? expanded : false,
                formatter: stringifier,
                parser: createColorStringParser(format.type),
                pickerLayout: picker !== null && picker !== void 0 ? picker : 'popup',
                supportsAlpha: format.alpha,
                value: args.value,
                viewProps: args.viewProps
            });
        }
    };
    class PointNdConstraint {
        constructor(config){
            this.components = config.components;
            this.asm_ = config.assembly;
        }
        constrain(value) {
            const comps = this.asm_.toComponents(value).map((comp, index)=>{
                var _a, _b;
                return (_b = (_a = this.components[index]) === null || _a === void 0 ? void 0 : _a.constrain(comp)) !== null && _b !== void 0 ? _b : comp;
            });
            return this.asm_.fromComponents(comps);
        }
    }
    const className$5 = ClassName('pndtxt');
    class PointNdTextView {
        constructor(doc, config){
            this.textViews = config.textViews;
            this.element = doc.createElement('div');
            this.element.classList.add(className$5());
            this.textViews.forEach((v)=>{
                const axisElem = doc.createElement('div');
                axisElem.classList.add(className$5('a'));
                axisElem.appendChild(v.element);
                this.element.appendChild(axisElem);
            });
        }
    }
    function createAxisController(doc, config, index) {
        return new NumberTextController(doc, {
            arrayPosition: index === 0 ? 'fst' : index === config.axes.length - 1 ? 'lst' : 'mid',
            baseStep: config.axes[index].baseStep,
            parser: config.parser,
            props: config.axes[index].textProps,
            value: createValue(0, {
                constraint: config.axes[index].constraint
            }),
            viewProps: config.viewProps
        });
    }
    class PointNdTextController {
        constructor(doc, config){
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.acs_ = config.axes.map((_, index)=>createAxisController(doc, config, index)
            );
            this.acs_.forEach((c, index)=>{
                connectValues({
                    primary: this.value,
                    secondary: c.value,
                    forward: (p)=>{
                        return config.assembly.toComponents(p.rawValue)[index];
                    },
                    backward: (p, s)=>{
                        const comps = config.assembly.toComponents(p.rawValue);
                        comps[index] = s.rawValue;
                        return config.assembly.fromComponents(comps);
                    }
                });
            });
            this.view = new PointNdTextView(doc, {
                textViews: this.acs_.map((ac)=>ac.view
                )
            });
        }
    }
    function createStepConstraint(params, initialValue) {
        if ('step' in params && !isEmpty(params.step)) return new StepConstraint(params.step, initialValue);
        return null;
    }
    function createRangeConstraint(params) {
        if (!isEmpty(params.max) && !isEmpty(params.min)) return new DefiniteRangeConstraint({
            max: params.max,
            min: params.min
        });
        if (!isEmpty(params.max) || !isEmpty(params.min)) return new RangeConstraint({
            max: params.max,
            min: params.min
        });
        return null;
    }
    function findNumberRange(c) {
        const drc = findConstraint(c, DefiniteRangeConstraint);
        if (drc) return [
            drc.values.get('min'),
            drc.values.get('max')
        ];
        const rc = findConstraint(c, RangeConstraint);
        if (rc) return [
            rc.minValue,
            rc.maxValue
        ];
        return [
            undefined,
            undefined
        ];
    }
    function createConstraint$4(params, initialValue) {
        const constraints = [];
        const sc = createStepConstraint(params, initialValue);
        if (sc) constraints.push(sc);
        const rc = createRangeConstraint(params);
        if (rc) constraints.push(rc);
        const lc = createListConstraint(params.options);
        if (lc) constraints.push(lc);
        return new CompositeConstraint(constraints);
    }
    const NumberInputPlugin = {
        id: 'input-number',
        type: 'input',
        accept: (value, params)=>{
            if (typeof value !== 'number') return null;
            const p = ParamsParsers;
            const result = parseParams(params, {
                format: p.optional.function,
                max: p.optional.number,
                min: p.optional.number,
                options: p.optional.custom(parseListOptions),
                step: p.optional.number
            });
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            reader: (_args)=>numberFromUnknown
            ,
            constraint: (args)=>createConstraint$4(args.params, args.initialValue)
            ,
            writer: (_args)=>writePrimitive
        },
        controller: (args)=>{
            var _a;
            const value = args.value;
            const c = args.constraint;
            const lc = c && findConstraint(c, ListConstraint);
            if (lc) return new ListController(args.document, {
                props: new ValueMap({
                    options: lc.values.value('options')
                }),
                value: value,
                viewProps: args.viewProps
            });
            const formatter = (_a = 'format' in args.params ? args.params.format : undefined) !== null && _a !== void 0 ? _a : createNumberFormatter(getSuitableDecimalDigits(c, value.rawValue));
            const drc = c && findConstraint(c, DefiniteRangeConstraint);
            if (drc) return new SliderTextController(args.document, {
                baseStep: getBaseStep(c),
                parser: parseNumber,
                sliderProps: new ValueMap({
                    maxValue: drc.values.value('max'),
                    minValue: drc.values.value('min')
                }),
                textProps: ValueMap.fromObject({
                    draggingScale: getSuitableDraggingScale(c, value.rawValue),
                    formatter: formatter
                }),
                value: value,
                viewProps: args.viewProps
            });
            return new NumberTextController(args.document, {
                baseStep: getBaseStep(c),
                parser: parseNumber,
                props: ValueMap.fromObject({
                    draggingScale: getSuitableDraggingScale(c, value.rawValue),
                    formatter: formatter
                }),
                value: value,
                viewProps: args.viewProps
            });
        }
    };
    class Point2d {
        constructor(x = 0, y = 0){
            this.x = x;
            this.y = y;
        }
        getComponents() {
            return [
                this.x,
                this.y
            ];
        }
        static isObject(obj) {
            if (isEmpty(obj)) return false;
            const x = obj.x;
            const y = obj.y;
            if (typeof x !== 'number' || typeof y !== 'number') return false;
            return true;
        }
        static equals(v1, v2) {
            return v1.x === v2.x && v1.y === v2.y;
        }
        toObject() {
            return {
                x: this.x,
                y: this.y
            };
        }
    }
    const Point2dAssembly = {
        toComponents: (p)=>p.getComponents()
        ,
        fromComponents: (comps)=>new Point2d(...comps)
    };
    const className$4 = ClassName('p2d');
    class Point2dView {
        constructor(doc, config){
            this.element = doc.createElement('div');
            this.element.classList.add(className$4());
            config.viewProps.bindClassModifiers(this.element);
            bindValue(config.expanded, valueToClassName(this.element, className$4(undefined, 'expanded')));
            const headElem = doc.createElement('div');
            headElem.classList.add(className$4('h'));
            this.element.appendChild(headElem);
            const buttonElem = doc.createElement('button');
            buttonElem.classList.add(className$4('b'));
            buttonElem.appendChild(createSvgIconElement(doc, 'p2dpad'));
            config.viewProps.bindDisabled(buttonElem);
            headElem.appendChild(buttonElem);
            this.buttonElement = buttonElem;
            const textElem = doc.createElement('div');
            textElem.classList.add(className$4('t'));
            headElem.appendChild(textElem);
            this.textElement = textElem;
            if (config.pickerLayout === 'inline') {
                const pickerElem = doc.createElement('div');
                pickerElem.classList.add(className$4('p'));
                this.element.appendChild(pickerElem);
                this.pickerElement = pickerElem;
            } else this.pickerElement = null;
        }
    }
    const className$3 = ClassName('p2dp');
    class Point2dPickerView {
        constructor(doc, config){
            this.onFoldableChange_ = this.onFoldableChange_.bind(this);
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.invertsY_ = config.invertsY;
            this.maxValue_ = config.maxValue;
            this.element = doc.createElement('div');
            this.element.classList.add(className$3());
            if (config.layout === 'popup') this.element.classList.add(className$3(undefined, 'p'));
            config.viewProps.bindClassModifiers(this.element);
            const padElem = doc.createElement('div');
            padElem.classList.add(className$3('p'));
            config.viewProps.bindTabIndex(padElem);
            this.element.appendChild(padElem);
            this.padElement = padElem;
            const svgElem = doc.createElementNS(SVG_NS, 'svg');
            svgElem.classList.add(className$3('g'));
            this.padElement.appendChild(svgElem);
            this.svgElem_ = svgElem;
            const xAxisElem = doc.createElementNS(SVG_NS, 'line');
            xAxisElem.classList.add(className$3('ax'));
            xAxisElem.setAttributeNS(null, 'x1', '0');
            xAxisElem.setAttributeNS(null, 'y1', '50%');
            xAxisElem.setAttributeNS(null, 'x2', '100%');
            xAxisElem.setAttributeNS(null, 'y2', '50%');
            this.svgElem_.appendChild(xAxisElem);
            const yAxisElem = doc.createElementNS(SVG_NS, 'line');
            yAxisElem.classList.add(className$3('ax'));
            yAxisElem.setAttributeNS(null, 'x1', '50%');
            yAxisElem.setAttributeNS(null, 'y1', '0');
            yAxisElem.setAttributeNS(null, 'x2', '50%');
            yAxisElem.setAttributeNS(null, 'y2', '100%');
            this.svgElem_.appendChild(yAxisElem);
            const lineElem = doc.createElementNS(SVG_NS, 'line');
            lineElem.classList.add(className$3('l'));
            lineElem.setAttributeNS(null, 'x1', '50%');
            lineElem.setAttributeNS(null, 'y1', '50%');
            this.svgElem_.appendChild(lineElem);
            this.lineElem_ = lineElem;
            const markerElem = doc.createElement('div');
            markerElem.classList.add(className$3('m'));
            this.padElement.appendChild(markerElem);
            this.markerElem_ = markerElem;
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.update_();
        }
        get allFocusableElements() {
            return [
                this.padElement
            ];
        }
        update_() {
            const [x, y] = this.value.rawValue.getComponents();
            const max = this.maxValue_;
            const px = mapRange(x, -max, +max, 0, 100);
            const py = mapRange(y, -max, +max, 0, 100);
            const ipy = this.invertsY_ ? 100 - py : py;
            this.lineElem_.setAttributeNS(null, 'x2', `${px}%`);
            this.lineElem_.setAttributeNS(null, 'y2', `${ipy}%`);
            this.markerElem_.style.left = `${px}%`;
            this.markerElem_.style.top = `${ipy}%`;
        }
        onValueChange_() {
            this.update_();
        }
        onFoldableChange_() {
            this.update_();
        }
    }
    function computeOffset(ev, baseSteps, invertsY) {
        return [
            getStepForKey(baseSteps[0], getHorizontalStepKeys(ev)),
            getStepForKey(baseSteps[1], getVerticalStepKeys(ev)) * (invertsY ? 1 : -1), 
        ];
    }
    class Point2dPickerController {
        constructor(doc, config){
            this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
            this.onPadKeyUp_ = this.onPadKeyUp_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.baseSteps_ = config.baseSteps;
            this.maxValue_ = config.maxValue;
            this.invertsY_ = config.invertsY;
            this.view = new Point2dPickerView(doc, {
                invertsY: this.invertsY_,
                layout: config.layout,
                maxValue: this.maxValue_,
                value: this.value,
                viewProps: this.viewProps
            });
            this.ptHandler_ = new PointerHandler(this.view.padElement);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.padElement.addEventListener('keydown', this.onPadKeyDown_);
            this.view.padElement.addEventListener('keyup', this.onPadKeyUp_);
        }
        handlePointerEvent_(d, opts) {
            if (!d.point) return;
            const max = this.maxValue_;
            const px = mapRange(d.point.x, 0, d.bounds.width, -max, +max);
            const py = mapRange(this.invertsY_ ? d.bounds.height - d.point.y : d.point.y, 0, d.bounds.height, -max, +max);
            this.value.setRawValue(new Point2d(px, py), opts);
        }
        onPointerDown_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false
            });
        }
        onPointerMove_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false
            });
        }
        onPointerUp_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: true,
                last: true
            });
        }
        onPadKeyDown_(ev) {
            if (isArrowKey(ev.key)) ev.preventDefault();
            const [dx, dy] = computeOffset(ev, this.baseSteps_, this.invertsY_);
            if (dx === 0 && dy === 0) return;
            this.value.setRawValue(new Point2d(this.value.rawValue.x + dx, this.value.rawValue.y + dy), {
                forceEmit: false,
                last: false
            });
        }
        onPadKeyUp_(ev) {
            const [dx, dy] = computeOffset(ev, this.baseSteps_, this.invertsY_);
            if (dx === 0 && dy === 0) return;
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true
            });
        }
    }
    class Point2dController {
        constructor(doc, config){
            var _a, _b;
            this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
            this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
            this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
            this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.foldable_ = Foldable.create(config.expanded);
            this.popC_ = config.pickerLayout === 'popup' ? new PopupController(doc, {
                viewProps: this.viewProps
            }) : null;
            const padC = new Point2dPickerController(doc, {
                baseSteps: [
                    config.axes[0].baseStep,
                    config.axes[1].baseStep
                ],
                invertsY: config.invertsY,
                layout: config.pickerLayout,
                maxValue: config.maxValue,
                value: this.value,
                viewProps: this.viewProps
            });
            padC.view.allFocusableElements.forEach((elem)=>{
                elem.addEventListener('blur', this.onPopupChildBlur_);
                elem.addEventListener('keydown', this.onPopupChildKeydown_);
            });
            this.pickerC_ = padC;
            this.textC_ = new PointNdTextController(doc, {
                assembly: Point2dAssembly,
                axes: config.axes,
                parser: config.parser,
                value: this.value,
                viewProps: this.viewProps
            });
            this.view = new Point2dView(doc, {
                expanded: this.foldable_.value('expanded'),
                pickerLayout: config.pickerLayout,
                viewProps: this.viewProps
            });
            this.view.textElement.appendChild(this.textC_.view.element);
            (_a = this.view.buttonElement) === null || _a === void 0 || _a.addEventListener('blur', this.onPadButtonBlur_);
            (_b = this.view.buttonElement) === null || _b === void 0 || _b.addEventListener('click', this.onPadButtonClick_);
            if (this.popC_) {
                this.view.element.appendChild(this.popC_.view.element);
                this.popC_.view.element.appendChild(this.pickerC_.view.element);
                connectValues({
                    primary: this.foldable_.value('expanded'),
                    secondary: this.popC_.shows,
                    forward: (p)=>p.rawValue
                    ,
                    backward: (_, s)=>s.rawValue
                });
            } else if (this.view.pickerElement) {
                this.view.pickerElement.appendChild(this.pickerC_.view.element);
                bindFoldable(this.foldable_, this.view.pickerElement);
            }
        }
        onPadButtonBlur_(e) {
            if (!this.popC_) return;
            const elem = this.view.element;
            const nextTarget = forceCast(e.relatedTarget);
            if (!nextTarget || !elem.contains(nextTarget)) this.popC_.shows.rawValue = false;
        }
        onPadButtonClick_() {
            this.foldable_.set('expanded', !this.foldable_.get('expanded'));
            if (this.foldable_.get('expanded')) this.pickerC_.view.allFocusableElements[0].focus();
        }
        onPopupChildBlur_(ev) {
            if (!this.popC_) return;
            const elem = this.popC_.view.element;
            const nextTarget = findNextTarget(ev);
            if (nextTarget && elem.contains(nextTarget)) return;
            if (nextTarget && nextTarget === this.view.buttonElement && !supportsTouch(elem.ownerDocument)) return;
            this.popC_.shows.rawValue = false;
        }
        onPopupChildKeydown_(ev) {
            if (this.popC_) {
                if (ev.key === 'Escape') this.popC_.shows.rawValue = false;
            } else if (this.view.pickerElement) {
                if (ev.key === 'Escape') this.view.buttonElement.focus();
            }
        }
    }
    class Point3d {
        constructor(x = 0, y = 0, z = 0){
            this.x = x;
            this.y = y;
            this.z = z;
        }
        getComponents() {
            return [
                this.x,
                this.y,
                this.z
            ];
        }
        static isObject(obj) {
            if (isEmpty(obj)) return false;
            const x = obj.x;
            const y = obj.y;
            const z = obj.z;
            if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') return false;
            return true;
        }
        static equals(v1, v2) {
            return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
        }
        toObject() {
            return {
                x: this.x,
                y: this.y,
                z: this.z
            };
        }
    }
    const Point3dAssembly = {
        toComponents: (p)=>p.getComponents()
        ,
        fromComponents: (comps)=>new Point3d(...comps)
    };
    function point3dFromUnknown(value) {
        return Point3d.isObject(value) ? new Point3d(value.x, value.y, value.z) : new Point3d();
    }
    function writePoint3d(target, value) {
        target.writeProperty('x', value.x);
        target.writeProperty('y', value.y);
        target.writeProperty('z', value.z);
    }
    function createConstraint$3(params, initialValue) {
        return new PointNdConstraint({
            assembly: Point3dAssembly,
            components: [
                createDimensionConstraint('x' in params ? params.x : undefined, initialValue.x),
                createDimensionConstraint('y' in params ? params.y : undefined, initialValue.y),
                createDimensionConstraint('z' in params ? params.z : undefined, initialValue.z), 
            ]
        });
    }
    function createAxis$2(initialValue, constraint) {
        return {
            baseStep: getBaseStep(constraint),
            constraint: constraint,
            textProps: ValueMap.fromObject({
                draggingScale: getSuitableDraggingScale(constraint, initialValue),
                formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue))
            })
        };
    }
    const Point3dInputPlugin = {
        id: 'input-point3d',
        type: 'input',
        accept: (value, params)=>{
            if (!Point3d.isObject(value)) return null;
            const p = ParamsParsers;
            const result = parseParams(params, {
                x: p.optional.custom(parsePointDimensionParams),
                y: p.optional.custom(parsePointDimensionParams),
                z: p.optional.custom(parsePointDimensionParams)
            });
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            reader: (_args)=>point3dFromUnknown
            ,
            constraint: (args)=>createConstraint$3(args.params, args.initialValue)
            ,
            equals: Point3d.equals,
            writer: (_args)=>writePoint3d
        },
        controller: (args)=>{
            const value = args.value;
            const c = args.constraint;
            if (!(c instanceof PointNdConstraint)) throw TpError.shouldNeverHappen();
            return new PointNdTextController(args.document, {
                assembly: Point3dAssembly,
                axes: [
                    createAxis$2(value.rawValue.x, c.components[0]),
                    createAxis$2(value.rawValue.y, c.components[1]),
                    createAxis$2(value.rawValue.z, c.components[2]), 
                ],
                parser: parseNumber,
                value: value,
                viewProps: args.viewProps
            });
        }
    };
    class Point4d {
        constructor(x = 0, y = 0, z = 0, w = 0){
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        getComponents() {
            return [
                this.x,
                this.y,
                this.z,
                this.w
            ];
        }
        static isObject(obj) {
            if (isEmpty(obj)) return false;
            const x = obj.x;
            const y = obj.y;
            const z = obj.z;
            const w = obj.w;
            if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number' || typeof w !== 'number') return false;
            return true;
        }
        static equals(v1, v2) {
            return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z && v1.w === v2.w;
        }
        toObject() {
            return {
                x: this.x,
                y: this.y,
                z: this.z,
                w: this.w
            };
        }
    }
    const Point4dAssembly = {
        toComponents: (p)=>p.getComponents()
        ,
        fromComponents: (comps)=>new Point4d(...comps)
    };
    function point4dFromUnknown(value) {
        return Point4d.isObject(value) ? new Point4d(value.x, value.y, value.z, value.w) : new Point4d();
    }
    function writePoint4d(target, value) {
        target.writeProperty('x', value.x);
        target.writeProperty('y', value.y);
        target.writeProperty('z', value.z);
        target.writeProperty('w', value.w);
    }
    function createConstraint$2(params, initialValue) {
        return new PointNdConstraint({
            assembly: Point4dAssembly,
            components: [
                createDimensionConstraint('x' in params ? params.x : undefined, initialValue.x),
                createDimensionConstraint('y' in params ? params.y : undefined, initialValue.y),
                createDimensionConstraint('z' in params ? params.z : undefined, initialValue.z),
                createDimensionConstraint('w' in params ? params.w : undefined, initialValue.w), 
            ]
        });
    }
    function createAxis$1(initialValue, constraint) {
        return {
            baseStep: getBaseStep(constraint),
            constraint: constraint,
            textProps: ValueMap.fromObject({
                draggingScale: getSuitableDraggingScale(constraint, initialValue),
                formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue))
            })
        };
    }
    const Point4dInputPlugin = {
        id: 'input-point4d',
        type: 'input',
        accept: (value, params)=>{
            if (!Point4d.isObject(value)) return null;
            const p = ParamsParsers;
            const result = parseParams(params, {
                x: p.optional.custom(parsePointDimensionParams),
                y: p.optional.custom(parsePointDimensionParams),
                z: p.optional.custom(parsePointDimensionParams),
                w: p.optional.custom(parsePointDimensionParams)
            });
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            reader: (_args)=>point4dFromUnknown
            ,
            constraint: (args)=>createConstraint$2(args.params, args.initialValue)
            ,
            equals: Point4d.equals,
            writer: (_args)=>writePoint4d
        },
        controller: (args)=>{
            const value = args.value;
            const c = args.constraint;
            if (!(c instanceof PointNdConstraint)) throw TpError.shouldNeverHappen();
            return new PointNdTextController(args.document, {
                assembly: Point4dAssembly,
                axes: value.rawValue.getComponents().map((comp, index)=>createAxis$1(comp, c.components[index])
                ),
                parser: parseNumber,
                value: value,
                viewProps: args.viewProps
            });
        }
    };
    function createConstraint$1(params) {
        const constraints = [];
        const lc = createListConstraint(params.options);
        if (lc) constraints.push(lc);
        return new CompositeConstraint(constraints);
    }
    const StringInputPlugin = {
        id: 'input-string',
        type: 'input',
        accept: (value, params)=>{
            if (typeof value !== 'string') return null;
            const p = ParamsParsers;
            const result = parseParams(params, {
                options: p.optional.custom(parseListOptions)
            });
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            reader: (_args)=>stringFromUnknown
            ,
            constraint: (args)=>createConstraint$1(args.params)
            ,
            writer: (_args)=>writePrimitive
        },
        controller: (args)=>{
            const doc = args.document;
            const value = args.value;
            const c = args.constraint;
            const lc = c && findConstraint(c, ListConstraint);
            if (lc) return new ListController(doc, {
                props: new ValueMap({
                    options: lc.values.value('options')
                }),
                value: value,
                viewProps: args.viewProps
            });
            return new TextController(doc, {
                parser: (v)=>v
                ,
                props: ValueMap.fromObject({
                    formatter: formatString
                }),
                value: value,
                viewProps: args.viewProps
            });
        }
    };
    const Constants = {
        monitor: {
            defaultInterval: 200,
            defaultLineCount: 3
        }
    };
    const className$2 = ClassName('mll');
    class MultiLogView {
        constructor(doc, config){
            this.onValueUpdate_ = this.onValueUpdate_.bind(this);
            this.formatter_ = config.formatter;
            this.element = doc.createElement('div');
            this.element.classList.add(className$2());
            config.viewProps.bindClassModifiers(this.element);
            const textareaElem = doc.createElement('textarea');
            textareaElem.classList.add(className$2('i'));
            textareaElem.style.height = `calc(var(--bld-us) * ${config.lineCount})`;
            textareaElem.readOnly = true;
            config.viewProps.bindDisabled(textareaElem);
            this.element.appendChild(textareaElem);
            this.textareaElem_ = textareaElem;
            config.value.emitter.on('change', this.onValueUpdate_);
            this.value = config.value;
            this.update_();
        }
        update_() {
            const elem = this.textareaElem_;
            const shouldScroll = elem.scrollTop === elem.scrollHeight - elem.clientHeight;
            const lines = [];
            this.value.rawValue.forEach((value)=>{
                if (value !== undefined) lines.push(this.formatter_(value));
            });
            elem.textContent = lines.join('\n');
            if (shouldScroll) elem.scrollTop = elem.scrollHeight;
        }
        onValueUpdate_() {
            this.update_();
        }
    }
    class MultiLogController {
        constructor(doc, config){
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new MultiLogView(doc, {
                formatter: config.formatter,
                lineCount: config.lineCount,
                value: this.value,
                viewProps: this.viewProps
            });
        }
    }
    const className$1 = ClassName('sgl');
    class SingleLogView {
        constructor(doc, config){
            this.onValueUpdate_ = this.onValueUpdate_.bind(this);
            this.formatter_ = config.formatter;
            this.element = doc.createElement('div');
            this.element.classList.add(className$1());
            config.viewProps.bindClassModifiers(this.element);
            const inputElem = doc.createElement('input');
            inputElem.classList.add(className$1('i'));
            inputElem.readOnly = true;
            inputElem.type = 'text';
            config.viewProps.bindDisabled(inputElem);
            this.element.appendChild(inputElem);
            this.inputElement = inputElem;
            config.value.emitter.on('change', this.onValueUpdate_);
            this.value = config.value;
            this.update_();
        }
        update_() {
            const values = this.value.rawValue;
            const lastValue = values[values.length - 1];
            this.inputElement.value = lastValue !== undefined ? this.formatter_(lastValue) : '';
        }
        onValueUpdate_() {
            this.update_();
        }
    }
    class SingleLogController {
        constructor(doc, config){
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new SingleLogView(doc, {
                formatter: config.formatter,
                value: this.value,
                viewProps: this.viewProps
            });
        }
    }
    const BooleanMonitorPlugin = {
        id: 'monitor-bool',
        type: 'monitor',
        accept: (value, params)=>{
            if (typeof value !== 'boolean') return null;
            const p = ParamsParsers;
            const result = parseParams(params, {
                lineCount: p.optional.number
            });
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            reader: (_args)=>boolFromUnknown
        },
        controller: (args)=>{
            var _a;
            if (args.value.rawValue.length === 1) return new SingleLogController(args.document, {
                formatter: BooleanFormatter,
                value: args.value,
                viewProps: args.viewProps
            });
            return new MultiLogController(args.document, {
                formatter: BooleanFormatter,
                lineCount: (_a = args.params.lineCount) !== null && _a !== void 0 ? _a : Constants.monitor.defaultLineCount,
                value: args.value,
                viewProps: args.viewProps
            });
        }
    };
    const className1 = ClassName('grl');
    class GraphLogView {
        constructor(doc, config){
            this.onCursorChange_ = this.onCursorChange_.bind(this);
            this.onValueUpdate_ = this.onValueUpdate_.bind(this);
            this.element = doc.createElement('div');
            this.element.classList.add(className1());
            config.viewProps.bindClassModifiers(this.element);
            this.formatter_ = config.formatter;
            this.props_ = config.props;
            this.cursor_ = config.cursor;
            this.cursor_.emitter.on('change', this.onCursorChange_);
            const svgElem = doc.createElementNS(SVG_NS, 'svg');
            svgElem.classList.add(className1('g'));
            svgElem.style.height = `calc(var(--bld-us) * ${config.lineCount})`;
            this.element.appendChild(svgElem);
            this.svgElem_ = svgElem;
            const lineElem = doc.createElementNS(SVG_NS, 'polyline');
            this.svgElem_.appendChild(lineElem);
            this.lineElem_ = lineElem;
            const tooltipElem = doc.createElement('div');
            tooltipElem.classList.add(className1('t'), ClassName('tt')());
            this.element.appendChild(tooltipElem);
            this.tooltipElem_ = tooltipElem;
            config.value.emitter.on('change', this.onValueUpdate_);
            this.value = config.value;
            this.update_();
        }
        get graphElement() {
            return this.svgElem_;
        }
        update_() {
            const bounds = this.svgElem_.getBoundingClientRect();
            const maxIndex = this.value.rawValue.length - 1;
            const min = this.props_.get('minValue');
            const max = this.props_.get('maxValue');
            const points = [];
            this.value.rawValue.forEach((v, index)=>{
                if (v === undefined) return;
                const x = mapRange(index, 0, maxIndex, 0, bounds.width);
                const y = mapRange(v, min, max, bounds.height, 0);
                points.push([
                    x,
                    y
                ].join(','));
            });
            this.lineElem_.setAttributeNS(null, 'points', points.join(' '));
            const tooltipElem = this.tooltipElem_;
            const value = this.value.rawValue[this.cursor_.rawValue];
            if (value === undefined) {
                tooltipElem.classList.remove(className1('t', 'a'));
                return;
            }
            const tx = mapRange(this.cursor_.rawValue, 0, maxIndex, 0, bounds.width);
            const ty = mapRange(value, min, max, bounds.height, 0);
            tooltipElem.style.left = `${tx}px`;
            tooltipElem.style.top = `${ty}px`;
            tooltipElem.textContent = `${this.formatter_(value)}`;
            if (!tooltipElem.classList.contains(className1('t', 'a'))) {
                tooltipElem.classList.add(className1('t', 'a'), className1('t', 'in'));
                forceReflow(tooltipElem);
                tooltipElem.classList.remove(className1('t', 'in'));
            }
        }
        onValueUpdate_() {
            this.update_();
        }
        onCursorChange_() {
            this.update_();
        }
    }
    class GraphLogController {
        constructor(doc, config){
            this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);
            this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
            this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this);
            this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this);
            this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this);
            this.props_ = config.props;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.cursor_ = createValue(-1);
            this.view = new GraphLogView(doc, {
                cursor: this.cursor_,
                formatter: config.formatter,
                lineCount: config.lineCount,
                props: this.props_,
                value: this.value,
                viewProps: this.viewProps
            });
            if (!supportsTouch(doc)) {
                this.view.element.addEventListener('mousemove', this.onGraphMouseMove_);
                this.view.element.addEventListener('mouseleave', this.onGraphMouseLeave_);
            } else {
                const ph = new PointerHandler(this.view.element);
                ph.emitter.on('down', this.onGraphPointerDown_);
                ph.emitter.on('move', this.onGraphPointerMove_);
                ph.emitter.on('up', this.onGraphPointerUp_);
            }
        }
        onGraphMouseLeave_() {
            this.cursor_.rawValue = -1;
        }
        onGraphMouseMove_(ev) {
            const bounds = this.view.element.getBoundingClientRect();
            this.cursor_.rawValue = Math.floor(mapRange(ev.offsetX, 0, bounds.width, 0, this.value.rawValue.length));
        }
        onGraphPointerDown_(ev) {
            this.onGraphPointerMove_(ev);
        }
        onGraphPointerMove_(ev) {
            if (!ev.data.point) {
                this.cursor_.rawValue = -1;
                return;
            }
            this.cursor_.rawValue = Math.floor(mapRange(ev.data.point.x, 0, ev.data.bounds.width, 0, this.value.rawValue.length));
        }
        onGraphPointerUp_() {
            this.cursor_.rawValue = -1;
        }
    }
    function createFormatter(params) {
        return 'format' in params && !isEmpty(params.format) ? params.format : createNumberFormatter(2);
    }
    function createTextMonitor(args) {
        var _a;
        if (args.value.rawValue.length === 1) return new SingleLogController(args.document, {
            formatter: createFormatter(args.params),
            value: args.value,
            viewProps: args.viewProps
        });
        return new MultiLogController(args.document, {
            formatter: createFormatter(args.params),
            lineCount: (_a = args.params.lineCount) !== null && _a !== void 0 ? _a : Constants.monitor.defaultLineCount,
            value: args.value,
            viewProps: args.viewProps
        });
    }
    function createGraphMonitor(args) {
        var _a, _b, _c;
        return new GraphLogController(args.document, {
            formatter: createFormatter(args.params),
            lineCount: (_a = args.params.lineCount) !== null && _a !== void 0 ? _a : Constants.monitor.defaultLineCount,
            props: ValueMap.fromObject({
                maxValue: (_b = 'max' in args.params ? args.params.max : null) !== null && _b !== void 0 ? _b : 100,
                minValue: (_c = 'min' in args.params ? args.params.min : null) !== null && _c !== void 0 ? _c : 0
            }),
            value: args.value,
            viewProps: args.viewProps
        });
    }
    function shouldShowGraph(params) {
        return 'view' in params && params.view === 'graph';
    }
    const NumberMonitorPlugin = {
        id: 'monitor-number',
        type: 'monitor',
        accept: (value, params)=>{
            if (typeof value !== 'number') return null;
            const p = ParamsParsers;
            const result = parseParams(params, {
                format: p.optional.function,
                lineCount: p.optional.number,
                max: p.optional.number,
                min: p.optional.number,
                view: p.optional.string
            });
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            defaultBufferSize: (params)=>shouldShowGraph(params) ? 64 : 1
            ,
            reader: (_args)=>numberFromUnknown
        },
        controller: (args)=>{
            if (shouldShowGraph(args.params)) return createGraphMonitor(args);
            return createTextMonitor(args);
        }
    };
    const StringMonitorPlugin = {
        id: 'monitor-string',
        type: 'monitor',
        accept: (value, params)=>{
            if (typeof value !== 'string') return null;
            const p = ParamsParsers;
            const result = parseParams(params, {
                lineCount: p.optional.number,
                multiline: p.optional.boolean
            });
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            reader: (_args)=>stringFromUnknown
        },
        controller: (args)=>{
            var _a;
            const value = args.value;
            const multiline = value.rawValue.length > 1 || 'multiline' in args.params && args.params.multiline;
            if (multiline) return new MultiLogController(args.document, {
                formatter: formatString,
                lineCount: (_a = args.params.lineCount) !== null && _a !== void 0 ? _a : Constants.monitor.defaultLineCount,
                value: value,
                viewProps: args.viewProps
            });
            return new SingleLogController(args.document, {
                formatter: formatString,
                value: value,
                viewProps: args.viewProps
            });
        }
    };
    class InputBinding {
        constructor(config){
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.reader = config.reader;
            this.writer = config.writer;
            this.emitter = new Emitter();
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.target = config.target;
            this.read();
        }
        read() {
            const targetValue = this.target.read();
            if (targetValue !== undefined) this.value.rawValue = this.reader(targetValue);
        }
        write_(rawValue) {
            this.writer(this.target, rawValue);
        }
        onValueChange_(ev) {
            this.write_(ev.rawValue);
            this.emitter.emit('change', {
                options: ev.options,
                rawValue: ev.rawValue,
                sender: this
            });
        }
    }
    function createInputBindingController(plugin, args) {
        const result = plugin.accept(args.target.read(), args.params);
        if (isEmpty(result)) return null;
        const p = ParamsParsers;
        const valueArgs = {
            target: args.target,
            initialValue: result.initialValue,
            params: result.params
        };
        const reader = plugin.binding.reader(valueArgs);
        const constraint = plugin.binding.constraint ? plugin.binding.constraint(valueArgs) : undefined;
        const value = createValue(reader(result.initialValue), {
            constraint: constraint,
            equals: plugin.binding.equals
        });
        const binding = new InputBinding({
            reader: reader,
            target: args.target,
            value: value,
            writer: plugin.binding.writer(valueArgs)
        });
        const disabled = p.optional.boolean(args.params.disabled).value;
        const hidden = p.optional.boolean(args.params.hidden).value;
        const controller = plugin.controller({
            constraint: constraint,
            document: args.document,
            initialValue: result.initialValue,
            params: result.params,
            value: binding.value,
            viewProps: ViewProps.create({
                disabled: disabled,
                hidden: hidden
            })
        });
        const label = p.optional.string(args.params.label).value;
        return new InputBindingController(args.document, {
            binding: binding,
            blade: createBlade(),
            props: ValueMap.fromObject({
                label: label !== null && label !== void 0 ? label : args.target.key
            }),
            valueController: controller
        });
    }
    class MonitorBinding {
        constructor(config){
            this.onTick_ = this.onTick_.bind(this);
            this.reader_ = config.reader;
            this.target = config.target;
            this.emitter = new Emitter();
            this.value = config.value;
            this.ticker = config.ticker;
            this.ticker.emitter.on('tick', this.onTick_);
            this.read();
        }
        dispose() {
            this.ticker.dispose();
        }
        read() {
            const targetValue = this.target.read();
            if (targetValue === undefined) return;
            const buffer = this.value.rawValue;
            const newValue = this.reader_(targetValue);
            this.value.rawValue = createPushedBuffer(buffer, newValue);
            this.emitter.emit('update', {
                rawValue: newValue,
                sender: this
            });
        }
        onTick_(_) {
            this.read();
        }
    }
    function createTicker(document, interval) {
        return interval === 0 ? new ManualTicker() : new IntervalTicker(document, interval !== null && interval !== void 0 ? interval : Constants.monitor.defaultInterval);
    }
    function createMonitorBindingController(plugin, args) {
        var _a, _b, _c;
        const P = ParamsParsers;
        const result = plugin.accept(args.target.read(), args.params);
        if (isEmpty(result)) return null;
        const bindingArgs = {
            target: args.target,
            initialValue: result.initialValue,
            params: result.params
        };
        const reader = plugin.binding.reader(bindingArgs);
        const bufferSize = (_b = (_a = P.optional.number(args.params.bufferSize).value) !== null && _a !== void 0 ? _a : plugin.binding.defaultBufferSize && plugin.binding.defaultBufferSize(result.params)) !== null && _b !== void 0 ? _b : 1;
        const interval = P.optional.number(args.params.interval).value;
        const binding = new MonitorBinding({
            reader: reader,
            target: args.target,
            ticker: createTicker(args.document, interval),
            value: initializeBuffer(bufferSize)
        });
        const disabled = P.optional.boolean(args.params.disabled).value;
        const hidden = P.optional.boolean(args.params.hidden).value;
        const controller = plugin.controller({
            document: args.document,
            params: result.params,
            value: binding.value,
            viewProps: ViewProps.create({
                disabled: disabled,
                hidden: hidden
            })
        });
        const label = (_c = P.optional.string(args.params.label).value) !== null && _c !== void 0 ? _c : args.target.key;
        return new MonitorBindingController(args.document, {
            binding: binding,
            blade: createBlade(),
            props: ValueMap.fromObject({
                label: label
            }),
            valueController: controller
        });
    }
    class PluginPool {
        constructor(){
            this.pluginsMap_ = {
                blades: [],
                inputs: [],
                monitors: []
            };
        }
        getAll() {
            return [
                ...this.pluginsMap_.blades,
                ...this.pluginsMap_.inputs,
                ...this.pluginsMap_.monitors, 
            ];
        }
        register(r) {
            if (r.type === 'blade') this.pluginsMap_.blades.unshift(r);
            else if (r.type === 'input') this.pluginsMap_.inputs.unshift(r);
            else if (r.type === 'monitor') this.pluginsMap_.monitors.unshift(r);
        }
        createInput(document, target, params) {
            const initialValue = target.read();
            if (isEmpty(initialValue)) throw new TpError({
                context: {
                    key: target.key
                },
                type: 'nomatchingcontroller'
            });
            const bc = this.pluginsMap_.inputs.reduce((result, plugin)=>result !== null && result !== void 0 ? result : createInputBindingController(plugin, {
                    document: document,
                    target: target,
                    params: params
                })
            , null);
            if (bc) return bc;
            throw new TpError({
                context: {
                    key: target.key
                },
                type: 'nomatchingcontroller'
            });
        }
        createMonitor(document, target, params) {
            const bc = this.pluginsMap_.monitors.reduce((result, plugin)=>result !== null && result !== void 0 ? result : createMonitorBindingController(plugin, {
                    document: document,
                    params: params,
                    target: target
                })
            , null);
            if (bc) return bc;
            throw new TpError({
                context: {
                    key: target.key
                },
                type: 'nomatchingcontroller'
            });
        }
        createBlade(document, params) {
            const bc = this.pluginsMap_.blades.reduce((result, plugin)=>result !== null && result !== void 0 ? result : createBladeController(plugin, {
                    document: document,
                    params: params
                })
            , null);
            if (!bc) throw new TpError({
                type: 'nomatchingview',
                context: {
                    params: params
                }
            });
            return bc;
        }
        createBladeApi(bc) {
            if (bc instanceof InputBindingController) return new InputBindingApi(bc);
            if (bc instanceof MonitorBindingController) return new MonitorBindingApi(bc);
            if (bc instanceof RackController) return new RackApi(bc, this);
            const api = this.pluginsMap_.blades.reduce((result, plugin)=>result !== null && result !== void 0 ? result : plugin.api({
                    controller: bc,
                    pool: this
                })
            , null);
            if (!api) throw TpError.shouldNeverHappen();
            return api;
        }
    }
    function createDefaultPluginPool() {
        const pool = new PluginPool();
        [
            Point2dInputPlugin,
            Point3dInputPlugin,
            Point4dInputPlugin,
            StringInputPlugin,
            NumberInputPlugin,
            StringColorInputPlugin,
            ObjectColorInputPlugin,
            NumberColorInputPlugin,
            BooleanInputPlugin,
            BooleanMonitorPlugin,
            StringMonitorPlugin,
            NumberMonitorPlugin,
            ButtonBladePlugin,
            FolderBladePlugin,
            SeparatorBladePlugin,
            TabBladePlugin, 
        ].forEach((p)=>{
            pool.register(p);
        });
        return pool;
    }
    function point2dFromUnknown(value) {
        return Point2d.isObject(value) ? new Point2d(value.x, value.y) : new Point2d();
    }
    function writePoint2d(target, value) {
        target.writeProperty('x', value.x);
        target.writeProperty('y', value.y);
    }
    function createDimensionConstraint(params, initialValue) {
        if (!params) return undefined;
        const constraints = [];
        const cs = createStepConstraint(params, initialValue);
        if (cs) constraints.push(cs);
        const rs = createRangeConstraint(params);
        if (rs) constraints.push(rs);
        return new CompositeConstraint(constraints);
    }
    function createConstraint(params, initialValue) {
        return new PointNdConstraint({
            assembly: Point2dAssembly,
            components: [
                createDimensionConstraint('x' in params ? params.x : undefined, initialValue.x),
                createDimensionConstraint('y' in params ? params.y : undefined, initialValue.y), 
            ]
        });
    }
    function getSuitableMaxDimensionValue(constraint, rawValue) {
        const [min, max] = constraint ? findNumberRange(constraint) : [];
        if (!isEmpty(min) || !isEmpty(max)) return Math.max(Math.abs(min !== null && min !== void 0 ? min : 0), Math.abs(max !== null && max !== void 0 ? max : 0));
        const step = getBaseStep(constraint);
        return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
    }
    function getSuitableMaxValue(initialValue, constraint) {
        const xc = constraint instanceof PointNdConstraint ? constraint.components[0] : undefined;
        const yc = constraint instanceof PointNdConstraint ? constraint.components[1] : undefined;
        const xr = getSuitableMaxDimensionValue(xc, initialValue.x);
        const yr = getSuitableMaxDimensionValue(yc, initialValue.y);
        return Math.max(xr, yr);
    }
    function createAxis(initialValue, constraint) {
        return {
            baseStep: getBaseStep(constraint),
            constraint: constraint,
            textProps: ValueMap.fromObject({
                draggingScale: getSuitableDraggingScale(constraint, initialValue),
                formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue))
            })
        };
    }
    function shouldInvertY(params) {
        if (!('y' in params)) return false;
        const yParams = params.y;
        if (!yParams) return false;
        return 'inverted' in yParams ? !!yParams.inverted : false;
    }
    const Point2dInputPlugin = {
        id: 'input-point2d',
        type: 'input',
        accept: (value, params)=>{
            if (!Point2d.isObject(value)) return null;
            const p = ParamsParsers;
            const result = parseParams(params, {
                expanded: p.optional.boolean,
                picker: p.optional.custom(parsePickerLayout),
                x: p.optional.custom(parsePointDimensionParams),
                y: p.optional.object({
                    inverted: p.optional.boolean,
                    max: p.optional.number,
                    min: p.optional.number,
                    step: p.optional.number
                })
            });
            return result ? {
                initialValue: value,
                params: result
            } : null;
        },
        binding: {
            reader: (_args)=>point2dFromUnknown
            ,
            constraint: (args)=>createConstraint(args.params, args.initialValue)
            ,
            equals: Point2d.equals,
            writer: (_args)=>writePoint2d
        },
        controller: (args)=>{
            const doc = args.document;
            const value = args.value;
            const c = args.constraint;
            if (!(c instanceof PointNdConstraint)) throw TpError.shouldNeverHappen();
            const expanded = 'expanded' in args.params ? args.params.expanded : undefined;
            const picker = 'picker' in args.params ? args.params.picker : undefined;
            return new Point2dController(doc, {
                axes: [
                    createAxis(value.rawValue.x, c.components[0]),
                    createAxis(value.rawValue.y, c.components[1]), 
                ],
                expanded: expanded !== null && expanded !== void 0 ? expanded : false,
                invertsY: shouldInvertY(args.params),
                maxValue: getSuitableMaxValue(value.rawValue, c),
                parser: parseNumber,
                pickerLayout: picker !== null && picker !== void 0 ? picker : 'popup',
                value: value,
                viewProps: args.viewProps
            });
        }
    };
    class ListApi extends BladeApi {
        constructor(controller){
            super(controller);
            this.emitter_ = new Emitter();
            this.controller_.valueController.value.emitter.on('change', (ev)=>{
                this.emitter_.emit('change', {
                    event: new TpChangeEvent(this, ev.rawValue)
                });
            });
        }
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        get options() {
            return this.controller_.valueController.props.get('options');
        }
        set options(options) {
            this.controller_.valueController.props.set('options', options);
        }
        get value() {
            return this.controller_.valueController.value.rawValue;
        }
        set value(value) {
            this.controller_.valueController.value.rawValue = value;
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev)=>{
                bh(ev.event);
            });
            return this;
        }
    }
    class SliderApi extends BladeApi {
        constructor(controller){
            super(controller);
            this.emitter_ = new Emitter();
            this.controller_.valueController.value.emitter.on('change', (ev)=>{
                this.emitter_.emit('change', {
                    event: new TpChangeEvent(this, ev.rawValue)
                });
            });
        }
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        get maxValue() {
            return this.controller_.valueController.sliderController.props.get('maxValue');
        }
        set maxValue(maxValue) {
            this.controller_.valueController.sliderController.props.set('maxValue', maxValue);
        }
        get minValue() {
            return this.controller_.valueController.sliderController.props.get('minValue');
        }
        set minValue(minValue) {
            this.controller_.valueController.sliderController.props.set('minValue', minValue);
        }
        get value() {
            return this.controller_.valueController.value.rawValue;
        }
        set value(value) {
            this.controller_.valueController.value.rawValue = value;
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev)=>{
                bh(ev.event);
            });
            return this;
        }
    }
    class TextApi extends BladeApi {
        constructor(controller){
            super(controller);
            this.emitter_ = new Emitter();
            this.controller_.valueController.value.emitter.on('change', (ev)=>{
                this.emitter_.emit('change', {
                    event: new TpChangeEvent(this, ev.rawValue)
                });
            });
        }
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        get formatter() {
            return this.controller_.valueController.props.get('formatter');
        }
        set formatter(formatter) {
            this.controller_.valueController.props.set('formatter', formatter);
        }
        get value() {
            return this.controller_.valueController.value.rawValue;
        }
        set value(value) {
            this.controller_.valueController.value.rawValue = value;
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev)=>{
                bh(ev.event);
            });
            return this;
        }
    }
    const ListBladePlugin = function() {
        return {
            id: 'list',
            type: 'blade',
            accept (params) {
                const p = ParamsParsers;
                const result = parseParams(params, {
                    options: p.required.custom(parseListOptions),
                    value: p.required.raw,
                    view: p.required.constant('list'),
                    label: p.optional.string
                });
                return result ? {
                    params: result
                } : null;
            },
            controller (args) {
                const lc = new ListConstraint(normalizeListOptions(args.params.options));
                const value = createValue(args.params.value, {
                    constraint: lc
                });
                const ic = new ListController(args.document, {
                    props: new ValueMap({
                        options: lc.values.value('options')
                    }),
                    value: value,
                    viewProps: args.viewProps
                });
                return new LabeledValueController(args.document, {
                    blade: args.blade,
                    props: ValueMap.fromObject({
                        label: args.params.label
                    }),
                    valueController: ic
                });
            },
            api (args) {
                if (!(args.controller instanceof LabeledValueController)) return null;
                if (!(args.controller.valueController instanceof ListController)) return null;
                return new ListApi(args.controller);
            }
        };
    }();
    /**
     * @hidden
     */ function exportPresetJson(targets) {
        return targets.reduce((result, target)=>{
            return Object.assign(result, {
                [target.presetKey]: target.read()
            });
        }, {
        });
    }
    /**
     * @hidden
     */ function importPresetJson(targets, preset) {
        targets.forEach((target)=>{
            const value = preset[target.presetKey];
            if (value !== undefined) target.write(value);
        });
    }
    class RootApi extends FolderApi {
        /**
         * @hidden
         */ constructor(controller, pool){
            super(controller, pool);
        }
        get element() {
            return this.controller_.view.element;
        }
        /**
         * Imports a preset of all inputs.
         * @param preset The preset object to import.
         */ importPreset(preset) {
            const targets = this.controller_.rackController.rack.find(InputBindingController).map((ibc)=>{
                return ibc.binding.target;
            });
            importPresetJson(targets, preset);
            this.refresh();
        }
        /**
         * Exports a preset of all inputs.
         * @return An exported preset object.
         */ exportPreset() {
            const targets = this.controller_.rackController.rack.find(InputBindingController).map((ibc)=>{
                return ibc.binding.target;
            });
            return exportPresetJson(targets);
        }
        /**
         * Refreshes all bindings of the pane.
         */ refresh() {
            // Force-read all input bindings
            this.controller_.rackController.rack.find(InputBindingController).forEach((ibc)=>{
                ibc.binding.read();
            });
            // Force-read all monitor bindings
            this.controller_.rackController.rack.find(MonitorBindingController).forEach((mbc)=>{
                mbc.binding.read();
            });
        }
    }
    class RootController extends FolderController {
        constructor(doc, config){
            super(doc, {
                expanded: config.expanded,
                blade: config.blade,
                props: config.props,
                root: true,
                viewProps: config.viewProps
            });
        }
    }
    const SliderBladePlugin = {
        id: 'slider',
        type: 'blade',
        accept (params) {
            const p = ParamsParsers;
            const result = parseParams(params, {
                max: p.required.number,
                min: p.required.number,
                view: p.required.constant('slider'),
                format: p.optional.function,
                label: p.optional.string,
                value: p.optional.number
            });
            return result ? {
                params: result
            } : null;
        },
        controller (args) {
            var _a, _b;
            const initialValue = (_a = args.params.value) !== null && _a !== void 0 ? _a : 0;
            const drc = new DefiniteRangeConstraint({
                max: args.params.max,
                min: args.params.min
            });
            const vc = new SliderTextController(args.document, {
                baseStep: 1,
                parser: parseNumber,
                sliderProps: new ValueMap({
                    maxValue: drc.values.value('max'),
                    minValue: drc.values.value('min')
                }),
                textProps: ValueMap.fromObject({
                    draggingScale: getSuitableDraggingScale(undefined, initialValue),
                    formatter: (_b = args.params.format) !== null && _b !== void 0 ? _b : numberToString
                }),
                value: createValue(initialValue, {
                    constraint: drc
                }),
                viewProps: args.viewProps
            });
            return new LabeledValueController(args.document, {
                blade: args.blade,
                props: ValueMap.fromObject({
                    label: args.params.label
                }),
                valueController: vc
            });
        },
        api (args) {
            if (!(args.controller instanceof LabeledValueController)) return null;
            if (!(args.controller.valueController instanceof SliderTextController)) return null;
            return new SliderApi(args.controller);
        }
    };
    const TextBladePlugin = function() {
        return {
            id: 'text',
            type: 'blade',
            accept (params) {
                const p = ParamsParsers;
                const result = parseParams(params, {
                    parse: p.required.function,
                    value: p.required.raw,
                    view: p.required.constant('text'),
                    format: p.optional.function,
                    label: p.optional.string
                });
                return result ? {
                    params: result
                } : null;
            },
            controller (args) {
                var _a;
                const ic = new TextController(args.document, {
                    parser: args.params.parse,
                    props: ValueMap.fromObject({
                        formatter: (_a = args.params.format) !== null && _a !== void 0 ? _a : (v)=>String(v)
                    }),
                    value: createValue(args.params.value),
                    viewProps: args.viewProps
                });
                return new LabeledValueController(args.document, {
                    blade: args.blade,
                    props: ValueMap.fromObject({
                        label: args.params.label
                    }),
                    valueController: ic
                });
            },
            api (args) {
                if (!(args.controller instanceof LabeledValueController)) return null;
                if (!(args.controller.valueController instanceof TextController)) return null;
                return new TextApi(args.controller);
            }
        };
    }();
    function createDefaultWrapperElement(doc) {
        const elem = doc.createElement('div');
        elem.classList.add(ClassName('dfw')());
        if (doc.body) doc.body.appendChild(elem);
        return elem;
    }
    function embedStyle(doc, id, css) {
        if (doc.querySelector(`style[data-tp-style=${id}]`)) return;
        const styleElem = doc.createElement('style');
        styleElem.dataset.tpStyle = id;
        styleElem.textContent = css;
        doc.head.appendChild(styleElem);
    }
    /**
     * The root pane of Tweakpane.
     */ class Pane extends RootApi {
        constructor(opt_config){
            var _a, _b;
            const config = opt_config !== null && opt_config !== void 0 ? opt_config : {
            };
            const doc = (_a = config.document) !== null && _a !== void 0 ? _a : getWindowDocument();
            const pool = createDefaultPluginPool();
            const rootController = new RootController(doc, {
                expanded: config.expanded,
                blade: createBlade(),
                props: ValueMap.fromObject({
                    title: config.title
                }),
                viewProps: ViewProps.create()
            });
            super(rootController, pool);
            this.pool_ = pool;
            this.containerElem_ = (_b = config.container) !== null && _b !== void 0 ? _b : createDefaultWrapperElement(doc);
            this.containerElem_.appendChild(this.element);
            this.doc_ = doc;
            this.usesDefaultWrapper_ = !config.container;
            this.setUpDefaultPlugins_();
        }
        get document() {
            if (!this.doc_) throw TpError.alreadyDisposed();
            return this.doc_;
        }
        dispose() {
            const containerElem = this.containerElem_;
            if (!containerElem) throw TpError.alreadyDisposed();
            if (this.usesDefaultWrapper_) {
                const parentElem = containerElem.parentElement;
                if (parentElem) parentElem.removeChild(containerElem);
            }
            this.containerElem_ = null;
            this.doc_ = null;
            super.dispose();
        }
        registerPlugin(bundle) {
            const plugins = 'plugin' in bundle ? [
                bundle.plugin
            ] : 'plugins' in bundle ? bundle.plugins : [];
            plugins.forEach((p)=>{
                this.pool_.register(p);
                this.embedPluginStyle_(p);
            });
        }
        embedPluginStyle_(plugin) {
            if (plugin.css) embedStyle(this.document, `plugin-${plugin.id}`, plugin.css);
        }
        setUpDefaultPlugins_() {
            // NOTE: This string literal will be replaced with the default CSS by Rollup at the compilation time
            embedStyle(this.document, 'default', '.tp-tbiv_b,.tp-coltxtv_ms,.tp-ckbv_i,.tp-rotv_b,.tp-fldv_b,.tp-mllv_i,.tp-sglv_i,.tp-grlv_g,.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw,.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{background-color:var(--btn-bg);border-radius:var(--elm-br);color:var(--btn-fg);cursor:pointer;display:block;font-weight:bold;height:var(--bld-us);line-height:var(--bld-us);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tp-p2dv_b:hover,.tp-btnv_b:hover,.tp-lstv_s:hover{background-color:var(--btn-bg-h)}.tp-p2dv_b:focus,.tp-btnv_b:focus,.tp-lstv_s:focus{background-color:var(--btn-bg-f)}.tp-p2dv_b:active,.tp-btnv_b:active,.tp-lstv_s:active{background-color:var(--btn-bg-a)}.tp-p2dv_b:disabled,.tp-btnv_b:disabled,.tp-lstv_s:disabled{opacity:.5}.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw{background-color:var(--in-bg);border-radius:var(--elm-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--bld-us);line-height:var(--bld-us);min-width:0;width:100%}.tp-txtv_i:hover,.tp-p2dpv_p:hover,.tp-colswv_sw:hover{background-color:var(--in-bg-h)}.tp-txtv_i:focus,.tp-p2dpv_p:focus,.tp-colswv_sw:focus{background-color:var(--in-bg-f)}.tp-txtv_i:active,.tp-p2dpv_p:active,.tp-colswv_sw:active{background-color:var(--in-bg-a)}.tp-txtv_i:disabled,.tp-p2dpv_p:disabled,.tp-colswv_sw:disabled{opacity:.5}.tp-mllv_i,.tp-sglv_i,.tp-grlv_g{background-color:var(--mo-bg);border-radius:var(--elm-br);box-sizing:border-box;color:var(--mo-fg);height:var(--bld-us);scrollbar-color:currentColor rgba(0,0,0,0);scrollbar-width:thin;width:100%}.tp-mllv_i::-webkit-scrollbar,.tp-sglv_i::-webkit-scrollbar,.tp-grlv_g::-webkit-scrollbar{height:8px;width:8px}.tp-mllv_i::-webkit-scrollbar-corner,.tp-sglv_i::-webkit-scrollbar-corner,.tp-grlv_g::-webkit-scrollbar-corner{background-color:rgba(0,0,0,0)}.tp-mllv_i::-webkit-scrollbar-thumb,.tp-sglv_i::-webkit-scrollbar-thumb,.tp-grlv_g::-webkit-scrollbar-thumb{background-clip:padding-box;background-color:currentColor;border:rgba(0,0,0,0) solid 2px;border-radius:4px}.tp-rotv{--font-family: var(--tp-font-family, Roboto Mono, Source Code Pro, Menlo, Courier, monospace);--bs-br: var(--tp-base-border-radius, 6px);--cnt-h-p: var(--tp-container-horizontal-padding, 4px);--cnt-v-p: var(--tp-container-vertical-padding, 4px);--elm-br: var(--tp-element-border-radius, 2px);--bld-s: var(--tp-blade-spacing, 4px);--bld-us: var(--tp-blade-unit-size, 20px);--bs-bg: var(--tp-base-background-color, hsl(230deg, 7%, 17%));--bs-sh: var(--tp-base-shadow-color, rgba(0, 0, 0, 0.2));--btn-bg: var(--tp-button-background-color, hsl(230deg, 7%, 70%));--btn-bg-a: var(--tp-button-background-color-active, #d6d7db);--btn-bg-f: var(--tp-button-background-color-focus, #c8cad0);--btn-bg-h: var(--tp-button-background-color-hover, #bbbcc4);--btn-fg: var(--tp-button-foreground-color, hsl(230deg, 7%, 17%));--cnt-bg: var(--tp-container-background-color, rgba(187, 188, 196, 0.1));--cnt-bg-a: var(--tp-container-background-color-active, rgba(187, 188, 196, 0.25));--cnt-bg-f: var(--tp-container-background-color-focus, rgba(187, 188, 196, 0.2));--cnt-bg-h: var(--tp-container-background-color-hover, rgba(187, 188, 196, 0.15));--cnt-fg: var(--tp-container-foreground-color, hsl(230deg, 7%, 75%));--in-bg: var(--tp-input-background-color, rgba(187, 188, 196, 0.1));--in-bg-a: var(--tp-input-background-color-active, rgba(187, 188, 196, 0.25));--in-bg-f: var(--tp-input-background-color-focus, rgba(187, 188, 196, 0.2));--in-bg-h: var(--tp-input-background-color-hover, rgba(187, 188, 196, 0.15));--in-fg: var(--tp-input-foreground-color, hsl(230deg, 7%, 75%));--lbl-fg: var(--tp-label-foreground-color, rgba(187, 188, 196, 0.7));--mo-bg: var(--tp-monitor-background-color, rgba(0, 0, 0, 0.2));--mo-fg: var(--tp-monitor-foreground-color, rgba(187, 188, 196, 0.7));--grv-fg: var(--tp-groove-foreground-color, rgba(187, 188, 196, 0.1))}.tp-rotv_c>.tp-cntv.tp-v-lst,.tp-tabv_c .tp-brkv>.tp-cntv.tp-v-lst,.tp-fldv_c>.tp-cntv.tp-v-lst{margin-bottom:calc(-1*var(--cnt-v-p))}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-tabv_c .tp-brkv>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_c{border-bottom-left-radius:0}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-tabv_c .tp-brkv>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_b{border-bottom-left-radius:0}.tp-rotv_c>*:not(.tp-v-fst),.tp-tabv_c .tp-brkv>*:not(.tp-v-fst),.tp-fldv_c>*:not(.tp-v-fst){margin-top:var(--bld-s)}.tp-rotv_c>.tp-sprv:not(.tp-v-fst),.tp-tabv_c .tp-brkv>.tp-sprv:not(.tp-v-fst),.tp-fldv_c>.tp-sprv:not(.tp-v-fst),.tp-rotv_c>.tp-cntv:not(.tp-v-fst),.tp-tabv_c .tp-brkv>.tp-cntv:not(.tp-v-fst),.tp-fldv_c>.tp-cntv:not(.tp-v-fst){margin-top:var(--cnt-v-p)}.tp-rotv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-tabv_c .tp-brkv>.tp-sprv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-rotv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-tabv_c .tp-brkv>.tp-cntv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-cntv+*:not(.tp-v-hidden){margin-top:var(--cnt-v-p)}.tp-rotv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-tabv_c .tp-brkv>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-fldv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-rotv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-tabv_c .tp-brkv>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-fldv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv{margin-top:0}.tp-tabv_c .tp-brkv>.tp-cntv,.tp-fldv_c>.tp-cntv{margin-left:4px}.tp-tabv_c .tp-brkv>.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-fldv>.tp-fldv_b{border-top-left-radius:var(--elm-br);border-bottom-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv>.tp-fldv.tp-fldv-expanded>.tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b{border-bottom-left-radius:0}.tp-tabv_c .tp-brkv .tp-fldv>.tp-fldv_c,.tp-fldv_c .tp-fldv>.tp-fldv_c{border-bottom-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv>.tp-cntv+.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-cntv+.tp-fldv>.tp-fldv_b{border-top-left-radius:0}.tp-tabv_c .tp-brkv>.tp-cntv+.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-cntv+.tp-tabv>.tp-tabv_t{border-top-left-radius:0}.tp-tabv_c .tp-brkv>.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-tabv>.tp-tabv_t{border-top-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv .tp-tabv>.tp-tabv_c,.tp-fldv_c .tp-tabv>.tp-tabv_c{border-bottom-left-radius:var(--elm-br)}.tp-rotv_b,.tp-fldv_b{background-color:var(--cnt-bg);color:var(--cnt-fg);cursor:pointer;display:block;height:calc(var(--bld-us) + 4px);line-height:calc(var(--bld-us) + 4px);overflow:hidden;padding-left:var(--cnt-h-p);padding-right:calc(4px + var(--bld-us) + var(--cnt-h-p));position:relative;text-align:left;text-overflow:ellipsis;white-space:nowrap;width:100%;transition:border-radius .2s ease-in-out .2s}.tp-rotv_b:hover,.tp-fldv_b:hover{background-color:var(--cnt-bg-h)}.tp-rotv_b:focus,.tp-fldv_b:focus{background-color:var(--cnt-bg-f)}.tp-rotv_b:active,.tp-fldv_b:active{background-color:var(--cnt-bg-a)}.tp-rotv_b:disabled,.tp-fldv_b:disabled{opacity:.5}.tp-rotv_m,.tp-fldv_m{background:linear-gradient(to left, var(--cnt-fg), var(--cnt-fg) 2px, transparent 2px, transparent 4px, var(--cnt-fg) 4px);border-radius:2px;bottom:0;content:"";display:block;height:6px;right:calc(var(--cnt-h-p) + (var(--bld-us) + 4px - 6px)/2 - 2px);margin:auto;opacity:.5;position:absolute;top:0;transform:rotate(90deg);transition:transform .2s ease-in-out;width:6px}.tp-rotv.tp-rotv-expanded .tp-rotv_m,.tp-fldv.tp-fldv-expanded>.tp-fldv_b>.tp-fldv_m{transform:none}.tp-rotv_c,.tp-fldv_c{box-sizing:border-box;height:0;opacity:0;overflow:hidden;padding-bottom:0;padding-top:0;position:relative;transition:height .2s ease-in-out,opacity .2s linear,padding .2s ease-in-out}.tp-rotv.tp-rotv-cpl:not(.tp-rotv-expanded) .tp-rotv_c,.tp-fldv.tp-fldv-cpl:not(.tp-fldv-expanded)>.tp-fldv_c{display:none}.tp-rotv.tp-rotv-expanded .tp-rotv_c,.tp-fldv.tp-fldv-expanded>.tp-fldv_c{opacity:1;padding-bottom:var(--cnt-v-p);padding-top:var(--cnt-v-p);transform:none;overflow:visible;transition:height .2s ease-in-out,opacity .2s linear .2s,padding .2s ease-in-out}.tp-lstv,.tp-coltxtv_m{position:relative}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m,.tp-coltxtv_mm{bottom:0;margin:auto;pointer-events:none;position:absolute;right:2px;top:0}.tp-lstv_m svg,.tp-coltxtv_mm svg{bottom:0;height:16px;margin:auto;position:absolute;right:0;top:0;width:16px}.tp-lstv_m svg path,.tp-coltxtv_mm svg path{fill:currentColor}.tp-pndtxtv,.tp-coltxtv_w{display:flex}.tp-pndtxtv_a,.tp-coltxtv_c{width:100%}.tp-pndtxtv_a+.tp-pndtxtv_a,.tp-coltxtv_c+.tp-pndtxtv_a,.tp-pndtxtv_a+.tp-coltxtv_c,.tp-coltxtv_c+.tp-coltxtv_c{margin-left:2px}.tp-btnv_b{width:100%}.tp-btnv_t{text-align:center}.tp-ckbv_l{display:block;position:relative}.tp-ckbv_i{left:0;opacity:0;position:absolute;top:0}.tp-ckbv_w{background-color:var(--in-bg);border-radius:var(--elm-br);cursor:pointer;display:block;height:var(--bld-us);position:relative;width:var(--bld-us)}.tp-ckbv_w svg{bottom:0;display:block;height:16px;left:0;margin:auto;opacity:0;position:absolute;right:0;top:0;width:16px}.tp-ckbv_w svg path{fill:none;stroke:var(--in-fg);stroke-width:2}.tp-ckbv_i:hover+.tp-ckbv_w{background-color:var(--in-bg-h)}.tp-ckbv_i:focus+.tp-ckbv_w{background-color:var(--in-bg-f)}.tp-ckbv_i:active+.tp-ckbv_w{background-color:var(--in-bg-a)}.tp-ckbv_i:checked+.tp-ckbv_w svg{opacity:1}.tp-ckbv.tp-v-disabled .tp-ckbv_w{opacity:.5}.tp-colv{position:relative}.tp-colv_h{display:flex}.tp-colv_s{flex-grow:0;flex-shrink:0;width:var(--bld-us)}.tp-colv_t{flex:1;margin-left:4px}.tp-colv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-colv.tp-colv-cpl .tp-colv_p{overflow:visible}.tp-colv.tp-colv-expanded .tp-colv_p{margin-top:var(--bld-s);opacity:1}.tp-colv .tp-popv{left:calc(-1*var(--cnt-h-p));right:calc(-1*var(--cnt-h-p));top:var(--bld-us)}.tp-colpv_h,.tp-colpv_ap{margin-left:6px;margin-right:6px}.tp-colpv_h{margin-top:var(--bld-s)}.tp-colpv_rgb{display:flex;margin-top:var(--bld-s);width:100%}.tp-colpv_a{display:flex;margin-top:var(--cnt-v-p);padding-top:calc(var(--cnt-v-p) + 2px);position:relative}.tp-colpv_a::before{background-color:var(--grv-fg);content:"";height:2px;left:calc(-1*var(--cnt-h-p));position:absolute;right:calc(-1*var(--cnt-h-p));top:0}.tp-colpv.tp-v-disabled .tp-colpv_a::before{opacity:.5}.tp-colpv_ap{align-items:center;display:flex;flex:3}.tp-colpv_at{flex:1;margin-left:4px}.tp-svpv{border-radius:var(--elm-br);outline:none;overflow:hidden;position:relative}.tp-svpv.tp-v-disabled{opacity:.5}.tp-svpv_c{cursor:crosshair;display:block;height:calc(var(--bld-us)*4);width:100%}.tp-svpv_m{border-radius:100%;border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;filter:drop-shadow(0 0 1px rgba(0, 0, 0, 0.3));height:12px;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;width:12px}.tp-svpv:focus .tp-svpv_m{border-color:#fff}.tp-hplv{cursor:pointer;height:var(--bld-us);outline:none;position:relative}.tp-hplv.tp-v-disabled{opacity:.5}.tp-hplv_c{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAABCAYAAABubagXAAAAQ0lEQVQoU2P8z8Dwn0GCgQEDi2OK/RBgYHjBgIpfovFh8j8YBIgzFGQxuqEgPhaDOT5gOhPkdCxOZeBg+IDFZZiGAgCaSSMYtcRHLgAAAABJRU5ErkJggg==);background-position:left top;background-repeat:no-repeat;background-size:100% 100%;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;position:absolute;top:50%;width:100%}.tp-hplv_m{border-radius:var(--elm-br);border:rgba(255,255,255,.75) solid 2px;box-shadow:0 0 2px rgba(0,0,0,.1);box-sizing:border-box;height:12px;left:50%;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;top:50%;width:12px}.tp-hplv:focus .tp-hplv_m{border-color:#fff}.tp-aplv{cursor:pointer;height:var(--bld-us);outline:none;position:relative;width:100%}.tp-aplv.tp-v-disabled{opacity:.5}.tp-aplv_b{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:4px 4px;background-position:0 0,2px 2px;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;overflow:hidden;position:absolute;top:50%;width:100%}.tp-aplv_c{bottom:0;left:0;position:absolute;right:0;top:0}.tp-aplv_m{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:12px 12px;background-position:0 0,6px 6px;border-radius:var(--elm-br);box-shadow:0 0 2px rgba(0,0,0,.1);height:12px;left:50%;margin-left:-6px;margin-top:-6px;overflow:hidden;pointer-events:none;position:absolute;top:50%;width:12px}.tp-aplv_p{border-radius:var(--elm-br);border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;bottom:0;left:0;position:absolute;right:0;top:0}.tp-aplv:focus .tp-aplv_p{border-color:#fff}.tp-colswv{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:10px 10px;background-position:0 0,5px 5px;border-radius:var(--elm-br);overflow:hidden}.tp-colswv.tp-v-disabled{opacity:.5}.tp-colswv_sw{border-radius:0}.tp-colswv_b{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;cursor:pointer;display:block;height:var(--bld-us);left:0;margin:0;outline:none;padding:0;position:absolute;top:0;width:var(--bld-us)}.tp-colswv_b:focus::after{border:rgba(255,255,255,.75) solid 2px;border-radius:var(--elm-br);bottom:0;content:"";display:block;left:0;position:absolute;right:0;top:0}.tp-coltxtv{display:flex;width:100%}.tp-coltxtv_m{margin-right:4px}.tp-coltxtv_ms{border-radius:var(--elm-br);color:var(--lbl-fg);cursor:pointer;height:var(--bld-us);line-height:var(--bld-us);padding:0 18px 0 4px}.tp-coltxtv_ms:hover{background-color:var(--in-bg-h)}.tp-coltxtv_ms:focus{background-color:var(--in-bg-f)}.tp-coltxtv_ms:active{background-color:var(--in-bg-a)}.tp-coltxtv_mm{color:var(--lbl-fg)}.tp-coltxtv.tp-v-disabled .tp-coltxtv_mm{opacity:.5}.tp-coltxtv_w{flex:1}.tp-dfwv{position:absolute;top:8px;right:8px;width:256px}.tp-fldv{position:relative}.tp-fldv.tp-fldv-not .tp-fldv_b{display:none}.tp-fldv_t{padding-left:4px}.tp-fldv_b:disabled .tp-fldv_m{display:none}.tp-fldv_c{padding-left:4px}.tp-fldv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--bld-us) + 4px);width:var(--bs-br)}.tp-fldv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-fldv_b:hover+.tp-fldv_i{color:var(--cnt-bg-h)}.tp-fldv_b:focus+.tp-fldv_i{color:var(--cnt-bg-f)}.tp-fldv_b:active+.tp-fldv_i{color:var(--cnt-bg-a)}.tp-fldv.tp-v-disabled>.tp-fldv_i{opacity:.5}.tp-grlv{position:relative}.tp-grlv_g{display:block;height:calc(var(--bld-us)*3)}.tp-grlv_g polyline{fill:none;stroke:var(--mo-fg);stroke-linejoin:round}.tp-grlv_t{margin-top:-4px;transition:left .05s,top .05s;visibility:hidden}.tp-grlv_t.tp-grlv_t-a{visibility:visible}.tp-grlv_t.tp-grlv_t-in{transition:none}.tp-grlv.tp-v-disabled .tp-grlv_g{opacity:.5}.tp-grlv .tp-ttv{background-color:var(--mo-fg)}.tp-grlv .tp-ttv::before{border-top-color:var(--mo-fg)}.tp-lblv{align-items:center;display:flex;line-height:1.3;padding-left:var(--cnt-h-p);padding-right:var(--cnt-h-p)}.tp-lblv.tp-lblv-nol{display:block}.tp-lblv_l{color:var(--lbl-fg);flex:1;-webkit-hyphens:auto;hyphens:auto;overflow:hidden;padding-left:4px;padding-right:16px}.tp-lblv.tp-v-disabled .tp-lblv_l{opacity:.5}.tp-lblv.tp-lblv-nol .tp-lblv_l{display:none}.tp-lblv_v{align-self:flex-start;flex-grow:0;flex-shrink:0;width:160px}.tp-lblv.tp-lblv-nol .tp-lblv_v{width:100%}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m{color:var(--btn-fg)}.tp-sglv_i{padding:0 4px}.tp-sglv.tp-v-disabled .tp-sglv_i{opacity:.5}.tp-mllv_i{display:block;height:calc(var(--bld-us)*3);line-height:var(--bld-us);padding:0 4px;resize:none;white-space:pre}.tp-mllv.tp-v-disabled .tp-mllv_i{opacity:.5}.tp-p2dv{position:relative}.tp-p2dv_h{display:flex}.tp-p2dv_b{height:var(--bld-us);margin-right:4px;position:relative;width:var(--bld-us)}.tp-p2dv_b svg{display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px}.tp-p2dv_b svg path{stroke:currentColor;stroke-width:2}.tp-p2dv_b svg circle{fill:currentColor}.tp-p2dv_t{flex:1}.tp-p2dv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-p2dv.tp-p2dv-expanded .tp-p2dv_p{margin-top:var(--bld-s);opacity:1}.tp-p2dv .tp-popv{left:calc(-1*var(--cnt-h-p));right:calc(-1*var(--cnt-h-p));top:var(--bld-us)}.tp-p2dpv{padding-left:calc(var(--bld-us) + 4px)}.tp-p2dpv_p{cursor:crosshair;height:0;overflow:hidden;padding-bottom:100%;position:relative}.tp-p2dpv.tp-v-disabled .tp-p2dpv_p{opacity:.5}.tp-p2dpv_g{display:block;height:100%;left:0;pointer-events:none;position:absolute;top:0;width:100%}.tp-p2dpv_ax{opacity:.1;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_l{opacity:.5;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_m{border:var(--in-fg) solid 1px;border-radius:50%;box-sizing:border-box;height:4px;margin-left:-2px;margin-top:-2px;position:absolute;width:4px}.tp-p2dpv_p:focus .tp-p2dpv_m{background-color:var(--in-fg);border-width:0}.tp-popv{background-color:var(--bs-bg);border-radius:6px;box-shadow:0 2px 4px var(--bs-sh);display:none;max-width:168px;padding:var(--cnt-v-p) var(--cnt-h-p);position:absolute;visibility:hidden;z-index:1000}.tp-popv.tp-popv-v{display:block;visibility:visible}.tp-sprv_r{background-color:var(--grv-fg);border-width:0;display:block;height:2px;margin:0;width:100%}.tp-sprv.tp-v-disabled .tp-sprv_r{opacity:.5}.tp-sldv.tp-v-disabled{opacity:.5}.tp-sldv_t{box-sizing:border-box;cursor:pointer;height:var(--bld-us);margin:0 6px;outline:none;position:relative}.tp-sldv_t::before{background-color:var(--in-bg);border-radius:1px;bottom:0;content:"";display:block;height:2px;left:0;margin:auto;position:absolute;right:0;top:0}.tp-sldv_k{height:100%;left:0;position:absolute;top:0}.tp-sldv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";display:block;height:2px;left:0;margin-bottom:auto;margin-top:auto;position:absolute;right:0;top:0}.tp-sldv_k::after{background-color:var(--btn-bg);border-radius:var(--elm-br);bottom:0;content:"";display:block;height:12px;margin-bottom:auto;margin-top:auto;position:absolute;right:-6px;top:0;width:12px}.tp-sldv_t:hover .tp-sldv_k::after{background-color:var(--btn-bg-h)}.tp-sldv_t:focus .tp-sldv_k::after{background-color:var(--btn-bg-f)}.tp-sldv_t:active .tp-sldv_k::after{background-color:var(--btn-bg-a)}.tp-sldtxtv{display:flex}.tp-sldtxtv_s{flex:2}.tp-sldtxtv_t{flex:1;margin-left:4px}.tp-tabv{position:relative}.tp-tabv_t{align-items:flex-end;color:var(--cnt-bg);display:flex;overflow:hidden;position:relative}.tp-tabv_t:hover{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus){color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active){color:var(--cnt-bg-a)}.tp-tabv_t::before{background-color:currentColor;bottom:0;content:"";height:2px;left:0;pointer-events:none;position:absolute;right:0}.tp-tabv.tp-v-disabled .tp-tabv_t::before{opacity:.5}.tp-tabv.tp-tabv-nop .tp-tabv_t{height:calc(var(--bld-us) + 4px);position:relative}.tp-tabv.tp-tabv-nop .tp-tabv_t::before{background-color:var(--cnt-bg);bottom:0;content:"";height:2px;left:0;position:absolute;right:0}.tp-tabv_c{padding-bottom:var(--cnt-v-p);padding-left:4px;padding-top:var(--cnt-v-p)}.tp-tabv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--bld-us) + 4px);width:var(--bs-br)}.tp-tabv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-tabv_t:hover+.tp-tabv_i{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus)+.tp-tabv_i{color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active)+.tp-tabv_i{color:var(--cnt-bg-a)}.tp-tabv.tp-v-disabled>.tp-tabv_i{opacity:.5}.tp-tbiv{flex:1;min-width:0;position:relative}.tp-tbiv+.tp-tbiv{margin-left:2px}.tp-tbiv+.tp-tbiv.tp-v-disabled::before{opacity:.5}.tp-tbiv_b{display:block;padding-left:calc(var(--cnt-h-p) + 4px);padding-right:calc(var(--cnt-h-p) + 4px);position:relative;width:100%}.tp-tbiv_b:disabled{opacity:.5}.tp-tbiv_b::before{background-color:var(--cnt-bg);bottom:2px;content:"";left:0;pointer-events:none;position:absolute;right:0;top:0}.tp-tbiv_b:hover::before{background-color:var(--cnt-bg-h)}.tp-tbiv_b:focus::before{background-color:var(--cnt-bg-f)}.tp-tbiv_b:active::before{background-color:var(--cnt-bg-a)}.tp-tbiv_t{color:var(--cnt-fg);height:calc(var(--bld-us) + 4px);line-height:calc(var(--bld-us) + 4px);opacity:.5;overflow:hidden;text-overflow:ellipsis}.tp-tbiv.tp-tbiv-sel .tp-tbiv_t{opacity:1}.tp-txtv{position:relative}.tp-txtv_i{padding:0 4px}.tp-txtv.tp-txtv-fst .tp-txtv_i{border-bottom-right-radius:0;border-top-right-radius:0}.tp-txtv.tp-txtv-mid .tp-txtv_i{border-radius:0}.tp-txtv.tp-txtv-lst .tp-txtv_i{border-bottom-left-radius:0;border-top-left-radius:0}.tp-txtv.tp-txtv-num .tp-txtv_i{text-align:right}.tp-txtv.tp-txtv-drg .tp-txtv_i{opacity:.3}.tp-txtv_k{cursor:pointer;height:100%;left:-3px;position:absolute;top:0;width:12px}.tp-txtv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";height:calc(var(--bld-us) - 4px);left:50%;margin-bottom:auto;margin-left:-1px;margin-top:auto;opacity:.1;position:absolute;top:0;transition:border-radius .1s,height .1s,transform .1s,width .1s;width:2px}.tp-txtv_k:hover::before,.tp-txtv.tp-txtv-drg .tp-txtv_k::before{opacity:1}.tp-txtv.tp-txtv-drg .tp-txtv_k::before{border-radius:50%;height:4px;transform:translateX(-1px);width:4px}.tp-txtv_g{bottom:0;display:block;height:8px;left:50%;margin:auto;overflow:visible;pointer-events:none;position:absolute;top:0;visibility:hidden;width:100%}.tp-txtv.tp-txtv-drg .tp-txtv_g{visibility:visible}.tp-txtv_gb{fill:none;stroke:var(--in-fg);stroke-dasharray:1}.tp-txtv_gh{fill:none;stroke:var(--in-fg)}.tp-txtv .tp-ttv{margin-left:6px;visibility:hidden}.tp-txtv.tp-txtv-drg .tp-ttv{visibility:visible}.tp-ttv{background-color:var(--in-fg);border-radius:var(--elm-br);color:var(--bs-bg);padding:2px 4px;pointer-events:none;position:absolute;transform:translate(-50%, -100%)}.tp-ttv::before{border-color:var(--in-fg) rgba(0,0,0,0) rgba(0,0,0,0) rgba(0,0,0,0);border-style:solid;border-width:2px;box-sizing:border-box;content:"";font-size:.9em;height:4px;left:50%;margin-left:-2px;position:absolute;top:100%;width:4px}.tp-rotv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);font-family:var(--font-family);font-size:11px;font-weight:500;line-height:1;text-align:left}.tp-rotv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br);border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br);padding-left:calc(4px + var(--bld-us) + var(--cnt-h-p));text-align:center}.tp-rotv.tp-rotv-expanded .tp-rotv_b{border-bottom-left-radius:0;border-bottom-right-radius:0}.tp-rotv.tp-rotv-not .tp-rotv_b{display:none}.tp-rotv_b:disabled .tp-rotv_m{display:none}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c .tp-fldv.tp-v-vlst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-right-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst{margin-top:calc(-1*var(--cnt-v-p))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst>.tp-fldv_b{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst{margin-top:calc(-1*var(--cnt-v-p))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst>.tp-tabv_t{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv.tp-v-disabled,.tp-rotv .tp-v-disabled{pointer-events:none}.tp-rotv.tp-v-hidden,.tp-rotv .tp-v-hidden{display:none}');
            this.pool_.getAll().forEach((plugin)=>{
                this.embedPluginStyle_(plugin);
            });
            this.registerPlugin({
                plugins: [
                    SliderBladePlugin,
                    ListBladePlugin,
                    TabBladePlugin,
                    TextBladePlugin, 
                ]
            });
        }
    }
    const VERSION = new Semver('3.1.4');
    exports.BladeApi = BladeApi;
    exports.ButtonApi = ButtonApi;
    exports.FolderApi = FolderApi;
    exports.InputBindingApi = InputBindingApi;
    exports.ListApi = ListApi;
    exports.MonitorBindingApi = MonitorBindingApi;
    exports.Pane = Pane;
    exports.SeparatorApi = SeparatorApi;
    exports.SliderApi = SliderApi;
    exports.TabApi = TabApi;
    exports.TabPageApi = TabPageApi;
    exports.TextApi = TextApi;
    exports.TpChangeEvent = TpChangeEvent;
    exports.VERSION = VERSION;
    Object.defineProperty(exports, '__esModule', {
        value: true
    });
});


class $2e2f149111861b23$export$508ce7ea6c05352e {
    open(settings, maxWidth, maxHeight, onChange, onKill, onClose) {
        this.pane = new $2c73cfb2b22824f7$exports.Pane();
        this.pane.addInput(settings, 'activeArea', {
            label: 'X / Y',
            x: {
                step: 20
            },
            y: {
                step: 20
            }
        });
        this.pane.addInput(settings.activeArea, 'width', {
            label: 'Width',
            min: 100,
            max: maxWidth,
            step: 10
        });
        this.pane.addInput(settings.activeArea, 'height', {
            label: 'Height',
            min: 100,
            max: maxHeight,
            step: 10
        });
        const handFolder = this.pane.addFolder({
            title: 'Hand',
            expanded: true
        });
        handFolder.addInput(settings, 'showHand', {
            label: 'Show'
        });
        handFolder.addInput(settings, 'handSize', {
            label: 'Hand Size',
            min: 0,
            step: 1
        });
        handFolder.addInput(settings, 'handScale', {
            label: 'Hand Scale',
            min: 0,
            max: 2,
            step: 0.1
        });
        handFolder.addInput(settings, 'handColor', {
            label: 'Hand Color'
        });
        const bodyFolder = this.pane.addFolder({
            title: 'Body',
            expanded: true
        });
        bodyFolder.addInput(settings, 'showBody', {
            label: 'Show'
        });
        bodyFolder.addInput(settings, 'bodyScale', {
            label: 'Body Scale',
            min: 0,
            max: 2,
            step: 0.1
        });
        bodyFolder.addInput(settings, 'bodyColor', {
            label: 'Body Color'
        });
        bodyFolder.addInput(settings, 'simulateBody', {
            label: 'Simulate with mouse'
        });
        this.pane.on('change', ()=>{
            onChange(this.pane.exportPreset());
        });
        const killBtn = this.pane.addButton({
            title: 'Kill skeletons'
        });
        killBtn.on('click', ()=>{
            onKill();
        });
        this.pane.addSeparator();
        const btn = this.pane.addButton({
            title: 'CLOSE'
        });
        btn.on('click', ()=>{
            onClose();
            this.pane.dispose();
        });
    }
    close() {
        this.pane && this.pane.dispose();
    }
}


class $3770175ebe933327$export$3d291c804b17ab69 {
    /**
   * Initializes a new instance of the SkeletonController class.
   * @param width Active area width.
   * @param height Active area height.
   * @param onUpdate Callback fired when a skeleton is updated.
   * @param onSettingsChanged Callback fired when settings change.
   */ constructor(width, height, onUpdate, onSettingsChanged){
        this.skeletons = new Map();
        this.showBody = true;
        this.showHand = true;
        this.keyToOpenSettings = 's';
        this.debug = false;
        this.simulateBody = false;
        this.handSize = 10;
        this.width = width;
        this.height = height;
        this.onUpdateCallback = onUpdate;
        this.onSettingsChangedCallback = onSettingsChanged;
        this.activeArea = {
            x: 0,
            y: 0,
            width: width,
            height: height
        };
        this.bodyScale = 1;
        this.bodyColor = '#0000FF';
        this.handScale = 1;
        this.handColor = '#FF0000';
        window.addEventListener('message', (event)=>{
            this.parseEvent(event.data);
        }, false);
        this.settings = new $2e2f149111861b23$export$508ce7ea6c05352e();
        window.addEventListener('keydown', (event)=>{
            if (event.key === this.keyToOpenSettings) this.debug ? this.closeSettings() : this.openSettings();
        });
        // create canvas and context for debugging purposes
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.width = this.width;
        canvas.height = this.height;
        document.body.appendChild(canvas);
        this.debugContext = canvas.getContext('2d');
    }
    /**
   * Gets the skeletons.
   * @returns Array of skeletons.
   */ getSkeletons() {
        return Array.from(this.skeletons.values());
    }
    /**
   * Opens a panel to set the skeletons settings.
   */ openSettings() {
        this.debug = true;
        let settings = {
            activeArea: {
                ...this.activeArea
            },
            showHand: this.showHand,
            handScale: this.handScale,
            handSize: this.handSize,
            handColor: this.handColor,
            showBody: this.showBody,
            bodyScale: this.bodyScale,
            bodyColor: this.bodyColor,
            simulateBody: this.simulateBody
        };
        this.settings.open(settings, this.width, this.height, (newSettings)=>{
            this.setActiveArea(newSettings.activeArea.x, newSettings.activeArea.y, newSettings.activeArea.width, newSettings.activeArea.height);
            this.setHandSize(newSettings.handSize);
            this.setScale(newSettings.handScale, newSettings.bodyScale);
            this.showBody = newSettings.showBody;
            this.showHand = newSettings.showHand;
            this.setColor(newSettings.handColor, newSettings.bodyColor);
            this.simulateBody = newSettings.simulateBody;
            this.onSettingsChangedCallback && this.onSettingsChangedCallback(newSettings);
        }, ()=>{
        }, ()=>{
            this.debug = false;
        });
    }
    /**
   * Closes the skeletons settings panel.
   */ closeSettings() {
        this.debug = false;
        this.settings.close();
    }
    /**
   * Sets the skeletons active area.
   * @param x Left offset.
   * @param y Top offset.
   * @param width Width.
   * @param height Height.
   */ setActiveArea(x, y, width, height) {
        this.activeArea = {
            x: x,
            y: y,
            width: width,
            height: height
        };
    }
    /**
   * Sets the scale.
   * @param handScale Hands scale.
   * @param bodyScale Body scale.
   */ setScale(handScale, bodyScale) {
        this.handScale = handScale;
        this.bodyScale = bodyScale;
    }
    /**
   * Sets the body and hand color.
   * @param handColor Hand color.
   * @param bodyColor Body color.
   */ setColor(handColor, bodyColor) {
        this.handColor = handColor;
        this.bodyColor = bodyColor;
    }
    /**
   * Sets the hand size.
   * @param size Hand size.
   */ setHandSize(size) {
        this.handSize = size;
    }
    /**
   * Sets the key to open the settings panel when pressed.
   * @param key Key.
   */ setKeyToOpenSettings(key) {
        this.keyToOpenSettings = key;
    }
    parseEvent(event) {
        this.debugContext && this.debugContext.clearRect(0, 0, this.debugContext.canvas.width, this.debugContext.canvas.height);
        this.debug && this.drawActiveArea();
        if (event.type === 'person') {
            if (event.action === 'drop') {
                console.log('skeleton dropped', event.id);
                this.skeletons.delete(event.id);
                this.onUpdateCallback && this.onUpdateCallback();
                return;
            }
            let skeleton = this.skeletons.get(event.id);
            if (!skeleton) {
                skeleton = new $b361dac4ff58c895$export$8f31e4c4a37b8e9c(event.id);
                this.skeletons.set(event.id, skeleton);
            }
            if (event.bbox) {
                const body = {
                    x: this.activeArea.x + event.bbox[0] * this.activeArea.width,
                    y: this.activeArea.y + event.bbox[1] * this.activeArea.height,
                    width: event.bbox[2] * this.activeArea.width * this.bodyScale,
                    height: event.bbox[3] * this.activeArea.height * this.bodyScale
                };
                skeleton.setBody(body);
                this.debug && this.showBody && this.drawRect(body, this.bodyColor);
            }
            if (event.hands && event.hands.leftxy) {
                const scale = (event.hands.scale > 0 ? event.hands.scale : 1) * this.handScale;
                const hand = {
                    x: this.activeArea.x + event.hands.leftxy[0] * this.activeArea.width,
                    y: this.activeArea.y + event.hands.leftxy[1] * this.activeArea.height,
                    width: this.handSize * scale,
                    height: this.handSize * scale
                };
                skeleton.setLeftHand(hand);
                this.debug && this.showHand && this.drawRect(hand, this.handColor);
            }
            if (event.hands && event.hands.rightxy) {
                const scale = (event.hands.scale > 0 ? event.hands.scale : 1) * this.handScale;
                const hand = {
                    x: this.activeArea.x + event.hands.rightxy[0] * this.activeArea.width,
                    y: this.activeArea.y + event.hands.rightxy[1] * this.activeArea.height,
                    width: this.handSize * scale,
                    height: this.handSize * scale
                };
                skeleton.setRightHand(hand);
                this.debug && this.showHand && this.drawRect(hand, this.handColor);
            }
            this.onUpdateCallback && this.onUpdateCallback();
        }
    }
    drawActiveArea() {
        this.debugContext.beginPath();
        this.debugContext.lineWidth = 2;
        this.debugContext.strokeStyle = '#ff0000';
        this.debugContext.rect(this.activeArea.x, this.activeArea.y, this.activeArea.width, this.activeArea.height);
        this.debugContext.stroke();
    }
    drawRect(rect, color) {
        if (rect.x > 0 && rect.y > 0) {
            this.debugContext.beginPath();
            this.debugContext.lineWidth = 2;
            this.debugContext.rect(rect.x, rect.y, rect.width, rect.height);
            this.debugContext.fillStyle = (/*@__PURE__*/$parcel$interopDefault($7290a84254f9152a$exports))(color, 0.2);
            this.debugContext.fill();
            this.debugContext.strokeStyle = (/*@__PURE__*/$parcel$interopDefault($7290a84254f9152a$exports))(color);
            this.debugContext.stroke();
        }
    }
}


class $6db29b1b65334d8d$export$410db1ee4b845acb {
    /**
   * 
   * @param writeJson Function to write a json
   * @param readJson Function to read a json 
   */ constructor(writeJson, readJson){
        this.writeJson = writeJson;
        this.readJson = readJson;
    }
    /**
   * 
   * @param name File name
   * @param json Json content
   */ write(name, json) {
        this.writeJson(name, json);
    }
    /**
    * 
    * @param name File name
    */ read(name) {
        const content = this.readJson(name);
        return content;
    }
}


class $6ec607019daadc0e$export$19fffca37ef3e106 {
    /**
   * 
   * @param name File name
   * @param content Json content
   */ write(name, content) {
        localStorage.setItem(name, JSON.stringify(content));
    }
    /**
   * 
   * @param name File name
   * @returns Json content for the given project
   */ read(name) {
        const content = localStorage.getItem(name);
        if (content) return JSON.parse(content);
        return null;
    }
}


class $50f70f6146996d62$export$cec157cbbbaf65c9 {
    static inElectron() {
        // @ts-ignore
        return !!window.electron;
    }
    static writeJson(name, json) {
        // @ts-ignore
        return window.app && window.app.writeJson(name, json);
    }
    static readJson(name) {
        // @ts-ignore
        return window.app && window.app.readJson(name);
    }
    static downloadFile(url, name, onUpdate, onError, onSuccess) {
        // @ts-ignore
        return window.app && window.app.downloadFile && window.app.downloadFile(url, name, onUpdate, onError, onSuccess);
    }
    static getMediaInfo() {
        // @ts-ignore
        return window.app && window.app.media;
    }
    static getDeviceInfo() {
        // @ts-ignore
        return window.app && window.app.device;
    }
    static logAlarm(subject, text) {
        //@ts-ignore
        window.app && window.app.logAlarm(subject, text);
    }
}


let $d730cefd4995cd16$var$Message;
(function(Message) {
    Message["deviceNotFound"] = 'Device not found';
    Message["forbiddenProjectName"] = 'Please use a different project name';
})($d730cefd4995cd16$var$Message || ($d730cefd4995cd16$var$Message = {
}));
var $d730cefd4995cd16$export$2e2bcd8739ae039 = $d730cefd4995cd16$var$Message;


class $1d232d6f53298d52$export$12b3cc2522c3bba5 {
    /**
   * Creates an instance of the KeyValue class.
   */ constructor(){
        this.contents = {
        };
        if ($50f70f6146996d62$export$cec157cbbbaf65c9.inElectron()) this.storage = new $6db29b1b65334d8d$export$410db1ee4b845acb($50f70f6146996d62$export$cec157cbbbaf65c9.writeJson, $50f70f6146996d62$export$cec157cbbbaf65c9.readJson);
        else this.storage = new $6ec607019daadc0e$export$19fffca37ef3e106();
    }
    /**
   * Sets a value in storage
   * @param name File name
   * @param key Key assigned to the value to store
   * @param value Value to store
   * ``` typescript
   * // example
   * const user = {
   *   firstName: 'John',
   *   lastName: 'Doe'
   * };
   * const keyValue = new broox.mediaPlayer.KeyValue();
   * keyValue.set('testApp', 'profile', user);
   * ```
   */ setValue(name, key, value) {
        if (name === 'config') {
            console.error($d730cefd4995cd16$export$2e2bcd8739ae039.forbiddenProjectName);
            return;
        }
        // get storage
        let content = this.getContent(name);
        if (!content) content = {
        };
        content[key] = value;
        this.storage.write(name, content);
    }
    /**
   * Gets a value from a content in storage
   * @param name File name
   * @param key Key
   * @returns The value for the given key
   * ``` typescript
   * // example
   * const keyValue = new broox.mediaPlayer.KeyValue();
   * const user = keyValue.get('testApp', 'profile');
   * console.log('User', user);
   * ```
   */ getValue(name, key) {
        const storage = this.getContent(name);
        return storage ? storage[key] : null;
    }
    /**
   * Gets a content from memory or storage
   * @param name File name
   * @returns The content with the given name if exists, null otherwise
   */ getContent(name) {
        // get storage from memory
        if (this.contents[name]) return this.contents[name];
        else // get content from storage
        try {
            return this.storage.read(name);
        } catch (error) {
            // the content does not exist
            return null;
        }
    }
}


let $9ee8d1e4b992a82a$export$ff50662d7c6e93a2;
(function($9ee8d1e4b992a82a$export$ff50662d7c6e93a2) {
    $9ee8d1e4b992a82a$export$ff50662d7c6e93a2["LeftHandUp"] = 'left_hand_up';
    $9ee8d1e4b992a82a$export$ff50662d7c6e93a2["RightHandUp"] = 'right_hand_up';
    $9ee8d1e4b992a82a$export$ff50662d7c6e93a2["BothHandsUp"] = 'both_hands_up';
    $9ee8d1e4b992a82a$export$ff50662d7c6e93a2["PointsLeft"] = 'points_left';
    $9ee8d1e4b992a82a$export$ff50662d7c6e93a2["PointsRight"] = 'points_right';
    $9ee8d1e4b992a82a$export$ff50662d7c6e93a2["LeftHandOnChest"] = 'left_hand_on_chest';
    $9ee8d1e4b992a82a$export$ff50662d7c6e93a2["RightHandOnChest"] = 'right_hand_on_chest';
    $9ee8d1e4b992a82a$export$ff50662d7c6e93a2["BothHandsOnChest"] = 'both_hands_on_chest';
})($9ee8d1e4b992a82a$export$ff50662d7c6e93a2 || ($9ee8d1e4b992a82a$export$ff50662d7c6e93a2 = {
}));


class $ce40448578812b6e$export$dfd4fa32db6567bf {
    /**
   * Creates an instance of the GestureHandler class.
   * @param time Time lapse in milliseconds before accepting a gesture as such.
   * @param delay Time lapse in seconds before listening to other gestures once a gesture is accepted.
   */ constructor(time, delay){
        this.listening = true;
        this.gestures = [];
        this.availableTypes = Object.values($9ee8d1e4b992a82a$export$ff50662d7c6e93a2);
        this.time = time;
        this.delay = delay;
        const self = this;
        // listen osc events
        window.addEventListener('message', (event)=>{
            this.parseEvent(event.data);
        }, false);
    }
    /**
   * Adds a callback function for the "presence" gesture.
   * @param callback Function that will be executed when the presence gesture is detected.
   */ onPresence(callback) {
        this.presenceCallback = callback;
    }
    /**
   * Adds a callback function for the "both hands up" gesture.
   * @param callback Function that will be executed when the "both hands up" gesture is detected.
   */ onBothHandsUp(callback) {
        this.bothHandsUpCallback = callback;
    }
    /**
   * Adds a callback function for the "left hand up" gesture.
   * @param callback Function that will be executed when the "left hand up" gesture is detected.
   */ onLeftHandUp(callback) {
        this.leftHandUpCallback = callback;
    }
    /**
   * Adds a callback function for the "right hand up" gesture.
   * @param callback Function that will be executed when the "right hand up" gesture is detected.
   */ onRightHandUp(callback) {
        this.rightHandUpCallback = callback;
    }
    /**
   * Adds a callback function for the "both hands on chest" gesture.
   * @param callback Function that will be executed when the "both hands on chest" gesture is detected.
   */ onBothHandsOnChest(callback) {
        this.bothHandsOnChestCallback = callback;
    }
    /**
   * Adds a callback function for the "left hand on chest" gesture.
   * @param callback Function that will be executed when the "left hand on chest" gesture is detected.
   */ onLeftHandOnChest(callback) {
        this.leftHandOnChestCallback = callback;
    }
    /**
   * Adds a callback function for the "right hand on chest" gesture.
   * @param callback Function that will be executed when the "right hand on chest" gesture is detected.
   */ onRightHandOnChest(callback) {
        this.rightHandOnChestCallback = callback;
    }
    /**
   * Adds a potential gesture to be processed.
   * @param args OSC event args.
   */ add(gesture) {
        if (this.listening) {
            this.presenceCallback && this.presenceCallback();
            this.gestures.push(gesture);
            this.check();
        }
    }
    /**
   * Checks whether a gesture was made. 
   */ check() {
        // get last gesture
        const lastIndex = this.gestures.length - 1;
        const lastGesture = this.gestures[lastIndex];
        const lastGestureTypes = lastGesture.types;
        if (lastGestureTypes.length === 1) {
            const type = lastGestureTypes[0];
            // if gesture is BothHandsUp or BothHandsOnChest, send the event
            if (type === $9ee8d1e4b992a82a$export$ff50662d7c6e93a2.BothHandsUp || type === $9ee8d1e4b992a82a$export$ff50662d7c6e93a2.BothHandsOnChest) this.send(type);
            else if (this.gestures.length > 1) {
                const lastTimestamp = lastGesture.timestamp;
                let i = lastIndex;
                let gesture = null;
                // find last gesture before the time lapse defined
                while(!gesture && --i >= 0 && this.gestures[i].types.indexOf(type) >= 0)if (lastTimestamp - this.gestures[i].timestamp > this.time) gesture = this.gestures[i];
                if (gesture) this.send(type);
            }
        }
    }
    /**
   * Executes a callback function based on the gesture made.
   * @param type Gesture made.
   */ send(type) {
        console.log('Gesture ' + type + ' sent');
        this.listening = false;
        this.gestures = [];
        setTimeout(()=>{
            this.listening = true;
        }, this.delay * 1000);
        if (type === $9ee8d1e4b992a82a$export$ff50662d7c6e93a2.BothHandsUp) this.bothHandsUpCallback && this.bothHandsUpCallback();
        else if (type === $9ee8d1e4b992a82a$export$ff50662d7c6e93a2.LeftHandUp) this.leftHandUpCallback && this.leftHandUpCallback();
        else if (type === $9ee8d1e4b992a82a$export$ff50662d7c6e93a2.RightHandUp) this.rightHandUpCallback && this.rightHandUpCallback();
        else if (type === $9ee8d1e4b992a82a$export$ff50662d7c6e93a2.BothHandsOnChest) this.bothHandsOnChestCallback && this.bothHandsOnChestCallback();
        else if (type === $9ee8d1e4b992a82a$export$ff50662d7c6e93a2.LeftHandOnChest) this.leftHandOnChestCallback && this.leftHandOnChestCallback();
        else if (type === $9ee8d1e4b992a82a$export$ff50662d7c6e93a2.RightHandOnChest) this.rightHandOnChestCallback && this.rightHandOnChestCallback();
    }
    /**
   * Parses an MQTT event.
   * @param event MQTT event.
   */ parseEvent(event) {
        if (event.type === 'person') {
            const types = (event.poses || []).filter((p)=>this.availableTypes.includes(p)
            );
            if (types.length) {
                const gesture = {
                    id: event.id,
                    types: types,
                    timestamp: Date.now()
                };
                this.add(gesture);
            }
        }
    }
}



var $jsHlH = parcelRequire("jsHlH");
class $30ff8ca36e66cfc4$export$1475203b71d760bc {
    /**
   * Initializes a new instance of the MQTTClient class.
   * @param host Server host.
   * @param port Server port.
   */ constructor(host, port){
        this.client = new (/*@__PURE__*/$parcel$interopDefault($jsHlH)).Client(host, port, 'clientjs');
        // set callback handlers
        this.client.onConnectionLost = ()=>{
            console.log('MQTT connection lost. Reconnecting in 5 seconds');
            setTimeout(()=>{
                this.connect();
            }, 5000);
        };
        this.client.onMessageArrived = (message)=>{
            this.onMessageCallback && this.onMessageCallback(JSON.parse(message.payloadString));
        };
    }
    /**
   * Connects to the MQTT server.
   */ connect() {
        this.client.connect({
            onSuccess: ()=>{
                console.log('MQTT connected');
            // this.client.subscribe('#');
            },
            onFailure: ()=>{
                setTimeout(()=>{
                    this.connect();
                }, 5000);
            }
        });
    }
    /**
   * Subscribes to the given topic.
   * @param topic MQTT topic.
   */ subscribe(topic) {
        this.client.subscribe(topic);
    }
    /**
   * Sets the callback function that fires when a message is recieved.
   * @param callback Callback fired when a new message is recieved.
   */ onMessage(callback) {
        this.onMessageCallback = callback;
    }
}



class $17b006c57d46861c$export$1b17e8af29750b56 {
    /**
   * Initializes a new instance of the OscClient class.
   * @param WebRTC channel.
   */ constructor(channel){
        this.startTime = 0;
        this.dataChannelInterval = null;
        this.channel = '';
        this.channel = channel;
        const config = {
            sdpSemantics: 'unified-plan',
            iceServers: [
                {
                    urls: [
                        'stun:stun.l.google.com:19302'
                    ]
                }
            ]
        };
        this.connection = new RTCPeerConnection(config);
    }
    /**
   * Connects to the OSC server.
   */ connect() {
        const parameters = {
            ordered: true
        };
        const dataChannel = this.connection.createDataChannel('chat', parameters);
        dataChannel.addEventListener('close', ()=>{
            clearInterval(this.dataChannelInterval);
        });
        dataChannel.addEventListener('open', ()=>{
        // this.dataChannelInterval = setInterval(() => {
        //   const message = 'ping ' + this.getCurrentStamp();
        //   dataChannel.send(message);
        // }, 1000);
        });
        dataChannel.addEventListener('message', (event)=>{
            if (navigator.userAgent.includes('Firefox')) event.data.arrayBuffer().then((buffer)=>{
                const message = $5N4O3$readPacket(buffer, {
                    metadata: true
                });
                this.onMessageCallback && this.onMessageCallback(message.packets);
            });
            else {
                const message = $5N4O3$readPacket(event.data, {
                    metadata: true
                });
                this.onMessageCallback && this.onMessageCallback(message.packets);
            }
        });
        const constraints = {
            audio: false,
            video: false
        };
        this.negotiate();
    }
    /**
   * Sets the callback function that fires when a message is recieved.
   * @param callback Callback fired when a new message is recieved.
   */ onMessage(callback) {
        this.onMessageCallback = callback;
    }
    getCurrentStamp() {
        if (this.startTime === null) {
            this.startTime = new Date().getTime();
            return 0;
        } else return new Date().getTime() - this.startTime;
    }
    negotiate() {
        return this.connection.createOffer().then((offer)=>{
            return this.connection.setLocalDescription(offer);
        }).then(()=>{
            // wait for ICE gathering to complete
            return new Promise((resolve)=>{
                if (this.connection.iceGatheringState === 'complete') resolve();
                else {
                    const checkState = ()=>{
                        if (this.connection.iceGatheringState === 'complete') {
                            this.connection.removeEventListener('icegatheringstatechange', checkState);
                            resolve();
                        }
                    };
                    this.connection.addEventListener('icegatheringstatechange', checkState);
                }
            });
        }).then(()=>{
            const offer = this.connection.localDescription;
            const options = {
                body: JSON.stringify({
                    sdp: offer.sdp,
                    type: offer.type,
                    video_transform: 'none'
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            };
            return fetch(this.channel, options);
        }).then((response)=>{
            return response.json();
        }).then((answer)=>{
            return this.connection.setRemoteDescription(answer);
        }).catch((error)=>{
            alert(error);
        });
    }
}




export {$3770175ebe933327$export$3d291c804b17ab69 as SkeletonController, $1d232d6f53298d52$export$12b3cc2522c3bba5 as KeyValue, $ce40448578812b6e$export$dfd4fa32db6567bf as GestureHandler, $30ff8ca36e66cfc4$export$1475203b71d760bc as MqttClient, $17b006c57d46861c$export$1b17e8af29750b56 as OscClient};
//# sourceMappingURL=brooxVisionNode.js.map
