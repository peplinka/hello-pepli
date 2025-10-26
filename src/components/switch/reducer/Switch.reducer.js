// Функция для установки опции в переключателе
export const switchReducer = (state, action) => {
    switch (action.type) {
        case "set": {
            return {
                ...state,
                currOption: action.payload,
            }
        }
        default: {
            return state;
        }
    }
}