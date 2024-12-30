import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import AceEditor from "react-ace";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
// import { makeStyles } from "@material-ui/core/styles";
import Switch from "@mui/material/Switch";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import "./codeEditor.css";

import * as ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-eclipse";
ace.config.set("basePath", "/ace-builds/src-noconflict");

// const useStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 200,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
// }));

const CodeEditor = ({
  language,
  handleLanguageSelect,
  darkMode,
  handleModeChange,
  onCodeChange,
  submit,
  runLoading,
  submitLoading,
}) => {
  //   const classes = useStyles();

  const languageList = ["Javascript", "C++", "Java", "Python"];

  const handleThemeChange = (e) => {
    handleModeChange(e.target.checked);
  };

  const getLanguage = () => {
    return language === "C" || language === "C++"
      ? "c_cpp"
      : language === "Java"
      ? "java"
      : "python";
  };

  const getLabel = () => {
    return (darkMode === false ? "Dark" : "Light") + " Mode";
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
                color: "#6B7280", // 開啟時按鈕的顏色
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#6B7280", // 開啟時軌道的顏色
              },
              "& .MuiSwitch-switchBase": {
                color: "#445e93", // 未開啟時按鈕的顏色
              },
              "& .MuiSwitch-track": {
                backgroundColor: "#445e93", // 未開啟時軌道的顏色
              },
            }}
          />
        </div>
      </div>

      <div className="code-editor-wrapper">
        <AceEditor
          mode={getLanguage()}
          theme={darkMode === true ? "dracula" : "eclipse"}
          onChange={onCodeChange}
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
            borderRadius: "4px", // 設置圓角
            overflow: "hidden", // 避免內容溢出圓角
          }}
        />
      </div>

      <div className="code-editor-btn">
        {/* Run Button */}
        <div className="code-editor-runcode-btn">
          <Button
            variant="contained"
            color="primary"
            value="runcode"
            onClick={submit}
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
        </div>

        {/* Submit Button */}
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
