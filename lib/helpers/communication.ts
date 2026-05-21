export const syncToPB = <T = unknown>(type: string, data?: T): void => {
    if (window.parent && window.parent !== window) {
        window.parent.postMessage(
            {
                type,
                data,
            },
            '*',
        );
    }
};

export const syncFromPB = <T = unknown>(
    type: string,
    handler: (data: T) => void,
    listenerOptions: boolean | AddEventListenerOptions = false,
): () => void => {
    const handleMessage = (event: MessageEvent): void => {
        const { type: eventType, data } = event.data as { type: string; data: T };

        if (eventType === type) {
            handler(data);
        }
    };

    window.addEventListener('message', handleMessage, listenerOptions);

    return () => window.removeEventListener('message', handleMessage, listenerOptions);
};
