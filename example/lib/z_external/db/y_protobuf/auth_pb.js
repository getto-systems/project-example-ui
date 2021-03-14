/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const AuthnMessage = $root.AuthnMessage = (() => {

    /**
     * Properties of an AuthnMessage.
     * @exports IAuthnMessage
     * @interface IAuthnMessage
     * @property {string|null} [nonce] AuthnMessage nonce
     * @property {string|null} [authAt] AuthnMessage authAt
     */

    /**
     * Constructs a new AuthnMessage.
     * @exports AuthnMessage
     * @classdesc Represents an AuthnMessage.
     * @implements IAuthnMessage
     * @constructor
     * @param {IAuthnMessage=} [properties] Properties to set
     */
    function AuthnMessage(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AuthnMessage nonce.
     * @member {string} nonce
     * @memberof AuthnMessage
     * @instance
     */
    AuthnMessage.prototype.nonce = "";

    /**
     * AuthnMessage authAt.
     * @member {string} authAt
     * @memberof AuthnMessage
     * @instance
     */
    AuthnMessage.prototype.authAt = "";

    /**
     * Creates a new AuthnMessage instance using the specified properties.
     * @function create
     * @memberof AuthnMessage
     * @static
     * @param {IAuthnMessage=} [properties] Properties to set
     * @returns {AuthnMessage} AuthnMessage instance
     */
    AuthnMessage.create = function create(properties) {
        return new AuthnMessage(properties);
    };

    /**
     * Encodes the specified AuthnMessage message. Does not implicitly {@link AuthnMessage.verify|verify} messages.
     * @function encode
     * @memberof AuthnMessage
     * @static
     * @param {IAuthnMessage} message AuthnMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AuthnMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nonce != null && Object.hasOwnProperty.call(message, "nonce"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.nonce);
        if (message.authAt != null && Object.hasOwnProperty.call(message, "authAt"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.authAt);
        return writer;
    };

    /**
     * Encodes the specified AuthnMessage message, length delimited. Does not implicitly {@link AuthnMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AuthnMessage
     * @static
     * @param {IAuthnMessage} message AuthnMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AuthnMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AuthnMessage message from the specified reader or buffer.
     * @function decode
     * @memberof AuthnMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AuthnMessage} AuthnMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AuthnMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.AuthnMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nonce = reader.string();
                break;
            case 2:
                message.authAt = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an AuthnMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AuthnMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AuthnMessage} AuthnMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AuthnMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AuthnMessage message.
     * @function verify
     * @memberof AuthnMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AuthnMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isString(message.nonce))
                return "nonce: string expected";
        if (message.authAt != null && message.hasOwnProperty("authAt"))
            if (!$util.isString(message.authAt))
                return "authAt: string expected";
        return null;
    };

    /**
     * Creates an AuthnMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AuthnMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AuthnMessage} AuthnMessage
     */
    AuthnMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.AuthnMessage)
            return object;
        let message = new $root.AuthnMessage();
        if (object.nonce != null)
            message.nonce = String(object.nonce);
        if (object.authAt != null)
            message.authAt = String(object.authAt);
        return message;
    };

    /**
     * Creates a plain object from an AuthnMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AuthnMessage
     * @static
     * @param {AuthnMessage} message AuthnMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AuthnMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.nonce = "";
            object.authAt = "";
        }
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            object.nonce = message.nonce;
        if (message.authAt != null && message.hasOwnProperty("authAt"))
            object.authAt = message.authAt;
        return object;
    };

    /**
     * Converts this AuthnMessage to JSON.
     * @function toJSON
     * @memberof AuthnMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AuthnMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AuthnMessage;
})();

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

export const MenuExpandMessage = $root.MenuExpandMessage = (() => {

    /**
     * Properties of a MenuExpandMessage.
     * @exports IMenuExpandMessage
     * @interface IMenuExpandMessage
     * @property {Array.<MenuExpandMessage.IPath>|null} [paths] MenuExpandMessage paths
     */

    /**
     * Constructs a new MenuExpandMessage.
     * @exports MenuExpandMessage
     * @classdesc Represents a MenuExpandMessage.
     * @implements IMenuExpandMessage
     * @constructor
     * @param {IMenuExpandMessage=} [properties] Properties to set
     */
    function MenuExpandMessage(properties) {
        this.paths = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MenuExpandMessage paths.
     * @member {Array.<MenuExpandMessage.IPath>} paths
     * @memberof MenuExpandMessage
     * @instance
     */
    MenuExpandMessage.prototype.paths = $util.emptyArray;

    /**
     * Creates a new MenuExpandMessage instance using the specified properties.
     * @function create
     * @memberof MenuExpandMessage
     * @static
     * @param {IMenuExpandMessage=} [properties] Properties to set
     * @returns {MenuExpandMessage} MenuExpandMessage instance
     */
    MenuExpandMessage.create = function create(properties) {
        return new MenuExpandMessage(properties);
    };

    /**
     * Encodes the specified MenuExpandMessage message. Does not implicitly {@link MenuExpandMessage.verify|verify} messages.
     * @function encode
     * @memberof MenuExpandMessage
     * @static
     * @param {IMenuExpandMessage} message MenuExpandMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MenuExpandMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.paths != null && message.paths.length)
            for (let i = 0; i < message.paths.length; ++i)
                $root.MenuExpandMessage.Path.encode(message.paths[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified MenuExpandMessage message, length delimited. Does not implicitly {@link MenuExpandMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MenuExpandMessage
     * @static
     * @param {IMenuExpandMessage} message MenuExpandMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MenuExpandMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MenuExpandMessage message from the specified reader or buffer.
     * @function decode
     * @memberof MenuExpandMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MenuExpandMessage} MenuExpandMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MenuExpandMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.MenuExpandMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.paths && message.paths.length))
                    message.paths = [];
                message.paths.push($root.MenuExpandMessage.Path.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MenuExpandMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MenuExpandMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MenuExpandMessage} MenuExpandMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MenuExpandMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MenuExpandMessage message.
     * @function verify
     * @memberof MenuExpandMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MenuExpandMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.paths != null && message.hasOwnProperty("paths")) {
            if (!Array.isArray(message.paths))
                return "paths: array expected";
            for (let i = 0; i < message.paths.length; ++i) {
                let error = $root.MenuExpandMessage.Path.verify(message.paths[i]);
                if (error)
                    return "paths." + error;
            }
        }
        return null;
    };

    /**
     * Creates a MenuExpandMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MenuExpandMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MenuExpandMessage} MenuExpandMessage
     */
    MenuExpandMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.MenuExpandMessage)
            return object;
        let message = new $root.MenuExpandMessage();
        if (object.paths) {
            if (!Array.isArray(object.paths))
                throw TypeError(".MenuExpandMessage.paths: array expected");
            message.paths = [];
            for (let i = 0; i < object.paths.length; ++i) {
                if (typeof object.paths[i] !== "object")
                    throw TypeError(".MenuExpandMessage.paths: object expected");
                message.paths[i] = $root.MenuExpandMessage.Path.fromObject(object.paths[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a MenuExpandMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MenuExpandMessage
     * @static
     * @param {MenuExpandMessage} message MenuExpandMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MenuExpandMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.paths = [];
        if (message.paths && message.paths.length) {
            object.paths = [];
            for (let j = 0; j < message.paths.length; ++j)
                object.paths[j] = $root.MenuExpandMessage.Path.toObject(message.paths[j], options);
        }
        return object;
    };

    /**
     * Converts this MenuExpandMessage to JSON.
     * @function toJSON
     * @memberof MenuExpandMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MenuExpandMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    MenuExpandMessage.Path = (function() {

        /**
         * Properties of a Path.
         * @memberof MenuExpandMessage
         * @interface IPath
         * @property {Array.<string>|null} [labels] Path labels
         */

        /**
         * Constructs a new Path.
         * @memberof MenuExpandMessage
         * @classdesc Represents a Path.
         * @implements IPath
         * @constructor
         * @param {MenuExpandMessage.IPath=} [properties] Properties to set
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
         * @memberof MenuExpandMessage.Path
         * @instance
         */
        Path.prototype.labels = $util.emptyArray;

        /**
         * Creates a new Path instance using the specified properties.
         * @function create
         * @memberof MenuExpandMessage.Path
         * @static
         * @param {MenuExpandMessage.IPath=} [properties] Properties to set
         * @returns {MenuExpandMessage.Path} Path instance
         */
        Path.create = function create(properties) {
            return new Path(properties);
        };

        /**
         * Encodes the specified Path message. Does not implicitly {@link MenuExpandMessage.Path.verify|verify} messages.
         * @function encode
         * @memberof MenuExpandMessage.Path
         * @static
         * @param {MenuExpandMessage.IPath} message Path message or plain object to encode
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
         * Encodes the specified Path message, length delimited. Does not implicitly {@link MenuExpandMessage.Path.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MenuExpandMessage.Path
         * @static
         * @param {MenuExpandMessage.IPath} message Path message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Path.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Path message from the specified reader or buffer.
         * @function decode
         * @memberof MenuExpandMessage.Path
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MenuExpandMessage.Path} Path
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Path.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.MenuExpandMessage.Path();
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
         * @memberof MenuExpandMessage.Path
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MenuExpandMessage.Path} Path
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
         * @memberof MenuExpandMessage.Path
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
         * @memberof MenuExpandMessage.Path
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MenuExpandMessage.Path} Path
         */
        Path.fromObject = function fromObject(object) {
            if (object instanceof $root.MenuExpandMessage.Path)
                return object;
            let message = new $root.MenuExpandMessage.Path();
            if (object.labels) {
                if (!Array.isArray(object.labels))
                    throw TypeError(".MenuExpandMessage.Path.labels: array expected");
                message.labels = [];
                for (let i = 0; i < object.labels.length; ++i)
                    message.labels[i] = String(object.labels[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a Path message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MenuExpandMessage.Path
         * @static
         * @param {MenuExpandMessage.Path} message Path
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
         * @memberof MenuExpandMessage.Path
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Path.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Path;
    })();

    return MenuExpandMessage;
})();

export { $root as default };
