/**
 * Shared Class definition 
 */


/**
 * Field definition , for input and control
 */
export const TYPES = ["text", "enum", "number", "date", "email", "file", "image", "color", "password", "search", "tel", "time", "url", "month", "week"] as const;
export type FieldType = typeof TYPES[number];

export class FieldDefinition {
    field!: string;
    description!: string;
    type!: FieldType;
    enum!: string;
    comment!:any;
    constructor() { }
    /* setType(type: FieldType): void {
        if (TYPES.indexOf(type) < 0) {
            throw new Error(`${type} n'est pas autorisé`);
        }
        this.type = type;
    } */
}
export class Enum {
    label!: string;
    value!: string;
}
