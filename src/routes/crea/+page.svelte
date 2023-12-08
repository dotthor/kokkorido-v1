<script>
    import ActionDock from "../../lib/components/actionDock.svelte";
    import CstmInputField from "../../lib/components/cstmInputField.svelte";
</script>

<div class="flex flex-col w-full h-full justify-between">
    <form method="post" class="flex flex-col w-full items-center mt-6">
        <CstmInputField name={"nickname"}></CstmInputField>
        <CstmInputField name={"timer"}></CstmInputField>
    </form>

    <div class="m-4">
        <ActionDock actionsSelected={["back", "confirm"]}></ActionDock>
    </div>
</div>
