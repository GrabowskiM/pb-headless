import { describe, expect, it } from 'vitest';

import { type BlockConfig } from '../context/BlocksConfig';
import { type Block } from '../types/FieldValue';
import { getInvalidAttributeIds } from './validation';

const makeBlock = (attributes: Array<{ name: string; value: string | null }>): Block => ({
    id: 'block-1',
    type: 'text',
    name: 'Text',
    view: 'default',
    visible: true,
    class: null,
    style: null,
    compiled: '',
    since: null,
    till: null,
    attributes: attributes.map((attr) => ({ id: attr.name, name: attr.name, value: attr.value })),
});

const makeConfig = (attributes: Array<{ id: string; notBlank?: boolean }>, visible = true): BlockConfig => ({
    type: 'text',
    visible,
    attributes: attributes.map(({ id, notBlank }) => ({
        id,
        constraints: notBlank ? { not_blank: true } : {},
    })),
});

describe('getInvalidAttributeIds', () => {
    it('returns empty array when config is not visible', () => {
        const block = makeBlock([{ name: 'title', value: '' }]);
        const config = makeConfig([{ id: 'title', notBlank: true }], false);

        expect(getInvalidAttributeIds(block, config)).toEqual([]);
    });

    it('returns empty array when all required attributes have values', () => {
        const block = makeBlock([{ name: 'title', value: 'Hello' }]);
        const config = makeConfig([{ id: 'title', notBlank: true }]);

        expect(getInvalidAttributeIds(block, config)).toEqual([]);
    });

    it('returns id of attribute with empty string value', () => {
        const block = makeBlock([{ name: 'title', value: '' }]);
        const config = makeConfig([{ id: 'title', notBlank: true }]);

        expect(getInvalidAttributeIds(block, config)).toEqual(['title']);
    });

    it('returns id of attribute with null value', () => {
        const block = makeBlock([{ name: 'title', value: null }]);
        const config = makeConfig([{ id: 'title', notBlank: true }]);

        expect(getInvalidAttributeIds(block, config)).toEqual(['title']);
    });

    it('returns id of attribute with whitespace-only value', () => {
        const block = makeBlock([{ name: 'title', value: '   ' }]);
        const config = makeConfig([{ id: 'title', notBlank: true }]);

        expect(getInvalidAttributeIds(block, config)).toEqual(['title']);
    });

    it('does not return id of attribute without not_blank constraint', () => {
        const block = makeBlock([{ name: 'title', value: '' }]);
        const config = makeConfig([{ id: 'title', notBlank: false }]);

        expect(getInvalidAttributeIds(block, config)).toEqual([]);
    });

    it('does not return id of attribute whose config has array constraints', () => {
        const block = makeBlock([{ name: 'title', value: '' }]);
        const config: BlockConfig = {
            type: 'text',
            visible: true,
            attributes: [{ id: 'title', constraints: ['not_blank'] }],
        };

        expect(getInvalidAttributeIds(block, config)).toEqual([]);
    });

    it('returns only ids of invalid attributes when block has multiple attributes', () => {
        const block = makeBlock([
            { name: 'title', value: '' },
            { name: 'body', value: 'Some content' },
            { name: 'footer', value: null },
        ]);
        const config = makeConfig([
            { id: 'title', notBlank: true },
            { id: 'body', notBlank: true },
            { id: 'footer', notBlank: true },
        ]);

        expect(getInvalidAttributeIds(block, config)).toEqual(['title', 'footer']);
    });

    it('returns empty array when block has no attributes', () => {
        const block = makeBlock([]);
        const config = makeConfig([{ id: 'title', notBlank: true }]);

        expect(getInvalidAttributeIds(block, config)).toEqual([]);
    });
});
