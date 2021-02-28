/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const AuthzMessage = $root.AuthzMessage = (() => {

    /**
     * Properties of an AuthzMessage.
     * @exports IAuthzMessage
     * @interface IAuthzMessage
     * @property {string|null} [nonce] AuthzMessage nonce
     * @property {Array.<string>|null} [roles] AuthzMessage roles
     */

    /**
     * Constructs a new AuthzMessage.
     * @exports AuthzMessage
     * @classdesc Represents an AuthzMessage.
     * @implements IAuthzMessage
     * @constructor
     * @param {IAuthzMessage=} [properties] Properties to set
     */
    function AuthzMessage(properties) {
        this.roles = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AuthzMessage nonce.
     * @member {string} nonce
     * @memberof AuthzMessage
     * @instance
     */
    AuthzMessage.prototype.nonce = "";

    /**
     * AuthzMessage roles.
     * @member {Array.<string>} roles
     * @memberof AuthzMessage
     * @instance
     */
    AuthzMessage.prototype.roles = $util.emptyArray;

    /**
     * Creates a new AuthzMessage instance using the specified properties.
     * @function create
     * @memberof AuthzMessage
     * @static
     * @param {IAuthzMessage=} [properties] Properties to set
     * @returns {AuthzMessage} AuthzMessage instance
     */
    AuthzMessage.create = function create(properties) {
        return new AuthzMessage(properties);
    };

    /**
     * Encodes the specified AuthzMessage message. Does not implicitly {@link AuthzMessage.verify|verify} messages.
     * @function encode
     * @memberof AuthzMessage
     * @static
     * @param {IAuthzMessage} message AuthzMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AuthzMessage.encode = function encode(message, writer) {
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
     * Encodes the specified AuthzMessage message, length delimited. Does not implicitly {@link AuthzMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AuthzMessage
     * @static
     * @param {IAuthzMessage} message AuthzMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AuthzMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AuthzMessage message from the specified reader or buffer.
     * @function decode
     * @memberof AuthzMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AuthzMessage} AuthzMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AuthzMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.AuthzMessage();
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
     * Decodes an AuthzMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AuthzMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AuthzMessage} AuthzMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AuthzMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AuthzMessage message.
     * @function verify
     * @memberof AuthzMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AuthzMessage.verify = function verify(message) {
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
     * Creates an AuthzMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AuthzMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AuthzMessage} AuthzMessage
     */
    AuthzMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.AuthzMessage)
            return object;
        let message = new $root.AuthzMessage();
        if (object.nonce != null)
            message.nonce = String(object.nonce);
        if (object.roles) {
            if (!Array.isArray(object.roles))
                throw TypeError(".AuthzMessage.roles: array expected");
            message.roles = [];
            for (let i = 0; i < object.roles.length; ++i)
                message.roles[i] = String(object.roles[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from an AuthzMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AuthzMessage
     * @static
     * @param {AuthzMessage} message AuthzMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AuthzMessage.toObject = function toObject(message, options) {
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
     * Converts this AuthzMessage to JSON.
     * @function toJSON
     * @memberof AuthzMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AuthzMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AuthzMessage;
})();

export { $root as default };
