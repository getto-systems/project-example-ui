/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const PasswordLoginMessage = $root.PasswordLoginMessage = (() => {

    /**
     * Properties of a PasswordLoginMessage.
     * @exports IPasswordLoginMessage
     * @interface IPasswordLoginMessage
     * @property {string|null} [loginId] PasswordLoginMessage loginId
     * @property {string|null} [password] PasswordLoginMessage password
     */

    /**
     * Constructs a new PasswordLoginMessage.
     * @exports PasswordLoginMessage
     * @classdesc Represents a PasswordLoginMessage.
     * @implements IPasswordLoginMessage
     * @constructor
     * @param {IPasswordLoginMessage=} [properties] Properties to set
     */
    function PasswordLoginMessage(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PasswordLoginMessage loginId.
     * @member {string} loginId
     * @memberof PasswordLoginMessage
     * @instance
     */
    PasswordLoginMessage.prototype.loginId = "";

    /**
     * PasswordLoginMessage password.
     * @member {string} password
     * @memberof PasswordLoginMessage
     * @instance
     */
    PasswordLoginMessage.prototype.password = "";

    /**
     * Creates a new PasswordLoginMessage instance using the specified properties.
     * @function create
     * @memberof PasswordLoginMessage
     * @static
     * @param {IPasswordLoginMessage=} [properties] Properties to set
     * @returns {PasswordLoginMessage} PasswordLoginMessage instance
     */
    PasswordLoginMessage.create = function create(properties) {
        return new PasswordLoginMessage(properties);
    };

    /**
     * Encodes the specified PasswordLoginMessage message. Does not implicitly {@link PasswordLoginMessage.verify|verify} messages.
     * @function encode
     * @memberof PasswordLoginMessage
     * @static
     * @param {IPasswordLoginMessage} message PasswordLoginMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PasswordLoginMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.loginId != null && Object.hasOwnProperty.call(message, "loginId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.loginId);
        if (message.password != null && Object.hasOwnProperty.call(message, "password"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
        return writer;
    };

    /**
     * Encodes the specified PasswordLoginMessage message, length delimited. Does not implicitly {@link PasswordLoginMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PasswordLoginMessage
     * @static
     * @param {IPasswordLoginMessage} message PasswordLoginMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PasswordLoginMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PasswordLoginMessage message from the specified reader or buffer.
     * @function decode
     * @memberof PasswordLoginMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PasswordLoginMessage} PasswordLoginMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PasswordLoginMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.PasswordLoginMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.loginId = reader.string();
                break;
            case 2:
                message.password = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PasswordLoginMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PasswordLoginMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PasswordLoginMessage} PasswordLoginMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PasswordLoginMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PasswordLoginMessage message.
     * @function verify
     * @memberof PasswordLoginMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PasswordLoginMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.loginId != null && message.hasOwnProperty("loginId"))
            if (!$util.isString(message.loginId))
                return "loginId: string expected";
        if (message.password != null && message.hasOwnProperty("password"))
            if (!$util.isString(message.password))
                return "password: string expected";
        return null;
    };

    /**
     * Creates a PasswordLoginMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PasswordLoginMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PasswordLoginMessage} PasswordLoginMessage
     */
    PasswordLoginMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.PasswordLoginMessage)
            return object;
        let message = new $root.PasswordLoginMessage();
        if (object.loginId != null)
            message.loginId = String(object.loginId);
        if (object.password != null)
            message.password = String(object.password);
        return message;
    };

    /**
     * Creates a plain object from a PasswordLoginMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PasswordLoginMessage
     * @static
     * @param {PasswordLoginMessage} message PasswordLoginMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PasswordLoginMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.loginId = "";
            object.password = "";
        }
        if (message.loginId != null && message.hasOwnProperty("loginId"))
            object.loginId = message.loginId;
        if (message.password != null && message.hasOwnProperty("password"))
            object.password = message.password;
        return object;
    };

    /**
     * Converts this PasswordLoginMessage to JSON.
     * @function toJSON
     * @memberof PasswordLoginMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PasswordLoginMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PasswordLoginMessage;
})();

export { $root as default };
