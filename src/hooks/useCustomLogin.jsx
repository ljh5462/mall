import { Navigate, createSearchParams, useNavigate } from "react-router-dom"
import { useRecoilState, useResetRecoilState } from "recoil";
import signinState from "../atoms/signinState";
import { removeCookie, setCookie } from "../util/utilCookie";
import { loginPost } from "../api/memberApi";
import { cartState } from "../atoms/cartState";

const useCustomLogin = () =>{

    const navigate = useNavigate(); //로그인,로그아웃 후 페이지 이동

    const [loginState, setLoginStage] = useRecoilState(signinState);

    const resetState = useResetRecoilState(signinState); // 로그인 초기화

    const resetCartState = useResetRecoilState(cartState); // 장바구니 초기화

    const isLogin = loginState.email ? true : false; // 로그인 여부

    const doLogin = async (loginParam) => { // 로그인 함수(쿠키 저장, 로그인 결과 반환)
        const result = await loginPost(loginParam);
        saveAsCookie(result);
        return result;
    }

    const saveAsCookie = (data) => { // 쿠키 저장
        setCookie("member", JSON.stringify(data), 1) //1일
        setLoginStage(data);
    }

    const doLogout = () => { // 로그아웃 함수(쿠키삭제, 로그인, 장바구니 초기화) - 서버 거치지않음
       removeCookie("member");
       resetState();
       resetCartState();
    }

    const moveToPath = (path) => { // 페이지 이동
        navigate({pathname: path}, {replace: true});
    }

    const moveToLogin = () => {
        navigate({pathname: '/member/login'}, {replace: true});
    }

    const moveToLoginReturn = () => {
        return <Navigate replace to="/member/login"/>
    }

    const exceptionHandle = (ex) => {
        console.log("Exception-----------");
        console.log(ex);

        const errorMsg = ex.response.data.error;

        const errorStr = createSearchParams({error: errorMsg}).toString();

        if(errorMsg === 'REQUIRE_LOGIN'){
            alert("로그인이 필요합니다");
            navigate({pathname: '/member/login', search: errorStr});
            return;
        }

        if(errorMsg === 'ERROR_ACCESSDENIED'){
            alert("해당 메뉴를 사용할 수 있는 권한이 없습니다");
            navigate({pathname: '/member/login', search: errorStr});
            return;
        }
        
    }

    return {loginState, isLogin, doLogin, doLogout, moveToPath, moveToLogin, moveToLoginReturn, exceptionHandle, saveAsCookie}
}

export default useCustomLogin;