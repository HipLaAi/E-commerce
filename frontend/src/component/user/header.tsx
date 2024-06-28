import React, { useContext, useEffect, useRef, useState } from 'react'
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Context from '../../context/context';
import BadgeCart from '../share/badge';
import Logo from '../logo';
import { apiLogout } from '../../services/authenticate.services';
import InputSearch from '../share/input_search';
import { SolutionOutlined } from '@ant-design/icons';

const Header = () => {
    const [login, setLongin] = useState(true);

    const handleLogOut = async () => {
        let results = await apiLogout({});
        if (results.success) {
            window.localStorage.removeItem("ACCESS_TOKEN")
            setLongin(false);
        }
    }

    useEffect(() => {
        window.localStorage.getItem("ACCESS_TOKEN") ? setLongin(true) : setLongin(false)
    }, [window.localStorage.getItem("ACCESS_TOKEN")])

    const context = useContext(Context);

    return (
        <header className='h-16 shadow-md bg-white fixed w-full z-40'>
            <div className='h-full container mx-auto flex items-center px-4 justify-between'>
                <div className=''>
                    <Link to={"/"}>
                        <Logo w={90} h={50} />
                    </Link>
                </div>
                <InputSearch />
                <div className='flex items-center gap-7'>
                    {
                        login ? (
                            <>
                                <Link to={'cart'} className='text-2xl relative'>
                                    <BadgeCart CountCart={(context?.cart?.length)} />
                                </Link>
                                <Link to={'confirmation'} className='text-2xl relative'>
                                    <SolutionOutlined />
                                </Link>
                            </>
                        ) : ('')
                    }

                    <div>
                        {
                            login ? (
                                <Link to={"/"}>
                                    <button className='px-2 py-1 rounded-full text-white bg-orange-600 hover:bg-orange-700' onClick={handleLogOut}>Logout</button>
                                </Link>
                            ) : (
                                <Link to={"/login"}>
                                    <button className='px-2 py-1 rounded-full text-white bg-orange-600 hover:bg-orange-700'>Login</button>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header