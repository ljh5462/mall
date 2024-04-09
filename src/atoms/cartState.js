import { atom, selector } from "recoil";

export const cartState = atom({
    key: 'cartState',
    default: []
})

export const cartTotalState = selector({    //atom(cartState)가 갱신될때마다 실행됨
    key: 'cartTotalState',
    get: ({get}) => {
        const arr = get(cartState);
        const initialValue = 0;
        const total = arr.reduce((total, current) => total + current.price * current.qty, initialValue);
        return total;
    }
})