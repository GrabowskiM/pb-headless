import { describe, expect, it } from 'vitest';

import { createCssClassNames } from './cssClassNames';

describe('createCssClassNames', () => {
    it('returns only the base class when called with no other arguments', () => {
        expect(createCssClassNames('block')).toBe('block');
    });

    it('appends conditional classes that are true', () => {
        expect(createCssClassNames('block', { 'block--active': true, 'block--hidden': false })).toBe('block block--active');
    });

    it('does not append conditional classes that are false', () => {
        expect(createCssClassNames('block', { 'block--active': false })).toBe('block');
    });

    it('appends the passthrough class', () => {
        expect(createCssClassNames('block', {}, 'extra')).toBe('block extra');
    });

    it('combines all three sources', () => {
        expect(createCssClassNames('block', { 'block--active': true }, 'extra')).toBe('block block--active extra');
    });

    it('does not produce extra spaces when conditionals are all false', () => {
        expect(createCssClassNames('block', { 'block--active': false }, '')).toBe('block');
    });

    it('accepts an array of base classes', () => {
        expect(createCssClassNames(['block', 'block--modifier'], { 'block--active': true })).toBe('block block--modifier block--active');
    });
});
