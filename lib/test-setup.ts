if (!globalThis.ResizeObserver) {
    class ResizeObserver {
        observe() {}
        disconnect() {}
    }

    (globalThis as unknown as Record<string, unknown>).ResizeObserver = ResizeObserver;
}

if (!globalThis.AnimationEvent) {
    class AnimationEvent extends Event {
        animationName: string;
        elapsedTime: number;
        pseudoElement: string;

        constructor(type: string, options?: AnimationEventInit) {
            super(type, options);
            this.animationName = options?.animationName ?? '';
            this.elapsedTime = options?.elapsedTime ?? 0;
            this.pseudoElement = options?.pseudoElement ?? '';
        }
    }

    (globalThis as unknown as Record<string, unknown>).AnimationEvent = AnimationEvent;
}
