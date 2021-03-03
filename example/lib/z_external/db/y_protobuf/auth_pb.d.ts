import * as $protobuf from "protobufjs";
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

/** Properties of a LastAuthMessage. */
export interface ILastAuthMessage {

    /** LastAuthMessage nonce */
    nonce?: (string|null);

    /** LastAuthMessage lastAuthAt */
    lastAuthAt?: (string|null);
}

/** Represents a LastAuthMessage. */
export class LastAuthMessage implements ILastAuthMessage {

    /**
     * Constructs a new LastAuthMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: ILastAuthMessage);

    /** LastAuthMessage nonce. */
    public nonce: string;

    /** LastAuthMessage lastAuthAt. */
    public lastAuthAt: string;

    /**
     * Creates a new LastAuthMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LastAuthMessage instance
     */
    public static create(properties?: ILastAuthMessage): LastAuthMessage;

    /**
     * Encodes the specified LastAuthMessage message. Does not implicitly {@link LastAuthMessage.verify|verify} messages.
     * @param message LastAuthMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ILastAuthMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified LastAuthMessage message, length delimited. Does not implicitly {@link LastAuthMessage.verify|verify} messages.
     * @param message LastAuthMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ILastAuthMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a LastAuthMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LastAuthMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LastAuthMessage;

    /**
     * Decodes a LastAuthMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns LastAuthMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LastAuthMessage;

    /**
     * Verifies a LastAuthMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a LastAuthMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns LastAuthMessage
     */
    public static fromObject(object: { [k: string]: any }): LastAuthMessage;

    /**
     * Creates a plain object from a LastAuthMessage message. Also converts values to other types if specified.
     * @param message LastAuthMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: LastAuthMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this LastAuthMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an OutlineMenuExpandMessage. */
export interface IOutlineMenuExpandMessage {

    /** OutlineMenuExpandMessage paths */
    paths?: (OutlineMenuExpandMessage.IPath[]|null);
}

/** Represents an OutlineMenuExpandMessage. */
export class OutlineMenuExpandMessage implements IOutlineMenuExpandMessage {

    /**
     * Constructs a new OutlineMenuExpandMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IOutlineMenuExpandMessage);

    /** OutlineMenuExpandMessage paths. */
    public paths: OutlineMenuExpandMessage.IPath[];

    /**
     * Creates a new OutlineMenuExpandMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OutlineMenuExpandMessage instance
     */
    public static create(properties?: IOutlineMenuExpandMessage): OutlineMenuExpandMessage;

    /**
     * Encodes the specified OutlineMenuExpandMessage message. Does not implicitly {@link OutlineMenuExpandMessage.verify|verify} messages.
     * @param message OutlineMenuExpandMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IOutlineMenuExpandMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified OutlineMenuExpandMessage message, length delimited. Does not implicitly {@link OutlineMenuExpandMessage.verify|verify} messages.
     * @param message OutlineMenuExpandMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IOutlineMenuExpandMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an OutlineMenuExpandMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OutlineMenuExpandMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OutlineMenuExpandMessage;

    /**
     * Decodes an OutlineMenuExpandMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OutlineMenuExpandMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OutlineMenuExpandMessage;

    /**
     * Verifies an OutlineMenuExpandMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an OutlineMenuExpandMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OutlineMenuExpandMessage
     */
    public static fromObject(object: { [k: string]: any }): OutlineMenuExpandMessage;

    /**
     * Creates a plain object from an OutlineMenuExpandMessage message. Also converts values to other types if specified.
     * @param message OutlineMenuExpandMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: OutlineMenuExpandMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this OutlineMenuExpandMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace OutlineMenuExpandMessage {

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
        constructor(properties?: OutlineMenuExpandMessage.IPath);

        /** Path labels. */
        public labels: string[];

        /**
         * Creates a new Path instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Path instance
         */
        public static create(properties?: OutlineMenuExpandMessage.IPath): OutlineMenuExpandMessage.Path;

        /**
         * Encodes the specified Path message. Does not implicitly {@link OutlineMenuExpandMessage.Path.verify|verify} messages.
         * @param message Path message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: OutlineMenuExpandMessage.IPath, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Path message, length delimited. Does not implicitly {@link OutlineMenuExpandMessage.Path.verify|verify} messages.
         * @param message Path message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: OutlineMenuExpandMessage.IPath, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Path message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Path
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OutlineMenuExpandMessage.Path;

        /**
         * Decodes a Path message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Path
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OutlineMenuExpandMessage.Path;

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
        public static fromObject(object: { [k: string]: any }): OutlineMenuExpandMessage.Path;

        /**
         * Creates a plain object from a Path message. Also converts values to other types if specified.
         * @param message Path
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: OutlineMenuExpandMessage.Path, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Path to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
