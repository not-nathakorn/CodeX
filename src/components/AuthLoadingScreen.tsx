import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface AuthLoadingScreenProps {
  message?: string;
  subtitle?: string;
}

export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ 
  message = "Authenticating...", 
  subtitle = "Please wait while we verify your identity"
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-sm w-full"
      >
        <div className="glass rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl">
          
          {/* Animated Background Gradients - Subtle */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

          {/* Logo or Icon */}
          <div className="mb-8 relative inline-flex items-center justify-center">
             <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
             <div className="relative bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg border border-blue-100 dark:border-blue-900/50">
               <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
             </div>
          </div>

          {/* Text */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            {message}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {subtitle}
          </p>

          {/* Progress Bar */}
          <div className="mt-8 w-full max-w-[200px] mx-auto h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
