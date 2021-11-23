<template>
    <PageTitle>작업목록</PageTitle>
    <router-link to="/kanban/add">작업추가</router-link>
</template>
<script>
import PageTitle from "../../components/PageTitle.vue"
export default {
    components : {PageTitle},
    created() {
        if (!this.$isLogin()) {
            //return this.$router.push({ path : "/login"});
        }
    },

}
</script>