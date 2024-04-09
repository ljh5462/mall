import { useRecoilState } from "recoil";
import { cartState } from "../atoms/cartState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartItems, postChangeCart } from "../api/cartApi";
import { useEffect } from "react";

const useCustomCart = () =>{

    const [cartItems, setCartItems] = useRecoilState(cartState);  //리코일 장바구니 저장

    const queryClient = useQueryClient();

    const changeMutaion = useMutation({
        mutationFn: (param) => postChangeCart(param),
        onSuccess:  (result) => setCartItems(result)
    })

    const query = useQuery({
        queryKey: ["cart"],
        queryFn: getCartItems,
        option: {
            staleTime: 1000 * 60 * 60 //1시간
        }
    })

    useEffect(() => {
        if(query.isSuccess || changeMutaion.isSuccess){
            queryClient.invalidateQueries("cart");
            setCartItems(query.data);
        }
    }, [query.isSuccess, query.data])

    const changeCart = (param) => {
        changeMutaion.mutate(param);
    }

    return {cartItems, changeCart};
}

export default useCustomCart;