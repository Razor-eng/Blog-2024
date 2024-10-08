import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className='bg-white text-zinc-700 dark:text-zinc-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
        {children}
      </div>
    </div>
  );
}
