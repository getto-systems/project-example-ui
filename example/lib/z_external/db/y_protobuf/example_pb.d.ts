import * as $protobuf from "protobufjs";
/** Properties of a SeasonMessage. */
export interface ISeasonMessage {

    /** SeasonMessage year */
    year?: (number|null);
}

/** Represents a SeasonMessage. */
export class SeasonMessage implements ISeasonMessage {

    /**
     * Constructs a new SeasonMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISeasonMessage);

    /** SeasonMessage year. */
    public year: number;

    /**
     * Creates a new SeasonMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SeasonMessage instance
     */
    public static create(properties?: ISeasonMessage): SeasonMessage;

    /**
     * Encodes the specified SeasonMessage message. Does not implicitly {@link SeasonMessage.verify|verify} messages.
     * @param message SeasonMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISeasonMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SeasonMessage message, length delimited. Does not implicitly {@link SeasonMessage.verify|verify} messages.
     * @param message SeasonMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISeasonMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SeasonMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SeasonMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SeasonMessage;

    /**
     * Decodes a SeasonMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SeasonMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SeasonMessage;

    /**
     * Verifies a SeasonMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SeasonMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SeasonMessage
     */
    public static fromObject(object: { [k: string]: any }): SeasonMessage;

    /**
     * Creates a plain object from a SeasonMessage message. Also converts values to other types if specified.
     * @param message SeasonMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SeasonMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SeasonMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
