<template>
    <el-container>
        <el-header>
            <nav-menu/>
        </el-header>
        <el-main style="padding-top: 1.5em;">
            <el-row :gutter="0">
                <el-col :span="24">
                    <slot name="main"/>
                </el-col>
            </el-row>
        </el-main>
        <my-footer/>
    </el-container>
</template>

<script>
    import NavMenu from "./NavMenu";
    import MyFooter from "../components/myFooter"

    export default {
        name: "basicLayout",
        components: {NavMenu, MyFooter},
        //props: ['type', 'type_id'],
    }
</script>

<style scoped>
    .el-header {
        padding: 0;
    }

    main {
        min-height: calc(85vh);
    }
</style>
