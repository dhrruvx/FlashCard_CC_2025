import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="relative w-full">
      <div className="h-2.5 w-full bg-gray-800/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-teal-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      {/* Animated slider dot */}
      <motion.div
        className="absolute -top-1 -mt-0.5 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
        style={{ left: `${progress}%` }}
        initial={{ x: -10, opacity: 0 }}
        animate={{ 
          x: -10, 
          opacity: 1,
          boxShadow: ["0 0 5px rgba(0, 204, 177, 0.5)", "0 0 15px rgba(0, 204, 177, 0.8)", "0 0 5px rgba(0, 204, 177, 0.5)"]
        }}
        transition={{ 
          duration: 0.5, 
          ease: "easeOut",
          boxShadow: { 
            repeat: Infinity, 
            duration: 2 
          }
        }}
      >
        <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full" />
      </motion.div>
    </div>
  );
} 