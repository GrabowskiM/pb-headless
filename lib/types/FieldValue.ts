export interface BlockAttribute {
    id: string;
    name: string;
    value: string | null;
}

export interface Block {
    id: string;
    type: string;
    name: string;
    view: string;
    visible: boolean;
    class: string | null;
    style: string | null;
    compiled: string;
    since: string | null;
    till: string | null;
    attributes: BlockAttribute[];
}

export interface Zone {
    id: string;
    name: string;
    blocks: Block[];
}

export interface FieldValue {
    layout: string;
    zones: Zone[];
}
