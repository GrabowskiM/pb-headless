export const syncToPB = (type, data) => {
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

export const syncFromPB = (type, handler, listenerOptions = false) => {
    const handleMessage = (event) => {
        const { type: eventType, data } = event.data;

        if (eventType === type) {
            handler(data);
        }
    };

    window.addEventListener('message', handleMessage, listenerOptions);
};
