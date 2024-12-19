import { SmallIconButton } from "@fi-sci/misc";
import { Send } from "@mui/icons-material";
import { FunctionComponent, useCallback, useEffect, useMemo } from "react";

type InputBarProps = {
  width: number;
  height: number;
  onMessage: (message: string) => void;
  disabled?: boolean;
  waitingForResponse?: boolean;
  editedPromptText: string;
  setEditedPromptText: (text: string) => void;
};

const InputBar: FunctionComponent<InputBarProps> = ({
  width,
  height,
  onMessage,
  disabled,
  waitingForResponse,
  editedPromptText,
  setEditedPromptText,
}) => {
  // Detect if the device is running iOS
  const isIOS = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    if (isIOS) {
      alert("DEBUG: iOS detected");
    }
  }, [isIOS]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "NumpadEnter" || e.key === "Return") {
        // not sure about this
        if (editedPromptText.length > 1000) {
          alert("Message is too long");
          return;
        }
        onMessage(editedPromptText);
        setEditedPromptText("");
      }
    },
    [editedPromptText, onMessage, setEditedPromptText],
  );
  return (
    <div style={{ position: "absolute", width, height }}>
      <input
        value={editedPromptText}
        onChange={(e) => setEditedPromptText(e.target.value)}
        style={{ width: width - 8 - 20, height: height - 7 }}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          // Only handle blur on iOS devices for the "done" button
          if (isIOS && editedPromptText.trim() && !e.relatedTarget) {
            if (editedPromptText.length > 1000) {
              alert("Message is too long");
              return;
            }
            onMessage(editedPromptText);
            setEditedPromptText("");
          }
        }}
        placeholder={
          waitingForResponse ? "Waiting for response..." : "Type your response..."
        }
        disabled={disabled}
      />
      <span style={{ position: "relative", top: "-5px" }}>
        <SmallIconButton
          icon={<Send />}
          title="Submit"
          onClick={() => {
            if (editedPromptText.length > 5000) {
              alert("Message is too long");
              return;
            }
            onMessage(editedPromptText);
            setEditedPromptText("");
          }}
        />
      </span>
    </div>
  );
};

export default InputBar;
