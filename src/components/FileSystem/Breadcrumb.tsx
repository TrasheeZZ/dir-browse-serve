import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DirectoryPath } from '@/types';

interface BreadcrumbProps {
  path: DirectoryPath[];
  onNavigate: (path: string) => void;
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 py-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('/')}
        className="h-8 px-2 text-sm hover:bg-file-hover"
      >
        <Home className="h-4 w-4 mr-1" />
        Root
      </Button>
      
      {path.map((dir, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(dir.path)}
            className="h-8 px-2 text-sm hover:bg-file-hover"
          >
            {dir.name}
          </Button>
        </div>
      ))}
    </nav>
  );
}