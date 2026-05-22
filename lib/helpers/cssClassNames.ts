export const createCssClassNames = (base: string | string[], conditionals: Record<string, boolean> = {}, passthrough = '') => {
    const baseClasses = Array.isArray(base) ? base.join(' ') : base;
    const conditional = Object.entries(conditionals)
        .filter(([, condition]) => condition)
        .map(([name]) => name)
        .join(' ');

    return [baseClasses, conditional, passthrough].filter(Boolean).join(' ');
};
