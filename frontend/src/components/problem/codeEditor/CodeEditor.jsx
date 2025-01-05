import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/worker-javascript";
import "ace-builds/webpack-resolver";
import "./codeEditor.css";

const CodeEditor = ({
  language,
  handleLanguageSelect,
  darkMode,
  handleModeChange,
  onCodeChange,
  submit,
  // run,
  runLoading,
  submitLoading,
}) => {
  const [code, setCode] = useState("")
  const languageList = ["Javascript", "Java", "Python"];

  const codeTemplates = {
    Javascript: `exports.solution = function() {
    
};`,
    Python: `def solution():
    pass`,
    Java: `public class Solution {
    public static void solution() {
        
    }
}`
  };

  useEffect(() => {
    setCode(codeTemplates[language] || "");
  }, [language]);

  const handleThemeChange = (e) => {
    handleModeChange(e.target.checked);
  };

  const getLanguage = () => {
    switch (language) {
      case "Javascript":
        return "javascript";
      case "Java":
        return "java";
      case "Python":
        return "python";
      default:
        return "javascript";
    }
  };

  return (
    <div>
      <div className="code-editor-controls">
        <div className="code-editor-language-wrapper">
          <FormControl
            variant="outlined"
            sx={{
              m: 0,
              minWidth: 150,
              "& fieldset": {
                borderWidth: "2px",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#445E93",
                },
              },
              "& .MuiSelect-select": {
                fontSize: "16px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "16px",
              },
            }}
          >
            <InputLabel htmlFor="outlined-age-native-simple">
              Language
            </InputLabel>
            <Select
              native
              value={language}
              onChange={handleLanguageSelect}
              label="Language"
              inputProps={{
                name: "age",
                id: "outlined-age-native-simple",
              }}
            >
              {languageList.map((curLanguage, i) => (
                <option value={curLanguage} key={i}>
                  {curLanguage}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>

        <div
          className="code-editor-theme"
          data-theme={darkMode ? "dark" : "light"}
        >
          <Chip
            label={darkMode === false ? "Light Mode" : "Dark Mode"}
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: darkMode ? "#6B7280" : "#445E93",
            }}
          />
          <Switch
            checked={darkMode}
            onChange={handleThemeChange}
            name="darkMode"
            className="MUI switch"
            inputProps={{ "aria-label": "secondary checkbox" }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#6B7280",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#6B7280",
              },
              "& .MuiSwitch-switchBase": {
                color: "#445e93",
              },
              "& .MuiSwitch-track": {
                backgroundColor: "#445e93",
              },
            }}
          />
        </div>
      </div>

      <div className="code-editor-wrapper">
        <AceEditor
          mode={getLanguage()}
          value={code}
          // defaultValue={getDefaultCode()}
          theme={darkMode === true ? "dracula" : "eclipse"}
          // onChange={onCodeChange}
          onChange={(newValue) => {
            setCode(newValue);
            onCodeChange(newValue);
          }}
          name="UNIQUE_ID_OF_DIV"
          fontSize={14}
          width="100%"
          height="500px"
          highlightActiveLine={true}
          showGutter={true}
          wrapEnabled={true}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
          }}
          style={{
            borderRadius: "4px",
            overflow: "hidden",
          }}
        />
      </div>

      <div className="code-editor-btn">
        {/* <div className="code-editor-runcode-btn">
          <Button
            variant="contained"
            color="primary"
            value="runcode"
            onClick={run}
            sx={{
              width: "120px",
              fontSize: "16px",
              fontWeight: 600,
            }}
            disabled={runLoading || submitLoading}
          >
            {runLoading === true ? (
              <CircularProgress size={25} sx={{ color: "white" }} />
            ) : (
              <span>
                <PlayCircleOutlineIcon sx={{ mr: 1 }} />
                Run
              </span>
            )}
          </Button>
        </div> */}

        <div className="code-editor-submit-btn">
          <Button
            variant="contained"
            color="primary"
            value="submit"
            onClick={submit}
            sx={{
              width: "150px",
              fontSize: "16px",
              fontWeight: 600,
            }}
            disabled={runLoading || submitLoading}
          >
            {submitLoading === true ? (
              <CircularProgress size={25} sx={{ color: "white" }} />
            ) : (
              <span>
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  style={{ marginRight: "10px" }}
                />
                Submit
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
