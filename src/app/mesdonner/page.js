// pages/index.js
"use client";
import { useState } from "react";
import CoursListPage from "../../components/CoursListPage";
import ClassePage from "../../components/ClassePage";
import Presence from "../../components/Presence";
import CoursInfo from "../../components/CoursInfo";

const Page = () => {
  const [activeComponent, setActiveComponent] = useState("liste");
  const [param, setParam] = useState(null);

  const handleButtonClick = (component, param = null) => {
    setActiveComponent(component);
    setParam(param);
  };

  return (
    <div>
      <h1>Page Principale</h1>
      {activeComponent === "cours" && (
        <CoursListPage
          onButtonClick={(param) => handleButtonClick("info", param)}
          param={param}
        />
      )}
      {activeComponent === "liste" && (
        <ClassePage
          onButtonClick={(param) => handleButtonClick("cours", param)}
          param={param}
        />
      )}
      {activeComponent === "info" && (
        <CoursInfo
          onButtonClick={(param) => handleButtonClick("presences", param)}
          param={param}
        />
      )}
      {activeComponent === "presences" && (
        <Presence
          onButtonClick={(param) => handleButtonClick("info", param)}
          parametre={parametre}
        />
      )}
    </div>
  );
};

export default Page;
