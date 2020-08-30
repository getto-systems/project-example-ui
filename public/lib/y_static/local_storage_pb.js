/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const CredentialMessage = $root.CredentialMessage = (() => {

    /**
     * Properties of a CredentialMessage.
     * @exports ICredentialMessage
     * @interface ICredentialMessage
     * @property {string|null} [nonce] CredentialMessage nonce
     * @property {Array.<string>|null} [roles] CredentialMessage roles
     */

    /**
     * Constructs a new CredentialMessage.
     * @exports CredentialMessage
     * @classdesc Represents a CredentialMessage.
     * @implements ICredentialMessage
     * @constructor
     * @param {ICredentialMessage=} [properties] Properties to set
     */
    function CredentialMessage(properties) {
        this.roles = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CredentialMessage nonce.
     * @member {string} nonce
     * @memberof CredentialMessage
     * @instance
     */
    CredentialMessage.prototype.nonce = "";

    /**
     * CredentialMessage roles.
     * @member {Array.<string>} roles
     * @memberof CredentialMessage
     * @instance
     */
    CredentialMessage.prototype.roles = $util.emptyArray;

    /**
     * Creates a new CredentialMessage instance using the specified properties.
     * @function create
     * @memberof CredentialMessage
     * @static
     * @param {ICredentialMessage=} [properties] Properties to set
     * @returns {CredentialMessage} CredentialMessage instance
     */
    CredentialMessage.create = function create(properties) {
        return new CredentialMessage(properties);
    };

    /**
     * Encodes the specified CredentialMessage message. Does not implicitly {@link CredentialMessage.verify|verify} messages.
     * @function encode
     * @memberof CredentialMessage
     * @static
     * @param {ICredentialMessage} message CredentialMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CredentialMessage.encode = function encode(message, writer) {
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
     * Encodes the specified CredentialMessage message, length delimited. Does not implicitly {@link CredentialMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CredentialMessage
     * @static
     * @param {ICredentialMessage} message CredentialMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CredentialMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CredentialMessage message from the specified reader or buffer.
     * @function decode
     * @memberof CredentialMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CredentialMessage} CredentialMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CredentialMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CredentialMessage();
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
     * Decodes a CredentialMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CredentialMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CredentialMessage} CredentialMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CredentialMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CredentialMessage message.
     * @function verify
     * @memberof CredentialMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CredentialMessage.verify = function verify(message) {
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
     * Creates a CredentialMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CredentialMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CredentialMessage} CredentialMessage
     */
    CredentialMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.CredentialMessage)
            return object;
        let message = new $root.CredentialMessage();
        if (object.nonce != null)
            message.nonce = String(object.nonce);
        if (object.roles) {
            if (!Array.isArray(object.roles))
                throw TypeError(".CredentialMessage.roles: array expected");
            message.roles = [];
            for (let i = 0; i < object.roles.length; ++i)
                message.roles[i] = String(object.roles[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a CredentialMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CredentialMessage
     * @static
     * @param {CredentialMessage} message CredentialMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CredentialMessage.toObject = function toObject(message, options) {
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
     * Converts this CredentialMessage to JSON.
     * @function toJSON
     * @memberof CredentialMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CredentialMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CredentialMessage;
})();

export { $root as default };
