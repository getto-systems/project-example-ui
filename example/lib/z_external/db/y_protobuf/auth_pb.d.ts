import * as $protobuf from "protobufjs";
/** Properties of an AuthnMessage. */
export interface IAuthnMessage {

    /** AuthnMessage nonce */
    nonce?: (string|null);

    /** AuthnMessage authAt */
    authAt?: (string|null);
}

/** Represents an AuthnMessage. */
export class AuthnMessage implements IAuthnMessage {

    /**
     * Constructs a new AuthnMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAuthnMessage);

    /** AuthnMessage nonce. */
    public nonce: string;

    /** AuthnMessage authAt. */
    public authAt: string;

    /**
     * Creates a new AuthnMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AuthnMessage instance
     */
    public static create(properties?: IAuthnMessage): AuthnMessage;

    /**
     * Encodes the specified AuthnMessage message. Does not implicitly {@link AuthnMessage.verify|verify} messages.
     * @param message AuthnMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAuthnMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified AuthnMessage message, length delimited. Does not implicitly {@link AuthnMessage.verify|verify} messages.
     * @param message AuthnMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAuthnMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an AuthnMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AuthnMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AuthnMessage;

    /**
     * Decodes an AuthnMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AuthnMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AuthnMessage;

    /**
     * Verifies an AuthnMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an AuthnMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AuthnMessage
     */
    public static fromObject(object: { [k: string]: any }): AuthnMessage;

    /**
     * Creates a plain object from an AuthnMessage message. Also converts values to other types if specified.
     * @param message AuthnMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: AuthnMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this AuthnMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an AuthzMessage. */
export interface IAuthzMessage {

    /** AuthzMessage nonce */
    nonce?: (string|null);

    /** AuthzMessage roles */
    roles?: (string[]|null);
}

/** Represents an AuthzMessage. */
export class AuthzMessage implements IAuthzMessage {

    /**
     * Constructs a new AuthzMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAuthzMessage);

    /** AuthzMessage nonce. */
    public nonce: string;

    /** AuthzMessage roles. */
    public roles: string[];

    /**
     * Creates a new AuthzMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AuthzMessage instance
     */
    public static create(properties?: IAuthzMessage): AuthzMessage;

    /**
     * Encodes the specified AuthzMessage message. Does not implicitly {@link AuthzMessage.verify|verify} messages.
     * @param message AuthzMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAuthzMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified AuthzMessage message, length delimited. Does not implicitly {@link AuthzMessage.verify|verify} messages.
     * @param message AuthzMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAuthzMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an AuthzMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AuthzMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AuthzMessage;

    /**
     * Decodes an AuthzMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AuthzMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AuthzMessage;

    /**
     * Verifies an AuthzMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an AuthzMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AuthzMessage
     */
    public static fromObject(object: { [k: string]: any }): AuthzMessage;

    /**
     * Creates a plain object from an AuthzMessage message. Also converts values to other types if specified.
     * @param message AuthzMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: AuthzMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this AuthzMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a MenuExpandMessage. */
export interface IMenuExpandMessage {

    /** MenuExpandMessage paths */
    paths?: (MenuExpandMessage.IPath[]|null);
}

/** Represents a MenuExpandMessage. */
export class MenuExpandMessage implements IMenuExpandMessage {

    /**
     * Constructs a new MenuExpandMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMenuExpandMessage);

    /** MenuExpandMessage paths. */
    public paths: MenuExpandMessage.IPath[];

    /**
     * Creates a new MenuExpandMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MenuExpandMessage instance
     */
    public static create(properties?: IMenuExpandMessage): MenuExpandMessage;

    /**
     * Encodes the specified MenuExpandMessage message. Does not implicitly {@link MenuExpandMessage.verify|verify} messages.
     * @param message MenuExpandMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMenuExpandMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified MenuExpandMessage message, length delimited. Does not implicitly {@link MenuExpandMessage.verify|verify} messages.
     * @param message MenuExpandMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMenuExpandMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a MenuExpandMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MenuExpandMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MenuExpandMessage;

    /**
     * Decodes a MenuExpandMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MenuExpandMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MenuExpandMessage;

    /**
     * Verifies a MenuExpandMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a MenuExpandMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MenuExpandMessage
     */
    public static fromObject(object: { [k: string]: any }): MenuExpandMessage;

    /**
     * Creates a plain object from a MenuExpandMessage message. Also converts values to other types if specified.
     * @param message MenuExpandMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MenuExpandMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MenuExpandMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace MenuExpandMessage {

    /** Properties of a Path. */
    interface IPath {

        /** Path labels */
        labels?: (string[]|null);
    }

    /** Represents a Path. */
    class Path implements IPath {

        /**
         * Constructs a new Path.
         * @param [properties] Properties to set
         */
        constructor(properties?: MenuExpandMessage.IPath);

        /** Path labels. */
        public labels: string[];

        /**
         * Creates a new Path instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Path instance
         */
        public static create(properties?: MenuExpandMessage.IPath): MenuExpandMessage.Path;

        /**
         * Encodes the specified Path message. Does not implicitly {@link MenuExpandMessage.Path.verify|verify} messages.
         * @param message Path message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: MenuExpandMessage.IPath, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Path message, length delimited. Does not implicitly {@link MenuExpandMessage.Path.verify|verify} messages.
         * @param message Path message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: MenuExpandMessage.IPath, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Path message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Path
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): MenuExpandMessage.Path;

        /**
         * Decodes a Path message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Path
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): MenuExpandMessage.Path;

        /**
         * Verifies a Path message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Path message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Path
         */
        public static fromObject(object: { [k: string]: any }): MenuExpandMessage.Path;

        /**
         * Creates a plain object from a Path message. Also converts values to other types if specified.
         * @param message Path
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: MenuExpandMessage.Path, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Path to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
