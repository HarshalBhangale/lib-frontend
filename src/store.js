import { createStore } from 'vuex'

const store = createStore({
    state: {
        user: null,
        token: null,
    },
    mutations: {
        setUser(state, user) {
        state.user = user;
        },
        setToken(state, token) {
        state.token = token;
        },
    },
    actions: {
        async login({ commit }, credentials) {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        commit('setToken', data.access_token);
        // Decode token and set user
        const user = JSON.parse(atob(data.access_token.split('.')[1]));
        commit('setUser', user);
        },
        async register({ commit }, userData) {
        await fetch('/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        },
    },
});

export default store;
