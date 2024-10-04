import { Sidebar } from 'flowbite-react';
import {
    HiUser,
    HiArrowSmRight,
    HiDocumentText,
    HiOutlineUserGroup,
    HiAnnotation,
    HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SiGnuprivacyguard } from "react-icons/si";
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { IoLogInOutline } from 'react-icons/io5';

export default function DashSidebarMobile() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const [tab, setTab] = useState('');
    const [signUp, setSignUp] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        } else {
            if (location.pathname.includes('sign-up')) {
                setSignUp(true);
            } else {
                setSignUp(false);
            }
        }
    }, [location]);

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                toast.success('Signed out')
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <Sidebar className='w-screen h-screen'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col md:gap-4'>
                    {currentUser ?
                        <>
                            {currentUser?.isAdmin && (
                                <Link to='/dashboard?tab=dash'>
                                    <Sidebar.Item
                                        active={tab === 'dash' || !tab}
                                        icon={HiChartPie}
                                        as='div'
                                        className='text-xl py-4 md:py-0'
                                    >
                                        Dashboard
                                    </Sidebar.Item>
                                </Link>
                            )}
                            <Link to='/dashboard?tab=profile'>
                                <Sidebar.Item
                                    active={tab === 'profile'}
                                    icon={HiUser}
                                    label={currentUser?.isAdmin ? 'Admin' : 'User'}
                                    labelColor='dark'
                                    as='div'
                                    className='text-xl py-4 md:py-0'
                                >
                                    Profile
                                </Sidebar.Item>
                            </Link>
                            {currentUser?.isAdmin && (
                                <>
                                    <Link to='/dashboard?tab=posts'>
                                        <Sidebar.Item
                                            active={tab === 'posts'}
                                            icon={HiDocumentText}
                                            as='div'
                                            className='text-xl py-4 md:py-0'
                                        >
                                            Posts
                                        </Sidebar.Item>
                                    </Link>
                                    <Link to='/dashboard?tab=users'>
                                        <Sidebar.Item
                                            active={tab === 'users'}
                                            icon={HiOutlineUserGroup}
                                            as='div'
                                            className='text-xl py-4 md:py-0'
                                        >
                                            Users
                                        </Sidebar.Item>
                                    </Link>
                                    <Link to='/dashboard?tab=comments'>
                                        <Sidebar.Item
                                            active={tab === 'comments'}
                                            icon={HiAnnotation}
                                            as='div'
                                            className='text-xl py-4 md:py-0'
                                        >
                                            Comments
                                        </Sidebar.Item>
                                    </Link>
                                </>
                            )}
                            <Sidebar.Item
                                icon={HiArrowSmRight}
                                className='cursor-pointer text-xl py-4 md:py-0'
                                onClick={handleSignout}
                            >
                                Sign Out
                            </Sidebar.Item>
                        </>
                        :
                        <>
                            <Link to='/sign-up'>
                                <Sidebar.Item
                                    active={signUp}
                                    icon={SiGnuprivacyguard}
                                    as='div'
                                    className='text-xl py-4 md:py-0'
                                >
                                    Create an account
                                </Sidebar.Item>
                            </Link>
                            <Link to='/sign-in'>
                                <Sidebar.Item
                                    active={!signUp}
                                    icon={IoLogInOutline}
                                    as='div'
                                    className='text-xl py-4 md:py-0'
                                >
                                    Sign In
                                </Sidebar.Item>
                            </Link>
                        </>
                    }
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
