/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const SeasonMessage = $root.SeasonMessage = (() => {

    /**
     * Properties of a SeasonMessage.
     * @exports ISeasonMessage
     * @interface ISeasonMessage
     * @property {number|null} [year] SeasonMessage year
     */

    /**
     * Constructs a new SeasonMessage.
     * @exports SeasonMessage
     * @classdesc Represents a SeasonMessage.
     * @implements ISeasonMessage
     * @constructor
     * @param {ISeasonMessage=} [properties] Properties to set
     */
    function SeasonMessage(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SeasonMessage year.
     * @member {number} year
     * @memberof SeasonMessage
     * @instance
     */
    SeasonMessage.prototype.year = 0;

    /**
     * Creates a new SeasonMessage instance using the specified properties.
     * @function create
     * @memberof SeasonMessage
     * @static
     * @param {ISeasonMessage=} [properties] Properties to set
     * @returns {SeasonMessage} SeasonMessage instance
     */
    SeasonMessage.create = function create(properties) {
        return new SeasonMessage(properties);
    };

    /**
     * Encodes the specified SeasonMessage message. Does not implicitly {@link SeasonMessage.verify|verify} messages.
     * @function encode
     * @memberof SeasonMessage
     * @static
     * @param {ISeasonMessage} message SeasonMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SeasonMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.year != null && Object.hasOwnProperty.call(message, "year"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.year);
        return writer;
    };

    /**
     * Encodes the specified SeasonMessage message, length delimited. Does not implicitly {@link SeasonMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SeasonMessage
     * @static
     * @param {ISeasonMessage} message SeasonMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SeasonMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SeasonMessage message from the specified reader or buffer.
     * @function decode
     * @memberof SeasonMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SeasonMessage} SeasonMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SeasonMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SeasonMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.year = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SeasonMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SeasonMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SeasonMessage} SeasonMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SeasonMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SeasonMessage message.
     * @function verify
     * @memberof SeasonMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SeasonMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.year != null && message.hasOwnProperty("year"))
            if (!$util.isInteger(message.year))
                return "year: integer expected";
        return null;
    };

    /**
     * Creates a SeasonMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SeasonMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SeasonMessage} SeasonMessage
     */
    SeasonMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.SeasonMessage)
            return object;
        let message = new $root.SeasonMessage();
        if (object.year != null)
            message.year = object.year | 0;
        return message;
    };

    /**
     * Creates a plain object from a SeasonMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SeasonMessage
     * @static
     * @param {SeasonMessage} message SeasonMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SeasonMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.year = 0;
        if (message.year != null && message.hasOwnProperty("year"))
            object.year = message.year;
        return object;
    };

    /**
     * Converts this SeasonMessage to JSON.
     * @function toJSON
     * @memberof SeasonMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SeasonMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SeasonMessage;
})();

export { $root as default };
