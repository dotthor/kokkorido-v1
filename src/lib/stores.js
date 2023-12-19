import { writable } from "svelte/store";
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://ppddtihaakyfivzrzzem.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZGR0aWhhYWt5Zml2enJ6emVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4OTMzNTgsImV4cCI6MjAxNTQ2OTM1OH0.RFG0bJ7xPLxd4vP6vQf7wNvDNovFE3_0fB_LmUQrtAI')

export const players = writable([]);

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

export const appStatus = createAppStatus();