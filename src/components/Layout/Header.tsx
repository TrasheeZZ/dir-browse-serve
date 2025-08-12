import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Users, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">File Index</h1>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="font-medium text-foreground">{user?.username}</span>
                <span className="ml-1 px-2 py-1 text-xs bg-secondary rounded-md">
                  {user?.role}
                </span>
              </span>
              
              {user?.role === 'ADMIN' && location.pathname !== '/admin' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="text-xs"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Manage Users
                </Button>
              )}

              {location.pathname !== '/' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/')}
                  className="text-xs"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Files
                </Button>
              )}

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-xs"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </>
          )}

          {!isAuthenticated && location.pathname !== '/login' && (
            <Button 
              onClick={() => navigate('/login')}
              size="sm"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}