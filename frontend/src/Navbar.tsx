import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
    return (
      <nav className="w-full bg-neutral-300 px-6 py-3 flex justify-between items-center shadow-md">
        
        <h1 className="text-xl font-irish text-black">Journal Organizer</h1>
  
        
        <div className="flex space-x-4">
          <button onClick={() => navigate('/login')} className="px-4 py-2 border border-neutral-600 rounded-lg text-white !bg-neutral-400 hover:!bg-neutral-600 transition">
            Sign In
          </button>
          <button onClick={() => navigate('/register')} className="px-4 py-2 border border-neutral-600 rounded-lg text-white !bg-neutral-400 hover:!bg-neutral-600 transition">
            Sign Up
          </button>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  