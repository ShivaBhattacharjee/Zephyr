import React, { createContext, useState, useContext } from 'react';

const NicknameContext = createContext();

export const NicknameProvider = ({ children }) => {
  const [nickname, setNickname] = useState(() => {
    const storedNickname = localStorage.getItem('nickname');
    return storedNickname || '';
  });

  const setNicknameAndSave = (newNickname) => {
    setNickname(newNickname);
    localStorage.setItem('nickname', newNickname);
  };

  return (
    <NicknameContext.Provider value={{ nickname, setNickname: setNicknameAndSave }}>
      {children}
    </NicknameContext.Provider>
  );
};

export const useNickname = () => {
  const context = useContext(NicknameContext);
  if (!context) {
    throw new Error('useNickname must be used within a NicknameProvider');
  }
  return context;
};
