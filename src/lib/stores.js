import { writable } from "svelte/store";

const startingAppStatus = {};
function createAppStatus() {
    const { subscribe, set, update } = writable(startingAppStatus);

    return {
        subscribe,
        initialize: (initState) => {
            set(initState);
        },
        updateState: (stateChange) => {
            update((oldState) => {
                const newState = { ...oldState, ...stateChange };
                localStorage.setItem("appStatus", JSON.stringify(newState));
                return newState;
            });

        },
        reset: () => set(startingAppStatus)
    };
}

export const players = writable([]);
export const appStatus = createAppStatus();