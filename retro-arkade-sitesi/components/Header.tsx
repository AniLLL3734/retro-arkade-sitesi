
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import { LogIn, LogOut, UserPlus, Gamepad2 } from 'lucide-react';

const Header: React.FC = () => {
  const { profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-arkade-blue" />
          <h1 className="text-3xl text-arkade-blue tracking-tighter">Retro Arkade</h1>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-arkade-orange font-semibold transition-colors">Home</Link>
          <Link to="/high-scores" className="text-gray-600 hover:text-arkade-orange font-semibold transition-colors">High Scores</Link>
          <div className="w-px h-6 bg-gray-300"></div>
          {loading ? (
             <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : profile ? (
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-arkade-purple">Welcome, {profile.username}!</span>
              <Button onClick={handleSignOut} size="sm" variant="secondary">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button size="sm" variant="primary">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="secondary">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
