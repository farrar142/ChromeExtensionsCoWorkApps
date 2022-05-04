import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
export default (props) => {
  const { todos, registerTodo, project } = props;
  const [body, setBody] = useState("");
  const [messages, setMessages] = useState([]);
  const [alMessage, setAlMessage] = useState(false);
  const [open, setOpen] = useState(true);
  const [tag, setTag] = useState({});
  return (
    <Paper sx={{ p: 2 }} label="sd">
      <Collapse in={open}>
        <Button
          sx={{ width: "100%" }}
          onClick={() => setOpen(!open)}
          variant="contained"
        >
          추가
        </Button>
      </Collapse>
      <Collapse in={!open}>
        <Box sx={{ ...flex, flexDirection: "column" }}>
          <FormControl component="form">
            <Collapse in={alMessage} onClick={() => setAlMessage(false)}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setAlMessage(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                내용을 입력해주세요!
              </Alert>
            </Collapse>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={project.tags}
              getOptionLabel={(option) => option.name}
              sx={{ width: 300 }}
              isOptionEqualToValue={() => true}
              onChange={(e, nV) => {
                setTag(nV);
              }}
              renderOption={(props, option) => {
                const onClick = props.onClick;
                delete props.onClick;
                return (
                  <Box
                    {...props}
                    data-option-index={props["data-option-index"]}
                    onClick={onClick}
                    sx={{ display: "flex", cursor: "pointer" }}
                  >
                    <Box
                      sx={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: option.code,
                        mr: 1,
                      }}
                    />
                    <Typography>{option.name}</Typography>
                  </Box>
                );
              }}
              renderInput={(params) => {
                return <TextField {...params} label="Tags" />;
              }}
            />
            <TextField
              label="내용"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              size="small"
            />

            <Box
              sx={{ ...flex, flexDirection: "row", pt: 1 }}
              onClick={() => {
                setMessages([...messages, ""]);
              }}
            >
              <AddIcon />
              <Typography>Todo 추가</Typography>
            </Box>
            <Stack>
              {messages.map((res, idx) => {
                return (
                  <TextField
                    size="small"
                    sx={{ my: 1 }}
                    key={idx}
                    label={`Todo-${idx}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setMessages([...messages, ""]);
                      } else if (e.key === "Backspace") {
                        if (res == "") {
                          setMessages(
                            messages.filter((_res, _idx) => idx !== _idx)
                          );
                        }
                      }
                    }}
                    onChange={(e) => {
                      setMessages(
                        messages.map((_res, _idx) => {
                          if (_idx != idx) {
                            return _res;
                          } else {
                            return e.target.value;
                          }
                        })
                      );
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <DeleteIcon
                            onClick={() => {
                              setMessages(messages.filter((v, i) => i != idx));
                            }}
                            edge="end"
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                );
              })}
            </Stack>
            <Button
              sx={button}
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                if (body.trim().length == 0) {
                  setAlMessage(true);
                  return;
                }
                registerTodo(e, body, messages, tag);
                setBody("");
                setMessages([]);
                setOpen(!open);
              }}
              variant="contained"
            >
              등록
            </Button>
            <Button
              sx={button}
              onClick={() => setOpen(!open)}
              variant="contained"
            >
              닫기
            </Button>
          </FormControl>
        </Box>
      </Collapse>
    </Paper>
  );
};

const flex = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const button = {
  my: 0.3,
  width: "100%",
};
