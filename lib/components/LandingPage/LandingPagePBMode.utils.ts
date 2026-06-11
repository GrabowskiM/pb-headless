export type ElementPosition = { top: number; left: number; right: number; bottom: number };

export const collectPositions = (elements: NodeListOf<HTMLElement>, idAttribute: string, cachedPositions: Map<string, ElementPosition>) => {
    const positions: Array<{ id: string } & ElementPosition> = [];
    let hasChanges = elements.length !== cachedPositions.size;

    elements.forEach((el) => {
        const id = el.dataset[idAttribute];

        if (!id) {
            return;
        }

        const { top, left, right, bottom } = el.getBoundingClientRect();

        positions.push({ id, top, left, right, bottom });

        const cached = cachedPositions.get(id);

        if (!cached || cached.top !== top || cached.left !== left || cached.right !== right || cached.bottom !== bottom) {
            hasChanges = true;
        }
    });

    return { positions, hasChanges };
};
