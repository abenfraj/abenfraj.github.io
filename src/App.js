import "./App.css";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import { Container, Box, Tabs, Tab, Button, IconButton } from "@mui/material";
import { Footer } from "./components/footer/Footer";
import CloseIcon from "@mui/icons-material/Close";

const App = () => {
  const [tabs, setTabs] = useState([{ id: 1, label: "Tab 1" }]);
  const [currentTab, setCurrentTab] = useState(0);
  const [nextTabId, setNextTabId] = useState(2); // Keep track of the next tab ID
  const [availableIds, setAvailableIds] = useState([]); // Track available IDs
  const navigate = useNavigate();

  const getNextTabId = () => {
    if (availableIds.length > 0) {
      return availableIds.shift();
    }
    const newId = nextTabId;
    setNextTabId(newId + 1); // Increment nextTabId for the next new tab
    return newId;
  };

  const handleAddTab = () => {
    const newId = getNextTabId();
    setTabs([...tabs, { id: newId, label: `Tab ${newId}` }]);
    setCurrentTab(tabs.length);
    navigate(`/tab/${newId}`);
  };

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(`/tab/${tabs[newValue].id}`);
  };

  const handleCloseTab = (event, index) => {
    event.stopPropagation();
    const tabId = tabs[index].id;
    // Remove the state associated with this tab from sessionStorage
    sessionStorage.removeItem(`homeState-${tabId}`);
    setAvailableIds([...availableIds, tabId].sort((a, b) => a - b)); // Add closed tab ID to available IDs and sort
    const newTabs = tabs.filter((tab, i) => i !== index);
    setTabs(newTabs);
    if (index === currentTab) {
      const newCurrentTab = Math.max(index - 1, 0);
      setCurrentTab(newCurrentTab);
      navigate(newTabs.length ? `/tab/${newTabs[newCurrentTab].id}` : "/");
    } else if (index < currentTab) {
      setCurrentTab(currentTab - 1);
    }
  };

  return (
    <>
      <Navbar />
      <Container
        maxWidth="false"
        sx={{ paddingTop: "9rem", height: "90vh", width: "100%", margin: 0 }}
      >
        <Box sx={{ px: 10, pb: 2 }}>
          <Tabs value={currentTab} onChange={handleChange}>
            {tabs.map((tab, index) => (
              <Tab
                key={tab.id}
                label={
                  <span>
                    {tab.label}
                    <IconButton
                      size="small"
                      onClick={(event) => handleCloseTab(event, index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </span>
                }
              />
            ))}
            <Button onClick={handleAddTab}>Add Tab</Button>
          </Tabs>
        </Box>
        <Routes>
          {tabs.map((tab) => (
            <Route
              key={tab.id}
              path={`/tab/${tab.id}`}
              element={<Home tabId={tab.id} />}
            />
          ))}
          <Route path="/" element={<Home tabId={1} />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
