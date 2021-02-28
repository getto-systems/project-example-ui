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
