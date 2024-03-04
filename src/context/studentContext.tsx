import React, { createContext, useContext, useState } from "react";

type Semester = {
  _id: string;
  semnum: number;
};

interface ContextProps {
  studId: string;
  setStudId: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  semester: Semester;
  setSemester: React.Dispatch<React.SetStateAction<Semester>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUname: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalContext = createContext<ContextProps>({
  studId: "",
  setStudId: () => {},
  name: "",
  setName: () => {},
  semester: { _id: "", semnum: 0 },
  setSemester: () => {},
  email: "",
  setEmail: () => {},
  username: "",
  setUname: () => {},
});

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [studId, setStudId] = useState<string>("");
  const [name, setName] = useState<string>("");

  return (
    <GlobalContext.Provider
      value={{
        studId,
        setStudId,
        name,
        setName,
        semester: { _id: "", semnum: 0 },
        setSemester: () => {},
        email: "",
        setEmail: () => {},
        username: "",
        setUname: () => {},
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): ContextProps => useContext(GlobalContext);

export default GlobalContextProvider;
