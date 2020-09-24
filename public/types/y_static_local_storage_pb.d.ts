import * as $protobuf from "protobufjs";
/** Properties of an ApiCredentialMessage. */
export interface IApiCredentialMessage {

    /** ApiCredentialMessage nonce */
    nonce?: (string|null);

    /** ApiCredentialMessage roles */
    roles?: (string[]|null);
}

/** Represents an ApiCredentialMessage. */
export class ApiCredentialMessage implements IApiCredentialMessage {

    /**
     * Constructs a new ApiCredentialMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IApiCredentialMessage);

    /** ApiCredentialMessage nonce. */
    public nonce: string;

    /** ApiCredentialMessage roles. */
    public roles: string[];

    /**
     * Creates a new ApiCredentialMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ApiCredentialMessage instance
     */
    public static create(properties?: IApiCredentialMessage): ApiCredentialMessage;

    /**
     * Encodes the specified ApiCredentialMessage message. Does not implicitly {@link ApiCredentialMessage.verify|verify} messages.
     * @param message ApiCredentialMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IApiCredentialMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ApiCredentialMessage message, length delimited. Does not implicitly {@link ApiCredentialMessage.verify|verify} messages.
     * @param message ApiCredentialMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IApiCredentialMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an ApiCredentialMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ApiCredentialMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ApiCredentialMessage;

    /**
     * Decodes an ApiCredentialMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ApiCredentialMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ApiCredentialMessage;

    /**
     * Verifies an ApiCredentialMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an ApiCredentialMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ApiCredentialMessage
     */
    public static fromObject(object: { [k: string]: any }): ApiCredentialMessage;

    /**
     * Creates a plain object from an ApiCredentialMessage message. Also converts values to other types if specified.
     * @param message ApiCredentialMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ApiCredentialMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ApiCredentialMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
