export const ROUTER = {
    ADMIN: {
        DASHBOARD: "/admin/dashboard",

        BRAND:"/admin/brand",
        CATEGORY:"/admin/category/:category",
        PRODUCT:"/admin/product",

        SLIDE:"/admin/slide",
        BLOG:"/admin/blog",

        SALLEBILL:"/admin/sallebill",
        IMPORT:"/admin/import",

        USER: "/admin/user",

        LOGIN: "/login",
        REGISTER: "/register",
    },

    USER: {
        HOME: "/",
        DETAIL: "/product/:id",
        CONFIRMATION: "/confirmation",
        CART: "/cart",
        ORDER: "/order",
        SHOP: "/shop",
        SEARCH: "/search"
    }
}