import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import uuid from "react-uuid";
import {
  Panel,
  Header,
  Group,
  Cell,
  Avatar,
  Div,
} from "@vkontakte/vkui";
import MessageInput from "./MessageInput";

const Home = ({ fetchedUser }) => {
  const [socket, setSocket] = useState();
  const [messages, setMessages] = useState([]);
  function getTime() {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    return hours + ":" + minutes;
  }
  const messageBlock = {
    overflowY: "scroll",
    height: "250px",
  };

  // Подключаемся к локальному серверу
  useEffect(() => {
    const newSocket = io("http://localhost:8001");
    setSocket(newSocket);
  }, [setSocket]);

  const send = (value) => {
    if (value !== "") {
      socket?.emit(
        "message",
        (value = {
          author: `${fetchedUser.first_name} ${fetchedUser.last_name}`,
          authorPhoto: fetchedUser.photo_200,
          message: value,
          sendTime: getTime(),
        })
      );
    }
  };

  const messageListener = (message) => {
    setMessages([...messages, message]);
  };

  useEffect(() => {
    socket?.on("message", messageListener);
    return () => {
      socket?.off("message", messageListener);
    };
  }, [messageListener]);

  // Функиця для рендера массива с данных, которые мы получили с сервера
  const userMessageRender = messages.map(function ({
    authorPhoto,
    message,
    author,
    sendTime,
  }) {
    return (
      <Div key={uuid()}>
        <Group>
          <Cell
            before={<Avatar src={authorPhoto} />}
            indicator={sendTime}
            description={message}
          >
            {author}
          </Cell>
        </Group>
      </Div>
    );
  });

  // Поповоду пользователей онлайн. Я старался реализовать эту фичу разными способами, но никак не получалось.
  // Как вариант решения задачи: поссылать запрос на сервер, как только мы получаем данные о новом пользователе
  // создавать БД с данными о пользователе, после получать длинну массива с БД. И выводить в верстку.
  // Но также нужно и удалять пользователей, которые покинули страницу и поссылать запрос к БД, на удаленние данного юзера.
  // Я уверен, что есть более правдоподобное решение данной проблемы в документации, но я не нашёл.

  // upd: Получилось реализовать количество подключенных пользователей к серверу. В консоль выводятся логи всякий раз, когда устанавливается или разрывается соединение с сервером.

  // В компонент MessageInput прокидываем send, дабы получить сообщение пользователя из инпута
  return (
    <Panel>
      <Group header={<Header mode="secondary" />}>
        <Div style={messageBlock}>
          <ul>{userMessageRender}</ul>
        </Div>
        <MessageInput send={send} />
      </Group>
    </Panel>
  );
};

export default Home;
