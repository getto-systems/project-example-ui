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

export const LastAuthMessage = $root.LastAuthMessage = (() => {

    /**
     * Properties of a LastAuthMessage.
     * @exports ILastAuthMessage
     * @interface ILastAuthMessage
     * @property {string|null} [nonce] LastAuthMessage nonce
     * @property {string|null} [lastAuthAt] LastAuthMessage lastAuthAt
     */

    /**
     * Constructs a new LastAuthMessage.
     * @exports LastAuthMessage
     * @classdesc Represents a LastAuthMessage.
     * @implements ILastAuthMessage
     * @constructor
     * @param {ILastAuthMessage=} [properties] Properties to set
     */
    function LastAuthMessage(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LastAuthMessage nonce.
     * @member {string} nonce
     * @memberof LastAuthMessage
     * @instance
     */
    LastAuthMessage.prototype.nonce = "";

    /**
     * LastAuthMessage lastAuthAt.
     * @member {string} lastAuthAt
     * @memberof LastAuthMessage
     * @instance
     */
    LastAuthMessage.prototype.lastAuthAt = "";

    /**
     * Creates a new LastAuthMessage instance using the specified properties.
     * @function create
     * @memberof LastAuthMessage
     * @static
     * @param {ILastAuthMessage=} [properties] Properties to set
     * @returns {LastAuthMessage} LastAuthMessage instance
     */
    LastAuthMessage.create = function create(properties) {
        return new LastAuthMessage(properties);
    };

    /**
     * Encodes the specified LastAuthMessage message. Does not implicitly {@link LastAuthMessage.verify|verify} messages.
     * @function encode
     * @memberof LastAuthMessage
     * @static
     * @param {ILastAuthMessage} message LastAuthMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LastAuthMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nonce != null && Object.hasOwnProperty.call(message, "nonce"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.nonce);
        if (message.lastAuthAt != null && Object.hasOwnProperty.call(message, "lastAuthAt"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.lastAuthAt);
        return writer;
    };

    /**
     * Encodes the specified LastAuthMessage message, length delimited. Does not implicitly {@link LastAuthMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LastAuthMessage
     * @static
     * @param {ILastAuthMessage} message LastAuthMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LastAuthMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LastAuthMessage message from the specified reader or buffer.
     * @function decode
     * @memberof LastAuthMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LastAuthMessage} LastAuthMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LastAuthMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.LastAuthMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nonce = reader.string();
                break;
            case 2:
                message.lastAuthAt = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a LastAuthMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LastAuthMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LastAuthMessage} LastAuthMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LastAuthMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LastAuthMessage message.
     * @function verify
     * @memberof LastAuthMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LastAuthMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isString(message.nonce))
                return "nonce: string expected";
        if (message.lastAuthAt != null && message.hasOwnProperty("lastAuthAt"))
            if (!$util.isString(message.lastAuthAt))
                return "lastAuthAt: string expected";
        return null;
    };

    /**
     * Creates a LastAuthMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LastAuthMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LastAuthMessage} LastAuthMessage
     */
    LastAuthMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.LastAuthMessage)
            return object;
        let message = new $root.LastAuthMessage();
        if (object.nonce != null)
            message.nonce = String(object.nonce);
        if (object.lastAuthAt != null)
            message.lastAuthAt = String(object.lastAuthAt);
        return message;
    };

    /**
     * Creates a plain object from a LastAuthMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LastAuthMessage
     * @static
     * @param {LastAuthMessage} message LastAuthMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LastAuthMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.nonce = "";
            object.lastAuthAt = "";
        }
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            object.nonce = message.nonce;
        if (message.lastAuthAt != null && message.hasOwnProperty("lastAuthAt"))
            object.lastAuthAt = message.lastAuthAt;
        return object;
    };

    /**
     * Converts this LastAuthMessage to JSON.
     * @function toJSON
     * @memberof LastAuthMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LastAuthMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LastAuthMessage;
})();

export const OutlineMenuExpandMessage = $root.OutlineMenuExpandMessage = (() => {

    /**
     * Properties of an OutlineMenuExpandMessage.
     * @exports IOutlineMenuExpandMessage
     * @interface IOutlineMenuExpandMessage
     * @property {Array.<OutlineMenuExpandMessage.IPath>|null} [paths] OutlineMenuExpandMessage paths
     */

    /**
     * Constructs a new OutlineMenuExpandMessage.
     * @exports OutlineMenuExpandMessage
     * @classdesc Represents an OutlineMenuExpandMessage.
     * @implements IOutlineMenuExpandMessage
     * @constructor
     * @param {IOutlineMenuExpandMessage=} [properties] Properties to set
     */
    function OutlineMenuExpandMessage(properties) {
        this.paths = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * OutlineMenuExpandMessage paths.
     * @member {Array.<OutlineMenuExpandMessage.IPath>} paths
     * @memberof OutlineMenuExpandMessage
     * @instance
     */
    OutlineMenuExpandMessage.prototype.paths = $util.emptyArray;

    /**
     * Creates a new OutlineMenuExpandMessage instance using the specified properties.
     * @function create
     * @memberof OutlineMenuExpandMessage
     * @static
     * @param {IOutlineMenuExpandMessage=} [properties] Properties to set
     * @returns {OutlineMenuExpandMessage} OutlineMenuExpandMessage instance
     */
    OutlineMenuExpandMessage.create = function create(properties) {
        return new OutlineMenuExpandMessage(properties);
    };

    /**
     * Encodes the specified OutlineMenuExpandMessage message. Does not implicitly {@link OutlineMenuExpandMessage.verify|verify} messages.
     * @function encode
     * @memberof OutlineMenuExpandMessage
     * @static
     * @param {IOutlineMenuExpandMessage} message OutlineMenuExpandMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OutlineMenuExpandMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.paths != null && message.paths.length)
            for (let i = 0; i < message.paths.length; ++i)
                $root.OutlineMenuExpandMessage.Path.encode(message.paths[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified OutlineMenuExpandMessage message, length delimited. Does not implicitly {@link OutlineMenuExpandMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof OutlineMenuExpandMessage
     * @static
     * @param {IOutlineMenuExpandMessage} message OutlineMenuExpandMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OutlineMenuExpandMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an OutlineMenuExpandMessage message from the specified reader or buffer.
     * @function decode
     * @memberof OutlineMenuExpandMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {OutlineMenuExpandMessage} OutlineMenuExpandMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OutlineMenuExpandMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.OutlineMenuExpandMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.paths && message.paths.length))
                    message.paths = [];
                message.paths.push($root.OutlineMenuExpandMessage.Path.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an OutlineMenuExpandMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof OutlineMenuExpandMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {OutlineMenuExpandMessage} OutlineMenuExpandMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OutlineMenuExpandMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an OutlineMenuExpandMessage message.
     * @function verify
     * @memberof OutlineMenuExpandMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    OutlineMenuExpandMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.paths != null && message.hasOwnProperty("paths")) {
            if (!Array.isArray(message.paths))
                return "paths: array expected";
            for (let i = 0; i < message.paths.length; ++i) {
                let error = $root.OutlineMenuExpandMessage.Path.verify(message.paths[i]);
                if (error)
                    return "paths." + error;
            }
        }
        return null;
    };

    /**
     * Creates an OutlineMenuExpandMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof OutlineMenuExpandMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {OutlineMenuExpandMessage} OutlineMenuExpandMessage
     */
    OutlineMenuExpandMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.OutlineMenuExpandMessage)
            return object;
        let message = new $root.OutlineMenuExpandMessage();
        if (object.paths) {
            if (!Array.isArray(object.paths))
                throw TypeError(".OutlineMenuExpandMessage.paths: array expected");
            message.paths = [];
            for (let i = 0; i < object.paths.length; ++i) {
                if (typeof object.paths[i] !== "object")
                    throw TypeError(".OutlineMenuExpandMessage.paths: object expected");
                message.paths[i] = $root.OutlineMenuExpandMessage.Path.fromObject(object.paths[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an OutlineMenuExpandMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof OutlineMenuExpandMessage
     * @static
     * @param {OutlineMenuExpandMessage} message OutlineMenuExpandMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    OutlineMenuExpandMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.paths = [];
        if (message.paths && message.paths.length) {
            object.paths = [];
            for (let j = 0; j < message.paths.length; ++j)
                object.paths[j] = $root.OutlineMenuExpandMessage.Path.toObject(message.paths[j], options);
        }
        return object;
    };

    /**
     * Converts this OutlineMenuExpandMessage to JSON.
     * @function toJSON
     * @memberof OutlineMenuExpandMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    OutlineMenuExpandMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    OutlineMenuExpandMessage.Path = (function() {

        /**
         * Properties of a Path.
         * @memberof OutlineMenuExpandMessage
         * @interface IPath
         * @property {Array.<string>|null} [labels] Path labels
         */

        /**
         * Constructs a new Path.
         * @memberof OutlineMenuExpandMessage
         * @classdesc Represents a Path.
         * @implements IPath
         * @constructor
         * @param {OutlineMenuExpandMessage.IPath=} [properties] Properties to set
         */
        function Path(properties) {
            this.labels = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Path labels.
         * @member {Array.<string>} labels
         * @memberof OutlineMenuExpandMessage.Path
         * @instance
         */
        Path.prototype.labels = $util.emptyArray;

        /**
         * Creates a new Path instance using the specified properties.
         * @function create
         * @memberof OutlineMenuExpandMessage.Path
         * @static
         * @param {OutlineMenuExpandMessage.IPath=} [properties] Properties to set
         * @returns {OutlineMenuExpandMessage.Path} Path instance
         */
        Path.create = function create(properties) {
            return new Path(properties);
        };

        /**
         * Encodes the specified Path message. Does not implicitly {@link OutlineMenuExpandMessage.Path.verify|verify} messages.
         * @function encode
         * @memberof OutlineMenuExpandMessage.Path
         * @static
         * @param {OutlineMenuExpandMessage.IPath} message Path message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Path.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.labels != null && message.labels.length)
                for (let i = 0; i < message.labels.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.labels[i]);
            return writer;
        };

        /**
         * Encodes the specified Path message, length delimited. Does not implicitly {@link OutlineMenuExpandMessage.Path.verify|verify} messages.
         * @function encodeDelimited
         * @memberof OutlineMenuExpandMessage.Path
         * @static
         * @param {OutlineMenuExpandMessage.IPath} message Path message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Path.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Path message from the specified reader or buffer.
         * @function decode
         * @memberof OutlineMenuExpandMessage.Path
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {OutlineMenuExpandMessage.Path} Path
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Path.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.OutlineMenuExpandMessage.Path();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.labels && message.labels.length))
                        message.labels = [];
                    message.labels.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Path message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof OutlineMenuExpandMessage.Path
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {OutlineMenuExpandMessage.Path} Path
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Path.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Path message.
         * @function verify
         * @memberof OutlineMenuExpandMessage.Path
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Path.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.labels != null && message.hasOwnProperty("labels")) {
                if (!Array.isArray(message.labels))
                    return "labels: array expected";
                for (let i = 0; i < message.labels.length; ++i)
                    if (!$util.isString(message.labels[i]))
                        return "labels: string[] expected";
            }
            return null;
        };

        /**
         * Creates a Path message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof OutlineMenuExpandMessage.Path
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {OutlineMenuExpandMessage.Path} Path
         */
        Path.fromObject = function fromObject(object) {
            if (object instanceof $root.OutlineMenuExpandMessage.Path)
                return object;
            let message = new $root.OutlineMenuExpandMessage.Path();
            if (object.labels) {
                if (!Array.isArray(object.labels))
                    throw TypeError(".OutlineMenuExpandMessage.Path.labels: array expected");
                message.labels = [];
                for (let i = 0; i < object.labels.length; ++i)
                    message.labels[i] = String(object.labels[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a Path message. Also converts values to other types if specified.
         * @function toObject
         * @memberof OutlineMenuExpandMessage.Path
         * @static
         * @param {OutlineMenuExpandMessage.Path} message Path
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Path.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.labels = [];
            if (message.labels && message.labels.length) {
                object.labels = [];
                for (let j = 0; j < message.labels.length; ++j)
                    object.labels[j] = message.labels[j];
            }
            return object;
        };

        /**
         * Converts this Path to JSON.
         * @function toJSON
         * @memberof OutlineMenuExpandMessage.Path
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Path.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Path;
    })();

    return OutlineMenuExpandMessage;
})();

export { $root as default };
