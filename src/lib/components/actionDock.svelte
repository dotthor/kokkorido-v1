<script>
    import DockButton from "./dockButton.svelte";
    import { createEventDispatcher } from "svelte";

    export let actionsSelected = [];

    const actionsAvailable = [
        { name: "back", icon: "arrow_back", action: "goback" },
        { name: "forward", icon: "arrow_forward", action: "goforward" },
        { name: "confirm", icon: "check", action: "confirm" },
        { name: "cancel", icon: "close", action: "cancel" },
    ];

    const actions = actionsAvailable.filter((obj) =>
        actionsSelected.includes(obj.name),
    );

    const dispatch = createEventDispatcher();

    function _doAction(event) {
        //console.log(event);
        const action = event.detail.action;
        switch (action) {
            case "goback":
                history.back();
                console.log(action);
                break;
            case "goforward":
                history.forward();
                console.log(action);
                break;
            case "confirm":
                dispatch("actionPressed", { action: action });
                break;
            case "cancel":
                dispatch("actionPressed", { action: action });
                break;
            default:
                break;
        }
    }
</script>

<div class="bg-white rounded-[2.5rem] flex justify-evenly p-5 gap-6 w-full">
    {#each actions as action}
        <DockButton
            icon={action.icon}
            action={action.action}
            on:actionPressed={_doAction}
        ></DockButton>
    {/each}
    <!-- <DockButton
        icon={"arrow_back"}
        action={"goback"}
        on:actionPressed={_doAction}
    ></DockButton>
    <DockButton
        icon={"arrow_forward"}
        action={"goforward"}
        on:actionPressed={_doAction}
    ></DockButton>
    <DockButton icon={"check"} action={"confirm"} on:actionPressed={_doAction}
    ></DockButton>
    <DockButton icon={"close"} action={"cancel"} on:actionPressed={_doAction}
    ></DockButton> -->
</div>
