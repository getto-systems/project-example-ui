import * as $protobuf from "protobufjs";
/** Properties of a CredentialMessage. */
export interface ICredentialMessage {

    /** CredentialMessage nonce */
    nonce?: (string|null);

    /** CredentialMessage roles */
    roles?: (string[]|null);
}

/** Represents a CredentialMessage. */
export class CredentialMessage implements ICredentialMessage {

    /**
     * Constructs a new CredentialMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICredentialMessage);

    /** CredentialMessage nonce. */
    public nonce: string;

    /** CredentialMessage roles. */
    public roles: string[];

    /**
     * Creates a new CredentialMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CredentialMessage instance
     */
    public static create(properties?: ICredentialMessage): CredentialMessage;

    /**
     * Encodes the specified CredentialMessage message. Does not implicitly {@link CredentialMessage.verify|verify} messages.
     * @param message CredentialMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICredentialMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CredentialMessage message, length delimited. Does not implicitly {@link CredentialMessage.verify|verify} messages.
     * @param message CredentialMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICredentialMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CredentialMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CredentialMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CredentialMessage;

    /**
     * Decodes a CredentialMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CredentialMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CredentialMessage;

    /**
     * Verifies a CredentialMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CredentialMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CredentialMessage
     */
    public static fromObject(object: { [k: string]: any }): CredentialMessage;

    /**
     * Creates a plain object from a CredentialMessage message. Also converts values to other types if specified.
     * @param message CredentialMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CredentialMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CredentialMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
