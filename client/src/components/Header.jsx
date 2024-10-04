import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdMenu } from "react-icons/md";
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun, FaUser } from 'react-icons/fa';
import { IoCloseOutline } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { CgLogOut } from "react-icons/cg";
import { toggleTheme } from '../redux/theme/themeSlice';
import DashSidebarMobile from './DashSidebarMobile';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
      } else {
        toast.success('Signed Out');
        dispatch(signoutSuccess());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className='border-b-2 bg-zinc-100 shadow-md dark:shadow-xl py-4'>
      <div className="md:hidden" onClick={() => setView(true)}>
        <MdMenu size={30} />
      </div>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-bold md:font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-md text-white'>
          WeBlog
        </span>
      </Link>
      <form onSubmit={handleSubmit} className='w-96 hidden lg:inline' >
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          value={searchTerm === 'null' ? '' : searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      {/* <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button> */}
      <div className='flex items-center gap-2 md:order-2'>
        <Button
          className='w-12 h-10 hidden sm:inline rounded-xl'
          color='gray'
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            className='rounded-md p-1'
            label={
              <img alt='user' src={currentUser.profilePicture} className="relative inline-block h-12 w-12 !rounded-full object-cover object-center border shadow-md dark:border-zinc-500" />
            }
          >
            <Dropdown.Header>
              {/* <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span> */}
              <div className="shrink-0 group block">
                <div className="flex items-center">
                  <img className="inline-block object-cover border dark:border-zinc-500 shadow-md shrink-0 w-10 h-10 rounded-full" src={currentUser.profilePicture} alt="Avatar" />
                  <div className="ms-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{currentUser.username}</h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-400">{currentUser.email}</p>
                  </div>
                </div>
              </div>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item icon={FaUser} className='font-semibold'>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout} icon={CgLogOut} className='font-semibold'>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}
        {/* <Navbar.Toggle /> */}
      </div>
      {/* <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to='/projects'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse> */}
      <div className={`fixed md:hidden top-0 left-0 ${view ? 'w-screen' : 'w-0'} transition-all ease-in duration-150 h-screen overflow-hidden dark:bg-gray-800 bg-white z-50`}>
        <div className="flex py-4 px-6 justify-between border-b border-zinc-500">
          <div
            className='sm:hidden rounded-xl'
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'light' ? <FaMoon size={20} className='text-zinc-800' /> : <FaSun size={20} className='text-amber-500' />}
          </div>
          <IoCloseOutline size={28} onClick={() => setView(false)} />
        </div>
        {view && <DashSidebarMobile />}
      </div>
    </Navbar>
  );
}
