import * as $protobuf from "protobufjs";
/** Properties of a PasswordLoginMessage. */
export interface IPasswordLoginMessage {

    /** PasswordLoginMessage loginId */
    loginId?: (string|null);

    /** PasswordLoginMessage password */
    password?: (string|null);
}

/** Represents a PasswordLoginMessage. */
export class PasswordLoginMessage implements IPasswordLoginMessage {

    /**
     * Constructs a new PasswordLoginMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPasswordLoginMessage);

    /** PasswordLoginMessage loginId. */
    public loginId: string;

    /** PasswordLoginMessage password. */
    public password: string;

    /**
     * Creates a new PasswordLoginMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PasswordLoginMessage instance
     */
    public static create(properties?: IPasswordLoginMessage): PasswordLoginMessage;

    /**
     * Encodes the specified PasswordLoginMessage message. Does not implicitly {@link PasswordLoginMessage.verify|verify} messages.
     * @param message PasswordLoginMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPasswordLoginMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PasswordLoginMessage message, length delimited. Does not implicitly {@link PasswordLoginMessage.verify|verify} messages.
     * @param message PasswordLoginMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPasswordLoginMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PasswordLoginMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PasswordLoginMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PasswordLoginMessage;

    /**
     * Decodes a PasswordLoginMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PasswordLoginMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PasswordLoginMessage;

    /**
     * Verifies a PasswordLoginMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PasswordLoginMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PasswordLoginMessage
     */
    public static fromObject(object: { [k: string]: any }): PasswordLoginMessage;

    /**
     * Creates a plain object from a PasswordLoginMessage message. Also converts values to other types if specified.
     * @param message PasswordLoginMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PasswordLoginMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PasswordLoginMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
