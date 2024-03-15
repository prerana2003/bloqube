import React, { createContext, useContext, useMemo } from 'react';
import { useMediaQuery, ThemeProvider, createTheme, useTheme } from '@mui/material';

// Create a context
const ResponsiveContext = createContext();

// Provider component
export const ResponsiveProvider = ({ children }) => {
  const theme = useTheme();
  //const isSmallScreen = useMediaQuery('(max-width:500px)');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const value = useMemo(() => ({
    isSmallScreen,
  }), [isSmallScreen]);

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};

// Custom hook to use the responsive context
 export const useResponsive = () => useContext(ResponsiveContext);

// const MyComponent = () => {
//     const { isXSmall, isSmall, isMedium, isLarge } = useResponsive();
  
//     return (
//       <div>
//         {isXSmall && <p>This is an extra small screen.</p>}
//         {isSmall && !isXSmall && <p>This is a small screen.</p>}
//         {isMedium && <p>This is a medium screen.</p>}
//         {isLarge && <p>This is a large screen.</p>}
//       </div>
//     );
//   };
