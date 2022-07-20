import { Button, Div, FormItem, Input } from "@vkontakte/vkui";
import React, { useState } from "react";

// Отдаём в функцию send значения из инпута
function MessageInput({ send }) {
  const [value, setValue] = useState("");
  const divStyle = {
    position: "absolute",
    bottom: "0",
  };

  return (
    <Div style={divStyle}>
      <FormItem>
        <Input
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type ur message..."
          type="text"
          value={value}
        />
        <Button
          type="submit"
          onClick={() => {
            send(value);
            setValue("");
          }}
        >
          Send Message
        </Button>
      </FormItem>
    </Div>
  );
}

export default MessageInput;
