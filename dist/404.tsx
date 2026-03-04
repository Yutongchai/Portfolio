import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#fcb22f] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ rotate: -2, scale: 0.9 }}
        animate={{ rotate: 0, scale: 1 }}
        className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center"
      >
        <h1 className="text-8xl font-black mb-4 italic">404</h1>
        <h2 className="text-2xl font-bold mb-6 uppercase tracking-tighter">
          Oops! You've wandered off the grid.
        </h2>
        <p className="text-lg mb-8 font-medium">
          This page doesn't exist, but EITO Group is still here to help you connect.
        </p>
        
        <Link 
          to="/"
          className="inline-block bg-[#12a28f] text-white border-2 border-black px-6 py-3 font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          BACK TO HOME
        </Link>
      </motion.div>
      
      {/* Decorative floating shapes for that Neo-vibe */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-white border-4 border-black rounded-full hidden md:block" />
      <div className="absolute bottom-20 right-20 w-24 h-8 bg-black -rotate-12 hidden md:block" />
    </div>
  );
};

export default NotFound;