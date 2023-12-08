import { writable } from "svelte/store";

const startingAppState = {};

function createAppStatus() {
    const { subscribe, set, update } = writable(startingAppState);

    return {
        subscribe,
        initialize: (initState) => {
            set(initState);
        },
        updateState: (stateChange) => {
            update((oldState) => ({ ...oldState, ...stateChange }));
        },
        reset: () => set(startingAppState)
    };
}

export const appStatus = createAppStatus();