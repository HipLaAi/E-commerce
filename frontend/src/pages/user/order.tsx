import React, { useContext, useEffect, useState } from 'react'
import Context from '../../context/context';
import ProductType from '../../model/product.model';
import { SelectOutlined } from '@ant-design/icons';
import OrderType from '../../model/order.models';
import { apiPostData } from '../../services/user/order.services';
import { Link, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import {CheckLogin} from '../../helper/checklogin';

const Order = () => {
    CheckLogin();
    const [data, setData] = useState<ProductType[]>([]);
    const context = useContext(Context);
    const navigate = useNavigate();

    const [form, setForm] = useState<OrderType>({
        pay: 'Payment on delivery'
    });
    
    const fetchData = async () => {
        setData(context?.cart);
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        fetchData();
    }, [context?.cart])

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value,
            userid: context?.userid,
            moneytotal: context?.total,
            detail: data
        }));
    };


    type NotificationType = 'success' | 'info' | 'warning' | 'error';
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type: NotificationType, content: string) => {
        api[type]({
            message: 'Notification',
            description: content,
        });
    };

    const onOk = async () => {
        try {
            let results = await apiPostData(form);
            if(results.success){
                navigate('/confirmation')
                context?.fetchDataToCart();
            }else{
                openNotificationWithIcon('warning', 'Not enough information!')
            }
        } catch (error) {
            openNotificationWithIcon('warning', 'Not enough information!')
        }
    }

    return (
        <div className='container mx-auto my-10'>
            {contextHolder}
            <div className="font-sans bg-gray-100">
                <div className="flex max-sm:flex-col gap-4 h-full">
                    <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 sm:h-screen sm:sticky sm:top-0 lg:min-w-[350px] sm:min-w-[300px]">
                        <div className="relative h-full">
                            <div className="p-4 sm:overflow-auto sm:scrollbar-none sm:h-[calc(100vh-60px)]">
                                <div className="space-y-4">
                                    {
                                        data?.map((item: any, index: any) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="w-32 h-28 max-lg:w-24 max-lg:h-24 flex p-2 shrink-0 bg-gray-300 rounded-md">
                                                    <img
                                                        src={'images/product/' + item.products.first_image.image}
                                                        className="w-full object-contain"
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <h3 className="text-base text-white">{item.products.name}</h3>
                                                    <ul className="text-xs text-gray-300 space-y-1 mt-2">
                                                        <li className="flex flex-wrap gap-4">
                                                            Size <span className="ml-auto">{item.size}</span>
                                                        </li>
                                                        <li className="flex flex-wrap gap-4">
                                                            Color <span className="ml-auto">{item.color}</span>
                                                        </li>
                                                        <li className="flex flex-wrap gap-4">
                                                            Quantity <span className="ml-auto">{item.quantity}</span>
                                                        </li>
                                                        <li className="flex flex-wrap gap-4">
                                                            Total Price <span className="ml-auto">${item.total}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="md:absolute md:left-0 md:bottom-0 bg-gray-800 w-full p-4">
                                <h4 className="flex flex-wrap gap-4 text-base text-white">
                                    Total <span className="ml-auto">${(context?.total)}</span>
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-4xl mx-auto w-full h-max rounded-md p-4 sticky top-0">
                        <h2 className="text-xl font-bold text-gray-800">Complete your order</h2>
                        <form className="mt-8">
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 mb-4">
                                    Personal Details
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            name='fullname'
                                            value={form?.fullname}
                                            onChange={handleChange}
                                            className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none"
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="#bbb"
                                            stroke="#bbb"
                                            className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle cx={10} cy={7} r={6} data-original="#000000" />
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"
                                            />
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center">
                                        <select name="pay" value={form?.pay} onChange={(e) => handleChange(e)}
                                            className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none"
                                        >
                                            <option value="Payment on delivery">Payment on delivery</option>
                                            <option value="Online payment">Online payment</option>
                                        </select>
                                    </div>
                                    <div className="relative flex items-center">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            name='email'
                                            value={form?.email}
                                            onChange={handleChange}
                                            className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none"
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="#bbb"
                                            stroke="#bbb"
                                            className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 682.667 682.667"
                                        >
                                            <defs>
                                                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                    <path d="M0 512h512V0H0Z" data-original="#000000" />
                                                </clipPath>
                                            </defs>
                                            <g
                                                clipPath="url(#a)"
                                                transform="matrix(1.33 0 0 -1.33 0 682.667)"
                                            >
                                                <path
                                                    fill="none"
                                                    strokeMiterlimit={10}
                                                    strokeWidth={40}
                                                    d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                                                    data-original="#000000"
                                                />
                                                <path
                                                    d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                                                    data-original="#000000"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center">
                                        <input
                                            type="number"
                                            placeholder="Phone No."
                                            name='phone'
                                            value={form?.phone}
                                            onChange={handleChange}
                                            className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none"
                                        />
                                        <svg
                                            fill="#bbb"
                                            className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 64 64"
                                        >
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-base font-semibold text-gray-800 mb-4">
                                    Shipping Address
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Address Line"
                                        name='address'
                                        value={form?.address}
                                        onChange={handleChange}
                                        className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        name='province'
                                        value={form?.province}
                                        onChange={handleChange}
                                        className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        name='district'
                                        value={form?.district}
                                        onChange={handleChange}
                                        className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Zip Code"
                                        name='zip'
                                        value={form?.zip}
                                        onChange={handleChange}
                                        className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border-b focus:border-gray-800 outline-none"
                                    />
                                </div>
                                <div className="flex gap-4 max-md:flex-col mt-8">
                                    <Link
                                        to={'/'}
                                        type="button"
                                        className="rounded-md px-4 py-3 w-full text-sm font-semibold bg-transparent hover:bg-gray-100 border-2 text-gray-800 max-md:order-1"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        onClick={onOk}
                                        type="button"
                                        className="rounded-md px-4 py-3 w-full text-sm font-semibold bg-gray-800 text-white hover:bg-gray-900"
                                    >
                                        Complete Purchase
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Order