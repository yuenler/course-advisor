// context/TranscriptContext.js
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const ContextProvider = ({ children }) => {
  const [transcript, setTranscript] = useState(null);
  const [courses, setCourses] = useState({});
  const [profile, setProfile] = useState({});


  return (
    <AppContext.Provider value={{
      transcript,
      setTranscript,
      courses,
      setCourses,
      profile,
      setProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};
