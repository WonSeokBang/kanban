import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
const store = createStore({
    plugins: [createPersistedState()],
    state() {
        return {
            apiURL : "",
            // 로그인 회원 정보
            member : null,
        };
    },
    mutations : {
        setMember(state, member) {
            state.member = member;
        }
    }
});

export default store;