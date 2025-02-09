const Friend_Link_Server = {
    Server: () => {
        return import.meta.env.VITE_FRIEND_LINK_SERVER
    },

    DataBase: {
        User_Avatar: () => {
            return `${import.meta.env.VITE_FRIEND_LINK_SERVER}/${import.meta.env.VITE_FRIEND_LINK_SERVER_STORAGE_AVATAR}`
        },
        User_Posts: () => {
            return `${import.meta.env.VITE_FRIEND_LINK_SERVER}/${import.meta.env.VITE_FRIEND_LINK_SERVER_STORAGE_POST}`
        },
        Temp: () => {
            return `${import.meta.env.VITE_FRIEND_LINK_SERVER}/${import.meta.env.VITE_FRIEND_LINK_SERVER_STORAGE_TEMP}`
        },
    }
}

export default Friend_Link_Server;