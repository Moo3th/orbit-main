import React, { useState, useEffect, createContext, useContext, forwardRef } from 'react';

const RouterContext = createContext<{ path: string; navigate: (path: string) => void }>({
  path: '/',
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const Router = ({ children }: { children: React.ReactNode }) => {
  const [path, setPath] = useState('/');

  useEffect(() => {
    const handleHashChange = () => {
      let currentPath = window.location.hash.replace(/^#/, '');
      if (currentPath === '' || currentPath === '#') currentPath = '/';
      setPath(currentPath);
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newPath: string) => {
    window.location.hash = newPath;
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Routes = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Route = ({ path, element }: { path: string; element: React.ReactNode }) => {
  const { path: currentPath } = useRouter();
  // Support startsWith matching for paths ending with *
  if (path.endsWith('*')) {
    const prefix = path.slice(0, -1);
    if (currentPath.startsWith(prefix)) return <>{element}</>;
    return null;
  }
  if (currentPath === path) return <>{element}</>;
  return null;
};

export const Link = forwardRef<HTMLAnchorElement, { to: string; children: React.ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }>(
  ({ to, children, className, onClick, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={`#${to}`}
        className={className}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }
);
Link.displayName = "Link";

export const useLocation = () => {
  const { path } = useRouter();
  return { pathname: path };
};