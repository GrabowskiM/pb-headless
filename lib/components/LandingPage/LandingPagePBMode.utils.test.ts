import { describe, expect, it } from 'vitest';
import { collectPositions, type ElementPosition } from './LandingPagePBMode.utils';

// --- Helpers ---

const makeElement = (id: string | null, rect: ElementPosition): HTMLElement => {
    const el = document.createElement('div');

    if (id !== null) {
        el.dataset.blockId = id;
    }

    el.getBoundingClientRect = () => ({ ...rect, width: 0, height: 0, x: 0, y: 0, toJSON: () => {} }) as DOMRect;

    return el;
};

const makeNodeList = (elements: HTMLElement[]): NodeListOf<HTMLElement> =>
    ({ length: elements.length, forEach: (cb: (el: HTMLElement) => void) => elements.forEach(cb) }) as unknown as NodeListOf<HTMLElement>;

const makeRect = (overrides?: Partial<ElementPosition>): ElementPosition => ({
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
    ...overrides,
});

// --- Tests ---

describe('collectPositions', () => {
    it('returns empty positions and no changes when elements and cache are both empty', () => {
        const result = collectPositions(makeNodeList([]), 'blockId', new Map());

        expect(result.positions).toEqual([]);
        expect(result.hasChanges).toBe(false);
    });

    it('detects changes when there are more elements than cached entries', () => {
        const elements = makeNodeList([makeElement('a', makeRect())]);

        const { hasChanges } = collectPositions(elements, 'blockId', new Map());

        expect(hasChanges).toBe(true);
    });

    it('detects changes when there are fewer elements than cached entries', () => {
        const cache = new Map([['a', makeRect()]]);

        const { hasChanges } = collectPositions(makeNodeList([]), 'blockId', cache);

        expect(hasChanges).toBe(true);
    });

    it('skips elements without the id attribute', () => {
        const elements = makeNodeList([makeElement(null, makeRect())]);

        const { positions } = collectPositions(elements, 'blockId', new Map());

        expect(positions).toEqual([]);
    });

    it('returns correct positions for each element', () => {
        const rect = makeRect({ top: 10, left: 20, right: 120, bottom: 110 });
        const elements = makeNodeList([makeElement('block-1', rect)]);

        const { positions } = collectPositions(elements, 'blockId', new Map());

        expect(positions).toEqual([{ id: 'block-1', top: 10, left: 20, right: 120, bottom: 110 }]);
    });

    it('reports no changes when all positions match the cache', () => {
        const rect = makeRect({ top: 10, left: 20, right: 120, bottom: 110 });
        const elements = makeNodeList([makeElement('block-1', rect)]);
        const cache = new Map([['block-1', rect]]);

        const { hasChanges } = collectPositions(elements, 'blockId', cache);

        expect(hasChanges).toBe(false);
    });

    it('detects changes when a position differs from the cache', () => {
        const rect = makeRect({ top: 10 });
        const cached = makeRect({ top: 99 });
        const elements = makeNodeList([makeElement('block-1', rect)]);
        const cache = new Map([['block-1', cached]]);

        const { hasChanges } = collectPositions(elements, 'blockId', cache);

        expect(hasChanges).toBe(true);
    });

    it('detects changes when an element is not present in the cache', () => {
        const elements = makeNodeList([makeElement('block-1', makeRect())]);
        const cache = new Map([
            ['block-1', makeRect()],
            ['block-2', makeRect()],
        ]);

        const { hasChanges } = collectPositions(elements, 'blockId', cache);

        expect(hasChanges).toBe(true);
    });
});
