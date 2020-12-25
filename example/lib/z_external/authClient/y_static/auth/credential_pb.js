/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const ApiCredentialMessage = $root.ApiCredentialMessage = (() => {

    /**
     * Properties of an ApiCredentialMessage.
     * @exports IApiCredentialMessage
     * @interface IApiCredentialMessage
     * @property {string|null} [nonce] ApiCredentialMessage nonce
     * @property {Array.<string>|null} [roles] ApiCredentialMessage roles
     */

    /**
     * Constructs a new ApiCredentialMessage.
     * @exports ApiCredentialMessage
     * @classdesc Represents an ApiCredentialMessage.
     * @implements IApiCredentialMessage
     * @constructor
     * @param {IApiCredentialMessage=} [properties] Properties to set
     */
    function ApiCredentialMessage(properties) {
        this.roles = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ApiCredentialMessage nonce.
     * @member {string} nonce
     * @memberof ApiCredentialMessage
     * @instance
     */
    ApiCredentialMessage.prototype.nonce = "";

    /**
     * ApiCredentialMessage roles.
     * @member {Array.<string>} roles
     * @memberof ApiCredentialMessage
     * @instance
     */
    ApiCredentialMessage.prototype.roles = $util.emptyArray;

    /**
     * Creates a new ApiCredentialMessage instance using the specified properties.
     * @function create
     * @memberof ApiCredentialMessage
     * @static
     * @param {IApiCredentialMessage=} [properties] Properties to set
     * @returns {ApiCredentialMessage} ApiCredentialMessage instance
     */
    ApiCredentialMessage.create = function create(properties) {
        return new ApiCredentialMessage(properties);
    };

    /**
     * Encodes the specified ApiCredentialMessage message. Does not implicitly {@link ApiCredentialMessage.verify|verify} messages.
     * @function encode
     * @memberof ApiCredentialMessage
     * @static
     * @param {IApiCredentialMessage} message ApiCredentialMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiCredentialMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nonce != null && Object.hasOwnProperty.call(message, "nonce"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.nonce);
        if (message.roles != null && message.roles.length)
            for (let i = 0; i < message.roles.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.roles[i]);
        return writer;
    };

    /**
     * Encodes the specified ApiCredentialMessage message, length delimited. Does not implicitly {@link ApiCredentialMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ApiCredentialMessage
     * @static
     * @param {IApiCredentialMessage} message ApiCredentialMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiCredentialMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ApiCredentialMessage message from the specified reader or buffer.
     * @function decode
     * @memberof ApiCredentialMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ApiCredentialMessage} ApiCredentialMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiCredentialMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiCredentialMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nonce = reader.string();
                break;
            case 2:
                if (!(message.roles && message.roles.length))
                    message.roles = [];
                message.roles.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ApiCredentialMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ApiCredentialMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ApiCredentialMessage} ApiCredentialMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiCredentialMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ApiCredentialMessage message.
     * @function verify
     * @memberof ApiCredentialMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ApiCredentialMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isString(message.nonce))
                return "nonce: string expected";
        if (message.roles != null && message.hasOwnProperty("roles")) {
            if (!Array.isArray(message.roles))
                return "roles: array expected";
            for (let i = 0; i < message.roles.length; ++i)
                if (!$util.isString(message.roles[i]))
                    return "roles: string[] expected";
        }
        return null;
    };

    /**
     * Creates an ApiCredentialMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ApiCredentialMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ApiCredentialMessage} ApiCredentialMessage
     */
    ApiCredentialMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.ApiCredentialMessage)
            return object;
        let message = new $root.ApiCredentialMessage();
        if (object.nonce != null)
            message.nonce = String(object.nonce);
        if (object.roles) {
            if (!Array.isArray(object.roles))
                throw TypeError(".ApiCredentialMessage.roles: array expected");
            message.roles = [];
            for (let i = 0; i < object.roles.length; ++i)
                message.roles[i] = String(object.roles[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from an ApiCredentialMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ApiCredentialMessage
     * @static
     * @param {ApiCredentialMessage} message ApiCredentialMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ApiCredentialMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.roles = [];
        if (options.defaults)
            object.nonce = "";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            object.nonce = message.nonce;
        if (message.roles && message.roles.length) {
            object.roles = [];
            for (let j = 0; j < message.roles.length; ++j)
                object.roles[j] = message.roles[j];
        }
        return object;
    };

    /**
     * Converts this ApiCredentialMessage to JSON.
     * @function toJSON
     * @memberof ApiCredentialMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ApiCredentialMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ApiCredentialMessage;
})();

export { $root as default };
